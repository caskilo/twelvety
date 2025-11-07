#!/usr/bin/env node

/**
 * Build script to create a browser-compatible Lunr bundle using browserify
 * Outputs to src/js/vendor/lunr.js
 */

const browserify = require('browserify');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../src/js/vendor');
const outputFile = path.join(outputDir, 'lunr.js');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Building Lunr browser bundle...');

// Create browserify bundle
const b = browserify({
  entries: [require.resolve('lunr')],
  standalone: 'lunr',
  builtins: false,
  commondir: false
});

// Write bundle to file
b.bundle()
  .on('error', (err) => {
    console.error('Browserify error:', err);
    process.exit(1);
  })
  .pipe(fs.createWriteStream(outputFile))
  .on('finish', () => {
    console.log(`✓ Lunr bundle created at ${outputFile}`);
    console.log(`  Bundle size: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB`);
  })
  .on('error', (err) => {
    console.error('Write stream error:', err);
    process.exit(1);
  });
