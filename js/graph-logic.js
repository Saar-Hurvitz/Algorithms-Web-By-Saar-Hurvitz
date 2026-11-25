/* ==========================================================================
   GraphLogic: pure graph computations (no DOM) behind every exercise.
   Answers are always computed from a graph's edges, never typed in by hand.
   Graph format: ids = ['A','B',…], edges = [['A','B'], …]
   ========================================================================== */
window.GraphLogic = (function () {
  /* Edges that point left in a proposed order (empty list = valid topo-sort, slides 57-58) */
  function leftEdges(order, edges) {
    const pos = Object.fromEntries(order.map((v, i) => [v, i]));
    return edges.filter(([u, v]) => pos[u] >= pos[v]);
  }

  /* Number of valid topological orders (0 when the graph has a cycle) */
  function countTopoOrders(ids, edges) {
    const D = Object.fromEntries(ids.map(v => [v, 0]));
    edges.forEach(([, v]) => { D[v] += 1; });
    const used = new Set();
    let count = 0;
    (function rec() {
      if (used.size === ids.length) { count += 1; return; }
      for (const v of ids) {
        if (used.has(v) || D[v] !== 0) continue;
        used.add(v);
        edges.forEach(([a, b]) => { if (a === v) D[b] -= 1; });
        rec();
        edges.forEach(([a, b]) => { if (a === v) D[b] += 1; });
        used.delete(v);
      }
    })();
    return count;
  }

  /* Vertices of `remaining` with no incoming edge from `remaining` */
  function sources(remaining, edges) {
    const set = new Set(remaining);
    const blocked = new Set(edges.filter(([u, v]) => set.has(u) && set.has(v)).map(([, v]) => v));
    return remaining.filter(v => !blocked.has(v));
  }

  /* A directed cycle inside `remaining`, as a vertex list [v1, …, vk, v1]; null if none */
  function findCycle(remaining, edges) {
    const set = new Set(remaining);
    const out = v => edges.filter(([a, b]) => a === v && set.has(b)).map(e => e[1]);
    const state = {};
    const stack = [];
    let found = null;
    function dfs(v) {
      state[v] = 1; stack.push(v);
      for (const w of out(v)) {
        if (found) return;
        if (state[w] === 1) { found = stack.slice(stack.indexOf(w)).concat(w); return; }
        if (!state[w]) dfs(w);
      }
      stack.pop(); state[v] = 2;
    }
    for (const v of remaining) { if (!state[v] && !found) dfs(v); }
    return found;
  }

  /* reach[u][v] = is there a path from u to v (every vertex reaches itself) */
  function reachability(ids, edges, directed) {
    const reach = {};
    ids.forEach(u => {
      reach[u] = { [u]: true };
      const stack = [u];
      while (stack.length) {
        const x = stack.pop();
        edges.forEach(([a, b]) => {
          const nexts = [];
          if (a === x) nexts.push(b);
          if (!directed && b === x) nexts.push(a);
          nexts.forEach(y => { if (!reach[u][y]) { reach[u][y] = true; stack.push(y); } });
        });
      }
    });
    return reach;
  }

  /* Connected components (undirected) or strongly connected components (directed) */
  function components(ids, edges, directed) {
    const reach = reachability(ids, edges, directed);
    const seen = new Set();
    const out = [];
    ids.forEach(u => {
      if (seen.has(u)) return;
      const comp = ids.filter(v => reach[u][v] && reach[v][u]);
      comp.forEach(v => seen.add(v));
      out.push(comp);
    });
    return out;
  }

  /* 2-coloring. Returns { ok:true, color } or { ok:false, oddCycle:[v1,…,v1] } */
  function bipartition(ids, edges) {
    const adj = Object.fromEntries(ids.map(v => [v, []]));
    edges.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
    const color = {}, parent = {};
    for (const s of ids) {
      if (s in color) continue;
      color[s] = 0; parent[s] = null;
      const queue = [s];
      while (queue.length) {
        const x = queue.shift();
        for (const y of adj[x]) {
          if (!(y in color)) { color[y] = 1 - color[x]; parent[y] = x; queue.push(y); }
          else if (color[y] === color[x]) {
            const up = v => { const p = []; for (let c = v; c != null; c = parent[c]) p.push(c); return p; };
            const px = up(x), py = up(y);
            const meet = px.find(v => py.includes(v));
            const a = px.slice(0, px.indexOf(meet) + 1);
            const b = py.slice(0, py.indexOf(meet)).reverse();
            return { ok: false, oddCycle: a.concat(b, x) };
          }
        }
      }
    }
    return { ok: true, color };
  }

  /* ---------- Week 2: Euler, De Bruijn, Hamilton ---------- */

  /* deg(v) in an undirected graph. A self-loop counts twice (slide 2L19). */
  function degrees(ids, edges) {
    const d = Object.fromEntries(ids.map(v => [v, 0]));
    edges.forEach(([a, b]) => { d[a] += 1; d[b] += 1; });
    return d;
  }

  function inOutDegrees(ids, edges) {
    const inD = Object.fromEntries(ids.map(v => [v, 0]));
    const outD = Object.fromEntries(ids.map(v => [v, 0]));
    edges.forEach(([a, b]) => { outD[a] += 1; inD[b] += 1; });
    return { inD, outD };
  }

  function oddVertices(ids, edges) {
    const d = degrees(ids, edges);
    return ids.filter(v => d[v] % 2 === 1);
  }

  /* Connected, ignoring direction and isolated vertices (remarks on 2L15, 2L16, 2L26) */
  function connectedExceptIsolated(ids, edges) {
    const touched = ids.filter(v => edges.some(([a, b]) => a === v || b === v));
    if (touched.length < 2) return true;
    const reach = reachability(ids, edges, false);
    return touched.every(v => reach[touched[0]][v]);
  }

  /* What 2L15, 2L16 and 2L26 say about a graph.
     kind: 'cycle' | 'path' | 'none'. reason: 'disconnected' | 'odd' | 'balance' | null.
     Undirected: odd = odd-degree vertices. Directed: bad = vertices with dout ≠ din;
     for a path, a has dout = din + 1 and b has dout + 1 = din. */
  function eulerStatus(ids, edges, directed) {
    const connected = connectedExceptIsolated(ids, edges);
    if (directed) {
      const { inD, outD } = inOutDegrees(ids, edges);
      const bad = ids.filter(v => inD[v] !== outD[v]);
      const a = bad.filter(v => outD[v] === inD[v] + 1);
      const b = bad.filter(v => outD[v] + 1 === inD[v]);
      if (!connected) return { kind: 'none', reason: 'disconnected', connected, bad, inD, outD };
      if (!bad.length) return { kind: 'cycle', reason: null, connected, bad, inD, outD };
      if (bad.length === 2 && a.length === 1 && b.length === 1) return { kind: 'path', reason: null, connected, bad, a: a[0], b: b[0], inD, outD };
      return { kind: 'none', reason: 'balance', connected, bad, inD, outD };
    }
    const odd = oddVertices(ids, edges);
    if (!connected) return { kind: 'none', reason: 'disconnected', connected, odd };
    if (!odd.length) return { kind: 'cycle', reason: null, connected, odd };
    if (odd.length === 2) return { kind: 'path', reason: null, connected, odd };
    return { kind: 'none', reason: 'odd', connected, odd };
  }

  /* An Euler tour of the edges, by merging cycles.
     Returns { vertices: [v0, …, vk], edges: [edge indices, in order] } or null. */
  function eulerTour(ids, edges, directed) {
    const st = eulerStatus(ids, edges, directed);
    if (st.kind === 'none' || !edges.length) return null;
    const list = edges.slice();
    let start = ids.find(v => edges.some(([a, b]) => a === v || b === v));
    let extra = -1;
    if (st.kind === 'path') {
      const [from, to] = directed ? [st.b, st.a] : st.odd;   // the added edge (a,b) of 2L16
      list.push([from, to]);
      extra = list.length - 1;
      start = to;
    }
    const inc = Object.fromEntries(ids.map(v => [v, []]));
    list.forEach(([a, b], i) => { inc[a].push(i); if (!directed && a !== b) inc[b].push(i); });
    const used = list.map(() => false);
    const seqV = [], seqE = [];
    (function visit(v, viaEdge) {
      for (const i of inc[v]) {
        if (used[i]) continue;
        used[i] = true;
        const [a, b] = list[i];
        visit(a === v ? b : a, i);
      }
      seqV.push(v);
      if (viaEdge != null) seqE.push(viaEdge);
    })(start, null);
    seqV.reverse(); seqE.reverse();
    if (extra < 0) return { vertices: seqV, edges: seqE };
    const j = seqE.indexOf(extra);    // delete the added edge: the walk starts just after it
    return {
      vertices: seqV.slice(j + 1).concat(seqV.slice(1, j + 1)),
      edges: seqE.slice(j + 1).concat(seqE.slice(0, j)),
    };
  }

  /* Exhaustive search, the only method 2L37 offers. Returns [v1, …, vn, v1] or null. */
  function hamiltonianCycle(ids, edges, directed) {
    if (ids.length < 3 && !directed) return null;
    const has = (a, b) => a !== b && edges.some(([x, y]) => (x === a && y === b) || (!directed && x === b && y === a));
    const path = [ids[0]], seen = new Set(path);
    const extend = () => {
      const last = path[path.length - 1];
      if (path.length === ids.length) return has(last, path[0]);
      for (const w of ids) {
        if (seen.has(w) || !has(last, w)) continue;
        path.push(w); seen.add(w);
        if (extend()) return true;
        path.pop(); seen.delete(w);
      }
      return false;
    };
    return extend() ? path.concat(path[0]) : null;
  }

  /* G(σ,n) as defined on 2L28: vertices are the words of length n-1, edges the words of length n */
  function deBruijnGraph(sigma, n) {
    const words = len => {
      let out = [''];
      for (let i = 0; i < len; i++) out = out.flatMap(w => Array.from({ length: sigma }, (_, c) => w + c));
      return out;
    };
    const ids = words(n - 1);
    const edges = words(n).map(word => ({ word, from: word.slice(0, n - 1), to: word.slice(1) }));
    return { ids, edges };
  }

  /* All words of length n read around the circular sequence (indices modulo L, 2L27) */
  function cyclicWindows(seq, n) {
    const twice = seq + seq;
    return Array.from({ length: seq.length }, (_, i) => twice.slice(i, i + n));
  }

  /* Does every word of length n over {0,…,σ-1} occur exactly once? */
  function isDeBruijn(seq, sigma, n) {
    if (seq.length !== Math.pow(sigma, n)) return false;
    if ([...seq].some(c => !(+c >= 0 && +c < sigma && /\d/.test(c)))) return false;
    return new Set(cyclicWindows(seq, n)).size === seq.length;
  }

  /* ---------- Week 3: trees, roots, DFS ---------- */

  const neighbors = (ids, edges) => {
    const adj = Object.fromEntries(ids.map(v => [v, []]));
    edges.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
    return adj;
  };

  /* A simple path from a to b in an undirected graph, as vertices; null if none */
  function pathBetween(ids, edges, a, b) {
    const adj = neighbors(ids, edges);
    const parent = { [a]: null };
    const queue = [a];
    while (queue.length) {
      const x = queue.shift();
      if (x === b) break;
      adj[x].forEach(y => { if (!(y in parent)) { parent[y] = x; queue.push(y); } });
    }
    if (!(b in parent)) return null;
    const out = [];
    for (let c = b; c != null; c = parent[c]) out.unshift(c);
    return out;
  }

  /* An undirected cycle as [v1, …, vk, v1]; null if the graph has none */
  function undirectedCycle(ids, edges) {
    const adj = neighbors(ids, edges);
    const seen = new Set();
    let found = null;
    const stack = [];
    (function outer() {
      for (const s of ids) {
        if (seen.has(s) || found) continue;
        (function visit(v, from) {
          seen.add(v); stack.push(v);
          for (const w of adj[v]) {
            if (found || w === from) continue;
            if (seen.has(w)) {
              const at = stack.indexOf(w);
              if (at >= 0) { found = stack.slice(at).concat(w); return; }
              continue;
            }
            visit(w, v);
            if (found) return;
          }
          stack.pop();
        })(s, null);
      }
    })();
    return found;
  }

  /* What makes G a tree or not (3L13). */
  function treeStatus(ids, edges) {
    const comps = components(ids, edges, false);
    const connected = comps.length === 1;
    const cycle = undirectedCycle(ids, edges);
    return { tree: connected && !cycle, connected, acyclic: !cycle, cycle, components: comps };
  }

  /* Vertices from which every vertex is reachable, along the arrows (3L24) */
  function rootsOf(ids, edges) {
    const reach = reachability(ids, edges, true);
    return ids.filter(r => ids.every(v => reach[r][v]));
  }

  /* Every spanning tree: the sets of n-1 edge indices that form a tree (3R27) */
  function spanningTrees(ids, edges) {
    const n = ids.length, out = [];
    (function pick(i, chosen) {
      if (chosen.length === n - 1) {
        if (treeStatus(ids, chosen.map(k => edges[k])).tree) out.push(chosen);
        return;
      }
      if (edges.length - i < n - 1 - chosen.length) return;
      pick(i + 1, [...chosen, i]);
      pick(i + 1, chosen);
    })(0, []);
    return out;
  }

  /* One DFS run. `lists` gives each vertex's neighbors in order (3L30).
     Returns the visit order, the finish order and the tree edges in discovery order. */
  function dfsRun(lists, start) {
    const marked = new Set(), order = [], finish = [], tree = [];
    (function dfs(i) {
      marked.add(i); order.push(i);
      for (const j of lists[i]) {
        if (!marked.has(j)) { tree.push([i, j]); dfs(j); }
      }
      finish.push(i);
    })(start);
    return { order, finish, tree };
  }

  /* Every tree DFS can produce from `start`, one per choice of neighbor order
     (`for each j adjacent to i` fixes no order). Returns [[parent, child], …] lists. */
  function allDfsTrees(ids, edges, start) {
    const adj = neighbors(ids, edges), seen = new Set(), out = [];
    (function go(stack, marked, tree) {
      if (!stack.length) {
        const key = tree.map(e => e.join('-')).sort().join(' ');
        if (!seen.has(key)) { seen.add(key); out.push(tree); }
        return;
      }
      const top = stack[stack.length - 1];
      const open = adj[top].filter(x => !marked.has(x));
      if (!open.length) { go(stack.slice(0, -1), marked, tree); return; }
      open.forEach(x => go([...stack, x], new Set([...marked, x]), [...tree, [top, x]]));
    })([start], new Set([start]), []);
    return out;
  }

  /* Rooted-tree helper: is one of x, y an ancestor of the other in the tree? */
  function related(treeEdges, root) {
    const parent = { [root]: null };
    let grew = true;
    while (grew) {
      grew = false;
      treeEdges.forEach(([a, b]) => {
        if (a in parent && !(b in parent)) { parent[b] = a; grew = true; }
        else if (b in parent && !(a in parent)) { parent[a] = b; grew = true; }
      });
    }
    const up = v => { const p = []; for (let c = v; c != null; c = parent[c]) p.push(c); return p; };
    return (x, y) => up(x).includes(y) || up(y).includes(x);
  }

  /* Can one graph produce tree T1 from r1 and tree T2 from r2?
     A DFS tree leaves no edge between two different branches, so every edge of each
     tree must join an ancestor and a descendant in the other. The smallest graph
     that could work is T1 together with T2. Returns { ok, cross, extra }. */
  function dfsTreesCompatible(T1, r1, T2, r2) {
    const rel1 = related(T1, r1), rel2 = related(T2, r2);
    const same = ([a, b], [x, y]) => (a === x && b === y) || (a === y && b === x);
    const cross = [...T2.filter(([a, b]) => !rel1(a, b)).map(e => ({ edge: e, tree: 1 })),
      ...T1.filter(([a, b]) => !rel2(a, b)).map(e => ({ edge: e, tree: 2 }))];
    return { ok: !cross.length, cross, extra: T2.filter(e => !T1.some(f => same(e, f))) };
  }

  /* A Hamiltonian path, by exhaustive search; null if none. */
  function hamiltonianPath(ids, edges) {
    const adj = neighbors(ids, edges);
    for (const s of ids) {
      const path = [s], seen = new Set(path);
      const extend = () => {
        if (path.length === ids.length) return true;
        for (const w of adj[path[path.length - 1]]) {
          if (seen.has(w)) continue;
          path.push(w); seen.add(w);
          if (extend()) return true;
          path.pop(); seen.delete(w);
        }
        return false;
      };
      if (extend()) return path;
    }
    return null;
  }

  /* ---------------------------------------------------------------- Week 4 */

  /* One BFS run (4L10). `lists` gives each vertex's neighbors in order.
     Returns the dequeue order, the queue after each vertex is handled, each
     vertex's label (distance in edges, 4L31) and parent p(v) (4L38), and the
     tree edges [p(v), v] in discovery order. Unreached vertices get no label. */
  function bfsRun(lists, start) {
    const label = { [start]: 0 }, parent = { [start]: null }, order = [], queues = [], tree = [];
    const Q = [start];
    while (Q.length) {
      const i = Q.shift();
      order.push(i);
      for (const j of lists[i]) {
        if (j in label) continue;
        label[j] = label[i] + 1; parent[j] = i; tree.push([i, j]); Q.push(j);
      }
      queues.push(Q.slice());
    }
    return { order, queues, label, parent, tree };
  }

  /* The 'centralized' version (4L26): the set found in step 3 for i = 0, 1, …
     The last set is empty, which is where the algorithm stops. */
  function bfsLayers(ids, edges, s, directed = false) {
    const adj = Object.fromEntries(ids.map(v => [v, []]));
    edges.forEach(([a, b]) => { adj[a].push(b); if (!directed) adj[b].push(a); });
    const label = { [s]: 0 }, found = [];
    for (let i = 0; ; i++) {
      const layer = ids.filter(v => !(v in label) && ids.some(u => label[u] === i && adj[u].includes(v)));
      found.push(layer);
      if (!layer.length) break;
      layer.forEach(v => { label[v] = i + 1; });
    }
    return { label, found };
  }

  /* d(s,v) and a predecessor for every vertex of a weighted directed graph,
     edges [[u, v, w]]. Used only to check answers: it repeats relax(u,v) (4L44)
     over all edges until nothing changes, so it also accepts the -2 of 4L41. */
  function shortestPaths(ids, wedges, s) {
    const d = Object.fromEntries(ids.map(v => [v, Infinity])), pi = Object.fromEntries(ids.map(v => [v, null]));
    d[s] = 0;
    for (let round = 0; round < ids.length; round++) {
      let changed = false;
      for (const [u, v, w] of wedges) if (d[u] + w < d[v]) { d[v] = d[u] + w; pi[v] = u; changed = true; }
      if (!changed) return { d, pi };
    }
    return null;   // a negative cycle: no solution (4L42)
  }

  /* The vertices path(v) prints (4L46), following v.π back to s */
  function pathByPi(pi, s, v) {
    const out = [];
    for (let x = v; x != null; x = x === s ? null : pi[x]) out.unshift(x);
    return out[0] === s ? out : null;
  }

  /* DFS(G) on a directed graph (4R4): the outer loop goes over `order`, and every
     unmarked vertex starts a new tree. Returns the trees as { root, vertices, edges }. */
  function dfsForest(order, lists) {
    const marked = new Set(), trees = [];
    for (const r of order) {
      if (marked.has(r)) continue;
      const t = { root: r, vertices: [], edges: [] };
      (function visit(v) {
        marked.add(v); t.vertices.push(v);
        for (const u of lists[v]) if (!marked.has(u)) { t.edges.push([v, u]); visit(u); }
      })(r);
      trees.push(t);
    }
    return trees;
  }

  /* Exercise 1 of Recitation 4 (4R34): DFS from v; if that is not one tree, DFS
     from r, the root of the last tree. Returns what each step found. */
  function findRootAlgorithm(order, lists, v) {
    const ids = order.slice();
    const first = dfsForest([v, ...ids.filter(x => x !== v)], lists);
    if (first.length === 1) return { first, r: null, second: null, answer: v };
    const r = first[first.length - 1].root;
    const second = dfsForest([r], lists)[0];
    return { first, r, second, answer: second.vertices.length === ids.length ? r : null };
  }

  /* Exercise 2 of Recitation 4 (4R75): two copies v0, v1 of every vertex and,
     for every edge (u,v), the edges (u0,v1) and (u1,v0). */
  function evenGraph(ids, edges) {
    const vIds = ids.flatMap(v => [v + '0', v + '1']);
    const vEdges = edges.flatMap(([u, v]) => [[u + '0', v + '1'], [u + '1', v + '0']]);
    return { ids: vIds, edges: vEdges };
  }

  /* For every v, the label of v0 after BFS(G', s0): the length of a shortest
     path from s to v with an even number of edges, or null if there is none. */
  function evenDistances(ids, edges, s) {
    const g = evenGraph(ids, edges), adj = Object.fromEntries(g.ids.map(v => [v, []]));
    g.edges.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
    const run = bfsRun(adj, s + '0');
    const dist = {}, walk = {};
    ids.forEach(v => {
      const x = v + '0';
      dist[v] = x in run.label ? run.label[x] : null;
      if (dist[v] != null) {
        const p = [];
        for (let y = x; y != null; y = run.parent[y]) p.unshift(y.slice(0, -1));
        walk[v] = p;
      }
    });
    return { dist, walk, graph: g };
  }

  /* ---------------- Week 5 ---------------- */

  /* A topological order by the queue algorithm (sources in `ids` order), or null on a cycle */
  function topoOrder(ids, edges) {
    const indeg = Object.fromEntries(ids.map(v => [v, 0]));
    edges.forEach(([, b]) => { indeg[b]++; });
    const q = ids.filter(v => indeg[v] === 0), out = [];
    while (q.length) {
      const u = q.shift(); out.push(u);
      edges.filter(([a]) => a === u).forEach(([, b]) => { if (--indeg[b] === 0) q.push(b); });
    }
    return out.length === ids.length ? out : null;
  }

  const initSP = (ids, s) => {
    const d = Object.fromEntries(ids.map(v => [v, Infinity])), pi = Object.fromEntries(ids.map(v => [v, null]));
    d[s] = 0;
    return { d, pi };
  };
  /* relax(u,v) of 5L8 / 5R6. Returns true if v.d went down. */
  const relaxEdge = (d, pi, [u, v, w]) => {
    if (d[v] > d[u] + w) { d[v] = d[u] + w; pi[v] = u; return true; }
    return false;
  };

  /* Shortest paths in a DAG (5L10): every vertex in topological order relaxes its
     outgoing edges. `steps[i]` = the vertex and d after it was processed. */
  function dagShortestPaths(ids, wedges, s) {
    const order = topoOrder(ids, wedges.map(([a, b]) => [a, b]));
    if (!order) return null;
    const { d, pi } = initSP(ids, s), steps = [];
    let relaxes = 0;
    for (const u of order) {
      wedges.filter(([a]) => a === u).forEach(e => { relaxes++; relaxEdge(d, pi, e); });
      steps.push({ u, d: { ...d } });
    }
    return { order, d, pi, steps, relaxes };
  }

  /* Dijkstra (5L22): Q = V, repeatedly take a vertex with minimal d (ties: `ids` order)
     and relax its outgoing edges. */
  function dijkstraRun(ids, wedges, s) {
    const { d, pi } = initSP(ids, s), Q = ids.slice(), order = [], steps = [];
    let relaxes = 0;
    while (Q.length) {
      const u = Q.reduce((m, v) => (d[v] < d[m] ? v : m), Q[0]);
      Q.splice(Q.indexOf(u), 1); order.push(u);
      wedges.filter(([a]) => a === u).forEach(e => { relaxes++; relaxEdge(d, pi, e); });
      steps.push({ u, d: { ...d } });
    }
    return { order, d, pi, steps, relaxes };
  }

  /* Bellman-Ford (5L46-5L47): sweeps over the edges in the given order, at most n-1
     of them. With stopEarly, stop after a sweep that changes nothing (5L47).
     `sweeps[i]` = { changed: [vertices whose d went down], d } */
  function bellmanFordRun(ids, wedges, s, stopEarly = true) {
    const { d, pi } = initSP(ids, s), sweeps = [];
    for (let k = 0; k < ids.length - 1; k++) {
      const changed = [];
      wedges.forEach(e => { if (relaxEdge(d, pi, e)) changed.push(e[1]); });
      sweeps.push({ changed, d: { ...d } });
      if (stopEarly && !changed.length) break;
    }
    const updating = sweeps.filter(x => x.changed.length).length;
    return { d, pi, sweeps, updating, relaxes: sweeps.length * wedges.length };
  }

  /* The fewest updating sweeps over every order of the edges (small graphs only) */
  function bellmanFordBestOrder(ids, wedges, s) {
    let best = null;
    (function perm(rest, chosen) {
      if (!rest.length) {
        const r = bellmanFordRun(ids, chosen, s);
        if (!best || r.updating < best.updating) best = { updating: r.updating, order: chosen.slice() };
        return;
      }
      rest.forEach((e, i) => perm(rest.filter((_, j) => j !== i), [...chosen, e]));
    })(wedges, []);
    return best;
  }

  /* The "fix" of 5L44: with Δ < 0 the minimal weight, w'(e) = w(e) − Δ */
  function shiftWeights(weights) {
    const delta = Math.min(...weights);
    return { delta, weights: delta < 0 ? weights.map(w => w - delta) : weights.slice() };
  }

  /* All shortest s→t paths, as vertex lists (small graphs; no negative cycles) */
  function allShortestPaths(ids, wedges, s, t) {
    const sp = shortestPaths(ids, wedges, s);
    if (!sp || sp.d[t] === Infinity) return [];
    const out = [];
    (function back(v, tail) {
      if (v === s) { out.push([s, ...tail]); return; }
      wedges.filter(([a, b, w]) => b === v && sp.d[a] + w === sp.d[v] && !tail.includes(a) && a !== v).forEach(([a]) => back(a, [v, ...tail]));
    })(t, []);
    return out;
  }

  /* Exercise 3 of Recitation 5 (5R16): copies v0, v1 of every vertex; every edge (u,v)
     gives (u0,v0), (u1,v1) and (v0,u1), all with weight w(u,v). */
  function almostValidGraph(ids, wedges) {
    return {
      ids: [...ids.map(v => v + '0'), ...ids.map(v => v + '1')],
      wedges: wedges.flatMap(([u, v, w]) => [[u + '0', v + '0', w], [u + '1', v + '1', w], [v + '0', u + '1', w]]),
    };
  }
  /* 5R16 step 3: min(d(s0,v0), d(s0,v1)) for every v */
  function almostValidDistances(ids, wedges, s) {
    const g = almostValidGraph(ids, wedges), r = dijkstraRun(g.ids, g.wedges, s + '0');
    return Object.fromEntries(ids.map(v => [v, Math.min(r.d[v + '0'], r.d[v + '1'])]));
  }

  /* Exercise 4 of Recitation 5 (5R20): one negative edge (a,b). Dijkstra on G without
     (a,b) from s and from b, then min(d'(s,v), d'(s,a) + w(a,b) + d'(b,v)). */
  function oneNegativeEdge(ids, wedges, s) {
    const neg = wedges.find(e => e[2] < 0), [a, b, w] = neg;
    const rest = wedges.filter(e => e !== neg);
    const fromS = dijkstraRun(ids, rest, s).d, fromB = dijkstraRun(ids, rest, b).d;
    return Object.fromEntries(ids.map(v => [v, Math.min(fromS[v], fromS[a] + w + fromB[v])]));
  }

  /* ---------------------------------------------------------------- Week 6 */

  /* Bellman-Ford with the negative-cycle check of 6L13: exactly n-1 sweeps, then one
     more pass over the edges that only tests v.d > u.d + w(u,v). `flagged` = the edges
     that would print "A negative cycle exists" (an empty list = no message). */
  function bellmanFordDetect(ids, wedges, s) {
    const run = bellmanFordRun(ids, wedges, s, false);
    const flagged = wedges.filter(([u, v, w]) => run.d[v] > run.d[u] + w).map(([u, v]) => [u, v]);
    return Object.assign(run, { flagged });
  }

  /* An edge order whose first sweep already finds every distance: the edges of a
     shortest-path tree in BFS order from s, then the other edges. So the fewest
     sweeps with updates is 1 whenever some vertex other than s is reachable (the
     first sweep must update something, so no order does better). For graphs with
     too many edges to try every order (6R8 has 11). */
  function bellmanFordTreeOrder(ids, wedges, s) {
    const sp = shortestPaths(ids, wedges, s);
    if (!sp) return null;
    const order = [], seen = new Set([s]), Q = [s];
    while (Q.length) {
      const u = Q.shift();
      wedges.filter(([a, b]) => a === u && sp.pi[b] === u && !seen.has(b)).forEach(e => { order.push(e); seen.add(e[1]); Q.push(e[1]); });
    }
    const rest = wedges.filter(e => !order.includes(e));
    const all = [...order, ...rest];
    return { order: all, updating: bellmanFordRun(ids, all, s).updating };
  }

  /* Floyd-Warshall (6L22, 6L23). δ⁰(i,j) = w(i,j) if (i,j) ∈ E, ∞ if not, and 0 if
     i = j (the 0 case wins, 6L22). steps[k] is the matrix δᵏ, rows and columns in
     `ids` order (the vertices 1..n of 6L22). Step 3: δᵏ(i,j) = min{δᵏ⁻¹(i,j),
     δᵏ⁻¹(i,k) + δᵏ⁻¹(k,j)}. */
  function floydWarshall(ids, wedges) {
    const n = ids.length, at = Object.fromEntries(ids.map((v, i) => [v, i]));
    const D0 = ids.map((_, i) => ids.map((__, j) => (i === j ? 0 : Infinity)));
    wedges.forEach(([a, b, w]) => { if (a !== b) D0[at[a]][at[b]] = w; });
    const steps = [D0];
    for (let k = 0; k < n; k++) {
      const P = steps[k];
      steps.push(P.map((row, i) => row.map((x, j) => Math.min(x, P[i][k] + P[k][j]))));
    }
    const last = steps[n];
    return { steps, d: last, negative: ids.some((_, i) => last[i][i] < 0) };
  }

  /* Gas stations (6L41): two copies; (u0,v0) and (u1,v1) for every edge, and (u0,u1)
     of weight 0 for every u ∈ U. */
  function gasStationsGraph(ids, wedges, U) {
    return {
      ids: [...ids.map(v => v + '0'), ...ids.map(v => v + '1')],
      wedges: [...wedges.map(([u, v, w]) => [u + '0', v + '0', w]), ...wedges.map(([u, v, w]) => [u + '1', v + '1', w]), ...U.map(u => [u + '0', u + '1', 0])],
    };
  }
  /* 6L41 step 3: d_U(s,v) = d(s0, v1) */
  function gasStationsDistances(ids, wedges, U, s) {
    const g = gasStationsGraph(ids, wedges, U), r = dijkstraRun(g.ids, g.wedges, s + '0');
    return Object.fromEntries(ids.map(v => [v, r.d[v + '1']]));
  }

  /* Dijkstra Pizza (6L52): a new vertex `s` with 0-weight edges to every w ∈ W, and
     every edge of G reversed. The new vertex goes first. */
  function pizzaGraph(ids, wedges, W, s = 's') {
    return { ids: [s, ...ids], wedges: [...W.map(w => [s, w, 0]), ...wedges.map(([u, v, w]) => [v, u, w])] };
  }
  /* 6L52 step 3: the distance from v to the closest branch is d(s,v) in G′ */
  function pizzaDistances(ids, wedges, W, s = 's') {
    const g = pizzaGraph(ids, wedges, W, s), r = dijkstraRun(g.ids, g.wedges, s);
    return Object.fromEntries(ids.map(v => [v, r.d[v]]));
  }

  /* The tax of Exercise 3 (6R35): the last edge of a path with an odd number of
     edges costs double. `ws` = the weights of the path's edges, in order. */
  const taxedCost = ws => ws.reduce((a, b) => a + b, 0) + (ws.length % 2 ? ws[ws.length - 1] : 0);
  /* 6R38: three copies. (v0,u1) and (v1,u0) of weight w(v,u), and (v0,u2) of weight
     2·w(v,u), for every edge (v,u). */
  function taxGraph(ids, wedges) {
    return {
      ids: [...ids.map(v => v + '1'), ...ids.map(v => v + '0'), ...ids.map(v => v + '2')],
      wedges: wedges.flatMap(([v, u, w]) => [[v + '0', u + '1', w], [v + '1', u + '0', w], [v + '0', u + '2', 2 * w]]),
    };
  }
  /* 6R40 step 3: min{d(s0,v0), d(s0,v2)} */
  function taxDistances(ids, wedges, s) {
    const g = taxGraph(ids, wedges), r = dijkstraRun(g.ids, g.wedges, s + '0');
    return Object.fromEntries(ids.map(v => [v, Math.min(r.d[v + '0'], r.d[v + '2'])]));
  }
  /* The WRONG solution of 6R37: a shortest path in G (Dijkstra), then, if it has an
     odd number of edges (found by backtracking with π), add its last edge again. */
  function taxNaive(ids, wedges, s) {
    const r = dijkstraRun(ids, wedges, s);
    return Object.fromEntries(ids.map(v => {
      const p = pathByPi(r.pi, s, v);
      if (!p) return [v, Infinity];
      const ws = p.slice(1).map((x, i) => wedges.find(([a, b]) => a === p[i] && b === x)[2]);
      return [v, taxedCost(ws)];
    }));
  }
  /* The cheapest taxed cost over every simple path (small graphs only; used only to check
     answers). A walk that repeats a vertex can be cheaper, even with non-negative weights:
     an odd cycle flips the parity of the edge count. taxDistances covers walks, so the two
     agree only on graphs where no such walk wins, as on 6R36. */
  function taxBrute(ids, wedges, s) {
    const best = Object.fromEntries(ids.map(v => [v, v === s ? 0 : Infinity]));
    (function walk(v, seen, ws) {
      if (ws.length) best[v] = Math.min(best[v], taxedCost(ws));
      wedges.filter(([a, b]) => a === v && !seen.has(b)).forEach(([, b, w]) => walk(b, new Set([...seen, b]), [...ws, w]));
    })(s, new Set([s]), []);
    return best;
  }

  return {
    topoOrder, dagShortestPaths, dijkstraRun, bellmanFordRun, bellmanFordBestOrder, shiftWeights, allShortestPaths,
    almostValidGraph, almostValidDistances, oneNegativeEdge,
    bellmanFordDetect, bellmanFordTreeOrder, floydWarshall, gasStationsGraph, gasStationsDistances, pizzaGraph, pizzaDistances,
    taxedCost, taxGraph, taxDistances, taxNaive, taxBrute,
    bfsRun, bfsLayers, shortestPaths, pathByPi, dfsForest, findRootAlgorithm, evenGraph, evenDistances,
    leftEdges, countTopoOrders, sources, findCycle, reachability, components, bipartition,
    degrees, inOutDegrees, oddVertices, connectedExceptIsolated, eulerStatus, eulerTour,
    hamiltonianCycle, deBruijnGraph, cyclicWindows, isDeBruijn,
    pathBetween, undirectedCycle, treeStatus, rootsOf, spanningTrees, dfsRun, allDfsTrees,
    dfsTreesCompatible, hamiltonianPath,
  };
})();
