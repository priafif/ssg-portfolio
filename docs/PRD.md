# Product Requirements Document (PRD)
## SSG Portfolio - Static Site Generator

**Version:** 1.0  
**Date:** May 15, 2026  
**Status:** Initial Planning

---

## 1. Executive Summary

SSG Portfolio is a **JavaScript-based Static Site Generator** that transforms markdown content into a fully functional portfolio website. It streamlines content management for developers and designers who want to maintain a professional portfolio without complex server infrastructure.

---

## 2. Product Vision

Enable content creators to build, manage, and deploy a professional portfolio website by writing markdown files, without needing to understand HTML, CSS, or backend development.

---

## 3. Core Objectives

1. **Simple Content Management**: Write blog posts and portfolio content as markdown files
2. **Fast Website Generation**: Convert markdown to static HTML with minimal overhead
3. **Portfolio Showcase**: Display projects, skills, and blog articles professionally
4. **Easy Deployment**: Generated static files can be deployed anywhere (GitHub Pages, Netlify, traditional hosting)
5. **No Database Required**: Pure static site - fast, secure, and cost-effective

---

## 4. Features & Requirements

### 4.1 Content Management
- **Markdown Support**: All content written in standard markdown format
- **YAML Front Matter**: Metadata for each post (title, date, tags, description, author)
- **Location**: Content stored in `/contents` folder for organization
- **Supported Content Types**:
  - Blog posts
  - Portfolio projects
  - Articles and tutorials
  - Static pages

### 4.2 Website Generation
- **Input**: Markdown files from `/contents`
- **Output**: Static HTML files ready for deployment
- **Processing**: JavaScript-based conversion engine
- **Theme Support**: Customizable templates for consistent styling
- **Deployment Target**: Cloudflare Pages for fast, global CDN distribution

### 4.3 Portfolio Showcase
- **Project Listings**: Display portfolio projects with descriptions (sorted by date/tags)
- **Blog Archive**: Chronological listing of blog posts
- **Article Pages**: Individual pages for each blog post/article with metadata
- **Navigation**: Automatic menu generation based on content structure and front matter
- **Metadata Display**: Show title, date, author, tags, description from YAML front matter

### 4.4 Templating System
- **Purpose**: Define overall website layout, styling, and components
- **Features**:
  - Partials/Components support for reusable blocks (navigation, footer, cards, etc.)
  - Easy to modify layout without touching content
  - Support for layouts, templates, and components
  - Template inheritance for consistent site structure
- **Implementation**: Handlebars templating engine
  - **Reasoning**: Lightweight, mature, excellent partial support, simple syntax
  - **Handlebars partials**: Enable reusable components without custom development

### 4.4 Development & Documentation
- **Dev Docs**: Stored in `/docs` folder for internal reference
- **Includes**: 
  - PRD.md (this document)
  - TECH.md (technical architecture)
  - Design decisions and API specifications
  - Setup and contribution guides

---

## 5. Folder Structure

```
ssg-portfolio/
├── contents/           # Website content (user-facing)
│   ├── demo.md         # Example blog post
│   ├── images/         # Blog post images (optional nested folders)
│   │   ├── blog/
│   │   └── projects/
│   └── [other posts]
├── assets/             # Static assets (CSS, JS, etc.)
│   ├── css/            # Stylesheets
│   └── js/             # Client-side scripts
├── templates/          # Templating system
│   ├── layouts/        # Page layouts
│   ├── partials/       # Reusable components (nav, footer, etc.)
│   └── pages/          # Page templates
├── docs/               # Development documentation
│   ├── PRD.md          # Product Requirements Document
│   └── TECH.md         # Technical Architecture
├── dist/               # Build output (generated static site)
│   ├── index.html
│   ├── blog/
│   ├── projects/
│   ├── images/         # Copied from /contents/images/
│   ├── css/            # Copied from /assets/css/
│   └── js/             # Copied from /assets/js/
├── .github/
│   └── copilot-instructions.md  # Project guidelines
└── package.json        # NPM configuration & build scripts
```

---

## 6. Technical Stack

| Component | Technology |
|-----------|------------|
| Language | JavaScript |
| Package Manager | NPM |
| Build System | NPM scripts (`npm run build`) |
| Markdown Parser | TBD (marked or gray-matter) |
| Templating Engine | Handlebars |
| Input Format | Markdown |
| Output Format | Static HTML |
| Output Folder | `/dist/` (standard convention) |
| Asset Handling | Images in `/contents/images/`, CSS/JS in `/assets/` - all copied to `/dist/` during build |
| Styling | TBD (CSS Framework TBD) |
| Hosting | Cloudflare Pages |
| CI/CD | Cloudflare Pages Git integration |

---

## 7. Key Decisions

1. **Static Generation**: No server required - all content pre-generated
2. **Markdown Format**: Easy to write, version control friendly, portable
3. **Separate Content/Docs**: Clear distinction between website content and development documentation
4. **NPM Ecosystem**: Leverage existing JavaScript tools and packages
5. **Minimal Dependencies**: Keep generator lightweight and fast
6. **NPM Scripts for Build System**: Use `npm run build` with custom build scripts - simple, effective, no bloated tools
9. **Build Output**: `/dist/` folder for generated static site (industry standard)
10. **Static Assets**: 
    - **Images**: Store in `/contents/images/` (optional nested folders like `/contents/images/blog/`, `/contents/images/projects/`)
    - **Reference in markdown**: `![alt](./images/my-image.png)` or `![alt](./images/blog/post-image.png)`
    - **CSS/JS**: Store in `/assets/css/` and `/assets/js/`
    - **Build process**: Copies images from `/contents/images/` → `/dist/images/` and assets from `/assets/` → `/dist/assets/`st hosting with custom domain support
7. **Handlebars Templating**: Use Handlebars for partials/components support, simple syntax, lightweight
8. **Build Output**: `/dist/` folder for generated static site (industry standard)

---

## 8. Success Criteria

- [ ] Successfully converts markdown with front matter to HTML
- [ ] Extracts and uses YAML front matter for metadata (title, date, tags)
- [ ] Generates blog archive sorted by date
- [ ] Generates navigation automatically from content structure
- [ ] Produces fast-loading static files
- [ ] Portfolio showcases projects and blog posts effectively
- [ ] Generated site is mobile-responsive
- [ ] Easy to set up and use for non-developers
- [ ] Documentation enables community contribution

---

## 9. Future Enhancements (Post-MVP)

- Theme marketplace
- SEO optimization features
- RSS feed generation
- Search functionality
- Image optimization
- Analytics integration
- Content categorization and tagging
- Social media integration

---

## 10. Out of Scope (v1.0)

- Dynamic content/server-side rendering
- User authentication
- Database integration
- CMS interface
- Real-time preview (may add later)

---

## 11. Next Steps

1. [ ] Create technical architecture document (TECH.md)
2. [ ] Define folder structure and build output locations
3. [ ] Plan markdown-to-HTML conversion engine
4. [ ] Design template system
5. [ ] Begin implementation of core generator
6. [ ] Create example templates and themes
