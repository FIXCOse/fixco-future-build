export type CityKey = "Uppsala" | "Stockholm";

export interface CityData {
  city: CityKey;
  title: string;
  description: string;
  coordinates: { lat: number; lng: number };
  travelFee: string;
  districts: string[];
  faqs: Array<{ q: string; a: string }>;
  cases: Array<{ title: string; desc: string; img?: string }>;
  testimonials: Array<{ text: string; author: string; date?: string }>;
  heroImage?: string;
}

export const cityData: Record<CityKey, CityData> = {
  Uppsala: {
    city: "Uppsala",
    title: "Bygg- & renoveringstjänster i Uppsala",
    description:
      "Fixco hjälper privatpersoner, BRF och företag i hela Uppsala kommun med el, VVS, snickeri, montering, markarbeten m.m. Start inom 24h och ROT/RUT-avdrag 50%.",
    coordinates: { lat: 59.8586, lng: 17.6389 },
    travelFee: "0 kr",
    districts: ["Gottsunda", "Gränby", "Luthagen", "Svartbäcken", "Årsta", "Stenhagen", "Vaksala", "Kungsängen"],
    faqs: [
      { 
        q: "Hur snabbt kan ni vara på plats i Uppsala?", 
        a: "Vi strävar efter att komma ut samma dag för akuta ärenden. För planerade projekt kan vi ofta starta inom 24-48 timmar efter offertgodkännande." 
      },
      { 
        q: "Tar ni reseersättning i Uppsala?", 
        a: "Nej, Uppsala är vårt primära verksamhetsområde och vi tar ingen resekostnad för jobb inom Uppsala kommun." 
      },
      { 
        q: "Gäller ROT/RUT-avdrag i Uppsala?", 
        a: "Ja, du får 50% avdrag på arbetskostnaden enligt Skatteverkets regler för ROT (renovering, ombyggnad, tillbyggnad) och RUT (städning, trädgård). Vi sköter all administration." 
      },
      {
        q: "Arbetar ni i alla stadsdelar i Uppsala?",
        a: "Ja, vi täcker hela Uppsala kommun inklusive Gottsunda, Luthagen, Svartbäcken, Årsta, Stenhagen, Gränby, Vaksala och alla övriga områden."
      },
      {
        q: "Kan ni hjälpa BRF och företag?",
        a: "Absolut! Vi arbetar regelbundet med BRF:er, fastighetsägare och företag. Vi kan anpassa oss efter era önskemål och behov."
      }
    ],
    cases: [
      { 
        title: "Badrumsrenovering BRF Luthagen", 
        desc: "Totalrenovering av 8 kvm badrum med ny VVS, elinstallation, kakelsättning och golvvärme. Projektet genomfördes på 2 veckor med ROT-avdrag." 
      },
      { 
        title: "Altanbygge Svartbäcken", 
        desc: "Ny altan på 40 m² med tryckimpregnerat virke, inbyggd belysning och glassräcke. Inkluderade markarbete och dränering. ROT-avdrag tillämpades." 
      },
      {
        title: "Köksrenovering Gottsunda",
        desc: "Komplett köksrenovering med nya skåp, bänkskivor, vitvaror och belysning. El och VVS uppdaterades enligt gällande standard."
      }
    ],
    testimonials: [
      { 
        text: "Snabbt och proffsigt – vi fick offert inom 24h och start dagen efter. Rekommenderas varmt!", 
        author: "Emil K., Luthagen" 
      },
      { 
        text: "Bästa hantverkarna vi anlitat. Rena ytor, tydlig kommunikation och prisvärt med ROT-avdraget.", 
        author: "Sara P., Svartbäcken" 
      },
      {
        text: "Fixco fixade vår altan på rekordtid. Mycket nöjda med både resultat och service.",
        author: "Anders M., Gottsunda"
      }
    ],
    heroImage: "/assets/hero-construction.jpg"
  },
  Stockholm: {
    city: "Stockholm",
    title: "Bygg- & renoveringstjänster i Stockholm",
    description:
      "Fixco hjälper dig i Stockholm stad och närförort med el, VVS, snickeri, montering, markarbeten m.m. ROT/RUT-avdrag 50% och tydliga prisexempel. Resekostnad 299 kr.",
    coordinates: { lat: 59.3293, lng: 18.0686 },
    travelFee: "299 kr",
    districts: ["Södermalm", "Vasastan", "Östermalm", "Kungsholmen", "Norrmalm", "Bromma", "Huddinge", "Täby", "Solna"],
    faqs: [
      { 
        q: "Gör ni jobb i hela Stockholm?", 
        a: "Ja, vi arbetar i Stockholm stad och närförort (Bromma, Solna, Sundbyberg, Huddinge, Täby m.fl.). Kontakta oss för att bekräfta om ditt område ingår." 
      },
      { 
        q: "Vad kostar resa i Stockholm?", 
        a: "Vi tar en fast reseavgift på 299 kr för uppdrag i Stockholmsområdet. Vid större projekt kan resekostnaden inkluderas i offerten." 
      },
      { 
        q: "Kan ni hjälpa BRF och företag?", 
        a: "Absolut! Vi har stor erfarenhet av att arbeta med BRF:er, fastighetsägare, kontor och företag i Stockholm. Vi kan anpassa oss efter era rutiner och krav." 
      },
      {
        q: "Hur hanterar ni parkering i innerstaden?",
        a: "Vi planerar alltid i förväg och ordnar med parkering/lastzon vid behov. Vi har även kompakt utrustning för att underlätta arbete i trånga utrymmen."
      },
      {
        q: "Arbetar ni på helger?",
        a: "Ja, vid behov kan vi schemalägga arbete på kvällar och helger, särskilt för BRF:er och företag som vill minimera störningar."
      }
    ],
    cases: [
      { 
        title: "Köksmontering Östermalm", 
        desc: "Platsbyggd köksö med integrerade vitvaror, el- och VVS-justeringar samt LED-belysning. Genomfört under löpande vecka för minimal störning." 
      },
      { 
        title: "Elfelsökning Bromma villa", 
        desc: "Spårning och åtgärd av jordfel, byte av centralapparat och fullständig dokumentation enligt Elsäkerhetsverkets krav." 
      },
      {
        title: "Badrumrenovering Södermalm",
        desc: "Total renovering av litet badrum i sekelskifteslägenhet. Ny VVS, kakel och anpassad lösning för ventilation. ROT-avdrag tillämpades."
      }
    ],
    testimonials: [
      { 
        text: "Proffsigt och smidigt från start till mål. Vi fick tydliga prisexempel redan vid första kontakten.", 
        author: "Johan L., Vasastan" 
      },
      { 
        text: "Snabb respons och snyggt resultat. Fixco löste vårt elproblem på några timmar.", 
        author: "Michaela S., Bromma" 
      },
      {
        text: "Rekommenderar Fixco för renoveringar i Stockholm. Bra kommunikation och pålitliga hantverkare.",
        author: "Erik T., Södermalm"
      }
    ],
    heroImage: "/assets/hero-construction.jpg"
  }
};
