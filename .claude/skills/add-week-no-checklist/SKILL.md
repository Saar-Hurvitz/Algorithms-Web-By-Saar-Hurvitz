---
name: add-week-no-checklist
description: Add a new week of the Algorithms course to this study site from only its lecture and recitation PDFs in weeks/weekN/, before the weekly checklist exists. Use when the user runs /add-week-no-checklist, or asks to add a week whose checklist isn't out yet. The checklist is connected later with /connect-checklist.
argument-hint: <week number>
---

# Add a week without its checklist

N below is the week number: $ARGUMENTS

This is `/add-week` (`.claude/skills/add-week/SKILL.md`) for a week whose checklist isn't out yet. Everything in that skill still applies, except the parts about the checklist, which are replaced below. Since no checklist says what matters, **the slides decide on their own**: every slide with content gets an entry, or is named as skipped (title, "Quiz Time", an exact duplicate, a repeat in Hebrew) along with the reason. When the checklist arrives, `/connect-checklist N` maps it onto the entries built here.

The user supplies only the PDFs. Do everything else yourself, with exactly one review stop (step 3). `CLAUDE.md` applies throughout. `js/weeks/week1/` is the worked example: match its depth, tone and structure.

## 1. Check the input
`weeks/weekN/` must hold the week's lecture and recitation PDFs.
- If no week number was given, the folder is empty, or the lecture or recitation is missing, say exactly what is missing and stop. Never fill a gap from memory.
- If the folder also holds a checklist PDF, stop and tell the user to run `/add-week N`, which uses it.
- If `js/weeks/weekN/` already exists, the week is built. Stop and say so, and suggest `/connect-checklist N` if a checklist was the thing they wanted to add.

## 2. Read and prepare (no questions yet)
- Read every page of the lecture and recitation. Look at the rendered image of any page with a drawing, code or a worked example, because text extraction loses those.
- Save the slide images: `docs/SLIDE_IMAGES.md`.
- List every definition, theorem and algorithm in taught order, Lecture first, then Recitation.
- **Map every slide to an entry.** Do this in place of the checklist map. A slide with content and no entry is a bug, unless it is on the skip list with a reason.
- Find what earlier weeks already defined (the `terms` in `js/weeks/*/`). Link those with `[[term]]`. Never define them again.
- For each algorithm, note the pseudo-code and every output the slides state.
- Note slide errors and contradictions (confirm each against the image), easy-to-miss points, and any algorithm the existing views can't show. The views draw a graph, arrays, lists and a queue or stack.
- Check whether this week teaches a midterm fact-sheet item: Dijkstra, Bellman-Ford, Floyd-Warshall, or shortest paths in acyclic graphs (see the Midterm section of `CLAUDE.md`).

## 3. The one review stop
Send one message, then wait for the reply. Do not build before it.
- Say first that this week is being built **without a checklist**, so everything on the slides is included.
- The entry list: number, title, slides, type (definition, algorithm, exercise, recap).
- The skipped slides, each with its reason.
- Each algorithm and what its animation will show. If one doesn't fit the existing views, describe the new visual you propose, give your recommendation, and ask the user to approve it or choose another.
- The exercises you propose: what the student does, and which slides the graphs come from.
- Slide problems: slide and issue. The default is to show the slide unchanged with a ⚠️ note beside it.
- Anything else only the user can decide, each with your recommendation. Ask these with AskUserQuestion. Don't ask whether to include material "outside the checklist": with no checklist, everything is in.

## 4. Build
Files go in `js/weeks/weekN/`: `terms.js`, `part-a.js`, `part-b.js`, and `week.js`, which calls `addWeek` (the format is at the top of `js/course.js`). Add their script tags to `index.html` after the previous week and before `search-logic.js`, in that order. Script tags for new algorithms go after the existing `js/algorithms/` ones.

What differs from `/add-week` because there is no checklist:
- In `week.js`, write `checklist: {}`. Leave out neither the field nor the braces, because `render.js` and `make-inventory.js` read it.
- Give the entries **no** `checklist` field. `/connect-checklist` adds them later.
- Use `checklistNote` to record the week's state and the skipped slides, in the style of the earlier weeks. For example: `'No checklist yet; connect it with /connect-checklist N. Slides 6L1 and 6L14 (title, "Quiz Time") have no content.'`

Naming must be unique across all weeks. For week 6: slide decks `6L` and `6R`, entry ids `w6-…`. Later, checklist keys will be `w6c1`….

What the user requires of every week (as in `/add-week`):
- **Nothing from the slides is missing**, and everything appears in the order it was taught. Recitation items already taught become short recap cards with `recap: true`.
- **Every entry ends with its slides.** Check each slide before citing it.
- **Readable:** definition boxes, highlighter on key ideas, underlines on easy-to-miss conditions.
- **Every earlier term is a `[[link]]`,** including terms from earlier weeks.
- **Every algorithm gets a smooth step animation** with the lecture's own pseudo-code, each line highlighted whenever it runs: `docs/ALGORITHM_ANIMATION.md`. Set `algo: true` for the sidebar badge.
- **Exercises must be correct and faithful to the slides; the user calls this super important.** Copy graphs from the slides, compute right and wrong answers in `js/graph-logic.js`, and give every student action an animation and a sentence saying what changed. Add graphs to `Exercises.graphs` under the slide's reference (for example `'6L12'`). Extend the existing exercises to accept other graphs rather than copying them.
- **Nothing invented.** Tag anything the slides don't state with `{{added}}`.
- **Midterm page:** if the week teaches a fact-sheet item, add its entry ids to `midterm/midterm.js` and update the notice in `midterm/index.html`.

Before building the visuals for an algorithm, write `tools/checks/weekN.js` (same shape as `tools/checks/week1.js`) with every output the slides state.

## 5. Verify: everything must pass
1. `node tools/make-inventory.js`: no missing slides, bad references or missing images. "Uncovered checklist items" is trivially 0 for this week, so it proves nothing here. Coverage rests on your slide → entry map instead: go through it once more against the generated `docs/CONTENT_INVENTORY.md`.
2. `node tools/check-answers.js`: everything passes, earlier weeks included.
3. In Chrome, through `python3 -m http.server 4173 --bind 127.0.0.1`:
   - the console has no errors and no `[terms]` messages;
   - `tools/visual-check.js` (how to load it is at its top) runs the next three checks and lists the exercises to try: every animation runs to the end, and stepping backward matches stepping forward;
   - every exercise gives the right feedback on a right move and on a wrong move;
   - search finds the new terms, and the new week's hover links work, including links to earlier weeks;
   - earlier weeks still render, and the checklist panel shows the new week's heading with no lines, without errors;
   - dark mode and 390px width have no sideways scrolling.

   Fix whatever fails and run the checks again.
4. **Independent content review (required).** This is the same review as `/add-week` step 5.4, run on week N only and following `docs/CONTENT_REVIEW.md` exactly:
   - prepare: run `node tools/review-pack.js N` and clear its `flags.md`;
   - Reviewer P checks the prose and Reviewer C the code;
   - consultation only where needed, then settlement;
   - `docs/REVIEW_LOG.md` is read first and updated at the end.

   Tell both reviewers that **the week has no checklist yet**. Coverage is judged against the slides alone, and none of them should report missing checklist keys. Reviewer P confirms the skipped slides: the "Slides no entry cites" list in `flags.md`, against the `checklistNote`. Fix every agreed finding, settle the disputed ones as the doc says, and ask the user about any you can't settle. Then rerun checks 1–3. Don't report to the user before this review has finished and its findings are handled.

## 6. Report
Say:
- what was added and that it has no checklist yet;
- what was tested and what could not be tested;
- the content review: how many findings in each category, which were agreed and fixed, which were disputed and how each was decided, and which were dropped.

Motion smoothness can't be judged from still frames, so ask the user to look at the new animations. Give the link and ask for changes. End with: once the checklist is out, put it in `weeks/weekN/` and run `/connect-checklist N`.
