

## Fix: Sprakswitch fastnar + komponenter utanfor AppLayout far alltid svenska

### Rotorsak

I `App.tsx` rad 228 star det `<CopyProvider locale="sv">` -- hardkodat till svenska. Detta ar den YTTRE providern som omsluter hela appen.

Tre komponenter renderas via React Portals **utanfor** AppLayouts egna `CopyProvider` (som korrekt laser spraket fran URL:en):
- **NavbarPortal** (Navbar2)
- **FloatingSettingsWidget** (LanguageSwitcher + ThemeSwitcher)  
- **StickyPhoneButton**

Dessa hamnar i den yttre providern som alltid ger svenska. Det betyder:
1. `LanguageSwitcher` laser alltid `locale = "sv"` fran useCopy()
2. Nar man ar pa `/en` och klickar, vill den byta till "en" -- men `switchLanguage` ser att URL:en redan ar `/en` och gor ingenting
3. Resultatet: man kan inte byta tillbaka till svenska

### Losning

#### Steg 1: Gor yttre CopyProvider URL-medveten

Skapa en wrapper-komponent `DynamicCopyProvider` som laser `useLocation()` for att bestamma locale dynamiskt, istallet for hardkodad "sv". Denna maste ligga INUTI `BrowserRouter` men UTANFOR allt annat.

**Fil: `App.tsx`**
- Flytta `CopyProvider` sa den ligger inuti `BrowserRouter` istallet for utanfor
- Skapa en liten komponent som laser location och ger ratt locale:

```text
BrowserRouter
  └── DynamicCopyProvider (laser locale fran URL)
       └── Routes, NavbarPortal, StickyPhoneButton, FloatingSettingsWidget
```

Konkret:
- Rad 228: Ta bort `<CopyProvider locale="sv">`
- Skapa `AppShell`-komponent inuti BrowserRouter som wrapprar allt med en URL-medveten CopyProvider
- NavbarPortal, StickyPhoneButton och FloatingSettingsWidget far nu ratt locale automatiskt

#### Steg 2: Fixa StickyPhoneButton hardkodad text

**Fil: `src/components/StickyPhoneButton.tsx`**
- Importera `useCopy` 
- Ersatt "Vi svarar inom **2 timmar**" med `t('sticky.responseTime')` 
- Ersatt "Ring Oss" med `t('sticky.callUs')`
- Ersatt "Ring oss pa..." med `t('sticky.callLabel')`

#### Steg 3: Lagg till copy-nycklar

**Filer: `src/copy/keys.ts`, `src/copy/sv.ts`, `src/copy/en.ts`**
- `sticky.responseTime` -> "Vi svarar inom 2 timmar" / "We respond within 2 hours"
- `sticky.callUs` -> "Ring Oss" / "Call Us"  
- `sticky.callLabel` -> "Ring oss pa 079-335 02 28" / "Call us at 079-335 02 28"

### Filer som andras

1. `src/App.tsx` -- flytta CopyProvider inuti BrowserRouter, gora den URL-medveten
2. `src/components/StickyPhoneButton.tsx` -- anvanda t() istallet for hardkodad svenska
3. `src/copy/keys.ts` -- 3 nya nycklar
4. `src/copy/sv.ts` -- 3 nya oversattningar
5. `src/copy/en.ts` -- 3 nya oversattningar

### Vad detta loser

- Sprakswitchern fungerar i bada riktningar (sv -> en OCH en -> sv)
- Navbar2 visar ratt sprak nar man ar pa /en
- StickyPhoneButton visar ratt sprak
- Alla portal-renderade komponenter ar sprakkansliga
- AppLayouts inre CopyProvider overskrider fortfarande den yttre for sidinnehall (React Context nesting)

