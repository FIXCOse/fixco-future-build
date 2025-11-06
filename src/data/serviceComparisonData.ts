export interface ServiceComparisonItem {
  label: string;
  fixco: string;
  fixcoSubtext?: string;
  competitor: string;
  competitorSubtext?: string;
  competitorBad?: boolean;
}

export type ServiceComparisonData = {
  [key: string]: ServiceComparisonItem[];
};

// Service category names for dynamic titles
export const serviceCategoryNames: Record<string, string> = {
  'el': 'elektriker',
  'vvs': 'VVS-installatörer',
  'snickeri': 'snickare',
  'maleri': 'målare',
  'montering': 'monteringsservice',
  'tradgard': 'trädgårdstjänster',
  'stadning': 'städservice',
  'markarbeten': 'markarbeten',
  'tekniska-installationer': 'tekniska installationer',
  'flytt': 'flyttservice',
  'default': 'hantverkare'
};

export const serviceComparisonData: ServiceComparisonData = {
  el: [
    {
      label: 'Pris per timme',
      fixco: '675 kr',
      fixcoSubtext: 'Fast pris (tillfälligt)',
      competitor: '800-1200 kr',
      competitorBad: true
    },
    {
      label: 'ROT-hantering',
      fixco: '✅ Gratis',
      fixcoSubtext: 'Vi sköter allt',
      competitor: 'Oftast gratis',
      competitorBad: false
    },
    {
      label: 'Start inom',
      fixco: '24-48h',
      fixcoSubtext: 'Efter godkänd offert',
      competitor: '5-10 dagar',
      competitorBad: true
    },
    {
      label: 'Garanti',
      fixco: 'Konsumenttjänstlagen + Fixco',
      fixcoSubtext: 'Utökad trygghet',
      competitor: 'Konsumenttjänstlagen',
      competitorBad: false
    },
    {
      label: 'Certifieringar',
      fixco: 'Auktoriserad installatör',
      fixcoSubtext: 'F-skatt + försäkring',
      competitor: 'Varierar',
      competitorBad: true
    },
    {
      label: 'Kundnöjdhet',
      fixco: '4.9/5',
      fixcoSubtext: 'Verifierade omdömen',
      competitor: '3.8-4.2/5',
      competitorBad: false
    }
  ],
  vvs: [
    {
      label: 'Pris per timme',
      fixco: '750 kr',
      fixcoSubtext: 'Fast pris (tillfälligt)',
      competitor: '850-1400 kr',
      competitorBad: true
    },
    {
      label: 'ROT-hantering',
      fixco: '✅ Gratis',
      fixcoSubtext: 'Vi sköter allt',
      competitor: 'Oftast gratis',
      competitorBad: false
    },
    {
      label: 'Start inom',
      fixco: '24-48h',
      fixcoSubtext: 'Efter godkänd offert',
      competitor: '5-10 dagar',
      competitorBad: true
    },
    {
      label: 'Garanti',
      fixco: 'Konsumenttjänstlagen + Fixco',
      fixcoSubtext: 'Utökad trygghet',
      competitor: 'Konsumenttjänstlagen',
      competitorBad: false
    },
    {
      label: 'Certifieringar',
      fixco: 'Certifierad rörmokare',
      fixcoSubtext: 'F-skatt + försäkring',
      competitor: 'Varierar',
      competitorBad: true
    },
    {
      label: 'Kundnöjdhet',
      fixco: '4.9/5',
      fixcoSubtext: 'Verifierade omdömen',
      competitor: '3.8-4.2/5',
      competitorBad: false
    }
  ],
  snickeri: [
    {
      label: 'Pris per timme',
      fixco: '650 kr',
      fixcoSubtext: 'Fast pris (tillfälligt)',
      competitor: '750-1100 kr',
      competitorBad: true
    },
    {
      label: 'ROT-hantering',
      fixco: '✅ Gratis',
      fixcoSubtext: 'Vi sköter allt',
      competitor: 'Oftast gratis',
      competitorBad: false
    },
    {
      label: 'Start inom',
      fixco: '24-48h',
      fixcoSubtext: 'Efter godkänd offert',
      competitor: '5-10 dagar',
      competitorBad: true
    },
    {
      label: 'Garanti',
      fixco: 'Konsumenttjänstlagen + Fixco',
      fixcoSubtext: 'Utökad trygghet',
      competitor: 'Konsumenttjänstlagen',
      competitorBad: false
    },
    {
      label: 'Certifieringar',
      fixco: 'Certifierade snickare',
      fixcoSubtext: 'F-skatt + försäkring',
      competitor: 'Varierar',
      competitorBad: true
    },
    {
      label: 'Kundnöjdhet',
      fixco: '4.9/5',
      fixcoSubtext: 'Verifierade omdömen',
      competitor: '3.8-4.2/5',
      competitorBad: false
    }
  ],
  maleri: [
    {
      label: 'Pris per timme',
      fixco: '600 kr',
      fixcoSubtext: 'Fast pris (tillfälligt)',
      competitor: '700-1000 kr',
      competitorBad: true
    },
    {
      label: 'ROT-hantering',
      fixco: '✅ Gratis',
      fixcoSubtext: 'Vi sköter allt',
      competitor: 'Oftast gratis',
      competitorBad: false
    },
    {
      label: 'Start inom',
      fixco: '24-48h',
      fixcoSubtext: 'Efter godkänd offert',
      competitor: '5-10 dagar',
      competitorBad: true
    },
    {
      label: 'Garanti',
      fixco: 'Konsumenttjänstlagen + Fixco',
      fixcoSubtext: 'Utökad trygghet',
      competitor: 'Konsumenttjänstlagen',
      competitorBad: false
    },
    {
      label: 'Certifieringar',
      fixco: 'Certifierade målare',
      fixcoSubtext: 'F-skatt + försäkring',
      competitor: 'Varierar',
      competitorBad: true
    },
    {
      label: 'Kundnöjdhet',
      fixco: '4.9/5',
      fixcoSubtext: 'Verifierade omdömen',
      competitor: '3.8-4.2/5',
      competitorBad: false
    }
  ],
  montering: [
    {
      label: 'Pris per timme',
      fixco: '550 kr',
      fixcoSubtext: 'Fast pris (tillfälligt)',
      competitor: '650-950 kr',
      competitorBad: true
    },
    {
      label: 'ROT-hantering',
      fixco: '✅ Gratis',
      fixcoSubtext: 'Vi sköter allt',
      competitor: 'Oftast gratis',
      competitorBad: false
    },
    {
      label: 'Start inom',
      fixco: '24-48h',
      fixcoSubtext: 'Efter godkänd offert',
      competitor: '5-10 dagar',
      competitorBad: true
    },
    {
      label: 'Garanti',
      fixco: 'Konsumenttjänstlagen + Fixco',
      fixcoSubtext: 'Utökad trygghet',
      competitor: 'Konsumenttjänstlagen',
      competitorBad: false
    },
    {
      label: 'Certifieringar',
      fixco: 'Certifierade montörer',
      fixcoSubtext: 'F-skatt + försäkring',
      competitor: 'Varierar',
      competitorBad: true
    },
    {
      label: 'Kundnöjdhet',
      fixco: '4.9/5',
      fixcoSubtext: 'Verifierade omdömen',
      competitor: '3.8-4.2/5',
      competitorBad: false
    }
  ],
  tradgard: [
    {
      label: 'Pris per timme',
      fixco: '500 kr',
      fixcoSubtext: 'Fast pris (tillfälligt)',
      competitor: '600-900 kr',
      competitorBad: true
    },
    {
      label: 'RUT-hantering',
      fixco: '✅ Gratis',
      fixcoSubtext: 'Vi sköter allt',
      competitor: 'Oftast gratis',
      competitorBad: false
    },
    {
      label: 'Start inom',
      fixco: '24-48h',
      fixcoSubtext: 'Efter godkänd offert',
      competitor: '5-10 dagar',
      competitorBad: true
    },
    {
      label: 'Garanti',
      fixco: 'Konsumenttjänstlagen + Fixco',
      fixcoSubtext: 'Utökad trygghet',
      competitor: 'Konsumenttjänstlagen',
      competitorBad: false
    },
    {
      label: 'Certifieringar',
      fixco: 'RUT-godkänd',
      fixcoSubtext: 'F-skatt + försäkring',
      competitor: 'Varierar',
      competitorBad: true
    },
    {
      label: 'Kundnöjdhet',
      fixco: '4.9/5',
      fixcoSubtext: 'Verifierade omdömen',
      competitor: '3.8-4.2/5',
      competitorBad: false
    }
  ],
  stadning: [
    {
      label: 'Pris per timme',
      fixco: '400 kr',
      fixcoSubtext: 'Fast pris (tillfälligt)',
      competitor: '500-750 kr',
      competitorBad: true
    },
    {
      label: 'RUT-hantering',
      fixco: '✅ Gratis',
      fixcoSubtext: 'Vi sköter allt',
      competitor: 'Oftast gratis',
      competitorBad: false
    },
    {
      label: 'Start inom',
      fixco: '24-48h',
      fixcoSubtext: 'Efter godkänd offert',
      competitor: '5-10 dagar',
      competitorBad: true
    },
    {
      label: 'Garanti',
      fixco: 'Konsumenttjänstlagen + Fixco',
      fixcoSubtext: 'Nöjdhetsgaranti',
      competitor: 'Konsumenttjänstlagen',
      competitorBad: false
    },
    {
      label: 'Certifieringar',
      fixco: 'RUT-godkänd',
      fixcoSubtext: 'F-skatt + försäkring',
      competitor: 'Varierar',
      competitorBad: true
    },
    {
      label: 'Kundnöjdhet',
      fixco: '4.9/5',
      fixcoSubtext: 'Verifierade omdömen',
      competitor: '3.8-4.2/5',
      competitorBad: false
    }
  ],
  markarbeten: [
    {
      label: 'Pris per timme',
      fixco: '700 kr',
      fixcoSubtext: 'Fast pris (tillfälligt)',
      competitor: '800-1300 kr',
      competitorBad: true
    },
    {
      label: 'ROT-hantering',
      fixco: '✅ Gratis',
      fixcoSubtext: 'Vi sköter allt',
      competitor: 'Oftast gratis',
      competitorBad: false
    },
    {
      label: 'Start inom',
      fixco: '24-48h',
      fixcoSubtext: 'Efter godkänd offert',
      competitor: '5-10 dagar',
      competitorBad: true
    },
    {
      label: 'Garanti',
      fixco: 'Konsumenttjänstlagen + Fixco',
      fixcoSubtext: 'Utökad trygghet',
      competitor: 'Konsumenttjänstlagen',
      competitorBad: false
    },
    {
      label: 'Certifieringar',
      fixco: 'Certifierade markarbetare',
      fixcoSubtext: 'F-skatt + försäkring',
      competitor: 'Varierar',
      competitorBad: true
    },
    {
      label: 'Kundnöjdhet',
      fixco: '4.9/5',
      fixcoSubtext: 'Verifierade omdömen',
      competitor: '3.8-4.2/5',
      competitorBad: false
    }
  ],
  'tekniska-installationer': [
    {
      label: 'Pris per timme',
      fixco: '650 kr',
      fixcoSubtext: 'Fast pris (tillfälligt)',
      competitor: '750-1200 kr',
      competitorBad: true
    },
    {
      label: 'ROT-hantering',
      fixco: '✅ Gratis',
      fixcoSubtext: 'Vi sköter allt',
      competitor: 'Oftast gratis',
      competitorBad: false
    },
    {
      label: 'Start inom',
      fixco: '24-48h',
      fixcoSubtext: 'Efter godkänd offert',
      competitor: '5-10 dagar',
      competitorBad: true
    },
    {
      label: 'Garanti',
      fixco: 'Konsumenttjänstlagen + Fixco',
      fixcoSubtext: 'Utökad trygghet',
      competitor: 'Konsumenttjänstlagen',
      competitorBad: false
    },
    {
      label: 'Certifieringar',
      fixco: 'Certifierade tekniker',
      fixcoSubtext: 'F-skatt + försäkring',
      competitor: 'Varierar',
      competitorBad: true
    },
    {
      label: 'Kundnöjdhet',
      fixco: '4.9/5',
      fixcoSubtext: 'Verifierade omdömen',
      competitor: '3.8-4.2/5',
      competitorBad: false
    }
  ],
  flytt: [
    {
      label: 'Pris per timme',
      fixco: '550 kr',
      fixcoSubtext: 'Fast pris (tillfälligt)',
      competitor: '650-1000 kr',
      competitorBad: true
    },
    {
      label: 'RUT-hantering',
      fixco: '✅ Gratis',
      fixcoSubtext: 'Vi sköter allt',
      competitor: 'Oftast gratis',
      competitorBad: false
    },
    {
      label: 'Start inom',
      fixco: '24-48h',
      fixcoSubtext: 'Efter godkänd offert',
      competitor: '5-10 dagar',
      competitorBad: true
    },
    {
      label: 'Garanti',
      fixco: 'Konsumenttjänstlagen + Fixco',
      fixcoSubtext: 'Skadegaranti ingår',
      competitor: 'Konsumenttjänstlagen',
      competitorBad: false
    },
    {
      label: 'Certifieringar',
      fixco: 'Certifierade flyttare',
      fixcoSubtext: 'F-skatt + försäkring',
      competitor: 'Varierar',
      competitorBad: true
    },
    {
      label: 'Kundnöjdhet',
      fixco: '4.9/5',
      fixcoSubtext: 'Verifierade omdömen',
      competitor: '3.8-4.2/5',
      competitorBad: false
    }
  ],
  default: [
    {
      label: 'Pris per timme',
      fixco: '600 kr',
      fixcoSubtext: 'Fast pris (tillfälligt)',
      competitor: '700-1100 kr',
      competitorBad: true
    },
    {
      label: 'ROT/RUT-hantering',
      fixco: '✅ Gratis',
      fixcoSubtext: 'Vi sköter allt',
      competitor: 'Oftast gratis',
      competitorBad: false
    },
    {
      label: 'Start inom',
      fixco: '24-48h',
      fixcoSubtext: 'Efter godkänd offert',
      competitor: '5-10 dagar',
      competitorBad: true
    },
    {
      label: 'Garanti',
      fixco: 'Konsumenttjänstlagen + Fixco',
      fixcoSubtext: 'Utökad trygghet',
      competitor: 'Konsumenttjänstlagen',
      competitorBad: false
    },
    {
      label: 'Certifieringar',
      fixco: 'Certifierade hantverkare',
      fixcoSubtext: 'F-skatt + försäkring',
      competitor: 'Varierar',
      competitorBad: true
    },
    {
      label: 'Kundnöjdhet',
      fixco: '4.9/5',
      fixcoSubtext: 'Verifierade omdömen',
      competitor: '3.8-4.2/5',
      competitorBad: false
    }
  ]
};
