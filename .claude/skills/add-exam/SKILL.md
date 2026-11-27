---
name: add-exam
description: Add a past exam with its official solutions (a PDF in Exams/) to this study site as its own page, in Hebrew, with the solutions hidden behind an answer / "show solution" button and every solution visualized. Use when the user runs /add-exam, or asks to add an exam, a past exam, a midterm or a final with solutions to the site.
argument-hint: <path to the exam PDF, e.g. Exams/MidTermExams/mid05sol.pdf>
---

# Add a past exam

The exam PDF: $ARGUMENTS

The user supplies only the PDF. Do everything else yourself, with exactly one review stop (step 3). `CLAUDE.md` applies throughout. **`past-exams/mid04/` is the worked example**: its data file `past-exams/mid04/mid04.js`, its checks `tools/checks/exam-mid04.js`, and its entries in `docs/REVIEW_LOG.md`. Match its structure and depth.

## What the user asked for (do not drop any of it)
- **A page of its own** for each exam, like the midterm guide's page: `past-exams/<id>/index.html`, listed in `past-exams/index.html`. Never put pages under `Exams/`: that folder holds the source PDFs, is git-ignored, and on macOS `exams/` *is* `Exams/` (same folder, different case).
- **Hebrew, right to left**, in the exam's own words.
- **Answer first, then reveal:** the student picks an option (or נכון / לא נכון) and gets right/wrong feedback with an animation, which opens the solution. A "הצגת הפתרון" button always reveals it without answering.
- **The official solution is shown apart from everything the site adds.** The box "הפתרון הרשמי" holds only the underlined answer and the solution text (blue in the PDF), **word for word, even when it is imprecise or garbled**. No term links, edits or added words inside it, though formulas may be typeset as math. Problems in it get a ⚠️ callout *beside* the box, never a fix inside it. Every explanation the site adds is outside the box and tagged `{{added}}` (shown as "לא בפתרון הרשמי").
- **Every solution is visualized**, as on the rest of the site: algorithm animations with the lecture's pseudo-code, and exercise widgets with computed feedback.
- **Visualizations are left to right and use the page's full width** (the blank area too), while the Hebrew text keeps its reading width on the right. `css/exam.css` already does this. Check it on every new widget: nothing may be pushed out of view.
- **The exam gets the same full review as a week** (step 5): the review pack, two independent reviewers, the visual review and the log. **Never report the exam done before that review has run and its findings are fixed.**

## 1. Check the input
- The PDF must exist. If no path was given, list the PDFs in `Exams/` that have no page in `past-exams/` yet and ask which one. Never fill a gap from memory.
- It must contain the **solutions** (usually blue, with the right option underlined). If it is an exam without solutions, stop and ask the user: answers would have to be computed, not copied, and this skill doesn't cover that.
- Pick the id from the file name (`mid04sol.pdf` → `mid04`). If `past-exams/<id>/` exists, the exam is built: stop and say so.
- Pick the deck key: digits followed by **one** capital letter (the slide-ref regex in `js/render.js` is `\d*[A-Z]\d+`), e.g. the exam's year and `E`, giving `2004E`. It must not clash with an existing deck or `Exercises.graphs` key.

## 2. Read and prepare (no questions yet)
- Render the pages: `mkdir -p assets/exams/<id> && pdftoppm -png -r 110 <pdf> assets/exams/<id>/P`, plus a 160 dpi copy in the scratchpad for reading. **Read every page from the image.** `pdftotext` reverses parentheses and mixed Hebrew/Latin runs (it turned the exam's "B,A" into "A,B") and loses the blue color and the underlines. Use the text only to save typing, and correct it against the image.
- Transcribe every part header and instruction, every stem, every option, the underlined answer, and every official solution, plus the header, score table and closing line ("בהצלחה!") for the page's intro.
- For each question, note:
  - the topic and the weekly entries that teach it (for "נלמד ב:"), and the earlier terms to link as `[[term]]` in the stem and options (never inside the official box);
  - any drawing: it becomes an `Exercises.graphs` entry under `<deck><question>`, copied edge by edge. Name unnamed vertices and say on the page that the names are added;
  - how to visualize the answer. Reuse first: an existing animation with an exam-only preset, or an existing widget (the weekly true/false widgets `spClaims` and `fwClaims` take extra claim sets). Only then write a new widget. Where the exam gives no graph, build the smallest example that satisfies the question's premise and tag it as added;
  - problems in the official solution: wrong, garbled, relies on something not taught in weeks 1–N, true only under an unstated condition. **Verify each claim computationally where you can.** The 4-cycle of mid04's B1 only works with different neighbor orders, and this was found by enumerating every order.

## 3. The one review stop
Send one message, then wait for the reply. Do not build before it.
- A table: question, topic, the official answer, and the visualization proposed for each (reused or new; what the student does and sees).
- The problems found in the official solutions, each with the ⚠️ note you propose.
- The names and example graphs you will add.
- Anything only the user can decide, each with your recommendation (AskUserQuestion).

## 4. Build
Follow `past-exams/mid04/` exactly. The format is documented at the top of `js/exam.js`.
- `past-exams/<id>/index.html`: a copy of `past-exams/mid04/index.html` with this exam's title, header, score table and intro, and its own data file's script tag.
- `past-exams/<id>/<id>.js`: **data only**. `window.EXAM = { id, pdf, title, deck, deckInfo, parts, questions }`. Exam-only animation presets go here (`Algorithms.<algo>.presets.x<id>… = Object.assign(Algorithms.ssspPreset(key), …)` or a toposort-style object), so the weekly pages never list them. Mounts in `viz` use `data-lazy-ex` / `data-lazy-algo`, so they are mounted when the solution opens. Stem drawings use `<div class="ex-mount" data-ex="graphFigure" data-graph="<key>">` (add `data-tree` to draw a graph's `tree`).
- The exam's graphs go into `Exercises.graphs` in `js/exercises.js` (a block per exam, as for 2004). New widgets go into `js/exercises.js`, and their logic into `js/graph-logic.js` (under "Past exams"). Right and wrong answers are computed, never typed in. Every action gets an animation and a sentence saying what changed.
  - Floyd-Warshall numbers vertices by their **position in the `nodes` list**: list them 1..n.
- `tools/checks/exam-<id>.js` (same shape as `tools/checks/exam-mid04.js`): for every question, the answer key against what its visualization computes, plus every number the solution states. Write it before the visuals.
- Add the exam to `past-exams/index.html`.

## 5. Verify and review: everything must pass
1. `node tools/check-answers.js`: all passed, every week included. `node tools/make-inventory.js`: clean.
2. **Browser** (`python3 -m http.server 4173 --bind 127.0.0.1`, Claude in Chrome), on `http://127.0.0.1:4173/past-exams/<id>/`:
   - the console is clean (no errors, no `[exam]` messages);
   - open every solution (`document.querySelectorAll('.exam-show').forEach(b => b.click())`), then run `tools/visual-check.js` with `VisualCheck.run('X')`. Every animation runs to the end, back and forward match, 390px in light and dark mode, and nothing clipped;
   - **layout:** no `.exam-viz` content extends past its entry, and every visualization is visible without sideways scrolling;
   - `VisualCheck.sheet('X')`: compare every drawn graph with the exam's drawing, and every added example with its premise;
   - a right and a wrong answer on the option buttons, and a right and a wrong move in every widget, reading each sentence;
   - term hover cards, search, the page buttons, the slide viewer ("עמוד n מתוך m"), and the links to the weekly pages;
   - the weekly pages still load cleanly, and their widgets are unchanged.
3. **Content review** (`docs/CONTENT_REVIEW.md`, section "Past exams"), exactly as for a week:
   - `node tools/review-fingerprints.js check` and `node tools/review-pack.js exam <id>`. Clear `flags.md` yourself first;
   - two read-only `general-purpose` reviewers in parallel (`model: "haiku"`, `effort: "low"`): **Reviewer P** (prose: coverage of every page, word-for-word faithfulness of stems, options and official solutions, the official box holding nothing else, the answer line against the underline, `{{added}}` on everything else, truth of every ⚠️ note and explanation) and **Reviewer C** (code: copied graphs against the drawings, added examples against their premises, the checks' expected values against the PDF, every widget sentence and animation message, the logic comments). Give them the pack, the scope, and the exam's Settled decisions, saying these were made by the builder and may be challenged if false;
   - consultation: send every **false** finding, and any you doubt, to the other reviewer (SendMessage to the same agent);
   - fix what is agreed, decide disputes from the evidence, and ask the user about anything still unclear. Then rerun checks 1–2.
4. **Log** (`docs/REVIEW_LOG.md`): a Settled decisions subsection for the exam (the ⚠️ notes, the added names and examples, anything decided), a Reviews entry with one row per finding, then `node tools/review-fingerprints.js record exam:<id> "<title>" [the exercise and logic functions and files touched]`. `check` must show nothing CHANGED or NEW.

## 6. Report
Say what was added, the visualization of each question, and the problems found in the official solutions. Report the content review: findings per category, what was agreed and fixed, disputed and how decided, dropped. Say what could not be tested. Motion can't be judged from still frames, so list the animations with links and ask the user to watch them. Close the tab you opened. Give the link and ask for changes.
