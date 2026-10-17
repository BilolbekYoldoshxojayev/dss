# NamPS OS — Design System & UI Guidelines

## 1. Design Philosophy: Calm, Educational, Professional
NamPS OS explicitly rejects generic AI clichés (excessive neon glows, heavy glassmorphism, floating chatbots, decorative bloat). Instead, it adopts the refined usability of mature academic and productivity tools.

## 2. Color Palette & Design Tokens
- **Structural Surfaces**:
  - Light mode: Clean neutral `#f8fafc` background, pure white `#ffffff` cards, subtle borders `#e2e8f0`.
  - Dark mode: Deep midnight graphite `#090d16` background, `#0f172a` surfaces, `#1e293b` borders.
- **Brand Accent**: Restrained oceanic cyan/blue (`#0284c7` in light mode, `#38bdf8` in dark mode).
- **Semantic Colors**:
  - Success: Emerald `#10b981`
  - Warning: Amber `#f59e0b`
  - Error: Rose `#ef4444`
  - Info: Sky `#0284c7`

## 3. Typography & Spacing
- Font Stack: System UI font stack (`-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `Arial`, `sans-serif`) for optimal cross-platform rendering and zero latency.
- Spacing: Consistent 4px grid system (`p-2`, `p-4`, `p-6`, `gap-4`).

## 4. Accessibility (WCAG 2.2 AA)
- Contrast ratio >= 4.5:1 for normal text and >= 3:1 for large text across all themes.
- Clear visible focus rings (`focus-visible:ring-2 focus-visible:ring-sky-500`).
- Semantic HTML tags (`<header>`, `<nav>`, `<aside>`, `<main>`, `<table>`).
- Full keyboard operability across forms, dialogs, and navigation.

## 5. Localization
- Full bilingual dictionary architecture (`src/i18n/uz.ts` and `src/i18n/en.ts`).
- Correct Uzbek Latin orthography (`o'g'ri`, `o'quvchi`, `G'alaba`).
- Timezone formatting: `Asia/Tashkent` (UTC+5).
