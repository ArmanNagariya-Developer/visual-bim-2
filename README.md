# Visual BIM — BIM Modeling & Digital Construction Solutions

> Concept, rebuilt as an intelligent digital model.

A premium, dark, technical marketing site for **Visual BIM**, a BIM / digital
construction company. Built with React + Vite, Three.js (React Three Fiber),
Framer Motion, GSAP, Lenis and Tailwind CSS v4.

## Highlights

- **Procedural 3D BIM building** (React Three Fiber) that transforms through
  five states: `POINT CLOUD → SCANNED STRUCTURE → WIREFRAME → BIM MODEL →
  DETAILED DIGITAL BUILDING`, with a holographic scan ring, technical labels
  (POINT CLOUD / BIM / REVIT / LOD 300 / ARCHITECTURAL / STRUCTURAL / MEP),
  pointer parallax and drag-to-inspect.
- **Scroll-driven technology section** where scroll progress transforms the
  same building through `POINT CLOUD → GEOMETRY → PARAMETRIC DATA → BIM MODEL
  → DIGITAL INTELLIGENCE`.
- **7 interactive service cards** each with a bespoke animated SVG
  mini-visualisation (point cloud → BIM, laser sweep → CAD, LOD build-up,
  federated discipline layers, as-built pipeline…).
- **Project gallery** with category filtering and a detail modal
  (services used, LOD, technical info). Project artwork is generated
  procedurally — no external imagery required.
- **Contact form** with full client-side validation and a success state.
- **Performance & accessibility**: lazy-loaded 3D chunks, reduced particle
  counts on mobile, `prefers-reduced-motion` fully respected (WebGL is
  replaced by a static SVG visual), no horizontal overflow at any width.

## Structure

```
src/
  components/      Navbar, Hero, About, Services, ServiceCard, ServiceViz,
                   BIMProcess, TechnologySection, Projects, ProjectCard,
                   ProjectModal, ProjectVisual, CTA, Contact, Footer, …
  three/           BIMScene, TechScene, BIMBuilding, SceneEnvironment,
                   buildingGeometry (procedural building + point sampling)
  pages/           Home.jsx
  hooks/           useMediaQuery, useActiveSection, useSmoothScroll (Lenis)
  data/            company, services, projects
  lib/             math helpers (smoothstep, seeded RNG, …)
```

## Scripts

```bash
npm install      # install deps
npm run dev      # local dev
npm run build    # production build
npm run preview  # serve the build
npm run lint     # oxlint
```

## Before you ship

- **Contact details are placeholders.** `src/data/company.js` currently holds a
  placeholder email and LinkedIn URL (clearly marked `PLACEHOLDER` in the UI).
  Replace them with the official Visual BIM details.
- **Project data is illustrative.** `src/data/projects.js` uses placeholder
  locations/years and no real client statistics.

## QA

Headless verification scripts live in `scripts/`:

```bash
node scripts/qa.mjs http://localhost:4173/ qa 1440 900          # render + console + overflow
node scripts/qa-interactions.mjs http://localhost:4173/ 1440 900 # scroll, filters, modal, form
```
