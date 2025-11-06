# Setup Instructions for AI Assistant

This document provides step-by-step instructions for setting up a new Eleventy site from this template. Follow these instructions carefully to create a fully functional, content-rich website.

## Prerequisites

- Node.js installed (v14 or higher)
- Basic understanding of Markdown and YAML
- Git repository initialized (optional but recommended)

## Phase 1: Initial Setup (5 minutes)

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- Eleventy (static site generator)
- Lunr.js (search functionality)
- markdown-it (Markdown parser)
- cross-env (cross-platform environment variables)
- eleventy-plugin-syntaxhighlight (code highlighting)

### Step 2: Configure Site Metadata

Edit `src/_data/site.json`:

```json
{
  "name": "Your Site",
  "description": "Your site description",
  "organization": "Your Organization",
  "url": "https://yoursite.com",
  "sections": [
    // Define your content sections here
  ]
}
```

**Key Fields to Customize:**
- `name`: Appears in header and page titles
- `description`: Used in meta tags
- `organization`: Footer and branding
- `url`: Base URL for production
- `sections`: Array of content sections (see Phase 2)

### Step 3: Update package.json

Edit `package.json`:

```json
{
  "name": "your-project-name",
  "description": "Your project description",
  "author": "Your Name/Organization",
  "scripts": {
    "build:gh": "cross-env ELEVENTY_PATH_PREFIX=/your-repo-name eleventy"
  }
}
```

Replace `/your-repo-name` with your GitHub repository name if deploying to GitHub Pages.

### Step 4: Test Development Server

```bash
npm run dev
```

Visit `http://localhost:8080` - you should see the template homepage.

## Phase 2: Content Structure (15 minutes)

### Step 1: Define Content Sections

Content sections are the main organizational units of your site. Examples:
- Documentation site: "Getting Started", "API Reference", "Tutorials", "FAQ"
- Knowledge base: "Guides", "Resources", "Case Studies", "News"
- Portfolio: "Projects", "About", "Blog", "Contact"

### Step 2: Update site.json Sections

For each section, add an entry to `src/_data/site.json`:

```json
{
  "sections": [
    {
      "id": "section-id",           // URL-friendly identifier (lowercase, hyphens)
      "title": "Section Title",      // Display name
      "icon": "📚",                  // Emoji or icon
      "description": "Brief description of this section"
    }
  ]
}
```

**Example for a Documentation Site:**

```json
{
  "sections": [
    {
      "id": "getting-started",
      "title": "Getting Started",
      "icon": "🚀",
      "description": "Quick start guides and installation instructions"
    },
    {
      "id": "guides",
      "title": "Guides",
      "icon": "📖",
      "description": "Step-by-step tutorials and how-tos"
    },
    {
      "id": "api",
      "title": "API Reference",
      "icon": "⚙️",
      "description": "Complete API documentation"
    },
    {
      "id": "faq",
      "title": "FAQ",
      "icon": "❓",
      "description": "Frequently asked questions"
    }
  ]
}
```

### Step 3: Create Section Directories

For each section, create:

1. **Content directory**: `content/section-id/`
2. **Index file**: `content/section-id/index.njk`

**Index file template:**

```njk
---
layout: section.njk
sectionId: section-id
title: Section Title
description: Section description
permalink: /section-id/index.html
---
```

### Step 4: Add Collections to .eleventy.js

For each section, add a collection in `.eleventy.js`:

```javascript
eleventyConfig.addCollection("sectionId", function(collectionApi) {
  return collectionApi.getFilteredByGlob("content/section-id/**/*.md");
});
```

**Important**: Use camelCase for collection names if section IDs have hyphens:
- `getting-started` → collection: `gettingStarted`
- `api-reference` → collection: `apiReference`

Add a filter to handle this mapping:

```javascript
eleventyConfig.addFilter("sectionCollectionKey", function(sectionId) {
  const map = {
    "getting-started": "gettingStarted",
    "api-reference": "apiReference"
  };
  return map[sectionId] || sectionId;
});
```

### Step 5: Update Search Index

In `.eleventy.js`, update the `searchIndex` collection to include your sections:

```javascript
eleventyConfig.addCollection("searchIndex", function(collectionApi) {
  const allContent = [];
  
  ['section1', 'section2', 'section3'].forEach(key => {
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

## Phase 3: Content Creation (Ongoing)

### Step 1: Create Content Files

For each piece of content, create a markdown file in the appropriate section directory:

**Filename**: `content/section-id/your-page.md`

**Template:**

```markdown
---
layout: content.njk
title: "Your Page Title"
category: "section-id"
tags: ["tag1", "tag2", "tag3"]
audience: ["developers", "designers"]
dateAdded: 2024-11-06
lastReviewed: 2024-11-06
---

# Your Page Title

Your content here in Markdown format.

## Subheading

More content...
```

### Step 2: Metadata Guidelines

**Required Fields:**
- `layout`: Always `content.njk` for content pages
- `title`: Page title (used in navigation and search)
- `category`: Section identifier (must match section ID)

**Recommended Fields:**
- `tags`: Array of keywords for filtering and search
- `audience`: Target audience(s)
- `dateAdded`: Creation date (YYYY-MM-DD)
- `lastReviewed`: Last review date (YYYY-MM-DD)

**Optional Fields (add as needed):**
- `author`: Content author
- `status`: "draft", "published", "archived"
- `evidenceLevel`: "high", "medium", "low"
- `ageRange`: "5-7", "8-11", etc.
- Any custom fields your site needs

### Step 3: Content Best Practices

**Markdown Formatting:**
- Use `#` for main heading (H1)
- Use `##` for subheadings (H2)
- Use `###` for sub-subheadings (H3)
- Use `-` or `*` for bullet lists
- Use `1.` for numbered lists
- Use ` ``` ` for code blocks
- Use `**bold**` and `*italic*` for emphasis

**Internal Links:**
- Use relative paths: `[Link text](../other-section/page.md)`
- Or use Nunjucks: `[Link text]({{ '/other-section/page/' | url }})`

**Images:**
- Place in `src/assets/`
- Reference: `![Alt text]({{ '/assets/image.jpg' | url }})`

## Phase 4: Customization (Optional)

### Step 1: Customize Styling

Edit `src/css/main.css` CSS variables:

```css
:root {
  /* Colors */
  --color-primary: #2563eb;
  --color-secondary: #64748b;
  --color-accent: #f59e0b;
  
  /* Typography */
  --font-family-base: system-ui, sans-serif;
  --font-family-heading: 'Your Heading Font', sans-serif;
  
  /* Spacing */
  --spacing-unit: 8px;
  
  /* Layout */
  --container-max-width: 1200px;
}
```

### Step 2: Customize Navigation

Edit `src/_includes/nav.njk` to modify:
- Navigation structure
- Quick links
- Mobile menu behavior

### Step 3: Customize Header/Footer

- **Header**: `src/_includes/header.njk`
- **Footer**: `src/_includes/footer.njk`

Update branding, links, and layout as needed.

### Step 4: Add Custom Features

**Modal System:**
Already included in `base.njk`. To add more modals:
1. Add modal HTML in `base.njk`
2. Add trigger link in navigation
3. Add JavaScript in `filters.js`

**Filter Panel:**
Customize filters in `src/_includes/nav.njk` (filter-panel section).

## Phase 5: Homepage Customization

### Step 1: Edit Homepage Content

Edit `content/index.md`:

```markdown
---
layout: base.njk
title: Home
permalink: /
---

<div class="hero">
  <h1>Welcome to {{ site.name }}</h1>
  <p>{{ site.description }}</p>
</div>

<div class="section-grid">
  {% for section in site.sections %}
  <a href="{{ ('/' ~ section.id ~ '/') | url }}" class="section-card">
    <span class="section-card-icon">{{ section.icon }}</span>
    <h3>{{ section.title }}</h3>
    <p>{{ section.description }}</p>
  </a>
  {% endfor %}
</div>
```

### Step 2: Add Custom Homepage Sections

Add any custom HTML/Markdown sections as needed.

## Phase 6: GitHub Pages Deployment

### Step 1: Create GitHub Actions Workflow

File: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build site
      run: npm run build:gh
    
    - name: Upload build artifacts
      uses: actions/upload-pages-artifact@v3
      with:
        path: _site

  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

### Step 2: Enable GitHub Pages

1. Go to repository Settings → Pages
2. Set source to "GitHub Actions"
3. Push your code to trigger deployment

### Step 3: Verify Deployment

Visit `https://yourusername.github.io/your-repo-name/`

## Phase 7: Testing & Verification

### Checklist

- [ ] Development server runs without errors
- [ ] All sections appear in navigation
- [ ] Content pages render correctly
- [ ] Search functionality works
- [ ] Filter panel operates correctly
- [ ] Mobile responsive design works
- [ ] All internal links function
- [ ] Images load correctly
- [ ] GitHub Pages deployment succeeds
- [ ] No console errors in browser

### Common Issues

**Build Fails:**
- Check `.eleventy.js` syntax
- Verify all collections exist
- Ensure frontmatter is valid YAML

**Search Not Working:**
- Check `search-index.json` is generated
- Verify section names in `searchIndex` collection
- Check browser console for errors

**404 Errors on GitHub Pages:**
- Verify path prefix in `package.json`
- Ensure all links use `{{ url }}` filter
- Check GitHub Actions logs

## Phase 8: Ongoing Maintenance

### Regular Tasks

1. **Content Updates**: Add/edit markdown files as needed
2. **Dependency Updates**: Run `npm update` monthly
3. **Review Dates**: Update `lastReviewed` fields
4. **Search Index**: Rebuilds automatically on each build
5. **Deployment**: Automatic on push to main branch

### Adding New Features

1. **New Section**: Follow Phase 2 steps
2. **New Layout**: Create in `src/_layouts/`
3. **New Component**: Create in `src/_includes/`
4. **New Styles**: Add to `src/css/`
5. **New Scripts**: Add to `src/js/`

## Tips for AI Assistants

When helping users customize this template:

1. **Always read `site.json` first** to understand the current configuration
2. **Check `.eleventy.js`** to see existing collections and filters
3. **Verify section IDs match** across site.json, collections, and search index
4. **Test builds** after making changes (`npm run build`)
5. **Use consistent naming** (kebab-case for IDs, camelCase for collections)
6. **Preserve existing patterns** when adding new features
7. **Update search index** when adding new sections
8. **Document custom changes** for future reference

## Support Resources

- **Eleventy Docs**: https://www.11ty.dev/docs/
- **Nunjucks Docs**: https://mozilla.github.io/nunjucks/
- **Lunr.js Docs**: https://lunrjs.com/
- **Markdown Guide**: https://www.markdownguide.org/

## Next Steps

After setup is complete:

1. Add your first content files
2. Customize colors and branding
3. Test all functionality
4. Deploy to GitHub Pages
5. Share with users and gather feedback
6. Iterate and improve

Good luck with your new Eleventy site!
