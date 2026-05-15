/**
 * SSG Portfolio Build Script
 * Main entry point for building the static site
 * 
 * Process:
 * 1. Load configuration
 * 2. Scan content directory
 * 3. Parse markdown + front matter
 * 4. Apply Handlebars templates
 * 5. Copy static assets
 * 6. Output to /dist/
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const frontMatter = require('gray-matter');
const handlebars = require('handlebars');
const rimraf = require('rimraf');

// Configuration
const CONFIG_PATH = './config.json';
const CONTENT_DIR = './contents';
const TEMPLATES_DIR = './templates';
const ASSETS_DIR = './assets';
const OUTPUT_DIR = './dist';
const PAGES_DIR = './contents/pages';
const POSTS_DIR = './contents/posts';

/**
 * Load site configuration
 */
function loadConfig() {
  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    return config;
  } catch (error) {
    console.error(`Error loading config: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Register Handlebars partials
 */
function registerPartials() {
  const partialsDir = path.join(TEMPLATES_DIR, 'partials');
  const partials = fs.readdirSync(partialsDir);
  
  partials.forEach(file => {
    if (file.endsWith('.hbs')) {
      const name = file.replace('.hbs', '');
      const content = fs.readFileSync(path.join(partialsDir, file), 'utf-8');
      handlebars.registerPartial(name, content);
    }
  });
}

/**
 * Register Handlebars helpers
 */
function registerHelpers() {
  // Format date helper
  handlebars.registerHelper('formatDate', function(date) {
    if (!date) return '';
    const d = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString('en-US', options);
  });
}

/**
 * Get all markdown files
 */
function getMarkdownFiles(dir) {
  const files = fs.readdirSync(dir);
  return files.filter(f => f.endsWith('.md'));
}

/**
 * Parse a markdown file
 */
function parseMarkdownFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const { data, content: markdown } = frontMatter(content);
  
  // Convert markdown to HTML
  const html = marked(markdown);
  
  return {
    metadata: data,
    html: html
  };
}

/**
 * Ensure directory exists
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Copy assets to output
 */
function copyAssets() {
  console.log('📦 Copying assets...');
  
  // Copy CSS
  const cssDir = path.join(ASSETS_DIR, 'css');
  if (fs.existsSync(cssDir)) {
    const files = fs.readdirSync(cssDir);
    ensureDir(path.join(OUTPUT_DIR, 'css'));
    files.forEach(file => {
      fs.copyFileSync(
        path.join(cssDir, file),
        path.join(OUTPUT_DIR, 'css', file)
      );
    });
  }
  
  // Copy JS
  const jsDir = path.join(ASSETS_DIR, 'js');
  if (fs.existsSync(jsDir)) {
    const files = fs.readdirSync(jsDir);
    ensureDir(path.join(OUTPUT_DIR, 'js'));
    files.forEach(file => {
      fs.copyFileSync(
        path.join(jsDir, file),
        path.join(OUTPUT_DIR, 'js', file)
      );
    });
  }
  
  // Copy images
  const imagesDir = path.join(process.cwd(), 'assets', 'images'); // Corrected path for images
  if (fs.existsSync(imagesDir)) {
    // Recursive copy
    const copy = (src, dest) => {
      if (fs.statSync(src).isDirectory()) {
        ensureDir(dest);
        fs.readdirSync(src).forEach(file => {
          copy(path.join(src, file), path.join(dest, file));
        });
      } else {
        fs.copyFileSync(src, dest);
      }
    };
    copy(imagesDir, path.join(OUTPUT_DIR, 'images'));
  }
  
  console.log('✓ Assets copied');
}

/**
 * Build the site
 */
async function build() {
  console.log('🚀 Building SSG Portfolio...\n');
  
  try {
    // Load config
    console.log('📋 Loading configuration...');
    const config = loadConfig();
    console.log(`✓ Site: ${config.title}`);
    
    // Setup output directory
    console.log('📂 Setting up output directory...');
    ensureDir(OUTPUT_DIR);
    console.log(`✓ Output: ${OUTPUT_DIR}/`);
    
    // Register partials and helpers
    console.log('🎨 Registering templates...');
    registerPartials();
    registerHelpers();
    console.log('✓ Templates registered');
    
    // Process pages
    console.log('\n📄 Processing pages...');
    const pageFiles = getMarkdownFiles(PAGES_DIR);
    pageFiles.forEach(file => {
      const filepath = path.join(PAGES_DIR, file);
      const { metadata, html } = parseMarkdownFile(filepath);
      
      const slug = metadata.slug || file.replace('.md', '');
      const outputPath = path.join(OUTPUT_DIR, `${slug}.html`);
      ensureDir(path.dirname(outputPath));
      
      const layoutName = metadata.layout || 'index'; // Default to 'index.hbs' for pages
      const layoutPath = path.join(TEMPLATES_DIR, 'layouts', `${layoutName}.hbs`);
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
      const template = handlebars.compile(layoutContent);
      
      const output = template({
        ...config,
        metadata,
        content: html
      });
      fs.writeFileSync(outputPath, output);
      console.log(`  ✓ Generated page: ${slug}.html`);
    });

    // Process posts
    console.log('\n📝 Processing posts...');
    const postFiles = getMarkdownFiles(POSTS_DIR);
    postFiles.forEach(file => {
      const filepath = path.join(POSTS_DIR, file);
      const { metadata, html } = parseMarkdownFile(filepath);
      
      const slug = metadata.slug || file.replace('.md', '');
      const outputPath = path.join(OUTPUT_DIR, 'blog', slug, 'index.html');
      ensureDir(path.dirname(outputPath));
      
      const layoutName = metadata.layout || 'post'; // Default to 'post.hbs' for posts
      const layoutPath = path.join(TEMPLATES_DIR, 'layouts', `${layoutName}.hbs`);
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
      const template = handlebars.compile(layoutContent);
      
      const output = template({
        ...config,
        metadata,
        content: html
      });
      fs.writeFileSync(outputPath, output);
      console.log(`  ✓ Generated post: blog/${slug}/index.html`);
    });

    // Copy assets
    copyAssets();
    
    console.log('\n🎉 Site built successfully!');
  } catch (error) {
    console.error(`Fatal error during build: ${error.message}`);
    process.exit(1);
  }
}

// Run the build process
build();
