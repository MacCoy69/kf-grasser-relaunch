# CLAUDE.md – Grasser KFZ Website Relaunch

## Deine Rolle

Du agierst als Senior Full-Stack Webentwickler, UI/UX Designer und Conversionrate-Experte mit über 10 Jahren Erfahrung im Website-Projektmanagement. Dein Ziel ist eine moderne, performante und responsive Premium-Website für einen Sportwagen-Spezialisten.

---

## Kontext- und Projekt-Übersicht

**Kunde:** Grasser Cars · Sales · Services  
**Inhaber:** Fabian Grasser  
**Projekt:** Relaunch von kfz-grasser.de  
**Agentur:** Wunderwald Media (mw@wunderwald-media.de)  
**Status:** Phase 1 – Konzept & Angebot 

### Kundendaten für Kontakt und Impressum

| Feld | Wert |
|------|------|
| Firma | Grasser Cars · Sales · Services |
| Inhaber | Fabian Grasser |
| Adresse | Crailsheimer Straße 10, 90574 Roßtal |
| Telefon | 09127/95023 |
| Mobil | 0171/1254528 |
| E-Mail (alt) | grasser@gmx.de ← durch professionelle Adresse ersetzen |
| Öffnungszeiten | Mo–Fr 08–17 Uhr, Sa 09–12 Uhr |
| Steuernr. | 218-222-11574 |
| USt-ID | DE307032289 |
| Finanzamt | Fürth |
| Domain | kfz-grasser.de |

---

## Zielgruppe

**Primär:** Solvente Käufer von Sportwagen und Premiumfahrzeugen.
- Porsche (911, Cayman, Panamera, etc.) Vorzugsweise Porsche Händler
- Audi (RS-Modelle, S-Modelle)
- Mercedes (AMG)
- BMW (M-Modelle)

Typisch: 35–60 Jahre, unternehmerisch oder leitend tätig, kaufen Autos als Passion und Lifestyle, nicht aus Notwendigkeit.

**Sekundär:** Besitzer von Sportwagen und Premiumfahrzeugen, die eine hochwertige Werkstatt suchen (kein Billigservice).

---

## Referenz-Website

**stimpfig.de** – Premium-Fahrzeughändler in Stuttgart. Der Kunde möchte ein ähnliches Premium-Feeling und Design, aber doch eigenständig. Kein AI-Slop Design.

### Was stimpfig.de richtig macht (übernehmen)
- Weiß/Hellgrau Hintergrund, dunkle Typographie, minimale Akzentfarben
- Bild-zentriertes Layout – Fahrzeuge sind Protagonisten, nicht Text
- Kein Urgency-Sprech, keine Sale-Badges, kein Druck
- Curated Inventory Grid (3–4 Spalten Desktop), Bild + Modellname reicht
- Zweisprachigkeit DE/EN (rechts oben)
- Flache Navigation (max. 6 Punkte, kein Dropdown-Chaos)
- Founder-Story mit Zitat, persönlicher Ansatz

---

## Design-Richtlinien

- Nutze das AskUserQuestion Tool, um den Nutzer über das Websitedesign zu interviewen, damit du die Vorstellungen des Nutzers genau abbilden kannst
- Nutze den frontend-design Skill für alle UI-Entscheidungen
- Nutze UI/UX Pro Max für Design-System-Generierung
- Nutze ggf. 21st.dev für Component-Inspiration (falls vorgegeben)
- Keine generischen AI-Aesthetics
- Bold, distinctive Design-Choices
- Performance-optimiert (Core Web Vitals)

### Schaffe bitte filmisches Erlebnis für Luxus- und Sportwagen Autohändler mit Kfz-Service:

- Verwende Hero-Bereiche im Vollbildmodus + flüssiges Scrollen
- Füge mehrschichtige Grafiken + Parallax-Effekte für mehr Tiefe hinzu
- Halte die Typografie minimalistisch und hochwertig
- Verwende GSAP + ScrollTrigger + Lenis
- Füge Überblendungen, Einblendungen und Bildvergrößerungen beim Scrollen hinzu
- Integriere dezente Hover- und Cursor-Interaktionen
- Halte Bewegungen langsam und flüssig


### Farbpalette (Entwurf, bei Tech-Stack-Entscheidung finalisieren)


Background:   #FFFFFF / #F5F5F5 (hell, sauber)
Text:         #111111 / #1A1A1A (fast schwarz)
Accent:       #2A2A2A und indisch Rot #CD5C5C (Entscheidung ausstehend)
Border/Muted: #E0E0E0


### Typographie
- Primär: Inter, Neue Haas Grotesk, oder Geist (serifenlos, clean)
- Keine Display-Fonts, keine Serifen
- Text ist Begleitung zur Fotografie, nicht Hauptdarsteller

### Fotografie
- Hochwertige Fahrzeugfotos (professionell beleuchtet, sauber gestellt)
- Werkstatt-Atmosphäre: Fabian Grasser bei der Arbeit
- Kein Stockfoto-Look
- **Offene Frage:** Existierendes Fotomaterial vorhanden? Shooting nötig?

### Vorhandene Bilder (./images/)

marco-wunderwald.jpg          # Profilbild für "Über mich" Section
wunderwald-media-bg.png       # Hero Background Image

### Verboten (Luxus-Anti-Pattern)

- ❌ "JETZT ANGEBOT SICHERN!" / Countdown-Timer / Flash-Aktionen
- ❌ Popup-Formulare / Exit-Intent-Overlays
- ❌ Billiger Testimonial-Block mit Stockfotos
- ❌ Finanzierungsrechner / "Bad Credit OK" Signale
- ❌ Bild-Slider / Karussell (veraltet und ablenkend)
- ❌ Grelle Farben, Sale-Badges, Rabatthinweise
- ❌ "Nr. 1 Werkstatt in Nürnberg" ohne Beleg
- ❌ GMX-E-Mail-Adresse sichtbar auf der Website




## Seitenstruktur


DE:
/                        → Homepage, bzw. Startseite (Sektionen siehe ##Sektionen der Startseite)
/fahrzeuge               → Inventar-Grid (Custom CMS)
/fahrzeuge/[slug]        → Einzelfahrzeug-Detail
/sportwagenservice       → Porsche/Audi Premium Service (USP-Seite)
/werkstattleistungen     → Alle Werkstattleistungen mit Preisen
/Karriere-Jobs           → Jobinserate: Kfz-Mechatroniker und Kfz-Meister
/impressum               → DSGVO-Pflichtseite
/datenschutz             → DSGVO-Pflichtseite

EN (Mirror):             (wir bauen die erst im 2. Step)
/en/                     → Homepage EN
/en/vehicles/            → ...


## Sektionen der Startseite

Section | ID für Class | Funktionen

- Navigation | `#navbar` | sticky mobil Hamburger-Menü bei smartphone-Darstellung
- Hero | `#start` | wird noch definiert mit Animation, Scroll und CTA
- Zitat | `#zitat` | um Empathie und Resonanz zu erzeugen
- Fahrzeuge | `#bestand` | die 5 neuesten Fahrzeuge (für den Prototyp, zuerst statisch) mit Button für Link "Alle Fahrzeuge" mit Slider Funktion, am rechten Rand befindet sich ein Pfeil-Button, um 1 weiteres Fahrzeugkachel zu sliden
- Leistungen | `#leistungen` | 3 Kacheln mit Vorschaufoto für 1. Sportwagen-Service 2. Werkstatt-Leistungen und 3. Premium Gebrauchtwagen
- Über uns | `#überuns` | links foto - rechts text
- Testimonials | `#testimonials` | 
- FAQs | `#faq` | 5 FAQs mit Schema.org Promptrecherche mit rankscale.ai 
- Kontakt | `#kontakt` | KontaktformularInline JavaScript (Formular-Handler implementiert) 
- Footer | `#footer` | detaillierter Footer mit Kurzinfos, Öffnungszeiten, Links, Logo usw.


---

## Leistungsportfolio und Inhalte (vollständig dokumentiert für Content)

### Werkstattleistungen: Standardservices
- Inspektion nach Herstellervorgaben ab €45 + Material
- Radwechsel €24,90
- Reifeneinlagerung inkl. Saisonwechsel €59,90
- Bremsenflüssigkeitswechsel ab €39,90
- Fahrwerkvermessung ab €64,90 (Sportwagenachsvermessung mit Lastenrad ab €249,90)
- Zahnriemenwechsel ab €174,90 + Material
- Anhängerkupplungs-Nachrüstung ab €449
- Unfallaufbereitung nach Herstellerstandard
- Verschleißreparaturen (Bremsen, Kupplung, Reifen, Auspuff, etc.)
- Smart Repair: Dellen ohne Lackierung ab €49,90
- Lackaufbereitung ab €99
- TÜV/HU 3× pro Woche im Haus
- Glasreparatur/-ersatz
- AUDI/VW/SEAT/SKODA/PORSCHE Assistenzsystem-Kalibrierung
- Cabrioverdeckaufbereitung (Hart- und Softdach)

### Grasser's Sportwagenservice (Premium)
- Porsche 911/964/993/996/997/991/992 Inspektion ab €249,90
- Kupplungstausch + Druckplatte + Ausrücklager für 996/997/991 ab €999
- PDK-Wartung & Ölservice
- Audi S-Tronic Service & Ölwechsel
- Fahrwerkabstimmung mit Lastenrad & dynamischer Fahrwerkregelung
- Bilstein & KW Fahrwerkinstallation & Abstimmung
- Rennstrecken- und Straßenreifenservice
- Spezialisierte Porsche & Audi RS Diagnose & Reparaturen
- Fahrzeugaufbereitung Innen/Außen ab €190
- Abhol- und Bringservice im geschlossenen Trailer

###
- Zitat: "Wähle einen Beruf, den du liebst, und du brauchst keinen Tag in deinem Leben mehr zu arbeiten." Wir lieben, was wir tun!

---

## Features – Must Have (MVP)

- [ ] Fahrzeuginventar mit CMS (Marke, Modell, Jahr, km, Preis optional, Bilder, Beschreibung)
- [ ] Zweisprachigkeit DE/EN mit Toggle
- [ ] Kontaktformular + Terminanfrage
- [ ] Google Maps Integration
- [ ] SEO: LocalBusiness Schema, OpenGraph, Meta-Tags mit Ort Roßtal (nicht Zirndorf!)
- [ ] Mobile-first responsive Design
- [ ] HTTPS (beibehalten, Cloudflare empfohlen)
- [ ] Impressum / Datenschutz (DSGVO-konform)
- [ ] Cookie-Consent Banner (DSGVO)

## Features – Nice to Have

- [ ] Referenzgalerie "Verkaufte Fahrzeuge" mit Sold-Badge
- [ ] Terminbuchungssystem (Calendly oder custom)
- [ ] Google Reviews Widget
- [ ] Newsletter (Footer, subtil)
- [ ] Instagram Feed
- [ ] Before/After Galerie Fahrzeugaufbereitung

---

## Tech Stack 

### Frontend und CMS-Oberfläche Astro + Tailwind
- Static Site Generation → Lighthouse ≥ 90
- Framer Motion für Animationen
- **Icons:** Font Awesome (via CDN)
- **Kontaktformular:** Inline JavaScript (Formular-Handler implementiert)
- Deployment: Vercel


### Backend & Datenbank: Supabase
-	PostgreSQL-Datenbank: Speichert alle Fahrzeugdaten (Marke, Modell, Preis, Kilometerstand, Erstzulassung, Beschreibung).
-   Supabase Storage: Hier werden die Fahrzeugbilder abgelegt.
-   Supabase Auth: Schützt deinen /admin-Bereich, damit nur der Autohändler Autos bearbeiten kann


### Skills

- Nutze Frontend Design Skill 
- Nutze UI/UX Pro Max Skill
- nutze Framer-Motion Skill


### Feinschliff

Frontend Design Skill und UI/UX Pro Max SkillVerbessere:
- visuelle Hierarchie
- Mobile Darstellung
- Call-to-Actions
- Lesbarkeit
- Abstände
- Animationen
- Ladezeit
- Conversion-Fokus
- Vertrauensaufbau

Bitte erstelle zuerst eine Liste der Verbesserungen und setze sie danach um.

---

## Hosting & Deployment

- **Staging:** Vercel
- **Production:** noch unbekannt
- **Repository:** GitHub - https://github.com/MacCoy69/kfz-grasser.git

### Git Workflow

1. Local Development → Browser Preview
2. Git Commit nach jedem Feature
3. Staging-Branch → Vercel Preview
4. Production-Branch (main) → Hoster von Kunden (wird noch festgelegt)


## SEO-Anforderungen

### allgemeine SEO- und GEO Regeln

- Nutze semantisches HTML.
- Verwende klare H1, H2 und H3-Strukturen.
- Baue FAQ-Sektionen ein.
- Stelle Entitäten klar dar.
- Beschreibe Angebote eindeutig.
- Nutze lokale Relevanz, wenn passend.
- Baue strukturierte, zitierfähige Inhalte.
- Schreibe verständlich für Menschen und KI-Systeme.

### Meta-Tags:
- <title>[KEYWORD]: [USP] | [BRAND]</title>
- <meta name="description" content="[150-160 Zeichen]">
- <meta name="robots" content="index, follow">
- <link rel="canonical" href="[URL]">
- open Graph: og:type, og:title, og:description, og:url, og:locale
- Twitter Card: summary_large_image
- **Ort:** Roßtal (nicht Zirndorf! — aktuell fehlerhaft auf alter Site)
- **Schema:** Organization, LocalBusiness, Service, OpeningHoursSpecification
- **Keywords:** Porsche Werkstatt Nürnberg, Sportwagenservice Roßtal, Audi RS Service, Gebrauchtwagen Porsche kaufen
- **Sprachen:** de_DE + en_GB hreflang
- **Sitemap:** XML sitemap automatisch generiert
- **robots.txt:** korrekt konfiguriert

## Schema.org JSON-LD:
- Immer: Article oder WebPage
- Bei FAQs: FAQPage mit allen Q/A-Paaren
- Bei lokalem Business: LocalBusiness mit Adresse, Tel, Öffnungszeiten

### Mobile-RESPONSIVENESS
- Desktop > 1024px | Tablet 768–1024px | Mobile < 768px | Small < 480px
- Burger-Menü mit aria-expanded Toggle
- -webkit-text-size-adjust: 100% gegen iOS Font-Inflation
- Touch-Targets mind. 44×44px

---

## Verifikations-Checkliste

1. Lighthouse Score ≥ 90 in allen 4 Kategorien
2. Mobile Rendering auf iPhone (Safari) und Android (Chrome)
3. Schema Markup validiert via Google Rich Results Test
4. DE/EN Sprachswitch funktioniert ohne JS-Fehler
5. Kontaktformular sendet E-Mail korrekt
6. Fahrzeug anlegen / bearbeiten / löschen im CMS
7. Cross-Browser: Chrome, Safari, Firefox

---

## Offene Punkte (vor Start klären)

1. **Fotomaterial:** Professionelle Fotos vorhanden? Shooting nötig?
2. **Logo:** Bestehendes Logo übernehmen oder Redesign?
3. **E-Mail:** Professionelle Domain-E-Mail einrichten (info@kfz-grasser.de)
4. **Hosting-Umzug:** Von Jimdo zu eigenem Hosting zu Vercel
