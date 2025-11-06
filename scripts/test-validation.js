#!/usr/bin/env node

/**
 * Test Validation Script
 * 
 * Tests markdown validation locally without deploying functions.
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const matter = require('gray-matter');

const SITE_DATA_PATH = path.join(__dirname, '../src/_data/site.json');
const EXAMPLE_CONTENT_PATH = path.join(__dirname, '../content/example');

async function testValidation() {
  console.log('🧪 Testing markdown validation...\n');

  // Load schema
  const siteData = JSON.parse(fs.readFileSync(SITE_DATA_PATH, 'utf-8'));
  const schema = siteData.frontmatterSchema;

  if (!schema) {
    console.error('❌ No frontmatterSchema found in site.json\n');
    process.exit(1);
  }

  console.log('📋 Using schema from site.json');
  console.log(`   Required fields: ${schema.required.join(', ')}\n`);

  // Find example markdown files
  let testFiles = [];
  if (fs.existsSync(EXAMPLE_CONTENT_PATH)) {
    testFiles = fs.readdirSync(EXAMPLE_CONTENT_PATH)
      .filter(f => f.endsWith('.md'))
      .map(f => path.join(EXAMPLE_CONTENT_PATH, f));
  }

  if (testFiles.length === 0) {
    console.warn('⚠️  No example files found. Creating test markdown...\n');
    testFiles = [createTestFile()];
  }

  console.log(`📝 Testing ${testFiles.length} file(s)...\n`);

  // Initialize validator
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  let passCount = 0;
  let failCount = 0;

  // Test each file
  testFiles.forEach((filePath, index) => {
    const fileName = path.basename(filePath);
    console.log(`${index + 1}. Testing: ${fileName}`);

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data: frontmatter, content: body } = matter(content);

      const isValid = validate(frontmatter);

      if (isValid) {
        console.log('   ✅ Valid');
        console.log(`      Title: ${frontmatter.title}`);
        console.log(`      Category: ${frontmatter.category}`);
        if (frontmatter.tags) {
          console.log(`      Tags: ${frontmatter.tags.join(', ')}`);
        }
        passCount++;
      } else {
        console.log('   ❌ Invalid');
        validate.errors.forEach(err => {
          console.log(`      - ${err.instancePath || 'root'}: ${err.message}`);
        });
        failCount++;
      }
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
      failCount++;
    }

    console.log('');
  });

  // Summary
  console.log('═══════════════════════════════════════');
  console.log(`Total: ${testFiles.length} | Pass: ${passCount} | Fail: ${failCount}`);
  console.log('═══════════════════════════════════════\n');

  if (failCount > 0) {
    console.log('💡 Fix validation errors in your markdown frontmatter\n');
    process.exit(1);
  } else {
    console.log('✅ All validations passed!\n');
  }
}

function createTestFile() {
  const testContent = `---
title: Test Document
category: example
layout: content.njk
tags: [test, sample]
audience: [General]
dateAdded: 2024-11-06
lastReviewed: 2024-11-06
---

# Test Content

This is a test markdown document for validation.
`;

  const testPath = path.join(__dirname, '../content/test-validation.md');
  fs.writeFileSync(testPath, testContent, 'utf-8');
  console.log(`   Created test file: ${testPath}\n`);
  return testPath;
}

// Run if called directly
if (require.main === module) {
  testValidation().catch(err => {
    console.error('❌ Fatal error:', err.message);
    process.exit(1);
  });
}

module.exports = { testValidation };
