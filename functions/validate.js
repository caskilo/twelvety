const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const matter = require('gray-matter');
const markdownIt = require('markdown-it');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true
});

/**
 * Netlify/Lambda Function: Markdown Validation Service
 * 
 * Validates markdown content against a JSON schema, parses frontmatter,
 * and renders preview HTML.
 * 
 * POST /api/validate
 * Body: { markdown: string, schemaUrl?: string }
 */
exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { markdown, schemaUrl } = JSON.parse(event.body);

    if (!markdown) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing markdown content' 
        })
      };
    }

    // Parse markdown frontmatter
    let frontmatter, content;
    try {
      const parsed = matter(markdown);
      frontmatter = parsed.data;
      content = parsed.content;
    } catch (err) {
      return {
        statusCode: 422,
        headers,
        body: JSON.stringify({
          status: 'invalid',
          errors: [{ 
            path: 'frontmatter',
            message: 'Invalid YAML frontmatter syntax',
            line: 1,
            details: err.message
          }]
        })
      };
    }

    // Fetch and validate against schema if provided
    if (schemaUrl) {
      let schema;
      try {
        const schemaResponse = await fetch(schemaUrl);
        if (!schemaResponse.ok) {
          throw new Error(`Schema fetch failed: ${schemaResponse.status}`);
        }
        schema = await schemaResponse.json();
      } catch (err) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Failed to fetch schema',
            details: err.message
          })
        };
      }

      // Validate frontmatter against schema
      const validate = ajv.compile(schema);
      const isValid = validate(frontmatter);

      if (!isValid) {
        return {
          statusCode: 422,
          headers,
          body: JSON.stringify({
            status: 'invalid',
            errors: validate.errors.map(err => ({
              path: err.instancePath || err.schemaPath,
              message: err.message,
              keyword: err.keyword,
              params: err.params
            }))
          })
        };
      }
    }

    // Render markdown preview
    const preview = md.render(content);

    // Calculate content metrics
    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200); // ~200 words per minute

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'valid',
        frontmatter,
        content,
        preview,
        metadata: {
          wordCount,
          readingTime,
          contentLength: content.length,
          hasImages: /<img|!\[/.test(content),
          hasCode: /```/.test(content)
        }
      })
    };
  } catch (error) {
    console.error('Validation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
