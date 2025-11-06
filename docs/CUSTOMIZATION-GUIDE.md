# Customization Guide

This guide explains how to customize the Eleventy site template for your specific needs.

## Table of Contents

1. [Site Configuration](#site-configuration)
2. [Adding Sections](#adding-sections)
3. [Styling](#styling)
4. [Content Structure](#content-structure)
5. [Search Configuration](#search-configuration)
6. [Navigation](#navigation)
7. [Filters & Metadata](#filters--metadata)

---

## Site Configuration

### Basic Settings

Edit `src/_data/site.json`:

```json
{
  "name": "Your Site",
  "description": "Your site description",
  "organization": "Your Organization",
  "url": "https://yoursite.com"
}
```

### Sections

Sections are the main content areas of your site. Each section needs:

1. **Entry in site.json**:
```json
{
  "id": "guides",
  "title": "Guides",
  "icon": "📖",
  "description": "Step-by-step tutorials"
}
```

2. **Collection in .eleventy.js**:
```javascript
eleventyConfig.addCollection("guides", function(collectionApi) {
  return collectionApi.getFilteredByGlob("content/guides/**/*.md");
});
```

3. **Directory structure**:
```
content/
  guides/
    index.njk
    your-guide.md
```

4. **Index file** (`content/guides/index.njk`):
```njk
---
layout: section.njk
sectionId: guides
title: Guides
description: Step-by-step tutorials
permalink: /guides/index.html
---
```

### Audience Types

Define who your content is for:

```json
"audienceTypes": [
  "Beginners",
  "Developers",
  "Designers",
  "Managers"
]
```

### Evidence Levels

For quality indicators:

```json
"evidenceLevels": [
  { "id": "verified", "label": "Verified", "badge": "strong" },
  { "id": "community", "label": "Community", "badge": "good" }
]
```

---

## Adding Sections

### Step-by-Step Process

1. **Add to site.json**:
```json
{
  "id": "tutorials",
  "title": "Tutorials",
  "icon": "🎓",
  "description": "Learn by doing"
}
```

2. **Create directory**:
```bash
mkdir content/tutorials
```

3. **Create index**:
```njk
---
layout: section.njk
sectionId: tutorials
title: Tutorials
permalink: /tutorials/index.html
---
```

4. **Add collection to .eleventy.js**:
```javascript
eleventyConfig.addCollection("tutorials", function(collectionApi) {
  return collectionApi.getFilteredByGlob("content/tutorials/**/*.md");
});
```

5. **Add to search index** (in .eleventy.js):
```javascript
const sections = ['example', 'tutorials']; // Add your section here
```

6. **Handle hyphenated IDs** (if needed):
```javascript
eleventyConfig.addFilter("sectionCollectionKey", function(sectionId) {
  const map = {
    "my-section": "mySection"
  };
  return map[sectionId] || sectionId;
});
```

---

## Styling

### CSS Variables

Edit `src/css/main.css` to customize colors, fonts, and spacing:

```css
:root {
  /* Brand Colors */
  --color-primary: #2563eb;
  --color-secondary: #64748b;
  --color-accent: #f59e0b;
  
  /* Text Colors */
  --color-text: #1e293b;
  --color-text-secondary: #64748b;
  --color-text-light: #94a3b8;
  
  /* Background Colors */
  --color-bg: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-bg-tertiary: #f1f5f9;
  
  /* Typography */
  --font-family-base: system-ui, -apple-system, sans-serif;
  --font-family-heading: 'Your Font', sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.6;
  
  /* Spacing */
  --spacing-unit: 8px;
  --spacing-xs: calc(var(--spacing-unit) * 1);
  --spacing-sm: calc(var(--spacing-unit) * 2);
  --spacing-md: calc(var(--spacing-unit) * 3);
  --spacing-lg: calc(var(--spacing-unit) * 4);
  --spacing-xl: calc(var(--spacing-unit) * 6);
  
  /* Layout */
  --container-max-width: 1200px;
  --border-radius: 8px;
  --header-height: 80px;
}
```

### Component Styling

Each component has its own section in `main.css`:

- **Header**: `.site-header`
- **Navigation**: `.site-nav`
- **Content**: `.content-article`
- **Section**: `.section-page`
- **Footer**: `.site-footer`

### Responsive Design

Mobile breakpoints:

```css
@media (max-width: 768px) {
  /* Tablet styles */
}

@media (max-width: 480px) {
  /* Mobile styles */
}
```

---

## Content Structure

### Frontmatter Template

```yaml
---
layout: content.njk
title: "Your Page Title"
category: "section-id"
tags: ["tag1", "tag2"]
audience: ["audience1", "audience2"]
evidenceLevel: "high"
dateAdded: 2024-11-06
lastReviewed: 2024-11-06
status: "published"
author: "Author Name"
---
```

### Required Fields

- `layout`: Always `content.njk` for content pages
- `title`: Page title
- `category`: Must match a section ID

### Optional Fields

- `tags`: Array of keywords
- `audience`: Target audience(s)
- `evidenceLevel`: Quality indicator
- `dateAdded`: Creation date
- `lastReviewed`: Last review date
- `status`: "draft", "published", "archived"
- `author`: Content creator
- `source`: Source reference
- `sourceUrl`: External link

### Custom Fields

Add any custom fields you need - they're accessible in templates:

```njk
{% if customField %}
  {{ customField }}
{% endif %}
```

---

## Search Configuration

### Adding Sections to Search

In `.eleventy.js`, update the `searchIndex` collection:

```javascript
const sections = ['example', 'guides', 'tutorials']; // Add your sections
```

### Search Fields

Default searchable fields:
- `title` (boost: 10)
- `content` (boost: 1)
- `tags` (boost: 5)
- `category` (boost: 3)

### Customizing Search

Edit `src/js/search.js`:

```javascript
searchIndex = lunr(function() {
  this.ref('url');
  this.field('title', { boost: 10 });
  this.field('content');
  this.field('tags', { boost: 5 });
  this.field('category', { boost: 3 });
  // Add custom fields:
  this.field('author', { boost: 2 });
});
```

### Section Labels

Update section labels in `src/js/search.js`:

```javascript
const sectionLabels = {
  example: 'Example Section',
  guides: 'Guides',
  tutorials: 'Tutorials'
};
```

---

## Navigation

### Main Navigation

Automatically generated from `site.sections` in `site.json`.

### Customizing Nav Items

Edit `src/_includes/nav.njk`:

```njk
<ul class="nav-list">
  {% for section in site.sections %}
  <li class="nav-item">
    <a href="{{ ('/' ~ section.id ~ '/') | url }}" class="nav-link">
      <span class="nav-icon">{{ section.icon }}</span>
      <div class="nav-content">
        <span class="nav-label">{{ section.title }}</span>
        <span class="nav-description">{{ section.description }}</span>
      </div>
    </a>
  </li>
  {% endfor %}
</ul>
```

### Adding Quick Links

In `nav.njk`, add a secondary navigation section:

```njk
<div class="nav-secondary">
  <h3>Quick Links</h3>
  <ul class="quick-links">
    <li><a href="{{ '/about/' | url }}">About</a></li>
    <li><a href="{{ '/contact/' | url }}">Contact</a></li>
  </ul>
</div>
```

---

## Filters & Metadata

### Custom Filters

Add to `.eleventy.js`:

```javascript
// Uppercase filter
eleventyConfig.addFilter("uppercase", str => {
  return str.toUpperCase();
});

// Excerpt filter
eleventyConfig.addFilter("excerpt", (content, length = 200) => {
  return content.substring(0, length) + '...';
});

// Custom date format
eleventyConfig.addFilter("customDate", dateObj => {
  return new Date(dateObj).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
});
```

### Using Filters

In templates:

```njk
{{ title | uppercase }}
{{ content | excerpt(150) }}
{{ dateAdded | customDate }}
```

### Metadata Display

Edit `src/_includes/metadata.njk` to customize what appears in content headers:

```njk
<div class="content-metadata">
  {% if author %}
  <span class="metadata-item">
    <strong>By:</strong> {{ author }}
  </span>
  {% endif %}
  
  {% if customField %}
  <span class="metadata-item">
    <strong>Custom:</strong> {{ customField }}
  </span>
  {% endif %}
</div>
```

---

## Advanced Customization

### Adding New Layouts

1. Create file in `src/_layouts/`:
```njk
---
layout: base.njk
---

<div class="custom-layout">
  {{ content | safe }}
</div>
```

2. Use in content:
```yaml
---
layout: custom-layout.njk
---
```

### Adding New Includes

1. Create file in `src/_includes/`:
```njk
<div class="custom-component">
  <h3>{{ heading }}</h3>
  <p>{{ description }}</p>
</div>
```

2. Include in templates:
```njk
{% include "custom-component.njk" %}
```

### Custom Collections

Advanced collection filtering:

```javascript
eleventyConfig.addCollection("featured", function(collectionApi) {
  return collectionApi.getAll().filter(item => {
    return item.data.featured === true;
  });
});
```

---

## Tips & Best Practices

1. **Test locally** before deploying: `npm run dev`
2. **Build before pushing**: `npm run build`
3. **Use consistent naming**: kebab-case for IDs, camelCase for collections
4. **Document custom changes** in your own README
5. **Keep dependencies updated**: `npm update`
6. **Validate frontmatter** before building
7. **Use semantic HTML** in markdown
8. **Optimize images** before adding to assets
9. **Test on multiple browsers**
10. **Monitor build times** as content grows

---

## Troubleshooting

### Build Fails

- Check `.eleventy.js` syntax
- Verify all collections reference existing directories
- Ensure frontmatter is valid YAML

### Search Not Working

- Verify `search-index.json` is generated
- Check section names match in config and search.js
- Look for JavaScript errors in browser console

### Styling Issues

- Clear browser cache
- Check CSS file is linked in base.njk
- Verify CSS variables are defined

### 404 Errors

- Ensure all links use `{{ url }}` filter
- Check path prefix in package.json
- Verify files exist in content directory

---

## Getting Help

- Review `SETUP-INSTRUCTIONS.md` for detailed setup steps
- Check `README.md` for overview and quick start
- Inspect existing files for examples
- Test changes incrementally

---

**Remember**: This template is designed to be flexible. Customize it to fit your specific needs!
