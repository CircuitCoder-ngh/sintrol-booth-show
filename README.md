# Sintrol booth showcase

An animated, looping dust-monitoring film for a Sintrol booth, with an interactive layer for answering visitor questions: tap a product for an animated detail view with specifications, certificates and documents; tap **Learn more** for a self-running deep dive into the chapter on screen; or tap **Explore** to browse products, applications, reference cases, certificates, documents, distributors, videos and the knowledge library.

Everything runs locally. No internet connection is needed, except for the YouTube videos described below.

**Online preview:** https://circuitcoder-ngh.github.io/sintrol-booth-show/ (for reviewing the show in a browser; at the booth, run the local copy so it does not depend on the venue's internet).

## Run it at the booth

1. Copy this whole folder to the booth laptop.
2. Double-click **`Start Booth Show.bat`**. It opens Chrome (or Edge) full screen in kiosk mode.
3. To leave kiosk mode, press **Alt+F4**.

You can also open `index.html` directly in Chrome or Edge and press **F** for full screen. The layout is a fixed 1920 × 1080 stage that scales to any screen size or aspect ratio.

## Set the event

Open `assets/js/data.js` and fill in `event` near the top, for example:

```js
const event = { name: "CEM Asia 2026", place: "Kuala Lumpur, Malaysia", dates: "17 to 19 November 2026", booth: "Booth 4" };
```

It appears in the top-right corner. With `name` left empty, the corner shows Sintrol's tagline, *Measuring Matters*.

## Using it during a conversation

| Action | Mouse / touch | Keyboard |
| --- | --- | --- |
| Open a product | Tap any product picture, label or chip on screen | |
| Deep dive into the chapter on screen | **Learn more** (bottom right) | L |
| Browse everything | **Explore** (bottom right) | E |
| Application finder | Explore → Applications, or any application tile | A |
| Reference cases | Explore → References, or any case photo or number | C |
| Certificates | Explore → Certificates, or any certificate chip | Q |
| Brochures, manuals, certificates (PDF) | Explore → Documents (searchable), or any product page | D |
| Find a local distributor | Explore → Distributors: tap a country on the map or list | N |
| Videos | Explore → Videos | V |
| Knowledge library (109 articles) | Explore → Knowledge (searchable) | K |
| Jump to a chapter | Tap a chapter name on the bottom line | 1–9, 0 |
| Pause / resume the film | Move the mouse to show the controls (top centre) | Space |
| Previous / next scene | Controls | ← / → |
| Back / close | Back, Close | Esc |
| Full screen | Controls | F |

**Learn more.** Every chapter except the closing one has a **Learn more** button. It pauses the film and plays a short slideshow (2 to 7 slides) that goes deeper: feature callouts on the product, specifications, selection tables, how-it-works steps, reference cases, certificates, the distributor map and the chapter's documents. It runs and loops on its own; nobody needs to tap anything. The bar at the top shows where it is (tap a segment to jump). Anything on a slide can still be tapped; **Back** returns to the deep dive. **Return to Slideshow** (or Esc) closes it and the film carries on where it paused. ← / → step through slides and Space pauses.

**Automatic return.** An open panel goes back to the film after 90 seconds without input (documents, videos and articles after 4 minutes), with a 10-second warning. A deep dive goes back after two full passes without input. A paused film resumes after 2 minutes. The cursor hides itself while the film plays.

## What's in the film (about 4 minutes 45 seconds, loops forever)

1. Opening: *Measuring matters*, company facts (founded 1975, own dust monitors since 1993, 20,000+ installations, 50+ countries)
2. Inductive Electrification: particles, probe, DC and AC signals, the dust reading
3. Auto Setup: commissioned in 500 seconds
4. S305QAL: QAL1, MCERTS, NPL India, certified ranges, zero and span checks
5. Dry stack or wet stack: in-situ monitors and the EXO QAL extractive loop
6. Baghouse: a broken bag, the outlet dust trend and the alarm
7. Filtration lineup: S101/S103, S201, S203, S303, S304, S304QAL
8. S314 split architecture: sensor at the duct, electronics at ground level
9. E-SPY after the ESP, with the power-plant result (1 → 4)
10. DumoPro: airborne dust, alarms at 5× and 20× normal
11. Reference: the grain tunnel in Brazil
12. DustCloud and DustTool
13. Applications (tap a tile for the monitors and cases)
14. Reference results, with all 11 cases
15. Certifications
16. Global network: partners in 40 countries
17. Vulcan furnace cameras
18. Contact, QR code to sintrol.fi/international, distributor invitation

## Editing content

All text lives in **`assets/js/data.js`**: company facts, products, applications, reference cases, certifications, videos, documents and the Learn more deep dives. Edit it in any text editor and reload the page.

- **Distributors** are in `assets/js/network.js` (one entry per country; keep each country's `x`, `y`, which place it on the map).
- **Knowledge articles** are in `assets/js/articles.js`.
- **Scene timing and wording:** each scene is a block in `assets/js/scenes.js` with its own `dur` (seconds).
- **Start on a particular scene** (handy for checking): `index.html?scene=ambient` (ids: intro, principle, autosetup, qal, stacks, baghouse, lineup, split, esp, ambient, tunnel, cloud, apps, results, certs, network, furnace, outro).
- **Learn more slides:** the `deep` block at the end of `data.js` has one entry per scene id. The slide layouts are listed in the comment above it. Product slides take names, taglines, features and specifications from the product entries. To check one, open `index.html?deep=qal` (add `&slide=3` for its third slide).
- Other handy links: `index.html?explore=network`, `index.html?product=s314`, `index.html?case=cement`.

## Documents

`docs/` holds 59 PDFs downloaded from sintrol.fi/international (duplicate uploads removed, files renamed to say what they are):

- Company overview and ISO 9001 certificate
- 12 product brochures (all current products, the previous EXO and the Vulcan cameras)
- 10 user manuals and 4 Ex supplements
- 15 certificates and approvals (QAL1/TÜV SÜD, EN 15859, MCERTS, NPL India, ATEX, IECEx, HazLoc, Korean KCs)
- 8 EU declarations of conformity
- 8 application notes, one per reference case

They open in a full-screen viewer inside the show. First-page previews are in `assets/thumbs/`.

## Videos

Sintrol's product videos and partner webinars are on YouTube. In the show they open in a new browser window when there is internet (close it with Ctrl+W to come back). To play one offline, save the MP4 in `assets/video/` and add `file: "assets/video/<name>.mp4"` to that video in `data.js` (see `assets/video/README.txt`). The Sintrol partner pages list a mediabank for partners.

## Folder layout

```
index.html              The show
Start Booth Show.bat    Kiosk launcher for Windows
assets/css/show.css     Styles matched to sintrol.fi (white, Sintrol blue and green, orange accents; Roboto)
assets/js/data.js       Products, applications, cases, certificates, documents, Learn more
assets/js/network.js    Distributors by country, head office and sales offices
assets/js/world.js      World map (Natural Earth 110m, Equal Earth projection)
assets/js/articles.js   Knowledge library and news
assets/js/scenes.js     The 18 film scenes, plus the Learn more slide layouts
assets/js/app.js        Player, chapter line, product pages, Explore, reader, documents, idle return
assets/img/             Product renders (white backgrounds removed), photos, logos, QR code (WebP)
assets/thumbs/          First-page previews of the PDFs
assets/fonts/           Roboto variable font, Latin subset (SIL Open Font License)
assets/vendor/gsap.min.js  GSAP 3.12.5 animation library (local copy)
assets/video/           Optional offline copies of the YouTube videos
docs/                   PDFs
```

## Sources

Content, images, documents and distributor details were gathered from sintrol.fi/international in November 2026: all 248 pages in the site map (product pages, product category pages, the applications page, the industry pages, all 11 reference cases, company pages, expos, the distributor finder and the news and blog archive), every PDF linked from them, and the product brochures' technical data. The site's gas-analyser, flow, level, calibration-service and carbon-capture articles belong to Sintrol's Finnish distribution business rather than the international dust-monitoring range, so they are not in the knowledge library. Distributor email addresses are hidden on the website, so the show lists each partner's company, address, phone and website only.
