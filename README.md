# Eleventy Site Template

A content-agnostic Eleventy static site template with built-in search, filtering, and responsive navigation. Perfect for knowledge repositories, documentation sites, or content-heavy websites.

## Features

- **Modular Architecture**: Reusable layouts, includes, and components
- **Full-Text Search**: Client-side Lunr.js search with auto-generated index
- **Advanced Filtering**: Filter content by audience, category, tags, and custom metadata
- **Responsive Design**: Mobile-first CSS with modern design patterns
- **GitHub Pages Ready**: Path-prefix aware builds for seamless deployment
- **Accessible**: ARIA labels, keyboard navigation, semantic HTML
- **Extensible**: Easy to customize sections, metadata, and styling

## Quick Start

### 1. Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:8080` to see your site.

### 2. Configuration

Edit `src/_data/site.json` to customize:
- Site name and description
- Organization details
- Content sections (add/remove/modify)
- Navigation structure

### 3. Add Content

Create markdown files in `content/` subdirectories:

```markdown
---
layout: content.njk
title: "Your Page Title"
category: "section-name"
tags: ["tag1", "tag2"]
audience: ["audience1", "audience2"]
dateAdded: 2024-11-06
lastReviewed: 2024-11-06
---

Your content here in Markdown format.
```

### 4. Build & Deploy

```bash
# Production build
npm run build

# GitHub Pages build (with path prefix)
npm run build:gh
```

## Project Structure

```
├── content/              # Your markdown content
│   ├── section1/        # Content sections (customize names)
│   ├── section2/
│   └── index.md         # Home page
├── src/
│   ├── _data/           # Global site data
│   │   └── site.json    # Site configuration
│   ├── _includes/       # Reusable components
│   │   ├── header.njk
│   │   ├── nav.njk
│   │   └── footer.njk
│   ├── _layouts/        # Page layouts
│   │   ├── base.njk     # Base HTML structure
│   │   ├── content.njk  # Content page layout
│   │   └── section.njk  # Section listing layout
│   ├── css/             # Stylesheets
│   │   ├── main.css     # Core styles
│   │   └── search.css   # Search UI styles
│   ├── js/              # JavaScript
│   │   ├── filters.js   # Navigation & filtering
│   │   └── search.js    # Search functionality
│   └── assets/          # Images, fonts, etc.
├── .eleventy.js         # Eleventy configuration
├── package.json         # Dependencies
└── .gitignore           # Git ignore rules
```

## Customization Guide

### Adding a New Section

1. **Create content directory**: `content/your-section/`
2. **Add section index**: `content/your-section/index.njk`
3. **Update site.json**: Add section to `sections` array
4. **Update .eleventy.js**: Add collection for the section
5. **Add content files**: Create `.md` files in the section directory

### Modifying Metadata Schema

Edit the frontmatter fields in your content files. Common fields:
- `title`: Page title (required)
- `category`: Section identifier (required)
- `tags`: Array of tags for filtering
- `audience`: Target audience(s)
- `dateAdded`: Creation date
- `lastReviewed`: Last review date

Add custom fields as needed - they'll be available in templates via `{{ page.data.yourField }}`.

### Styling

- **CSS Variables**: Modify `src/css/main.css` root variables for colors, spacing, fonts
- **Component Styles**: Each component has its own CSS section in `main.css`
- **Responsive**: Mobile-first approach with `@media` queries

### Search Configuration

Search is configured in `.eleventy.js`:
- Add/remove sections from search index
- Modify search fields and boost values in `src/js/search.js`
- Customize search UI in `src/css/search.css`

## GitHub Pages Deployment

### Setup

1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Push `.github/workflows/deploy.yml` (included in template)

### Configuration

Update `package.json` build:gh script:
```json
"build:gh": "cross-env ELEVENTY_PATH_PREFIX=/your-repo-name eleventy"
```

Replace `/your-repo-name` with your actual repository name.

## Commands

- `npm run dev` - Development server with live reload
- `npm run build` - Production build (local)
- `npm run build:gh` - Production build with GitHub Pages path prefix
- `npm run clean` - Remove build directory

## Browser Support

- Chrome, Firefox, Safari, Edge (modern versions)
- Mobile responsive
- Progressive enhancement (works without JavaScript)

## Technology Stack

- **Static Site Generator**: Eleventy 2.0+
- **Templating**: Nunjucks
- **Search**: Lunr.js (client-side)
- **Styling**: Modern CSS (no framework)
- **JavaScript**: Vanilla ES6+

## Tips & Best Practices

### Content Organization

- Use descriptive filenames (e.g., `getting-started.md`, not `page1.md`)
- Keep related content in the same section directory
- Use consistent metadata across similar content types
- Add tags for cross-section discoverability

### Performance

- Optimize images before adding to `src/assets/`
- Keep markdown files focused (split long content)
- Use passthrough copy for static assets
- Minimize custom JavaScript

### Accessibility

- Use semantic HTML in markdown
- Add alt text to images
- Ensure sufficient color contrast
- Test keyboard navigation
- Use ARIA labels where appropriate

### Maintenance

- Review and update `lastReviewed` dates regularly
- Keep dependencies updated (`npm update`)
- Test builds before deploying
- Monitor GitHub Actions for deployment issues

## Troubleshooting

### Build Errors

- Check `.eleventy.js` syntax
- Verify all collections reference existing directories
- Ensure frontmatter is valid YAML
- Check for missing required fields

### Search Not Working

- Verify `search-index.json` is generated in `_site/`
- Check browser console for JavaScript errors
- Ensure Lunr.js is loaded before search.js
- Verify section names match in `.eleventy.js` and `search.js`

### Styling Issues

- Clear browser cache
- Check CSS file is linked in `base.njk`
- Verify CSS variables are defined
- Test in different browsers

### GitHub Pages 404s

- Ensure path prefix matches repository name
- Check all links use `{{ url }}` filter
- Verify assets are in passthrough copy
- Review GitHub Actions deployment logs

## Support

For issues, questions, or contributions:
1. Check existing documentation
2. Review `.eleventy.js` configuration
3. Inspect browser console for errors
4. Test with `npm run build` locally

## License

MIT License - feel free to use for any project.

## Credits

Built with [Eleventy](https://www.11ty.dev/), the simple static site generator.
