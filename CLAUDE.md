# CLAUDE.md

This repo started as the ihover CSS library. On this branch the active work is **מחברת אנגלית**, a Hebrew-interface English practice app for two homeschooled girls (ages 8 and 9), in `english-app/`. It turns the notes their English teacher writes into practice. (The math app, מתמטיקידס, lives on the branch `claude/math-learning-app-kids-xmvc4z`; the expert agents here were adapted from it.)

- Read `english-app/PROJECT.md` first: audience, decisions made, and what is still open. Don't treat open items as decided.
- Talk to the user in Hebrew, feminine forms.
- `english-app/index.html` is the source of the published artifact (https://claude.ai/artifact/QVDALBUYc1XKPFpsZZ2Uyq). Republish to that URL after changes; the girls' data lives in the artifact's database, not in the repo.
- Design work goes through the `/design` skill (`.claude/skills/design/`).

## Expert agents (`.claude/agents/`)

Reviewers that know this project. They advise; they don't edit files. Run them when the user asks, or offer them before a change ships.
- `kids-ux-expert`: how an 8-9 year old experiences a screen (attention, affordance, reading load, feedback placement).
- `english-teacher`: the English teaching (fit to the teacher's notes, practice order, spaced repetition, Hebrew speakers' typical mistakes, prompts that generate stories and questions).
- `kids-microcopy`: Hebrew text for the girls and the parent, NVC and growth-mindset tone; returns paste-ready text.
- `kid-tester`: walks a page in Chromium like an 8-year-old and reports confusion and bugs with screenshots.

The installed `education-agent-skills` plugin has pedagogy skills these agents can use (e.g. `retrieval-practice-generator`, `spaced-practice-scheduler`, `vocabulary-tiering-tool`).
