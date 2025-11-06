# Twelvety: Website-as-a-Service

> "Love building apps, hate making websites? **Twelvety** does it for you."

An API-driven website generation service that transforms markdown content into production-ready static sites in seconds. Built on Eleventy with real-time validation, incremental builds, and multi-channel delivery.

## 🎯 What is Twelvety?

Twelvety is a programmable static site generator that accepts markdown via API, validates structure in real-time, and deploys beautiful documentation sites automatically. Perfect for:

- **API Documentation**: Auto-generate docs from markdown
- **Knowledge Bases**: Deploy searchable content repositories
- **Project Documentation**: Create sites without manual deployment
- **Content Services**: Build sites programmatically from any source

## ✨ Key Features

### Validation & Quality
- ✅ Real-time markdown validation with JSON Schema
- 📝 Frontmatter schema enforcement
- 🔍 Live preview rendering
- 📊 Content metrics (word count, reading time)

### Fast Builds
- ⚡ Sub-5-second builds with Eleventy
- 🔄 Incremental build support (80% faster)
- 🐳 Docker-based reproducible environments
- 📦 Intelligent caching

### Search & Discovery
- 🔎 Client-side full-text search (Lunr.js)
- 🏷️ Tag-based filtering
- 👥 Audience targeting
- 📑 Auto-generated search index

### Multi-Channel Delivery
- 🌐 GitHub Pages deployment (free CDN)
- ☁️ S3 archive storage (7-year retention)
- 📥 Direct download links
- 🔗 Presigned URL generation

### WebGL Ready
- 🎮 Safe iframe sandboxing
- 🖼️ Same-origin embedding
- 📐 Configurable dimensions
- 🔒 Security-first approach

### Provenance & Audit
- 📜 Complete build history
- 🔐 Git commit tracking
- 📊 Build metadata
- 🕐 Timestamp trail

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
# Required for build API
GITHUB_TOKEN=your_github_token
GITHUB_ORG=your-org
GITHUB_REPO=twelvety

# Optional for S3 archives
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_BUCKET_NAME=twelvety-archives
```

### 3. Test Locally

```bash
# Validate schema
npm run validate-schema

# Test markdown validation
npm run test

# Build site
npm run build

# Generate search index
npm run search-index

# Development server
npm run dev
```

### 4. Deploy Functions

Deploy to Netlify (or configure AWS Lambda):

```bash
netlify deploy --prod
```

## 📡 API Usage

### Validate Markdown

```bash
POST /api/validate
Content-Type: application/json

{
  "markdown": "---\ntitle: Test\ncategory: example\nlayout: content.njk\n---\n# Content",
  "schemaUrl": "https://your-site.com/schema.json"
}
```

**Response:**
```json
{
  "status": "valid",
  "frontmatter": { "title": "Test", "category": "example" },
  "preview": "<h1>Content</h1>",
  "metadata": {
    "wordCount": 1,
    "readingTime": 1,
    "hasCode": false
  }
}
```

### Trigger Build

```bash
POST /api/build
Content-Type: application/json

{
  "markdown": "...",
  "projectId": "my-project",
  "metadata": {
    "author": "user@example.com",
    "title": "My Documentation"
  }
}
```

**Response:**
```json
{
  "status": "queued",
  "buildId": "uuid-here",
  "estimatedTime": 5,
  "pollingUrl": "/api/build/uuid-here/status"
}
```

### Check Build Status

```bash
GET /api/build/{buildId}/status
```

**Response:**
```json
{
  "buildId": "uuid-here",
  "status": "completed",
  "siteUrl": "https://your-org.github.io/twelvety/",
  "downloadUrl": "/download/uuid-here",
  "workflow": {
    "status": "completed",
    "conclusion": "success"
  }
}
```

## 📝 Content Schema

All markdown files must include valid frontmatter:

```yaml
---
layout: content.njk           # Required: always "content.njk"
title: Your Page Title        # Required: 1-200 characters
category: getting-started     # Required: one of defined sections
tags: [tag1, tag2]           # Optional: max 10 tags
audience: [developers]        # Optional: target audience
dateAdded: 2024-11-06        # Optional: YYYY-MM-DD format
lastReviewed: 2024-11-06     # Optional: YYYY-MM-DD format
webglEmbed: https://...      # Optional: WebGL content URL
webglHeight: 600             # Optional: 300-1200 pixels
---

# Your Content Here

Write your markdown content...
```

### Valid Categories

- `getting-started` - Quick start guides
- `guides` - Detailed tutorials
- `api-reference` - API documentation
- `faq` - Frequently asked questions
- `example` - Examples and templates

### Valid Audiences

- `developers`
- `designers`
- `managers`
- `students`

## 🏗️ Architecture

```
User Upload
    ↓
File Validation (client/server)
    ↓
Preview Rendering
    ↓
User Confirms
    ↓
GitHub Trigger (API)
    ↓
GitHub Actions Workflow
    ├── Docker Build Environment
    ├── Eleventy Build (incremental)
    ├── Search Index Generation
    └── Asset Processing
    ↓
Multi-Channel Output
    ├── GitHub Pages (live site)
    ├── S3 Archive (provenance)
    └── GitHub Releases (download)
```

## 🔧 Scripts Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server with live reload |
| `npm run build` | Production build |
| `npm run build:gh` | Build with GitHub Pages prefix |
| `npm run search-index` | Generate search index |
| `npm run validate-schema` | Validate JSON schema |
| `npm run test` | Test validation locally |
| `npm run clean` | Remove build directory |

## 📂 Project Structure

```
twelvety/
├── content/                    # Markdown content
│   ├── getting-started/
│   ├── guides/
│   ├── api-reference/
│   ├── faq/
│   └── example/
├── functions/                  # Serverless API functions
│   ├── validate.js            # Validation endpoint
│   ├── build.js               # Build trigger
│   └── build-status.js        # Status polling
├── scripts/                    # Build scripts
│   ├── generate-search-index.js
│   ├── validate-schema.js
│   └── test-validation.js
├── src/
│   ├── _data/
│   │   └── site.json          # Schema & config
│   ├── _includes/             # Components
│   ├── _layouts/              # Page templates
│   ├── css/                   # Styles
│   ├── js/                    # Client scripts
│   └── assets/                # Static files
├── .github/workflows/
│   ├── build.yml              # Build workflow
│   └── deploy.yml             # Deploy workflow
├── .eleventy.js               # Eleventy config
├── netlify.toml               # Netlify config
├── package.json
└── .env.example               # Environment template
```

## 🔐 Security

- **Validation**: Dual-layer (client + server) validation
- **Sandboxing**: WebGL content in restricted iframes
- **Authentication**: GitHub token-based access
- **CORS**: Configurable origin restrictions
- **Secrets**: Never commit `.env` file

## 🚢 Deployment

### GitHub Pages

1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Push changes to `main` branch
4. Workflow auto-deploys to Pages

### Netlify (Functions)

1. Connect repository to Netlify
2. Configure environment variables
3. Deploy with `netlify deploy --prod`
4. Functions auto-deploy to `/.netlify/functions/`

### AWS Lambda (Alternative)

1. Package functions with dependencies
2. Deploy to Lambda via SAM or Serverless
3. Configure API Gateway routes
4. Set environment variables

## 📊 Performance

- **Build Time**: < 5 seconds (incremental)
- **First Build**: < 10 seconds (full)
- **Search Index**: < 100ms client-side
- **Lighthouse Score**: 95+ (all metrics)

## 🤝 Contributing

Contributions welcome! Areas for improvement:

- [ ] React/Vue upload UI component
- [ ] Additional schema validators
- [ ] Performance monitoring dashboard
- [ ] A/B testing framework
- [ ] Multi-language support

## 📄 License

MIT License - use freely for any purpose.

## 🙏 Credits

Built with:
- [Eleventy](https://www.11ty.dev/) - Static site generator
- [Lunr.js](https://lunrjs.com/) - Client-side search
- [AJV](https://ajv.js.org/) - JSON Schema validation
- [GitHub Actions](https://github.com/features/actions) - CI/CD
- [Netlify](https://www.netlify.com/) - Serverless functions

## 📚 Documentation

- [Quick Start Guide](/content/getting-started/quick-start.md)
- [API Reference](/content/api-reference/validation-api.md)
- [Original Template README](README.md)
- [Implementation Guide](.project/IMPLEMENTATION_GUIDE.md)
- [Technical Strategy](.project/TECHNICAL_STRATEGY.md)

---

**Twelvety** - Making beautiful websites, programmatically.
