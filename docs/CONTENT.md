# Reoil — Content Classification

Every user-facing string in the Reoil web and mobile apps, classified by purpose.

| Category | Definition |
|----------|------------|
| **UI Text** | Buttons, menus, tabs, navigation, dropdowns, search fields, toggles, and other interface controls |
| **App Content** | Instructions, explanations, help text, warnings, notifications, and guidance |
| **Copy / UX Copy** | Headings, titles, labels, descriptions, empty states, onboarding, tooltips, CTAs |
| **Content** | Long-form or general material (articles, FAQs, stories) — *none in current app* |

---

## Brand & metadata

| Text | Location | Category |
|------|----------|----------|
| Reoil | Web header logo, mobile home logo, `app.json` name | **Copy / UX Copy** |
| Reoil — Used Cooking Oil Collection | Web `<title>` | **Copy / UX Copy** |
| Reoil collects used cooking oil from homes and restaurants, turning waste into biofuel. | Web meta description | **Copy / UX Copy** |
| © {year} Reoil — Used cooking oil collection | Web footer | **Copy / UX Copy** |

---

## Navigation

| Text | Location | Category |
|------|----------|----------|
| How it works | Web header nav link | **UI Text** |
| Impact | Web header nav link | **UI Text** |
| Schedule pickup | Web header CTA (desktop) | **UI Text** |
| Schedule | Web header CTA (mobile) | **UI Text** |
| Schedule pickup | Mobile stack screen title | **UI Text** |

---

## Home / landing

| Text | Location | Category |
|------|----------|----------|
| Eco-friendly oil recycling | Hero badge | **Copy / UX Copy** |
| Turn used cooking oil into a cleaner planet | Hero H1 | **Copy / UX Copy** |
| Reoil collects used cooking oil from homes and restaurants, keeping grease out of drains and turning waste into biofuel. | Hero subtitle | **App Content** |
| Schedule a pickup | Hero primary CTA | **UI Text** |
| Learn more | Hero secondary CTA (web only) | **UI Text** |
| Why Reoil? | Stats card heading | **Copy / UX Copy** |
| Homes & restaurants served | Stat label (`content.json`) | **Copy / UX Copy** |
| 500+ | Stat value | **Content** |
| Oil collected (liters) | Stat label | **Copy / UX Copy** |
| 12,000+ | Stat value | **Content** |
| CO₂ reduced (tons) | Stat label | **Copy / UX Copy** |
| 8+ | Stat value | **Content** |
| How it works | Section heading | **Copy / UX Copy** |
| Three simple steps from your kitchen to clean energy. | How-it-works section subtitle | **Copy / UX Copy** |
| Step 1 / Step 2 / Step 3 | Step labels (web) | **Copy / UX Copy** |
| 1 / 2 / 3 | Step numbers (mobile) | **UI Text** |
| Book a pickup | Step title | **Copy / UX Copy** |
| Tell us your location and how much oil you have. We schedule a convenient time. | Step description | **App Content** |
| We collect | Step title | **Copy / UX Copy** |
| Our team picks up your used oil in sealed containers — no mess, no hassle. | Step description | **App Content** |
| Recycle & reuse | Step title | **Copy / UX Copy** |
| Your oil is processed into biofuel instead of polluting waterways. | Step description | **App Content** |
| Ready to recycle your oil? | CTA section heading | **Copy / UX Copy** |
| Join homes and restaurants making a difference today. | CTA section body | **Copy / UX Copy** |
| Get started | CTA button | **UI Text** |

---

## Schedule / pickup form

| Text | Location | Category |
|------|----------|----------|
| Book your oil pickup | Page heading | **Copy / UX Copy** |
| Free collection for homes and restaurants. We'll confirm within 24 hours. | Page subtitle | **App Content** |
| Schedule a pickup | Form card title (web) | **Copy / UX Copy** |
| Fill in your details and we'll arrange a convenient collection time. | Form card description (web) | **App Content** |
| Full name | Field label | **Copy / UX Copy** |
| Jane Smith | Name placeholder (web) | **UI Text** |
| Phone | Field label | **Copy / UX Copy** |
| +1 555 000 0000 | Phone placeholder (web) | **UI Text** |
| Email | Field label | **Copy / UX Copy** |
| you@example.com | Email placeholder (web) | **UI Text** |
| Pickup address | Field label | **Copy / UX Copy** |
| Street, city, postal code | Address placeholder (web) | **UI Text** |
| Property type | Field / section label | **Copy / UX Copy** |
| Select type | Select placeholder (web) | **UI Text** |
| Home | Option label | **UI Text** |
| Restaurant | Option label | **UI Text** |
| Commercial kitchen | Option label | **UI Text** |
| Estimated quantity | Field / section label | **Copy / UX Copy** |
| Select amount | Select placeholder (web) | **UI Text** |
| Under 5 liters | Option label | **UI Text** |
| 5–10 liters | Option label | **UI Text** |
| 10–25 liters | Option label | **UI Text** |
| 25+ liters | Option label | **UI Text** |
| Notes (optional) | Field label | **Copy / UX Copy** |
| Access instructions, preferred time, etc. | Notes placeholder (web) | **UI Text** |
| Submitting… | Submit button loading state | **UI Text** |
| Request pickup | Submit button | **UI Text** |
| Pickup requested! | Success heading | **Copy / UX Copy** |
| We'll contact you within 24 hours to confirm your collection time. | Success message | **App Content** |
| Submit another request | Success button (web) | **UI Text** |
| Book another pickup | Success button (mobile) | **UI Text** |
| Reoil v1.0.2 · {API_URL} | Mobile version footer | **App Content** |

---

## Errors & validation

| Text | Location | Category |
|------|----------|----------|
| Please fill in all required fields. | API / form validation | **App Content** |
| Something went wrong | Form error fallback (web) | **App Content** |
| Failed to submit request | Form error fallback (web) | **App Content** |
| Failed to submit pickup request | Mobile API error fallback | **App Content** |
| Missing fields | Mobile alert title | **Copy / UX Copy** |
| Request failed | Mobile alert title | **Copy / UX Copy** |
| Please try again. | Mobile alert fallback | **App Content** |

---

## Admin dashboard

| Text | Location | Category |
|------|----------|----------|
| Pickup requests | Page H1 | **Copy / UX Copy** |
| Admin dashboard — view all customer oil pickup bookings. No customer login required. | Page subtitle | **App Content** |
| Admin access | Card title | **Copy / UX Copy** |
| Admin key | Field label | **Copy / UX Copy** |
| Set ADMIN_KEY in .env | Input placeholder | **UI Text** |
| Loading… | Button loading state | **UI Text** |
| Load pickups | Button | **UI Text** |
| Invalid admin key | Error message | **App Content** |
| Failed to load pickups | Error message | **App Content** |
| Unauthorized | API 401 response | **App Content** |
| {n} request(s) | Pickup count | **UI Text** |
| Name: / Phone: / Email: / Type: / Quantity: / Submitted: / Address: / Notes: | Detail labels | **Copy / UX Copy** |
| No pickups yet. Click Load pickups. | Empty state | **Copy / UX Copy** |

---

## Summary by category

| Category | Count (approx.) | Examples |
|----------|-----------------|----------|
| **UI Text** | ~35 | Schedule pickup, Request pickup, Home, Load pickups |
| **App Content** | ~20 | 24-hour confirmation, step descriptions, errors |
| **Copy / UX Copy** | ~45 | Hero headline, Why Reoil?, field labels, empty states |
| **Content** | ~3 | Stat values only (500+, 12,000+, 8+) |

There is no long-form **Content** (articles, FAQs, stories) in the current app. Stat figures are the only strings that fit the general **Content** bucket.
