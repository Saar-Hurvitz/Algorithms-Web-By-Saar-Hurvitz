/* ==========================================================================
   TournamentView: the induction of slide 2L42. A new team walks along the
   current line of teams until it finds its place.
   Uses the same Player and code panel as the other animations.
   ========================================================================== */
window.TournamentView = (function () {
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mount(host) {
    host.innerHTML = `
      <div class="algo tn" tabindex="-1">
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
        <div class="tn-grid">
          <div class="algo-code"><div class="code-inner" data-r="code"><div class="code-bar" data-r="bar"></div></div></div>
          <div class="algo-graph" data-r="graph"></div>
          <div class="tn-line">
            <p class="strip-name">The teams on a line (each one beat its successor)</p>
            <div class="tn-path" data-r="path"></div>
            <p class="strip-name">Team N looking for its place</p>
            <div class="tn-walk" data-r="walk"></div>
            <div class="vars" data-r="vars"></div>
          </div>
        </div>
        <p class="algo-keys">Keyboard: ← and → step through the run, space plays and pauses. Click inside the animation first.</p>
      </div>`;
    const R = {};
    host.querySelectorAll('[data-r]').forEach(e => { R[e.dataset.r] = e; });
    const root = host.querySelector('.algo');
    const run = Algorithms.tournament.build();
    const panel = AlgoView.codePanel(R.code, R.bar);
    panel.build(run.code, run.sections);

    const gv = GraphView.create(R.graph, {
      nodes: run.graph.nodes.map(([id, x, y]) => ({ id, x, y, label: id })),
      edges: run.graph.edges.map(([from, to]) => ({ id: `${from}>${to}`, from, to })),
      width: 500, height: 290, r: 24, directed: true, ariaLabel: run.graph.title,
    });
    const tokens = {};

    const player = new Player({
      root, restart: R.restart, back: R.back, play: R.play, next: R.next, end: R.end,
      scrub: R.scrub, speed: R.speed, speedOut: R.speedOut, count: R.count,
    }, { onRender: render, onPlayState: on => R.msg.setAttribute('aria-live', on ? 'off' : 'polite') });

    function render(f, i, prev, delay) {
      const ms = Math.max(140, Math.min(420, delay * .6));
      panel.show(f, ms);
      R.msg.innerHTML = SiteUI.linkTerms(f.msg);
      R.msg.classList.toggle('ok', !!(f.result && f.result.ok));
      R.vars.innerHTML = f.vars.map(v => `<code>${v}</code>`).join('');

      run.ids.forEach(v => gv.setNodeState(v, v === f.walker ? 'cur' : v === f.cmp ? 'target' : ''));
      const onPath = new Set(f.path.slice(1).map((v, k) => `${f.path[k]}>${v}`));
      gv.edgeIds().forEach(e => gv.setEdgeState(e, e === f.activeEdge ? 'active' : onPath.has(e) ? 'out' : ''));

      /* FLIP: every team moves from where it was on screen */
      const first = {};
      for (const v in tokens) { tokens[v].getAnimations().forEach(a => a.cancel()); first[v] = tokens[v].getBoundingClientRect(); }
      const need = new Set(f.path.concat(f.walker == null ? [] : [f.walker]));
      for (const v in tokens) if (!need.has(v)) { tokens[v].remove(); delete tokens[v]; }
      const get = v => {
        if (!tokens[v]) { const t = document.createElement('span'); t.className = 'token'; t.textContent = v; tokens[v] = t; }
        return tokens[v];
      };
      f.path.forEach(v => { const t = get(v); t.style.left = ''; t.classList.remove('tn-walker'); t.classList.add('in-out'); R.path.appendChild(t); });
      if (f.walker != null) {
        const t = get(f.walker);
        t.classList.remove('in-out'); t.classList.add('tn-walker');
        R.walk.appendChild(t);
        const ref = tokens[f.path[f.at]];
        t.style.left = `${ref.getBoundingClientRect().left - R.walk.getBoundingClientRect().left}px`;
      }
      if (reduced()) return;
      for (const v in tokens) {
        const last = tokens[v].getBoundingClientRect();
        const from = first[v] || gv.nodeEl(v).getBoundingClientRect();
        const dx = from.left - last.left, dy = from.top - last.top;
        if (dx || dy) tokens[v].animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: ms, easing: 'cubic-bezier(.3,.7,.2,1)' });
      }
    }
    player.load(run.frames);
  }
  return { mount };
})();
