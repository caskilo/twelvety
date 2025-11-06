#!/usr/bin/env node

/**
 * Schema Validation Utility
 * 
 * Validates that the frontmatter schema in site.json is a valid JSON Schema.
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const SITE_DATA_PATH = path.join(__dirname, '../src/_data/site.json');

function validateSchema() {
  console.log('🔍 Validating frontmatter schema...\n');

  // Load site.json
  if (!fs.existsSync(SITE_DATA_PATH)) {
    console.error(`❌ Error: ${SITE_DATA_PATH} not found\n`);
    process.exit(1);
  }

  let siteData;
  try {
    const content = fs.readFileSync(SITE_DATA_PATH, 'utf-8');
    siteData = JSON.parse(content);
  } catch (err) {
    console.error(`❌ Error parsing site.json:`, err.message);
    process.exit(1);
  }

  // Check if frontmatterSchema exists
  if (!siteData.frontmatterSchema) {
    console.error(`❌ Error: No 'frontmatterSchema' field found in site.json\n`);
    process.exit(1);
  }

  // Validate that it's a valid JSON Schema
  const ajv = new Ajv();
  addFormats(ajv);
  
  try {
    // Try to compile the schema - if it's valid JSON Schema, this will succeed
    const validate = ajv.compile(siteData.frontmatterSchema);
    const isValid = true;

    if (!isValid) {
      console.error('❌ Schema validation failed:\n');
      validate.errors.forEach(err => {
        console.error(`   - ${err.instancePath}: ${err.message}`);
      });
      console.error('');
      process.exit(1);
    }

    console.log('✅ Schema is valid JSON Schema (Draft 7)\n');
    
    // Display schema info
    const schema = siteData.frontmatterSchema;
    console.log('📋 Schema details:');
    console.log(`   Type: ${schema.type}`);
    console.log(`   Required fields: ${schema.required ? schema.required.join(', ') : 'none'}`);
    console.log(`   Properties: ${schema.properties ? Object.keys(schema.properties).length : 0}`);
    console.log('');

    if (schema.properties) {
      console.log('📝 Property definitions:');
      Object.entries(schema.properties).forEach(([key, def]) => {
        const type = def.type || 'any';
        const required = schema.required?.includes(key) ? ' (required)' : '';
        const desc = def.description ? ` - ${def.description}` : '';
        console.log(`   - ${key}: ${type}${required}${desc}`);
      });
      console.log('');
    }

    console.log('✅ All checks passed!\n');
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  validateSchema();
}

module.exports = { validateSchema };
