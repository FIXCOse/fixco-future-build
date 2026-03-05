

## Plan: Lägg till CTA-knapp under "Så bokar du"-stegen

### Ändring

Lägg till en centrerad CTA-knapp ("Begär gratis offert") direkt under how-to-steg-gridden (rad 506-507), innan sektionen stängs. Knappen använder `openServiceRequestModal` enligt projektets konverteringsstrategi (inga telefonnummer i primära CTAs).

### Fil: `src/pages/LocalServicePage.tsx`

Efter steg-gridden (rad 506, `</div>`) och innan `</motion.div>` (rad 508), lägg till:

```tsx
<motion.div variants={itemVariants} className="text-center mt-10">
  <Button
    variant="cta-primary"
    size="cta"
    onClick={() => openServiceRequestModal({ mode: 'home_visit', showCategories: true })}
  >
    {t('hero.cta_request_quote')}
  </Button>
</motion.div>
```

Importerar `openServiceRequestModal` om den inte redan finns i filen.

En fil ändras, en rad läggs till.

