

# Ta bort Google-inloggning

## Problem
Användaren vill ta bort möjligheten att skapa konto/logga in med Google.

## Ändringar

### 1. `src/pages/Auth.tsx`
Ta bort:
- `handleGoogleSignIn` funktion (rader ~220-255)
- "Fortsätt med Google"-knappen i login-fliken (rader ~410-418)
- "Eller"-separatorn före Google-knappen (rader ~401-408)
- "Fortsätt med Google"-knappen i signup-fliken (rader ~596-604)
- "Eller"-separatorn före signup Google-knappen (rader ~587-594)

### 2. `src/components/auth/AuthModalContainer.tsx`
Ta bort:
- `handleGoogleSignIn` funktion (rader ~313-345)
- "Fortsätt med Google"-knappen (rader ~410-418)
- "Eller"-separatorn före knappen

Efter ändringarna kommer endast email/password inloggning finnas kvar.

