---

### 2. `.claude/skills/impact-booster/SKILL.md`

```markdown
---
name: impact-booster
description: Transforms draft case study bullet points into high-impact value statements using the XYZ formula while preserving personal speaking voice. Use when rewriting project achievements, polishing case studies, or highlighting technical outcomes.
---

# Skill: Impact & Metrics Reframing Coach

## Inputs Required
- Draft text or raw bullet points from the user.
- User voice guidelines (reads from your `.claude/skills/my-voice/` or voice references if available).

## Process Steps
1. **Identify Core Achievement:**
   - Extract the technical action (e.g., writing Sass mixins, building a design token system, coding a JS prototype).
2. **Apply Google's XYZ Formula:**
   - Reframe into: **"Accomplished [X] as measured by [Y] by doing [Z]"**.
   - If exact numbers ($Y$) aren't provided by the user, estimate directional metrics (e.g., *"reduced build complexity," "improved keyboard navigation speed," "cut redundant CSS"*).
3. **Bridge Design + Engineering:**
   - Highlight how engineering decisions improved the UX, design fidelity, or developer workflow.
4. **Enforce Voice & Persona Constraints:**
   - Check output against your personal voice style. Remove corporate fluff (e.g., *"leveraged synergies"*). Keep it grounded, technical, and direct.

## Output Format
For each bullet point, output:

```markdown
### Original Draft:
> "[User's input text]"

#### Option A: Tech & Architecture Focused (XYZ Formula)
* [Rewritten bullet emphasizing code quality, Sass structure, or JS logic]

#### Option B: UX & Product Impact Focused (XYZ Formula)
* [Rewritten bullet emphasizing user interaction, WCAG compliance, or design fidelity]

#### Option C: Balanced & Scannable (Best for Portfolio Case Study)
* [Concise version optimized for quick scanning]