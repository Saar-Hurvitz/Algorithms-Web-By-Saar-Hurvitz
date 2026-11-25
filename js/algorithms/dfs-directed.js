/* ==========================================================================
   Frame generators for Recitation 4: DFS of a directed graph (4R4) and the
   root-finding algorithm of Exercise 1 (4R34). Pure logic, no DOM.
   See docs/ALGORITHM_ANIMATION.md.
   ========================================================================== */
window.Algorithms = window.Algorithms || {};

(function () {
  const G = Exercises.graphs;
  const treeColors = ['t0', 't1', 't2', 't3'];
  const nodeColors = ['g1', 'g2', 'g3', 'g4'];

  /* The 4R5 graph. The slides start DFS at C and then at D (4R6, 4R13). The other
     vertices are all marked by then, so their place in the outer loop changes nothing. */
  function preset(key, extra = {}) {
    const g = G[key];
    const lists = g.lists || Object.fromEntries(g.nodes.map(([id]) => [id, g.edges.filter(([a]) => a === id).map(([, b]) => b)]));
    return Object.assign({ title: g.title, width: 500, height: 290, undirected: false, nodes: g.nodes, adj: lists, order: g.order || g.nodes.map(n => n[0]) }, extra);
  }

  function tracer(p) {
    const ids = p.nodes.map(n => n[0]);
    const index = Object.fromEntries(ids.map((id, i) => [id, i]));
    const adj = ids.map(id => (p.adj[id] || []).map(w => index[w]));
    const edgeId = (a, b) => `${ids[a]}>${ids[b]}`;
    const st = { stack: [], cur: null, marked: new Set(), treeOf: {}, edgeTree: {}, E: [], out: [] };
    const counts = {}, frames = [];
    const snap = (line, msg, extra = {}) => {
      if (line != null && !extra.noCount) counts[line] = (counts[line] || 0) + 1;
      const { noCount, ...rest } = extra;
      /* Finished vertices take their tree's color; vertices on the stack are lit */
      const onStack = new Set(st.stack);
      const nodeStates = {};
      ids.forEach((id, v) => { if (st.marked.has(v) && !onStack.has(v)) nodeStates[id] = nodeColors[st.treeOf[v] % 4]; });
      const edgeStates = {};
      for (const e in st.edgeTree) edgeStates[e] = treeColors[st.edgeTree[e] % 4];
      frames.push(Object.assign({
        line, msg, counts: { ...counts },
        D: ids.map(() => null), Q: st.stack.slice(), out: [], holding: null, cur: st.cur,
        ready: [...onStack], tree: [], gone: [], vars: [], outEdges: st.E.slice(),
        nodeStates, edgeStates,
      }, rest));
    };
    return { ids, index, adj, edgeId, st, frames, snap, name: i => ids[i] };
  }

  /* DFS-Visit(G,v), lines 4-8 of 4R4. `L` maps the slide's lines to this code's numbers;
     `quiet` gives one frame per call only (used inside Exercise 1). */
  function visitAll(t, root, treeNo, L, quiet) {
    const { adj, edgeId, st, snap, name } = t;
    (function visit(v) {
      st.stack.push(v); st.cur = v; st.marked.add(v); st.treeOf[v] = treeNo;
      const here = [`v = ${name(v)}`];
      if (!quiet) snap(L.mark, `Mark ${name(v)}.`, { vars: here });
      for (const u of adj[v]) {
        const on = { target: u, activeEdge: edgeId(v, u), vars: [...here, `u = ${name(u)}`] };
        if (!quiet) snap(L.for, `(${name(v)},${name(u)}) ∈ E: next out-neighbor of ${name(v)} is ${name(u)}.`, on);
        if (st.marked.has(u)) {
          if (!quiet) snap(L.test, `${name(u)} is already marked, so (${name(v)},${name(u)}) is not a tree edge.`, on);
          continue;
        }
        if (!quiet) snap(L.test, `${name(u)} is unmarked.`, on);
        st.edgeTree[edgeId(v, u)] = treeNo;
        st.E.push({ label: `(${name(v)},${name(u)})`, edge: edgeId(v, u) });
        if (!quiet) snap(L.add, `Add (${name(v)},${name(u)}) to the spanning tree.`, on);
        if (!quiet) snap(L.call, `Call DFS-Visit(G,${name(u)}). It goes on top of the running stack.`, on);
        else snap(L.call, `${name(v)} discovers ${name(u)}: (${name(v)},${name(u)}) joins tree ${treeNo + 1}.`, Object.assign({ noCount: true }, on));
        visit(u);
        st.cur = v;
        if (!quiet) snap(L.call, `DFS-Visit(G,${name(u)}) finished. Back in DFS-Visit(G,${name(v)}).`, { noCount: true, vars: here });
      }
      if (!quiet) snap(L.for, `${name(v)} has no more out-neighbors, so DFS-Visit(G,${name(v)}) ends and leaves the stack.`, { vars: here });
      st.stack.pop();
      st.cur = st.stack.length ? st.stack[st.stack.length - 1] : null;
    })(root);
  }

  /* ---------- 4R4: DFS(G) and DFS-Visit(G,v) ---------- */
  const dfsCode = [
    { n: 1, text: 'For each v ∈ V:' },
    { n: 2, text: '    if v is unmarked then' },
    { n: 3, text: '        DFS-Visit(G,v)' },
    { n: 4, text: 'mark v' },
    { n: 5, text: 'For each u s.t. (v, u) ∈ E:' },
    { n: 6, text: '    if u is unmarked then' },
    { n: 7, text: '        add (v, u) to the spanning tree' },
    { n: 8, text: '        DFS-Visit(G,u)' },
  ];
  function buildDirected(p) {
    const t = tracer(p);
    const { st, snap, name, index } = t;
    let trees = 0;
    const roots = [];
    for (const id of p.order) {
      const v = index[id];
      snap(1, `Outer loop: v = ${id}.`, { vars: [`v = ${id}`] });
      if (st.marked.has(v)) { snap(2, `${id} is already marked, in tree ${st.treeOf[v] + 1}.`, { vars: [`v = ${id}`] }); continue; }
      snap(2, trees ? `${id} is unmarked: a new tree starts from a new root among the unmarked vertices.` : `${id} is unmarked, so DFS starts here.`, { vars: [`v = ${id}`] });
      snap(3, `Call DFS-Visit(G,${id}). ${id} is the root of tree ${trees + 1}.`, { vars: [`v = ${id}`] });
      roots.push(id);
      visitAll(t, v, trees, { mark: 4, for: 5, test: 6, add: 7, call: 8 }, false);
      trees++;
    }
    snap(1, 'The outer loop has gone over every vertex.', { noCount: true });
    snap(null, `Done: a forest of ${trees} ${trees === 1 ? 'tree' : 'trees'}, rooted at ${roots.join(' and ')}. ${trees > 1 ? 'On a directed graph, DFS can result in a forest and not a tree.' : ''}`,
      { result: { ok: true, order: st.E.map(e => e.label) } });
    return {
      frames: t.frames, code: dfsCode, ids: t.ids, adj: t.adj, qName: 'Running stack (top is at the top)', tokenLabel: v => `DFS-Visit(${t.ids[v]})`, outName: 'Tree edges',
      sections: [
        { id: 'dfs', title: 'Algorithm 1 DFS(G)', slide: '4R4', from: 1, to: 3 },
        { id: 'visit', title: 'Algorithm 2 DFS-Visit(G,v)', slide: '4R4', from: 4, to: 8 },
      ],
    };
  }
  Algorithms.dfsDirected = {
    presets: { r5: preset('4R5') }, defaultPreset: 'r5',
    panels: { arrays: false, holder: false }, noBadges: true,
    modes: [{ id: 'stack', label: '' }],
    build: () => buildDirected(Algorithms.dfsDirected.presets.r5),
  };

  /* ---------- 4R34: find a root, or report that there is none ---------- */
  const rootCode = [
    { n: 1, text: '1. Perform DFS(v) on some random vertex.' },
    { n: 2, text: '2. If we obtain a spanning tree, return v.' },
    { n: 3, text: '3. Else, perform DFS(r), where r is the root of the last tree in the DFS forest obtained in (1).' },
    { n: 4, text: '4. If we obtain a spanning tree, return r.' },
    { n: 5, text: '5. Else, return "No root in G".' },
  ];
  function buildRoot(presetId) {
    const p = Algorithms.findRoot.presets[presetId];
    const t = tracer(p);
    const { st, snap, name, index, ids } = t;
    const n = ids.length, v = index[p.v];
    const quietLines = { mark: 1, for: 1, test: 1, add: 1, call: 1 };
    /* Step 1: DFS(G) with v first in the outer loop */
    const order = [p.v, ...p.order.filter(x => x !== p.v)];
    let trees = 0, lastRoot = null;
    snap(1, `Start at v = ${p.v}.`, { vars: [`v = ${p.v}`] });
    for (const id of order) {
      const x = index[id];
      if (st.marked.has(x)) continue;
      if (trees) snap(1, `Some vertices are still unmarked: start tree ${trees + 1} at ${id}.`, { noCount: true, vars: [`v = ${p.v}`], target: x });
      st.stack = []; visitAll(t, x, trees, quietLines, true);
      lastRoot = x; trees++;
      snap(1, `Tree ${trees}, rooted at ${id}, is finished.`, { noCount: true, vars: [`v = ${p.v}`] });
    }
    if (trees === 1) {
      snap(2, `One tree spans all ${n} vertices, so return ${p.v}: it is a root.`, { vars: [`v = ${p.v}`] });
      snap(null, `${p.v} is a root.`, { result: { ok: true, order: [p.v] } });
    } else {
      snap(2, `The forest has ${trees} trees, so it is not a spanning tree.`, { vars: [`v = ${p.v}`] });
      const r = lastRoot;
      st.marked = new Set(); st.treeOf = {}; st.edgeTree = {}; st.E = [];
      snap(3, `r = ${name(r)}, the root of the last tree. Unmark everything and perform DFS(${name(r)}).`, { vars: [`v = ${p.v}`, `r = ${name(r)}`], target: r });
      visitAll(t, r, 0, quietLines, true);
      const all = st.marked.size === n;
      if (all) {
        snap(4, `DFS(${name(r)}) reaches all ${n} vertices: a spanning tree. Return ${name(r)}.`, { vars: [`r = ${name(r)}`] });
        snap(null, `${name(r)} is a root.`, { result: { ok: true, order: [name(r)] } });
      } else {
        snap(4, `DFS(${name(r)}) reaches only ${st.marked.size} of the ${n} vertices.`, { vars: [`r = ${name(r)}`] });
        snap(5, 'Return "No root in G".', { vars: [`r = ${name(r)}`] });
        snap(null, 'G has no root.', { result: { ok: false, order: [] } });
      }
    }
    return {
      frames: t.frames, code: rootCode, ids, adj: t.adj, qName: 'Running stack (top is at the top)', tokenLabel: x => `DFS-Visit(${ids[x]})`, outName: 'Tree edges',
      sections: [{ id: 'root', title: 'Exercise 1: the algorithm', slide: '4R34', from: 1, to: 5 }],
    };
  }
  Algorithms.findRoot = {
    presets: {
      H: preset('4R5', { v: 'H', title: 'Slide 5 graph, v = H (as on slide 37)' }),
      D: preset('4R5', { v: 'D', title: 'Slide 5 graph, v = D (as on slide 36)' }),
      A: preset('4R5', { v: 'A', title: 'Slide 5 graph, v = A' }),
      noRoot: preset('3R6c', { v: 'A', title: 'Slide 3R6 right graph (no root), v = A' }),
    },
    defaultPreset: 'H',
    panels: { arrays: false, holder: false }, noBadges: true,
    modes: [{ id: 'stack', label: '' }],
    build: presetId => buildRoot(presetId),
  };
})();
