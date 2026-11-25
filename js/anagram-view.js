/* ==========================================================================
   AnagramView: animation of the master's solution (slides 21-24).
   Uses the same Player and code panel as the graph animations.
   ========================================================================== */
window.AnagramView = (function () {
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mount(host) {
    host.innerHTML = `
      <div class="algo ana" tabindex="-1">
        <div class="algo-setup">
          <label class="algo-field">Input word W <select data-r="word"></select></label>
          <div class="chapters" data-r="chapters"></div>
        </div>
        <div class="algo-transport">
          <button type="button" data-r="restart">Restart</button>
          <button type="button" data-r="back">Step back</button>
          <button type="button" class="primary" data-r="play">Play</button>
          <button type="button" data-r="next">Step forward</button>
          <button type="button" data-r="end">End</button>
          <input type="range" min="0" value="0" step="1" data-r="scrub" aria-label="Position in the run">
          <span class="algo-count" data-r="count"></span>
          <label class="algo-field speed">Speed <input type="range" min="0.5" max="4" step="0.25" value="1" data-r="speed"><output data-r="speedOut"></output></label>
        </div>
        <div class="algo-msg" data-r="msg" aria-live="polite"></div>
        <div class="ana-grid">
          <div class="algo-code"><div class="code-inner" data-r="code"><div class="code-bar" data-r="bar"></div></div></div>
          <div>
            <div class="ana-query"><span class="ana-slot"><b>W</b> <code data-r="w">–</code></span><span class="ana-slot"><b>X</b> <code data-r="x">–</code></span><span class="vars" data-r="vars"></span></div>
            <div class="ana-table" data-r="table"></div>
            <p class="strip-name">Output</p>
            <div class="strip ana-out" data-r="out"></div>
          </div>
        </div>
        <p class="algo-keys">Keyboard: ← and → step through the run, space plays and pauses. Click inside the animation first.</p>
      </div>`;
    const R = {};
    host.querySelectorAll('[data-r]').forEach(e => { R[e.dataset.r] = e; });
    const root = host.querySelector('.algo');
    const A = Algorithms.anagram;
    A.words.forEach(w => { const o = document.createElement('option'); o.value = o.textContent = w; R.word.appendChild(o); });

    const panel = AlgoView.codePanel(R.code, R.bar);
    let run, rowEls = {}, chapterBtns = [];

    const player = new Player({
      root, restart: R.restart, back: R.back, play: R.play, next: R.next, end: R.end,
      scrub: R.scrub, speed: R.speed, speedOut: R.speedOut, count: R.count,
    }, { onRender: render, onPlayState: on => R.msg.setAttribute('aria-live', on ? 'off' : 'polite') });

    function rebuild() {
      run = A.build(R.word.value);
      panel.build(run.code, run.sections);
      R.table.innerHTML = `<div class="ana-row ana-head"><span></span><span>Word</span><span>Signature</span></div>`;
      rowEls = {};
      A.dictionary.forEach(w => {
        const d = document.createElement('div');
        d.className = 'ana-row'; d.dataset.word = w;
        d.innerHTML = `<span class="ana-mark"></span><span class="ana-word">${[...w].map(c => `<i>${c}</i>`).join('')}</span><span class="ana-sig"></span>`;
        rowEls[w] = d; R.table.appendChild(d);
      });
      R.chapters.innerHTML = '';
      chapterBtns = run.sections.map(s => {
        const idx = run.frames.findIndex(f => f.line >= s.from && f.line <= s.to);
        const b = document.createElement('button');
        b.type = 'button'; b.textContent = s.title; b.dataset.from = s.from; b.dataset.to = s.to;
        b.addEventListener('click', () => { player.pause(); player.go(idx); root.focus({ preventScroll: true }); });
        R.chapters.appendChild(b);
        return b;
      });
      player.load(run.frames);
    }
    R.word.addEventListener('change', rebuild);

    function render(f, i, prev, delay) {
      const ms = Math.max(140, Math.min(420, delay * .6));
      panel.show(f, ms);
      chapterBtns.forEach(b => b.classList.toggle('active', f.line >= +b.dataset.from && f.line <= +b.dataset.to));
      R.msg.textContent = f.msg;
      R.msg.classList.toggle('ok', !!(f.result && f.result.ok));
      R.msg.classList.toggle('fail', !!(f.result && !f.result.ok));
      R.w.textContent = f.W || '–'; R.x.textContent = f.X || '–';
      R.vars.innerHTML = f.vars.map(v => `<code>${v}</code>`).join('');

      /* Rows reorder with a FLIP when the dictionary gets sorted */
      const first = {};
      for (const w in rowEls) { rowEls[w].getAnimations().forEach(a => a.cancel()); first[w] = rowEls[w].getBoundingClientRect(); }
      f.rows.forEach(r => R.table.appendChild(rowEls[r.word]));
      f.rows.forEach((r, idx) => {
        const row = rowEls[r.word];
        const sigEl = row.querySelector('.ana-sig');
        const sigText = r.sig || '';
        if (sigEl.textContent !== sigText) sigEl.innerHTML = [...sigText].map(c => `<i>${c}</i>`).join('');
        row.classList.toggle('cur', f.cur === idx);
        row.classList.toggle('mid', f.mid === idx);
        row.classList.toggle('out-range', f.lo != null && (idx < f.lo || idx > f.hi));
        row.classList.toggle('in-class', f.classFrom != null && idx >= f.classFrom && idx <= f.classTo);
        const mark = [];
        if (f.lo === idx) mark.push('low'); if (f.mid === idx) mark.push('mid'); if (f.hi === idx) mark.push('high');
        row.querySelector('.ana-mark').textContent = mark.join(' ');
        if (reduced()) return;
        const last = row.getBoundingClientRect();
        const dy = first[r.word].top - last.top;
        if (dy) row.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: ms * 1.8, easing: 'cubic-bezier(.3,.7,.2,1)' });
        if (f.justSig === idx && i > prev) {
          /* Letters fly from the word into their sorted positions */
          const letters = [...row.querySelectorAll('.ana-word i')];
          const free = letters.map(l => ({ ch: l.textContent, r: l.getBoundingClientRect() }));
          [...sigEl.children].forEach(ch => {
            const k = free.findIndex(x => x.ch === ch.textContent);
            const src = free.splice(k, 1)[0], dst = ch.getBoundingClientRect();
            ch.animate([{ transform: `translate(${src.r.left - dst.left}px,${src.r.top - dst.top}px)` }, { transform: 'none' }], { duration: ms * 1.6, easing: 'cubic-bezier(.3,.7,.2,1)' });
          });
        }
      });
      const outText = f.output.join('|');
      if (R.out.dataset.v !== outText) {
        R.out.dataset.v = outText;
        R.out.innerHTML = f.output.map(w => `<span class="token word in-out">${w}</span>`).join('');
        if (!reduced()) [...R.out.children].forEach((t, k) => t.animate([{ opacity: 0, transform: 'translateY(-12px)' }, { opacity: 1, transform: 'none' }], { duration: ms, delay: k * 90, fill: 'backwards', easing: 'ease-out' }));
      }
    }
    rebuild();
  }
  return { mount };
})();
