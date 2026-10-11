# CLAUDE.md

This repo started as the ihover CSS library; active work is **מתמטיקידס**, a Hebrew math-learning app for two homeschooled girls (ages 8 and 9), in `math-app/`.

- Read `math-app/PROJECT.md` first: audience, decisions made, and what is still open. Don't treat open items as decided.
- Talk to the user in Hebrew, feminine forms.
- Design work goes through the `/design` skill (`.claude/skills/design/`).

## Expert agents (`.claude/agents/`)

Reviewers that know this project. They advise; they don't edit files. Run them when the user asks, or offer them before a change ships.
- `kids-ux-expert`: how an 8-9 year old experiences a screen (attention, affordance, reading load, feedback placement).
- `math-teacher`: the math teaching (sequence, CPA representations, exercise choice, misconceptions, hints).
- `kids-microcopy`: Hebrew text for the girls and the parent, NVC and growth-mindset tone; returns paste-ready text.
- `kid-tester`: walks a page in Chromium like an 8-year-old and reports confusion and bugs with screenshots.

The installed `education-agent-skills` plugin has pedagogy skills these agents can use (e.g. `cpa-sequence-designer`, `progressive-hint-ladder`, `learning-progression-builder`).
