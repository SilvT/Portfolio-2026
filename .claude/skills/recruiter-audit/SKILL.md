---
name: recruiter-audit
description: Audits portfolio pages and case studies from the perspective of a hiring manager with 6 seconds to scan. Use when asked to review portfolio layout, check case study scannability, assess first impressions, or reduce reader friction.
---

# Skill: 6-Second Recruiter & Hiring Manager Audit

## Goal
Evaluate the target file (`index.html` or case study) for instant scannability, title positioning, and friction-free navigation for Design Technologist roles.

## Process Steps
1. **Analyze Above-the-Fold Content (0–3 seconds):**
   - Is the candidate explicitly identified as a **Design Technologist** (or hybrid UI/Engineering role)?
   - Is the core tech stack (HTML, Sass, JS, Figma) visible without scrolling?
2. **Inspect Narrative Structure (3–6 seconds):**
   - Is there a **TL;DR project card** containing: *My Role* (solo/team), *Tech Stack*, *Key Outcome*, and *Live Demo / GitHub links*?
   - Are section headers descriptive (e.g., *"Reducing SCSS Bundle Size by 35%"*) rather than generic (e.g., *"Code"* or *"Process"*)?
3. **Identify Friction Points:**
   - Are there missing live preview links, dead Figma links, or buried code repositories?
   - Is there "wall of text" syndrome (paragraphs longer than 3–4 lines)?

## Evaluation Criteria
- **Pass:** Reader understands who you are, what you built, how you coded it, and the result within 6 seconds.
- **Fail:** Reader has to hunt through long prose to figure out whether you designed it, coded it, or both.

## Output Format
Return feedback strictly structured as follows:

```markdown
### ⏱️ 6-Second Recruiter Verdict: [PASS / FAIL]

**Above-the-Fold Impression:**
[1-2 sentences on what a hiring manager registers in the first 3 seconds]

**Key Friction Points:**
- ❌ **[Location]**: [Issue detail]
- ❌ **[Location]**: [Issue detail]

**Actionable Scannability Fixes:**
1. **[Section]**: Replace "[Current Copy/Layout]" with "[Improved Actionable Copy/Layout]".
2. **[Links]**: [Fix link visibility or call-to-action prominence].