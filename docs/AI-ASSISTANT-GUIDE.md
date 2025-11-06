# AI Assistant Guide for Eleventy Site Template

This document provides comprehensive instructions for AI assistants helping users set up and customize this Eleventy site template.

## Template Overview

This is a **content-agnostic Eleventy static site template** with:
- Full-text search (Lunr.js)
- Advanced filtering
- Responsive navigation
- GitHub Pages deployment
- Modular architecture

## Quick Reference

### Key Files to Understand

1. **`.eleventy.js`** - Eleventy configuration, collections, filters
2. **`src/_data/site.json`** - Site metadata and sections
3. **`package.json`** - Dependencies and build scripts
4. **`src/_layouts/base.njk`** - Base HTML structure
5. **`src/_includes/nav.njk`** - Navigation component
6. **`src/js/search.js`** - Search functionality
7. **`src/css/main.css`** - Core styles

### File Structure

```
_site_template/
├── .eleventy.js              # Eleventy config
├── .gitignore                # Git ignore rules
├── package.json              # Dependencies
├── README.md                 # User-facing documentation
├── SETUP-INSTRUCTIONS.md     # Detailed setup guide
├── CUSTOMIZATION-GUIDE.md    # Customization reference
├── TEMPLATE-CHECKLIST.md     # Setup checklist
├── AI-ASSISTANT-GUIDE.md     # This file
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions workflow
├── content/
│   ├── index.md              # Homepage
│   ├── search-index.njk      # Search index generator
│   └── example/              # Sample section
│       ├── index.njk         # Section index
│       └── sample-page.md    # Sample content
└── src/
    ├── _data/
    │   └── site.json         # Site configuration
    ├── _includes/            # Reusable components
    │   ├── header.njk
    │   ├── nav.njk
    │   ├── footer.njk
    │   └── metadata.njk
    ├── _layouts/             # Page layouts
    │   ├── base.njk
    │   ├── content.njk
    │   └── section.njk
    ├── assets/               # Images, fonts, etc.
    │   └── logo.svg
    ├── css/                  # Stylesheets
    │   ├── main.css
    │   └── search.css
    └── js/                   # JavaScript
        ├── filters.js
        └── search.js
```

## Common User Requests & Solutions

### 1. "Help me set up a new site"

**Steps:**

1. **Initial Setup**
   ```bash
   npm install
   npm run dev
   ```

2. **Configure Site** (`src/_data/site.json`)
   - Update name, description, organization
   - Define sections (see Section Setup below)

3. **Update Build** (`package.json`)
   - Change `build:gh` script: `/your-repo-name`

4. **Test**
   - Visit `http://localhost:8080`
   - Verify homepage loads
   - Check navigation

### 2. "Add a new content section"

**Complete Process:**

1. **Add to site.json**
   ```json
   {
     "id": "guides",
     "title": "Guides",
     "icon": "📖",
     "description": "Step-by-step tutorials"
   }
   ```

2. **Create directory structure**
   ```
   content/guides/
   ├── index.njk
   └── first-guide.md
   ```

3. **Create index.njk**
   ```njk
   ---
   layout: section.njk
   sectionId: guides
   title: Guides
   permalink: /guides/index.html
   ---
   ```

4. **Add collection** (`.eleventy.js`)
   ```javascript
   eleventyConfig.addCollection("guides", function(collectionApi) {
     return collectionApi.getFilteredByGlob("content/guides/**/*.md");
   });
   ```

5. **Add to search** (`.eleventy.js`)
   ```javascript
   const sections = ['example', 'guides']; // Add 'guides'
   ```

6. **Handle hyphenated IDs** (if needed)
   ```javascript
   eleventyConfig.addFilter("sectionCollectionKey", function(sectionId) {
     const map = {
       "my-section": "mySection"
     };
     return map[sectionId] || sectionId;
   });
   ```

### 3. "Customize the styling"

**CSS Variables** (`src/css/main.css`)

```css
:root {
  --color-primary: #2563eb;      /* Main brand color */
  --color-secondary: #64748b;    /* Secondary color */
  --color-accent: #f59e0b;       /* Accent color */
  --font-family-base: system-ui; /* Body font */
  --font-family-heading: inherit; /* Heading font */
  --spacing-unit: 8px;           /* Base spacing */
  --container-max-width: 1200px; /* Max content width */
}
```

**Component Styles:**
- Header: `.site-header`
- Navigation: `.site-nav`
- Content: `.content-article`
- Footer: `.site-footer`

### 4. "Configure search"

**Add sections to search** (`.eleventy.js`)

```javascript
eleventyConfig.addCollection("searchIndex", function(collectionApi) {
  const allContent = [];
  const sections = ['section1', 'section2', 'section3']; // Update this
  
  sections.forEach(key => {
    const items = collectionApi.getFilteredByGlob(`content/${key}/**/*.md`);
    items.forEach(item => {
      allContent.push({
        title: item.data.title,
        content: item.template.frontMatter.content,
        url: item.url,
        tags: item.data.tags || [],
        category: item.data.category || '',
        audience: item.data.audience || [],
        section: key
      });
    });
  });
  
  return allContent;
});
```

**Update section labels** (`src/js/search.js`)

```javascript
const sectionLabels = {
  section1: 'Section 1 Name',
  section2: 'Section 2 Name'
};
```

### 5. "Deploy to GitHub Pages"

**Steps:**

1. **Update package.json**
   ```json
   "build:gh": "cross-env ELEVENTY_PATH_PREFIX=/repo-name eleventy"
   ```

2. **Create workflow** (already included at `.github/workflows/deploy.yml`)

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Set source to "GitHub Actions"

4. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

5. **Verify deployment**
   - Check Actions tab for workflow status
   - Visit `https://username.github.io/repo-name/`

## Troubleshooting Guide

### Build Errors

**"Cannot find module"**
- Run `npm install`
- Check package.json dependencies

**"Collection not found"**
- Verify collection name in `.eleventy.js`
- Check directory path in `getFilteredByGlob`
- Ensure content files exist

**"Invalid frontmatter"**
- Check YAML syntax (use `---` delimiters)
- Verify required fields present
- Check for special characters

### Search Issues

**Search index not generated**
- Check `content/search-index.njk` exists
- Verify `searchIndex` collection in `.eleventy.js`
- Check build output for `search-index.json`

**Search returns no results**
- Verify content has been added
- Check section names match in config
- Look for JavaScript errors in console

**Search results have wrong URLs**
- Verify `pathPrefix` in `.eleventy.js`
- Check `data-site-prefix` in `base.njk`
- Ensure all links use `{{ url }}` filter

### Styling Issues

**Styles not loading**
- Check CSS file path in `base.njk`
- Verify passthrough copy in `.eleventy.js`
- Clear browser cache

**Variables not working**
- Ensure `:root` selector in CSS
- Check variable names (double-dash prefix)
- Verify CSS file is loaded

### GitHub Pages Issues

**404 errors**
- Check path prefix matches repo name
- Verify all links use `{{ url }}` filter
- Check assets in passthrough copy

**Build fails on GitHub**
- Check GitHub Actions logs
- Verify Node.js version (18 recommended)
- Test `npm run build:gh` locally

## Best Practices for AI Assistants

### 1. Always Read Configuration First

Before making changes:
- Read `src/_data/site.json` to understand current setup
- Check `.eleventy.js` for existing collections
- Review `package.json` for scripts and dependencies

### 2. Maintain Consistency

- Use kebab-case for section IDs
- Use camelCase for collection names
- Follow existing naming patterns
- Keep code style consistent

### 3. Test Changes

After modifications:
- Run `npm run build` to verify
- Check for errors in output
- Test affected functionality
- Verify search index updates

### 4. Document Custom Changes

When adding custom features:
- Comment code clearly
- Update relevant documentation
- Note any breaking changes
- Provide usage examples

### 5. Preserve Template Integrity

- Don't remove core functionality
- Keep file structure intact
- Maintain backward compatibility
- Test thoroughly before committing

## Common Patterns

### Adding a Custom Filter

```javascript
// In .eleventy.js
eleventyConfig.addFilter("filterName", function(value, arg) {
  // Filter logic
  return transformedValue;
});
```

### Creating a New Layout

```njk
---
layout: base.njk
---

<div class="custom-layout">
  <header>
    <h1>{{ title }}</h1>
  </header>
  <div class="content">
    {{ content | safe }}
  </div>
</div>
```

### Adding a New Include

```njk
<!-- src/_includes/component.njk -->
<div class="component">
  <h3>{{ heading }}</h3>
  <p>{{ description }}</p>
</div>

<!-- Usage in template -->
{% include "component.njk" %}
```

### Custom Collection

```javascript
eleventyConfig.addCollection("featured", function(collectionApi) {
  return collectionApi.getAll()
    .filter(item => item.data.featured === true)
    .sort((a, b) => b.date - a.date);
});
```

## Content Frontmatter Reference

### Minimal Required

```yaml
---
layout: content.njk
title: "Page Title"
category: "section-id"
---
```

### Full Example

```yaml
---
layout: content.njk
title: "Complete Example"
category: "guides"
tags: ["tutorial", "beginner"]
audience: ["Developers", "Designers"]
evidenceLevel: "high"
status: "published"
author: "Author Name"
dateAdded: 2024-11-06
lastReviewed: 2024-11-06
reviewDue: 2025-11-06
source: "Source Name"
sourceUrl: "https://example.com"
---
```

## Deployment Checklist

When helping users deploy:

1. ✓ `package.json` updated with correct repo name
2. ✓ All sections added to collections
3. ✓ Search index includes all sections
4. ✓ Build succeeds locally (`npm run build:gh`)
5. ✓ `.github/workflows/deploy.yml` exists
6. ✓ GitHub Pages enabled in repository
7. ✓ All links use `{{ url }}` filter
8. ✓ Assets in passthrough copy
9. ✓ No console errors
10. ✓ Mobile responsive tested

## Quick Commands Reference

```bash
# Development
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for local
npm run build:gh     # Build for GitHub Pages
npm run clean        # Clean build directory

# Git
git add .
git commit -m "message"
git push origin main

# Testing
# Visit http://localhost:8080
# Check browser console for errors
# Test search functionality
# Verify all links work
```

## Support Resources

- **Eleventy Docs**: https://www.11ty.dev/docs/
- **Nunjucks Docs**: https://mozilla.github.io/nunjucks/
- **Lunr.js Docs**: https://lunrjs.com/
- **Markdown Guide**: https://www.markdownguide.org/

## Template Maintenance

### When Helping Users Update

1. Check current Eleventy version
2. Review breaking changes in updates
3. Test after dependency updates
4. Update documentation if needed
5. Verify search still works
6. Check GitHub Actions compatibility

### Version Compatibility

- **Eleventy**: 2.0+
- **Node.js**: 14+
- **Lunr.js**: 2.3+
- **cross-env**: 7.0+

## Final Notes

- This template is designed to be flexible and extensible
- Encourage users to customize to their needs
- Always test changes locally before deploying
- Document custom modifications
- Keep dependencies updated
- Monitor build times as content grows

---

**Template Version**: 1.0  
**Last Updated**: 2024-11-06  
**Maintained By**: AI Assistant Team
