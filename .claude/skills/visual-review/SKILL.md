---
name: visual-review
description: Review how one built week of the study site looks and behaves in the browser - animations, width and dark mode, drawn graphs against the slide drawings, exercise feedback, and for weeks 1-6 the midterm page - then fix what is wrong and log it. Use when the user runs /visual-review, or asks to check a week's visualizations, animations or graphs.
argument-hint: <week number>
---

# Visual review of one week

N below is the week number: $ARGUMENTS

The content review (`docs/CONTENT_REVIEW.md`) checks the text against the slides. This skill checks what the text review can't see: what the page draws and how it behaves. It runs in the main session, with no subagents and no review stop. `CLAUDE.md` applies throughout.

## 0. Check the input
- `js/weeks/weekN/` must exist. If it doesn't, say the week isn't built and stop.
- Read the week's **Settled decisions** in `docs/REVIEW_LOG.md`, and any earlier visual review of week N there. Don't raise those again.
- `node tools/check-answers.js` must pass before you start.

## 1. Automated check
1. Start `python3 -m http.server 4173 --bind 127.0.0.1` (in the background) if it isn't running, and open `http://127.0.0.1:4173/index.html` in a new Chrome tab (Claude in Chrome).
2. Load and run `tools/visual-check.js` with the javascript tool, as its header says, with `VisualCheck.run(N)`. If the browser has cached old scripts, fetch each changed one with `fetch(url, {cache: 'reload'})` and reload.
3. Read the console (pattern `error|\[terms\]`): it must be clean.

Everything marked `BAD`, `no verdict`, `DIFFERENT` or overflowing is a finding. If the script itself fails on a view it doesn't know, fix the script (keep it general, not week-specific), and run it again.

## 2. Drawn graphs against the slides
1. List every graph the week draws: the presets of each animation mount and the `Exercises.graphs` the week's exercises use (`flags.md` of `node tools/review-pack.js N` lists the mounts).
2. Screenshot each one on the page. To save screenshots, gather them into one sheet first: a fixed overlay that holds a copy of each graph's SVG, with its key as a caption, then take one or two screenshots of the sheet.
3. Open the slide PNG of each (`assets/slides/weekN/…`) and compare: the vertices, edges, directions, weights and labels, and roughly the layout. Each finding names the slide and the graph key.
4. Also look for overlapping labels, unreadable text, and anything on the drawing the slide doesn't have (names, weights, edges). Anything added has to be tagged `{{added}}` or noted as added on the page.

## 3. Exercises by hand
For every exercise the script lists, make one right move and one wrong move in the page, and read the feedback. Feedback has to be true, say what changed, and come with an animation. Note any case you can't reach from the page (say why) and check it in the code instead.

## 3b. The midterm page (weeks 1–6 only)
`Exams/mid-term_guide.pdf` covers weeks 1–6. **If N is 7 or more, skip this step** and say in the report that the midterm doesn't cover the week.

For N from 1 to 6:
1. **Coverage against the guide.** Open the guide's pages (the images, since its symbols don't survive text extraction). For every fact-sheet item that week N teaches, check that:
   - its line in `midterm/midterm.js` (`sheet`) says what the guide says;
   - the line links to the week N entries that teach it;
   - those entries are in `sections`, and so are week N's exercises on those topics (Practice).

   A guide item that week N teaches but the page lacks is a finding.
2. **The page itself.** Open `http://127.0.0.1:4173/midterm/index.html` and run `VisualCheck.run(N)` there. On this page it checks only the week N entries the midterm page shows. Read its console too: no errors, no `[terms]` and no `[midterm] Unknown entry ids` messages.
3. **Look at it.** Screenshot the week N entries on the midterm page. Slide images and links to entries not on this page must work, since the page lives one folder down.
4. Try one right and one wrong move in each week N exercise in Practice.

## 4. Fix and recheck
- Fix every finding. If the fix changes what the page teaches (beyond tagging something `{{added}}` or fixing an obvious bug), ask the user first.
- Then run `node tools/make-inventory.js`, `node tools/check-answers.js`, the script from step 1 and the console check again, on the midterm page too for weeks 1–6. Everything must pass.
- If content changed, re-record the week's fingerprints (`node tools/review-fingerprints.js record N "<title of the week's last content review>"`), then `node tools/review-fingerprints.js check` must show nothing CHANGED.
- Close the tab you opened.

## 5. Log it
Add a review to the top of **Reviews** in `docs/REVIEW_LOG.md`, titled `### <date>: Week N, visual review`, with:
- **Scope:** the entries, the number of animation runs, the graphs compared, the exercises tried, and the midterm items checked (weeks 1–6).
- **Checked and found correct:** what passed.
- **Not testable from the page:** each case, and how it was checked instead.
- One table row per finding (number V1, V2…, kind, finding, decision), each row on one line.

Add any decision not to fix something to the week's **Settled decisions**, with its reason.

## 6. Report
Tell the user:
- the results of steps 1–3b, with the count of findings and what was fixed;
- what couldn't be tested and why;
- **motion**, which no screenshot can judge: list the week's animations (entry title and link `http://127.0.0.1:4173/index.html#e-<entry id>`) and ask the user to watch them and say what feels too fast, jumpy or unclear.
