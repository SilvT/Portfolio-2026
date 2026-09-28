---

### 3. `.claude/skills/ux-checker/SKILL.md`

```markdown
---
name: ux-checker
description: Audits HTML markup, Sass stylesheets, and JS for semantic structure, WCAG 2.1 AA accessibility, and interaction state completeness. Use when reviewing code files, checking for div soup, or auditing focus states and ARIA attributes.
---

# Skill: Semantic HTML, Sass & Accessibility Auditor

## Goal
Ensure the portfolio code itself serves as undeniable proof of your technical craftsmanship as a Design Technologist.

## Audit Rules

### 1. HTML & Semantics
- **No Div Soup:** Reject nested `<div>` wrappers where semantic elements (`<main>`, `<section>`, `<article>`, `<nav>`, `<aside>`) should be used.
- **Heading Order:** Enforce strict sequential order (`<h1>` $\rightarrow$ `<h2>` $\rightarrow$ `<h3>`). Never skip levels for styling purposes.
- **Images & Media:** All `<img>` tags must have descriptive `alt` text or `alt=""` if purely decorative.

### 2. Sass / SCSS Architecture
- **Interactive States:** Verify that every interactive element (`a`, `button`, `input`) defines explicit `:hover`, `:focus-visible`, and `:active` pseudo-classes in the Sass source code.
- **Color Contrast:** Verify that text variables vs background variables pass WCAG AA (4.5:1 ratio for normal text, 3:1 for large text).
- **Reduced Motion:** Ensure key CSS animations/transitions respect `@media (prefers-reduced-motion: reduce)`.

### 3. JS & ARIA
- Ensure custom toggles or modals include appropriate `aria-expanded`, `aria-controls`, or `role` attributes.

## Output Format
Generate a Markdown report:

```markdown
### 🛠️ Code & UX Audit Summary

| File & Line | Category | Severity | Current Issue | Recommended Fix |
| :--- | :--- | :--- | :--- | :--- |
| `index.html:24` | Semantics | High | `div.nav` used instead of `<nav>` | Replace with `<nav aria-label="Primary">` |
| `_buttons.scss:12` | A11y / Sass | Medium | Missing `:focus-visible` state | Add custom outline mixin to `:focus-visible` |

**Code Refactoring Snippet:**
[Provide the corrected Sass/HTML block ready to copy-paste]