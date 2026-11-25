---
name: connect-checklist
description: Connect a weekly checklist PDF to a week that is already on the study site, mapping each checklist line to the entries that teach it and filling any gaps. Use when the user runs /connect-checklist, or says a week's checklist is out for a week built without one (by /add-week-no-checklist).
argument-hint: <week number>
---

# Connect a checklist to a built week

N below is the week number: $ARGUMENTS

The week's entries already exist. This skill adds the checklist on top of them: the lines go in `week.js`, the keys go on the entries, and any line the site doesn't yet teach gets content. It has exactly one review stop (step 3). `CLAUDE.md` applies throughout. Any new content follows the build rules of `/add-week` (`.claude/skills/add-week/SKILL.md`, step 4).

## 1. Check the input
- `weeks/weekN/` must hold the checklist PDF, and `js/weeks/weekN/week.js` must exist. If either is missing, say which one and stop. If the week isn't built, suggest `/add-week N` instead.
- If `week.js` already has a non-empty `checklist`, stop. Ask whether to replace it (for example with a newer version of the checklist) or to leave it alone.

## 2. Read and map (no questions yet)
- Read the checklist. Also look at its rendered image, because symbols such as Σ, ², ≤ and arrows often extract badly. Copy each line's wording **exactly**. Give the course lines keys `wNc1`, `wNc2`… in checklist order (Week 1 alone uses `c1`…). Lines that are not course content (group 5) get no key, as in weeks 1 and 2.
- Read the week's entries (`js/weeks/weekN/part-a.js`, `part-b.js`, `week.js`) and `docs/CONTENT_INVENTORY.md`.
- For each checklist line, find the entries that teach it. Open the slides those entries cite to confirm that the entry really says what the line asks for, rather than just using the same words. Put each line in one of these groups:
  1. **Covered:** one or more entries teach all of it. Note the entry ids.
  2. **Partly covered:** entries exist, but a point the line names is missing from them (a proof, a complexity, a "why"). Say exactly what is missing and whether a slide states it.
  3. **On a slide, no entry:** a slide states it, but the site doesn't. This should be rare, because the week was built from all its slides. Check the `checklistNote` skip list first.
  4. **No slide states it:** following `w4c3`'s precedent, the default is to add the explanation to the closest entry, tagged `{{added}}`, and to say so in `checklistNote`.
  5. **Not course content:** forum sign-ups, notebooks, Mentimeter and similar lines. They get no key and no entry, and are named in `checklistNote`, as in weeks 1 and 2.
- Go the other way too: list the entries and slides that **no** checklist line covers. Nothing is removed from the site. Those are recorded as "Outside the checklist: …" in `checklistNote`, as in weeks 4 and 5.
- If the checklist names something taught in a different week, map it to that week's entries only if the week's other lines do the same. Otherwise raise it at the review stop.

## 3. The one review stop
Send one message, then wait for the reply. Do not edit before it.
- A table with one row per checklist line: key, the line (short), its group, and the entry ids it maps to.
- For each line in groups 2–4: what you propose to add, where, and whether it gets an `{{added}}` tag.
- The lines in group 5, and the entries and slides outside the checklist, with the `checklistNote` you will write.
- Anything only the user can decide, each with your recommendation, asked with AskUserQuestion. This includes a checklist line that seems to contradict a slide, which is never "fixed" silently.

## 4. Apply
- In `week.js`, replace `checklist: {}` with the keyed lines and rewrite `checklistNote`. Remove the "No checklist yet" sentence, keep the skip list, and add the group-5 lines and the outside-the-checklist material.
- Add `checklist: ['wNc…']` to every entry in the map. Recap cards get keys too, when they serve a line (as `w4-r-bfs` does). An entry that serves no line gets no field.
- Add the content for groups 2–4 by the build rules of `/add-week` step 4: cite its slides, use `[[links]]` to earlier terms, tag with `{{added}}` whatever no slide states, and give any new algorithm an animation and any new exercise computed answers, with checks in `tools/checks/weekN.js`.
- If the checklist makes a midterm fact-sheet item visible for the first time, update `midterm/midterm.js` and the notice in `midterm/index.html`.

## 5. Verify
1. `node tools/make-inventory.js`: **0 uncovered checklist items**, and no missing slides, bad references or missing images. Every key you wrote must appear with at least one entry in `docs/CONTENT_INVENTORY.md`.
2. `node tools/check-answers.js`, if any algorithm or exercise graph changed.
3. In Chrome, through `python3 -m http.server 4173 --bind 127.0.0.1`: the console has no errors and no `[terms]` messages, the checklist panel lists every line of week N with links to the right entries, the mapped entries show the "On the week N checklist" chip, and any new content renders, animates and gives feedback as `/add-week` step 5.3 requires.
4. **Content review.** `node tools/review-fingerprints.js check` will show the week's mapped entries as CHANGED, because their `checklist` field is part of the fingerprint. Review per `docs/CONTENT_REVIEW.md`. Build the pack only for the entries that changed: `node tools/review-pack.js N --entries id1,id2,…`. A checklist map is prose, so Reviewer P alone is enough, unless step 4 added exercises, graphs or algorithms; then add Reviewer C for those. The scope is narrower:
   - **the map:** each checklist line is copied exactly, and the entries mapped to it really teach it; no line is mapped to an entry that only mentions it; the `checklistNote` is true;
   - **new or changed text:** only what step 4 added, checked for all three questions (coverage, invention, truth).

   Tell the reviewers that the rest of the entries' text was already reviewed and is unchanged, so they should not review it again. Pass the week's Settled decisions from `docs/REVIEW_LOG.md`. Fix the agreed findings, settle the disputed ones, then rerun checks 1–3. Finish with the log's last step: `node tools/review-fingerprints.js record N "Week N, checklist connected"`, a row in **Reviews**, any new **Settled decisions**, and a final `check` that shows the week as UNCHANGED.

## 6. Report
Say:
- how many lines were connected, and how many fell in each group;
- what content was added, and which of it is tagged `{{added}}`;
- what is outside the checklist;
- what was tested;
- the review's findings: agreed and fixed, disputed and how each was decided, and dropped.

Give the link to the week's checklist panel.
