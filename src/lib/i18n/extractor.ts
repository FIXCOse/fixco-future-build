import * as fs from 'fs';
import * as path from 'path';
import CryptoJS from 'crypto-js';
import { TranslationKey, TranslationManifest } from './types';

// RegEx patterns to match translation calls
const TRANSLATION_PATTERNS = [
  // t('namespace.key', { defaultValue: 'text' })
  /\bt\(\s*['"`]([^'"`]+)['"`]\s*,\s*\{[^}]*defaultValue:\s*['"`]([^'"`]+)['"`]/g,
  // t('namespace.key', 'defaultValue')
  /\bt\(\s*['"`]([^'"`]+)['"`]\s*,\s*['"`]([^'"`]+)['"`]/g,
];

interface ExtractedTranslation {
  key: string;
  defaultValue: string;
  file: string;
  line: number;
}

export class TranslationExtractor {
  private srcDir: string;
  private includePatterns: string[];
  private excludePatterns: string[];

  constructor(options: {
    srcDir: string;
    includePatterns?: string[];
    excludePatterns?: string[];
  }) {
    this.srcDir = options.srcDir;
    this.includePatterns = options.includePatterns || ['**/*.{ts,tsx,js,jsx}'];
    this.excludePatterns = options.excludePatterns || [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/*.test.*',
      '**/*.spec.*'
    ];
  }

  /**
   * Extract translations from all source files
   */
  async extract(): Promise<TranslationManifest> {
    const files = await this.getSourceFiles();
    const extractedTranslations: ExtractedTranslation[] = [];

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      const translations = this.extractFromContent(content, file);
      extractedTranslations.push(...translations);
    }

    // Convert to TranslationKey format
    const keys = this.processExtractedTranslations(extractedTranslations);

    return {
      keys,
      timestamp: Date.now(),
      version: '1.0.0'
    };
  }

  /**
   * Extract translations from file content
   */
  private extractFromContent(content: string, filePath: string): ExtractedTranslation[] {
    const extracted: ExtractedTranslation[] = [];
    const lines = content.split('\n');

    for (const pattern of TRANSLATION_PATTERNS) {
      let match;
      pattern.lastIndex = 0; // Reset regex state

      while ((match = pattern.exec(content)) !== null) {
        const [, key, defaultValue] = match;
        
        // Find line number
        const lineIndex = content.substring(0, match.index).split('\n').length;
        
        extracted.push({
          key: key.trim(),
          defaultValue: defaultValue.trim(),
          file: filePath,
          line: lineIndex
        });
      }
    }

    return extracted;
  }

  /**
   * Process extracted translations and convert to TranslationKey format
   */
  private processExtractedTranslations(extracted: ExtractedTranslation[]): TranslationKey[] {
    const keyMap = new Map<string, TranslationKey>();

    for (const item of extracted) {
      const parts = item.key.split('.');
      if (parts.length < 2) {
        console.warn(`Invalid translation key format: ${item.key} in ${item.file}:${item.line}`);
        continue;
      }

      const namespace = parts[0];
      const key = parts.slice(1).join('.');

      const translationKey: TranslationKey = {
        namespace,
        key,
        default_text: item.defaultValue,
        checksum: CryptoJS.MD5(item.defaultValue).toString()
      };

      const mapKey = `${namespace}.${key}`;
      
      // Check for conflicts (same key, different default text)
      if (keyMap.has(mapKey)) {
        const existing = keyMap.get(mapKey)!;
        if (existing.default_text !== translationKey.default_text) {
          console.error(
            `Translation key conflict: ${mapKey}\n` +
            `  Existing: "${existing.default_text}"\n` +
            `  New: "${translationKey.default_text}" in ${item.file}:${item.line}`
          );
          process.exit(1);
        }
      } else {
        keyMap.set(mapKey, translationKey);
      }
    }

    return Array.from(keyMap.values());
  }

  /**
   * Get all source files to scan
   */
  private async getSourceFiles(): Promise<string[]> {
    const files: string[] = [];
    
    const scanDirectory = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          // Skip excluded directories
          if (this.shouldExclude(fullPath)) continue;
          scanDirectory(fullPath);
        } else if (entry.isFile()) {
          // Include matching files
          if (this.shouldInclude(fullPath)) {
            files.push(fullPath);
          }
        }
      }
    };

    scanDirectory(this.srcDir);
    return files;
  }

  /**
   * Check if path should be included
   */
  private shouldInclude(filePath: string): boolean {
    const ext = path.extname(filePath);
    return ['.ts', '.tsx', '.js', '.jsx'].includes(ext);
  }

  /**
   * Check if path should be excluded
   */
  private shouldExclude(filePath: string): boolean {
    const relativePath = path.relative(this.srcDir, filePath);
    
    return this.excludePatterns.some(pattern => {
      // Simple pattern matching
      if (pattern.includes('**')) {
        const regex = new RegExp(
          pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*')
        );
        return regex.test(relativePath);
      }
      return relativePath.includes(pattern.replace(/\*/g, ''));
    });
  }

  /**
   * Send extracted translations to the ingest endpoint
   */
  async sendToIngest(manifest: TranslationManifest, endpoint: string): Promise<void> {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keys: manifest.keys })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Ingest failed: ${response.status} ${error}`);
      }

      const result = await response.json();
      console.log(`✅ Translation ingest completed:`, result);
    } catch (error) {
      console.error('❌ Translation ingest failed:', error);
      throw error;
    }
  }
}

/**
 * CLI function for extracting translations
 */
export async function runExtractor() {
  const extractor = new TranslationExtractor({
    srcDir: './src'
  });

  console.log('🔍 Extracting translations...');
  const manifest = await extractor.extract();
  
  console.log(`📝 Found ${manifest.keys.length} translation keys`);
  
  // Write manifest for debugging
  fs.writeFileSync(
    './translation-manifest.json', 
    JSON.stringify(manifest, null, 2)
  );

  // Send to ingest endpoint
  const INGEST_ENDPOINT = process.env.VITE_SUPABASE_URL 
    ? `${process.env.VITE_SUPABASE_URL}/functions/v1/translate-ingest`
    : 'http://localhost:54321/functions/v1/translate-ingest';

  try {
    await extractor.sendToIngest(manifest, INGEST_ENDPOINT);
  } catch (error) {
    console.error('Failed to send translations to ingest endpoint');
    process.exit(1);
  }
}