import { sv } from '../copy/sv';
import { en } from '../copy/en';

function assertSameKeys(a: Record<string,string>, b: Record<string,string>) {
  const ak = Object.keys(a).sort().join('|');
  const bk = Object.keys(b).sort().join('|');
  if (ak !== bk) {
    console.error('SV keys:', Object.keys(a).sort());
    console.error('EN keys:', Object.keys(b).sort());
    throw new Error('i18n mismatch: sv/en keys skiljer sig');
  }
}

// Dev guard - will fail build if keys don't match
if (import.meta.env.DEV) {
  assertSameKeys(sv, en);
}

export { sv, en };