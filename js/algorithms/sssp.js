/* ==========================================================================
   Frame generators for Week 5: shortest paths in a DAG (5L10), Dijkstra (5L22,
   5L23) and Bellman-Ford (5L46, 5L47). INIT and RELAX are the recitation's
   code (5R6). Week 6 adds Bellman-Ford presets (6L10, 6R8, 6R17), the
   recitation's code (6R4), the negative-cycle check (6L13), and Dijkstra on
   the G′ graphs of 6L41, 6L51 and 6R39. Pure logic, no DOM. See docs/ALGORITHM_ANIMATION.md.
   ========================================================================== */
window.Algorithms = window.Algorithms || {};

(function () {
  const G = Exercises.graphs;
  const L = GraphLogic;

  function preset(key, title) {
    const g = G[key];
    const adj = Object.fromEntries(g.nodes.map(([id]) => [id, g.edges.filter(([a]) => a === id).map(([, b]) => b)]));
    const weights = Object.fromEntries(g.edges.map(([a, b], i) => [`${a}>${b}`, g.weights[i]]));
    return { key, title: title || g.title, width: 500, height: 290, undirected: false, nodes: g.nodes, adj, start: g.start, weights,
      bends: g.bends, labels: g.labels, wedges: g.edges.map(([a, b], i) => [a, b, g.weights[i]]) };
  }

  const initCode = first => [
    { n: first, text: 'for each vertex v ∈ G.V do' },
    { n: first + 1, text: '    v.d = ∞' },
    { n: first + 2, text: '    v.π = NIL' },
    { n: first + 3, text: 's.d = 0' },
  ];
  const relaxCode = first => [
    { n: first, text: 'if v.d > u.d + w(u,v) then' },
    { n: first + 1, text: '    v.d = u.d + w(u,v)' },
    { n: first + 2, text: '    v.π = u' },
  ];

  /* The state every run shares: v.d, v.π, the frames and snap() */
  function tracer(p, extraVars) {
    const ids = p.nodes.map(n => n[0]);
    const index = Object.fromEntries(ids.map((id, i) => [id, i]));
    const name = v => (p.labels && p.labels[v]) || v;
    const d = Object.fromEntries(ids.map(v => [v, undefined])), pi = Object.fromEntries(ids.map(v => [v, undefined]));
    const fmt = x => (x === undefined ? '' : x === Infinity ? '∞' : String(x));
    const fmtPi = x => (x === undefined ? '' : x === null ? 'NIL' : name(x));
    const counts = {}, frames = [];
    const st = { Q: [], done: [], holding: null, relaxes: 0 };

    const snap = (line, msg, extra = {}) => {
      if (line != null) counts[line] = (counts[line] || 0) + 1;
      const tree = ids.filter(v => pi[v] != null).map(v => `${pi[v]}>${v}`);
      const nodeStates = {};
      st.done.forEach(v => { nodeStates[v] = 'c1'; });
      const vars = [];
      if (st.relaxes) vars.push(`relax calls = ${st.relaxes}`);
      frames.push(Object.assign({
        line, msg, counts: { ...counts },
        D: ids.map(v => fmt(d[v]) || null), side: ids.map(v => fmtPi(pi[v])),
        badges: ids.map(v => fmt(d[v])),
        Q: st.Q.map(v => index[v]), out: st.done.map(v => index[v]), holding: st.holding == null ? null : index[st.holding],
        cur: null, gone: [], tree, outEdges: [], nodeStates,
        tokenText: Object.fromEntries(ids.map((v, i) => [i, extraVars && extraVars.tokenD ? `${name(v)} · ${fmt(d[v])}` : name(v)])),
        ready: ids.map((v, i) => i).filter(i => d[ids[i]] !== undefined && d[ids[i]] < Infinity),
      }, extra, { vars: [...(extraVars && extraVars.vars ? extraVars.vars() : []), ...vars, ...(extra.vars || [])] }));
    };

    /* INIT of 5R6, lines first..first+3 */
    function init(first) {
      ids.forEach(v => {
        snap(first, `Next vertex: v = ${name(v)}.`, { target: index[v], vars: [`v = ${name(v)}`] });
        d[v] = Infinity;
        snap(first + 1, `${name(v)}.d = ∞: no path to ${name(v)} has been found yet.`, { target: index[v], changed: index[v], vars: [`v = ${name(v)}`] });
        pi[v] = null;
        snap(first + 2, `${name(v)}.π = NIL: no [[predecessor]] yet.`, { target: index[v], sideChanged: index[v], vars: [`v = ${name(v)}`] });
      });
      snap(first, 'Every vertex is set, so the for loop ends.');
      d[p.start] = 0;
      snap(first + 3, `${name(p.start)}.d = 0: the source is at distance 0 from itself.`, { changed: index[p.start] });
    }

    /* RELAX of 5R6, lines first..first+2. `at` = the frame fields that show the edge. */
    function relax(u, v, w, first, at = {}) {
      st.relaxes++;
      const on = Object.assign({ activeEdge: `${u}>${v}`, cur: index[u], target: index[v], vars: [`(u,v) = (${name(u)},${name(v)})`, `w(u,v) = ${w}`] }, at);
      const better = d[u] + w < d[v];
      const sum = d[u] === Infinity ? '∞' : d[u] + w;
      const plus = `${fmt(d[u])} + ${w < 0 ? `(${w})` : w}`;
      snap(first, better
        ? `relax(${name(u)},${name(v)}): is ${name(v)}.d > ${name(u)}.d + w(${name(u)},${name(v)})? ${fmt(d[v])} > ${plus} = ${sum}. Yes: a shorter path to ${name(v)}, through ${name(u)}.`
        : `relax(${name(u)},${name(v)}): is ${name(v)}.d > ${name(u)}.d + w(${name(u)},${name(v)})? ${fmt(d[v])} > ${plus}${d[u] === Infinity ? ' = ∞' : ` = ${sum}`}. No, so nothing changes.`, on);
      if (!better) return false;
      const old = d[v];
      d[v] = d[u] + w;
      snap(first + 1, `${name(v)}.d = ${d[v]}${old === Infinity ? '' : ` (it was ${old})`}.`, Object.assign({}, on, { changed: index[v] }));
      pi[v] = u;
      snap(first + 2, `${name(v)}.π = ${name(u)}: the best path known to ${name(v)} now ends with the edge (${name(u)},${name(v)}).`, Object.assign({}, on, { sideChanged: index[v] }));
      return true;
    }

    const finish = (msg, extra = {}) => {
      const truth = L.shortestPaths(ids, p.wedges, p.start);
      const ok = !!truth && ids.every(v => d[v] === truth.d[v]);
      snap(null, msg, Object.assign({ result: { ok, order: ids.map(v => `${v}:${fmt(d[v])}`) } }, extra));
    };

    return { ids, index, name, d, pi, st, snap, init, relax, finish, fmt, frames };
  }

  const common = (t, p) => ({
    ids: t.ids, adj: t.ids.map(id => p.adj[id].map(w => t.index[w])), sideCol: true, arrNames: { D: 'v.d', A: 'v.π' },
    names: t.ids.map(t.name),
  });

  /* ------------------------------------------------------------------------
     Shortest paths in a DAG (5L10)
     ------------------------------------------------------------------------ */
  function buildDag(presetId) {
    const p = Algorithms.dagSP.presets[presetId], t = tracer(p);
    const code = [
      ...initCode(1),
      { n: 5, text: '1. Compute a topological sort of the vertices.' },
      { n: 6, text: '2. For each vertex u, in sorted order' },
      { n: 7, text: '       for each v such that (u,v)∈E' },
      { n: 8, text: '           relax(u,v)' },
      ...relaxCode(9),
    ];
    const sections = [
      { id: 'init', title: 'INIT', slide: '5R6', from: 1, to: 4 },
      { id: 'main', title: 'DAG algorithm', slide: '5L10', from: 5, to: 8 },
      { id: 'relax', title: 'RELAX', slide: '5R6', from: 9, to: 11 },
    ];
    t.init(1);
    const order = L.topoOrder(t.ids, p.wedges.map(([a, b]) => [a, b]));
    t.st.Q = order.slice();
    t.snap(5, `A topological sort: ${order.map(t.name).join(', ')}. Every edge goes from left to right in this order, as the slide draws it.`);
    for (const u of order) {
      t.st.Q.shift(); t.st.holding = u;
      t.snap(6, `Next vertex in sorted order: u = ${t.name(u)} (${t.name(u)}.d = ${t.fmt(t.d[u])}). Its d is final: every edge into ${t.name(u)} comes from a vertex already processed.`, { cur: t.index[u], vars: [`u = ${t.name(u)}`] });
      for (const [a, v, w] of p.wedges.filter(e => e[0] === u)) {
        t.snap(7, `Edge (${t.name(u)},${t.name(v)}), of weight ${w}.`, { cur: t.index[u], target: t.index[v], activeEdge: `${u}>${v}`, vars: [`u = ${t.name(u)}`, `v = ${t.name(v)}`] });
        t.snap(8, `Call relax(${t.name(u)},${t.name(v)}).`, { cur: t.index[u], target: t.index[v], activeEdge: `${u}>${v}`, vars: [`u = ${t.name(u)}`, `v = ${t.name(v)}`] });
        t.relax(a, v, w, 9);
      }
      t.snap(7, p.adj[u].length ? `No more edges leave ${t.name(u)}.` : `No edge leaves ${t.name(u)}.`, { cur: t.index[u], vars: [`u = ${t.name(u)}`] });
      t.st.holding = null; t.st.done.push(u);
    }
    t.snap(6, 'Every vertex has been processed, so the loop ends.');
    t.finish(`Done after ${t.st.relaxes} relax calls, one per edge (m = ${p.wedges.length}). Every v.d is now d(${t.name(p.start)},v); ${t.ids.filter(v => t.d[v] === Infinity).map(t.name).join(', ') || 'no vertex'} stays ∞: not reachable from ${t.name(p.start)}.`);
    return Object.assign(common(t, p), { frames: t.frames, code, sections, qName: 'Still to process (sorted order)', holderName: 'Processing (u)', outName: 'Processed' });
  }

  /* ------------------------------------------------------------------------
     Dijkstra (5L22, or the alternative description of 5L23)
     ------------------------------------------------------------------------ */
  function buildDijkstra(presetId, modeId) {
    const p = Algorithms.dijkstra.presets[presetId];
    const t = tracer(p, { tokenD: true });
    const sortQ = () => t.st.Q.sort((x, y) => (t.d[x] ?? Infinity) - (t.d[y] ?? Infinity) || t.index[x] - t.index[y]);
    const minOf = () => t.st.Q.reduce((m, v) => (t.d[v] < t.d[m] ? v : m), t.st.Q[0]);
    let code, sections;
    const edgesOf = u => p.wedges.filter(e => e[0] === u);
    if (modeId === 'pq') {
      code = [
        ...initCode(1),
        { n: 5, text: 'Q ←V(G)' },
        { n: 6, text: 'while Q is not empty :' },
        { n: 7, text: '     u ← dequeue(Q)' },
        { n: 8, text: '     for all v such that (u,v)∈E :' },
        { n: 9, text: '           relax(u,v)' },
        ...relaxCode(10),
      ];
      sections = [
        { id: 'init', title: 'INIT', slide: '5R6', from: 1, to: 4 },
        { id: 'main', title: 'Dijkstra', slide: '5L22', from: 5, to: 9 },
        { id: 'relax', title: 'RELAX', slide: '5R6', from: 10, to: 12 },
      ];
      t.init(1);
      t.st.Q = t.ids.slice(); sortQ();
      t.snap(5, 'Q ← V(G): every vertex goes into the priority queue. Priority is the value of d, so the smallest d is at the front.');
      while (true) {
        if (!t.st.Q.length) { t.snap(6, 'Q is empty, so the while loop ends.'); break; }
        t.snap(6, `Q is not empty: ${t.st.Q.length} ${t.st.Q.length === 1 ? 'vertex' : 'vertices'} left.`);
        const u = minOf();
        t.st.Q.splice(t.st.Q.indexOf(u), 1); t.st.holding = u;
        t.snap(7, `u ← dequeue(Q) = ${t.name(u)}: it has the minimal d in Q, ${t.fmt(t.d[u])}. From now on ${t.name(u)}.d = d(${t.name(p.start)},${t.name(u)}) and never changes.`, { cur: t.index[u], vars: [`u = ${t.name(u)}`] });
        for (const [a, v, w] of edgesOf(u)) {
          t.snap(8, `Edge (${t.name(u)},${t.name(v)}), of weight ${w}.`, { cur: t.index[u], target: t.index[v], activeEdge: `${u}>${v}`, vars: [`u = ${t.name(u)}`, `v = ${t.name(v)}`] });
          t.snap(9, `Call relax(${t.name(u)},${t.name(v)}).`, { cur: t.index[u], target: t.index[v], activeEdge: `${u}>${v}`, vars: [`u = ${t.name(u)}`, `v = ${t.name(v)}`] });
          t.relax(a, v, w, 10);
          sortQ();
        }
        t.snap(8, edgesOf(u).length ? `No more edges leave ${t.name(u)}.` : `No edge leaves ${t.name(u)}.`, { cur: t.index[u] });
        t.st.holding = null; t.st.done.push(u);
      }
    } else {
      code = [
        { n: 1, text: '1. s.d ← 0 and for all v ≠ s, v.d ← ∞.' },
        { n: 2, text: '2. Q ← V.' },
        { n: 3, text: '3. Let u be a vertex in Q for which u.d is minimum.' },
        { n: 4, text: '4. for all v such that (u,v)∈E, perform relax(u,v)' },
        { n: 5, text: '5. Q = Q – {u}, if Q is not empty go to step 3.' },
        ...relaxCode(6),
      ];
      sections = [
        { id: 'main', title: 'Dijkstra, alternative description', slide: '5L23', from: 1, to: 5 },
        { id: 'relax', title: 'RELAX', slide: '5R6', from: 6, to: 8 },
      ];
      t.ids.forEach(v => { t.d[v] = v === p.start ? 0 : Infinity; t.pi[v] = null; });
      t.snap(1, `${t.name(p.start)}.d ← 0, and every other v.d ← ∞. (π starts as NIL, as in INIT.)`);
      t.st.Q = t.ids.slice(); sortQ();
      t.snap(2, 'Q ← V: every vertex is in Q, smallest d at the front.');
      while (true) {
        const u = minOf();
        t.st.holding = null;
        t.snap(3, `u = ${t.name(u)}: the vertex in Q with minimum d, ${t.fmt(t.d[u])}.`, { cur: t.index[u], vars: [`u = ${t.name(u)}`] });
        for (const [a, v, w] of edgesOf(u)) {
          t.snap(4, `Edge (${t.name(u)},${t.name(v)}), of weight ${w}: perform relax(${t.name(u)},${t.name(v)}).`, { cur: t.index[u], target: t.index[v], activeEdge: `${u}>${v}`, vars: [`u = ${t.name(u)}`, `v = ${t.name(v)}`] });
          t.relax(a, v, w, 6);
          sortQ();
        }
        if (!edgesOf(u).length) t.snap(4, `No edge leaves ${t.name(u)}.`, { cur: t.index[u] });
        t.st.Q.splice(t.st.Q.indexOf(u), 1); t.st.done.push(u);
        t.snap(5, t.st.Q.length ? `Q = Q − {${t.name(u)}}. Q is not empty, so go to step 3.` : `Q = Q − {${t.name(u)}}. Q is empty, so we stop.`);
        if (!t.st.Q.length) break;
      }
    }
    t.finish(`Done: every vertex left Q once (n = ${t.ids.length}) and ${t.st.relaxes} relax calls ran, one per edge (m = ${p.wedges.length}). Each v.d is d(${t.name(p.start)},v), and the thick edges (v.π, v) form the shortest-path tree.`);
    return Object.assign(common(t, p), { frames: t.frames, code, sections, qName: 'Priority queue Q (smallest d on the left)', holderName: 'Dequeued (u)', outName: 'Left Q (final)' });
  }

  /* ------------------------------------------------------------------------
     Bellman-Ford (5L46), optionally stopping early (5L47) or followed by the
     negative-cycle check of 6L13. A preset with `rec` shows the recitation's
     code (6R4) in place of the lecture's.
     ------------------------------------------------------------------------ */
  function buildBF(presetId, modeId) {
    const p = Algorithms.bellmanFord.presets[presetId];
    let sweep = 0, updates = 0;
    const t = tracer(p, { vars: () => (sweep ? [`sweep = ${sweep}`, `updates this sweep = ${updates}`] : []) });
    const stop = modeId === 'stop', detect = modeId === 'detect', rec = !!p.rec;
    const n = t.ids.length, m = p.wedges.length;
    /* Line numbers, in the order the sections are shown */
    let k = 0;
    const ln = {}, code = [], sections = [];
    const add = (id, title, slide, lines) => {
      const from = k + 1;
      lines.forEach(([key, text]) => { k++; if (key) ln[key] = k; code.push({ n: k, text }); });
      sections.push({ id, title, slide, from, to: k });
    };
    const initLines = [['init', 'for each vertex v ∈ G.V do'], [null, '    v.d = ∞'], [null, '    v.π = NIL'], [null, 's.d = 0']];
    const relaxLines = [['relax', 'if v.d > u.d + w(u,v) then'], [null, '    v.d = u.d + w(u,v)'], [null, '    v.π = u']];
    const helper = rec ? '6R4' : '5R6';
    if (rec) {
      add('main', 'Bellman-Ford(G,s)', '6R4', [['initCall', 'Init(G,s)'], ['repeat', 'for n-1 times do'], ['forEdge', '    for each edge (u, v) ∈ E do'], ['relaxCall', '        Relax(u, v)']]);
    } else {
      add('init', 'INIT', helper, initLines);
      add('main', 'Bellman-Ford', '5L46', [['repeat', 'repeat n − 1 times:'], ['forEdge', '   for every edge (u, v) ∈ E:'], ['relaxCall', '      relax(u, v)']]);
    }
    if (stop) add('stop', 'Stop early', '5L47', [['stop', 'Perform additional sweeps until an entire sweep produces no updates']]);
    if (detect) add('detect', 'After |V|−1 sweeps', '6L13', [['detFor', 'for each (u,v)∈E'], ['detIf', '  If v.d > u.d + w(u,v) then print “A negative cycle exists”']]);
    if (rec) add('init', 'INIT', helper, initLines);
    add('relax', 'RELAX', helper, relaxLines);

    if (rec) t.snap(ln.initCall, `Init(G,${t.name(p.start)}): every v.d becomes ∞ and every v.π NIL, then ${t.name(p.start)}.d = 0.`);
    t.init(ln.init);
    const order = p.wedges.map(([a, b]) => `(${t.name(a)},${t.name(b)})`).join(', ');
    let stoppedEarly = false;
    for (sweep = 1; sweep <= n - 1; sweep++) {
      updates = 0;
      t.snap(ln.repeat, `Sweep ${sweep} of at most n − 1 = ${n - 1}. Edge order: ${order}.`);
      p.wedges.forEach(([u, v, w], i) => {
        t.snap(ln.forEdge, `Edge ${i + 1} of ${m}: (${t.name(u)},${t.name(v)}), of weight ${w}.`, { cur: t.index[u], target: t.index[v], activeEdge: `${u}>${v}` });
        t.snap(ln.relaxCall, `Call relax(${t.name(u)},${t.name(v)}).`, { cur: t.index[u], target: t.index[v], activeEdge: `${u}>${v}` });
        if (t.relax(u, v, w, ln.relax)) updates++;
      });
      t.snap(ln.forEdge, `All ${m} edges were relaxed: sweep ${sweep} made ${updates} ${updates === 1 ? 'update' : 'updates'}.`);
      if (stop) {
        if (!updates) { t.snap(ln.stop, `Sweep ${sweep} produced no updates, so no further sweep can change anything: stop.`); stoppedEarly = true; break; }
        t.snap(ln.stop, sweep === n - 1 ? `Sweep ${sweep} produced updates, but n − 1 = ${n - 1} sweeps are done: with no negative cycles a further sweep cannot change anything (5L49), so we stop.` : `Sweep ${sweep} produced updates, so another sweep follows.`);
      }
    }
    const sweeps = stoppedEarly ? sweep : n - 1;
    if (!stoppedEarly) { sweep = n; updates = 0; t.snap(ln.repeat, `${n - 1} sweeps are done, so the ${rec ? 'for' : 'repeat'} loop ends.`); }
    sweep = 0;
    const truth = L.shortestPaths(t.ids, p.wedges, p.start);
    if (detect) {
      /* 6L13: one more pass that only tests; a print is shown as a token in "Printed" */
      const printed = [];
      p.wedges.forEach(([u, v, w], i) => {
        const at = { cur: t.index[u], target: t.index[v], activeEdge: `${u}>${v}`, outEdges: printed.slice() };
        t.snap(ln.detFor, `Check ${i + 1} of ${m}: the edge (${t.name(u)},${t.name(v)}), of weight ${w}.`, at);
        const bad = t.d[v] > t.d[u] + w;
        const sum = t.d[u] === Infinity ? '∞' : t.d[u] + w;
        if (bad) printed.push({ label: `A negative cycle exists (${t.name(u)},${t.name(v)})`, edge: `${u}>${v}` });
        t.snap(ln.detIf, bad
          ? `Is ${t.name(v)}.d > ${t.name(u)}.d + w(${t.name(u)},${t.name(v)})? ${t.fmt(t.d[v])} > ${t.fmt(t.d[u])} + ${w < 0 ? `(${w})` : w} = ${sum}. Yes: ${t.name(v)}.d would still drop in sweep n, so print “A negative cycle exists”.`
          : `Is ${t.name(v)}.d > ${t.name(u)}.d + w(${t.name(u)},${t.name(v)})? ${t.fmt(t.d[v])} > ${t.fmt(t.d[u])} + ${w < 0 ? `(${w})` : w} = ${sum}. No.`,
        Object.assign(at, { outEdges: printed.slice() }));
      });
      const ok = !!printed.length === !truth;
      t.snap(null, printed.length
        ? `Done: “A negative cycle exists” was printed ${printed.length === 1 ? 'once' : `${printed.length} times`}. Some v.d would still be reduced in sweep number |V| = ${n}, so the graph has a [[negative-cycle|negative cycle]] (6L13), and these v.d are not shortest paths.`
        : `Done: nothing was printed. No v.d can be reduced in sweep number |V| = ${n}, so there is no [[negative-cycle|negative cycle]] reachable from ${t.name(p.start)}, and every v.d is d(${t.name(p.start)},v).`,
      { result: { ok, order: t.ids.map(v => `${v}:${t.fmt(t.d[v])}`) }, outEdges: printed.slice(), printed: printed.length, sweeps });
    } else if (!truth) {
      t.snap(null, `Done after ${sweeps} ${sweeps === 1 ? 'sweep' : 'sweeps'}. But this graph has a [[negative-cycle|negative cycle]], so these v.d are not shortest paths, and nothing here says so. Switch to “Detect negative cycles (6L13)”.`,
        { result: { ok: false, order: t.ids.map(v => `${v}:${t.fmt(t.d[v])}`) }, sweeps });
    } else {
      t.finish(`Done after ${sweeps} ${sweeps === 1 ? 'sweep' : 'sweeps'}, ${t.st.relaxes} relax calls (${m} per sweep). Every v.d is d(${t.name(p.start)},v).`, { sweeps });
    }
    return Object.assign(common(t, p), { frames: t.frames, code, sections, panels: { queue: false, holder: false, output: detect }, outName: 'Printed' });
  }

  Algorithms.dagSP = { presets: { g11: preset('5L11') }, defaultPreset: 'g11', modes: [{ id: 'dag', label: 'DAG' }], build: buildDag };
  Algorithms.dijkstra = {
    presets: { g24: preset('5L24'), gR15: preset('5R15′'), g6L41: preset('6L41'), g6L51: preset('6L51'), g6R39: preset('6R39') }, defaultPreset: 'g24',
    modes: [{ id: 'pq', label: 'Priority queue (5L22)' }, { id: 'alt', label: 'Alternative description (5L23)' }], build: buildDijkstra,
  };
  const rec = (key, title) => Object.assign(preset(key, title), { rec: true });
  Algorithms.bellmanFord = {
    presets: { g48: preset('5L48'), g6L10: preset('6L10'), g6R8: rec('6R8'), g6R17: rec('6R17'), g6R22: rec('6R22'), g6R24: rec('6R24'), g6R8neg: rec('6R8neg') },
    defaultPreset: 'g48',
    modes: [{ id: 'full', label: 'n − 1 sweeps (5L46)' }, { id: 'stop', label: 'Stop when a sweep changes nothing (5L47)' }, { id: 'detect', label: 'Detect negative cycles (6L13)' }], build: buildBF,
  };
})();
