export interface ServiceComparisonItem {
  label: string;
  fixco: string;
  fixcoSubtext?: string;
  competitor: string;
  competitorSubtext?: string;
  competitorBad?: boolean;
}

type ServiceComparisonData = {
  [key: string]: ServiceComparisonItem[];
};

export const serviceComparisonData: ServiceComparisonData = {
  'el': [
    {
      label: 'Auktorisation',
      fixco: '✅ Alltid certifierade',
      competitor: 'Varierar',
      competitorBad: true
    },
    {
      label: 'EIA-rapport',
      fixco: '✅ Ingår alltid',
      fixcoSubtext: 'Elinstallationsrapport',
      competitor: 'Extra 1 200-2 000 kr',
      competitorBad: true
    },
    {
      label: 'Elmätning & test',
      fixco: '✅ Ingår',
      competitor: 'Extra 600-1 200 kr',
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
      fixco: '✅ 24-48 timmar',
      competitor: '1-2 veckor',
      competitorBad: true
    },
    {
      label: 'Garantitid',
      fixco: '✅ 5 år',
      competitor: '1-2 år',
      competitorBad: true
    }
  ],
  'vvs': [
    {
      label: 'VVS-certifiering',
      fixco: '✅ Alltid behöriga',
      competitor: 'Varierar',
      competitorBad: true
    },
    {
      label: 'Tryckprovning',
      fixco: '✅ Ingår alltid',
      fixcoSubtext: 'Säker installation',
      competitor: 'Extra 800-1 500 kr',
      competitorBad: true
    },
    {
      label: 'Besiktningsprotokoll',
      fixco: '✅ Digitalt',
      fixcoSubtext: 'Direkt i appen',
      competitor: 'Extra 500-1 000 kr',
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
      fixco: '✅ 24-48 timmar',
      competitor: '1-2 veckor',
      competitorBad: true
    },
    {
      label: 'Fast pris',
      fixco: '✅ Alltid i offerten',
      competitor: 'Sällan',
      competitorBad: true
    }
  ],
  'snickeri': [
    {
      label: 'Certifierad hantverkare',
      fixco: '✅ Alltid',
      competitor: 'Varierar',
      competitorBad: true
    },
    {
      label: 'Fuktsäker garanti',
      fixco: '✅ 5 år',
      fixcoSubtext: 'På alla badrum',
      competitor: '1-2 år eller ingen',
      competitorBad: true
    },
    {
      label: 'Måttsättning',
      fixco: '✅ Ingår',
      fixcoSubtext: 'Precisionsverktyg',
      competitor: 'Extra 500-1 200 kr',
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
      fixco: '✅ 24-48 timmar',
      competitor: '1-2 veckor',
      competitorBad: true
    },
    {
      label: 'Materialrådgivning',
      fixco: '✅ Ingår',
      competitor: 'Sällan',
      competitorBad: true
    }
  ],
  'maleri': [
    {
      label: 'Erfarna målare',
      fixco: '✅ Alltid',
      competitor: 'Varierar',
      competitorBad: true
    },
    {
      label: 'Kulörmatchning',
      fixco: '✅ Ingår',
      fixcoSubtext: 'Perfekt färgmatchning',
      competitor: 'Extra 300-800 kr',
      competitorBad: true
    },
    {
      label: 'Grundning',
      fixco: '✅ Ingår alltid',
      competitor: 'Extra 400-1 000 kr',
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
      fixco: '✅ 24-48 timmar',
      competitor: '1-2 veckor',
      competitorBad: true
    },
    {
      label: 'Garanti',
      fixco: '✅ 3 år',
      competitor: '1 år eller ingen',
      competitorBad: true
    }
  ],
  'montering': [
    {
      label: 'Erfarenhet',
      fixco: '✅ Certifierade montörer',
      competitor: 'Varierar',
      competitorBad: true
    },
    {
      label: 'Verktyg & utrustning',
      fixco: '✅ Professionellt',
      fixcoSubtext: 'Allt vi behöver',
      competitor: 'Kan saknas',
      competitorBad: true
    },
    {
      label: 'Väggkontroll',
      fixco: '✅ Ingår',
      fixcoSubtext: 'Säker montering',
      competitor: 'Sällan',
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
      fixco: '✅ 24-48 timmar',
      competitor: '3-5 dagar',
      competitorBad: true
    },
    {
      label: 'Fast pris',
      fixco: '✅ Alltid',
      competitor: 'Varierar',
      competitorBad: true
    }
  ],
  'tradgard': [
    {
      label: 'Professionell utrustning',
      fixco: '✅ Alltid',
      competitor: 'Varierar',
      competitorBad: true
    },
    {
      label: 'Trädgårdsmästare',
      fixco: '✅ Certifierade',
      competitor: 'Sällan',
      competitorBad: true
    },
    {
      label: 'Kompostering & återvinning',
      fixco: '✅ Ingår',
      fixcoSubtext: 'Miljövänligt',
      competitor: 'Extra 300-600 kr',
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
      fixco: '✅ 24-48 timmar',
      competitor: '1-2 veckor',
      competitorBad: true
    },
    {
      label: 'Säsongstips',
      fixco: '✅ Ingår',
      competitor: 'Sällan',
      competitorBad: true
    }
  ],
  'stadning': [
    {
      label: 'Erfarna städare',
      fixco: '✅ Alltid',
      competitor: 'Varierar',
      competitorBad: true
    },
    {
      label: 'Miljövänliga produkter',
      fixco: '✅ Alltid',
      fixcoSubtext: 'Allergivänligt',
      competitor: 'Ofta kemiska',
      competitorBad: true
    },
    {
      label: 'Utrustning',
      fixco: '✅ Professionell',
      fixcoSubtext: 'Vi tar med allt',
      competitor: 'Kan saknas',
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
      fixco: '✅ 24-48 timmar',
      competitor: '3-5 dagar',
      competitorBad: true
    },
    {
      label: 'Nöjdhetsgaranti',
      fixco: '✅ 100%',
      competitor: 'Sällan',
      competitorBad: true
    }
  ],
  'markarbeten': [
    {
      label: 'Grävmaskin & utrustning',
      fixco: '✅ Egen maskinpark',
      competitor: 'Hyrd/varierar',
      competitorBad: true
    },
    {
      label: 'Dräneringsplan',
      fixco: '✅ Ingår',
      fixcoSubtext: 'Professionell analys',
      competitor: 'Extra 800-1 500 kr',
      competitorBad: true
    },
    {
      label: 'Markberedning',
      fixco: '✅ Ingår',
      competitor: 'Extra 500-1 200 kr',
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
      fixco: '✅ 3-5 dagar',
      competitor: '1-2 veckor',
      competitorBad: true
    },
    {
      label: 'Garantitid',
      fixco: '✅ 3 år',
      competitor: '1 år eller ingen',
      competitorBad: true
    }
  ],
  'tekniska-installationer': [
    {
      label: 'IT-certifiering',
      fixco: '✅ Certifierade tekniker',
      competitor: 'Varierar',
      competitorBad: true
    },
    {
      label: 'Nätverksanalys',
      fixco: '✅ Ingår',
      fixcoSubtext: 'Optimering',
      competitor: 'Extra 800-1 500 kr',
      competitorBad: true
    },
    {
      label: 'Kabeldragning',
      fixco: '✅ Professionell',
      competitor: 'Varierar',
      competitorBad: true
    },
    {
      label: 'Support efteråt',
      fixco: '✅ 3 månader gratis',
      competitor: 'Sällan',
      competitorBad: true
    },
    {
      label: 'Start inom',
      fixco: '✅ 24-48 timmar',
      competitor: '3-7 dagar',
      competitorBad: true
    },
    {
      label: 'Dokumentation',
      fixco: '✅ Komplett',
      competitor: 'Ofta bristfällig',
      competitorBad: true
    }
  ],
  'flytt': [
    {
      label: 'Erfarna flyttare',
      fixco: '✅ Alltid',
      competitor: 'Varierar',
      competitorBad: true
    },
    {
      label: 'Försäkring',
      fixco: '✅ Full försäkring',
      fixcoSubtext: 'Ingår alltid',
      competitor: 'Extra 300-800 kr',
      competitorBad: true
    },
    {
      label: 'Emballage',
      fixco: '✅ Professionellt',
      fixcoSubtext: 'För känsliga föremål',
      competitor: 'Enkelt/saknas',
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
      fixco: '✅ 24-48 timmar',
      competitor: '3-5 dagar',
      competitorBad: true
    },
    {
      label: 'Städning efteråt',
      fixco: '✅ Kan tillköpas',
      competitor: 'Sällan',
      competitorBad: true
    }
  ],
  'default': [
    {
      label: 'Certifiering',
      fixco: '✅ Alltid certifierade',
      competitor: 'Varierar',
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
      fixco: '✅ 24-48 timmar',
      competitor: '1-2 veckor',
      competitorBad: true
    },
    {
      label: 'Fast pris',
      fixco: '✅ Alltid i offerten',
      competitor: 'Sällan',
      competitorBad: true
    },
    {
      label: 'Garanti',
      fixco: '✅ 3-5 år',
      competitor: '1 år eller ingen',
      competitorBad: true
    },
    {
      label: 'Försäkring',
      fixco: '✅ Alltid',
      competitor: 'Varierar',
      competitorBad: true
    }
  ]
};
