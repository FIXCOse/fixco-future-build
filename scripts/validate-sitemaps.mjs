#!/usr/bin/env node
/**
 * Post-build sitemap validation script.
 * Checks all generated sitemap files in dist/ for correctness.
 *
 * Usage: node scripts/validate-sitemaps.mjs
 */
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const DIST = 'dist';
const errors = [];

function fail(file, msg) {
  errors.push(`❌ ${file}: ${msg}`);
}

function pass(file, msg) {
  console.log(`  ✅ ${file}: ${msg}`);
}

// Find all sitemap XML files
const files = readdirSync(DIST).filter(f => f.startsWith('sitemap') && f.endsWith('.xml'));

if (files.length === 0) {
  console.error('❌ No sitemap files found in dist/');
  process.exit(1);
}

console.log(`\n🔍 Validating ${files.length} sitemap files...\n`);

for (const file of files) {
  const content = readFileSync(join(DIST, file), 'utf-8');

  // 1. No BOM or leading whitespace
  if (content.charCodeAt(0) === 0xFEFF) {
    fail(file, 'Contains BOM character');
  }
  if (/^\s/.test(content)) {
    fail(file, 'Starts with whitespace');
  }

  // 2. Must start with valid root tag (with or without XML declaration)
  const stripped = content.replace(/^<\?xml[^?]*\?>\s*/, '');
  const isIndex = stripped.startsWith('<sitemapindex');
  const isUrlset = stripped.startsWith('<urlset');
  if (!isIndex && !isUrlset) {
    fail(file, `Invalid root element — starts with: ${stripped.slice(0, 60)}`);
    continue;
  }

  // 3. Correct namespace
  if (!content.includes('http://www.sitemaps.org/schemas/sitemap/0.9')) {
    fail(file, 'Missing sitemap namespace');
  }

  // 4. Check for duplicate <loc> entries
  const locs = [...content.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const unique = new Set(locs);
  if (locs.length !== unique.size) {
    const dupes = locs.filter((l, i) => locs.indexOf(l) !== i);
    fail(file, `${dupes.length} duplicate <loc> entries (first: ${dupes[0]})`);
  }

  // 4b. Check for non-ASCII characters in URLs (å, ä, ö etc.)
  const nonAscii = locs.filter(l => /[^\x20-\x7E]/.test(l));
  if (nonAscii.length > 0) {
    fail(file, `${nonAscii.length} URLs contain non-ASCII characters (first: ${nonAscii[0]})`);
  }

  // 5. Reasonable size check (warn if > 50MB or < 50 bytes)
  if (content.length < 50) {
    fail(file, `Suspiciously small (${content.length} bytes)`);
  }
  if (content.length > 50 * 1024 * 1024) {
    fail(file, `Exceeds 50MB limit (${(content.length / 1024 / 1024).toFixed(1)}MB)`);
  }

  // 6. URL count
  if (isIndex) {
    const sitemapCount = (content.match(/<sitemap>/g) || []).length;
    pass(file, `Sitemap index with ${sitemapCount} child sitemaps`);
  } else {
    pass(file, `${locs.length} URLs`);
  }
}

console.log('');

if (errors.length > 0) {
  console.error('Sitemap validation FAILED:\n');
  errors.forEach(e => console.error(e));
  process.exit(1);
} else {
  console.log(`✅ All ${files.length} sitemap files are valid!\n`);
}
