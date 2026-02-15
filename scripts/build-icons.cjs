/**
 * Scans all HTML files for iconoir-* class usage and generates
 * a custom CSS subset with only the icons actually used.
 *
 * Usage: node scripts/build-icons.js
 *        npm run icons
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, 'src/scss/iconoir-custom.css');
const FULL_CSS = path.join(ROOT, 'node_modules/iconoir/css/iconoir.css');
const HTML_GLOB = '*.html';

// Find all HTML files in project root
const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));

// Extract unique iconoir class names
const iconSet = new Set();
const iconRegex = /iconoir-[a-z0-9-]+/g;

for (const file of htmlFiles) {
  const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const matches = content.match(iconRegex);
  if (matches) matches.forEach(m => iconSet.add(m));
}

const icons = [...iconSet].sort();
console.log(`Found ${icons.length} unique icons across ${htmlFiles.length} HTML files:`);
icons.forEach(i => console.log(`  ${i}`));

// Read full Iconoir CSS
const css = fs.readFileSync(FULL_CSS, 'utf8');

// Extract base rules (the generic [class^=iconoir-] selectors)
const baseEnd = css.indexOf('.iconoir-');
const baseRules = css.substring(0, baseEnd).trim();

// Extract each icon rule
let output = baseRules + '\n\n';
let found = 0;

for (const icon of icons) {
  const regex = new RegExp(
    '\\.' + icon.replace(/-/g, '\\-') + '::before\\s*\\{[^}]+\\}'
  );
  const match = css.match(regex);
  if (match) {
    output += match[0] + '\n';
    found++;
  } else {
    console.warn(`  WARNING: ${icon} not found in iconoir CSS`);
  }
}

fs.writeFileSync(OUTPUT, output);

const originalSize = (css.length / 1024).toFixed(0);
const newSize = (output.length / 1024).toFixed(0);
const reduction = (100 - (output.length / css.length) * 100).toFixed(1);

console.log(`\n${found}/${icons.length} icons extracted`);
console.log(`${originalSize} KB → ${newSize} KB (${reduction}% reduction)`);
console.log(`Written to: ${path.relative(ROOT, OUTPUT)}`);
