# Content review: website vs. slides

An independent check that newly added site content matches the course PDFs. It is run by subagents with no stake in the content they check, so they report what they find instead of explaining it away.

The review is built to be cheap and reliable:
- **A script prepares the inputs once** (`tools/review-pack.js`), so the reviewers read three files instead of extracting every slide themselves.
- **The mechanical checks are done before the reviewers start:** answers by `tools/check-answers.js`, unsourced sentences and stray numbers by the review pack.
- **The two reviewers split the work, they don't repeat it:** one checks the prose, the other the code.
- **Consultation is only for what is in doubt.**

## When it runs
**Only after new information is added to the site**: a new week (`/add-week`, `/add-week-no-checklist`), a connected checklist (`/connect-checklist`), or new entries, terms, exercises, graphs or algorithms added to an existing week. It reviews **only what was just added or changed**. Content that was already reviewed and is unchanged is never reviewed again, and the review is never run on the whole site.

## 1. Prepare (main session)
1. `node tools/review-fingerprints.js check`. Keep from the scope only what is **CHANGED** or **NEW**; UNCHANGED items were reviewed and have not been edited since. Read the **Settled decisions** of the week in `docs/REVIEW_LOG.md`.
2. `node tools/check-answers.js` must pass. The reviewers rely on it, so they don't recompute runs, matrices or distances by hand.
3. `node tools/review-pack.js N` for a whole week, or `node tools/review-pack.js N --entries id1,id2` for some entries only. It writes `.review-pack/weekN/`:
   - `slides.md`: the text of every slide in scope. **LOOK** marks a slide with a picture, a drawing, a table or math symbols, where text extraction may lose something. For example, `pdftotext` drops the Δ of 6L8 and the ∉ of 6L40.
   - `entries.md`: every entry as numbered sentences, each with its source:
     - `[cites X]`: the sentence cites slide X itself;
     - `[inherits X]`: its paragraph, box or table cites X;
     - `[added]`: it is tagged `{{added}}`;
     - `[NO SOURCE]`: it has none of these.

     `NUM?` lists numbers that appear in none of those slides' text.
   - `flags.md`: the NO SOURCE and NUM? sentences, the ⚠️ notes, the animations and exercises mounted, the slides no entry cites, the LOOK slides, and the NEW/CHANGED fingerprints.
4. **Clear `flags.md` yourself before spawning anyone.** These fixes are cheap, and they keep the reviewers on what needs judgement.
   - Every `[NO SOURCE]` sentence that states course content gets its citation or `{{added}}`. A link or an introduction ("Lecture 6 opens by reviewing Lecture 5") can stay as it is.
   - For every `NUM?`, decide which case it is:
     - a computed value: tag it `{{added}}`;
     - a number the extraction lost: check the PNG;
     - a wrong number: fix it.

   Then run the pack again.

## 2. Two reviewers, split by kind
Both reviewers are `general-purpose` subagents spawned with **`model: "haiku"` and `effort: "low"`**, in parallel, and both are **read-only**. Each one reads `CLAUDE.md`, this file and `docs/REVIEW_LOG.md`.

Give both of them:
- the path of the review pack;
- the scope (the week, or which entries are new or changed);
- the week's Settled decisions, which are not to be reported again;
- whether the week has a checklist. Without one, coverage is judged against the slides alone and no one reports missing checklist keys.

Number the findings P1, P2… and C1, C2….

**Reviewer P: the prose.** Reads `flags.md`, `entries.md` and `slides.md`. It does not open the code.
- **Coverage:** goes through `slides.md` slide by slide and finds where `entries.md` covers each one. It lists anything missing: a definition, a claim, a proof step, a pseudo-code line, an example and its stated result, a bound, an exercise and its solution, a remark. Every slide in "Slides no entry cites" must be a title, a quiz, admin, or a duplicate named in the week's `checklistNote`. If a checklist exists, every line maps to an entry that teaches it.
- **Invention:** for every `[cites X]` and `[inherits X]` sentence, asks whether slide X states it. This is where untagged material hides: explanations, "why" sentences, the results of runs, and summaries stronger than the slide. If X doesn't state it, the sentence needs `{{added}}`. Definitions must mean exactly what the slide says, no stronger and no weaker.
- **Truth:** checks that every sentence is true, tagged or not, and that every ⚠️ note is right about the slide.

**Reviewer C: the code.** Reads `flags.md` (the animations and exercises mounted, and the NEW/CHANGED items) and the code those items point to.
- **Copied from the slides:**
  - every `code` array and `<pre>` block against the slide PNG, line for line;
  - every new `Exercises.graphs` entry against the slide drawing, edge for edge: vertices, directions, weights, and any list order the site says the slide gives.
- **Expected values:** every `eq(...)` in `tools/checks/weekN.js` that names a slide. It confirms that the slide really states that value, so the computed answers are compared with the slides and not with themselves. It does not recompute what the checks already verify.
- **Truth:** every exercise feedback sentence and animation message, in every case, including wrong moves and edge cases. Every claim a logic function's comment makes. Every `{{added}}` graph that is labeled as added on the page.

**Rules for both reviewers:**
- Read only: do not edit any file.
- **Before reporting that a slide says or lacks something, open its PNG** (`assets/slides/weekN/…`) whenever the slide is marked LOOK or the finding is "false". Text extraction loses symbols, superscripts and drawings.
- Each finding gives:
  - the slide reference;
  - the site location (entry id and sentence number, or file and function);
  - a quote of the site text, under 25 words;
  - what the slide actually says.
- Sort the findings: **false**, then **invented (untagged)**, then **missing**, then **minor** (for example, a citation one slide off). Don't report style or wording preferences.
- If a category has no findings, say so, and say what you checked.
- End with one paragraph: what was checked, and the count per category. Keep the report under 900 words.

## 3. Consultation, only where needed
The two reviewers cover different ground, so their findings rarely overlap. The main session first checks each finding against the slide or the code itself, then:
- **Fixes directly** every untagged, missing or minor finding it confirms.
- **Sends to the other reviewer** (SendMessage to the same agent, so it keeps its context) only:
  - every finding of kind **false**;
  - every finding the main session doubts;
  - findings the two reviewers made about the same sentence that disagree.

  The other reviewer answers each one, re-checking the slide image or the code: **agree, must fix**; **disagree**, with the evidence (a slide reference and quote, or a file and line); or **agree, but fix differently**, with the better fix. It may also withdraw its own findings.
- **Settles** the rest. Fix what is agreed. Decide what is disputed from the evidence, and put anything still unclear to the user instead of fixing it silently. Drop what its own author withdraws.

The final report to the user lists: agreed and fixed, disputed and how each was decided, and dropped.

## After the settlement (main session)
Fix every agreed finding, and every disputed one decided as "fix". Tell the user about every finding that was dropped or decided against, and why. Then rerun `node tools/make-inventory.js`, `node tools/check-answers.js` and `node tools/review-pack.js N` (`flags.md` should be clear), and check the browser console, as in `/add-week` step 5.

## Last step: update the review log
Every review ends by updating `docs/REVIEW_LOG.md`, **after** the fixes, so the fingerprints match the fixed content:
1. `node tools/review-fingerprints.js record <week> "<review title>" [extra items]`. The week's entries, terms and graphs are recorded automatically. Add as extra items the exercise and logic functions and the files this review covered, e.g. `exercise:spByHand logic:dijkstraRun file:js/algorithms/sssp.js file:tools/checks/week5.js`. For a review of one changed entry, record that week again: unchanged items keep their hash.
2. Add the review at the top of **Reviews**: the date and title, the scope, what was checked and found correct, the skipped slides, and one table row per finding (number, kind, finding, decision). Keep each row to one line.
3. Add to **Settled decisions** every dispute that was decided, every finding that was dropped, and every ⚠️ slide note, each with its reason in one or two sentences, so the next reviewer does not raise it again.
4. Run `node tools/review-fingerprints.js check`: the items just reviewed must show as UNCHANGED.
