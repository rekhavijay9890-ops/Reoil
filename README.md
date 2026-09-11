# Reoil

Used cooking oil collection app — schedule pickups from homes and restaurants, and turn waste oil into biofuel.

## Features

- Landing page with impact stats and how-it-works steps
- Pickup scheduling form with validation
- Mobile-responsive design with Reoil green branding

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:4318](http://localhost:4318).

## Build for production

```bash
npm run build
npm start
```

## Deploy to GitHub / Vercel

1. Push this repo to GitHub
2. Connect the repo on [vercel.com](https://vercel.com) for automatic deploys

Or enable GitHub Pages with a Next.js static export if preferred.

## Project structure

```
src/
  app/
    page.tsx          # Landing page
    schedule/page.tsx # Pickup booking
    api/pickup/       # Form submission API
  components/
    header.tsx
    footer.tsx
    pickup-form.tsx
```
