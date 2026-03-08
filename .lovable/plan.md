

## Problem Analysis

From the screenshot and code, there are **two issues**:

### 1. Buttons overflow outside cards
The card header (lines 302-399 in `ServiceManagement.tsx`) crams **6 action buttons** (visibility toggle, delete, move up/down, edit, settings) plus badges into a single horizontal flex row. This causes them to overflow outside the card boundary, as visible in the screenshot.

### 2. Can't reactivate hidden services
The toggle mutation itself **works fine** (confirmed by console logs). The real problem: after hiding a service, it disappears from the list because `showInactive` defaults to `false`. When you toggle "Visa dolda tjänster" ON, the services reappear but the activate button (EyeOff icon) is lost in the overflowing button mess and hard to identify/click.

---

## Solution

### Restructure the card layout in `ServiceManagement.tsx`

| Area | Change |
|---|---|
| **Card header** | Move action buttons into a compact toolbar row **below** the badges, inside the card. Use `flex-wrap` and group logically: visibility + delete on left, reorder + edit + settings on right |
| **Inactive services** | Add a clear "Aktivera" button with green styling for hidden services, replacing the subtle icon-only toggle |
| **Card sizing** | Ensure `overflow-hidden` on cards so nothing escapes |

### Layout structure:
```text
┌─────────────────────────────┐
│ [category] [#order] [Dold]  │  ← badges row
│ Tjänstnamn                  │  ← title
│ ROT  RUT  Skötsel           │  ← tags
├─────────────────────────────┤
│ 👁 🗑  │  ▲▼  ✏️ ⚙️         │  ← action toolbar (inside card)
├─────────────────────────────┤
│ Description...              │
│ Pris: 659 kr/h              │
│ Typ: hourly                 │
│ Plats: utomhus              │
│ [  Inaktiv / Aktivera  ]    │  ← status bar
└─────────────────────────────┘
```

### File to change
**`src/components/admin/ServiceManagement.tsx`** — lines 300-434 (the card rendering block). Restructure the button placement from the header into a dedicated toolbar section within CardContent, and add a prominent "Aktivera" button for inactive services.

