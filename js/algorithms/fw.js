/* ==========================================================================
   Frame generator for Floyd-Warshall (6L22, 6L23), with the negative-cycle
   test of 6L32. Pure logic, no DOM. See docs/ALGORITHM_ANIMATION.md.

   Besides the usual fields, every frame carries `fw`, drawn by the matrix
   panel of algo-view.js:
     { prevK, curK,           which δ the two matrices are (prevK null = hidden)
       prev, cur,             n×n strings; '' = a cell of δᵏ not computed yet
       i, j, k,               indexes of the pair being computed and of vertex k
       changed }              true when δᵏ(i,j) < δᵏ⁻¹(i,j)
   ========================================================================== */
window.Algorithms = window.Algorithms || {};

(function () {
  const G = Exercises.graphs;
  const L = GraphLogic;
  const sup = n => String(n).split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('');
  const fmt = x => (x === Infinity ? '∞' : String(x));
  const plus = (a, b) => (a === Infinity || b === Infinity ? '∞' : a + b);
  const sumText = (a, b) => `${fmt(a)} + ${b < 0 ? `(${fmt(b)})` : fmt(b)}`;

  function preset(key) {
    const g = G[key];
    const adj = Object.fromEntries(g.nodes.map(([id]) => [id, g.edges.filter(([a]) => a === id).map(([, b]) => b)]));
    const weights = Object.fromEntries(g.edges.map(([a, b], i) => [`${a}>${b}`, g.weights[i]]));
    return { key, title: g.title, width: 500, height: 290, undirected: false, nodes: g.nodes, adj, weights, bends: g.bends, labels: g.labels,
      wedges: g.edges.map(([a, b], i) => [a, b, g.weights[i]]) };
  }

  function build(presetId) {
    const p = Algorithms.floydWarshall.presets[presetId];
    const ids = p.nodes.map(n => n[0]), n = ids.length;
    const name = v => (p.labels && p.labels[v]) || v;
    const run = L.floydWarshall(ids, p.wedges);
    const code = [
      { n: 1, text: '1. Init δ⁰(i, j) as defined earlier' },
      { n: 2, text: '2. k ← 1' },
      { n: 3, text: '3. For every 1 ≤ i, j ≤ n compute' },
      { n: 4, text: 'δᵏ(i, j) ← Min { δᵏ⁻¹(i, j),\n                δᵏ⁻¹(i, k) + δᵏ⁻¹(k, j)}.' },
      { n: 5, text: '4. If k = n, stop. If not, increment k and go to\n   step 3.' },
    ];
    const sections = [{ id: 'fw', title: 'Floyd-Warshall', slide: '6L23', from: 1, to: 5 }];
    const counts = {}, frames = [];
    const strs = M => M.map(r => r.map(fmt));
    const blank = () => ids.map(() => ids.map(() => ''));
    let fw = { prevK: null, curK: 0, prev: blank(), cur: blank(), i: null, j: null, k: null, changed: false };
    const snap = (line, msg, extra = {}) => {
      if (line != null) counts[line] = (counts[line] || 0) + 1;
      const f = Object.assign({
        line, msg, counts: { ...counts }, D: ids.map(() => null), Q: [], out: [], holding: null, cur: null, target: null,
        gone: [], tree: [], outEdges: [], vars: [], nodeStates: {}, fw: JSON.parse(JSON.stringify(fw)),
      }, extra);
      if (fw.k != null) f.nodeStates = { [ids[fw.k]]: 'ready' };
      if (fw.i != null) f.cur = fw.i;
      if (fw.j != null) f.target = fw.j;
      frames.push(f);
    };

    fw.cur = strs(run.steps[0]);
    snap(1, `δ⁰(i, j) = w(i, j) if (i, j) ∈ E, ∞ if not, and 0 if i = j (6L22): the paths with no vertex in between. "∞" is written "--" on the slides.`);
    for (let k = 1; k <= n; k++) {
      const P = run.steps[k - 1], C = run.steps[k], kk = k - 1;
      fw = { prevK: k - 1, curK: k, prev: strs(P), cur: blank(), i: null, j: null, k: kk, changed: false };
      if (k === 1) snap(2, `k ← 1: from now on paths may also pass through vertex ${name(ids[0])}.`, { vars: ['k = 1'] });
      snap(3, `k = ${k}: compute every cell of δ${sup(k)} from δ${sup(k - 1)}. The shaded row and column are row ${name(ids[kk])} and column ${name(ids[kk])}: each new value is the old cell, or a value of that row plus a value of that column.`, { vars: [`k = ${k}`] });
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const old = P[i][j], via = plus(P[i][kk], P[kk][j]), val = C[i][j], changed = val < old;
          fw.i = i; fw.j = j; fw.cur[i][j] = fmt(val); fw.changed = changed;
          const vi = name(ids[i]), vj = name(ids[j]), vk = name(ids[kk]);
          const through = `δ${sup(k - 1)}(${vi},${vk}) + δ${sup(k - 1)}(${vk},${vj}) = ${sumText(P[i][kk], P[kk][j])} = ${fmt(via)}`;
          let msg;
          if (i === kk || j === kk) msg = `(${vi},${vj}): ${i === kk && j === kk ? `the path from ${vk} to itself` : `a path that starts or ends at ${vk}`}; going through ${vk} again adds δ${sup(k - 1)}(${vk},${vk}) = ${fmt(P[kk][kk])}${P[kk][kk] < 0 ? ', which makes it lighter' : ', so nothing changes'}. δ${sup(k)}(${vi},${vj}) = ${fmt(val)}.`;
          else if (changed) msg = `(${vi},${vj}): through ${vk}, ${through}, which is less than δ${sup(k - 1)}(${vi},${vj}) = ${fmt(old)}. So δ${sup(k)}(${vi},${vj}) = ${fmt(val)}.`;
          else msg = `(${vi},${vj}): through ${vk}, ${through}, not less than δ${sup(k - 1)}(${vi},${vj}) = ${fmt(old)}. So δ${sup(k)}(${vi},${vj}) = ${fmt(val)}.`;
          snap(4, msg, { vars: [`k = ${k}`, `i = ${vi}`, `j = ${vj}`] });
        }
      }
      const changedCells = run.steps[k].flatMap((r, i) => r.map((x, j) => (x < P[i][j] ? `(${name(ids[i])},${name(ids[j])})` : null))).filter(Boolean);
      fw.i = null; fw.j = null; fw.changed = false;
      const summary = changedCells.length ? `δ${sup(k)} is done: ${changedCells.length} ${changedCells.length === 1 ? 'cell' : 'cells'} went down, ${changedCells.join(', ')}.` : `δ${sup(k)} is done, and no cell went down.`;
      snap(5, k === n ? `${summary} k = n = ${n}: stop.` : `${summary} k = ${k} ≠ n, so k becomes ${k + 1}: go to step 3.`, { vars: [`k = ${k}`] });
    }

    /* 6L31: δⁿ(i,j) is the shortest path from i to j; 6L32: a negative δ(i,i) means a negative cycle */
    const negAt = ids.map((v, i) => [v, run.d[i][i]]).filter(([, x]) => x < 0);
    fw = { prevK: n - 1, curK: n, prev: strs(run.steps[n - 1]), cur: strs(run.d), i: null, j: null, k: null, changed: false };
    if (negAt.length) {
      snap(null, `Done. On the diagonal, ${negAt.map(([v, x]) => `δ${sup(n)}(${name(v)},${name(v)}) = ${x}`).join(', ')} < 0. So a [[negative-cycle|negative cycle]] exists (6L32), and δ${sup(n)} is not the shortest paths.`,
        { result: { ok: true, negative: true, order: [] } });
    } else {
      const truth = ids.map(s => { const r = L.shortestPaths(ids, p.wedges, s); return ids.map(v => r.d[v]); });
      const ok = truth.every((r, i) => r.every((x, j) => x === run.d[i][j]));
      snap(null, `Done: δ${sup(n)}(i, j) is the length of a shortest path from i to j, for every pair (6L31). Every diagonal cell is 0, so there is no [[negative-cycle|negative cycle]] (6L32). ${n} rounds of n² = ${n * n} cells: n³ = ${n ** 3} computations, O(n³).`,
        { result: { ok, negative: false, order: [] } });
    }
    return { frames, code, sections, ids, adj: ids.map(() => []), names: ids.map(name), matrix: true, panels: { arrays: true, queue: false, holder: false, output: false } };
  }

  Algorithms.floydWarshall = {
    presets: { g25: preset('6L25'), g50: preset('6R49'), gneg: preset('6L25neg') }, defaultPreset: 'g25',
    modes: [{ id: 'fw', label: 'Floyd-Warshall' }], build, noBadges: true,
  };
})();
