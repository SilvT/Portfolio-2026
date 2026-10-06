---
name: experience-baseline
description: Comprehensive work history baseline — Senapt, CaixaBank, Nateevo experiences plus freelance practice (Silvarium) with decisions, scope, metrics, and what you'd do differently
sources: [stated]
aliases: [work experience, professional experience]
---

## PERSONAL & CONTACT

- Name: Silvia Travieso González
- Location: Barcelona, Spain
- Email: silvia.travieso.g@gmail.com
- LinkedIn: https://www.linkedin.com/in/silvia-travieso-gonzalez/
- GitHub: https://github.com/SilvT
- Portfolio: www.silviatravieso.com (self-designed and self-coded)

---

## EDUCATION

**Architecture Degree (6 years) — ULPGC (Universidad de Las Palmas de Gran Canaria)**
Equivalent internationally to Master's level. In Spain, Architecture is a single 6-year programme covering design, civil engineering, and urban planning — not split into Bachelor's + Master's as in other countries. Do not describe as an "art institution" or downgrade to Bachelor's level equivalent.

**Master's in Graphic and Web Design — EINA Barcelona**
Postgraduate specialisation in graphic design and digital/web design.

---

## OVERVIEW & TENURE

**Total Design Experience:** Active since 2021, including:
- Enterprise design systems and design ops roles (Senapt, CaixaBank/Nateevo)
- Freelance multidisciplinary design practice (Silvarium, active since 2021 with gaps between client engagements)

**Key professional thread:** Design Systems + Design Ops + Product Design — often simultaneously within the same role.

---

## SILVARIUM (Freelance Practice, Active Since 2021)

### Delivery Model: "Concept to Code"

Takes clients from zero brand or identity to complete, scalable implementation across all media. Approach comes from a UI and design systems perspective — naming conventions, colour scales, and typographic systems are defined using DS vocabulary (semantic tokens, scales, etc.) with future digital application in mind from the start.

**Deliverables per engagement:**
- General baseline research and benchmarking (comparable to standard product or graphic designer discovery work — not formal UX research)
- Brand book (comprehensive visual identity guidelines)
- Visual systems (typography scales, colour systems, layout principles, pattern libraries)
- Social media and marketing collateral templates
- Website (single and multi-page, no complex interactions or structural complexity)
- Design system applicable to digital and print elements

### Why It Matters for CV/Cover Letters

- Demonstrates ability to build systems from zero independently
- Shows end-to-end ownership without the safety net of a larger org
- Credibly extends design experience timeline (active since 2021)
- Most relevant for: roles emphasising brand strategy, product design breadth, founding design infrastructure, or end-to-end ownership
- Include when client work aligns with the opportunity; lean on Senapt/CaixaBank when role emphasises enterprise-scale systems or technical infrastructure

---

## SENAPT (B2B SaaS Startup, ~2 years total; ~1 year 9 months tenure)

**Title:** No official title (classic chaotic startup). Role functioned as: Solo Product Designer / de facto co-product owner for first ~year; then also Design Systems Lead for final ~6 months.

### Original State
- Three product lines live; assigned to be designer for a fourth (marketing CRM dashboard)
- Zero systematization: no file naming conventions, no file structure agreements, no design libraries, freelancer-led chaos
- Designers hired project-by-project from graphic/visual backgrounds — no engineering mindset in the work
- Head of design hired just before you; you were the second full designer; junior was third

### Your Mandate
- Sole designer on the CRM dashboard project (team of 3: backend, you, frontend)
- Frontend developer in Japan, 7 hours ahead, limited English — all communication written (demos, annotations, prototypes)
- CEO: engineer-first founder, initially dismissive of "designer talk" around design systems
- No formal product owner — became de facto co-owner with backend dev

### What You Built

**The Product (CRM Dashboard)**
- Timeline: Brief to MVP = 1 year 3 months
- Domain: Marketing operations (unfamiliar — learned through research + direct partnership with head of marketing)
- Handoff approach: Heavily annotated screens, component-first then flow-second, small isolated pieces to minimise communication loss
- Impact on handoff speed: ~50% faster than other teams (based on comparing notes with other designers, not formal tracking — other teams had different workflows/constraints)

**The Design System**
- Started as proof of concept without explicit approval, using the product project as testbed
- Token architecture: 3-level system (primitive → semantic → component)
- Unique decision: Used Figma variable modes for interactive states/variants instead of massive component sets
  - Modes for: on/off statuses, active/press/hover/default/disabled/focus states
  - Reduced perceived complexity, avoided redundant token names
  - Trade-off: Not positioned for easy dark/light mode transfer, but solved the actual use case elegantly
- Deliverables first (components), screens second — architecture made changes cascade predictably
- No traditional component documentation (trade-off: no time, and sole consumer anyway)

**Tokens to Code Pipeline**
- Built custom Git Action + plugin to ship tokens from Figma directly to GitHub as consumable JSON
- Transformed JSON to target language (JavaFX for that product)
- Automated header: timestamp, change count, primitive/semantic/component token counts
- Enabled white-label capability — proved the value to the CEO
- **Note:** This plugin is now self-published on the Figma Community. It has since become largely obsolete following Figma's release of a native GitHub connection (2026 config), but represents early automation thinking that predated the native solution.

**CEO Buy-In & Scaling (Design Ops thread)**
- At 5-6 months, showcased audited system + token pipeline to CEO — convinced him
- Promoted to Design Systems Lead
- Company grew from 2-3 designers to 8 designers during tenure
- Led 8-9 workshops + design jams training team on DS fundamentals
- Audited all 7 product lines; created global DS scaffolding (guidelines doc + Confluence template) for future consistency
- Planned progressive scaling: standardised method, shared governance, head of governance
- **Bankruptcy ended this before full scaling happened**

### Key Skills Demonstrated
- Learning unfamiliar domains through research + direct observation
- Communicating across language/timezone barriers via written, visual, annotated handoffs
- Breaking handoffs into isolatable pieces to reduce communication loss
- Building tooling to eliminate friction (token pipeline)
- Establishing governance frameworks (Design Ops) alongside product design work

---

## CAIXABANK — MULTI-BRAND DESIGN SYSTEM (Client project via Nateevo, March–September 2026, ~6 months)

**Title (via Nateevo):** Senior Design System Strategist / Design Technologist

**Industry:** Enterprise banking / financial services (CaixaBank is one of Spain's largest traditional banks — not a Fintech startup)

### Original State
- Multi-brand DS initiative already 6 months in on arrival
- Foundation (variables) + common/non-common component list already established
- ~50%+ of first component batch done (duplicated/refreshed from legacy CaixaBank DS)
- Two brands stress-tested: CaixaBank (main, web-first) + Imagin (secondary, app-first)
- 4-library structure: Foundation (variables for all brands), Commons, CaixaBank UI Kit, Imagin UI Kit
- Scale: ~3000 components across all 4 libraries counting variants individually; ~200-300 component sets

### Your Mandate
- Hired for specific profile: DS experience + front-end understanding + Figma/engineering mindset
- Bridge between design and development; understand Figma vs. code constraints and vice versa

### Team Structure
- 8 people in DS team (all from different consulting companies)
- 90% had zero DS experience; no clear hierarchy despite having a lead
- Separate dev team, accessibility department, UI/UX/copywriting departments
- Direct contact only with UI head, dev team, and accessibility (as consultants)

### What You Actually Became
Started as standard component builder + documenter, but identified friction points and built operational tooling:

**1. Library Freeze System + Changelog Plugin (Design Ops)**

*Problem:* 8 people working daily in 4 library files — impossible to track what changed between 2-week dev sprints.

*Solution:*
- Established library freeze process (Figma + dev mirroring each other's 2-week cycles)
- Built generative plugin with three tabs:
  - **Partial Changelog:** Click component → auto-selects, pre-fills name/user/timestamp; designer adds manual notes; generates frame on canvas
  - **Freeze:** Compiles scattered partial changelogs into one general changelog; creates save point in file history
  - **Snapshot:** Creates JSON snapshot of all variable values; compares to detect changes; auto-fills changelog with detected token changes
- Scannable colour-coded tags (component variant, token change, naming change, etc.)
- LLM integration: feed general changelog to Claude for summary on library publish message
- Adoption: Near-zero onboarding friction; designers took to it naturally; only the Freeze tab needed any explanation. Full team adoption within ~3 months of introduction, before end of tenure.
- Stress-tested across 6 library freezes; created onboarding doc for the process
- **Now self-published on Figma Community**

**2. Figma Searcher Plugin (Design Ops / Dev enablement)**

*Problem:* ~3000 components across libraries (counting variants); no way to search which components use a specific variable/style/effect. Developers needed this for impact analysis before changing token values.

*Solution:*
- Search for variables/styles/effects across current page or all pages
- Clickable results navigate to component
- Export results as CSV or JSON (straight to dev team)
- Scope expanded: single variable → multi-search; styles → effects added

*Context:* CaixaBank had strict plugin security policy (request → admin approval → test). Building custom was faster than the approval cycle.

*Status:* **Pending approval on Figma Community**

**3. Document Assistant Plugin (Design Ops / Documentation automation)**

*Problem:* Component documentation template had multiple pages + repetitive filling, manual link hunting, documentation going out of date when component names/properties changed.

*Solution:*
- Generative plugin built on top of existing template
- Named layer prefixes (PH = placeholder, DY = dynamic, S = slot) as injection targets
- **General Info tab:** Select library → select component (connected to Figma API, always current); auto-fills component name across all pages, pulls description, inserts links, updates status tags
- **Prop Table tab:** Auto-generates property table with current published properties + values; option to include nested component instances
- **Slot tab:** Auto-fills documentation slots; includes text sizing test, responsive testing connected to breakpoint variables, variant/status display
- **Changelog tab:** Auto-detects user + timestamp; manual entry for changes; auto-updates version number on info page

**4. Design System Health Dashboard (Design Ops / POC)**

*Goal:* Aggregate view of system health across 4+ libraries as more brands onboard.

*Tracked:* Native Figma library analytics, naming pattern adherence, property consistency, token value consistency, stale/detached components

*Implementation:* Local HTML project pulling Figma API daily to build trends

*Status:* POC presented to design system lead, design ops, project management — well received. Left behind as starting point for team.

### Library Freeze Metrics
- Total freezes run: 6
- State at departure: Common library plateau (variants/revisions only); focus had shifted to specific UI kits; waiting for next brand to stress-test commons again

### What You'd Do Differently
- **Token structure (if had arrived earlier):**
  - Don't separate colour tokens from non-colour tokens into different collections (no reason given no responsive/mobile-desktop modes planned)
  - Link component tokens to semantic values (they weren't)
  - Keep all semantics together, all components together regardless of type
  - Current structure was: Primitives, Colour (semantic + component mixed), Non-Colour (semantic + component mixed) — should have been: Primitives, Semantics (all types), Components (all types)

---

## NATEEVO — INTERNAL DS (September 2026, ongoing)

**Title:** Senior Design System Strategist

### Original State
- Consulting company with internal DS + project templates (all work in same Figma environment)
- Unorganised, outdated; teams not using libraries
- Brand department not fluent in Figma, resisting libraries; UI/UX team understood styles but not variables
- Template duplication culture — when template changes, copies don't cascade

### Mandate & Work In Progress

**Identity/Toolkit Library**
- Audit + compile reusable components from project files
- Connect existing styles to variables for cascading on rebrand
- Goal: Rebranding doesn't break system visually

**Text Style Audit**
- Standardise inconsistencies across templates created at different times

**Working Assistant Plugin (in development)**
- Based on Document Assistant model from CaixaBank engagement
- Plugin-based documentation + client checklist sync
- Reduces manual update burden for design team

**Core problems identified:**
1. No dedicated ownership — maintained by whoever has time
2. Lack of Figma depth across team (brand department unfluent; no variables understanding)
3. Legacy problems from duplication approach (inconsistent colours/styles across copies)

---

## DESIGN OPS — RECOGNISED THREAD ACROSS ALL ROLES

Design Ops work has run consistently alongside (and sometimes ahead of) design systems and product design work across all roles. Worth positioning explicitly in applications for roles mentioning Design Ops, design infrastructure, or design tooling.

**Definition of what you've actually been doing:**
Identifying workflow friction, building tooling solutions for team-level problems, establishing governance processes, creating systems that enable others to work more effectively — treating operational problems the way a product designer would treat user problems.

**Evidence by role:**

- **Senapt:** Workshops and training programme, global DS governance scaffolding (7 product lines), token pipeline (automation)
- **CaixaBank:** Library freeze system, changelog plugin, documentation automation plugin, health dashboard POC — none of these are component work; they're operational infrastructure built to solve team-scale friction
- **Nateevo:** Entire mandate was Design Ops in nature — systematise, organise, enable the team, solve ownership and adoption problems

**Relevant job title variations to watch for:** Design Ops Lead, Design Systems Engineer, Design Infrastructure, Design Tooling, Design Programme Manager (at larger orgs)

---

## PATTERN ACROSS ALL ROLES

**What You Do:**
1. Identify friction (gaps, inefficiencies, stale processes)
2. Get frustrated with them
3. Build solutions (usually starting "for my sanity" — or because a colleague brings a friction or problem over, knowing you have a knack for problem-solving)
4. Present to team/lead; get buy-in
5. Iterate based on real usage
6. Document and onboard

**Your Strengths:**
- Learning unfamiliar domains through research + direct observation
- Building communication bridges across silos (design-dev, async, language barriers, tool knowledge gaps)
- Converting constraints into elegant solutions
- Iterating from first principles
- Systems thinking: understanding how changes cascade, where information breaks down, what needs automation vs. process change
- Building meaningful systems from zero — both at enterprise scale (Senapt) and independently (Silvarium)

**What You Avoid:**
- Purely theoretical documentation when sole consumer
- Generic/over-engineered solutions
- Roles without autonomy or ownership

---

## METRICS & IMPACT (What Translates to CV)

**Senapt:**
- ~50% faster handoff time vs. other teams
- Trained 8-person design team on DS fundamentals
- Established governance framework for 7 product lines (shelved by bankruptcy)

**CaixaBank:**
- 6 library freezes; ~3000 components across 4 libraries (~200-300 component sets)
- 3 plugins + 1 operational system; near-zero adoption friction, zero bugs
- Expanded role from component building into workflow/tool development
- POC health dashboard for system governance at scale

**Nateevo:**
- Work in progress — no metrics yet

**Silvarium:**
- Active since 2021 with gaps between engagements
- End-to-end delivery: brand strategy → visual systems → digital + print implementation
- Demonstrates ability to build meaningful systems from zero independently