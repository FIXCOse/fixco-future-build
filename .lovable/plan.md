

## Plan: Fix CTA-knapp som hamnar bakom stegkorten

### Problem
"Begär offert"-knappen (rad 508) ligger under stegkorten visuellt. Stegkorten har `whileHover={{ y: -6, scale: 1.02 }}` som gör att de expanderar och kan överlappa knappen. Knappen saknar `relative z-10` för att ligga ovanpå.

### Ändring i `src/pages/LocalServicePage.tsx`

**Rad 508** — Lägg till `relative z-10` på knappens wrapper:
```tsx
// Från:
<motion.div variants={itemVariants} className="text-center mt-10">

// Till:
<motion.div variants={itemVariants} className="text-center mt-10 relative z-10">
```

En rad, en ändring.

