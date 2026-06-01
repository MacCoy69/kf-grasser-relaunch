# Grasser Cars — Website Relaunch

Premium-Website für **Grasser Cars · Sales · Services** in Roßtal bei Nürnberg —
Sportwagen-Spezialist mit Fokus auf Porsche, Audi RS und Premiumfahrzeuge.

Projekt von [Wunderwald Media](mailto:mw@wunderwald-media.de) · Status: **Phase 1 — Prototyp**

---

## Quickstart

```bash
# Lokaler Dev-Server (Port 3001)
npx http-server . -p 3001 --cors -c-1
```

Alternativ Direktstart über `.claude/launch.json` mit Claude Code Preview.

Browser öffnen: <http://localhost:3001>

---

## Tech Stack

- **HTML / CSS / Vanilla JS** (statischer Prototyp, kein Build-Step)
- **GSAP 3.12** + ScrollTrigger — Scroll-Animationen
- **Lenis 1.3** — Smooth Scroll
- **Inter** + **Barlow Condensed** (Google Fonts)
- **Schema.org JSON-LD** für AutoDealer + FAQPage

Tech-Stack-Entscheidung für die finale Umsetzung steht noch aus
(Next.js + Sanity / Astro + Decap / WordPress).

---

## Projektstruktur

```
.
├── index.html                  # Startseite (Prototyp)
├── assets/
│   ├── css/style.css           # Design System + Stylesheet
│   └── js/main.js              # GSAP, Lenis, FAQ, Slider, Form
├── images/                     # Statische Assets (Hero, Siegel, Profile)
│   └── hero-bg.jpg             # Hero Key Visual (Porsche G-Modell + 992.2 GTS)
├── Logo/                       # Logo PNG (transparent)
├── Angebot/                    # Kundenangebot (PDF/DOCX)
├── Technisches/                # Spezifikationen, CMS-Konzept
├── CLAUDE.md                   # Projektbibel für AI-gestützte Entwicklung
└── plan-website-grasser.md.txt # Initialer Projektplan
```

---

## Sektionen der Startseite

1. **Navigation** — sticky, transparent über Hero, Frosted-Glass beim Scrollen
2. **Hero** (`#start`) — Key Visual G-Modell + 992.2 Targa GTS, hell, mit GSAP-Parallax
3. **Zitat** (`#zitat`) — Fabian-Grasser-Statement
4. **Fahrzeuge** (`#bestand`) — Slider mit 5 Premium-Fahrzeugen
5. **Leistungen** (`#leistungen`) — 3 Service-Tiles
6. **Über uns** (`#überuns`) — Founder Story
7. **Testimonials** (`#testimonials`) — 3 Kundenstimmen + Google-Badge (4,9 / 88)
8. **FAQ** (`#faq`) — Schema.org-konformes Accordion
9. **Kontakt** (`#kontakt`) — Formular auf hellgrauem Hintergrund
10. **Footer** (`#footer`) — 4 Spalten

---

## Open To-Dos

- [ ] Echtes Fotomaterial (Werkstatt, Team, verkaufte Fahrzeuge)
- [ ] Hero Video integrieren (Seedance Shots gerendert + geschnitten)
- [ ] DE/EN Sprachversion
- [ ] CMS-Anbindung für Fahrzeuginventar
- [ ] Impressum / Datenschutz Detailseiten
- [ ] Subseiten Sportwagenservice / Leistungen / Karriere

---

## Kunde

**Grasser Cars · Sales · Services**
Crailsheimer Straße 10 · 90574 Roßtal
Tel. 09127 / 95023 · info@kfz-grasser.de
