---

### 4. `.claude/skills/ats-parser/SKILL.md`

```markdown
---
name: ats-parser
description: Optimizes portfolio text and resume copy against Applicant Tracking Systems and Design Technologist keyword benchmarks. Use when tailoring portfolio text for job applications, checking ATS keyword density, or converting HTML content to plain text.
---

# Skill: ATS Keyword & Resume Optimizer

## Goal
Ensure job parsers and technical recruiters recognize your target skillset (Design Systems, UI Engineering, Rapid Prototyping) without getting tripped up by complex layouts.

## Keyword Benchmarks for Design Technologists
Ensure the text naturally incorporates terms across three critical buckets:
1. **Design & Systems:** Design Tokens, Figma, Component Libraries, Micro-interactions, Wireframing, WCAG 2.1 AA, Responsive Design.
2. **Front-End Architecture:** Sass/SCSS, BEM/CSS Architecture, Vanilla JS, HTML5 Semantics, DOM Manipulation, Git/GitHub, Performance Optimization.
3. **Hybrid Workflow:** Rapid Prototyping, Design-to-Code Handoff, Cross-functional Collaboration, User Testing, Technical Feasibility.

## Process Steps
1. Parse input markdown, HTML, or resume text.
2. Measure keyword match density against the benchmark buckets above (or against a user-provided job description).
3. Identify structural parsing risks (e.g., multi-column grids or missing plain-text fallbacks).
4. Generate a clean, single-column plain text export optimized for copy-pasting into ATS text boxes.

## Output Format

```markdown
### 📊 ATS Optimization Report

- **Estimated Keyword Match Score:** [0–100%]
- **Missing Priority Keywords:** [List of 3–5 high-value DT terms missing from the text]

### 🚨 Layout & Parser Warnings
- [Warning about HTML/CSS structure that might fail plain-text extraction]

### 📄 ATS-Clean Plain-Text Export
[Insert a clean, single-column Markdown/Plain-Text version of the content here]