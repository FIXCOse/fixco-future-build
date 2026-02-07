import type { CopyKey } from '@/copy/keys';

export const HERO_CHIP_KEYS: CopyKey[] = [
  'chips.f_skatt',
  'chips.insured',
  'chips.start_lt_5',
  'chips.fixed_price',
  'chips.rot_30',
  'chips.rut_30',
  'chips.transparent',
  'chips.free_quote',
  'chips.we_handle_rot',
  'chips.happy_customers',
  'chips.fast_support',
];

export const ALL_TRUST_CHIP_KEYS: CopyKey[] = [
  ...HERO_CHIP_KEYS,
  'chips.certified',
  'chips.warranty',
  'chips.eco_friendly',
  'chips.quick_response',
  'chips.quality_work',
];