/* ==========================================================================
   Frame generators for Week 4: BFS (4L10), BFS for shortest path (4L26, 4L31),
   the recitation's BFS(G,v) (4R50), path(v) (4L46) and the even-path reduction
   of Recitation 4, Exercise 2 (4R75). Pure logic, no DOM.
   See docs/ALGORITHM_ANIMATION.md.
   ========================================================================== */
window.Algorithms = window.Algorithms || {};

(function () {
  const G = Exercises.graphs;

  /* A slide graph from Exercises.graphs as an AlgoView preset. The list order
     (g.lists) decides the run, so it is the one that reproduces the slides. */
  function preset(key, extra = {}) {
    const g = G[key];
    const adj = g.lists || Object.fromEntries(g.nodes.map(([id]) => [id, g.edges.filter(([a]) => a === id).map(([, b]) => b)]));
    const weights = g.weights ? Object.fromEntries(g.edges.map(([a, b], i) => [`${a}>${b}`, g.weights[i]])) : undefined;
    return Object.assign({ title: g.title, width: 500, height: 290, undirected: !g.directed, nodes: g.nodes, adj, start: g.start, weights }, extra);
  }

  /* Shared state and one frame per executed line */
  function tracer(p) {
    const ids = p.nodes.map(n => n[0]);
    const index = Object.fromEntries(ids.map((id, i) => [id, i]));
    const adj = ids.map(id => (p.adj[id] || []).map(w => index[w]));
    const order = index;
    const edgeId = (a, b) => (!p.undirected || order[ids[a]] < order[ids[b]] ? `${ids[a]}>${ids[b]}` : `${ids[b]}>${ids[a]}`);
    const st = { Q: [], holding: null, cur: null, D: ids.map(() => null), tree: [], E: [], ready: new Set(), ptrs: null, seen: null, out: [], extra: {} };
    const counts = {}, frames = [];
    const snap = (line, msg, extra = {}) => {
      if (line != null && !extra.noCount) counts[line] = (counts[line] || 0) + 1;
      const { noCount, ...rest } = extra;
      frames.push(Object.assign({
        line, msg, counts: { ...counts },
        D: st.D.slice(), Q: st.Q.slice(), out: st.out.slice(), holding: st.holding, cur: st.cur,
        ready: [...st.ready], tree: st.tree.slice(), gone: [], vars: [],
        ptr: null, ptrs: st.ptrs ? st.ptrs.slice() : null, seen: st.seen ? st.seen.slice() : null,
        outEdges: st.E.slice(),
      }, st.extra, rest));
    };
    return { ids, index, adj, edgeId, st, frames, snap, name: i => ids[i] };
  }

  /* ---------- The queue version: 4L10 (mark), 4L31 (label) and 4R50 ---------- */
  function buildQueue(p, cfg) {
    const t = tracer(p);
    const { adj, edgeId, st, snap, name } = t;
    const L = cfg.lines, I = cfg.i, J = cfg.j, n = t.ids.length;
    const s = t.index[p.start];
    const labels = cfg.labels;
    const isMarked = v => st.ready.has(v);
    /* cfg.badges: each vertex's distance beside it, ∞ until it is found (as drawn on 4R52-4R71) */
    const dist = t.ids.map(() => null);
    const badges = () => dist.map(x => (x == null ? '∞' : x));
    if (cfg.lists) { st.ptrs = Array(n).fill(0); st.seen = Array(n).fill(0); }
    if (cfg.badges) st.extra.badges = badges();
    const sync = () => { if (cfg.badges) st.extra.badges = badges(); };
    const T = cfg.treeName;

    if (L.init2 != null) {
      snap(L.init, `${T} starts empty.`);
      snap(L.init2, 'Q starts empty.');
    } else snap(L.init, `Q and ${T} start empty.`);
    if (cfg.marks) st.D = Array(n).fill(0);
    st.Q.push(s); st.ready.add(s); dist[s] = 0;
    if (labels) st.D[s] = 0; else if (cfg.marks) st.D[s] = 1;
    sync();
    snap(L.enq0, labels
      ? `Enqueue ${name(s)} and label(${name(s)}) = 0. ${name(s)} is the root.`
      : `Enqueue ${name(s)} and mark it${cfg.marks ? `: ${cfg.markName}[${name(s)}] = 1` : ''}. ${name(s)} is ${cfg.rootNote}.`, { enq: s, changed: s });

    while (true) {
      if (!st.Q.length) { st.holding = null; st.cur = null; snap(L.loop, 'Q is empty, so the while loop ends.'); break; }
      snap(L.loop, `Q is not empty (${st.Q.length} in it), so the loop runs again.`);
      const i = st.Q.shift();
      st.holding = i; st.cur = i;
      const here = [`${I} = ${name(i)}`];
      snap(L.deq, `${I} ← Dequeue(Q) = ${name(i)}, the vertex at the front.`, { vars: here, ptr: cfg.lists ? { owner: i, idx: 0, name: J } : null });
      for (let k = 0; ; k++) {
        const ptr = cfg.lists ? { owner: i, idx: k, name: J } : null;
        if (k >= adj[i].length) {
          if (cfg.lists) st.ptrs[i] = k;
          snap(L.for, `${name(i)} has no more neighbors, so the for loop ends.`, { vars: here, ptr });
          break;
        }
        const j = adj[i][k];
        if (cfg.lists) st.seen[i] = k + 1;
        const vars = [...here, `${J} = ${name(j)}`], on = { target: j, activeEdge: edgeId(i, j), vars, ptr };
        snap(L.for, `Next neighbor of ${name(i)}: ${J} = ${name(j)}.`, on);
        if (isMarked(j)) {
          snap(L.test, labels ? `${name(j)} is already labeled ${st.D[j]}, so nothing happens.` : `${name(j)} is already marked, so nothing happens.`, Object.assign({ changed: cfg.marks || labels ? j : undefined }, on));
          continue;
        }
        snap(L.test, labels ? `${name(j)} is not labeled yet.` : `${name(j)} is not marked yet.`, Object.assign({ changed: cfg.marks || labels ? j : undefined }, on));
        st.tree.push(edgeId(i, j));
        st.E.push({ label: `(${name(i)},${name(j)})`, edge: edgeId(i, j) });
        snap(L.add, `Add (${name(i)},${name(j)}) to ${T}: ${name(i)} discovered ${name(j)}.`, on);
        st.ready.add(j); dist[j] = dist[i] + 1;
        if (labels) { st.D[j] = st.D[i] + 1; sync(); snap(L.mark, `label(${name(j)}) ← label(${name(i)}) + 1 = ${st.D[j]}.`, Object.assign({}, on, { changed: j })); }
        else { if (cfg.marks) st.D[j] = 1; sync(); snap(L.mark, cfg.marks ? `Mark ${name(j)}: ${cfg.markName}[${name(j)}] = 1.` : `Mark ${name(j)}.`, Object.assign({}, on, { changed: j })); }
        st.Q.push(j);
        snap(L.enq, `Enqueue(Q, ${name(j)}): it joins the back of the queue.`, Object.assign({}, on, { enq: j }));
      }
    }
    snap(null, `Done: Q is empty. ${T} holds ${st.E.length} edges on ${n} vertices, a [[spanning-tree|spanning tree]].${labels ? ' Every label is the distance from ' + name(s) + '.' : ''}`,
      { result: { ok: true, order: st.E.map(e => e.label) } });
    return {
      frames: t.frames, code: cfg.code, sections: cfg.sections, ids: t.ids, adj: t.adj,
      holderName: `Dequeued: ${I}`, outName: T, arrNames: cfg.arrNames,
    };
  }

  /* ---------- 4L10: Spanning tree using BFS, run with the lists of 4L11 ---------- */
  const lectureCode = [
    { n: 1, text: "Initialize E'=∅;" },
    { n: 2, text: 'Initialize Q to be empty;' },
    { n: 3, text: 'Enqueue(Q, s) and mark s;' },
    { n: 4, text: 'while (Q is not empty) do' },
    { n: 5, text: '    i ←Dequeue(Q);' },
    { n: 6, text: '    for each j adjacent to i do' },
    { n: 7, text: '        if j is not marked then' },
    { n: 8, text: "            add (i,j) to E';" },
    { n: 9, text: '            mark j;' },
    { n: 10, text: '            Enqueue(Q, j);' },
  ];
  const queueLines = { init: 1, init2: 2, enq0: 3, loop: 4, deq: 5, for: 6, test: 7, add: 8, mark: 9, enq: 10 };
  Algorithms.bfs = {
    presets: { lecture: preset('4L11') }, defaultPreset: 'lecture',
    panels: { arrays: true }, noBadges: true,
    modes: [{ id: 'queue', label: '' }],
    build: () => buildQueue(Algorithms.bfs.presets.lecture, {
      code: lectureCode, lines: queueLines, i: 'i', j: 'j', marks: true, lists: true, markName: 'M',
      rootNote: 'the root of the tree', treeName: "E'", arrNames: { D: 'M', A: 'Adjacency lists' },
      sections: [{ id: 'bfs', title: 'Spanning tree using BFS', slide: '4L10', from: 1, to: 10 }],
    }),
  };

  /* ---------- 4L26 and 4L31: BFS for shortest path, on the graph of 4L27 ---------- */
  const spQueueCode = [
    { n: 1, text: "Initialize E' to be empty;" },
    { n: 2, text: 'Initialize Q to be empty;' },
    { n: 3, text: 'Enqueue(Q, s) and label(s)=0;' },
    { n: 4, text: 'while (Q is not empty) do' },
    { n: 5, text: '    i ←Dequeue(Q);' },
    { n: 6, text: '    for each j adjacent to i do' },
    { n: 7, text: '        if j is not labeled then' },
    { n: 8, text: "            add (i,j) to E';" },
    { n: 9, text: '            label(j) ←label(i) + 1;' },
    { n: 10, text: '            Enqueue(Q, j);' },
  ];
  const centralCode = [
    { n: 1, text: '1. Label vertex s with 0.' },
    { n: 2, text: '2. i ← 0' },
    { n: 3, text: '3. Find all unlabeled vertices adjacent to at least one vertex labeled i. If none are found, stop.' },
    { n: 4, text: '4. Label all the vertices found in (3) with i + 1.' },
    { n: 5, text: '5. i ← i + 1 and go to (3).' },
  ];
  function buildCentral(p) {
    const t = tracer(p);
    const { adj, edgeId, st, snap, name } = t;
    const s = t.index[p.start];
    st.D[s] = 0; st.ready.add(s);
    snap(1, `Label ${name(s)} with 0.`, { changed: s });
    let i = 0;
    snap(2, 'i ← 0.', { vars: ['i = 0'] });
    while (true) {
      const fromI = t.ids.map((_, v) => v).filter(v => st.D[v] === i);
      const found = t.ids.map((_, v) => v).filter(v => st.D[v] == null && fromI.some(u => adj[u].includes(v)));
      const edgeStates = {};
      fromI.forEach(u => adj[u].forEach(v => { if (found.includes(v)) edgeStates[edgeId(u, v)] = 'active'; }));
      const nodeStates = Object.fromEntries(found.map(v => [name(v), 'g3']));
      if (!found.length) {
        snap(3, `No unlabeled vertex is adjacent to a vertex labeled ${i}: the whole graph is labeled, so stop.`, { vars: [`i = ${i}`] });
        break;
      }
      snap(3, `Unlabeled vertices adjacent to a vertex labeled ${i}: ${found.map(name).join(', ')}.`, { vars: [`i = ${i}`], edgeStates, nodeStates });
      found.forEach(v => { st.D[v] = i + 1; st.ready.add(v); });
      snap(4, `Label ${found.map(name).join(', ')} with ${i + 1}: their distance from ${name(s)} is ${i + 1}.`, { vars: [`i = ${i}`], edgeStates });
      i++;
      snap(5, `i ← ${i}, and go to (3).`, { vars: [`i = ${i}`] });
    }
    snap(null, `Done: every vertex is labeled by its distance from ${name(s)}.`, { result: { ok: true, order: t.ids.map((id, v) => `${id}:${st.D[v]}`) } });
    return {
      frames: t.frames, code: centralCode, ids: t.ids, adj: t.adj, arrNames: { D: 'label', A: 'Neighbors' },
      sections: [{ id: 'central', title: "The 'centralized' version", slide: '4L26', from: 1, to: 5 }],
      panels: { queue: false, holder: false, output: false },
    };
  }
  Algorithms.bfsShortest = {
    presets: { sp: preset('4L27') }, defaultPreset: 'sp',
    panels: { arrays: true },
    modes: [{ id: 'central', label: "Centralized (slide 26)" }, { id: 'queue', label: 'With a queue (slide 31)' }],
    build: (presetId, modeId) => {
      const p = Algorithms.bfsShortest.presets.sp;
      if (modeId === 'central') return buildCentral(p);
      return buildQueue(p, {
        code: spQueueCode, lines: queueLines, i: 'i', j: 'j', labels: true, lists: true,
        treeName: "E'", arrNames: { D: 'label', A: 'Adjacency lists' },
        sections: [{ id: 'bfs', title: 'BFS for shortest path', slide: '4L31', from: 1, to: 10 }],
      });
    },
  };

  /* ---------- 4R50: BFS(G,v), on the recitation graph of 4R51 ---------- */
  const recCode = [
    { n: 1, text: 'Q ← ∅, T ← ∅' },
    { n: 2, text: 'Enqueue(Q,v) and mark v' },
    { n: 3, text: 'While Q is not empty:' },
    { n: 4, text: '    u ← Dequeue(Q)' },
    { n: 5, text: '    For each w adjacent to u:' },
    { n: 6, text: '        if w is not marked then' },
    { n: 7, text: '            add (u, w) to T' },
    { n: 8, text: '            mark w' },
    { n: 9, text: '            Enqueue(Q,w)' },
  ];
  Algorithms.bfsRecitation = {
    presets: { rec: preset('4R51') }, defaultPreset: 'rec',
    panels: { arrays: false },
    modes: [{ id: 'queue', label: '' }],
    /* The slides draw each vertex's distance next to it (∞ until it is found, 4R52-4R71).
       Algorithm 3 does not compute it: the badges follow label(j) ← label(i) + 1 of 4L31. */
    build: () => buildQueue(Algorithms.bfsRecitation.presets.rec, {
        code: recCode, lines: { init: 1, enq0: 2, loop: 3, deq: 4, for: 5, test: 6, add: 7, mark: 8, enq: 9 }, i: 'u', j: 'w',
        rootNote: 'the root', treeName: 'T', badges: true, marks: false,
        sections: [{ id: 'bfs', title: 'Algorithm 3 BFS(G,v)', slide: '4R50', from: 1, to: 9 }],
    }),
  };

  /* ---------- 4L46: path(v), printing a shortest path through v.π ---------- */
  const pathCode = [
    { n: 1, text: 'path(v)' },
    { n: 2, text: 'if v≠s :' },
    { n: 3, text: '   path(v.π)' },
    { n: 4, text: 'print v' },
  ];
  function piOf(key) {
    const g = G[key];
    if (g.pi) return g.pi;
    const ids = g.nodes.map(n => n[0]);
    return GraphLogic.shortestPaths(ids, g.edges.map(([a, b], i) => [a, b, g.weights[i]]), g.start).pi;
  }
  function buildPath(presetId) {
    const p = Algorithms.pathPrint.presets[presetId];
    const t = tracer(p);
    const { edgeId, st, snap, name, index } = t;
    const pi = piOf(p.key), s = index[p.start];
    const piIdx = v => (pi[name(v)] == null ? null : index[pi[name(v)]]);
    st.extra.badges = t.ids.map(id => (pi[id] == null ? '' : `π=${pi[id]}`));
    t.ids.forEach((id, v) => { if (piIdx(v) != null) st.tree.push(edgeId(piIdx(v), v)); });

    (function path(v, caller) {
      st.Q.push(v); st.cur = v;
      const vars = [`v = ${name(v)}`];
      snap(1, caller == null ? `Call path(${name(v)}).` : `Call path(${name(v)}): it goes on top of the running stack.`, { vars });
      if (v !== s) {
        snap(2, `${name(v)} ≠ ${name(s)}, so first print the path to ${name(v)}.π = ${name(piIdx(v))}.`, { vars });
        snap(3, `Call path(${name(piIdx(v))}). path(${name(v)}) waits.`, { vars, activeEdge: edgeId(piIdx(v), v), target: piIdx(v) });
        path(piIdx(v), v);
        st.cur = v;
        snap(3, `path(${name(piIdx(v))}) finished. Back in path(${name(v)}).`, { vars, noCount: true });
      } else snap(2, `v = ${name(s)}, so there is nothing before it.`, { vars });
      st.E.push({ label: name(v), node: name(v) });
      snap(4, `Print ${name(v)}.`, { vars });
      st.Q.pop();
      st.cur = st.Q.length ? st.Q[st.Q.length - 1] : null;
    })(index[p.target], null);
    st.cur = null;
    const printed = st.E.map(e => e.label);
    snap(null, `Done: path(${p.target}) printed ${printed.join(', ')}, a shortest path from ${name(s)} to ${p.target}.`, { result: { ok: true, order: printed } });
    return {
      frames: t.frames, code: pathCode, ids: t.ids, adj: t.adj, qName: 'Running stack (top is at the top)', tokenLabel: v => `path(${t.ids[v]})`, outName: 'Printed',
      sections: [{ id: 'path', title: 'path(v)', slide: '4L46', from: 1, to: 4 }],
    };
  }
  Algorithms.pathPrint = {
    presets: {
      w41: preset('4L41', { key: '4L41', target: 't', title: 'path(t) on the graph of slide 41' }),
      w46: preset('4L46', { key: '4L46', target: 'c', title: 'path(c) on the chain of slide 46' }),
    },
    defaultPreset: 'w41',
    panels: { arrays: false, holder: false },
    modes: [{ id: 'stack', label: '' }],
    build: presetId => buildPath(presetId),
  };

  /* ---------- 4R75: the shortest even path, by BFS on the bipartite G' ---------- */
  const evenCode = [
    { n: 1, text: "1. Build the following bipartite graph: G' = (V', E') such that:" },
    { n: 2, text: "   • For all v ∈ V we make two copies in G': v⁰, v¹ ∈ V'" },
    { n: 3, text: "   • For all (u, v) ∈ E we make two copies in G':" },
    { n: 4, text: "      ◦ (u⁰, v¹) ∈ E'" },
    { n: 5, text: "      ◦ (u¹, v⁰) ∈ E'" },
    { n: 6, text: "2. Run BFS(G', s⁰)" },
    { n: 7, text: '3. For all v ∈ V, return the label of v⁰ (it equals d(s⁰, v⁰)).' },
  ];
  const sup = id => id.slice(0, -1) + (id.endsWith('0') ? '⁰' : '¹');
  function evenPreset() {
    const g = G['4R74'], ids = g.nodes.map(n => n[0]);
    const gp = GraphLogic.evenGraph(ids, g.edges);
    /* Two columns, as drawn on 4R74 */
    const nodes = ids.flatMap((v, k) => [[v + '0', 150, 30 + k * 75], [v + '1', 350, 30 + k * 75]]);
    const adj = Object.fromEntries(gp.ids.map(v => [v, []]));
    gp.edges.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
    return { title: "G' for the graph of slide 74", width: 500, height: 290, undirected: true, nodes, adj, start: 's0',
      labels: Object.fromEntries(gp.ids.map(v => [v, sup(v)])), base: { ids, edges: g.edges } };
  }
  function buildEven() {
    const p = Algorithms.evenPath.presets.g74;
    const t = tracer(p);
    const { adj, edgeId, st, snap, name, index } = t;
    const { ids: V, edges: E } = p.base;
    const nodeStates = Object.fromEntries(t.ids.map(id => [id, 'gone']));
    const edgeStates = {};
    t.ids.forEach((id, a) => adj[a].forEach(b => { edgeStates[edgeId(a, b)] = 'removed'; }));
    const sync = () => { st.extra.nodeStates = { ...nodeStates }; st.extra.edgeStates = { ...edgeStates }; st.extra.badges = t.ids.map((_, v) => (st.D[v] == null ? '' : st.D[v])); };
    sync();
    snap(1, "Build G' from G. G has the vertices " + V.join(', ') + ` and ${E.length} edges.`);
    V.forEach(v => {
      delete nodeStates[v + '0']; delete nodeStates[v + '1']; sync();
      snap(2, `Two copies of ${v}: ${sup(v + '0')} and ${sup(v + '1')}.`, { vars: [`v = ${v}`] });
    });
    E.forEach(([u, v]) => {
      snap(3, `The edge (${u}, ${v}) of G gets two copies.`, { vars: [`(u, v) = (${u}, ${v})`] });
      const e1 = edgeId(index[u + '0'], index[v + '1']), e2 = edgeId(index[u + '1'], index[v + '0']);
      delete edgeStates[e1]; sync();
      snap(4, `(${sup(u + '0')}, ${sup(v + '1')}): from side 0 to side 1.`, { vars: [`(u, v) = (${u}, ${v})`], activeEdge: e1 });
      delete edgeStates[e2]; sync();
      snap(5, `(${sup(u + '1')}, ${sup(v + '0')}): from side 1 to side 0.`, { vars: [`(u, v) = (${u}, ${v})`], activeEdge: e2 });
    });
    /* 2. BFS(G', s0): one frame per dequeue and per new label, all on line 6 */
    const s = index[p.start];
    st.D[s] = 0; st.ready.add(s); st.Q.push(s); sync();
    snap(6, `G' has ${t.ids.length} vertices and ${2 * E.length} edges. BFS starts: label(s⁰) = 0, and s⁰ is enqueued.`, { enq: s, changed: s });
    while (st.Q.length) {
      const i = st.Q.shift();
      st.holding = i; st.cur = i;
      const found = [];
      snap(6, `Dequeue ${sup(name(i))}.`, { noCount: true, vars: [`i = ${sup(name(i))}`] });
      adj[i].forEach(j => {
        if (st.ready.has(j)) return;
        st.ready.add(j); st.D[j] = st.D[i] + 1; st.Q.push(j); st.tree.push(edgeId(i, j)); found.push(j); sync();
        snap(6, `${sup(name(j))} is not labeled: label(${sup(name(j))}) = ${st.D[j]}, enqueue it.`, { noCount: true, vars: [`i = ${sup(name(i))}`], target: j, activeEdge: edgeId(i, j), enq: j, changed: j });
      });
      if (!found.length) snap(6, `Every neighbor of ${sup(name(i))} is already labeled.`, { noCount: true, vars: [`i = ${sup(name(i))}`] });
    }
    st.holding = null; st.cur = null;
    snap(6, 'Q is empty: BFS is done.', { noCount: true });
    const answer = [];
    V.forEach(v => {
      const x = index[v + '0'];
      const lab = st.D[x];
      st.E.push({ label: `${v}: ${lab == null ? 'none' : lab}`, node: v + '0' });
      answer.push(`${v}:${lab}`);
      snap(7, lab == null
        ? `${sup(v + '0')} has no label: no path from s to ${v} has an even number of edges.`
        : `Return label(${sup(v + '0')}) = ${lab}: the shortest even path from s to ${v} has ${lab} edges.`, { vars: [`v = ${v}`], target: x });
    });
    snap(null, `Done: ${answer.map(a => a.replace(':', ' → ')).join(', ')}.`, { result: { ok: true, order: answer } });
    return {
      frames: t.frames, code: evenCode, ids: t.ids, adj: t.adj, holderName: 'Dequeued', outName: 'Returned (label of v⁰)',
      tokenLabel: v => sup(t.ids[v]),
      sections: [{ id: 'even', title: 'Exercise 2: the algorithm', slide: '4R75', from: 1, to: 7 }],
    };
  }
  Algorithms.evenPath = {
    presets: { g74: evenPreset() }, defaultPreset: 'g74',
    panels: { arrays: false },
    modes: [{ id: 'queue', label: '' }],
    build: () => buildEven(),
  };
})();
