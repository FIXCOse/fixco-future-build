#!/usr/bin/env node

/**
 * Translation extraction script for Fixco i18n 2.0
 * Usage: npm run i18n:extract
 */

import { runExtractor } from '../src/lib/i18n/extractor.js';

async function main() {
  try {
    await runExtractor();
    console.log('✅ Translation extraction completed successfully');
  } catch (error) {
    console.error('❌ Translation extraction failed:', error);
    process.exit(1);
  }
}

main();