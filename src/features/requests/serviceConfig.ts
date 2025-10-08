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
  }
];

export function getServiceBySlug(slug: string): ServiceConfig | undefined {
  return SERVICE_CONFIG.find(s => s.slug === slug);
}
