

## Plan: Dölj Ring oss-knapp och inställningswidget på offert/faktura-sidor

### Problem
"Ring oss"-knappen och språk/tema-widgeten syns på kundens publika offert- och fakturasida, vilket ser oprofessionellt ut.

### Lösning
Lägg till CSS-regler i `Navbar2.css` (som redan döljer navbaren med `data-page-type`) för att dölja dessa element på quote/invoice-sidor.

### Fil som ändras

**`src/components/Navbar2.css`** — Lägg till regler:
```css
body[data-page-type="quote"] .sticky-phone-button,
body[data-page-type="invoice"] .sticky-phone-button,
body[data-page-type="quote"] .sticky-phone-button ~ div, /* response time badge parent */
body[data-page-type="invoice"] .sticky-phone-button ~ div {
  display: none !important;
}
```

**`src/components/StickyPhoneButton.tsx`** — Alternativt, kolla `data-page-type` i komponenten och returnera `null`.

**`src/components/FloatingSettingsWidget.tsx`** — Samma approach: kolla `data-page-type` och returnera `null`.

### Föredragen approach
Enklast och renast: Lägg till `useLocation()` check i båda komponenterna och returnera `null` om vi är på `/offert/` eller `/faktura/` routes. Alternativt CSS-baserat via `data-page-type`.

Jag föredrar **JS-check med useLocation** i `StickyPhoneButton.tsx` och `FloatingSettingsWidget.tsx` — kollar om pathname startar med `/offert/` eller `/faktura/` och returnerar null. Rent, inga CSS-hack.

