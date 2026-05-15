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

// Configuration
const CONFIG_PATH = './config.json';
const CONTENT_DIR = './contents';
const TEMPLATES_DIR = './templates';
const ASSETS_DIR = './assets';
const OUTPUT_DIR = './dist';

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
function getMarkdownFiles() {
  const files = fs.readdirSync(CONTENT_DIR);
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
  const imagesDir = path.join(CONTENT_DIR, 'images');
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
    
    // Register partials
    console.log('🎨 Registering templates...');
    registerPartials();
    registerHelpers();
    console.log('✓ Templates registered');
    
    // Get markdown files
    console.log('\n📝 Processing content...');
    const mdFiles = getMarkdownFiles();
    console.log(`✓ Found ${mdFiles.length} post(s)`);
    
    // Process each markdown file
    mdFiles.forEach(file => {
      const filepath = path.join(CONTENT_DIR, file);
      const { metadata, html } = parseMarkdownFile(filepath);
      
      // Generate output path
      const slug = metadata.slug || file.replace('.md', '');
      const outputPath = path.join(OUTPUT_DIR, 'blog', slug, 'index.html');
      ensureDir(path.dirname(outputPath));
      
      // Load and compile template
      const layoutName = metadata.layout || 'post';
      const layoutPath = path.join(TEMPLATES_DIR, 'layouts', `${layoutName}.hbs`);
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
      const template = handlebars.compile(layoutContent);
      
      // Render
      const output = template({
        ...config,
        ...metadata,
        content: html,
        path: `/blog/${slug}/`,
        currentYear: new Date().getFullYear()
      });
      
      // Write file
      fs.writeFileSync(outputPath, output);
      console.log(`  ✓ ${file} → /blog/${slug}/`);
    });
    
    // Copy assets
    console.log();
    copyAssets();
    
    console.log(`\n✨ Build complete! Output in ${OUTPUT_DIR}/`);
    console.log('\nNext steps:');
    console.log('  • Review: open dist/blog/*/index.html in browser');
    console.log('  • Deploy: git push to Cloudflare Pages');
    console.log('  • Test: npm run serve\n');
    
  } catch (error) {
    console.error('\n❌ Build failed:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run build
build();
