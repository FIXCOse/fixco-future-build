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
  
  const stemmedTerm = stemSwedish(term);
  
  // 1. Direct matching (case-insensitive)
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();
  const subCatLower = subCategory.toLowerCase();
  
  if (titleLower.includes(term)) return true;
  if (descLower.includes(term)) return true;
  if (subCatLower.includes(term)) return true;
  
  // 2. Stemmed matching on title words
  const titleWords = titleLower.split(/\s+/);
  for (const word of titleWords) {
    const stemmedWord = stemSwedish(word);
    // Check if stems match (allowing partial match for short search terms)
    if (stemmedWord.startsWith(stemmedTerm) || stemmedTerm.startsWith(stemmedWord)) {
      return true;
    }
  }
  
  // 3. Stemmed matching on description words
  const descWords = descLower.split(/\s+/);
  for (const word of descWords) {
    const stemmedWord = stemSwedish(word);
    if (stemmedWord.startsWith(stemmedTerm) || stemmedTerm.startsWith(stemmedWord)) {
      return true;
    }
  }
  
  // 4. Keyword matching (from database)
  if (searchKeywords) {
    const keywords = searchKeywords.toLowerCase().split(',').map(k => k.trim());
    for (const kw of keywords) {
      // Direct keyword match
      if (kw.includes(term)) return true;
      // Stemmed keyword match
      const stemmedKeyword = stemSwedish(kw);
      if (stemmedKeyword.startsWith(stemmedTerm) || stemmedTerm.startsWith(stemmedKeyword)) {
        return true;
      }
    }
  }
  
  return false;
}
