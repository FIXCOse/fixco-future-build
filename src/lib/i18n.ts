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
      ecoScore: {
        excellent: "Excellent",
        good: "Good",
        fair: "Fair", 
        poor: "Poor",
        description: "Environmental impact based on materials and methods"
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