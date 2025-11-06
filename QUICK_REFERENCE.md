# Twelvety Quick Reference Card

## 🎯 What Is This?

An **API-driven website generator** that converts markdown → validated content → production website in seconds.

---

## 📁 Project Structure

```
twelvety/
│
├── functions/              # Serverless API endpoints
│   ├── validate.js        # POST /api/validate - Validate markdown
│   ├── build.js           # POST /api/build - Trigger builds
│   └── build-status.js    # GET /api/build/{id}/status - Check status
│
├── scripts/               # Build utilities
│   ├── generate-search-index.js   # Create Lunr.js index
│   ├── validate-schema.js         # Validate JSON Schema
│   └── test-validation.js         # Test markdown validation
│
├── content/               # Your markdown content
│   ├── getting-started/   # Quick start guides
│   ├── guides/           # Tutorials
│   ├── api-reference/    # API docs
│   ├── faq/              # Questions
│   └── example/          # Templates
│
├── src/
│   ├── _data/site.json   # Config + Schema definition ⭐
│   ├── _layouts/         # Page templates
│   └── css/js/           # Styling & scripts
│
├── .github/workflows/
│   ├── build.yml         # New: API-triggered builds ⭐
│   └── deploy.yml        # Original: Auto-deploy
│
├── logs/
│   └── implementation-summary.md  # Full documentation ⭐
│
├── TWELVETY_README.md    # User guide ⭐
└── package.json          # Dependencies + scripts
```

---

## 🚀 Quick Commands

```bash
# Validate schema
npm run validate-schema

# Test markdown validation
npm run test

# Build site locally
npm run build

# Generate search index
npm run search-index

# Clean build directory
npm run clean

# Development server
npm run dev
```

---

## 📋 Markdown Template

```yaml
---
layout: content.njk              # Required
title: "Your Title"              # Required (1-200 chars)
category: getting-started        # Required (see categories below)
tags: [tag1, tag2]              # Optional (max 10)
audience: [developers]           # Optional (see audiences below)
dateAdded: "2024-11-06"         # Optional (YYYY-MM-DD)
lastReviewed: "2024-11-06"      # Optional (YYYY-MM-DD)
webglEmbed: "https://..."       # Optional (WebGL URL)
webglHeight: 600                # Optional (300-1200px)
---

# Your Content

Write markdown here...
```

### Valid Categories
- `getting-started`
- `guides`
- `api-reference`
- `faq`
- `example`

### Valid Audiences
- `developers`
- `designers`
- `managers`
- `students`

---

## 🔧 API Endpoints

### Validate Markdown
```bash
POST /api/validate
{
  "markdown": "---\ntitle: Test\n---\n# Content",
  "schemaUrl": "https://your-site.com/schema.json"
}
```

### Trigger Build
```bash
POST /api/build
{
  "markdown": "...",
  "projectId": "my-project",
  "metadata": {
    "author": "user@example.com",
    "title": "My Site"
  }
}
```

### Check Build Status
```bash
GET /api/build/{buildId}/status
```

---

## ⚙️ Environment Variables

```bash
# GitHub (Required)
GITHUB_TOKEN=ghp_...
GITHUB_ORG=your-org
GITHUB_REPO=twelvety

# AWS (Optional - for archives)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_BUCKET_NAME=twelvety-archives
AWS_DYNAMODB_TABLE=twelvety-builds

# Service URLs
SERVICE_URL=https://your-service.netlify.app
SITE_URL=https://your-org.github.io/twelvety
```

---

## 🎨 Key Features

✅ **Real-time validation** - Schema-based frontmatter checks  
✅ **Sub-5-second builds** - Incremental build support  
✅ **Client-side search** - Lunr.js full-text search  
✅ **Multi-channel output** - GitHub Pages + S3 archives  
✅ **WebGL ready** - Safe iframe embedding  
✅ **Full provenance** - Complete build audit trail  

---

## 📊 Build Workflow

```
1. User → Upload Markdown
          ↓
2. API → Validate Schema
          ↓
3. API → Trigger GitHub Actions
          ↓
4. GitHub → Build with Eleventy
          ↓
5. Output → GitHub Pages + S3
          ↓
6. User → Live website URL
```

---

## 🐛 Troubleshooting

**Build fails:**
- Check `.eleventy.js` for errors
- Verify frontmatter is valid YAML
- Run `npm run test` locally

**Validation fails:**
- Use string format for dates: `"2024-11-06"`
- Check category matches defined sections
- Ensure required fields present (title, category, layout)

**Search not working:**
- Run `npm run search-index` after build
- Check `_site/search-index.json` exists
- Clear browser cache

---

## 📚 Documentation

- **Full Summary:** `logs/implementation-summary.md`
- **User Guide:** `TWELVETY_README.md`
- **Strategy:** `.project/TECHNICAL_STRATEGY.md`
- **Implementation:** `.project/IMPLEMENTATION_GUIDE.md`

---

## 🚢 Deployment Steps

1. **Push to GitHub**
2. **Connect to Netlify** (auto-detects config)
3. **Add environment variables** (GitHub token, etc.)
4. **Enable GitHub Pages** (source: Actions)
5. **Test API endpoints**

---

## 📈 Performance

- Build Time: **< 0.3s** (local)
- Search Index: **91 KB** (6 docs)
- Pages Generated: **10**
- Lighthouse Score: **95+** (target)

---

## ✨ What's New vs. Original Template

| Feature | Original | Twelvety |
|---------|----------|----------|
| Build Method | Manual | API-triggered |
| Validation | None | JSON Schema |
| Collections | Manual | Auto-generated |
| Search Index | Manual | Auto-built |
| Workflows | 1 (deploy) | 2 (build + deploy) |
| API Functions | 0 | 3 (validate, build, status) |
| Scripts | 0 | 3 (search, validate, test) |

---

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** November 6, 2024
