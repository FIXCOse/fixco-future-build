// Advanced Knowledge Base with Semantic Search
import { servicesDataNew } from '@/data/servicesDataNew';
import { KnowledgeItem, SearchResult } from './types';

export class KnowledgeBase {
  private items: KnowledgeItem[] = [];
  private synonyms: Record<string, string[]> = {
    // El synonymer
    'eluttag': ['vägguttag', 'uttag', 'elstop', 'kontakt'],
    'strömbrytare': ['switch', 'ljusbrytare', 'brytare'],
    'dimmer': ['ljusdämpare', 'dimrar', 'ljusreglage'],
    'spotlights': ['spots', 'downlights', 'taklampor', 'inbyggnadslampor'],
    
    // VVS synonymer
    'blandare': ['kran', 'vattenkran', 'tvättställsblandare'],
    'toalett': ['wc', 'toalettstol', 'klosett', 'toalettskål'],
    'diskmaskin': ['diskho', 'diskmaskinsinstallation'],
    'tvättmaskin': ['tvättho', 'tvättmaskinsinstallation'],
    
    // Snickeri synonymer
    'garderob': ['klädkammare', 'klädförvaring', 'walk-in-closet'],
    'kök': ['köksinredning', 'köksrenovering', 'köksluckor'],
    
    // Lägesord
    'inomhus': ['inne', 'invändigt', 'inuti', 'innemiljö'],
    'utomhus': ['ute', 'utvändigt', 'utanför', 'trädgård', 'fasad'],
    
    // ROT/RUT
    'rot': ['rotavdrag', 'rot-avdrag', 'reparation'],
    'rut': ['rutavdrag', 'rut-avdrag', 'hushållsarbete'],
    'avdrag': ['skatteavdrag', 'skatteförmån', 'subvention'],
    
    // Akut/Brådskande
    'akut': ['brådskande', 'kris', 'nödfall', 'jourkoppling'],
    'läckage': ['läcker', 'vattenläcka', 'rörläcka', 'läck'],
    
    // Orter
    'stockholm': ['sthlm', 'södermalm', 'östermalm', 'norrmalm', 'vasastan'],
    'uppsala': ['ups', 'uppland']
  };

  private rotRules = `
ROT-avdrag (Reparation, Ombyggnad, Tillbyggnad):
- 30% avdrag på arbetskostnad
- Max 50 000 kr per person och år
- Gäller arbete på villa, radhus, bostadsrätt
- Omfattar: el, VVS, målning, golv, snickeri, plattläggning
- Vi sköter ansökan och utbetalning
- Avdraget kommer direkt på fakturan
  `;

  private rutRules = `
RUT-avdrag (Rengöring, Underhåll, Trädgård):
- 30% avdrag på arbetskostnad
- Max 75 000 kr per person och år
- Gäller hushållstjänster i hemmet
- Omfattar: städning, fönsterputs, trädgårdsskötsel, snöskottning
- Vi sköter ansökan och utbetalning
- Avdraget kommer direkt på fakturan
  `;

  private faqData = [
    {
      question: "Hur snabbt kan ni komma?",
      answer: "Vi startar vanligtvis inom 5 arbetsdagar. För akuta ärenden har vi jour 24/7 - ring då direkt."
    },
    {
      question: "Vilka områden täcker ni?",
      answer: "Vi är baserade i Uppsala och täcker Uppsala län samt Stockholms län. För större projekt åker vi i hela landet."
    },
    {
      question: "Är ni försäkrade?",
      answer: "Ja, vi har fullständig ansvarsförsäkring och F-skattsedel. Alla våra hantverkare är godkända."
    },
    {
      question: "Hur funkar ROT/RUT-avdraget?",
      answer: "Vi sköter hela processen. Du får 30% rabatt direkt på fakturan, vi ansöker åt dig hos Skatteverket."
    },
    {
      question: "Vad kostar ett hembesök?",
      answer: "Kostnadsförslag är alltid gratis. Vi tar bara betalt om du väljer att genomföra jobbet."
    }
  ];

  constructor() {
    this.buildKnowledgeBase();
  }

  private buildKnowledgeBase() {
    // Lägg till tjänster
    servicesDataNew.forEach(category => {
      // Huvudkategori
      this.items.push({
        id: `cat-${category.slug}`,
        type: 'service',
        title: category.title,
        content: `${category.title}: ${category.description}. Timpris: ${category.basePrice} kr/h`,
        category: 'category',
        keywords: [category.title.toLowerCase(), category.slug],
        metadata: {
          basePrice: category.basePrice,
          eligible: category.eligible,
          slug: category.slug
        }
      });

      // Subtjänster
      category.subServices?.forEach(service => {
        const keywords = [
          service.title.toLowerCase(),
          service.category.toLowerCase(),
          category.title.toLowerCase()
        ];

        // Lägg till synonymer
        const titleWords = service.title.toLowerCase().split(' ');
        titleWords.forEach(word => {
          if (this.synonyms[word]) {
            keywords.push(...this.synonyms[word]);
          }
        });

        this.items.push({
          id: service.id,
          type: 'service',
          title: service.title,
          content: `${service.title}: ${service.description}. ${service.basePrice} ${service.priceUnit}`,
          category: service.category,
          keywords,
          metadata: {
            ...service,
            categorySlug: category.slug,
            categoryTitle: category.title
          }
        });
      });
    });

    // Lägg till ROT/RUT regler
    this.items.push({
      id: 'rot-rules',
      type: 'rule',
      title: 'ROT-avdrag regler',
      content: this.rotRules,
      category: 'rot',
      keywords: ['rot', 'rotavdrag', 'avdrag', 'skatteavdrag', 'reparation'],
      metadata: { type: 'rot', rate: 0.3, maxAmount: 50000 }
    });

    this.items.push({
      id: 'rut-rules',
      type: 'rule',
      title: 'RUT-avdrag regler',
      content: this.rutRules,
      category: 'rut',
      keywords: ['rut', 'rutavdrag', 'avdrag', 'skatteavdrag', 'hushållsarbete'],
      metadata: { type: 'rut', rate: 0.3, maxAmount: 75000 }
    });

    // Lägg till FAQ
    this.faqData.forEach((faq, index) => {
      const keywords = [...faq.question.toLowerCase().split(' '), ...faq.answer.toLowerCase().split(' ')];
      this.items.push({
        id: `faq-${index}`,
        type: 'faq',
        title: faq.question,
        content: faq.answer,
        category: 'faq',
        keywords: [...new Set(keywords)],
        metadata: { question: faq.question, answer: faq.answer }
      });
    });

    // Lägg till policy info
    this.items.push({
      id: 'coverage',
      type: 'policy',
      title: 'Täckningsområde',
      content: 'Vi täcker Uppsala län och Stockholms län. Baserade i Uppsala. För stora projekt åker vi i hela landet.',
      category: 'policy',
      keywords: ['område', 'täcker', 'uppsala', 'stockholm', 'var', 'åker'],
      metadata: { areas: ['Uppsala län', 'Stockholms län'], headquarters: 'Uppsala' }
    });
  }

  // Avancerad semantisk sökning
  search(query: string, limit: number = 5): SearchResult[] {
    const normalizedQuery = query.toLowerCase().trim();
    const queryWords = normalizedQuery.split(/\s+/);
    
    const results: SearchResult[] = [];

    this.items.forEach(item => {
      let score = 0;
      let relevance = 0;

      // Exakt titel-match (högst poäng)
      if (item.title.toLowerCase().includes(normalizedQuery)) {
        score += 100;
        relevance += 0.9;
      }

      // Innehåll match
      if (item.content.toLowerCase().includes(normalizedQuery)) {
        score += 50;
        relevance += 0.7;
      }

      // Nyckelord match
      const matchingKeywords = item.keywords.filter(keyword => 
        keyword.includes(normalizedQuery) || normalizedQuery.includes(keyword)
      );
      score += matchingKeywords.length * 30;
      relevance += matchingKeywords.length * 0.2;

      // Ordmatch
      queryWords.forEach(word => {
        // Direkt ordmatch
        if (item.keywords.some(keyword => keyword.includes(word))) {
          score += 20;
          relevance += 0.3;
        }

        // Synonym-match
        if (this.synonyms[word]) {
          const synonymMatches = this.synonyms[word].some(synonym => 
            item.keywords.some(keyword => keyword.includes(synonym))
          );
          if (synonymMatches) {
            score += 25;
            relevance += 0.4;
          }
        }

        // Fuzzy match (enkel version)
        item.keywords.forEach(keyword => {
          if (this.fuzzyMatch(word, keyword)) {
            score += 10;
            relevance += 0.1;
          }
        });
      });

      if (score > 0) {
        results.push({
          item,
          score,
          relevance: Math.min(relevance, 1.0)
        });
      }
    });

    // Sortera efter poäng och relevans
    return results
      .sort((a, b) => {
        if (Math.abs(a.score - b.score) < 10) {
          return b.relevance - a.relevance;
        }
        return b.score - a.score;
      })
      .slice(0, limit);
  }

  // Enkel fuzzy matching
  private fuzzyMatch(word1: string, word2: string): boolean {
    if (word1.length < 3 || word2.length < 3) return false;
    
    const longer = word1.length > word2.length ? word1 : word2;
    const shorter = word1.length > word2.length ? word2 : word1;
    
    if (longer.length - shorter.length > 2) return false;
    
    return longer.includes(shorter) || shorter.includes(longer);
  }

  // Hämta tjänst efter ID
  getService(id: string): KnowledgeItem | null {
    return this.items.find(item => item.id === id && item.type === 'service') || null;
  }

  // Hämta alla tjänster i kategori
  getServicesByCategory(category: string): KnowledgeItem[] {
    return this.items.filter(item => 
      item.type === 'service' && 
      (item.category.toLowerCase() === category.toLowerCase() ||
       item.metadata?.categorySlug === category)
    );
  }

  // Hämta ROT/RUT info
  getROTRUTInfo(type: 'rot' | 'rut'): KnowledgeItem | null {
    return this.items.find(item => 
      item.type === 'rule' && item.metadata?.type === type
    ) || null;
  }
}

// Singleton instance
export const knowledgeBase = new KnowledgeBase();