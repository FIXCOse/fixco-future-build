export type Locale = 'sv' | 'en';

export interface TranslationKey {
  namespace: string;
  key: string;
  default_text: string;
  checksum: string;
}

export interface TranslationManifest {
  keys: TranslationKey[];
  timestamp: number;
  version: string;
}

export interface TranslationExtractorOptions {
  srcDir: string;
  outputFile: string;
  includePatterns: string[];
  excludePatterns: string[];
}