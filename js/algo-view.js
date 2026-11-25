/* ==========================================================================
   AlgoView: draws one algorithm animation from its frames.
   AlgoView.mount(el, Algorithms.toposort)
   Panels: pseudo-code, SVG graph, Q/S + output strips, D[] + adjacency lists.
   Frame format: docs/ALGORITHM_ANIMATION.md
   ========================================================================== */
(function () {
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Pseudo-code panel: one highlight bar that slides between lines, plus run counts */
  function codePanel(codeEl, barEl) {
    let lineEls = {}, secEls = [];
    return {
      build(code, sections) {
        [...codeEl.querySelectorAll('.code-line, .code-sec')].forEach(e => e.remove());
        lineEls = {}; secEls = [];
        for (const s of sections) {
          const h = document.createElement('div');
          h.className = 'code-sec';
          h.innerHTML = `<span>${s.title}</span>${SiteUI.transform(`{{${s.slide}}}`)}`;
          codeEl.appendChild(h);
          secEls.push({ s, el: h });
          for (const c of code.filter(x => x.n >= s.from && x.n <= s.to)) {
            const d = document.createElement('div');
            d.className = 'code-line'; d.dataset.line = c.n;
            d.innerHTML = `<span class="ln">${c.n}</span><code></code><span class="cnt"></span>`;
            d.querySelector('code').textContent = c.text;
            codeEl.appendChild(d);
            lineEls[c.n] = d;
          }
        }
      },
      show(f, ms) {
        barEl.style.transitionDuration = `${ms}ms`;
        const active = f.line != null ? lineEls[f.line] : null;
        barEl.style.opacity = active ? 1 : 0;
        if (active) { barEl.style.transform = `translateY(${active.offsetTop}px)`; barEl.style.height = `${active.offsetHeight}px`; }
        for (const n in lineEls) {
          const c = f.counts[n];
          lineEls[n].classList.toggle('active', +n === f.line);
          lineEls[n].querySelector('.cnt').textContent = c ? `×${c}` : '';
        }
        secEls.forEach(({ s, el }) => el.classList.toggle('active', f.line >= s.from && f.line <= s.to));
      },
    };
  }

  function mount(host, cfg, mountOpts = {}) {
    /* mountOpts.presets / .modes: comma lists that limit what this mount offers, so an
       earlier week's entry does not show a later week's graphs or modes */
    const only = (list, all) => (list ? list.split(',').map(x => x.trim()).filter(x => all.includes(x)) : all);
    if (mountOpts.presets || mountOpts.modes) {
      const keep = only(mountOpts.presets, Object.keys(cfg.presets)), modes = only(mountOpts.modes, cfg.modes.map(m => m.id));
      cfg = Object.assign({}, cfg, {
        presets: Object.fromEntries(keep.map(k => [k, cfg.presets[k]])),
        modes: cfg.modes.filter(m => modes.includes(m.id)),
        defaultPreset: keep.includes(cfg.defaultPreset) ? cfg.defaultPreset : keep[0],
      });
    }
    host.innerHTML = `
      <div class="algo" tabindex="-1">
        <div class="algo-setup">
          <label class="algo-field">Graph <select data-r="preset"></select></label>
          <div class="seg" role="group" aria-label="Data structure" data-r="modes"></div>
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
            <div class="strip-block"><p class="strip-name" data-r="qName"></p><div class="strip" data-r="q"></div></div>
            <div class="strip-block holder-block"><p class="strip-name" data-r="holderName">Taken out (x)</p><div class="strip holder" data-r="holder"></div></div>
            <div class="strip-block out-block"><p class="strip-name" data-r="outName">Output</p><div class="strip out" data-r="out"></div></div>
            <div class="vars" data-r="vars"></div>
          </div>
          <div class="algo-arrays" data-r="arrays"></div>
        </div>
        <p class="algo-keys">Keyboard: ← and → step through the run, space plays and pauses. Click inside the animation first.</p>
      </div>`;

    const R = {};
    host.querySelectorAll('[data-r]').forEach(e => { R[e.dataset.r] = e; });
    const root = host.querySelector('.algo');
    let presetId = mountOpts.preset || cfg.defaultPreset, modeId = mountOpts.mode || cfg.modes[0].id;
    /* A run can override the config's panels (two modes that need different panels) */
    const setPanels = extra => {
      const panels = Object.assign({ arrays: true, strips: true, queue: true, holder: true, output: true }, cfg.panels, extra);
      root.classList.toggle('no-arrays', !panels.arrays);
      root.classList.toggle('no-strips', !panels.strips);
      root.classList.toggle('no-queue', !panels.queue);
      root.classList.toggle('no-holder', !panels.holder);
      root.classList.toggle('no-output', !panels.output);
    };
    setPanels();
    const swState = {};
    let run, gv, tokens = {}, rows = [], chapterBtns = [];
    const panel = codePanel(R.code, R.bar);

    /* Controls */
    for (const id in cfg.presets) {
      const o = document.createElement('option');
      o.value = id; o.textContent = cfg.presets[id].title;
      R.preset.appendChild(o);
    }
    R.preset.value = presetId;
    R.preset.addEventListener('change', () => { presetId = R.preset.value; rebuild(); });
    if (Object.keys(cfg.presets).length < 2) R.preset.closest('label').hidden = true;
    if (cfg.modes.length < 2) R.modes.hidden = true;
    const syncSwitches = () => {
      R.switches.querySelectorAll('button[data-sw]').forEach(b => b.setAttribute('aria-pressed', String(swState[b.dataset.sw] === b.dataset.val)));
    };
    const resetSwitches = () => (cfg.switches || []).forEach(sw => { swState[sw.id] = sw.defaultFor(modeId); });
    (cfg.switches || []).forEach(sw => {
      const wrap = document.createElement('div');
      wrap.className = 'algo-field';
      wrap.innerHTML = `<span>${sw.label}</span><div class="seg small" role="group" aria-label="${sw.label}">${sw.options.map(o => `<button type="button" data-sw="${sw.id}" data-val="${o.id}">${o.label}</button>`).join('')}</div>`;
      R.switches.appendChild(wrap);
    });
    R.switches.addEventListener('click', e => {
      const b = e.target.closest('button[data-sw]');
      if (!b) return;
      swState[b.dataset.sw] = b.dataset.val;
      syncSwitches(); rebuild(); root.focus({ preventScroll: true });
    });
    resetSwitches();
    cfg.modes.forEach(m => {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = m.label; b.dataset.mode = m.id;
      b.setAttribute('aria-pressed', String(m.id === modeId));
      b.addEventListener('click', () => {
        modeId = m.id;
        R.modes.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.mode === modeId)));
        resetSwitches(); rebuild(); root.focus({ preventScroll: true });
      });
      R.modes.appendChild(b);
    });

    const player = new Player({
      root, restart: R.restart, back: R.back, play: R.play, next: R.next, end: R.end,
      scrub: R.scrub, speed: R.speed, speedOut: R.speedOut, count: R.count,
    }, {
      onRender: render,
      onPlayState: on => R.msg.setAttribute('aria-live', on ? 'off' : 'polite'),
    });

    /* Build everything that depends on the chosen graph / structure */
    function rebuild() {
      run = cfg.build(presetId, modeId, swState);
      setPanels(run.panels);
      syncSwitches();
      const p = cfg.presets[presetId];
      panel.build(run.code, run.sections); buildGraph(p); buildArrays(); buildChapters();

      Object.values(tokens).forEach(t => t.remove());
      tokens = {};
      R.q.classList.toggle('stack', modeId === 'stack');
      R.qName.textContent = run.qName || (modeId === 'stack' ? 'Stack S (top is at the top)' : 'Queue Q (front is on the left)');
      R.holderName.textContent = run.holderName || 'Taken out (x)';
      R.outName.textContent = run.outName || 'Output';
      const depth = Math.max(1, ...run.frames.map(f => f.Q.length));
      R.q.style.minHeight = modeId === 'stack' ? `${depth * 42}px` : '';

      player.load(run.frames);
    }

    function buildGraph(p) {
      R.graph.innerHTML = '';
      /* p.labels: shown names (s⁰ for the id s0); p.weights: { 'u>v': w } drawn on the edges; p.bends: { 'u>v': curve } */
      const nodes = p.nodes.map(([id, x, y]) => ({ id, x, y, label: p.labels && p.labels[id] != null ? p.labels[id] : id }));
      const edges = [];
      const order = Object.fromEntries(p.nodes.map(([id], i) => [id, i]));
      p.nodes.forEach(([id]) => (p.adj[id] || []).forEach(w => {
        if (!p.undirected || order[id] < order[w]) edges.push({ id: `${id}>${w}`, from: id, to: w, label: p.weights ? p.weights[`${id}>${w}`] : undefined, bend: p.bends ? p.bends[`${id}>${w}`] : undefined });
      }));
      GraphView.autoBend(edges);
      gv = GraphView.create(R.graph, {
        nodes, edges, width: p.width, height: p.height, r: 22, directed: !p.undirected, badges: !cfg.noBadges,
        edgeLabels: !!p.weights, ariaLabel: p.title,
      });
    }

    /* run.matrix (Floyd-Warshall): two n×n tables, δᵏ⁻¹ and δᵏ, in place of D[] */
    let mats = null, lastFw = null;
    const sup = n => String(n).split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('');
    function buildMatrix() {
      const names = run.names || run.ids;
      const table = m => `<div class="fw-mat" data-m="${m}"><p class="strip-name" data-h></p><table><thead><tr><th></th>${names.map(x => `<th scope="col">${x}</th>`).join('')}</tr></thead>
        <tbody>${names.map((x, i) => `<tr><th scope="row">${x}</th>${names.map((_, j) => `<td data-i="${i}" data-j="${j}"></td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      R.arrays.innerHTML = `<div class="fw-mats">${table('prev')}${table('cur')}</div>`;
      mats = {};
      for (const m of ['prev', 'cur']) {
        const box = R.arrays.querySelector(`[data-m="${m}"]`);
        mats[m] = { box, head: box.querySelector('[data-h]'), cells: names.map((_, i) => names.map((__, j) => box.querySelector(`td[data-i="${i}"][data-j="${j}"]`))) };
      }
      rows = []; lastFw = null;
    }
    function renderMatrix(f, i, prev, ms) {
      const w = f.fw, num = x => (x === '∞' ? Infinity : +x);
      mats.prev.box.classList.toggle('empty', w.prevK == null);
      mats.prev.head.textContent = w.prevK == null ? 'δᵏ⁻¹' : `δ${sup(w.prevK)}`;
      mats.cur.head.textContent = `δ${sup(w.curK)}${w.prevK == null ? '' : ` (computed from δ${sup(w.prevK)})`}`;
      const via = w.i != null ? [[w.i, w.k], [w.k, w.j]] : [];
      mats.prev.cells.forEach((row, a) => row.forEach((c, b) => {
        const val = w.prev[a][b];
        if (c.textContent !== val) c.textContent = val;
        c.classList.toggle('rowk', w.k != null && a === w.k);
        c.classList.toggle('colk', w.k != null && b === w.k);
        c.classList.toggle('read-ij', a === w.i && b === w.j);
        c.classList.toggle('read-via', via.some(([x, y]) => x === a && y === b));
      }));
      mats.cur.cells.forEach((row, a) => row.forEach((c, b) => {
        const val = w.cur[a][b];
        if (c.textContent !== val) c.textContent = val;
        c.classList.toggle('now', a === w.i && b === w.j);
        c.classList.toggle('down', val !== '' && w.prevK != null && num(val) < num(w.prev[a][b]));
        c.classList.toggle('neg', val !== '' && a === b && num(val) < 0);
      }));
      if (reduced() || i === prev) { lastFw = w; return; }
      /* The cell just computed pops; a value that went down pops larger */
      if (w.i != null) mats.cur.cells[w.i][w.j].animate([{ transform: `scale(${w.changed ? 1.45 : 1.15})` }, { transform: 'none' }], { duration: ms, easing: 'ease-out' });
      /* A finished δᵏ slides over to become the δᵏ⁻¹ of the next round */
      if (lastFw && i === prev + 1 && w.prevK != null && lastFw.curK === w.prevK && lastFw.prevK !== w.prevK) {
        const from = mats.cur.box.getBoundingClientRect(), to = mats.prev.box.getBoundingClientRect();
        mats.prev.box.animate([{ transform: `translate(${from.left - to.left}px, ${from.top - to.top}px)`, opacity: .4 }, { transform: 'none', opacity: 1 }], { duration: ms * 1.8, easing: 'cubic-bezier(.3,.7,.2,1)' });
      }
      lastFw = w;
    }

    function buildArrays() {
      if (run.matrix) { buildMatrix(); return; }
      mats = null;
      const names = run.arrNames || { D: 'D', A: 'A (adjacency lists)' };
      const head = `<div class="arr-row arr-head"><span>${names.D}</span><span></span><span>${names.A}</span></div>`;
      R.arrays.innerHTML = head + run.ids.map((id, i) => `
        <div class="arr-row" data-v="${i}">
          <span class="dcell"></span>
          <span class="vlabel">${run.names ? run.names[i] : id}</span>
          <span class="list">${run.sideCol ? '<span class="cell side"></span>' : `${run.adj[i].map((w, k) => `<span class="cell" data-k="${k}">${run.ids[w]}</span><span class="link" aria-hidden="true">→</span>`).join('')}<span class="cell nul" data-k="${run.adj[i].length}">null</span>`}</span>
        </div>`).join('');
      rows = [...R.arrays.querySelectorAll('.arr-row[data-v]')];
    }

    function buildChapters() {
      R.chapters.innerHTML = '';
      chapterBtns = run.sections.map(s => {
        const idx = run.frames.findIndex(f => f.line >= s.from && f.line <= s.to);
        const b = document.createElement('button');
        b.type = 'button'; b.textContent = s.title; b.dataset.from = s.from; b.dataset.to = s.to;
        b.addEventListener('click', () => { player.pause(); player.go(idx); root.focus({ preventScroll: true }); });
        R.chapters.appendChild(b);
        return b;
      });
    }

    /* Move vertex tokens between Q, the holder and Output with a FLIP animation */
    function placeTokens(f, ms) {
      const first = {};
      for (const v in tokens) {
        tokens[v].getAnimations().forEach(a => a.cancel());
        first[v] = tokens[v].getBoundingClientRect();
      }
      const where = {}, edgeOf = {};
      f.Q.forEach(v => { where[v] = R.q; });
      if (f.holding != null) where[f.holding] = R.holder;
      f.out.forEach(v => { where[v] = R.out; });
      const nodeOf = {};
      (f.outEdges || []).forEach(o => { where[`e:${o.label}`] = R.out; edgeOf[`e:${o.label}`] = o.edge; nodeOf[`e:${o.label}`] = o.node; });

      for (const v in tokens) if (!(v in where)) { tokens[v].remove(); delete tokens[v]; }
      const place = (v, box, text) => {
        if (!tokens[v]) {
          const t = document.createElement('span');
          t.className = 'token'; t.textContent = text != null ? text : (run.tokenLabel ? run.tokenLabel(v) : run.ids[v]);
          if (text != null || run.tokenLabel) t.classList.add('word');
          tokens[v] = t;
        }
        box.appendChild(tokens[v]);
      };
      f.Q.forEach(v => place(v, R.q));
      if (f.holding != null) place(f.holding, R.holder);
      f.out.forEach(v => place(v, R.out));
      (f.outEdges || []).forEach(o => place(`e:${o.label}`, R.out, o.label));
      /* f.tokenText: a token's text can change from frame to frame (Dijkstra shows v · v.d) */
      if (f.tokenText) for (const v in tokens) if (f.tokenText[v] != null && tokens[v].textContent !== f.tokenText[v]) { tokens[v].textContent = f.tokenText[v]; tokens[v].classList.add('word'); }
      for (const v in tokens) tokens[v].classList.toggle('in-out', where[v] === R.out);

      if (reduced()) return;
      for (const v in tokens) {
        const t = tokens[v];
        const last = t.getBoundingClientRect();
        let from = first[v];
        if (!from && +v === f.enq && rows[v]) from = rows[v].querySelector('.dcell').getBoundingClientRect();   // flies out of D[], as on slide 76
        if (!from && edgeOf[v]) from = gv.edgeEl(edgeOf[v]).getBoundingClientRect();                        // an edge token flies out of the graph
        if (!from && nodeOf[v] != null) from = gv.nodeEl(nodeOf[v]).getBoundingClientRect();                // a printed vertex flies out of its node
        const nodeEl = gv.nodeEl(run.ids[v]);
        if (!from && where[v] === R.out && !edgeOf[v] && nodeEl) from = nodeEl.getBoundingClientRect();   // source removal: leaves the graph
        if (from) {
          const dx = from.left - last.left, dy = from.top - last.top;
          if (dx || dy) t.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: ms, easing: 'cubic-bezier(.3,.7,.2,1)' });
        } else {
          t.animate([{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], { duration: ms * .7, easing: 'ease-out' });
        }
      }
    }

    function render(f, i, prev, delay) {
      const ms = Math.max(120, Math.min(380, delay * .6));

      /* Code: the highlight bar slides to the active line */
      panel.show(f, ms);
      chapterBtns.forEach(b => b.classList.toggle('active', f.line >= +b.dataset.from && f.line <= +b.dataset.to));

      /* Explanation */
      R.msg.innerHTML = SiteUI.linkTerms(f.msg);
      R.msg.classList.toggle('ok', !!(f.result && f.result.ok));
      R.msg.classList.toggle('fail', !!(f.result && !f.result.ok));
      R.vars.innerHTML = f.vars.map(v => `<code>${v}</code>`).join('');

      /* Graph */
      const outSet = new Set(f.out), qSet = new Set(f.ready || f.Q);
      run.ids.forEach((id, v) => {
        let st = '';
        if (v === f.cur) st = 'cur';
        else if (v === f.target) st = 'target';
        else if (outSet.has(v)) st = 'gone';
        else if (qSet.has(v)) st = 'ready';
        /* f.nodeStates / f.edgeStates override the defaults (a forest in colors, edges not built yet) */
        if (f.nodeStates && f.nodeStates[id] != null && v !== f.cur && v !== f.target) st = f.nodeStates[id];
        gv.setNodeState(id, st);
        gv.setBadge(id, f.badges ? f.badges[v] : outSet.has(v) || !f.D || f.D[v] == null ? '' : f.D[v]);
      });
      const goneSet = new Set(f.gone), treeSet = new Set(f.tree || []);
      gv.edgeIds().forEach(e => gv.setEdgeState(e, e === f.activeEdge ? 'active' : f.edgeStates && f.edgeStates[e] != null ? f.edgeStates[e] : goneSet.has(e) ? 'gone' : treeSet.has(e) ? 'out' : ''));

      /* D[] and adjacency lists */
      rows.forEach((row, v) => {
        const d = row.querySelector('.dcell');
        const val = f.D[v] == null ? '' : String(f.D[v]);
        if (d.textContent !== val) d.textContent = val;
        if (v === f.changed && i !== prev && !reduced()) d.animate([{ transform: 'scale(1.35)' }, { transform: 'none' }], { duration: ms, easing: 'ease-out' });
        d.classList.toggle('changed', v === f.changed);
        d.classList.toggle('zero', f.D[v] === 0);
        d.classList.toggle('marked', !!run.arrNames && f.D[v] === 1);
        /* run.sideCol: one value per vertex (f.side) in place of the adjacency list, e.g. v.π */
        if (run.sideCol) {
          const c = row.querySelector('.cell.side'), val = f.side[v] || '';
          if (c.textContent !== val) c.textContent = val;
          c.classList.toggle('changed', v === f.sideChanged);
          if (v === f.sideChanged && i !== prev && !reduced()) c.animate([{ transform: 'scale(1.35)' }, { transform: 'none' }], { duration: ms, easing: 'ease-out' });
        }
        const owns = !!f.ptr && f.ptr.owner === v;
        row.classList.toggle('owner', owns);
        const idle = !owns && f.ptrs ? f.ptrs[v] : null;
        row.querySelectorAll('.cell').forEach(c => {
          const k = +c.dataset.k;
          const on = owns && k === f.ptr.idx;
          c.classList.toggle('ptr', on);
          c.classList.toggle('ptr-idle', !owns && k === idle);
          c.classList.toggle('seen', !!f.seen && k < f.seen[v]);
          if (on) c.dataset.name = f.ptr.name; else delete c.dataset.name;
        });
      });

      if (mats && f.fw) renderMatrix(f, i, prev, ms);
      placeTokens(f, ms);
    }

    rebuild();
  }

  window.AlgoView = { mount, codePanel };
})();
