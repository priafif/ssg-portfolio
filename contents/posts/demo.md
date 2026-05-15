---
title: Welcome to SSG Portfolio
date: 2026-05-15
author: Your Name
tags: [welcome, ssg, tutorial]
description: Getting started with SSG Portfolio - A lightweight static site generator
slug: welcome-to-ssg-portfolio
layout: post
---

# Welcome to SSG Portfolio

This is your first blog post! Here's what you can do with SSG Portfolio.

## Features

SSG Portfolio is a lightweight static site generator that:

* Converts markdown to static HTML
  * With built-in support for YAML front matter
  * Extracts metadata like title, date, and tags
* Uses Handlebars for templating
  * Partials for reusable components
  * Template inheritance for consistency
* Deploys to Cloudflare Pages automatically
  * No server required
  * Global CDN distribution

## Getting Started

### 1. Create New Posts

Simply create a `.md` file in the `contents/` folder:

```markdown
---
title: My Post Title
date: 2026-05-15
author: Your Name
tags: [tag1, tag2]
description: Short description
---

# Content here
```

### 2. Add Images

Store images in `contents/images/` and reference them:

```markdown
![Alt text](./images/my-image.png)
```

### 3. Build Your Site

Run:

```bash
npm run build
```

Your site will be generated in the `dist/` folder!

## Markdown Support

You can use all standard markdown:

**Bold text** and *italic text*

- Lists
- With nested items
  - Like this

1. Numbered
2. Lists
3. Too

Code blocks with syntax highlighting:

```javascript
function hello() {
  console.log('Hello, World!');
}
```

And [links](https://example.com) work too!

## Next Steps

- [ ] Edit `config.json` with your site information
- [ ] Customize templates in `templates/`
- [ ] Add your own blog posts to `contents/`
- [ ] Deploy to Cloudflare Pages

Happy blogging! 🎉