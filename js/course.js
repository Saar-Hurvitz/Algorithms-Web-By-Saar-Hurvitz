/* ==========================================================================
   course.js — collects the weeks. Each js/weeks/weekN/week.js calls addWeek()
   once; the page is built from the merged COURSE in render.js.

   addWeek({ n, title, checklistNote?, decks, checklist, terms, parts })
     decks       { L: { name: 'Lecture 1', kind: 'Lecture', count: 80, path: 'assets/slides/week1/lecture/L-', wide: false } }
                 Week 1 uses the keys L and R. Later weeks start with the week
                 number: 2L, 2R. Keep the key equal to what entries cite.
     checklist   { c1: 'text' }. Week 1 uses c1…; later weeks w2c1, w3c1…
     terms       every linkable term: { id: { name, short, slide, aliases } }
     parts       [{ id, title, sub, entries: [...] }], in teaching order
   Term ids, entry ids, deck keys and checklist keys must be unique across all
   weeks, so a clash stops that week from loading with an error in the console.

   Writing an entry body (use String.raw`…` so LaTeX backslashes survive;
   never write the two characters "$" + "{" next to each other):
     <dfn data-term="vertex">vertices</dfn>   defines a term (must exist in terms)
     [[vertex]] / [[vertex|nodes]]            link to an EARLIER term (hover card + jump)
     ==key idea==                              highlighter mark
     !!every!!                                 underline for an easy-to-miss condition
     {{L34}} / {{R13}} / {{2L34}}              inline button that opens that slide
     {{added}}                                 tag for anything the slides don't state
     <span class="nt">leaves</span>           a word that is not the earlier term of the same
                                               spelling (leaves Q, the source s): the link check skips it
     $x$ inline math, $$x$$ display math       rendered by KaTeX
   Boxes: <div class="box definition"><span class="box-label">Definition</span>…</div>
          <div class="box theorem">…</div> + <details class="proof"><summary>Proof</summary>…</details>
   Callouts: <aside class="callout intuition|caution|example|checklist">
              <span class="callout-title">…</span><p>…</p></aside>
   Entry fields: id, title, slides, checklist, html, algo, exercise, recap, init
   ========================================================================== */
window.COURSE = { weeks: [], decks: {}, checklist: {}, terms: {}, parts: [] };

window.addWeek = week => {
  const C = window.COURSE;
  const fail = msg => { throw new Error(`Week ${week.n}: ${msg}`); };
  const merge = (target, items, what) => {
    for (const key in items) {
      if (key in target) fail(`${what} "${key}" already exists in an earlier week`);
      target[key] = items[key];
    }
  };
  merge(C.decks, week.decks, 'slide deck');
  merge(C.checklist, week.checklist, 'checklist item');
  merge(C.terms, week.terms, 'term');

  const usedIds = new Set(C.parts.flatMap(p => p.entries.map(e => e.id)));
  for (const part of week.parts) {
    for (const e of part.entries) {
      if (!e) fail(`${part.title} lists an entry that does not exist`);
      if (usedIds.has(e.id)) fail(`entry id "${e.id}" is already used`);
      usedIds.add(e.id);
      e.week = week.n;
    }
  }
  C.weeks.push(week);
  C.parts.push(...week.parts.map(p => ({ ...p, week: week.n })));
};
