# Algorithms study website

A study site for the Algorithms course, one section per week, all on one page. Each week's source PDFs (checklist, lecture, recitation) are in `weeks/weekN/`.

Plain HTML/CSS/JS with no build step and no ES modules, so `index.html` opens directly from disk. Open it, or run `npx serve`.

## Rules
- Order: within a week, all of the Lecture first (Part A), then the Recitation (Part B). Recitation items already taught become short recap cards that link back.
- Every entry ends with its slides: `docs/SLIDE_IMAGES.md`.
- Every algorithm gets a step animation with the lecture's pseudo-code highlighted line by line: `docs/ALGORITHM_ANIMATION.md`.
- Readability is a requirement: definition boxes, highlighter marks on key ideas, underlines on easy-to-miss conditions. The writing syntax is documented at the top of `js/course.js`.
- Any earlier-defined term used in a later entry, from any week, is written `[[term]]` (hover shows the definition, click jumps to it). After editing, open the browser console: `render.js` reports missing, forward-pointing or forgotten links.
- Exercises (`js/exercises.js`) use graphs copied from the slides. Right and wrong answers are computed by `js/graph-logic.js`, never typed in by hand, and every user action gets an animation and a sentence saying what changed.
- Each week's content is in `js/weeks/weekN/`; its `week.js` sets the order. `docs/CONTENT_INVENTORY.md` is generated from them with `node tools/make-inventory.js`, which also reports missing slides and uncovered checklist items.
- After changing an algorithm or exercise graph, run `node tools/check-answers.js`. It compares every computed answer with what the slides state (`tools/checks/weekN.js`).
- Don't invent course content. If a slide doesn't state something, tag it with `{{added}}`.

## Workflow
To add a week, the user puts its PDFs in `weeks/weekN/` and runs `/add-week N` (`.claude/skills/add-week/SKILL.md`). It has one review stop: wait for the user's approval of the entry list and open questions before building.
If the checklist isn't out yet, `/add-week-no-checklist N` builds the week from the lecture and recitation alone (every slide gets an entry, `checklist: {}`). Once the checklist arrives, `/connect-checklist N` maps its lines onto the existing entries and fills any gaps.
After a week is built, its new content is reviewed against its PDFs (`docs/CONTENT_REVIEW.md`):
- `node tools/review-pack.js N` prepares the inputs and flags unsourced sentences;
- two subagents split the work, one on the prose and one on the code;
- they consult each other only on what is in doubt.

The review asks three questions: is everything on the slides on the site, is nothing stated without a slide or an `{{added}}` tag, and is nothing false. Its findings are fixed before the week is reported done. Every review reads and then updates `docs/REVIEW_LOG.md`: fingerprints of what was reviewed (`node tools/review-fingerprints.js check` shows what changed since), the findings, and the settled decisions not to re-raise.
`/visual-review N` (`.claude/skills/visual-review/SKILL.md`) checks a built week in the browser: animations, width and dark mode (`tools/visual-check.js`), drawn graphs against the slide drawings, and exercise feedback, plus the midterm page for weeks 1–6. It logs to the same file.

## Midterm page
`midterm/index.html` shows the entries that `Exams/mid-term_guide.pdf` asks for, in the fact sheet's order. `midterm/midterm.js` lists them by entry id: it reuses the weekly entries, never copies them. When a week that teaches a fact-sheet item is added (Dijkstra, Bellman-Ford, Floyd-Warshall, shortest paths in acyclic graphs), add its entry ids there and update the notice in `midterm/index.html`.
