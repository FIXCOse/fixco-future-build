export type FieldType =
  | { kind: "text"; key: string; label: string; placeholder?: string; required?: boolean }
  | { kind: "number"; key: string; label: string; min?: number; max?: number; required?: boolean }
  | { kind: "textarea"; key: string; label: string; placeholder?: string; required?: boolean }
  | { kind: "file"; key: string; label: string; accept?: string; multiple?: boolean };

export type PricingMode = "fixed" | "unit" | "quote";

export type ServiceConfig = {
  slug: string;
  name: string;
  pricingMode: PricingMode;
  unitLabel?: string;
  unitPriceSek?: number;
  fixedPriceSek?: number;
  rotEligible?: boolean;
  fields: FieldType[];
};

export const SERVICE_CONFIG: ServiceConfig[] = [
  {
    slug: "bygga-altan",
    name: "Bygga altan",
    pricingMode: "quote",
    rotEligible: true,
    fields: [
      { kind: "number", key: "yta_m2", label: "Ungefärlig yta (m²)", min: 1 },
      { kind: "textarea", key: "onskemal", label: "Kort beskrivning", placeholder: "Material, höjd, räcke, belysning…" },
      { kind: "file", key: "bilder", label: "Bilder (valfritt)", accept: "image/*", multiple: true }
    ]
  },
  {
    slug: "byta-eluttag",
    name: "Byta eluttag",
    pricingMode: "unit",
    unitLabel: "st",
    unitPriceSek: 350,
    rotEligible: true,
    fields: [
      { kind: "number", key: "antal", label: "Antal uttag", min: 1, required: true },
      { kind: "textarea", key: "beskrivning", label: "Beskrivning", placeholder: "Placering, höjd, särskilda önskemål…" },
      { kind: "file", key: "bilder", label: "Bilder (valfritt)", accept: "image/*", multiple: true }
    ]
  },
  {
    slug: "installera-spotlights",
    name: "Installera spotlights",
    pricingMode: "unit",
    unitLabel: "st",
    unitPriceSek: 690,
    rotEligible: true,
    fields: [
      { kind: "number", key: "antal", label: "Antal spotlights", min: 1, required: true },
      { kind: "textarea", key: "beskrivning", label: "Beskrivning", placeholder: "Rumsstorlek, dimmer, håldiameter…" },
      { kind: "file", key: "bilder", label: "Bilder (valfritt)", accept: "image/*", multiple: true }
    ]
  },
  {
    slug: "platsbyggd-bokhylla",
    name: "Platsbyggd bokhylla",
    pricingMode: "quote",
    rotEligible: true,
    fields: [
      { kind: "textarea", key: "onskemal", label: "Kort beskrivning", placeholder: "Mått, båge, lister, finish…" },
      { kind: "file", key: "bilder", label: "Bilder (valfritt)", accept: "image/*", multiple: true }
    ]
  },
  {
    slug: "platsbyggd-garderob",
    name: "Platsbyggd garderob",
    pricingMode: "quote",
    rotEligible: true,
    fields: [
      { kind: "textarea", key: "onskemal", label: "Kort beskrivning", placeholder: "Mått, dörrar, inredning, finish…" },
      { kind: "file", key: "bilder", label: "Bilder (valfritt)", accept: "image/*", multiple: true }
    ]
  },
  {
    slug: "akustikpanel",
    name: "Installera akustikpanel",
    pricingMode: "quote",
    rotEligible: true,
    fields: [
      { kind: "number", key: "yta_m2", label: "Ungefärlig yta (m²)", min: 1 },
      { kind: "textarea", key: "onskemal", label: "Kort beskrivning", placeholder: "Material, färg, placering…" },
      { kind: "file", key: "bilder", label: "Bilder (valfritt)", accept: "image/*", multiple: true }
    ]
  },
  {
    slug: "malning",
    name: "Målning",
    pricingMode: "quote",
    rotEligible: true,
    fields: [
      { kind: "number", key: "antal_rum", label: "Antal rum att måla", min: 1 },
      { kind: "number", key: "yta_m2", label: "Ungefärlig yta (m²)", min: 1 },
      { kind: "textarea", key: "onskemal", label: "Kort beskrivning", placeholder: "Väggar/tak, färg, spackling, tapet..." },
      { kind: "file", key: "bilder", label: "Bilder (valfritt)", accept: "image/*", multiple: true }
    ]
  },
  {
    slug: "mala-rum",
    name: "Måla rum/väggar",
    pricingMode: "unit",
    unitLabel: "rum",
    unitPriceSek: 3500,
    rotEligible: true,
    fields: [
      { kind: "number", key: "antal_rum", label: "Antal rum", min: 1, required: true },
      { kind: "textarea", key: "beskrivning", label: "Beskrivning", placeholder: "Takhöjd, färgval, spackling behövs..." },
      { kind: "file", key: "bilder", label: "Bilder (valfritt)", accept: "image/*", multiple: true }
    ]
  },
  {
    slug: "mala-fasad",
    name: "Måla fasad",
    pricingMode: "quote",
    rotEligible: true,
    fields: [
      { kind: "number", key: "yta_m2", label: "Ungefärlig fasadyta (m²)", min: 1 },
      { kind: "textarea", key: "onskemal", label: "Kort beskrivning", placeholder: "Antal våningar, färg, kondition..." },
      { kind: "file", key: "bilder", label: "Bilder (valfritt)", accept: "image/*", multiple: true }
    ]
  },
  // Dörrlås-tjänster
  {
    slug: "installera-smart-dorrlas",
    name: "Installera smart dörrlås",
    pricingMode: "quote",
    rotEligible: true,
    fields: [
      { kind: "textarea", key: "beskrivning", label: "Beskriv ditt projekt", placeholder: "Märke/modell, dörrtyp, önskemål..." },
      { kind: "file", key: "bilder", label: "Bilder på dörren (valfritt)", accept: "image/*", multiple: true }
    ]
  },
  {
    slug: "installera-yale-doorman",
    name: "Installera Yale Doorman",
    pricingMode: "quote",
    rotEligible: true,
    fields: [
      { kind: "textarea", key: "beskrivning", label: "Beskriv ditt projekt", placeholder: "Modell (L3S Flex/Classic/V2N), dörrtyp, önskemål..." },
      { kind: "file", key: "bilder", label: "Bilder på dörren (valfritt)", accept: "image/*", multiple: true }
    ]
  },
  {
    slug: "installera-yale-linus",
    name: "Installera Yale Linus",
    pricingMode: "quote",
    rotEligible: true,
    fields: [
      { kind: "textarea", key: "beskrivning", label: "Beskriv ditt projekt", placeholder: "Dörrtyp, befintligt lås, önskemål..." },
      { kind: "file", key: "bilder", label: "Bilder på dörren (valfritt)", accept: "image/*", multiple: true }
    ]
  },
  {
    slug: "installera-kodlas",
    name: "Installera kodlås",
    pricingMode: "quote",
    rotEligible: true,
    fields: [
      { kind: "number", key: "antal", label: "Antal dörrar", min: 1, required: true },
      { kind: "textarea", key: "beskrivning", label: "Beskriv ditt projekt", placeholder: "Dörrtyp (ytterdörr/innerdörr), märke om valt..." },
      { kind: "file", key: "bilder", label: "Bilder (valfritt)", accept: "image/*", multiple: true }
    ]
  },
  {
    slug: "byta-cylinderlas",
    name: "Byta cylinderlås",
    pricingMode: "quote",
    rotEligible: true,
    fields: [
      { kind: "number", key: "antal", label: "Antal lås", min: 1, required: true },
      { kind: "textarea", key: "beskrivning", label: "Beskriv ditt projekt", placeholder: "Dörrtyp, befintligt lås, säkerhetsklass..." },
      { kind: "file", key: "bilder", label: "Bilder (valfritt)", accept: "image/*", multiple: true }
    ]
  },
  {
    slug: "installera-larm-dorrlas",
    name: "Installera larm och dörrlås-paket",
    pricingMode: "quote",
    rotEligible: true,
    fields: [
      { kind: "textarea", key: "beskrivning", label: "Beskriv ditt projekt", placeholder: "Typ av larm, antal dörrlås, befintliga system..." },
      { kind: "file", key: "bilder", label: "Bilder (valfritt)", accept: "image/*", multiple: true }
    ]
  }
];

export function getServiceBySlug(slug: string): ServiceConfig | undefined {
  return SERVICE_CONFIG.find(s => s.slug === slug);
}
