# Reoil Design System

## Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Headings | Plus Jakarta Sans | 600–700 | H1–H3, logo, section titles |
| Body & UI | DM Sans | 400–500 | Paragraphs, labels, buttons, nav |

Web loads fonts via `next/font/google`. Mobile loads the same families via `@expo-google-fonts`.

## Color palette

| Token | Hex | Usage |
|-------|-----|-------|
| `reoil-dark` | `#1b4332` | Headings, dark sections, logo |
| `reoil` | `#2d6a4f` | Primary buttons, links |
| `reoil-light` | `#52b788` | Accents, icons, focus rings |
| `reoil-cream` | `#f8f9f6` | Page background |
| `reoil-mint` | `#e8f5e9` | Badges, secondary surfaces |
| `foreground` | `#1a1a1a` | Body text |
| `muted-foreground` | `#5c5c5c` | Secondary text |
| `border` | `#e8ebe8` | Inputs, dividers |

## Radius & spacing

- Base radius: `0.75rem` (12px)
- Cards: `rounded-2xl` (16–20px)
- Buttons / inputs: `rounded-xl` (12px)
- Pills / chips: `rounded-full`

## Components

- **Web:** shadcn/ui (base-nova) + Tailwind v4 CSS variables in `globals.css`
- **Mobile:** React Native `StyleSheet` tokens in `mobile/constants/theme.ts`

Both platforms share colors and copy via `shared/content.json`.
