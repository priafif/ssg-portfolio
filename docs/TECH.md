# Technical Architecture Document (TECH.md)
## SSG Portfolio - Implementation Guide

**Version:** 1.0  
**Date:** May 15, 2026

---

## 1. Overview

SSG Portfolio is a lightweight, JavaScript-based static site generator. This document details the technical architecture, implementation approach, and development workflow.

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Language** | JavaScript (Node.js) | Core runtime |
| **Package Manager** | NPM | Dependency management |
| **Build System** | NPM scripts | Task automation |
| **Markdown Parser** | `marked` or `gray-matter` | Parse MD + front matter |
| **Templating** | Handlebars | Generate HTML with partials |
| **File Operations** | Node.js `fs` | File I/O |
| **Asset Handling** | Native copy/symlink | CSS, JS, images |
| **Deployment** | Cloudflare Pages | Git-based CI/CD |
| **Dev Tools** | TBD (nodemon, prettier) | Development workflow |

---

## 3. Core Architecture

### 3.1 Build Pipeline

```
┌─────────────────────────────────────────────────────────┐
│                   npm run build                         │
└─────────────────┬───────────────────────────────────────┘
                  │
        ┌─────────▼──────────┐
        │  1. Read Config    │
        │  (config.json)     │
        └─────────┬──────────┘
                  │
        ┌─────────▼──────────┐
        │  2. Scan Content   │
        │  (contents/*.md)   │
        └─────────┬──────────┘
                  │
        ┌─────────▼──────────┐
        │  3. Parse Markdown │
        │  + Front Matter    │
        └─────────┬──────────┘
                  │
        ┌─────────▼──────────┐
        │  4. Apply Template │
        │  (Handlebars)      │
        └─────────┬──────────┘
                  │
        ┌─────────▼──────────┐
        │  5. Copy Assets    │
        │  (images, CSS, JS) │
        └─────────┬──────────┘
                  │
        ┌─────────▼──────────┐
        │  6. Output to /dist│
        │  Ready to deploy   │
        └────────────────────┘
```

### 3.2 File Processing Flow

**Step 1: Read Configuration**
```javascript
// Load config.json for site metadata
const config = require('./config.json');
// Returns: { title, author, url, theme, etc. }
```

**Step 2: Scan Content Directory**
```javascript
// Find all .md files in /contents/
const files = fs.readdirSync('./contents/');
// Returns: ['post1.md', 'post2.md', ...]
```

**Step 3: Parse Front Matter + Markdown**
```javascript
// Each file has:
// - YAML front matter (metadata)
// - Markdown content
const frontMatter = require('gray-matter')(fileContent);
// Returns: { data: {...metadata}, content: "markdown here" }

// Convert markdown to HTML
const html = marked(frontMatter.content);
```

**Step 4: Apply Handlebars Template**
```javascript
// Render HTML with template and context
const template = handlebars.compile(layoutTemplate);
const output = template({
  title: frontMatter.data.title,
  content: html,
  date: frontMatter.data.date,
  author: frontMatter.data.author,
  tags: frontMatter.data.tags
});
```

**Step 5: Copy Static Assets**
```javascript
// Copy images from /contents/images/ → /dist/images/
// Copy CSS/JS from /assets/ → /dist/assets/
```

**Step 6: Write to Output**
```javascript
// Write final HTML to /dist/blog/post-slug.html
// or /dist/index.html for homepage
```

---

## 4. Key Implementation Details

### 4.1 Front Matter Format

Every markdown file begins with YAML front matter:

```yaml
---
title: My Blog Post
date: 2026-05-15
author: John Doe
tags: [javascript, ssg, tutorial]
description: A complete guide to building SSGs
slug: my-blog-post
layout: post
---

# My Blog Post

Content starts here...
```

**Extracted fields used by build system:**
- `title` - Page title
- `date` - Publication date (used for sorting)
- `author` - Content creator
- `tags` - Category/filtering
- `description` - Meta description/preview
- `slug` - URL slug (auto-generated if omitted)
- `layout` - Template to use (default: `post`)

### 4.2 Template Structure

**Handlebars partials organization:**

```
templates/
├── layouts/
│   ├── post.hbs        # Single blog post layout
│   ├── archive.hbs     # Blog archive page
│   └── index.hbs       # Homepage
├── partials/
│   ├── header.hbs      # Site header/nav
│   ├── footer.hbs      # Site footer
│   ├── post-card.hbs   # Blog post preview card
│   └── tag-list.hbs    # Tags display
└── pages/
    └── about.hbs       # Static pages
```

**Template variables available:**

```handlebars
{{title}}           - Page title
{{content}}         - Rendered HTML content
{{date}}            - Publication date
{{author}}          - Author name
{{tags}}            - Array of tags
{{url}}             - Site URL from config
{{siteTitle}}       - Site name from config
{{siteDomain}}      - Domain from config
```

### 4.3 Build Script Structure

```javascript
// build.js - main build entry point
const fs = require('fs');
const path = require('path');
const marked = require('marked');
const handlebars = require('handlebars');
const frontMatter = require('gray-matter');

async function build() {
  // 1. Clean /dist/ folder
  // 2. Load config.json
  // 3. Register Handlebars partials
  // 4. Process each markdown file
  // 5. Copy assets
  // 6. Generate index/archive pages
  // 7. Done
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
```

### 4.4 Configuration File (config.json)

```json
{
  "title": "My Portfolio",
  "author": "Your Name",
  "description": "Personal portfolio and blog",
  "url": "https://myportfolio.com",
  "domain": "myportfolio.com",
  "language": "en",
  "postsPerPage": 10,
  "theme": "default",
  "social": {
    "twitter": "handle",
    "github": "username",
    "linkedin": "profile"
  }
}
```

### 4.5 URL Structure

Content to URL mapping:

```
contents/post1.md              → dist/blog/post1/index.html  → /blog/post1/
contents/about.md              → dist/about/index.html       → /about/
contents/images/blog/img.png   → dist/images/blog/img.png    → /images/blog/img.png
```

**Benefits:**
- Clean URLs without `.html` extensions
- Logical hierarchy
- Works with Cloudflare Pages

---

## 5. NPM Scripts & Build Commands

```json
{
  "scripts": {
    "build": "node build.js",
    "dev": "nodemon --exec 'npm run build' --watch contents --watch templates --watch assets",
    "serve": "cd dist && http-server -p 8000",
    "start": "npm run dev & npm run serve",
    "clean": "rm -rf dist"
  }
}
```

**Usage:**
- `npm run build` - Full build to `/dist/`
- `npm run dev` - Watch mode (rebuild on file changes)
- `npm start` - Development (watch + local server)
- `npm run clean` - Clean build artifacts

---

## 6. Dependencies

### Production
```json
{
  "marked": "^9.0.0",           // Markdown to HTML
  "gray-matter": "^4.0.0",      // YAML front matter parser
  "handlebars": "^4.7.0"        // Template engine
}
```

### Development
```json
{
  "nodemon": "^3.0.0",          // Auto-rebuild on file changes
  "prettier": "^3.0.0",         // Code formatting
  "http-server": "^14.0.0"      // Simple HTTP server
}
```

---

## 7. File Workflow Example

### Input: contents/hello-world.md
```yaml
---
title: Hello World
date: 2026-05-15
author: Jane Doe
tags: [first-post, welcome]
description: My first blog post
---

# Hello World

Welcome to my blog!
```

### Processing:
1. Parse YAML → `{ title: "Hello World", date: "2026-05-15", ... }`
2. Convert markdown → `<h1>Hello World</h1><p>Welcome...</p>`
3. Apply template with context
4. Generate URL: `/blog/hello-world/`

### Output: dist/blog/hello-world/index.html
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Hello World - My Portfolio</title>
    <meta name="description" content="My first blog post">
  </head>
  <body>
    <header><!-- nav partial --></header>
    <main>
      <article>
        <h1>Hello World</h1>
        <p class="meta">By Jane Doe on May 15, 2026</p>
        <p>Welcome to my blog!</p>
      </article>
    </main>
    <footer><!-- footer partial --></footer>
  </body>
</html>
```

---

## 8. Asset Handling

### Images
```
Source: contents/images/blog/feature.png
Copy to: dist/images/blog/feature.png
Reference in markdown: ![alt](./images/blog/feature.png)
```

### CSS
```
Source: assets/css/style.css
Copy to: dist/css/style.css
Reference in template: <link rel="stylesheet" href="/css/style.css">
```

### JavaScript
```
Source: assets/js/main.js
Copy to: dist/js/main.js
Reference in template: <script src="/js/main.js"></script>
```

---

## 9. Deployment to Cloudflare Pages

### Git Integration
1. Push code to GitHub/GitLab
2. Cloudflare Pages detects push
3. Auto-runs build command: `npm run build`
4. Deploys output from `/dist/` folder
5. Live site updated automatically

### Configuration (wrangler.toml)
```toml
[env.production]
name = "ssg-portfolio"
build = { command = "npm run build" }
main = "dist"
```

---

## 10. Development Workflow

### Local Setup
```bash
# Clone repo
git clone <repo>

# Install dependencies
npm install

# Start development server
npm start

# Open browser to http://localhost:8000
```

### Create New Post
```bash
# Create file
# contents/my-new-post.md

---
title: My New Post
date: 2026-05-16
author: You
tags: [tag1, tag2]
description: Post description
---

# Content here
```

**Rebuild happens automatically (nodemon watches files)**

### Add Template Update
1. Edit `templates/partials/header.hbs`
2. Save file
3. Build automatically re-runs
4. Refresh browser to see changes

---

## 11. Performance Considerations

- **Minimal dependencies**: Only essential packages
- **Zero runtime overhead**: Everything pre-generated
- **Small HTML output**: No bloat from templating
- **Image optimization**: Consider adding image compression (future)
- **CSS/JS**: Minification recommended (future enhancement)

---

## 12. Future Enhancements

- [ ] Image auto-compression during build
- [ ] CSS/JS minification
- [ ] RSS feed generation
- [ ] Sitemap generation
- [ ] Search index (JSON)
- [ ] Theme system with swappable templates
- [ ] Incremental builds (only changed files)
- [ ] Plugin system for extensibility

---

## 13. Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails to parse markdown | Check YAML front matter syntax |
| Template errors | Verify Handlebars partial names match |
| Images not showing | Verify paths in markdown, check `/dist/images/` exists |
| Cloudflare build fails | Ensure package.json build script runs without errors |

---

## 14. References

- [Marked.js documentation](https://marked.js.org/)
- [Gray-matter documentation](https://github.com/jonschlinkert/gray-matter)
- [Handlebars documentation](https://handlebarsjs.com/)
- [Cloudflare Pages guide](https://pages.cloudflare.com/)
