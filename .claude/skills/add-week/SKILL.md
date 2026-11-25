---
name: add-week
description: Add a new week of the Algorithms course to this study site from the PDFs in weeks/weekN/. Needs the checklist, lecture and recitation. Use when the user runs /add-week or asks to add a week. Without a checklist, use /add-week-no-checklist; to add a checklist to a built week, use /connect-checklist.
argument-hint: <week number>
---

# Add a week to the study site

N below is the week number: $ARGUMENTS

The user supplies only the PDFs. Do everything else yourself, with exactly one review stop (step 3). `CLAUDE.md` applies throughout. `js/weeks/week1/` is the worked example: match its depth, tone and structure.

## 1. Check the input
`weeks/weekN/` should hold the week's checklist, lecture and recitation PDFs. If no week number was given, the folder is empty, or one of the three is missing, say exactly what is missing and stop. If only the checklist is missing, suggest `/add-week-no-checklist N`. Never fill a gap from memory.

## 2. Read and prepare (no questions yet)
- Read the checklist, then every page of every lecture and recitation. Look at the rendered image of any page with a drawing, code or a worked example, because text extraction loses those.
- Save the slide images: `docs/SLIDE_IMAGES.md`.
- List every definition, theorem and algorithm in taught order, Lecture first, then Recitation. Map every checklist line to an entry. A checklist line with no entry is a bug.
- Find what earlier weeks already defined (the `terms` in `js/weeks/*/`). Those are linked with `[[term]]`, never defined again.
- For each algorithm, note the pseudo-code and every output the slides state.
- Note: slide errors and contradictions (confirm against the image), checklist items no slide states, material on the slides but not on the checklist, easy-to-miss points, and any algorithm the existing views can't show (they draw a graph, arrays, lists and a queue or stack).

## 3. The one review stop
Send one message, then wait for the reply. Do not build before it.
- The entry list: number, title, slides, type (definition, algorithm, exercise, recap).
- Each algorithm and what its animation will show. If one doesn't fit the existing views, describe the new visual you propose, give your recommendation, and ask the user to approve it or choose another.
- The exercises you propose: what the student does, and which slides the graphs come from.
- Slide problems: slide, issue. The default is to show the slide unchanged with a ⚠️ note beside it.
- Material outside the checklist: ask whether to include it, listing each item.
- Anything else only the user can decide, each with your recommendation. Ask these with AskUserQuestion.

## 4. Build
Files, in `js/weeks/weekN/`: `terms.js`, `part-a.js`, `part-b.js`, and `week.js`, which calls `addWeek` (format at the top of `js/course.js`). Add their script tags to `index.html` after the previous week and before `search-logic.js`, in that order. Script tags for new algorithms go after the existing `js/algorithms/` ones.

Naming, which must be unique across all weeks. For week 2: slide decks `2L` and `2R`, checklist keys `w2c1`…, entry ids `w2-…`. Copy the checklist's wording exactly.

What the user requires of every week:
- **Nothing from the checklist is missing**, and everything appears in the order it was taught. Recitation items already taught become short recap cards with `recap: true`.
- **Every entry ends with its slides.** Check each slide before citing it.
- **Readable:** definition boxes, highlighter on key ideas, underlines on easy-to-miss conditions.
- **Every earlier term is a `[[link]]`,** including terms from earlier weeks.
- **Every algorithm gets a smooth step animation** with the lecture's own pseudo-code, each line highlighted whenever it runs: `docs/ALGORITHM_ANIMATION.md`. Set `algo: true` for the sidebar badge.
- **Exercises must be correct and faithful to the slides; the user calls this super important.** Graphs are copied from the slides, right and wrong answers are computed in `js/graph-logic.js`, and every action the student takes gets an animation and a sentence saying what changed. Add graphs to `Exercises.graphs` under the slide's reference (for example `'2L12'`). The existing exercises have Week 1's graphs listed inside them, so extend them to accept other graphs rather than copying them.
- **Nothing invented.** Anything the slides don't state is tagged `{{added}}`.

Write `tools/checks/weekN.js` (same shape as `tools/checks/week1.js`) with every output the slides state. Do this before building the visuals for an algorithm.

## 5. Verify: everything must pass
1. `node tools/make-inventory.js`: no missing slides, bad references, missing images or uncovered checklist items.
2. `node tools/check-answers.js`: all passed, earlier weeks included.
3. In Chrome, through `python3 -m http.server 4173 --bind 127.0.0.1`:
   - the console has no errors and no `[terms]` messages;
   - `tools/visual-check.js` (how to load it is at its top) runs the next three checks and lists the exercises to try: every animation runs to the end, and stepping backward matches stepping forward;
   - every exercise gives the right feedback on a right move and a wrong move;
   - search finds the new terms, and the new week's hover links work, including links to earlier weeks;
   - earlier weeks still render;
   - dark mode and 390px width have no sideways scrolling.

   Fix what fails and run the checks again.
4. **Independent content review (required, every week).** Once checks 1–3 pass, review **only week N**, the week just added. Earlier weeks are not re-reviewed. Follow `docs/CONTENT_REVIEW.md` exactly:
   - prepare: run `node tools/review-fingerprints.js check` and `node tools/review-pack.js N`, and clear `flags.md` yourself;
   - two read-only reviewers who split the work: Reviewer P checks the prose against the pack, and Reviewer C checks the code, graphs and expected values against the slide images;
   - consultation only for "false" findings and any you doubt;
   - settle the rest, then update `docs/REVIEW_LOG.md`.

   Give the reviewers the pack's path, the week's checklist keys, the Settled decisions, and the NEW/CHANGED items (`flags.md` lists them). Together they answer three questions: is everything from the slides on the site, is anything stated that no slide states without an `{{added}}` tag, and is anything false.
   Fix every agreed finding. Settle the disputed ones as the doc says, and ask the user about any you can't settle. Then rerun checks 1–3. Don't report to the user before this review has finished and its findings are handled.

## 6. Report
Say what was added, what was tested, and what could not be tested. Include the content review: how many findings in each category, which were agreed and fixed, which were disputed and how each was decided, and which were dropped. Motion smoothness can't be judged from still frames, so ask the user to look at the new animations. Give the link and ask for changes.
