---
name: design
description: Design a screen, lesson or feature for the מתמטיקידס math app from one sentence. Builds several truly different working versions, picks one and explains why, the user (and the girls) decide, then a real browser check. Use for any design, mockup or prototype request, including Hebrew ones like "תעצב/תעצבי לי", "עיצוב", "כמה גרסאות", "תני לי אפשרויות", "איך זה ייראה".
---

# Design

Adapted for this project from the free `design-versions` skill by Brain
(https://github.com/Brain-ai-biz/design-versions, MIT, see LICENSE), which is an independent
write-up of the method Meaghan Choi, Claude Code's design lead, showed at Dive Club Live
(June 2026): one sentence in, several real versions out, Claude picks first and explains why,
a human decides, Claude verifies in a browser.

Her two points this version leans on hardest:
- **Claude is unopinionated, so the taste has to come from us.** Without a written design
  system every screen gets a new look. So this skill reads the project first and grows a
  design system as decisions are made (step 0 and step 4).
- **Quality decisions happen in live, working code**, not in pictures. Every version is a
  real page you can click through, and the final check is in a real browser.

Talk to the user in Hebrew (feminine forms). Usage: `/design <one sentence>`.
Optional number first: `/design 3 <sentence>` builds three versions instead of five.

## 0. Read the project before designing

Read `math-app/PROJECT.md` (audience, decisions, what is still open) and, if it exists,
`math-app/design/system.md` (decisions already made about look and feel). Glance at
existing screens in `math-app/` so new work fits what is there.

Fixed for every version unless the user says otherwise:
- Hebrew, `dir="rtl"`, fonts that include Hebrew glyphs, with a system fallback.
  Equations and numbers stay left-to-right inside RTL text (`direction:ltr; unicode-bidi:isolate`).
- Desktop first (laptop, mouse and keyboard). Check 1280px and 1024px wide; phone width is
  a nice-to-have, not a requirement.
- Children aged 8-9 who read but are not fluent: short sentences, a read-aloud button on
  instructions, big click targets (at least 48px), digits typeable from the keyboard.
- Feedback in the spirit of nonviolent communication: no scores, no red X, no timers or
  time pressure, mistakes answered with a next step, not a verdict.
- Parent-facing screens are separate in tone: plain, informative, a bit denser.

If `system.md` exists, its decisions are constraints for every version: vary only what it
leaves open, and say which items you varied. If something in it is marked open, it is
fair game.

## 1. One sentence is enough

From the sentence work out: what is being designed and its single job (what the child or
parent should do or understand), who uses it (child or parent), and the real content
(lesson topic, real exercises, real Hebrew text). No lorem ipsum: use real math content at
the right level. Don't send a questionnaire. State assumptions in two short lines and go.
Ask one question only when you can't tell what the subject is.

## 2. Several versions, not one

Default five; three if the user asked for three or the change is small (one component, a
tweak to an existing screen). Plan all directions before building. Give each a short Hebrew
name and a one-line concept. Use `reference/directions.md` to choose.

Difference contract: any two versions differ on at least three of layout skeleton, type
pairing, color world, density (sparse / airy / medium / dense), and the one signature element.
For lesson screens also vary **how the math is shown** (objects, ten-frames, number line,
story, game). If two plans look like siblings, replace one before building.

Avoid the looks that give AI design away (warm off-white + serif + orange accent; near-black
+ one neon; newspaper hairlines) and the kid-app cliché (rainbow everything, cartoon
mascot in every corner, confetti on every answer). Use them only if asked.

Every version is a complete, working, self-contained HTML file with real content: buttons
work, a right and a wrong answer both lead somewhere sensible, keyboard input works.

Where they go:
- `math-app/versions/<slug>/v1.html` ... `v5.html` plus `index.html`, a gallery showing all
  versions side by side (scaled iframes), each with its name, concept and an "open full
  size" link. Never overwrite an existing folder; use a new slug or `-2`.
- The user follows this work from the Claude app and can't open local HTML files. When the
  Artifact tool is available, publish the gallery as one artifact with the versions as its
  supporting files, so she gets a link she can open on any device. Republish to the same
  artifact after changes.

## 3. Claude picks first, and explains why

Pick the version that best serves the single job for these two girls. Three short reasons,
tied to the job, to how 8-9 year olds learn, and to the pedagogy in PROJECT.md, not to
taste. Name one thing worth borrowing from the runner-up. Write it to
`versions/<slug>/PICK.md` and mark the pick in the gallery.

Then hand over the decision. She can take the pick, choose another, or remix ("2 with the
buttons from 4"). Suggest that for child screens the girls themselves try the two finalists:
which one they reach for, where they hesitate. Their reaction outweighs everyone's taste.

## 4. Refine the chosen one, and remember the decision

Apply the choice as a new file (`v3b.html`), not five new options. Keep the direction's
identity. Small tweaks may be quicker for her by hand; say so when true.

Then record what was decided in `math-app/design/system.md` (create it if missing): colors
as tokens, fonts, sizes, spacing, radius, button and feedback styles, how math is shown,
and the tone of voice, each with a line on why. Mark what is still open. This is what keeps
the next screen from inventing a new look. Change existing entries only when the user
decided differently, and say so.

## 5. Check it in a real browser, then suggest improvements

Chromium and Playwright are usually available here. If they're not, say the check was not
run and never claim one you didn't do.

1. Open the chosen page at 1280px and 1024px.
2. Walk through it as a child would: mouse only, then keyboard only. Give a right answer, a
   wrong answer, a typical wrong answer (e.g. 7+5=15), and "I don't understand". Use every
   button. Look for broken layout, sideways scroll, console errors, and numbers or
   equations that read in the wrong order in RTL.
3. Check that text is short enough for a young reader and that nothing scolds or scores.
4. Fix what you found and check again.
5. Screenshot both widths and send them to the user. Record a short video of the
   walk-through if you can.
6. Suggest up to three improvements, each with what and why, tied to the single job. Apply
   only the ones she approves.

Report exactly what you checked and what you fixed.

## Checklist

- [ ] PROJECT.md and system.md read; constraints respected
- [ ] Assumptions in two lines
- [ ] 5 (or 3) versions that pass the difference contract, real content, all working
- [ ] Gallery file, and an artifact link when possible
- [ ] Pick + three reasons + one thing from the runner-up, in PICK.md
- [ ] Her decision applied to the chosen version only
- [ ] system.md updated with what was decided
- [ ] Browser check run and reported (or clearly marked not run), screenshots sent
- [ ] Up to three improvements, applied only if approved
