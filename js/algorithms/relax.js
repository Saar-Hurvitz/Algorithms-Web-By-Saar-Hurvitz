/* ==========================================================================
   Frame generator for Week 4: the general method, Init + repeat relax(u,v)
   (4L44), on the graphs of 4L41 and 4L43. Pure logic, no DOM.
   See docs/ALGORITHM_ANIMATION.md.

   The slide does not say which edge to choose or when the repeat stops.
   Both edge orders and the stopping rule are added (tagged in the entry):
   - sweep: go over the edge list in the slide's order, round after round,
     and stop after a round in which no relax changed anything.
   - good:  every edge once, ordered by when its tail gets its final d
     (property 3 of 4L45). The order is computed, not typed in.
   ========================================================================== */
window.Algorithms = window.Algorithms || {};

(function () {
  const G = Exercises.graphs;
  const L = GraphLogic;

  function preset(key) {
    const g = G[key];
    const adj = Object.fromEntries(g.nodes.map(([id]) => [id, g.edges.filter(([a]) => a === id).map(([, b]) => b)]));
    const weights = Object.fromEntries(g.edges.map(([a, b], i) => [`${a}>${b}`, g.weights[i]]));
    return { key, title: g.title, width: 500, height: 290, undirected: false, nodes: g.nodes, adj, start: g.start, weights,
      wedges: g.edges.map(([a, b], i) => [a, b, g.weights[i]]) };
  }

  const code = [
    { n: 1, text: 's.d ← 0' },
    { n: 2, text: 's.π ← null' },
    { n: 3, text: 'for all other v:' },
    { n: 4, text: '   v.d ← infinity' },
    { n: 5, text: '   v.π ← null' },
    { n: 6, text: 'repeat' },
    { n: 7, text: '   choose an edge (u,v)' },
    { n: 8, text: '   relax(u,v)' },
    { n: 9, text: 'relax(u,v):   (u,v)∈E' },
    { n: 10, text: '   if v.d > u.d + w(u,v) :' },
    { n: 11, text: '      v.d ← u.d + w(u,v)' },
    { n: 12, text: '      v.π ← u' },
  ];
  const sections = [
    { id: 'init', title: 'Init', slide: '4L44', from: 1, to: 5 },
    { id: 'main', title: 'Main loop', slide: '4L44', from: 6, to: 8 },
    { id: 'relax', title: 'relax(u,v)', slide: '4L44', from: 9, to: 12 },
  ];

  /* Every edge once, sorted by the moment its tail's d becomes final: walk the
     π-tree of the true distances from s, breadth first. */
  function goodOrder(p) {
    const ids = p.nodes.map(n => n[0]);
    const { pi } = L.shortestPaths(ids, p.wedges, p.start);
    const rank = { [p.start]: 0 }, queue = [p.start];
    while (queue.length) {
      const u = queue.shift();
      ids.filter(v => pi[v] === u).forEach(v => { rank[v] = Object.keys(rank).length; queue.push(v); });
    }
    return p.wedges.map((e, i) => [e, i]).sort(([a, i], [b, j]) => ((rank[a[0]] ?? ids.length) - (rank[b[0]] ?? ids.length)) || (i - j)).map(([e]) => e);
  }

  function build(presetId, modeId) {
    const p = Algorithms.relax.presets[presetId];
    const ids = p.nodes.map(n => n[0]);
    const index = Object.fromEntries(ids.map((id, i) => [id, i]));
    const adj = ids.map(id => p.adj[id].map(w => index[w]));
    const s = p.start;
    const d = Object.fromEntries(ids.map(v => [v, undefined])), pi = Object.fromEntries(ids.map(v => [v, undefined]));
    const fmt = x => (x === undefined ? '' : x === Infinity ? '∞' : String(x));
    const fmtPi = x => (x === undefined ? '' : x === null ? 'null' : x);
    const plus = (a, w) => `${fmt(a)} + ${w < 0 ? `(${w})` : w}`;
    const counts = {}, frames = [];
    let calls = 0, round = 0;

    const snap = (line, msg, extra = {}) => {
      if (line != null) counts[line] = (counts[line] || 0) + 1;
      const tree = ids.filter(v => pi[v] != null).map(v => `${pi[v]}>${v}`);
      const vars = [];
      if (modeId === 'sweep' && round) vars.push(`round = ${round}`);
      if (calls) vars.push(`relax calls = ${calls}`);
      frames.push(Object.assign({
        line, msg, counts: { ...counts },
        D: ids.map(v => fmt(d[v]) || null), side: ids.map(v => fmtPi(pi[v])),
        badges: ids.map(v => (d[v] === undefined ? '' : fmt(d[v]))),
        Q: [], out: [], holding: null, cur: null, gone: [], tree, outEdges: [],
        ready: ids.map((v, i) => i).filter(i => d[ids[i]] !== undefined && d[ids[i]] < Infinity),
      }, extra, { vars: [...vars, ...(extra.vars || [])] }));
    };

    /* Init */
    d[s] = 0;
    snap(1, `${s}.d ← 0: the source is at distance 0 from itself.`, { changed: index[s] });
    pi[s] = null;
    snap(2, `${s}.π ← null: ${s} has no [[predecessor]].`, { sideChanged: index[s] });
    const others = ids.filter(v => v !== s);
    others.forEach(v => {
      snap(3, `Next other vertex: v = ${v}.`, { vars: [`v = ${v}`], target: index[v] });
      d[v] = Infinity;
      snap(4, `${v}.d ← ∞: no path to ${v} has been detected yet.`, { vars: [`v = ${v}`], target: index[v], changed: index[v] });
      pi[v] = null;
      snap(5, `${v}.π ← null.`, { vars: [`v = ${v}`], target: index[v], sideChanged: index[v] });
    });
    snap(3, 'Every other vertex is set, so the for loop ends.');

    /* Main loop */
    const one = ([u, v, w]) => {
      calls++;
      const e = `${u}>${v}`, on = { activeEdge: e, cur: index[u], target: index[v] };
      const uv = [`(u,v) = (${u},${v})`, `w(u,v) = ${w}`];
      snap(6, modeId === 'sweep' ? `repeat: relax call ${calls}, in round ${round}.` : `repeat: relax call ${calls}.`);
      snap(7, `Choose the edge (${u},${v}), of weight ${w}.`, Object.assign({ vars: uv }, on));
      snap(8, `Call relax(${u},${v}).`, Object.assign({ vars: uv }, on));
      snap(9, `Inside relax(${u},${v}): u = ${u}, v = ${v}.`, Object.assign({ vars: uv }, on));
      const better = d[u] + w < d[v];
      const sum = d[u] === Infinity ? '∞' : d[u] + w;
      snap(10, better
        ? `Is ${v}.d > ${u}.d + w(${u},${v})? ${fmt(d[v])} > ${plus(d[u], w)} = ${sum}. Yes: a shorter path to ${v} was detected, through ${u}.`
        : `Is ${v}.d > ${u}.d + w(${u},${v})? ${fmt(d[v])} > ${plus(d[u], w)} = ${sum}. No, so nothing changes.`,
      Object.assign({ vars: uv }, on));
      if (!better) return false;
      const old = d[v];
      d[v] = d[u] + w;
      snap(11, `${v}.d ← ${d[v]}${old === Infinity ? '' : ` (it was ${old}; it can only go down)`}.`, Object.assign({ vars: uv, changed: index[v] }, on));
      const oldPi = pi[v];
      pi[v] = u;
      snap(12, `${v}.π ← ${u}${oldPi ? ` (it was ${oldPi})` : ''}: the edge (${u},${v}) is now the last edge of the best path to ${v} known so far.`, Object.assign({ vars: uv, sideChanged: index[v] }, on));
      return true;
    };

    if (modeId === 'sweep') {
      while (true) {
        round++;
        let changed = false;
        p.wedges.forEach(e => { if (one(e)) changed = true; });
        if (!changed) break;
      }
    } else goodOrder(p).forEach(one);

    const truth = L.shortestPaths(ids, p.wedges, s).d;
    const right = ids.every(v => d[v] === truth[v]);
    const stop = modeId === 'sweep'
      ? `Round ${round} changed nothing, so no edge can lower any v.d: stop.`
      : `Every edge was relaxed once, each after its tail already had its final d.`;
    snap(null, `${stop} ${calls} relax calls. ${right ? `Every v.d now equals the [[distance]] d(${s},v)` : 'Some v.d is still above d(s,v)'}, and the thick edges are the (v.π, v) pairs.`,
      { result: { ok: right, order: ids.map(v => `${v}:${fmt(d[v])}:${fmtPi(pi[v])}`) }, calls });

    return {
      frames, code, sections, ids, adj, sideCol: true, arrNames: { D: 'v.d', A: 'v.π' },
      panels: { queue: false, holder: false, output: false },
    };
  }

  Algorithms.relax = {
    presets: { g41: preset('4L41'), g43: preset('4L43') },
    defaultPreset: 'g41',
    modes: [{ id: 'sweep', label: 'All edges, round after round' }, { id: 'good', label: 'Each edge once, in a good order' }],
    build,
    goodOrder,
  };
})();
