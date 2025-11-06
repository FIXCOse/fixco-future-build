import type { CopyKey } from '@/copy/keys';

export type ServiceKey =
  | "Elmontör"
  | "VVS"
  | "Snickare"
  | "Måleri"
  | "Städ"
  | "Markarbeten"
  | "Flytt"
  | "Montering"
  | "Trädgård"
  | "Tekniska installationer";

export interface ServiceCityItem {
  service: ServiceKey;
  city: "Uppsala" | "Stockholm";
  slug: string;
  h1Key: CopyKey;
  titleKey: CopyKey;
  descriptionKey: CopyKey;
  priceHintKey?: CopyKey;
  faqKeys: Array<{ qKey: CopyKey; aKey: CopyKey }>;
  caseKeys: Array<{ titleKey: CopyKey; descKey: CopyKey }>;
  howItWorksKeys?: Array<{ step: number; titleKey: CopyKey; descKey: CopyKey }>;
  priceExampleKeys?: Array<{ jobKey: CopyKey; price: string; durationKey: CopyKey }>;
  quickFactKeys?: CopyKey[];
  didYouKnowKeys?: CopyKey[];
}

export const serviceCityData: ServiceCityItem[] = [
  // ========== ELMONTÖR ==========
  {
    service: "Elmontör",
    city: "Uppsala",
    slug: "elmontor-uppsala",
    h1Key: 'serviceCity.el.uppsala.h1',
    titleKey: 'serviceCity.el.uppsala.title',
    descriptionKey: 'serviceCity.el.uppsala.description',
    howItWorksKeys: [
      { step: 1, titleKey: 'serviceCity.el.uppsala.howItWorks.0.title', descKey: 'serviceCity.el.uppsala.howItWorks.0.desc' },
      { step: 2, titleKey: 'serviceCity.el.uppsala.howItWorks.1.title', descKey: 'serviceCity.el.uppsala.howItWorks.1.desc' },
      { step: 3, titleKey: 'serviceCity.el.uppsala.howItWorks.2.title', descKey: 'serviceCity.el.uppsala.howItWorks.2.desc' },
      { step: 4, titleKey: 'serviceCity.el.uppsala.howItWorks.3.title', descKey: 'serviceCity.el.uppsala.howItWorks.3.desc' },
      { step: 5, titleKey: 'serviceCity.el.uppsala.howItWorks.4.title', descKey: 'serviceCity.el.uppsala.howItWorks.4.desc' }
    ],
    priceExampleKeys: [
      { jobKey: 'serviceCity.el.uppsala.priceExample.0.job', price: "2 500 kr", durationKey: 'serviceCity.el.uppsala.priceExample.0.duration' },
      { jobKey: 'serviceCity.el.uppsala.priceExample.1.job', price: "1 200 kr", durationKey: 'serviceCity.el.uppsala.priceExample.1.duration' },
      { jobKey: 'serviceCity.el.uppsala.priceExample.2.job', price: "12 500 kr", durationKey: 'serviceCity.el.uppsala.priceExample.2.duration' },
      { jobKey: 'serviceCity.el.uppsala.priceExample.3.job', price: "från 1 800 kr", durationKey: 'serviceCity.el.uppsala.priceExample.3.duration' }
    ],
    quickFactKeys: [
      'serviceCity.el.uppsala.quickFact.0',
      'serviceCity.el.uppsala.quickFact.1',
      'serviceCity.el.uppsala.quickFact.2',
      'serviceCity.el.uppsala.quickFact.3',
      'serviceCity.el.uppsala.quickFact.4',
      'serviceCity.el.uppsala.quickFact.5',
      'serviceCity.el.uppsala.quickFact.6',
      'serviceCity.el.uppsala.quickFact.7',
      'serviceCity.el.uppsala.quickFact.8',
      'serviceCity.el.uppsala.quickFact.9',
      'serviceCity.el.uppsala.quickFact.10',
      'serviceCity.el.uppsala.quickFact.11'
    ],
    didYouKnowKeys: [
      'serviceCity.el.uppsala.didYouKnow.0',
      'serviceCity.el.uppsala.didYouKnow.1',
      'serviceCity.el.uppsala.didYouKnow.2',
      'serviceCity.el.uppsala.didYouKnow.3',
      'serviceCity.el.uppsala.didYouKnow.4',
      'serviceCity.el.uppsala.didYouKnow.5',
      'serviceCity.el.uppsala.didYouKnow.6'
    ],
    faqKeys: [
      { qKey: 'serviceCity.el.uppsala.faq.0.q', aKey: 'serviceCity.el.uppsala.faq.0.a' },
      { qKey: 'serviceCity.el.uppsala.faq.1.q', aKey: 'serviceCity.el.uppsala.faq.1.a' },
      { qKey: 'serviceCity.el.uppsala.faq.2.q', aKey: 'serviceCity.el.uppsala.faq.2.a' }
    ],
    caseKeys: [
      { titleKey: 'serviceCity.el.uppsala.case.0.title', descKey: 'serviceCity.el.uppsala.case.0.desc' },
      { titleKey: 'serviceCity.el.uppsala.case.1.title', descKey: 'serviceCity.el.uppsala.case.1.desc' },
      { titleKey: 'serviceCity.el.uppsala.case.2.title', descKey: 'serviceCity.el.uppsala.case.2.desc' }
    ]
  },
  {
    service: "Elmontör",
    city: "Stockholm",
    slug: "elmontor-stockholm",
    h1Key: 'serviceCity.el.stockholm.h1',
    titleKey: 'serviceCity.el.stockholm.title',
    descriptionKey: 'serviceCity.el.stockholm.description',
    howItWorksKeys: [
      { step: 1, titleKey: 'serviceCity.el.stockholm.howItWorks.0.title', descKey: 'serviceCity.el.stockholm.howItWorks.0.desc' },
      { step: 2, titleKey: 'serviceCity.el.stockholm.howItWorks.1.title', descKey: 'serviceCity.el.stockholm.howItWorks.1.desc' },
      { step: 3, titleKey: 'serviceCity.el.stockholm.howItWorks.2.title', descKey: 'serviceCity.el.stockholm.howItWorks.2.desc' },
      { step: 4, titleKey: 'serviceCity.el.stockholm.howItWorks.3.title', descKey: 'serviceCity.el.stockholm.howItWorks.3.desc' },
      { step: 5, titleKey: 'serviceCity.el.stockholm.howItWorks.4.title', descKey: 'serviceCity.el.stockholm.howItWorks.4.desc' }
    ],
    priceExampleKeys: [
      { jobKey: 'serviceCity.el.stockholm.priceExample.0.job', price: "2 800 kr", durationKey: 'serviceCity.el.stockholm.priceExample.0.duration' },
      { jobKey: 'serviceCity.el.stockholm.priceExample.1.job', price: "1 400 kr", durationKey: 'serviceCity.el.stockholm.priceExample.1.duration' },
      { jobKey: 'serviceCity.el.stockholm.priceExample.2.job', price: "13 500 kr", durationKey: 'serviceCity.el.stockholm.priceExample.2.duration' },
      { jobKey: 'serviceCity.el.stockholm.priceExample.3.job', price: "från 2 000 kr", durationKey: 'serviceCity.el.stockholm.priceExample.3.duration' }
    ],
    quickFactKeys: [
      'serviceCity.el.stockholm.quickFact.0',
      'serviceCity.el.stockholm.quickFact.1',
      'serviceCity.el.stockholm.quickFact.2',
      'serviceCity.el.stockholm.quickFact.3',
      'serviceCity.el.stockholm.quickFact.4',
      'serviceCity.el.stockholm.quickFact.5',
      'serviceCity.el.stockholm.quickFact.6',
      'serviceCity.el.stockholm.quickFact.7',
      'serviceCity.el.stockholm.quickFact.8',
      'serviceCity.el.stockholm.quickFact.9',
      'serviceCity.el.stockholm.quickFact.10',
      'serviceCity.el.stockholm.quickFact.11'
    ],
    didYouKnowKeys: [
      'serviceCity.el.stockholm.didYouKnow.0',
      'serviceCity.el.stockholm.didYouKnow.1',
      'serviceCity.el.stockholm.didYouKnow.2',
      'serviceCity.el.stockholm.didYouKnow.3',
      'serviceCity.el.stockholm.didYouKnow.4',
      'serviceCity.el.stockholm.didYouKnow.5',
      'serviceCity.el.stockholm.didYouKnow.6'
    ],
    faqKeys: [
      { qKey: 'serviceCity.el.stockholm.faq.0.q', aKey: 'serviceCity.el.stockholm.faq.0.a' },
      { qKey: 'serviceCity.el.stockholm.faq.1.q', aKey: 'serviceCity.el.stockholm.faq.1.a' }
    ],
    caseKeys: [
      { titleKey: 'serviceCity.el.stockholm.case.0.title', descKey: 'serviceCity.el.stockholm.case.0.desc' },
      { titleKey: 'serviceCity.el.stockholm.case.1.title', descKey: 'serviceCity.el.stockholm.case.1.desc' }
    ]
  },

  // ========== VVS ==========
  {
    service: "VVS",
    city: "Uppsala",
    slug: "vvs-uppsala",
    h1Key: 'serviceCity.vvs.uppsala.h1',
    titleKey: 'serviceCity.vvs.uppsala.title',
    descriptionKey: 'serviceCity.vvs.uppsala.description',
    howItWorksKeys: [
      { step: 1, titleKey: 'serviceCity.vvs.uppsala.howItWorks.0.title', descKey: 'serviceCity.vvs.uppsala.howItWorks.0.desc' },
      { step: 2, titleKey: 'serviceCity.vvs.uppsala.howItWorks.1.title', descKey: 'serviceCity.vvs.uppsala.howItWorks.1.desc' },
      { step: 3, titleKey: 'serviceCity.vvs.uppsala.howItWorks.2.title', descKey: 'serviceCity.vvs.uppsala.howItWorks.2.desc' },
      { step: 4, titleKey: 'serviceCity.vvs.uppsala.howItWorks.3.title', descKey: 'serviceCity.vvs.uppsala.howItWorks.3.desc' },
      { step: 5, titleKey: 'serviceCity.vvs.uppsala.howItWorks.4.title', descKey: 'serviceCity.vvs.uppsala.howItWorks.4.desc' }
    ],
    priceExampleKeys: [
      { jobKey: 'serviceCity.vvs.uppsala.priceExample.0.job', price: "2 200 kr", durationKey: 'serviceCity.vvs.uppsala.priceExample.0.duration' },
      { jobKey: 'serviceCity.vvs.uppsala.priceExample.1.job', price: "3 500 kr", durationKey: 'serviceCity.vvs.uppsala.priceExample.1.duration' },
      { jobKey: 'serviceCity.vvs.uppsala.priceExample.2.job', price: "från 2 500 kr", durationKey: 'serviceCity.vvs.uppsala.priceExample.2.duration' },
      { jobKey: 'serviceCity.vvs.uppsala.priceExample.3.job', price: "från 85 000 kr", durationKey: 'serviceCity.vvs.uppsala.priceExample.3.duration' }
    ],
    quickFactKeys: [
      'serviceCity.vvs.uppsala.quickFact.0',
      'serviceCity.vvs.uppsala.quickFact.1',
      'serviceCity.vvs.uppsala.quickFact.2',
      'serviceCity.vvs.uppsala.quickFact.3',
      'serviceCity.vvs.uppsala.quickFact.4',
      'serviceCity.vvs.uppsala.quickFact.5',
      'serviceCity.vvs.uppsala.quickFact.6',
      'serviceCity.vvs.uppsala.quickFact.7',
      'serviceCity.vvs.uppsala.quickFact.8',
      'serviceCity.vvs.uppsala.quickFact.9',
      'serviceCity.vvs.uppsala.quickFact.10',
      'serviceCity.vvs.uppsala.quickFact.11'
    ],
    didYouKnowKeys: [
      'serviceCity.vvs.uppsala.didYouKnow.0',
      'serviceCity.vvs.uppsala.didYouKnow.1',
      'serviceCity.vvs.uppsala.didYouKnow.2',
      'serviceCity.vvs.uppsala.didYouKnow.3',
      'serviceCity.vvs.uppsala.didYouKnow.4',
      'serviceCity.vvs.uppsala.didYouKnow.5',
      'serviceCity.vvs.uppsala.didYouKnow.6'
    ],
    faqKeys: [
      { qKey: 'serviceCity.vvs.uppsala.faq.0.q', aKey: 'serviceCity.vvs.uppsala.faq.0.a' },
      { qKey: 'serviceCity.vvs.uppsala.faq.1.q', aKey: 'serviceCity.vvs.uppsala.faq.1.a' },
      { qKey: 'serviceCity.vvs.uppsala.faq.2.q', aKey: 'serviceCity.vvs.uppsala.faq.2.a' }
    ],
    caseKeys: [
      { titleKey: 'serviceCity.vvs.uppsala.case.0.title', descKey: 'serviceCity.vvs.uppsala.case.0.desc' },
      { titleKey: 'serviceCity.vvs.uppsala.case.1.title', descKey: 'serviceCity.vvs.uppsala.case.1.desc' }
    ]
  },
  {
    service: "VVS",
    city: "Stockholm",
    slug: "vvs-stockholm",
    h1Key: 'serviceCity.vvs.stockholm.h1',
    titleKey: 'serviceCity.vvs.stockholm.title',
    descriptionKey: 'serviceCity.vvs.stockholm.description',
    howItWorksKeys: [
      { step: 1, titleKey: 'serviceCity.vvs.stockholm.howItWorks.0.title', descKey: 'serviceCity.vvs.stockholm.howItWorks.0.desc' },
      { step: 2, titleKey: 'serviceCity.vvs.stockholm.howItWorks.1.title', descKey: 'serviceCity.vvs.stockholm.howItWorks.1.desc' },
      { step: 3, titleKey: 'serviceCity.vvs.stockholm.howItWorks.2.title', descKey: 'serviceCity.vvs.stockholm.howItWorks.2.desc' },
      { step: 4, titleKey: 'serviceCity.vvs.stockholm.howItWorks.3.title', descKey: 'serviceCity.vvs.stockholm.howItWorks.3.desc' },
      { step: 5, titleKey: 'serviceCity.vvs.stockholm.howItWorks.4.title', descKey: 'serviceCity.vvs.stockholm.howItWorks.4.desc' }
    ],
    priceExampleKeys: [
      { jobKey: 'serviceCity.vvs.stockholm.priceExample.0.job', price: "2 500 kr", durationKey: 'serviceCity.vvs.stockholm.priceExample.0.duration' },
      { jobKey: 'serviceCity.vvs.stockholm.priceExample.1.job', price: "3 800 kr", durationKey: 'serviceCity.vvs.stockholm.priceExample.1.duration' },
      { jobKey: 'serviceCity.vvs.stockholm.priceExample.2.job', price: "från 3 000 kr", durationKey: 'serviceCity.vvs.stockholm.priceExample.2.duration' },
      { jobKey: 'serviceCity.vvs.stockholm.priceExample.3.job', price: "från 95 000 kr", durationKey: 'serviceCity.vvs.stockholm.priceExample.3.duration' }
    ],
    quickFactKeys: [
      'serviceCity.vvs.stockholm.quickFact.0',
      'serviceCity.vvs.stockholm.quickFact.1',
      'serviceCity.vvs.stockholm.quickFact.2',
      'serviceCity.vvs.stockholm.quickFact.3',
      'serviceCity.vvs.stockholm.quickFact.4',
      'serviceCity.vvs.stockholm.quickFact.5',
      'serviceCity.vvs.stockholm.quickFact.6',
      'serviceCity.vvs.stockholm.quickFact.7',
      'serviceCity.vvs.stockholm.quickFact.8',
      'serviceCity.vvs.stockholm.quickFact.9',
      'serviceCity.vvs.stockholm.quickFact.10',
      'serviceCity.vvs.stockholm.quickFact.11'
    ],
    didYouKnowKeys: [
      'serviceCity.vvs.stockholm.didYouKnow.0',
      'serviceCity.vvs.stockholm.didYouKnow.1',
      'serviceCity.vvs.stockholm.didYouKnow.2',
      'serviceCity.vvs.stockholm.didYouKnow.3',
      'serviceCity.vvs.stockholm.didYouKnow.4',
      'serviceCity.vvs.stockholm.didYouKnow.5',
      'serviceCity.vvs.stockholm.didYouKnow.6'
    ],
    faqKeys: [
      { qKey: 'serviceCity.vvs.stockholm.faq.0.q', aKey: 'serviceCity.vvs.stockholm.faq.0.a' },
      { qKey: 'serviceCity.vvs.stockholm.faq.1.q', aKey: 'serviceCity.vvs.stockholm.faq.1.a' }
    ],
    caseKeys: [
      { titleKey: 'serviceCity.vvs.stockholm.case.0.title', descKey: 'serviceCity.vvs.stockholm.case.0.desc' },
      { titleKey: 'serviceCity.vvs.stockholm.case.1.title', descKey: 'serviceCity.vvs.stockholm.case.1.desc' }
    ]
  },

  // ========== SNICKARE ==========
  {
    service: "Snickare",
    city: "Uppsala",
    slug: "snickare-uppsala",
    h1Key: 'serviceCity.snickare.uppsala.h1',
    titleKey: 'serviceCity.snickare.uppsala.title',
    descriptionKey: 'serviceCity.snickare.uppsala.description',
    howItWorksKeys: [
      { step: 1, titleKey: 'serviceCity.snickare.uppsala.howItWorks.0.title', descKey: 'serviceCity.snickare.uppsala.howItWorks.0.desc' },
      { step: 2, titleKey: 'serviceCity.snickare.uppsala.howItWorks.1.title', descKey: 'serviceCity.snickare.uppsala.howItWorks.1.desc' },
      { step: 3, titleKey: 'serviceCity.snickare.uppsala.howItWorks.2.title', descKey: 'serviceCity.snickare.uppsala.howItWorks.2.desc' },
      { step: 4, titleKey: 'serviceCity.snickare.uppsala.howItWorks.3.title', descKey: 'serviceCity.snickare.uppsala.howItWorks.3.desc' },
      { step: 5, titleKey: 'serviceCity.snickare.uppsala.howItWorks.4.title', descKey: 'serviceCity.snickare.uppsala.howItWorks.4.desc' }
    ],
    priceExampleKeys: [
      { jobKey: 'serviceCity.snickare.uppsala.priceExample.0.job', price: "18 000 kr", durationKey: 'serviceCity.snickare.uppsala.priceExample.0.duration' },
      { jobKey: 'serviceCity.snickare.uppsala.priceExample.1.job', price: "25 000 kr", durationKey: 'serviceCity.snickare.uppsala.priceExample.1.duration' },
      { jobKey: 'serviceCity.snickare.uppsala.priceExample.2.job', price: "8 500 kr", durationKey: 'serviceCity.snickare.uppsala.priceExample.2.duration' },
      { jobKey: 'serviceCity.snickare.uppsala.priceExample.3.job', price: "4 500 kr", durationKey: 'serviceCity.snickare.uppsala.priceExample.3.duration' }
    ],
    quickFactKeys: [
      'serviceCity.snickare.uppsala.quickFact.0',
      'serviceCity.snickare.uppsala.quickFact.1',
      'serviceCity.snickare.uppsala.quickFact.2',
      'serviceCity.snickare.uppsala.quickFact.3',
      'serviceCity.snickare.uppsala.quickFact.4',
      'serviceCity.snickare.uppsala.quickFact.5',
      'serviceCity.snickare.uppsala.quickFact.6',
      'serviceCity.snickare.uppsala.quickFact.7',
      'serviceCity.snickare.uppsala.quickFact.8',
      'serviceCity.snickare.uppsala.quickFact.9',
      'serviceCity.snickare.uppsala.quickFact.10',
      'serviceCity.snickare.uppsala.quickFact.11'
    ],
    didYouKnowKeys: [
      'serviceCity.snickare.uppsala.didYouKnow.0',
      'serviceCity.snickare.uppsala.didYouKnow.1',
      'serviceCity.snickare.uppsala.didYouKnow.2',
      'serviceCity.snickare.uppsala.didYouKnow.3',
      'serviceCity.snickare.uppsala.didYouKnow.4',
      'serviceCity.snickare.uppsala.didYouKnow.5',
      'serviceCity.snickare.uppsala.didYouKnow.6'
    ],
    faqKeys: [
      { qKey: 'serviceCity.snickare.uppsala.faq.0.q', aKey: 'serviceCity.snickare.uppsala.faq.0.a' },
      { qKey: 'serviceCity.snickare.uppsala.faq.1.q', aKey: 'serviceCity.snickare.uppsala.faq.1.a' },
      { qKey: 'serviceCity.snickare.uppsala.faq.2.q', aKey: 'serviceCity.snickare.uppsala.faq.2.a' }
    ],
    caseKeys: [
      { titleKey: 'serviceCity.snickare.uppsala.case.0.title', descKey: 'serviceCity.snickare.uppsala.case.0.desc' },
      { titleKey: 'serviceCity.snickare.uppsala.case.1.title', descKey: 'serviceCity.snickare.uppsala.case.1.desc' }
    ]
  },
  {
    service: "Snickare",
    city: "Stockholm",
    slug: "snickare-stockholm",
    h1Key: 'serviceCity.snickare.stockholm.h1',
    titleKey: 'serviceCity.snickare.stockholm.title',
    descriptionKey: 'serviceCity.snickare.stockholm.description',
    howItWorksKeys: [
      { step: 1, titleKey: 'serviceCity.snickare.stockholm.howItWorks.0.title', descKey: 'serviceCity.snickare.stockholm.howItWorks.0.desc' },
      { step: 2, titleKey: 'serviceCity.snickare.stockholm.howItWorks.1.title', descKey: 'serviceCity.snickare.stockholm.howItWorks.1.desc' },
      { step: 3, titleKey: 'serviceCity.snickare.stockholm.howItWorks.2.title', descKey: 'serviceCity.snickare.stockholm.howItWorks.2.desc' },
      { step: 4, titleKey: 'serviceCity.snickare.stockholm.howItWorks.3.title', descKey: 'serviceCity.snickare.stockholm.howItWorks.3.desc' },
      { step: 5, titleKey: 'serviceCity.snickare.stockholm.howItWorks.4.title', descKey: 'serviceCity.snickare.stockholm.howItWorks.4.desc' }
    ],
    priceExampleKeys: [
      { jobKey: 'serviceCity.snickare.stockholm.priceExample.0.job', price: "22 000 kr", durationKey: 'serviceCity.snickare.stockholm.priceExample.0.duration' },
      { jobKey: 'serviceCity.snickare.stockholm.priceExample.1.job', price: "35 000 kr", durationKey: 'serviceCity.snickare.stockholm.priceExample.1.duration' },
      { jobKey: 'serviceCity.snickare.stockholm.priceExample.2.job', price: "10 500 kr", durationKey: 'serviceCity.snickare.stockholm.priceExample.2.duration' },
      { jobKey: 'serviceCity.snickare.stockholm.priceExample.3.job', price: "12 000 kr", durationKey: 'serviceCity.snickare.stockholm.priceExample.3.duration' }
    ],
    quickFactKeys: [
      'serviceCity.snickare.stockholm.quickFact.0',
      'serviceCity.snickare.stockholm.quickFact.1',
      'serviceCity.snickare.stockholm.quickFact.2',
      'serviceCity.snickare.stockholm.quickFact.3',
      'serviceCity.snickare.stockholm.quickFact.4',
      'serviceCity.snickare.stockholm.quickFact.5',
      'serviceCity.snickare.stockholm.quickFact.6',
      'serviceCity.snickare.stockholm.quickFact.7',
      'serviceCity.snickare.stockholm.quickFact.8',
      'serviceCity.snickare.stockholm.quickFact.9',
      'serviceCity.snickare.stockholm.quickFact.10',
      'serviceCity.snickare.stockholm.quickFact.11'
    ],
    didYouKnowKeys: [
      'serviceCity.snickare.stockholm.didYouKnow.0',
      'serviceCity.snickare.stockholm.didYouKnow.1',
      'serviceCity.snickare.stockholm.didYouKnow.2',
      'serviceCity.snickare.stockholm.didYouKnow.3',
      'serviceCity.snickare.stockholm.didYouKnow.4',
      'serviceCity.snickare.stockholm.didYouKnow.5',
      'serviceCity.snickare.stockholm.didYouKnow.6'
    ],
    faqKeys: [
      { qKey: 'serviceCity.snickare.stockholm.faq.0.q', aKey: 'serviceCity.snickare.stockholm.faq.0.a' },
      { qKey: 'serviceCity.snickare.stockholm.faq.1.q', aKey: 'serviceCity.snickare.stockholm.faq.1.a' }
    ],
    caseKeys: [
      { titleKey: 'serviceCity.snickare.stockholm.case.0.title', descKey: 'serviceCity.snickare.stockholm.case.0.desc' },
      { titleKey: 'serviceCity.snickare.stockholm.case.1.title', descKey: 'serviceCity.snickare.stockholm.case.1.desc' }
    ]
  },

  // ========== MONTERING ==========
  {
    service: "Montering",
    city: "Uppsala",
    slug: "montering-uppsala",
    h1Key: 'serviceCity.montering.uppsala.h1',
    titleKey: 'serviceCity.montering.uppsala.title',
    descriptionKey: 'serviceCity.montering.uppsala.description',
    howItWorksKeys: [
      { step: 1, titleKey: 'serviceCity.montering.uppsala.howItWorks.0.title', descKey: 'serviceCity.montering.uppsala.howItWorks.0.desc' },
      { step: 2, titleKey: 'serviceCity.montering.uppsala.howItWorks.1.title', descKey: 'serviceCity.montering.uppsala.howItWorks.1.desc' },
      { step: 3, titleKey: 'serviceCity.montering.uppsala.howItWorks.2.title', descKey: 'serviceCity.montering.uppsala.howItWorks.2.desc' },
      { step: 4, titleKey: 'serviceCity.montering.uppsala.howItWorks.3.title', descKey: 'serviceCity.montering.uppsala.howItWorks.3.desc' },
      { step: 5, titleKey: 'serviceCity.montering.uppsala.howItWorks.4.title', descKey: 'serviceCity.montering.uppsala.howItWorks.4.desc' }
    ],
    priceExampleKeys: [
      { jobKey: 'serviceCity.montering.uppsala.priceExample.0.job', price: "1 200 kr", durationKey: 'serviceCity.montering.uppsala.priceExample.0.duration' },
      { jobKey: 'serviceCity.montering.uppsala.priceExample.1.job', price: "2 500 kr", durationKey: 'serviceCity.montering.uppsala.priceExample.1.duration' },
      { jobKey: 'serviceCity.montering.uppsala.priceExample.2.job', price: "12 000 kr", durationKey: 'serviceCity.montering.uppsala.priceExample.2.duration' },
      { jobKey: 'serviceCity.montering.uppsala.priceExample.3.job', price: "1 800 kr", durationKey: 'serviceCity.montering.uppsala.priceExample.3.duration' }
    ],
    quickFactKeys: [
      'serviceCity.montering.uppsala.quickFact.0',
      'serviceCity.montering.uppsala.quickFact.1',
      'serviceCity.montering.uppsala.quickFact.2',
      'serviceCity.montering.uppsala.quickFact.3',
      'serviceCity.montering.uppsala.quickFact.4',
      'serviceCity.montering.uppsala.quickFact.5',
      'serviceCity.montering.uppsala.quickFact.6',
      'serviceCity.montering.uppsala.quickFact.7',
      'serviceCity.montering.uppsala.quickFact.8',
      'serviceCity.montering.uppsala.quickFact.9',
      'serviceCity.montering.uppsala.quickFact.10',
      'serviceCity.montering.uppsala.quickFact.11'
    ],
    didYouKnowKeys: [
      'serviceCity.montering.uppsala.didYouKnow.0',
      'serviceCity.montering.uppsala.didYouKnow.1',
      'serviceCity.montering.uppsala.didYouKnow.2',
      'serviceCity.montering.uppsala.didYouKnow.3',
      'serviceCity.montering.uppsala.didYouKnow.4',
      'serviceCity.montering.uppsala.didYouKnow.5',
      'serviceCity.montering.uppsala.didYouKnow.6'
    ],
    faqKeys: [
      { qKey: 'serviceCity.montering.uppsala.faq.0.q', aKey: 'serviceCity.montering.uppsala.faq.0.a' },
      { qKey: 'serviceCity.montering.uppsala.faq.1.q', aKey: 'serviceCity.montering.uppsala.faq.1.a' },
      { qKey: 'serviceCity.montering.uppsala.faq.2.q', aKey: 'serviceCity.montering.uppsala.faq.2.a' }
    ],
    caseKeys: [
      { titleKey: 'serviceCity.montering.uppsala.case.0.title', descKey: 'serviceCity.montering.uppsala.case.0.desc' },
      { titleKey: 'serviceCity.montering.uppsala.case.1.title', descKey: 'serviceCity.montering.uppsala.case.1.desc' }
    ]
  },
  {
    service: "Montering",
    city: "Stockholm",
    slug: "montering-stockholm",
    h1Key: 'serviceCity.montering.stockholm.h1',
    titleKey: 'serviceCity.montering.stockholm.title',
    descriptionKey: 'serviceCity.montering.stockholm.description',
    howItWorksKeys: [
      { step: 1, titleKey: 'serviceCity.montering.stockholm.howItWorks.0.title', descKey: 'serviceCity.montering.stockholm.howItWorks.0.desc' },
      { step: 2, titleKey: 'serviceCity.montering.stockholm.howItWorks.1.title', descKey: 'serviceCity.montering.stockholm.howItWorks.1.desc' },
      { step: 3, titleKey: 'serviceCity.montering.stockholm.howItWorks.2.title', descKey: 'serviceCity.montering.stockholm.howItWorks.2.desc' },
      { step: 4, titleKey: 'serviceCity.montering.stockholm.howItWorks.3.title', descKey: 'serviceCity.montering.stockholm.howItWorks.3.desc' },
      { step: 5, titleKey: 'serviceCity.montering.stockholm.howItWorks.4.title', descKey: 'serviceCity.montering.stockholm.howItWorks.4.desc' }
    ],
    priceExampleKeys: [
      { jobKey: 'serviceCity.montering.stockholm.priceExample.0.job', price: "1 400 kr", durationKey: 'serviceCity.montering.stockholm.priceExample.0.duration' },
      { jobKey: 'serviceCity.montering.stockholm.priceExample.1.job', price: "2 800 kr", durationKey: 'serviceCity.montering.stockholm.priceExample.1.duration' },
      { jobKey: 'serviceCity.montering.stockholm.priceExample.2.job', price: "14 000 kr", durationKey: 'serviceCity.montering.stockholm.priceExample.2.duration' },
      { jobKey: 'serviceCity.montering.stockholm.priceExample.3.job', price: "2 000 kr", durationKey: 'serviceCity.montering.stockholm.priceExample.3.duration' }
    ],
    quickFactKeys: [
      'serviceCity.montering.stockholm.quickFact.0',
      'serviceCity.montering.stockholm.quickFact.1',
      'serviceCity.montering.stockholm.quickFact.2',
      'serviceCity.montering.stockholm.quickFact.3',
      'serviceCity.montering.stockholm.quickFact.4',
      'serviceCity.montering.stockholm.quickFact.5',
      'serviceCity.montering.stockholm.quickFact.6',
      'serviceCity.montering.stockholm.quickFact.7',
      'serviceCity.montering.stockholm.quickFact.8',
      'serviceCity.montering.stockholm.quickFact.9',
      'serviceCity.montering.stockholm.quickFact.10',
      'serviceCity.montering.stockholm.quickFact.11'
    ],
    didYouKnowKeys: [
      'serviceCity.montering.stockholm.didYouKnow.0',
      'serviceCity.montering.stockholm.didYouKnow.1',
      'serviceCity.montering.stockholm.didYouKnow.2',
      'serviceCity.montering.stockholm.didYouKnow.3',
      'serviceCity.montering.stockholm.didYouKnow.4',
      'serviceCity.montering.stockholm.didYouKnow.5',
      'serviceCity.montering.stockholm.didYouKnow.6'
    ],
    faqKeys: [
      { qKey: 'serviceCity.montering.stockholm.faq.0.q', aKey: 'serviceCity.montering.stockholm.faq.0.a' },
      { qKey: 'serviceCity.montering.stockholm.faq.1.q', aKey: 'serviceCity.montering.stockholm.faq.1.a' }
    ],
    caseKeys: [
      { titleKey: 'serviceCity.montering.stockholm.case.0.title', descKey: 'serviceCity.montering.stockholm.case.0.desc' },
      { titleKey: 'serviceCity.montering.stockholm.case.1.title', descKey: 'serviceCity.montering.stockholm.case.1.desc' }
    ]
  },

  // ========== TRÄDGÅRD ==========
  {
    service: "Trädgård",
    city: "Uppsala",
    slug: "tradgard-uppsala",
    h1: "Trädgårdstjänster i Uppsala",
    title: "Trädgård i Uppsala – Gräsklippning, Häckar & Plantering | RUT 50%",
    description: "Trädgårdshjälp i Uppsala. Gräsklippning, häckklippning, ogräsrensning och plantering. RUT-avdrag 50%.",
    howItWorks: [
      { step: 1, title: "Beskriv ditt trädgårdsbehov", desc: "Gräsklippning, häck, plantering? Ring eller fyll i formulär online." },
      { step: 2, title: "Offert & schemaläggning", desc: "Vi bedömer arbetet och ger fast pris. Regelbundet eller engångsjobb." },
      { step: 3, title: "Vi kommer med utrustning", desc: "Proffs med gräsklippare, häcksax och trädgårdssäckar." },
      { step: 4, title: "Professionell trädgårdsskötsel", desc: "Vi klipper, rensar och planerar enligt säsong." },
      { step: 5, title: "Bortforsling & RUT-avdrag", desc: "Vi tar hand om trädgårdsavfall. RUT 50% ingår." }
    ],
    priceExamples: [
      { job: "Gräsklippning 300 kvm", price: "800 kr", duration: "1 timme" },
      { job: "Häckklippning 20 meter", price: "1 500 kr", duration: "2 timmar" },
      { job: "Ogräsrensning rabatter", price: "600 kr/timme", duration: "2-4 timmar" },
      { job: "Plantering 10 buskar", price: "2 200 kr", duration: "2 timmar" }
    ],
    quickFacts: [
      "Uppsalas lera kräver kompost för bättre dränering",
      "Gräsklippning april-oktober rekommenderas varannan vecka",
      "Häckar ska klippas 2 gånger per år - juni och augusti",
      "RUT-avdrag gäller trädgårdsskötsel på tomten",
      "Mulchning sparar vatten och minskar ogräs",
      "Uppsala har kyligare nätter än Stockholm - vissa växter trivs sämre",
      "Kompostering minskar trädgårdsavfall med 50%",
      "Gräsmattor i Uppsala behöver kalkgödsling på grund av sur jord",
      "Snöskottning ingår inte i RUT-avdrag men snöröjning gör det",
      "Trädgårdsavfall kan lämnas på Rosendals återvinningscentral",
      "Bevattning av gräsmattan bör göras tidigt på morgonen för bäst effekt",
      "Plantering bör göras i maj eller september i Uppsala"
    ],
    didYouKnow: [
      "Uppsala botaniska trädgård grundades 1655 - en av världens äldsta",
      "Uppsalas leriga jord är perfekt för äppelträd - staden hade 10 000+ äppelträd på 1800-talet",
      "Gräsklippning på rätt höjd (5-6 cm) gör gräsmattan tätare och grönare",
      "En trädgård i Uppsala behöver 30-40 liter vatten per kvm under torr sommar",
      "Häckar av thuja växer 30-40 cm per år och behöver regelbunden klippning",
      "Uppsala har 15 000+ privata trädgårdar som kräver regelbunden skötsel",
      "Rätt tid för plantering i Uppsala är maj (efter sista frosten) och september"
    ],
    faqs: [
      { q: "Hur ofta klipps gräset?", a: "Vi rekommenderar gräsklippning var 7-10 dag under högsäsong. Vi kan sätta upp regelbundna besök efter ditt schema." },
      { q: "Tar ni med utrustning?", a: "Ja, vi tar med all nödvändig utrustning som gräsklippare, häcksax, kratta och trädgårdssäckar." },
      { q: "Gör ni snöskottning vintertid?", a: "Ja, vi erbjuder snöskottning av uppfarter, gångvägar och trappor under vintersäsongen." }
    ],
    cases: [
      { title: "Regelbunden trädgårdsskötsel Svartbäcken", desc: "Gräsklippning varannan vecka, häckklippning 2 ggr/år och ogräsrensning i rabatter." },
      { title: "Häckbeskärning Luthagen", desc: "Beskärning av 30 meter thujahaeck med formklippning och bortforsling av grenar." }
    ]
  },
  {
    service: "Trädgård",
    city: "Stockholm",
    slug: "tradgard-stockholm",
    h1: "Trädgårdstjänster i Stockholm",
    title: "Trädgård i Stockholm – Gräs, Häckar & Plantering | RUT 50%",
    description: "Professionell trädgårdshjälp i Stockholm. RUT-avdrag 50%.",
    howItWorks: [
      { step: 1, title: "Beskriv ditt trädgårdsbehov", desc: "Gräsklippning, häck, plantering? Ring eller fyll i formulär online." },
      { step: 2, title: "Offert & schemaläggning", desc: "Vi bedömer arbetet och ger fast pris. Regelbundet eller engångsjobb." },
      { step: 3, title: "Vi kommer med utrustning", desc: "Proffs med gräsklippare, häcksax och trädgårdssäckar." },
      { step: 4, title: "Professionell trädgårdsskötsel", desc: "Vi klipper, rensar och planerar enligt säsong." },
      { step: 5, title: "Bortforsling & RUT-avdrag", desc: "Vi tar hand om trädgårdsavfall. RUT 50% ingår." }
    ],
    priceExamples: [
      { job: "Gräsklippning 300 kvm", price: "950 kr", duration: "1 timme" },
      { job: "Häckklippning 20 meter", price: "1 800 kr", duration: "2 timmar" },
      { job: "Ogräsrensning rabatter", price: "700 kr/timme", duration: "2-4 timmar" },
      { job: "Plantering 10 buskar", price: "2 500 kr", duration: "2 timmar" }
    ],
    quickFacts: [
      "Stockholms innerstad har över 1 000 innergårdar som kräver professionell skötsel",
      "BRF-trädgårdar kräver ofta kollektivt godkännande för större förändringar",
      "RUT-avdrag gäller trädgårdsskötsel på fastigheten",
      "Takträdgårdar blir allt vanligare i Stockholm",
      "Häckar ska klippas 2 gånger per år för optimal form",
      "Gräsklippning varje vecka under högsäsong rekommenderas",
      "Stockholm har 300 soliga dagar per år - perfekt för rosor",
      "Bevattning bör göras tidigt på morgonen eller sent på kvällen",
      "Kompostering minskar trädgårdsavfall och ger bättre jord",
      "Plantering bör göras i maj eller september i Stockholm",
      "Snöskottning ingår inte i RUT-avdrag men snöröjning gör det",
      "Trädgårdsavfall kan lämnas på Stockholms återvinningscentraler"
    ],
    didYouKnow: [
      "Stockholms innerstad har över 1 000 innergårdar som kräver professionell trädgårdsskötsel",
      "Takträdgårdar i Stockholm kan minska temperaturen inomhus med 5 grader på sommaren",
      "Stockholm har Sveriges högsta andel gräsmattor per capita i innerstaden",
      "En välskött trädgård kan öka fastighetsvärdet med 5-10% i Stockholmsområdet",
      "Gräsklippning 1 gång för lite kan göra gräsmattan gul och torr - regelbundenhet är nyckeln",
      "Stockholm har 300 soliga dagar per år - perfekt för rosor och perenna plantor",
      "BRF-trädgårdar i Stockholm kräver ofta kollektivt godkännande för större förändringar"
    ],
    faqs: [
      { q: "Arbetar ni i BRF-trädgårdar?", a: "Ja, vi har avtal med flera BRF:er för regelbunden trädgårdsskötsel av gemensamma ytor." },
      { q: "Kan ni sköta takträdgårdar?", a: "Ja, vi har erfarenhet av takträdgårdar och terrasser inklusive bevattning, plantering och underhåll." }
    ],
    cases: [
      { title: "Takträdgård Södermalm", desc: "Skötsel av takträdgård med automatisk bevattning, växtplantering och säsongsväxlingar." },
      { title: "BRF-trädgård Vasastan", desc: "Regelbunden skötsel av BRF-innergård med gräsklippning, buskar och blomrabatter." }
    ]
  },

  // ========== STÄD ==========
  {
    service: "Städ",
    city: "Uppsala",
    slug: "stad-uppsala",
    h1: "Städtjänster i Uppsala",
    title: "Städning i Uppsala – Hemstäd, Flyttstäd & Byggstäd | RUT 50%",
    description: "Professionell städning i Uppsala. Hemstäd, flyttstäd och byggstäd. RUT-avdrag 50%.",
    howItWorks: [
      { step: 1, title: "Berätta om städbehov", desc: "Hemstäd, flyttstäd, byggstäd? Storlek och önskemål." },
      { step: 2, title: "Offert direkt", desc: "Fast pris baserat på typ av städning och storlek. Inga dolda avgifter." },
      { step: 3, title: "Bokning av tid", desc: "Välj datum som passar dig. Vi kommer med allt städmaterial." },
      { step: 4, title: "Professionell städning", desc: "Certifierade städare med kvalitetsprodukter städar enligt checklista." },
      { step: 5, title: "Kontroll & garanti", desc: "Vi kontrollerar resultatet. Flyttstäd har besiktningsgaranti." }
    ],
    priceExamples: [
      { job: "Hemstäd 60 kvm", price: "1 200 kr", duration: "2 timmar" },
      { job: "Flyttstäd 2:a", price: "3 500 kr", duration: "4 timmar" },
      { job: "Byggstäd efter badrum", price: "2 800 kr", duration: "3 timmar" },
      { job: "Fönsterputs 10 fönster", price: "1 500 kr", duration: "2 timmar" }
    ],
    quickFacts: [
      "Flyttstäd ska följa Svensk Fastighetsförmedlings checklista för godkänd besiktning",
      "Byggstäd efter renovering är kritiskt för att undvika dammspridning",
      "RUT-avdrag gäller hemstäd, flyttstäd och fönsterputsning",
      "Professionella städare städar 50% snabbare än privatpersoner",
      "Miljövänliga produkter är lika effektiva som traditionella",
      "Uppsala har över 50 000 hushåll som använder städtjänster regelbundet",
      "Fönsterputs 2 gånger per år rekommenderas för bästa ljusinsläpp",
      "Flyttstäd tar vanligtvis 3-6 timmar för en 3:a",
      "Byggstäd ska göras direkt efter renovering för att undvika permanent smuts",
      "Hemstäd varannan vecka är vanligast i Uppsala",
      "Allergiker rekommenderas använda miljömärkta städprodukter",
      "Professionell städning sparar 4-6 timmar per tillfälle"
    ],
    didYouKnow: [
      "Svenskar städar i genomsnitt 3,5 timmar per vecka - motsvarande 7 arbetsveckor per år",
      "Dåligt städad bostad kan innehålla 200 bakteriearter på kök sytor",
      "Flyttstäd som inte godkänns kan kosta 10 000+ kr i efterarbete och försenade inflyttningar",
      "Uppsala har Sveriges tredje högsta användning av städtjänster per capita",
      "Fönsterputsning kan öka ljusinsläppet med 30% - sparar elkostnad för belysning",
      "Byggdamm efter renovering kan orsaka allergi och andningsbesvär i flera månader",
      "Professionella städare använder 4-stegs metod som är 10x effektivare än vanlig städning"
    ],
    faqs: [
      { q: "Tar ni med städmaterial?", a: "Ja, vi tar med allt professionellt städmaterial och utrustning. Miljövänliga produkter används." },
      { q: "Gör ni flyttstäd med besiktning?", a: "Ja, vi gör flyttstäd enligt Svensk Fastighetsförmedlings checklista och garanterar godkänd besiktning." },
      { q: "Kan ni städa samma dag?", a: "För akuta städbehov försöker vi alltid hitta en lösning. Kontakta oss för dagens tillgänglighet." }
    ],
    cases: [
      { title: "Flyttstäd med godkänd besiktning Luthagen", desc: "Komplett flyttstäd av 3:a med rengöring av kök, badrum, fönster och alla ytor. Besiktning godkänd utan anmärkning." },
      { title: "Byggstäd efter renovering Gottsunda", desc: "Grundlig städning efter badrumrenovering med dammsugning, avtorkning och fönsterputsning." }
    ]
  },
  {
    service: "Städ",
    city: "Stockholm",
    slug: "stad-stockholm",
    h1: "Städtjänster i Stockholm",
    title: "Städning i Stockholm – Hem, Flytt & Kontor | RUT 50%",
    description: "Professionella städtjänster i Stockholm. RUT-avdrag 50%.",
    howItWorks: [
      { step: 1, title: "Berätta om städbehov", desc: "Hemstäd, flyttstäd, byggstäd? Storlek och önskemål." },
      { step: 2, title: "Offert direkt", desc: "Fast pris baserat på typ av städning och storlek. Inga dolda avgifter." },
      { step: 3, title: "Bokning av tid", desc: "Välj datum som passar dig. Vi kommer med allt städmaterial." },
      { step: 4, title: "Professionell städning", desc: "Certifierade städare med kvalitetsprodukter städar enligt checklista." },
      { step: 5, title: "Kontroll & garanti", desc: "Vi kontrollerar resultatet. Flyttstäd har besiktningsgaranti." }
    ],
    priceExamples: [
      { job: "Hemstäd 60 kvm", price: "1 400 kr", duration: "2 timmar" },
      { job: "Flyttstäd 2:a", price: "4 200 kr", duration: "4 timmar" },
      { job: "Byggstäd efter badrum", price: "3 200 kr", duration: "3 timmar" },
      { job: "Fönsterputs 10 fönster", price: "1 800 kr", duration: "2 timmar" }
    ],
    quickFacts: [
      "Stockholm har Sveriges högsta andel hushåll som använder regelbunden städtjänst - 35%",
      "Flyttstäd ska följa Svensk Fastighetsförmedlings checklista",
      "RUT-avdrag ger 50% rabatt på arbetskostnaden (max 75 000 kr/år)",
      "Professionella städare städar 50% snabbare än privatpersoner",
      "Miljövänliga produkter rekommenderas för innerstadslägenheter",
      "BRF-trapphus i Stockholm städas ofta 1 gång per vecka",
      "Fönsterputs 2 gånger per år rekommenderas för bästa ljusinsläpp",
      "Kontorsstäd görs ofta efter kontorstid för att inte störa",
      "Flyttstäd i Stockholm kostar i genomsnitt 5 000 kr för en 3:a",
      "Byggstäd ska göras direkt efter renovering",
      "Hemstäd varannan vecka är vanligast i Stockholm",
      "Sekelskifteslägenheter kräver extra noggrann städning av stuckaturer"
    ],
    didYouKnow: [
      "Stockholm har Sveriges högsta andel hushåll som använder regelbunden städtjänst - 35%",
      "En genomsnittlig lägenhet i Stockholm har 200 000 damm partiklar per kubikdecimeter",
      "Städning med fel produkter på parkett kan orsaka skador för 50 000+ kr",
      "BRF-trapphus i Stockholm städas ofta 1 gång per vecka av professionella städare",
      "Flyttstäd i Stockholm kostar i genomsnitt 5 000 kr för en 3:a",
      "Stockholms torra inomhusklimat gör att damm sprids snabbare än i andra städer",
      "Kontorsstäd i Stockholm sker ofta kl 18-22 för att inte störa arbetet"
    ],
    faqs: [
      { q: "Städar ni kontor?", a: "Ja, vi städar kontor både engångsstädning och regelbundna städavtal. Vi arbetar efter kontorstid för minimal störning." },
      { q: "Gör ni fönsterputs?", a: "Ja, vi erbjuder fönsterputsning både in- och utvändigt för lägenheter upp till 3:e våningen." },
      { q: "Kan ni komma på kvällar?", a: "Ja, vi erbjuder kvällstider för de som behöver städning efter kontorstid. Boka i förväg." }
    ],
    cases: [
      { title: "Kontorsstäd Vasastan", desc: "Regelbunden städning av kontorslokal 200 kvm, 2 gånger per vecka inklusive kök och konferensrum." },
      { title: "Flyttstäd lägenhet Södermalm", desc: "Flyttstäd av 2:a med fönsterputs, rengöring av vitvaror och besiktningsgaranti." }
    ]
  },

  // ========== MARKARBETEN ==========
  {
    service: "Markarbeten",
    city: "Uppsala",
    slug: "markarbeten-uppsala",
    h1: "Markarbeten i Uppsala",
    title: "Markarbeten i Uppsala – Dränering, Grävning & Plattläggning | ROT 50%",
    description: "Professionella markarbeten i Uppsala. Dränering, schaktning, planering och plattläggning. ROT-avdrag 50%.",
    howItWorks: [
      { step: 1, title: "Beskriv ditt markprojekt", desc: "Dränering, plattläggning, schakt? Vi bokar tid för platsbesök." },
      { step: 2, title: "Platsbesök & mätning", desc: "Vi bedömer mark, lutning och behov av förberedande arbete." },
      { step: 3, title: "Detaljerad offert", desc: "Du får offert med materialspecifikation och tidsplan." },
      { step: 4, title: "Utförande med maskiner", desc: "Vi schaktar, dränerar och planerar med rätt utrustning." },
      { step: 5, title: "Färdigställande & dokumentation", desc: "Slutbesiktning och garanti. ROT-avdrag ingår." }
    ],
    priceExamples: [
      { job: "Dränering 20 meter", price: "28 000 kr", duration: "2 dagar" },
      { job: "Plattläggning 30 kvm", price: "45 000 kr", duration: "3-4 dagar" },
      { job: "Schakt för altan 15 kvm", price: "12 000 kr", duration: "1 dag" },
      { job: "Kantsten 10 meter", price: "8 500 kr", duration: "1 dag" }
    ],
    quickFacts: [
      "Uppsalas lerjord kräver ofta mer dränering än sandig jord",
      "Markarbeten kräver ofta bygglov för större projekt",
      "Dränering runt hus förhindrar fuktskador i källare",
      "ROT-avdrag gäller markarbeten kopplade till fastigheten",
      "Plattor ska läggas på stabiliserad sandbädd för långlivad hållbarhet",
      "Uppsala kommun kräver VA-anmälan för koppling till dagvatten",
      "Markarbeten bör göras april-oktober när marken inte är frusen",
      "Dränering kan spara 100 000+ kr i framtida fuktskador",
      "Plattläggning kräver noggrann planering och lutning för vattenavrinning",
      "Schaktning djupare än 1 meter kräver ofta grävtillstånd",
      "Kantsten ger stabilitet och förhindrar att plattor förskjuts",
      "Uppsalas lerjord kräver extra förberedelse innan plattläggning"
    ],
    didYouKnow: [
      "Uppsalas höga lerinnehåll i jorden orsakar fuktproblem i 60% av alla källare",
      "Dränering kan minska fuktproblem med 90% och spara 100 000+ kr i framtida skador",
      "Schaktning till 1 meters djup kräver ofta grävtillstånd från Uppsala kommun",
      "Markarbeten i Uppsala påverkas starkt av frost - arbeten under vinter undviks",
      "Äldre fastigheter i Uppsala (före 1960) saknar ofta dränering helt",
      "Plattläggning i Uppsala kräver 15 cm sandbädd på grund av lerjorden",
      "Uppsala har över 500 mm nederbörd per år - bra dränering är kritiskt"
    ],
    faqs: [
      { q: "Gör ni dränering?", a: "Ja, vi installerar dränering runt hus och fastigheter för att förhindra fuktproblem och läckage i källare." },
      { q: "Kan ni schakta för altan?", a: "Ja, vi gräver och planerar marken inför altanbygge, inklusive kantsten och dränering vid behov." },
      { q: "Lägger ni plattor?", a: "Ja, vi lägger markplattor, natursten och klinkers för uppfarter, gångvägar och uteplatser." }
    ],
    cases: [
      { title: "Dränering villa Svartbäcken", desc: "Installation av dränering runt villa, 30 meter rör med dräneringsmassa och uppkoppling till dagvatten." },
      { title: "Uppfartsplattläggning Luthagen", desc: "Schaktning och plattläggning av biluppfart 40 kvm med kantsten och stabiliserad sandbädd." }
    ]
  },
  {
    service: "Markarbeten",
    city: "Stockholm",
    slug: "markarbeten-stockholm",
    h1: "Markarbeten i Stockholm",
    title: "Markarbeten i Stockholm – Schakt, Dränering & Plattor | ROT 50%",
    description: "Markarbeten i Stockholm med ROT-avdrag 50%.",
    howItWorks: [
      { step: 1, title: "Beskriv ditt markprojekt", desc: "Dränering, plattläggning, schakt? Vi bokar tid för platsbesök." },
      { step: 2, title: "Platsbesök & mätning", desc: "Vi bedömer mark, lutning och behov av förberedande arbete." },
      { step: 3, title: "Detaljerad offert", desc: "Du får offert med materialspecifikation och tidsplan." },
      { step: 4, title: "Utförande med maskiner", desc: "Vi schaktar, dränerar och planerar med rätt utrustning." },
      { step: 5, title: "Färdigställande & dokumentation", desc: "Slutbesiktning och garanti. ROT-avdrag ingår." }
    ],
    priceExamples: [
      { job: "Dränering 20 meter", price: "32 000 kr", duration: "2 dagar" },
      { job: "Plattläggning 30 kvm", price: "52 000 kr", duration: "3-4 dagar" },
      { job: "Schakt för altan 15 kvm", price: "14 000 kr", duration: "1 dag" },
      { job: "Kantsten 10 meter", price: "10 000 kr", duration: "1 dag" }
    ],
    quickFacts: [
      "Stockholm är byggt på lera och morän - markarbeten är ofta komplexa",
      "Innergårdar kräver ofta handschaktning på grund av begränsat utrymme",
      "ROT-avdrag gäller markarbeten kopplade till fastigheten",
      "Dränering runt hus förhindrar fuktskador i källare",
      "Plattläggning kräver noggrann lutning för vattenavrinning",
      "Stockholm kommun kräver ofta bokning av lastzon för markarbeten",
      "Markarbeten bör göras april-oktober när marken inte är frusen",
      "Schaktning kan stöta på fornlämningar - arkeologisk undersökning krävs ibland",
      "BRF-innergårdar kräver ofta styrelsegodkännande",
      "Dränering kan öka fastighetsvärdet med 5-10%",
      "Kantsten förhindrar att plattor förskjuts över tid",
      "Stockholms markarbeten kostar ofta 20% mer än i andra städer"
    ],
    didYouKnow: [
      "Stockholm är byggt på lera och morän - markarbeten är ofta komplexa",
      "Gamla Stans medeltida hus har ofta dränering från 1600-talet som fortfarande fungerar",
      "Schaktning i Stockholm kan stöta på fornlämningar - arkeologisk undersökning krävs ibland",
      "Markarbeten i Stockholm kräver ofta bokning av lastzon 4 veckor i förväg",
      "Stockholms kommuner har olika regler för markarbeten - kolla lokala föreskrifter",
      "Plattläggning på Södermalm kräver ofta bergsprängning - mycket dyrare än på andra platser",
      "Dränering runt sekelskiftesfastigheter i Stockholm kan öka värdet med 200 000+ kr"
    ],
    faqs: [
      { q: "Kan ni arbeta i innergårdar?", a: "Ja, vi har erfarenhet av arbete i innergårdar med begränsat utrymme och tar hänsyn till grannar och tillgänglighet." },
      { q: "Gör ni markberedning för pool?", a: "Ja, vi gräver och förbereder mark för poolinstallation inklusive planering och stabilisering." }
    ],
    cases: [
      { title: "Trädgårdsplattläggning Östermalm", desc: "Uteplats 25 kvm med natursten, dränering och kantsten i innergård." }
    ]
  },

  // ========== TEKNISKA INSTALLATIONER ==========
  {
    service: "Tekniska installationer",
    city: "Uppsala",
    slug: "tekniska-installationer-uppsala",
    h1: "Tekniska installationer i Uppsala",
    title: "Tekniska installationer i Uppsala – Nätverk, Larm & IT",
    description: "Nätverksinstallation, larm och IT-support i Uppsala.",
    howItWorks: [
      { step: 1, title: "Beskriv din tekniska installation", desc: "Nätverk, larm, kameror? Telefon eller online-bokning." },
      { step: 2, title: "Platsbesök & analys", desc: "Tekniker besöker för att bedöma behov och befintlig infrastruktur." },
      { step: 3, title: "Lösningsförslag & offert", desc: "Vi föreslår bästa lösning med utrustning och kostnad." },
      { step: 4, title: "Installation & konfiguration", desc: "Certifierad tekniker installerar och testar allt." },
      { step: 5, title: "Utbildning & dokumentation", desc: "Du får instruktioner och dokumentation för systemet." }
    ],
    priceExamples: [
      { job: "Nätverksinstallation 5 punkter", price: "8 500 kr", duration: "1 dag" },
      { job: "Larm villa med 8 sensorer", price: "12 000 kr", duration: "1 dag" },
      { job: "Wifi-mesh 3 accesspunkter", price: "6 500 kr", duration: "0,5 dag" },
      { job: "Kamerasystem 4 kameror", price: "15 000 kr", duration: "1-2 dagar" }
    ],
    quickFacts: [
      "Nätverkskablar ska vara Cat6 eller bättre för framtidssäkring",
      "Wifi-täckning i Uppsala påverkas av tjocka tegelväggar",
      "Larmsystem kräver abonnemang hos larmcentral (200-400 kr/mån)",
      "Kameror med molnlagring kostar 50-150 kr/mån per kamera",
      "ROT-avdrag gäller inte för tekniska installationer (undantag: belysningsstyrning)",
      "Uppsala har god 4G/5G-täckning för backup-lösningar",
      "Wifi-mesh är bättre än repeaters för stora hus",
      "Nätverksinstallation ökar fastighetsvärdet med 1-3%",
      "Smart home-integration kan spara 15% på elräkningen",
      "Uppsala har 5 000+ smarta hem med automation",
      "Kamerasystem kräver GDPR-compliance vid utomhusinstallation",
      "Säkerhetssystem med app-styrning ökar tryggheten"
    ],
    didYouKnow: [
      "Uppsala universitet har Sveriges snabbaste forskningsnätverk - 100 Gbit/s",
      "En genomsnittlig villa i Uppsala har 25 uppkopplade enheter (IoT)",
      "Wifi i betongväggar tappar 60% styrka jämfört med träväggar",
      "Larmsystem minskar inbrottsrisken med 90% enligt Folksam",
      "Kamerasystem i Uppsala måste följa Datainspektionens regler för integritet",
      "Cat6-kablar kan leverera 10 Gbit/s över 55 meter - mycket snabbare än wifi",
      "Smart home-automation i Uppsala växer med 30% per år"
    ],
    faqs: [
      { q: "Installerar ni nätverk?", a: "Ja, vi drar nätverkskablar, installerar routrar, switches och wifi-accesspunkter för hemma och kontor." },
      { q: "Kan ni sätta upp larm?", a: "Ja, vi installerar och programmerar larmsystem för villor, lägenheter och företag." },
      { q: "Gör ni IT-support?", a: "Ja, vi hjälper till med datorproblem, nätverksinställningar och installation av programvara." }
    ],
    cases: [
      { title: "Nätverksinstallation kontor Gottsunda", desc: "Dragning av Cat6-kablar till 12 arbetsstationer, installation av rack och konfiguration av nätverk." },
      { title: "Larminstallation villa Svartbäcken", desc: "Installation av trådlöst larmsystem med rörelsesensorer, dörrkontakter och app-styrning." }
    ]
  },
  {
    service: "Tekniska installationer",
    city: "Stockholm",
    slug: "tekniska-installationer-stockholm",
    h1: "Tekniska installationer i Stockholm",
    title: "Tekniska installationer i Stockholm – Nätverk & Larm",
    description: "Professionella tekniska installationer i Stockholm.",
    howItWorks: [
      { step: 1, title: "Beskriv din tekniska installation", desc: "Nätverk, larm, kameror? Telefon eller online-bokning." },
      { step: 2, title: "Platsbesök & analys", desc: "Tekniker besöker för att bedöma behov och befintlig infrastruktur." },
      { step: 3, title: "Lösningsförslag & offert", desc: "Vi föreslår bästa lösning med utrustning och kostnad." },
      { step: 4, title: "Installation & konfiguration", desc: "Certifierad tekniker installerar och testar allt." },
      { step: 5, title: "Utbildning & dokumentation", desc: "Du får instruktioner och dokumentation för systemet." }
    ],
    priceExamples: [
      { job: "Nätverksinstallation 5 punkter", price: "10 000 kr", duration: "1 dag" },
      { job: "Larm villa med 8 sensorer", price: "14 000 kr", duration: "1 dag" },
      { job: "Wifi-mesh 3 accesspunkter", price: "7 500 kr", duration: "0,5 dag" },
      { job: "Kamerasystem 4 kameror", price: "18 000 kr", duration: "1-2 dagar" }
    ],
    quickFacts: [
      "Stockholm har Sveriges bästa fiberinfrastruktur - 95% täckning",
      "Nätverksinstallation i BRF kräver ofta styrelsegodkännande",
      "Wifi i sekelskifteslägenheter påverkas av tjocka murarväggar",
      "Kamerasystem utomhus kräver tillstånd från byggnadsnämnden",
      "Larmsystem med rörelsedetektorer rekommenderas för Stockholms lägenheter",
      "Tekniska installationer i Stockholm måste följa BBR 2011:6",
      "Mesh-wifi täcker 300 kvm med 3 accesspunkter",
      "Cat7-kablar rekommenderas för framtidssäkra installationer",
      "Stockholm har 80 000+ smarta hem med automation",
      "Larm med kameraverifiering minskar falsklarm med 95%",
      "Nätverksinstallation i Stockholm kostar 20% mer än Uppsala",
      "GDPR kräver tydlig skyltning vid kameraövervakning"
    ],
    didYouKnow: [
      "Stockholm har Sveriges snabbaste hemanslutningar - upp till 10 Gbit/s fiber",
      "En genomsnittlig Stockholmslägenhet har 30+ uppkopplade enheter",
      "Wifi-störningar i Stockholm orsakas ofta av grannars nätverk - rätt kanal är kritiskt",
      "Stockholms polisstation använder samma larmcentraler som finns för privatpersoner",
      "Cat6-kabling i Stockholm ökar lägenhetsvärdet med 50 000+ kr",
      "Smart home i Stockholm kan spara 2 000-4 000 kr/år på el och värme",
      "Kamerasystem i Stockholm minskar inbrottsförsök med 85% enligt försäkringsbolag"
    ],
    faqs: [
      { q: "Arbetar ni med företag?", a: "Ja, vi har stor erfarenhet av företagsinstallationer inklusive nätverk, larmsystem och kamerasystem." },
      { q: "Installerar ni kamerasystem?", a: "Ja, vi installerar kamerasystem för övervakning av fastigheter och företag med molnlagring." }
    ],
    cases: [
      { title: "Kontorsnätverk Vasastan", desc: "Nätverksinstallation för nytt kontor med wifi-täckning, serverskåp och backup-lösning." }
    ]
  },

  // ========== FLYTT ==========
  {
    service: "Flytt",
    city: "Uppsala",
    slug: "flytt-uppsala",
    h1: "Flytthjälp i Uppsala",
    title: "Flytthjälp i Uppsala – Bärhjälp, Packning & Transport | RUT 50%",
    description: "Professionell flytthjälp i Uppsala. Bärhjälp, packning och transport. RUT-avdrag 50%.",
    howItWorks: [
      { step: 1, title: "Berätta om din flytt", desc: "Storlek, distans, extra tjänster som packning? Ring eller boka online." },
      { step: 2, title: "Offert & inventering", desc: "Vi ger fast pris baserat på volym och distans. Platsbesök vid behov." },
      { step: 3, title: "Bokning & förberedelse", desc: "Vi bokar lastbil, personal och skyddsmaterial för flytten." },
      { step: 4, title: "Flyttdagen", desc: "Proffs bär, lastar och transporterar säkert. Vi skyddar trappor och väggar." },
      { step: 5, title: "Uppackning & RUT-avdrag", desc: "Vi packar upp vid behov. RUT 50% ingår i priset." }
    ],
    priceExamples: [
      { job: "Flytt 2:a (40 kvm) inom Uppsala", price: "6 500 kr", duration: "4 timmar" },
      { job: "Flytt 3:a med packning", price: "12 000 kr", duration: "1 dag" },
      { job: "Kontorsflytt 100 kvm", price: "18 000 kr", duration: "1 dag" },
      { job: "Pianoflytt", price: "4 500 kr", duration: "2 timmar" }
    ],
    quickFacts: [
      "Flytt kräver bokning av flyttlastzon på trafikerade gator",
      "RUT-avdrag gäller 50% av arbetskostnaden för flytt",
      "Packning av glas och porslin ska göras med bubbelplast",
      "Piano kräver specialutrustning och 3 personer",
      "Flyttkartonger kostar 25-35 kr/st och kan återvinnas",
      "Uppsala har 8 000 flyttar per år i genomsnitt",
      "Flytt mellan våningar utan hiss kostar 30% mer",
      "Försäkring täcker skador under flytt - spara kvitton",
      "Flytt tar i genomsnitt 4-8 timmar för en 3:a",
      "Vinterflytt kräver extra skydd mot kyla och snö",
      "Bästa tiden för flytt i Uppsala är maj-september",
      "Kontorsflytt kräver ofta IT-flytt med specialkompetens"
    ],
    didYouKnow: [
      "Svenskar flyttar i genomsnitt 9 gånger under sitt liv",
      "Felaktig bärning av tunga föremål orsakar 3 000 arbetsskador per år i Sverige",
      "En 3:a i Uppsala har i genomsnitt 30 kubikmeter volym att flytta",
      "Flytt utan proffs tar 3x längre tid och riskerar skador på möbler",
      "Uppsala kommun kräver flytttillstånd för stora flyttbilar på vissa gator",
      "Piano kan väga 200-400 kg och kräver 3-4 personer för säker flytt",
      "Packningstid för en 3:a är 10-15 timmar för en person - proffs gör det på 4 timmar"
    ],
    faqs: [
      { q: "Har ni egen lastbil?", a: "Ja, vi har lastbilar i olika storlekar för allt från mindre lägenhetsflyttar till stora villor." },
      { q: "Packar ni också?", a: "Ja, vi erbjuder packhjälp med professionellt packmaterial och kan packa hela hushållet åt dig." },
      { q: "Flyttar ni möbler mellan våningar?", a: "Ja, vi har utrustning för tunga lyft och trappflyttar. Vi skyddar trappor och väggar under flytten." }
    ],
    cases: [
      { title: "Flytt lägenhet 3:a Luthagen", desc: "Komplett flytt med packning, transport och uppackning. Piano och stora möbler hanterades professionellt." },
      { title: "Kontorsflytt Gottsunda", desc: "Flytt av kontor med IT-utrustning, möbler och arkiv. Utförd på en helg för minimal driftstörning." }
    ]
  },
  {
    service: "Flytt",
    city: "Stockholm",
    slug: "flytt-stockholm",
    h1: "Flytthjälp i Stockholm",
    title: "Flytthjälp i Stockholm – Bärhjälp & Transport | RUT 50%",
    description: "Pålitlig flytthjälp i Stockholm med RUT-avdrag 50%.",
    howItWorks: [
      { step: 1, title: "Berätta om din flytt", desc: "Storlek, distans, extra tjänster som packning? Ring eller boka online." },
      { step: 2, title: "Offert & inventering", desc: "Vi ger fast pris baserat på volym och distans. Platsbesök vid behov." },
      { step: 3, title: "Bokning & förberedelse", desc: "Vi bokar lastbil, personal och skyddsmaterial för flytten." },
      { step: 4, title: "Flyttdagen", desc: "Proffs bär, lastar och transporterar säkert. Vi skyddar trappor och väggar." },
      { step: 5, title: "Uppackning & RUT-avdrag", desc: "Vi packar upp vid behov. RUT 50% ingår i priset." }
    ],
    priceExamples: [
      { job: "Flytt 2:a (40 kvm) inom Stockholm", price: "8 500 kr", duration: "4 timmar" },
      { job: "Flytt 3:a med packning", price: "15 000 kr", duration: "1 dag" },
      { job: "Kontorsflytt 100 kvm", price: "22 000 kr", duration: "1 dag" },
      { job: "Pianoflytt", price: "5 500 kr", duration: "2 timmar" }
    ],
    quickFacts: [
      "Stockholm har Sveriges högsta flytt densitet - 35 000 flyttar/år",
      "Lastzon måste bokas 2-4 veckor i förväg i innerstaden",
      "Flytt utan hiss i Gamla Stan kan kosta dubbelt så mycket",
      "RUT-avdrag ger 50% rabatt på arbetskostnad (max 75 000 kr/år)",
      "Sekelskifteslägenheter har ofta trånga trapphus - mät innan flytt",
      "Försäkring täcker skador upp till 100 000 kr vid professionell flytt",
      "Packmaterial kan återvinnas hos Stockholms återvinningscentraler",
      "Flytt mellan städer (Uppsala-Stockholm) tar 4-6 timmar",
      "Piano i Stockholm kostar 5 500-8 000 kr beroende på våning",
      "Flytt på sommaren är 20% dyrare på grund av högre efterfrågan",
      "Stockholm har 15 flyttfirmor med miljöcertifiering",
      "Kontorsflytt i Stockholm kräver ofta nattarbete för att inte störa verksamhet"
    ],
    didYouKnow: [
      "Stockholm har Sveriges smalaste gränd (Mårten Trotzigs gränd, 90 cm) - omöjlig för stora möbler",
      "Genomsnittlig Stockholmsflytt kostar 12 000 kr för en 3:a",
      "Gamla Stans trapphus från 1600-talet är ofta för smala för moderna möbler - behövs lyftkran",
      "En sekelskifteslägenhet i Stockholm har ofta dörrar som är 10 cm smalare än moderna standarder",
      "Flytt i Stockholm utan proffs kan ta 2-3 dagar för en familj",
      "Stockholms innerstad har parkeringsförbud på 90% av gatorna - lastzon är obligatorisk",
      "Pianoflytt i Stockholm använder ofta lyftkran för våningar över 3:e - kostar 15 000+ kr"
    ],
    faqs: [
      { q: "Kan ni flytta piano?", a: "Ja, vi har specialutrustning och erfarenhet av att flytta pianon och andra tunga instrument säkert." },
      { q: "Arbetar ni helger?", a: "Ja, vi erbjuder flytthjälp även på helger för de som behöver flytta då. Boka i god tid." },
      { q: "Har ni flyttkartonger?", a: "Ja, vi säljer och hyr ut flyttkartonger i olika storlekar samt packmaterial." }
    ],
    cases: [
      { title: "Lägenhetsflytt Södermalm", desc: "Flytt av 2:a från 4:e våning utan hiss. Allt hanterades smidigt med trappskydd och professionell utrustning." },
      { title: "Kontorsflytt Kungsholmen", desc: "Flytt av större kontor med servrar, skrivbord och kontorsinredning. Genomförd över en helg." }
    ]
  },

  // ========== MÅLERI - UPPSALA ==========
  {
    service: "Måleri",
    city: "Uppsala",
    slug: "malning-uppsala",
    h1: "Målare i Uppsala",
    title: "Målare i Uppsala – Målning, Tapetsering & Ytbehandling | ROT 30%",
    description: "Professionella målare i Uppsala för målning av rum, tak, fasad och tapetsering. Snabb start, ROT-avdrag 30%. Vi täcker hela Uppsala.",
    priceHint: "Från 450 kr/h",
    howItWorks: [
      { step: 1, title: "Kontakt & konsultation", desc: "Berätta om målningsprojekt. Rum, fasad, färgval? Vi bokar hembesök." },
      { step: 2, title: "Platsbesök & färgkonsultation", desc: "Målare bedömer yta, skick och behov. Hjälper med färgval." },
      { step: 3, title: "Offert med tidsplan", desc: "Fast pris med material och arbetskostnad. Tydlig tidsplan." },
      { step: 4, title: "Förberedelse & målning", desc: "Vi täcker golv, spackling, slipning, grundning och målning." },
      { step: 5, title: "Slutbesiktning & garanti", desc: "Kontroll och städning. Du får garanti och ROT-avdrag 30%." }
    ],
    priceExamples: [
      { job: "Målning rum 15 kvm", price: "6 500 kr", duration: "1 dag" },
      { job: "Målning kök inkl. luckor", price: "12 000 kr", duration: "2 dagar" },
      { job: "Fasadmålning 100 kvm", price: "45 000 kr", duration: "1 vecka" },
      { job: "Tapetsering sovrum", price: "5 500 kr", duration: "1 dag" }
    ],
    quickFacts: [
      "ROT-avdrag för målning är 30% av arbetskostnaden (inte 50% som VVS/El)",
      "Uppsala har många villor med träfasader som behöver målning vart 8-10 år",
      "Spackling och slipning är 40% av arbetet - viktigt för bra resultat",
      "Färgval påverkar rumskänsla - ljusa färger gör rum större",
      "Målning av köksluckor kostar 60% mindre än nya luckor",
      "Fasadmålning kräver torrt väder - undvik oktober-mars",
      "Grundning är obligatoriskt på nya ytor för långlivad hållbarhet",
      "Målning ökar fastighetsvärdet med 2-5%",
      "Uppsala har 12 000+ villor med träfasader",
      "Tapetsering kräver 24h torktid innan möbler kan flyttas in",
      "Miljömärkt färg kostar 20% mer men är bättre för inomhusluft",
      "Professionella målare målar 50% snabbare och snyggare än privatpersoner"
    ],
    didYouKnow: [
      "Färg uppfanns i Sverige 1887 av Alcro-Beckers - Uppsala var bland första städerna att använda färg",
      "Fel färgval kan göra ett rum 20% mindre - ljusa färger reflekterar ljus",
      "Spackling och slipning tar längre tid än själva målningen",
      "En villa i Uppsala målas om var 15:e år i genomsnitt",
      "Gammal blymålning från före 1970 kräver specialhantering - farlig för barn",
      "Takmålning kräver 30% mer färg än väggmålning på grund av absorption",
      "En proffsmålare använder 10 liter färg för 40 kvm väggyta"
    ],
    faqs: [
      { 
        q: "Hur snabbt kan målare komma ut i Uppsala?", 
        a: "Vi kan oftast starta målningsprojekt inom 3-5 dagar beroende på projektets storlek. För akuta behov kontakta oss direkt." 
      },
      { 
        q: "Ingår material i priset?", 
        a: "Material som färg, spackel och tape faktureras separat. Vi hjälper dig välja rätt kvalitet och färgval för ditt projekt." 
      },
      {
        q: "Kan ni tapetsera också?",
        a: "Ja, vi utför både målning och tapetsering. Vi har erfarenhet av både klassiska tapeter och moderna tapetvarianter."
      },
      {
        q: "Finns ROT-avdrag för målning?",
        a: "Ja, målning och tapetsering i befintlig bostad ger 30% ROT-avdrag på arbetskostnaden."
      }
    ],
    cases: [
      { 
        title: "Målning av villa i Gottsunda",
        desc: "Komplett målning av 3 rum, hall och kök. Inklusive spackling, grundning och två lager toppmålning. Projekttid: 5 dagar." 
      },
      { 
        title: "Tapetsering lägenhet Kungsängen",
        desc: "Tapetsering av sovrum och vardagsrum med moderna designtapeter. Inklusive rivning av gammal tapet och preparering." 
      },
      { 
        title: "Fasadmålning radhus Stenhagen",
        desc: "Målning av träfasad på radhus, inklusive slipning, grundning och två lager fasadfärg. Certifierad för ROT-avdrag." 
      }
    ]
  },

  // ========== MÅLERI - STOCKHOLM ==========
  {
    service: "Måleri",
    city: "Stockholm",
    slug: "malning-stockholm",
    h1: "Målare i Stockholm",
    title: "Målare i Stockholm – Målning, Tapetsering & Ytbehandling | ROT 30%",
    description: "Erfarna målare i Stockholm för målning av rum, fasader och tapetsering. Snabb hjälp, ROT-avdrag 30%. Täcker hela Stockholms stad.",
    priceHint: "Från 500 kr/h",
    howItWorks: [
      { step: 1, title: "Första kontakt", desc: "Beskriv målningsprojekt och område i Stockholm. Vi bokar tid för besök." },
      { step: 2, title: "Hembesök & färgrådgivning", desc: "Målare mäter upp, bedömer skick och ger färgrekommendationer." },
      { step: 3, title: "Detaljerad offert", desc: "Du får fast pris med material, arbetskostnad och tidsplan. ROT-avdrag 30% ingår." },
      { step: 4, title: "Målningsarbete", desc: "Vi täcker, spackar, slipar, grundar och målar. Minimal störning." },
      { step: 5, title: "Slutkontroll & städning", desc: "Vi kontrollerar kvalitet, städar och du får garanti." }
    ],
    priceExamples: [
      { job: "Målning rum 15 kvm", price: "8 000 kr", duration: "1 dag" },
      { job: "Målning kök inkl. luckor", price: "15 000 kr", duration: "2 dagar" },
      { job: "Fasadmålning 100 kvm", price: "55 000 kr", duration: "1 vecka" },
      { job: "Tapetsering sovrum", price: "7 000 kr", duration: "1 dag" }
    ],
    quickFacts: [
      "ROT-avdrag för målning är 30% (gäller arbetskostnad, ej material)",
      "Stockholm har 80% lägenheter - målning av väggar i lägenheter är vanligast",
      "BRF-regler i Stockholm kräver ofta godkännande för fasadmålning",
      "Sekelskifteslägenheter har ofta vackra stuckaturer som ska bevaras",
      "Målning av köksluckor är 70% billigare än att köpa nytt kök",
      "Spackling av sprickor är kritiskt i gamla Stockholmshus",
      "Färgval i Stockholm påverkas av ljusinsläpp - Södermalm har mindre ljus än Östermalm",
      "Takmålning i Stockholm är vanligare än i andra städer - höga tak",
      "Målning kan minska värdet om fel färg väljs - konsultera proffs",
      "Stockholm har 500+ målare - välj certifierade för ROT-avdrag",
      "Fasadmålning i Stockholm kräver bygglov i vissa områden",
      "Miljömärkt färg (Svanen) rekommenderas för innerstadslägenheter"
    ],
    didYouKnow: [
      "Stockholms sekelskifteslägenheter målades ursprungligen med linoljefärg som höll i 50+ år",
      "Fel färgval kan minska lägenhetsvärdet med 100 000+ kr vid försäljning",
      "Gamla Stan har 600+ fastigheter med originalmålning från 1600-1800-talet",
      "Stuckatur i Stockholms lägenheter kan ha 10+ lager färg - avspolning kan ta dagar",
      "Målning av trapphus i BRF kostar 50 000-150 000 kr beroende på storlek",
      "Stockholms torra inomhusklimat gör att färg torkar 30% snabbare än i kustnära städer",
      "Professionell målning i Stockholm kan spara 20 000+ kr i skador jämfört med egen målning"
    ],
    faqs: [
      { 
        q: "Hur snabbt kan målare komma ut i Stockholm?", 
        a: "Beroende på område och projekttyp kan vi ofta starta inom 3-7 dagar. Kontakta oss för exakt tillgänglighet." 
      },
      { 
        q: "Vilka områden i Stockholm täcker ni?", 
        a: "Vi täcker hela Stockholms stad inklusive Södermalm, Östermalm, Vasastan, Kungsholmen och alla övriga stadsdelar." 
      },
      {
        q: "Kan ni måla fasader?",
        a: "Ja, vi utför både fasadmålning och invändig målning. Vi har rätt utrustning och kompetens för både putsfasader och träfasader."
      },
      {
        q: "Vad kostar målning av ett rum?",
        a: "Priset beror på rumsstorlek, skick och finish. Ett standardrum (15-20 kvm) kostar typiskt 8 000-15 000 kr inklusive material och ROT."
      }
    ],
    cases: [
      { 
        title: "Helrenovering lägenhet Södermalm",
        desc: "Målning av 3:a i Södermalm inklusive spackling, grundning och målning av väggar, tak och foder. Projekttid: 1 vecka." 
      },
      { 
        title: "Tapetsering våning Östermalm",
        desc: "Tapetsering av hall och två sovrum med exklusiva designer-tapeter. Perfekt slutresultat med ROT-avdrag." 
      },
      { 
        title: "Målning radhus Bromma",
        desc: "Fasadmålning av 2-plans radhus inklusive fönsterbågar och dörrar. Komplett målningssystem för långvarig skydd." 
      }
    ]
  }
];
