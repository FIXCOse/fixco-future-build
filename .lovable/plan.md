
## Plan: Öka textstorlekar i "Om"-sektionen

### Problem
Hela den konsoliderade "Om"-sektionen använder `text-xs` och `text-sm` genomgående, vilket gör texten svårläst och oprofessionell.

### Ändringar i `src/pages/LocalServicePage.tsx` (rad 741-815)

| Element | Nu | Ändras till |
|---------|-----|------------|
| Rubrik (h3) | `text-lg` | `text-2xl font-bold` |
| Intro-text (p) | `text-sm` | `text-base` |
| Local Tip rubrik (h4) | `text-sm` | `text-base` |
| Local Tip text (p) | `text-xs` | `text-sm` |
| Lightbulb ikon i tip | `h-4 w-4` | `h-5 w-5` |
| Quick Facts lista | `text-xs`, ikon `h-3 w-3` | `text-sm`, ikon `h-4 w-4` |
| Fun Facts lista | `text-xs`, ikon `h-3 w-3` | `text-sm`, ikon `h-4 w-4` |
| Relaterat-text | `text-xs` | `text-sm` |

En fil ändras: `src/pages/LocalServicePage.tsx`
