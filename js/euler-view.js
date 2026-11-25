/* ==========================================================================
   EulerView: draws an Euler or De Bruijn run from its frames.
   Uses the same Player and code panel as the other animations. Differs from
   AlgoView because a vertex repeats in a tour, edges can be parallel or loops,
   and the lists hold a 0/1 bit per cell (slide 2L24).
   EulerView.mount(el, Algorithms.euler)
   ========================================================================== */
window.EulerView = (function () {
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';

  function mount(host, cfg) {
    host.innerHTML = `
      <div class="algo eu" tabindex="-1">
        <div class="algo-setup">
          <label class="algo-field">Example <select data-r="preset"></select></label>
          <div class="algo-switches" data-r="switches"></div>
          <div class="chapters" role="group" aria-label="Jump to a part of the algorithm" data-r="chapters"></div>
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
        <div class="algo-grid">
          <div class="algo-code"><div class="code-inner" data-r="code"><div class="code-bar" data-r="bar"></div></div></div>
          <div class="algo-graph" data-r="graph"></div>
          <div class="algo-strips">
            <div class="strip-block"><p class="strip-name">Current walk</p><div class="strip eu-strip" data-r="sub"></div></div>
            <div class="strip-block"><p class="strip-name" data-r="tourName">Tour</p><div class="strip eu-strip" data-r="tour"></div></div>
            <div class="strip-block" data-r="lettersBlock" hidden><p class="strip-name">First letters</p><div class="strip eu-strip" data-r="letters"></div></div>
            <div class="vars" data-r="vars"></div>
          </div>
          <div class="algo-arrays eu-lists" data-r="lists"></div>
        </div>
        <p class="algo-keys">Keyboard: ← and → step through the run, space plays and pauses. Click inside the animation first.</p>
      </div>`;
    const R = {};
    host.querySelectorAll('[data-r]').forEach(e => { R[e.dataset.r] = e; });
    const root = host.querySelector('.algo');
    let presetId = cfg.defaultPreset;
    const swState = {};
    (cfg.switches || []).forEach(sw => { swState[sw.id] = sw.defaultFor(); });
    let run, gv, rows = [], link = null, tokens = new Map(), chapterBtns = [];
    const panel = AlgoView.codePanel(R.code, R.bar);

    for (const id in cfg.presets) {
      const o = document.createElement('option');
      o.value = id; o.textContent = cfg.presets[id].title;
      R.preset.appendChild(o);
    }
    R.preset.value = presetId;
    R.preset.addEventListener('change', () => { presetId = R.preset.value; rebuild(); });
    if (Object.keys(cfg.presets).length < 2) R.preset.closest('label').hidden = true;

    (cfg.switches || []).forEach(sw => {
      const wrap = document.createElement('div');
      wrap.className = 'algo-field';
      wrap.innerHTML = `<span>${sw.label}</span><div class="seg small" role="group" aria-label="${sw.label}">${sw.options.map(o => `<button type="button" data-sw="${sw.id}" data-val="${o.id}">${o.label}</button>`).join('')}</div>`;
      R.switches.appendChild(wrap);
    });
    const syncSwitches = () => R.switches.querySelectorAll('button[data-sw]').forEach(b => b.setAttribute('aria-pressed', String(swState[b.dataset.sw] === b.dataset.val)));
    R.switches.addEventListener('click', e => {
      const b = e.target.closest('button[data-sw]');
      if (!b) return;
      swState[b.dataset.sw] = b.dataset.val;
      rebuild(); root.focus({ preventScroll: true });
    });

    const player = new Player({
      root, restart: R.restart, back: R.back, play: R.play, next: R.next, end: R.end,
      scrub: R.scrub, speed: R.speed, speedOut: R.speedOut, count: R.count,
    }, { onRender: render, onPlayState: on => R.msg.setAttribute('aria-live', on ? 'off' : 'polite') });

    function rebuild() {
      run = cfg.build(presetId, 'run', swState);
      syncSwitches();
      panel.build(run.code, run.sections);
      R.graph.innerHTML = '';
      const edges = GraphView.autoBend(run.edges.map(e => ({ ...e, loopAngle: run.loops[e.from] })));
      gv = GraphView.create(R.graph, {
        nodes: run.nodes.map(([id, x, y]) => ({ id, x, y, label: id })), edges, width: 500, height: 290, r: 21,
        directed: run.directed, edgeLabels: run.hasWords, ariaLabel: run.title,
      });
      run.added.forEach(i => { gv.edgeEl(`e${i}`).dataset.extra = '1'; });

      R.lists.innerHTML = `<p class="strip-name">Adjacency lists: each cell holds a neighbor and its 0/1 traced bit</p>` + run.ids.map((id, v) => `
        <div class="eu-row" data-v="${v}">
          <span class="vlabel">${id}</span>
          ${run.lists[v].map((c, k) => `<span class="cell eu-cell" data-k="${k}"><span>${c.label}</span><b class="bit">0</b></span><span class="link" aria-hidden="true">→</span>`).join('')}
          <span class="cell nul" data-k="${run.lists[v].length}">null</span>
        </div>`).join('');
      rows = [...R.lists.querySelectorAll('.eu-row')];
      link = document.createElementNS(NS, 'svg');
      link.setAttribute('class', 'eu-link'); link.setAttribute('aria-hidden', 'true');
      link.innerHTML = '<line></line>';
      R.lists.appendChild(link);

      tokens.forEach(t => t.remove()); tokens = new Map();
      R.letters.innerHTML = '';
      R.lettersBlock.hidden = !run.hasLetters;
      R.tourName.textContent = 'Tour';

      R.chapters.innerHTML = '';
      chapterBtns = run.sections.length < 2 ? [] : run.sections.map(s => {
        const idx = run.frames.findIndex(f => f.line >= s.from && f.line <= s.to);
        const b = document.createElement('button');
        b.type = 'button'; b.textContent = s.title; b.dataset.from = s.from; b.dataset.to = s.to;
        b.addEventListener('click', () => { player.pause(); player.go(idx); root.focus({ preventScroll: true }); });
        R.chapters.appendChild(b);
        return b;
      });
      player.load(run.frames);
    }

    /* Vertices fly between the walk and the tour; a new one flies out of the graph */
    function placeTokens(f, ms) {
      const first = new Map();
      tokens.forEach((t, k) => { t.getAnimations().forEach(a => a.cancel()); first.set(k, t.getBoundingClientRect()); });
      const want = new Map();
      f.tour.forEach(t => want.set(t.key, { box: R.tour, t }));
      f.sub.forEach(t => want.set(t.key, { box: R.sub, t }));
      tokens.forEach((el, k) => { if (!want.has(k)) { el.remove(); tokens.delete(k); } });
      const put = (t, box) => {
        let el = tokens.get(t.key);
        if (!el) {
          el = document.createElement('span');
          el.className = `token eu-tok tk${((t.sub % 4) + 4) % 4}`;
          el.textContent = run.ids[t.v];
          tokens.set(t.key, el);
        }
        box.appendChild(el);
      };
      f.tour.forEach(t => put(t, R.tour));
      f.sub.forEach(t => put(t, R.sub));
      if (reduced()) return;
      want.forEach(({ t }, k) => {
        const el = tokens.get(k), last = el.getBoundingClientRect();
        const from = first.get(k) || gv.nodeEl(run.ids[t.v]).getBoundingClientRect();
        const dx = from.left - last.left, dy = from.top - last.top;
        if (dx || dy) el.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: ms, easing: 'cubic-bezier(.3,.7,.2,1)' });
      });
    }

    /* The "same edge" pointers of 2L24: a line between the two cells of the edge just traced */
    function drawLink(f) {
      const line = link.querySelector('line');
      const m = f.scan && f.scan.mate;
      if (!m) { line.style.opacity = 0; return; }
      const cell = (v, k) => rows[v].querySelector(`.cell[data-k="${k}"]`).getBoundingClientRect();
      const box = R.lists.getBoundingClientRect();
      const a = cell(f.scan.owner, f.scan.idx), b = cell(m.v, m.k);
      line.setAttribute('x1', a.left + a.width / 2 - box.left); line.setAttribute('y1', a.top + a.height / 2 - box.top);
      line.setAttribute('x2', b.left + b.width / 2 - box.left); line.setAttribute('y2', b.top + b.height / 2 - box.top);
      line.style.opacity = 1;
    }

    function render(f, i, prev, delay) {
      const ms = Math.max(120, Math.min(380, delay * .6));
      panel.show(f, ms);
      chapterBtns.forEach(b => b.classList.toggle('active', f.line >= +b.dataset.from && f.line <= +b.dataset.to));
      R.msg.innerHTML = SiteUI.linkTerms(f.msg);
      R.msg.classList.toggle('ok', !!(f.result && f.result.ok));
      R.msg.classList.toggle('fail', !!(f.result && !f.result.ok));
      R.vars.innerHTML = f.vars.map(v => `<code>${v}</code>`).join('');

      run.ids.forEach((id, v) => gv.setNodeState(id, v === f.cur ? 'cur' : v === f.target ? 'target' : ''));
      const removedIds = f.removed ? run.added.map(k => `e${k}`) : [];
      gv.edgeIds().forEach(e => {
        const st = removedIds.includes(e) ? 'removed' : e === f.activeEdge ? 'active' : f.used[e] != null ? `t${f.used[e] % 4}` : '';
        gv.setEdgeState(e, st);
      });

      rows.forEach((row, v) => {
        const mate = f.scan && f.scan.mate;
        row.classList.toggle('owner', !!f.scan && f.scan.owner === v);
        row.querySelectorAll('.cell').forEach(c => {
          const k = +c.dataset.k;
          if (c.classList.contains('eu-cell')) {
            const bit = f.bits[v][k], b = c.querySelector('.bit');
            if (b.textContent !== String(bit)) b.textContent = bit;
            c.classList.toggle('used', bit === 1);
            const here = !!f.scan && ((f.scan.owner === v && f.scan.idx === k) || (!!mate && mate.v === v && mate.k === k));
            c.classList.toggle('ptr', here);
          }
          c.classList.toggle('nx', f.nextU[v] === k);
        });
      });
      drawLink(f);
      placeTokens(f, ms);

      const text = f.letters.join('');
      if (R.letters.dataset.v !== text) {
        const before = R.letters.children.length;
        R.letters.dataset.v = text;
        R.letters.innerHTML = f.letters.map(c => `<span class="token in-out">${c}</span>`).join('');
        const added = R.letters.children[f.letters.length - 1];
        if (added && f.letters.length > before && !reduced()) added.animate([{ opacity: 0, transform: 'translateY(-12px)' }, { opacity: 1, transform: 'none' }], { duration: ms, easing: 'ease-out' });
      }
    }

    window.addEventListener('resize', () => { if (link) link.querySelector('line').style.opacity = 0; });
    rebuild();
  }
  return { mount };
})();
