import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  sv: {
    translation: {
      nav: {
        home: "Hem",
        services: "Tjänster",
        references: "Referenser",
        about: "Om oss",
        contact: "Kontakt",
        myFixco: "Mitt Fixco",
        smartHome: "Smart Hem",
        neighborhood: "Närområde",
        leaderboard: "Topplista",
        admin: "Administration"
      },
      services: {
        title: "Våra tjänster",
        subtitle: "Från små reparationer till stora byggnationer – vi har expertisen och erfarenheten för att leverera professionella lösningar inom alla områden.",
        rotSaving: "Utnyttja ROT-avdraget och spara 50%.",
        visualize3d: "Visa i 3D",
        beforeAfter: "Före & Efter",
        ecoScore: "Miljöbetyg"
      },
      smartHome: {
        title: "Smart Hemautomation",
        subtitle: "Styr och optimera ditt hem med AI och IoT-teknik",
        energyConsumption: "Energiförbrukning",
        devices: "Anslutna enheter",
        automation: "Automatisering",
        savings: "Besparingar"
      },
      neighborhood: {
        title: "Närområde Intelligence",
        subtitle: "Upptäck vad som händer i ditt område",
        permits: "Bygglov",
        statistics: "Statistik",
        neighbors: "Grannar",
        priceHistory: "Prisutveckling"
      },
      leaderboard: {
        title: "Energibesparings Topplista", 
        subtitle: "Tävla och spara energi tillsammans",
        monthly: "Månadsvis",
        allTime: "All-time",
        yourRank: "Din placering"
      },
      ecoScore: {
        excellent: "Utmärkt",
        good: "Bra", 
        fair: "Okej",
        poor: "Dålig",
        description: "Miljöpåverkan baserat på material och metoder"
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: "Home",
        services: "Services", 
        references: "References",
        about: "About",
        contact: "Contact",
        myFixco: "My Fixco",
        smartHome: "Smart Home",
        neighborhood: "Neighborhood", 
        leaderboard: "Leaderboard",
        admin: "Administration"
      },
      services: {
        title: "Our Services",
        subtitle: "From small repairs to large constructions – we have the expertise and experience to deliver professional solutions in all areas.",
        rotSaving: "Use ROT deduction and save 50%.",
        visualize3d: "Show in 3D",
        beforeAfter: "Before & After", 
        ecoScore: "Eco Score"
      },
      smartHome: {
        title: "Smart Home Automation",
        subtitle: "Control and optimize your home with AI and IoT technology",
        energyConsumption: "Energy Consumption", 
        devices: "Connected Devices",
        automation: "Automation",
        savings: "Savings"
      },
      neighborhood: {
        title: "Neighborhood Intelligence",
        subtitle: "Discover what's happening in your area",
        permits: "Building Permits",
        statistics: "Statistics",
        neighbors: "Neighbors", 
        priceHistory: "Price Development"
      },
      leaderboard: {
        title: "Energy Savings Leaderboard",
        subtitle: "Compete and save energy together", 
        monthly: "Monthly",
        allTime: "All-time",
        yourRank: "Your Rank"
      },
      ecoScore: {
        excellent: "Excellent",
        good: "Good",
        fair: "Fair", 
        poor: "Poor",
        description: "Environmental impact based on materials and methods"
      }
    }
  },
  no: {
    translation: {
      nav: {
        home: "Hjem",
        services: "Tjenester",
        references: "Referanser", 
        about: "Om oss",
        contact: "Kontakt",
        myFixco: "Min Fixco",
        smartHome: "Smart Hjem",
        neighborhood: "Nabolag",
        leaderboard: "Toppliste", 
        admin: "Administrasjon"
      },
      services: {
        title: "Våre Tjenester",
        subtitle: "Fra små reparasjoner til store byggeprosjekter – vi har ekspertisen og erfaringen til å levere profesjonelle løsninger innen alle områder.",
        rotSaving: "Benytt ROT-fradrag og spar 50%.",
        visualize3d: "Vis i 3D",
        beforeAfter: "Før & Etter",
        ecoScore: "Miljøscore"
      },
      smartHome: {
        title: "Smart Hjemmeautomatisering", 
        subtitle: "Kontroller og optimaliser hjemmet ditt med AI og IoT-teknologi",
        energyConsumption: "Energiforbruk",
        devices: "Tilkoblede enheter",
        automation: "Automatisering",
        savings: "Besparelser"
      },
      neighborhood: {
        title: "Nabolag Intelligence",
        subtitle: "Oppdag hva som skjer i ditt område",
        permits: "Byggetillatelser", 
        statistics: "Statistikk",
        neighbors: "Naboer",
        priceHistory: "Prisutvikling"
      },
      leaderboard: {
        title: "Energisparings Toppliste",
        subtitle: "Konkurer og spar energi sammen",
        monthly: "Månedlig",
        allTime: "All-time",
        yourRank: "Din plassering"
      },
      ecoScore: {
        excellent: "Utmerket",
        good: "Bra",
        fair: "Greit", 
        poor: "Dårlig",
        description: "Miljøpåvirkning basert på materialer og metoder"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'sv',
    fallbackLng: 'sv',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;