# Template Setup Checklist

Use this checklist when setting up a new site from this template.

## Initial Setup

- [ ] Copy all files from `_site_template` to your new project directory
- [ ] Run `npm install` to install dependencies
- [ ] Update `package.json` with your project details
- [ ] Update `src/_data/site.json` with your site information

## Configuration

### Site Metadata (src/_data/site.json)

- [ ] Set `name` to your site name
- [ ] Set `description` for meta tags
- [ ] Set `organization` name
- [ ] Set `url` to your production URL
- [ ] Define your content `sections`
- [ ] Customize `audienceTypes` for your use case
- [ ] Customize `evidenceLevels` if needed

### Build Configuration (package.json)

- [ ] Update `name` field
- [ ] Update `description` field
- [ ] Update `author` field
- [ ] Update `build:gh` script with your repo name: `/your-repo-name`

### Eleventy Configuration (.eleventy.js)

- [ ] Add collections for each content section
- [ ] Update `sectionCollectionKey` filter for hyphenated section IDs
- [ ] Add all sections to `searchIndex` collection
- [ ] Verify passthrough copy paths

## Content Structure

### Sections

For each content section:

- [ ] Create directory: `content/section-name/`
- [ ] Create index file: `content/section-name/index.njk`
- [ ] Add section to `site.json`
- [ ] Add collection to `.eleventy.js`
- [ ] Add to search index in `.eleventy.js`
- [ ] Test section loads correctly

### Homepage

- [ ] Customize `content/index.md`
- [ ] Update hero text
- [ ] Verify section grid displays correctly

### Sample Content

- [ ] Remove or replace `content/example/` directory
- [ ] Add your first real content files
- [ ] Test content rendering

## Styling

### Branding

- [ ] Replace `src/assets/logo.svg` with your logo
- [ ] Add favicon to `src/assets/`
- [ ] Update CSS variables in `src/css/main.css`:
  - [ ] Primary color
  - [ ] Secondary color
  - [ ] Accent color
  - [ ] Font families
  - [ ] Spacing units

### Layout

- [ ] Review and adjust container max-width
- [ ] Test responsive breakpoints
- [ ] Verify mobile navigation works
- [ ] Check header height and sticky behavior

## Components

### Header (src/_includes/header.njk)

- [ ] Verify logo path and alt text
- [ ] Test search functionality
- [ ] Check navigation toggle
- [ ] Test filter button (if using)

### Navigation (src/_includes/nav.njk)

- [ ] Verify all sections appear
- [ ] Test navigation links
- [ ] Check mobile menu behavior
- [ ] Test filter panel (if using)

### Footer (src/_includes/footer.njk)

- [ ] Update footer links
- [ ] Verify copyright year
- [ ] Test all footer links
- [ ] Update contact information

## Functionality

### Search

- [ ] Test search with sample content
- [ ] Verify search index generates
- [ ] Check search results display correctly
- [ ] Test search on mobile
- [ ] Verify section labels in results

### Filters

- [ ] Test audience filters
- [ ] Test evidence level filters
- [ ] Test filter combinations
- [ ] Verify "Clear All" works
- [ ] Check filter persistence

### Navigation

- [ ] Test section navigation
- [ ] Verify back button functionality
- [ ] Test breadcrumb navigation (if added)
- [ ] Check keyboard navigation
- [ ] Test with screen reader (accessibility)

## GitHub Pages Deployment

### Repository Setup

- [ ] Create GitHub repository
- [ ] Push code to repository
- [ ] Enable GitHub Pages in repository settings
- [ ] Set source to "GitHub Actions"

### Workflow Configuration

- [ ] Verify `.github/workflows/deploy.yml` exists
- [ ] Check Node.js version (18 recommended)
- [ ] Verify build command is correct
- [ ] Test workflow runs successfully

### Path Prefix

- [ ] Confirm `build:gh` script has correct path prefix
- [ ] Verify all links use `{{ url }}` filter
- [ ] Test assets load correctly on GitHub Pages
- [ ] Check search index URL is correct

## Testing

### Local Testing

- [ ] Run `npm run dev` - no errors
- [ ] Test all pages load
- [ ] Test all links work
- [ ] Test search functionality
- [ ] Test filters
- [ ] Test on different browsers
- [ ] Test on mobile devices

### Build Testing

- [ ] Run `npm run build` - no errors
- [ ] Run `npm run build:gh` - no errors
- [ ] Verify `_site` directory structure
- [ ] Check `search-index.json` is generated
- [ ] Verify all assets are copied

### Production Testing

- [ ] Deploy to GitHub Pages
- [ ] Test live site loads
- [ ] Test all navigation
- [ ] Test search on live site
- [ ] Test on multiple devices
- [ ] Check browser console for errors
- [ ] Verify analytics (if added)

## Content Guidelines

### Frontmatter

- [ ] Document required fields for your team
- [ ] Create frontmatter templates
- [ ] Establish naming conventions
- [ ] Define tag taxonomy
- [ ] Set review schedule

### Writing Style

- [ ] Establish style guide
- [ ] Define tone and voice
- [ ] Create content templates
- [ ] Set formatting standards
- [ ] Document markdown usage

## Maintenance

### Regular Tasks

- [ ] Set up content review schedule
- [ ] Plan dependency updates (monthly)
- [ ] Monitor build times
- [ ] Check for broken links
- [ ] Review analytics

### Documentation

- [ ] Document custom changes
- [ ] Create contributor guide
- [ ] Document deployment process
- [ ] Create troubleshooting guide
- [ ] Maintain changelog

## Optional Enhancements

### Features to Consider

- [ ] Add RSS feed
- [ ] Add sitemap.xml
- [ ] Add robots.txt
- [ ] Implement analytics
- [ ] Add social media meta tags
- [ ] Add print stylesheets
- [ ] Implement dark mode
- [ ] Add breadcrumbs
- [ ] Add related content suggestions
- [ ] Add table of contents for long pages

### Integrations

- [ ] Form submission service
- [ ] Comment system
- [ ] Newsletter signup
- [ ] Social sharing buttons
- [ ] External search (Algolia, etc.)

## Pre-Launch Checklist

### Final Review

- [ ] All placeholder content removed
- [ ] All links tested
- [ ] All images optimized
- [ ] All pages have meta descriptions
- [ ] Favicon displays correctly
- [ ] 404 page customized
- [ ] Loading performance acceptable
- [ ] Accessibility tested
- [ ] SEO basics implemented
- [ ] Mobile experience polished

### Launch Preparation

- [ ] Backup current site (if replacing)
- [ ] Set up custom domain (if using)
- [ ] Configure SSL/HTTPS
- [ ] Set up monitoring
- [ ] Prepare launch announcement
- [ ] Train content editors
- [ ] Document support process

## Post-Launch

### Immediate Tasks

- [ ] Monitor for errors
- [ ] Check analytics setup
- [ ] Verify search indexing
- [ ] Test user feedback
- [ ] Address any issues

### Ongoing

- [ ] Regular content updates
- [ ] Dependency updates
- [ ] Performance monitoring
- [ ] User feedback collection
- [ ] Feature enhancements

---

## Notes

Use this space to document any custom changes or decisions:

```
[Your notes here]
```

---

**Template Version**: 1.0  
**Last Updated**: 2024-11-06  
**Checklist Status**: ☐ Not Started | ◐ In Progress | ☑ Complete
