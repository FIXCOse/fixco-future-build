

## Plan: Fixa vit text i CTA-knappar i båda mailen

Bara en ändring: lägg till inline `style="color:#ffffff !important;"` på CTA-länkarna i båda edge functions. E-postklienter ignorerar `<style>`-block och visar länktexten i blå/lila istället.

### Ändringar

| Fil | Rad | Ändring |
|-----|-----|---------|
| `send-quote-email-new/index.ts` | 97 | Inline style med vit text på CTA `<a>` |
| `send-followup-email/index.ts` | 78 | Inline style med vit text på CTA `<a>` |

Båda ändras från:
```html
<a class="cta" href="..." target="_blank">Text</a>
```
Till:
```html
<a class="cta" href="..." target="_blank" style="display:inline-block;background:#4f46e5;color:#ffffff !important;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:700;">Text</a>
```

Inga andra ändringar behövs — tidsstämplarna fungerar redan.

