# SSG Portfolio - Project Instructions

## Project Overview
This is a **static site generator** built with JavaScript and NPM that generates a portfolio website from markdown content and configuration files.

## Folder Structure & Rules

### `/contents` folder
- **Purpose**: Store all website content (blog posts, articles, pages)
- **File Format**: Markdown files (`.md`)
- **Usage**: Files in this folder are the source content that the static site generator processes into the final website
- **Examples**: Blog posts, portfolio projects, articles, tutorials

### `/docs` folder
- **Purpose**: Store development and project documentation
- **File Format**: Markdown files (`.md`)
- **Usage**: Development reference materials, design documents, and project planning
- **Examples**: 
  - `PRD.md` - Product Requirements Document
  - `TECH.md` - Technical Architecture Document
  - Design decisions, API specifications, setup guides

## Development Stack
- **Language**: JavaScript
- **Package Manager**: NPM
- **Type**: Static Site Generator

## Key Principles
1. Content in `/contents` is user-facing website material
2. Documentation in `/docs` is internal development reference
3. The static site generator processes markdown files from `/contents` to generate the final HTML website
