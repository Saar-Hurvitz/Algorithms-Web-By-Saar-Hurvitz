/* ==========================================================================
   Frame generators for Week 3: DFS (slide 3L30), the Spanning Tree algorithm
   (3L40), Spanning Tree with adjacency lists (3L48) and the recitation's
   DFS(G, v) (3R16). Pure logic, no DOM. See docs/ALGORITHM_ANIMATION.md.
   ========================================================================== */
window.Algorithms = window.Algorithms || {};

(function () {
  /* Each graph's list order decides the run. 3L49 draws the lecture's lists. The
     slides give no lists for the recitation graph: this order reproduces 3R18-3R26. */
  const presets = {
    lecture: {
      title: 'Lecture graph (slide 31)', width: 500, height: 290, undirected: true,
      nodes: [['8', 30, 64], ['1', 155, 64], ['2', 312, 30], ['5', 470, 88], ['3', 296, 137], ['4', 445, 211], ['6', 122, 210], ['7', 296, 260]],
      adj: { 1: ['2', '6', '7', '8'], 2: ['1', '3', '5'], 3: ['2', '4', '7'], 4: ['3', '5', '7'], 5: ['2', '4'], 6: ['1', '7'], 7: ['1', '3', '4', '6'], 8: ['1'] },
      start: '1',
    },
    recitation: {
      title: 'Recitation graph (slide 17)', width: 500, height: 290, undirected: true,
      nodes: [['1', 186, 42], ['5', 387, 73], ['4', 230, 140], ['3', 425, 175], ['2', 262, 242], ['6', 69, 200]],
      adj: { 1: ['4', '5'], 2: ['3', '4', '6'], 3: ['2', '4'], 4: ['2', '1', '3', '5', '6'], 5: ['1', '4'], 6: ['2', '4'] },
      start: '4',
    },
  };

  /* Shared state and one frame per executed line */
  function tracer(p) {
    const ids = p.nodes.map(n => n[0]);
    const index = Object.fromEntries(ids.map((id, i) => [id, i]));
    const adj = ids.map(id => p.adj[id].map(w => index[w]));
    /* Edge ids match the ones AlgoView draws: the vertex listed first comes first */
    const edgeId = (a, b) => (a < b ? `${ids[a]}>${ids[b]}` : `${ids[b]}>${ids[a]}`);
    const st = { stack: [], holding: null, marked: new Set(), tree: [], D: ids.map(() => null), ptrs: null, seen: null, cur: null, E: [] };
    const counts = {}, frames = [];
    const snap = (line, msg, extra = {}) => {
      if (line != null && !extra.noCount) counts[line] = (counts[line] || 0) + 1;
      const { noCount, ...rest } = extra;
      frames.push({
        line, msg, counts: { ...counts },
        D: st.D.slice(), Q: st.stack.slice(), out: [], holding: st.holding, cur: st.cur,
        ready: [...st.marked], tree: st.tree.slice(), gone: [], vars: [],
        ptr: null, ptrs: st.ptrs ? st.ptrs.slice() : null, seen: st.seen ? st.seen.slice() : null,
        outEdges: st.E.slice(), ...rest,
      });
    };
    return { ids, index, adj, edgeId, st, frames, snap, name: i => ids[i] };
  }

  const finishNote = 'The running stack is empty: every vertex has verified that all its neighbors are marked.';

  /* DFS(i: vertex), slide 3L30, or DFS(G, v), slide 3R16 */
  function buildDfs(p, cfg) {
    const t = tracer(p);
    const { adj, edgeId, st, snap, name } = t;
    const start = t.index[p.start];
    const L = cfg.lines;

    (function dfs(i, parent) {
      st.stack.push(i); st.cur = i;
      if (L.call != null) snap(L.call, cfg.say.call(name(i), parent == null ? null : name(parent)), { vars: [`${cfg.v} = ${name(i)}`] });
      st.marked.add(i);
      snap(L.mark, `Mark ${name(i)}.`, { vars: [`${cfg.v} = ${name(i)}`], changed: i });
      for (let k = 0; k < adj[i].length; k++) {
        const j = adj[i][k];
        const vars = [`${cfg.v} = ${name(i)}`, `${cfg.u} = ${name(j)}`];
        snap(L.loop, `Next neighbor of ${name(i)}: ${name(j)}.`, { target: j, activeEdge: edgeId(i, j), vars });
        if (st.marked.has(j)) {
          snap(L.test, `${name(j)} is already marked, so nothing happens.`, { target: j, activeEdge: edgeId(i, j), vars });
          continue;
        }
        st.tree.push(edgeId(i, j));
        snap(L.test, `${name(j)} is unmarked, so the search goes deeper from ${name(i)} to ${name(j)}.`, { target: j, activeEdge: edgeId(i, j), vars });
        if (L.call == null) snap(L.rec, `Call DFS(G, ${name(j)}). It goes on top of the running stack.`, { target: j, activeEdge: edgeId(i, j), vars });
        dfs(j, i);
        st.cur = i;
        snap(L.after, `DFS(${name(j)}) finished. Back in DFS(${name(i)}).`, { noCount: true, vars: [`${cfg.v} = ${name(i)}`] });
      }
      snap(L.loop, `${name(i)} has no neighbors left to check, so DFS(${name(i)}) ends and leaves the running stack.`, { vars: [`${cfg.v} = ${name(i)}`] });
      st.stack.pop();
      st.cur = st.stack.length ? st.stack[st.stack.length - 1] : null;
    })(start, null);

    st.cur = null;
    snap(null, `${finishNote} The edges traversed form a [[spanning-tree|spanning tree]].`, { result: { ok: true, order: st.tree.slice() } });
    return { frames: t.frames, code: cfg.code, sections: cfg.sections, ids: t.ids, adj: t.adj, qName: 'Running stack (top is at the top)', tokenLabel: v => `DFS(${t.ids[v]})` };
  }

  /* ---------- 3L30: DFS(i: vertex) ---------- */
  const dfsCode = [
    { n: 1, text: 'DFS(i : vertex)' },
    { n: 2, text: '  mark i;' },
    { n: 3, text: '  for each j adjacent to i do' },
    { n: 4, text: '    if j is unmarked then DFS(j)' },
  ];
  Algorithms.dfs = {
    presets: { lecture: presets.lecture }, defaultPreset: 'lecture',
    panels: { arrays: false, holder: false, output: false },
    modes: [{ id: 'stack', label: '' }], noBadges: true,
    build: () => buildDfs(presets.lecture, {
      v: 'i', u: 'j', code: dfsCode,
      sections: [{ id: 'dfs', title: 'DFS', slide: '3L30', from: 1, to: 4 }],
      lines: { call: 1, mark: 2, loop: 3, test: 4, rec: 4, after: 4 },
      say: { call: (v, from) => (from == null ? `Run DFS(${v}). It is the first call on the running stack.` : `Call DFS(${v}). It goes on top of the running stack.`) },
    }),
  };

  /* ---------- 3R16: DFS(G, v) ---------- */
  const rCode = [
    { n: 1, text: 'mark v as explored' },
    { n: 2, text: 'for each u adjacent to v do' },
    { n: 3, text: '  if u is unmarked then' },
    { n: 4, text: '    DFS(G, u)' },
  ];
  Algorithms.dfsRecitation = {
    presets: { recitation: presets.recitation }, defaultPreset: 'recitation',
    panels: { arrays: false, holder: false, output: false },
    modes: [{ id: 'stack', label: '' }], noBadges: true,
    build: () => buildDfs(presets.recitation, {
      v: 'v', u: 'u', code: rCode,
      sections: [{ id: 'dfs', title: 'Algorithm 1: DFS(G, v)', slide: '3R16', from: 1, to: 4 }],
      lines: { call: null, mark: 1, loop: 2, test: 3, rec: 4, after: 4 },
      say: {},
    }),
  };

  /* ---------- 3L40: Spanning Tree, DFS based ---------- */
  const stCode = [
    { n: 1, text: "E' := empty set;" },
    { n: 2, text: 'ST(s);' },
    { n: 3, text: 'ST(i: vertex)' },
    { n: 4, text: '  mark i;' },
    { n: 5, text: '  for each j adjacent to i do' },
    { n: 6, text: '    if j is unmarked then' },
    { n: 7, text: "      Add (i,j) to E';" },
    { n: 8, text: '      ST(j);' },
  ];
  function buildSt(p) {
    const t = tracer(p);
    const { adj, edgeId, st, snap, name } = t;
    const start = t.index[p.start];
    snap(1, "E' starts empty.", { vars: ['s = ' + name(start)] });
    snap(2, `Call ST on an arbitrary vertex. Here s = ${name(start)}.`, { vars: ['s = ' + name(start)] });

    (function visit(i) {
      st.stack.push(i); st.cur = i;
      const here = [`i = ${name(i)}`];
      snap(3, `ST(${name(i)}) is now running, on top of the running stack.`, { vars: here });
      st.marked.add(i);
      snap(4, `Mark ${name(i)}.`, { vars: here, changed: i });
      for (let k = 0; k < adj[i].length; k++) {
        const j = adj[i][k];
        const vars = [...here, `j = ${name(j)}`];
        snap(5, `Next neighbor of ${name(i)}: ${name(j)}.`, { target: j, activeEdge: edgeId(i, j), vars });
        if (st.marked.has(j)) { snap(6, `${name(j)} is already marked, so no edge is added.`, { target: j, activeEdge: edgeId(i, j), vars }); continue; }
        snap(6, `${name(j)} is unmarked: ${name(i)} has just discovered it.`, { target: j, activeEdge: edgeId(i, j), vars });
        st.tree.push(edgeId(i, j));
        st.E.push({ label: `(${name(i)},${name(j)})`, edge: edgeId(i, j) });
        snap(7, `Add the edge (${name(i)},${name(j)}) to E'. This is the addition to DFS.`, { target: j, activeEdge: edgeId(i, j), vars });
        snap(8, `Call ST(${name(j)}).`, { target: j, activeEdge: edgeId(i, j), vars });
        visit(j);
        st.cur = i;
        snap(8, `ST(${name(j)}) finished. Back in ST(${name(i)}).`, { noCount: true, vars: here });
      }
      snap(5, `${name(i)} has no neighbors left to check, so ST(${name(i)}) ends and leaves the running stack.`, { vars: here });
      st.stack.pop();
      st.cur = st.stack.length ? st.stack[st.stack.length - 1] : null;
    })(start);

    st.cur = null;
    snap(null, `Done: E' has ${st.E.length} edges on ${t.ids.length} vertices, and they form a [[spanning-tree|spanning tree]].`, { result: { ok: true, order: st.E.map(e => e.label) } });
    return {
      frames: t.frames, code: stCode, ids: t.ids, adj: t.adj, qName: 'Running stack (top is at the top)', tokenLabel: v => `ST(${t.ids[v]})`, outName: "E' (the spanning tree so far)",
      sections: [
        { id: 'main', title: 'Main', slide: '3L40', from: 1, to: 2 },
        { id: 'st', title: 'ST', slide: '3L40', from: 3, to: 8 },
      ],
    };
  }
  Algorithms.spanningTree = {
    presets: { lecture: presets.lecture }, defaultPreset: 'lecture',
    panels: { arrays: false, holder: false },
    modes: [{ id: 'stack', label: '' }], noBadges: true,
    build: () => buildSt(presets.lecture),
  };

  /* ---------- 3L48: Spanning Tree with adjacency lists ---------- */
  const listsCode = [
    { n: 1, text: 'G is array of adjacency lists;' },
    { n: 2, text: 'M[i] := 0 for all i;' },
    { n: 3, text: "E' is empty;" },
    { n: 4, text: 'Spanning_Tree(s);' },
    { n: 5, text: 'ST(i: vertex)' },
    { n: 6, text: '  M[i] := 1;' },
    { n: 7, text: '  v := G[i];' },
    { n: 8, text: '  while (v ≠ null)' },
    { n: 9, text: '    j := v.vertex;' },
    { n: 10, text: '    if (M[j] = 0) then' },
    { n: 11, text: "      add {i,j} to E';" },
    { n: 12, text: '      ST(j);' },
    { n: 13, text: '    v := v.next;' },
  ];
  function buildLists(p) {
    const t = tracer(p);
    const { adj, edgeId, st, snap, name } = t;
    const start = t.index[p.start];
    const n = t.ids.length;
    st.ptrs = Array(n).fill(0);
    st.seen = Array(n).fill(0);

    snap(1, 'G holds one adjacency list per vertex, drawn on the right as on slide 49.', {});
    st.D = Array(n).fill(0);
    snap(2, 'Every entry of the marking array M is 0.', {});
    snap(3, "E' starts empty.", {});
    snap(4, `Start at s = ${name(start)}. The slide calls it Spanning_Tree(s). It is the procedure ST below.`, { vars: ['s = ' + name(start)] });

    (function visit(i, from) {
      if (from != null) st.stack.push(from);
      st.holding = i; st.cur = i;
      const here = [`i = ${name(i)}`];
      snap(5, `ST(${name(i)}) is now running.${from != null ? ` ${name(from)} waits on the stack.` : ''}`, { vars: here, ptr: { owner: i, idx: st.ptrs[i], name: 'v' } });
      st.D[i] = 1; st.marked.add(i);
      snap(6, `M[${name(i)}] := 1. ${name(i)} is marked.`, { changed: i, vars: here, ptr: { owner: i, idx: st.ptrs[i], name: 'v' } });
      st.ptrs[i] = 0;
      snap(7, adj[i].length ? `v points to the first cell of the list of ${name(i)}.` : `The list of ${name(i)} is empty, so v is null.`, { vars: here, ptr: { owner: i, idx: 0, name: 'v' } });
      for (let k = 0; ; k++) {
        if (k >= adj[i].length) {
          snap(8, `v is null, so the list of ${name(i)} is finished and ST(${name(i)}) ends.`, { vars: here, ptr: { owner: i, idx: k, name: 'v' } });
          break;
        }
        snap(8, 'v is not null, so the loop runs again.', { vars: here, ptr: { owner: i, idx: k, name: 'v' } });
        const j = adj[i][k];
        st.seen[i] = k + 1;
        const vars = [...here, `j = ${name(j)}`];
        snap(9, `j := ${name(j)}, the vertex in this cell.`, { target: j, activeEdge: edgeId(i, j), vars, ptr: { owner: i, idx: k, name: 'v' } });
        if (st.D[j] === 0) {
          snap(10, `M[${name(j)}] = 0, so ${name(j)} is unmarked.`, { target: j, activeEdge: edgeId(i, j), changed: j, vars, ptr: { owner: i, idx: k, name: 'v' } });
          st.tree.push(edgeId(i, j));
          st.E.push({ label: `{${name(i)},${name(j)}}`, edge: edgeId(i, j) });
          snap(11, `Add {${name(i)},${name(j)}} to E'.`, { target: j, activeEdge: edgeId(i, j), vars, ptr: { owner: i, idx: k, name: 'v' } });
          snap(12, `Call ST(${name(j)}). ${name(i)} is pushed on the stack, and its pointer stays where it is.`, { target: j, activeEdge: edgeId(i, j), vars, ptr: { owner: i, idx: k, name: 'v' } });
          visit(j, i);
          st.holding = i; st.cur = i;
          st.stack.pop();
          snap(12, `Back in ST(${name(i)}). Its pointer is where it was left.`, { noCount: true, vars: here, ptr: { owner: i, idx: k, name: 'v' } });
        } else {
          snap(10, `M[${name(j)}] = 1, so ${name(j)} is already marked.`, { target: j, activeEdge: edgeId(i, j), changed: j, vars, ptr: { owner: i, idx: k, name: 'v' } });
        }
        st.ptrs[i] = k + 1;
        snap(13, adj[i][k + 1] != null ? 'Move v to the next cell.' : 'Move v forward. There is no next cell, so v is null.', { vars: here, ptr: { owner: i, idx: k + 1, name: 'v' } });
      }
    })(start, null);

    st.holding = null; st.cur = null;
    snap(null, `Done: the stack is empty and E' holds ${st.E.length} edges, the [[spanning-tree|spanning tree]].`, { result: { ok: true, order: st.E.map(e => e.label) } });
    return {
      frames: t.frames, code: listsCode, ids: t.ids, adj: t.adj,
      qName: 'Stack (top is at the top)', holderName: 'Running now', tokenLabel: v => t.ids[v], outName: "E'",
      arrNames: { D: 'M', A: 'G (adjacency lists)' },
      sections: [
        { id: 'main', title: 'Main', slide: '3L48', from: 1, to: 4 },
        { id: 'st', title: 'ST', slide: '3L48', from: 5, to: 13 },
      ],
    };
  }
  Algorithms.spanningTreeLists = {
    presets: { lecture: presets.lecture }, defaultPreset: 'lecture',
    panels: { arrays: true },
    modes: [{ id: 'stack', label: '' }], noBadges: true,
    build: () => buildLists(presets.lecture),
  };
})();
