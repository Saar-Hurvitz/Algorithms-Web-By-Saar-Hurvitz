/* ==========================================================================
   exam.js: one page per past exam (past-exams/<id>/index.html), shared by all exams.
   Loaded after every js/weeks/ file and the exam's data file (window.EXAM),
   and before render.js, like midterm/midterm.js. It keeps the decks and terms
   of all weeks, adds the exam's scanned pages as a deck, and replaces the weeks
   and parts with the exam's parts, one entry per question.

   window.EXAM = {
     id, pdf: 'Exams/…/file.pdf', title, deck: '2004E',                      // deck key: digits + one capital letter
     deckInfo: { name, kind, unit, of, count, path, wide },   // unit/of: words for 'slide'/'of' in captions
     parts: [{ id, kind: 'mc' | 'tf', title, sub, note }],
     questions: [{
       id, part, title, page: '2004E2',             // the exam page it is on
       stem, options: [...], answer: 1 | true,      // mc: option index; tf: true / false
       solution,                                    // the official (blue) text, word for word
       notes?, explain?,                            // the site's: ⚠️ callouts and {{added}} text
       viz,                                         // data-lazy-ex / data-lazy-algo mounts
       taught: [entry ids on the weekly pages],
     }],
   }
   The solution is hidden until the student answers or presses "show solution";
   its visualizations are mounted only then, so their layout is measured while visible.
   ========================================================================== */
(function () {
  const C = window.COURSE, X = window.EXAM;
  const byId = Object.fromEntries(C.parts.flatMap(p => p.entries).map(e => [e.id, e]));

  /* This page is two folders down, so the weekly slide images are two levels up */
  for (const k in C.decks) C.decks[k] = Object.assign({}, C.decks[k], { path: `../../${C.decks[k].path}` });
  C.decks[X.deck] = X.deckInfo;

  const T = {
    show: 'הצגת הפתרון', hide: 'הסתרת הפתרון', official: 'הפתרון הרשמי', answerIs: 'התשובה:',
    right: 'נכון! זו התשובה של הפתרון הרשמי.', wrong: 'לא בדיוק. התשובה הנכונה מסומנת.',
    vizTitle: 'הדמיה', taught: 'נלמד ב:', tf: ['נכון', 'לא נכון'], answers: 'תשובות',
  };
  const answerIndex = q => (typeof q.answer === 'boolean' ? (q.answer ? 0 : 1) : q.answer);
  const optionsOf = q => q.options || T.tf;

  function html(q) {
    const opts = optionsOf(q), ans = answerIndex(q);
    const taught = q.taught.map(id => `<a href="#e-${id}">${byId[id] ? byId[id].title : id}</a>`).join(' · ');
    return String.raw`
<div class="exam-q" dir="rtl">
  <div class="exam-stem">${q.stem} {{${q.page}}}</div>
  <div class="exam-options ${q.options ? 'mc' : 'tf'}" role="group" aria-label="${T.answers}">
    ${opts.map((o, i) => `<button type="button" class="exam-opt" data-i="${i}"><span class="exam-mark" aria-hidden="true"></span><span>${o}</span></button>`).join('')}
  </div>
  <p class="exam-feedback" aria-live="polite"></p>
  <button type="button" class="exam-show" aria-expanded="false">${T.show}</button>
  <div class="exam-solution" hidden>
    <div class="box solution">
      <span class="box-label">${T.official} {{${q.page}}}</span>
      <p class="exam-answer">${T.answerIs} <strong>${opts[ans]}</strong></p>
      <p class="exam-official">${q.solution}</p>
    </div>
    ${q.notes || ''}
    ${q.explain || ''}
    <div class="exam-viz" dir="ltr">${q.viz || ''}</div>
    <p class="exam-taught">${T.taught} ${taught}</p>
  </div>
</div>`;
  }

  function init(q) {
    return sec => {
      const box = sec.querySelector('.exam-q'), sol = box.querySelector('.exam-solution');
      const showBtn = box.querySelector('.exam-show'), fb = box.querySelector('.exam-feedback');
      const ans = answerIndex(q);
      let mounted = false;
      const reveal = open => {
        sol.hidden = !open;
        showBtn.setAttribute('aria-expanded', String(open));
        showBtn.textContent = open ? T.hide : T.show;
        if (open && !mounted) {
          mounted = true;
          sol.querySelectorAll('[data-lazy-ex]').forEach(m => {
            try { Exercises[m.dataset.lazyEx](m); } catch (err) { console.error(`[exam] ${q.id} exercise failed:`, err); }
          });
          sol.querySelectorAll('[data-lazy-algo]').forEach(m => {
            try {
              AlgoView.mount(m, Algorithms[m.dataset.lazyAlgo], { mode: m.dataset.mode, preset: m.dataset.preset, presets: m.dataset.presets, modes: m.dataset.modes });
            } catch (err) { console.error(`[exam] ${q.id} animation failed:`, err); }
          });
        }
        if (open && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) sol.animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'ease-out' });
      };
      showBtn.addEventListener('click', () => reveal(sol.hidden));
      box.querySelector('.exam-options').addEventListener('click', ev => {
        const b = ev.target.closest('.exam-opt');
        if (!b) return;
        const i = +b.dataset.i, ok = i === ans;
        box.querySelectorAll('.exam-opt').forEach(o => {
          o.classList.toggle('picked', o === b);
          o.classList.toggle('right', +o.dataset.i === ans);
          o.classList.toggle('wrong', o === b && !ok);
          o.setAttribute('aria-pressed', String(o === b));
        });
        fb.textContent = ok ? T.right : T.wrong;
        fb.classList.toggle('ok', ok); fb.classList.toggle('fail', !ok);
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          b.animate(ok ? [{ transform: 'scale(1)' }, { transform: 'scale(1.04)' }, { transform: 'scale(1)' }]
            : [0, -6, 6, -4, 4, 0].map(x => ({ transform: `translateX(${x}px)` })), { duration: 340 });
        }
        reveal(true);
      });
    };
  }

  const bad = X.questions.flatMap(q => q.taught).filter(id => !byId[id]);
  if (bad.length) console.error('[exam] Unknown entry ids in "taught":', bad.join(', '));

  C.sourceParts = C.parts; /* the weekly grouping, kept for tools/visual-check.js */
  C.weeks = [{ n: 'X', label: X.deckInfo.kind, title: X.title, checklist: {}, links: {} }];
  C.parts = X.parts.map(p => ({
    id: p.id, title: p.title, sub: p.sub, week: 'X',
    entries: X.questions.filter(q => q.part === p.id).map((q, k) => ({
      id: q.id, title: q.title, slides: [q.page], exercise: true, week: 'X',
      html: (k === 0 && p.note ? `<p class="exam-part-note">${p.note}</p>` : '') + html(q),
      init: init(q),
    })),
  }));
  C.mainPage = '../../index.html';
  C.stripTitle = 'מתוך המבחן';
  C.addedText = 'לא בפתרון הרשמי';
  C.addedTitle = 'הסבר שנוסף לאתר. הפתרון הרשמי והשקפים לא אומרים זאת.';
})();
