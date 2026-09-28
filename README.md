# Portfolio 2026

My personal **Product Design, UI, and Design Systems portfolio** built to showcase real-world, production-ready work and processes.

This portfolio collects examples of my work as  **Senior Product Designer / Design Systems Lead** in engineer-first environments.

---

## Focus Areas
* **Product Design**
  UX strategy, information architecture, flows, decision-making

* **UI & Design Systems**
  Component libraries, tokens, patterns, accessibility, consistency

* **Delivery & Collaboration**
  Async workflows, documentation, dev enablement, handoff

* **Execution**
  From Figma to code, with an engineer-first mindset

---

## Tech Stack

* **Vite** – build tool
* **HTML / SCSS / JavaScript**
* **SCSS architecture** with tokens, mixins, and utilities
* **GSAP** (ScrollTrigger, MotionPath) for motion and the project card marquees
* **Swiper** for case study carousels
* **GLightbox** for image galleries (loaded on demand)
* **Vercel** for deployment, Web Analytics and Speed Insights

---

## 📁 Project Structure (simplified)

```
├── public/                   # Images, videos, CVs, robots.txt, sitemap.xml
├── scripts/
│   └── build-icons.cjs       # Iconoir icon subset generator
├── src/
│   ├── js/
│   │   ├── main.js           # Entry point
│   │   └── modules/          # One file per interaction or animation
│   └── scss/
│       ├── landing-page/     # Landing page styles
│       └── case-studies/     # Case study styles
├── index.html                # Landing page
├── marketing-management.html # Case studies
├── design-system-wip.html
├── energy-tracker.html
├── token-launch.html
├── package.json
└── vite.config.js
```

---

##  Local Development

```bash
npm install
npm run dev      # Dev server on port 3000
npm run build    # Production build to dist/
npm run icons    # Regenerate the Iconoir icon subset after adding icons
```

Deployment via Vercel.

---


## 👋 Let's chat

If you have questions or want to discuss the work, feel free to reach out.

silvia.travieso.g@gmail.com  
[www.silviatravieso.com](https://silviatravieso.com)   
[Linkedin](http://www.linkedin.com/in/silvia-travieso-gonzalez)

