---
name: case-study-marketing-management-final
description: Copy + layout for the Marketing Management case study, built on the case-study-components system (same structure as case-design-system.html)
sources: [draft v2, case_study_roadmap PDFs 1-5, old marketing-management-copy.html]
aliases: [Marketing Management case study]
status: draft — content locked, component mapping proposed, needs a build pass against case-study-components.md
---

# Case Study: Marketing Management — Senapt

**Page:** `case-marketing-management.html` (specimen) · **Theme:** TBD (pick one of the `theme_backgrounds` families not already used by Design System/Energy Tracker) · **Issue №:** TBD, lower than Design System's 03

---

## Masthead

← Prev: TBD (whichever project sits before this in issue order) · Next: Design System from Scratch →

Per `case-design-system.html`'s own masthead, this page's "Next" must read "Design System from Scratch", so that link direction is fixed regardless of what Prev turns out to be.

**"View original case study →" link:** include only if `/marketing-management.html` (the real, non-specimen page) already exists live. If this specimen page is meant to replace that one rather than sit alongside it, drop the link per the masthead component's conditional rule.

---

## Floating TL;DR (panel)

**A.** No product team, no UX, no brief beyond 3 section names. I co-owned scope with backend by necessity, not choice.

**B.** Month 2: CEO demanded an off-brand tablet app in 2 weeks, different stack. Shipped anyway.

**C.** Design system started as a self-imposed foundation on a rough look and feel. No component library to build on, frontend waiting on deliverables.

**D.** CEO's attention: not a feature, the handoff process. ~90% fewer review rounds → became the company's design system.

**E.** 15 months, 3-person team, MVP shipped. Ended up in investor conversations too.

*(Component note: this uses the simple `.case-tldr` letter-pair pattern like Design System's, not the narrative-paragraph variant from Library Freeze. Five entries here; per the component spec there's no fixed count, so trim or add if any beat reads as padding once it's laid out.)*

---

## Title block

**H1:** Marketing Management
**Subtitle:** A B2B SaaS dashboard, designed and co-owned from brief to MVP.

**Cover image:** TBD — candidate: `/mkm/mkm-large-hero.png` or a fresh hero built from the Leads dashboard light/dark comparison shown in the NEW CREATINGS folder. Needs a real descriptive alt text once chosen, not a filename-derived one.

| | |
|---|---|
| Project Type | Product |
| Role | Product Designer → de facto Product Co-owner |
| Company | Senapt (B2B SaaS startup) |
| Team | 1 backend developer (lead by default), 1 frontend developer (Japan, 7hrs ahead) |
| Stack | JavaFX |
| Timeline | 15 months, brief to MVP |

*(Team cell is tight at 6 fields fixed by the component convention; VP of Frontend and the second backend/Google Ads specialist who joined later don't fit the sidebar and stay in body copy instead.)*

---

## Intro (lede + body)

> No product team, no UX, no feature definitions; three section names and a backend developer who also needed direction.

I was hired as a UI designer. One month in, faced with three section names, no feature definitions, and a backend developer who also needed direction, someone had to answer: what actually goes in "Campaigns"? How deep does each section go? What's v1, what's v2? Who decides?

There was no product team and no UX function to ask. Backend and I became co-owners of scope, not by appointment but because nobody else was going to do it. We split along technical lines but shared every strategic call: backend owned architecture, data models and APIs; I owned design, research, specs and QA. The marketing lead, brought in as the product's end user and domain expert, gave us validation and workflow knowledge; the CEO got results-based check-ins from both of us. For the first few months I also wasn't allowed to talk to the marketing department directly; that restriction lifted around month 4-5.

**Display statement:** *"Campaigns. Leads. Unify the data. Make it work."* — CEO, in a 20-minute brief with two hand-drawn sketches and nothing written down.

---

## Section: The Problem

**Split Panel (before/after):**
- Left: Excel-based tracking screenshot (old copy's `/mkm/Excel dashboard.png`)
- Right: Leads dashboard UI (`/mkm/UI-Leads-dashboard.png`)
- Caption: From manually maintained spreadsheets to a unified dashboard.

The marketing team was flying blind. Campaign performance lived across several manually maintained Excel files, updated when someone had time, with roughly 14K customers on the books and growth to 24K projected over the next year. Data entry was manual across 6+ touchpoints: live events, traditional media, four-plus social platforms, review and forum sites, a custom quotation tool on the website, telesales. None of it talked to the others. Leads came in fragmented: some via telesales (tracked by a different department), some via social media (not tracked at all), some via the website's own quotation tool (not tracked either), some from door-to-door campaigns and events (also untracked). Social media comments and complaints weren't reaching Customer Care.

Going in: an engineer-first CEO, initially dismissive of design-systems thinking; no component library or pattern precedent; a stack (JavaFX) with thin documentation and no mature tooling; a frontend developer onboarded with a single approved screen; collaboration fully async across a 7-hour gap and a language barrier; no PM, no UX role, no defined MVP, no defined competitor set.

---

## Section: What This Actually Does

**Index Grid** (second real content to exercise this component alongside Phase Rail, both currently unverified per case-study-components.md):

- **Campaigns** — creation (a six-step flow pushing straight to Google Ads once approved), live performance against spend and lead volume.
- **Leads** — each contact from first touch through a quality score, a cohort profile and lifetime value, with an automatic satisfaction survey once a deal closes.
- **Interactions** — the social inbox: comments and messages from Facebook (Instagram and TikTok tabs scaffolded for later), assignable, flaggable for support, filterable and archivable.
- **Analytics** — cost-per-lead, CAC by product and by campaign, ad performance down to best time of day, and a CPC-to-CTR efficiency view, the whole reason the project existed.

---

## Section: Building the Plane While Flying It

**Phase Rail** (first real content to exercise this component, per the open question in case-study-components.md):

| # | Title | Timing | Outcome |
|---|---|---|---|
| 01 | Foundation, Discovery & Early Chaos | Months 1-3 | Core architecture validated, look and feel approved after 2-3 rounds of CEO pushback |
| 02 | Systematic Thinking Kicks In | Months 3-4 | Frontend onboarded with one approved screen; reusability became the only viable path |
| 03 | The Product Stopped Shifting | Months 4-8 | Leads dashboard shipped; the door-to-door disruption happened here too |
| 04 | Advancing Features | Months 9-14 | Campaigns dashboard shipped, Facebook API access secured, Google Ads integration landed |
| 05 | Proving the System | Months 15 | MVP ready for user testing; handoff approach greenlit company-wide |

Right-column body, pairing with the rail:

Competitor research came first, self-driven and cross-checked with the marketing lead: flows, features, look and feel, plus using an LLM to get up to speed on marketing terminology I didn't have. Look and feel had no direction from the CEO at all, so I put together broad mood-board explorations; after two or three rounds of pushback, the CEO sent over direct visual references, which finally gave the project a clear direction to approve against. The same meeting that approved the look and feel brought the frontend developer in and asked them to start immediately, on a library that at that point held only rough brand colours, rough text styles, a bento-box card layout and a borrowed material-symbols icon set.

That stage was genuinely stressful, worth naming rather than smoothing over: no product, no UX, no team to lean on; co-owning the roadmap and the architecture conversation with backend despite never having done that before; building a design system foundation because nobody else would, on top of a look and feel that was itself still rough; frontend waiting on deliverables while I was still unsure of the features, the information architecture, or half the marketing concepts I was designing for.

Two months in, the CEO asked for something unrelated: a lead-capturing tablet tool for an upcoming door-to-door campaign, needed in two weeks, built in Nuxt.js rather than JavaFX, with an explicit instruction that it carry no visual connection to this product's brand. It shipped on time, fed into the same backend being built for Marketing Management, and nobody (including the CEO) loved the UI, but it worked; it was later deprecated once the website's own quotation tool started covering that same lead-capture role.

**Image (small proof image, pairing row left slot):** the two hand-drawn brief sketches from the CEO, or the decision-framework diagram (`DECISION FRAMEWORK` image from NEW CREATINGS), whichever reads better next to this text.

---

## Section: Async by Necessity

**Split Panel** (before/after, genuinely equal comparison):
- Left: Input Field component, June 2024 handoff
- Right: Input Field component, June 2025 handoff (same component, full variants/states/styles, separate consulted library file)
- Caption: A year of maturing the handoff, same component both times.

Every handoff had to survive a 7-hour gap and a language barrier, so the process itself became the product. A "ready for dev" tag from design and a "mark as completed" tag from development replaced any need to ask whether something had shipped. Annotations covered component behaviour, data origin and pending-feature notes, sorted by category, so nothing needed a live explanation to make sense. Backend was never comfortable working inside Figma, so anything that needed sketching together happened in Miro instead.

---

## Section: Designing Against Someone Else's API

**Stage** (dark full-bleed section, width-capped carousel), preceded by a one-line `.case-pairing-row--text-only` intro:

> Getting social data in meant designing around Facebook's own API approval process rather than users first.

**Carousel panel — "Designing for API Review":**
1. Original Interactions/dashboard design (pre-API-revision)
2. Post-backend-revision dashboard, redesigned specifically to match Facebook's API review requirements
3. Comments view
4. Messages/Interactions inbox view

Caption: Images of the Facebook Interactions build, from original design through the version redesigned specifically for API review.

Body copy, right of or below the stage:

Early dashboard drafts had to be revised and resubmitted specifically to match what Facebook's API would actually grant access to, stripping out anything that might read as more than the review process was built to approve. Two versions were kept in parallel so work already done on features still waiting for access wasn't lost.

Once access came through, validating the inbox and comments views with the marketing lead surfaced a workflow gap worth its own write-up: **[read the Facebook-to-CRM pipeline case study →]** *(link only, not expanded here, per your call to keep that a standalone mini case study on its own page)*

---

## Section: Outcome

Fifteen months got the MVP to production-ready, built by a three-person team. Backend and I got CEO buy-in on the design system as a proof of concept around month 5-6; the buy-in to expand that approach into the rest of the company came later, around month 15.

The systematic, heavily annotated handoff process cut QA and design review rounds after development by roughly 90% against other projects at the company, by their own comparison rather than formal measurement. Reporting moved from a two-week lag to real time. The product ended up used in investor conversations, discussed there as an asset with white-label potential, and shown at company booths during developer events (see the Senapt conference-booth photo), neither of which was the brief when the project started.

**Full-bleed image candidate:** the Senapt conference booth photo.

---

## Footer: Learnings

I joined as a mid-level UI designer with no product or leadership experience. This project didn't leave room to learn that gradually; scoping, designing, shipping and revisiting all happened at once, with no clean handoff between them and no one else to default decisions to when something broke.

Not everything held. Priorities shifted, the door-to-door tablet detour ate two weeks nobody had budgeted, and acting as a one-person design team across UI, UX, systems and parts of project management meant there was no buffer between a decision and its consequences. What stuck wasn't a single feature or metric; it was learning to keep moving without the full picture, and growing into the responsibility by doing it rather than waiting for a title to arrive first.

---

## Project nav footer

← Previous project: TBD
Next project →: Design System from Scratch

---

## Build notes for whoever implements this

- **Phase Rail and Index Grid are both unverified in the component spec** (CSS exists, zero HTML usage anywhere for either). This page is the first real content for both; confirm each renders correctly, and check whether `.case-phase-row__toggle` / `.is-open` needs new JS or can reuse `accordion.js`, per the open question in `case-study-components.md`.
- **Index Grid's props shape is `{label, content}` per cell** in the spec; the four cells drafted here (Campaigns, Leads, Interactions, Analytics) map label → section name, content → the one-line description. Confirm that reads well at the component's actual cell width before treating the copy as final; it may need trimming further.
- **Image paths marked TBD** need real assets picked from `/mkm/` and the NEW CREATINGS folder before this ships; none are invented, all come from material you've already shared.
- **Issue number and Prev link** depend on where this page sits in your actual issue sequence; Design System's masthead hardcodes "Prev: Marketing Management" so whatever comes before this one needs to shift, not this link.
- **Theme colour**: pick one not already claimed by Design System (green) or Energy Tracker, per `theme_backgrounds` in the component spec.
- Facebook→CRM pipeline is deliberately thin here, one paragraph and a link out, not developed into its own section, per your call.
- **Async by Necessity's Split Panel** uses the June 2024 vs June 2025 Input Field handoff images; this is a genuine same-thing-twice comparison, which is what Split Panel is for, rather than a generic image pair.