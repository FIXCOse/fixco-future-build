

## Problem: Bilderna i projektmodalen är för små

Huvudbilden i `ProjectDetailModal` har en fast höjd på `h-64 md:h-96` (256px / 384px), vilket ger väldigt liten yta för bilderna — speciellt på stora skärmar.

Thumbnails-gridet använder `h-20 md:h-24` vilket också är ganska litet.

## Plan

### 1. Öka huvudbildens höjd i `ProjectDetailModal.tsx`
- Ändra `h-64 md:h-96` till `h-80 md:h-[32rem] lg:h-[36rem]` (320px → 512px → 576px)
- Detta ger mycket mer yta åt bilderna, speciellt på desktop

### 2. Öka thumbnail-storleken
- Ändra `h-20 md:h-24` till `h-24 md:h-28` för att göra miniatyrbilderna lättare att se och klicka på

### Filer som ändras
- `src/components/admin/ProjectDetailModal.tsx` — Två rader ändras

