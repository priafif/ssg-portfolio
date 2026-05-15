# SSG Portfolio 🚀

A lightweight, JavaScript-based **static site generator** for creating fast, SEO-friendly portfolio and blog websites. Write in markdown, deploy to Cloudflare Pages.

## ✨ Features

- **Markdown-based content** - Write blog posts in simple markdown
- **YAML front matter** - Add metadata (title, date, tags, description) to posts
- **Handlebars templating** - Reusable components and templates
- **Zero dependencies bloat** - Only essential packages
- **Fast builds** - Pure static generation
- **Mobile-responsive** - Built-in responsive design
- **Cloudflare Pages** - Automatic deployment on Git push
- **SEO-friendly** - Meta tags, sitemap, structured data ready

## 📁 Project Structure

```
ssg-portfolio/
├── contents/              # Blog posts and articles (markdown)
│   ├── demo.md            # Example post with front matter
│   └── images/            # Post images (optional nested folders)
├── templates/             # Handlebars templates
│   ├── layouts/           # Page layouts (post.hbs, archive.hbs, etc.)
│   ├── partials/          # Reusable components (header, footer, etc.)
│   └── pages/             # Static pages
├── assets/                # Static assets
│   ├── css/               # Stylesheets
│   └── js/                # Client-side scripts
├── docs/                  # Development documentation
│   ├── PRD.md             # Product Requirements
│   └── TECH.md            # Technical Architecture
├── dist/                  # Build output (generated)
├── config.json            # Site configuration
├── package.json           # NPM dependencies and scripts
└── .gitignore             # Git ignore rules
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Your Site

Edit `config.json`:

```json
{
  "title": "My Portfolio",
  "author": "Your Name",
  "description": "Your portfolio description",
  "url": "https://yoursite.com",
  "social": {
    "github": "your_username",
    "twitter": "your_handle"
  }
}
```

### 3. Create Your First Post

Create `contents/first-post.md`:

```markdown
---
title: My First Post
date: 2026-05-15
author: Your Name
tags: [welcome, first-post]
description: This is my first blog post
---

# My First Post

Write your content here! You can use:
- **Bold** and *italic*
- [Links](https://example.com)
- `code` and code blocks
- Images: ![alt](./images/photo.png)
```

### 4. Build Your Site

```bash
# Build once
npm run build

# Or watch for changes and rebuild automatically
npm run dev
```

### 5. Preview Locally

```bash
npm start
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

## 📝 Writing Content

### Front Matter Format

Every post begins with YAML front matter:

```yaml
---
title: Article Title              # Required: Page title
date: 2026-05-15                 # Required: Publication date (YYYY-MM-DD)
author: Your Name                # Optional: Author name
tags: [tag1, tag2, tag3]         # Optional: Array of tags
description: Short description   # Optional: Meta description
slug: custom-url-slug            # Optional: URL slug (auto-generated if omitted)
layout: post                      # Optional: Template to use (default: post)
---
```

### Markdown Features

Full markdown support including:

```markdown
# Headings

**Bold** and *italic* text

- Bullet lists
  - Nested items

1. Numbered lists
2. With multiple items

> Blockquotes

[Links](https://example.com)

![Images](./images/photo.png)

`inline code`

```javascript
// Code blocks with syntax highlighting
const hello = () => {
  console.log('Hello, World!');
};
```
```

### Adding Images

1. Place images in `contents/images/`
2. Reference in markdown: `![alt text](./images/my-image.png)`
3. Build process automatically copies to `dist/images/`

## 🎨 Customizing Templates

### Template System

Handlebars-based templates with partials:

**Layouts** (`templates/layouts/`)
- `post.hbs` - Single blog post layout
- `archive.hbs` - Blog archive page
- `index.hbs` - Homepage

**Partials** (`templates/partials/`)
- `header.hbs` - Site navigation
- `footer.hbs` - Footer with links
- Any reusable component

### Available Template Variables

```handlebars
{{title}}           - Page title
{{content}}         - Rendered HTML content
{{date}}            - Publication date
{{author}}          - Author name
{{tags}}            - Array of tags
{{siteTitle}}       - Site name from config
{{description}}     - Site/post description
{{url}}             - Site URL from config
{{social}}          - Social links from config
```

### Using Partials

```handlebars
{{> header}}        - Include header partial
{{> footer}}        - Include footer partial
```

### Conditional Content

```handlebars
{{#if tags}}
  <div class="tags">
    {{#each tags}}
      <span>{{this}}</span>
    {{/each}}
  </div>
{{/if}}
```

## 📦 NPM Scripts

```bash
npm run build        # Build site to /dist/
npm run dev          # Watch mode (rebuild on file changes)
npm run serve        # Start local HTTP server
npm start            # Watch + serve combined
npm run clean        # Delete /dist/ folder
```

## 🌐 Deployment to Cloudflare Pages

### Setup

1. Push to GitHub/GitLab
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Connect your repository
4. Set build command: `npm run build`
5. Set output folder: `dist`
6. Deploy!

### Automatic Deployment

Every time you push to your repository, Cloudflare Pages automatically:
1. Runs `npm run build`
2. Deploys the `/dist/` folder
3. Updates your live site

## 📚 Documentation

- **[PRD.md](docs/PRD.md)** - Product vision and requirements
- **[TECH.md](docs/TECH.md)** - Detailed technical architecture and implementation

## 🛠 Development

### Adding New Features

1. Edit `build.js` for build logic
2. Add templates in `templates/`
3. Add styles in `assets/css/`
4. Test with `npm run dev`

### File Processing Flow

```
Markdown Files → Parse Front Matter → Convert to HTML
    ↓
Apply Handlebars Template → Copy Assets → Output to /dist/
```

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check YAML front matter syntax in markdown files |
| Images not showing | Verify path is `./images/filename.png` |
| Changes not appearing | Run `npm run clean && npm run build` |
| Template errors | Check Handlebars partial names are correct |

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please submit issues and pull requests.

## 💡 Tips

- Use consistent date format: `YYYY-MM-DD`
- Tags help organize and categorize posts
- Keep post titles concise and SEO-friendly
- Add descriptions for better social sharing
- Use `./images/` relative paths for reliability
- Test locally before deploying: `npm start`

## 🎯 Next Steps

- [ ] Customize `templates/layouts/post.hbs` with your design
- [ ] Update `assets/css/style.css` with your branding
- [ ] Create your first blog post
- [ ] Deploy to Cloudflare Pages
- [ ] Monitor and iterate based on analytics

---

**Happy blogging!** 🎉

Built with ❤️ using JavaScript, Markdown, and Handlebars.
