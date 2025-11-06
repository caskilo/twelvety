const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  // GitHub Pages configuration
  const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || "";
  
  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight);

  // Pass-through file copy
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "node_modules/lunr/lunr.js": "js/vendor/lunr.js" });

  // ============================================
  // COLLECTIONS - Add one for each content section
  // ============================================
  // Example:
  // eleventyConfig.addCollection("sectionName", function(collectionApi) {
  //   return collectionApi.getFilteredByGlob("content/section-name/**/*.md");
  // });
  
  eleventyConfig.addCollection("example", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/example/**/*.md");
  });

  // ============================================
  // FILTERS - Utility functions for templates
  // ============================================
  
  // Format dates in readable format
  eleventyConfig.addFilter("readableDate", dateObj => {
    return new Date(dateObj).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  // Map section IDs to collection keys (handles kebab-case to camelCase)
  eleventyConfig.addFilter("sectionCollectionKey", function(sectionId) {
    if (!sectionId) return '';
    // Add mappings for sections with hyphens
    const map = {
      // "section-with-hyphen": "sectionWithHyphen"
    };
    return map[sectionId] || sectionId;
  });

  // Find a section by ID
  eleventyConfig.addFilter("findSection", function(sections, id) {
    if (!Array.isArray(sections) || !id) return null;
    return sections.find(section => section.id === id) || null;
  });

  // Filter items by category
  eleventyConfig.addFilter("filterByCategory", function(items, category) {
    if (!Array.isArray(items) || !category) return [];
    return items.filter(item => {
      const cat = item.data && item.data.category;
      if (Array.isArray(cat)) {
        return cat.includes(category);
      }
      return cat === category;
    });
  });

  // Display tags as HTML
  eleventyConfig.addFilter("tagList", tags => {
    if (!Array.isArray(tags)) return '';
    return tags.map(tag => `<span class="tag">${tag}</span>`).join(' ');
  });

  // ============================================
  // SEARCH INDEX - Auto-generates search data
  // ============================================
  
  eleventyConfig.addCollection("searchIndex", function(collectionApi) {
    const allContent = [];
    
    // Add your section names here to include them in search
    const sections = ['example'];
    
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

  // ============================================
  // CONFIGURATION
  // ============================================
  
  return {
    dir: {
      input: "content",
      includes: "../src/_includes",
      layouts: "../src/_layouts",
      data: "../src/_data",
      output: "_site"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix: pathPrefix
  };
};
