/**
 * Simple Swedish stemmer for search purposes
 * Removes common Swedish suffixes to find word roots
 */
export function stemSwedish(word: string): string {
  let stem = word.toLowerCase().trim();
  
  // Too short to stem
  if (stem.length <= 3) return stem;
  
  // Common Swedish suffixes (ordered by length, longest first)
  const suffixes = [
    'ningarna', 'ningars', 'eringarna', 'eringen',
    'ningar', 'ningen', 'ering', 'arna', 'aren', 'erna', 'orna',
    'ning', 'are', 'ade', 'ast', 'igt', 'het', 'lig',
    'ar', 'or', 'er', 'en', 'et', 'na', 'ne', 'an', 'a', 's'
  ];
  
  for (const suffix of suffixes) {
    // Ensure we keep at least 2 characters of the stem
    if (stem.length > suffix.length + 2 && stem.endsWith(suffix)) {
      return stem.slice(0, -suffix.length);
    }
  }
  
  return stem;
}

/**
 * Check if a search term matches a service using intelligent matching
 * Uses direct matching, stemmed matching, and keyword matching
 */
export function matchesSearchTerm(
  searchTerm: string,
  title: string,
  description: string,
  subCategory: string,
  searchKeywords?: string | null
): boolean {
  const term = searchTerm.toLowerCase().trim();
  
  if (!term) return true;
  if (term.length < 2) return true; // Too short to search
  
  const stemmedTerm = stemSwedish(term);
  
  // 1. Direct matching (case-insensitive) - only title and sub-category, NOT description (too imprecise)
  const titleLower = title.toLowerCase();
  const subCatLower = subCategory.toLowerCase();
  
  if (titleLower.includes(term)) return true;
  if (subCatLower.includes(term)) return true;
  
  // 2. Stemmed matching on title words (strict - only stemmedWord.startsWith)
  const titleWords = titleLower.split(/\s+/).filter(w => w.length > 0);
  for (const word of titleWords) {
    if (word.length < 3) continue; // Skip short words
    const stemmedWord = stemSwedish(word);
    if (stemmedWord.length >= 3 && stemmedTerm.length >= 3) {
      if (stemmedWord.startsWith(stemmedTerm)) {
        return true;
      }
    }
  }
  
  // 3. Keyword matching (from database) - most reliable
  if (searchKeywords) {
    const keywords = searchKeywords.toLowerCase().split(',').map(k => k.trim()).filter(k => k.length > 0);
    for (const kw of keywords) {
      // Exact keyword match (highest priority)
      if (kw === term) return true;
      // Keyword starts with search term
      if (kw.startsWith(term)) return true;
      // Search term starts with keyword (for short keywords)
      if (term.startsWith(kw) && kw.length >= 3) return true;
      // Keyword contains search term
      if (kw.includes(term) && term.length >= 3) return true;
      // Stemmed keyword match
      const stemmedKeyword = stemSwedish(kw);
      if (stemmedKeyword.length >= 3 && stemmedTerm.length >= 3) {
        if (stemmedKeyword.startsWith(stemmedTerm)) {
          return true;
        }
      }
    }
  }
  
  return false;
}
