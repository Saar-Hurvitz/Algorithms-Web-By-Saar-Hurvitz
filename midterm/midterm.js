/* ==========================================================================
   Midterm page: the entries that Exams/mid-term_guide.pdf asks for, in the
   order of the fact sheet. Nothing here is new content: the entries are the
   same objects the weekly pages use (js/weeks/), so a fix there shows here too.

   Loaded after every js/weeks/ file and before render.js. It keeps the decks
   and terms of all weeks and replaces the weeks and parts with:
     - one group, "Midterm", whose "checklist" is the fact sheet's lines and whose
       `links` say which entries cover each line;
     - sections following the fact sheet: Definitions, Facts, Algorithms, Practice.
   A term defined in an entry that is not on this page links to the main page.
   ========================================================================== */
(function () {
  const C = window.COURSE;
  const byId = Object.fromEntries(C.parts.flatMap(p => p.entries).map(e => [e.id, e]));

  /* This page lives one folder down, so slide images are one level up */
  for (const k in C.decks) C.decks[k] = Object.assign({}, C.decks[k], { path: `../${C.decks[k].path}` });

  /* The fact sheet, line by line (paraphrased: the PDF's symbols don't survive copying),
     and the entries that cover each line */
  const sheet = [
    ['Undirected graph: G=(V,E), V=vertices, E=undirected edges.', ['graph', 'directed']],
    ['Directed graph: G=(V,E), V=vertices, E=directed edges.', ['directed']],
    ['Notation: |V|=n, |E|=m.', ['notation']],
    ['A simple graph: a graph with no parallel edges or self-loops.', ['simple', 'simple-directed']],
    ['Bipartite graph: G=(V₁∪V₂, E). For each edge e=(u,v), u∈V₁, v∈V₂. (Slide L48 writes G=(V₁, V₂, E): the same graph.)', ['bipartite']],
    ['Complete graph (clique) of size n: |V|=n and E=V×V (but no self loops). (The slides say every pair of vertices is joined by an edge, so |E| = n(n−1)/2, slide R12.)', ['families', 'r-clique']],
    ['Complete bipartite: a bipartite graph in which E=V₁×V₂.', ['complete-bipartite']],
    ['A path is a sequence of vertices v₀,v₁,…,vₖ such that (vᵢ,vᵢ₊₁)∈E for all 0≤i<k. (Slide L59 numbers them v₁,…,vₖ with 1≤i<k: the same definition.)', ['paths-cycles']],
    ['An undirected graph is connected if for any pair of vertices u,v there is a path between u and v.', ['r-connected']],
    ['A directed graph is strongly connected if for any pair of vertices u,v there is a directed path from u to v.', ['r-strongly-connected']],
    ['Undirected tree: an undirected graph is a tree if it is connected and acyclic.', ['w3-tree']],
    ['Directed tree: a directed graph that has a root and whose underlying undirected graph is a tree. r∈V is a root if for every v∈V there is a directed path from r to v.', ['w3-directed-tree']],
    ['Topological sort: a linear ordering of the vertices such that for any edge (v,w)∈E, v precedes w.', ['topological-sort']],
    ['Euler path: contains each edge exactly once. Euler cycle: an Euler path that starts and ends at the same vertex.', ['w2-euler-def']],
    ['De Bruijn sequence: for the alphabet Σ = {0, 1, …, σ−1} and L = σⁿ, a (circular) sequence a₀…a_{L−1} over Σ in which every word of length n appears at a unique i (indices modulo L).', ['w2-de-bruijn-seq']],
    ['Undirected: 2|E| = Σ deg(v). Directed: |E| = Σ in-deg(v) = Σ out-deg(v).', ['handshaking']],
    ['Any directed acyclic graph has a topological sort.', ['r-iff']],
    ['An undirected graph has an Euler cycle iff it is connected and all its vertices have even degrees.', ['w2-cycle-condition']],
    ['An undirected graph has an Euler path which is not a cycle iff it is connected and exactly two of its vertices have odd degrees.', ['w2-path-condition']],
    ['A Hamiltonian path (cycle) goes through each vertex exactly once (and returns to the starting vertex).', ['w2-hamilton']],
    ['The digraph G_{σ,n}: V = the σⁿ⁻¹ words of length n−1, E = the σⁿ words of length n; the edge b₁…bₙ goes from b₁…bₙ₋₁ to b₂…bₙ.', ['w2-de-bruijn-graph']],
    ['Algorithm for topological sort with a queue of in-degree-0 vertices, O(n+m). If all vertices are output then success, otherwise there is a cycle.', ['toposort-queue', 'analysis']],
    ['Spanning tree with DFS: DFS(i), adding (i,j) to E′ for each unmarked neighbor j.', ['w3-dfs', 'w3-st']],
    ['BFS, centralized version (label by layers).', ['w4-bfs-shortest']],
    ['Spanning tree with BFS (with a queue).', ['w4-bfs']],
    ['General shortest path method: Init, relax(u,v), repeat choose an edge and relax it.', ['w4-general']],
    ['Shortest path algorithm for acyclic graphs, O(n+m): 1. topologically sort the vertices; 2. according to the sorted order, for all u, for all v in u.nbrs, relax(u,v).', ['w5-dag', 'w5-dag-time']],
    ['Dijkstra algorithm for graphs with non-negative weights: Q is a priority queue by d; Q = V(G); while Q is not empty, u = Q.dequeue (a vertex with minimal d) and relax(u,v) for all v in u.nbrs. Time O((n+m) log n) or O(n²) or O(m + n log n) using Fibonacci heaps.', ['w5-dijkstra', 'w5-dijkstra-time']],
    ['Bellman-Ford algorithm for general graphs, O(nm): repeat n−1 times, for all edges (u,v), relax(u,v).', ['w5-bf', 'w5-bf-time']],
    ['Floyd-Warshall algorithm, all pairs, general graph, O(n³): 1. init δ⁰(i,j) = w(i,j) if (i,j)∈E, ∞ if (i,j)∉E, 0 if i=j; 2. k ← 1; 3. for every 1 ≤ i,j ≤ n compute δᵏ(i,j) ← min{δᵏ⁻¹(i,j), δᵏ⁻¹(i,k) + δᵏ⁻¹(k,j)}; 4. if k = n stop, otherwise increment k and go to step 3.', ['w6-apsp', 'w6-delta', 'w6-fw', 'w6-fw-proof']],
  ];

  const sections = [
    { id: 'D', title: 'Definitions', sub: 'The fact sheet\'s definitions, in its order', ids: ['graph', 'directed', 'notation', 'simple', 'simple-directed', 'bipartite', 'families', 'r-clique', 'complete-bipartite', 'paths-cycles', 'r-connected', 'r-strongly-connected', 'w3-tree', 'w3-directed-tree', 'topological-sort', 'w2-euler-def', 'w2-de-bruijn-seq'] },
    { id: 'F', title: 'Facts', sub: 'The fact sheet\'s facts, in its order', ids: ['handshaking', 'r-iff', 'w2-cycle-condition', 'w2-path-condition', 'w2-hamilton', 'w2-de-bruijn-graph'] },
    { id: 'A', title: 'Algorithms', sub: 'The fact sheet\'s algorithms, with their animations', ids: ['toposort-queue', 'analysis', 'w3-dfs', 'w3-st', 'w4-bfs-shortest', 'w4-bfs', 'w4-general', 'w5-dag', 'w5-dag-time', 'w5-dijkstra', 'w5-dijkstra-time', 'w5-bf', 'w5-bf-time', 'w6-apsp', 'w6-delta', 'w6-fw', 'w6-fw-proof'] },
    { id: 'P', title: 'Practice', sub: 'Exercises on the same topics', ids: ['valid-orders', 'source-removal', 'r-scc', 'w2-bridges-back', 'w2-classify', 'w2-trace', 'w2-de-bruijn-build', 'w2-euler-or-ham', 'w2-r-ex4', 'w3-dfs-hand', 'w3-r-identify', 'w3-r-find-roots', 'w3-r-ex1', 'w3-r-ex2', 'w3-r-edges', 'w3-r-ex6', 'w3-r-ex7', 'w4-bfs-hand', 'w4-label-ex', 'w4-r-ex1', 'w4-r-ex2', 'w5-sp-hand', 'w5-shift-ex', 'w5-bf-order', 'w5-r-ex2', 'w6-bf-table', 'w6-r-edges', 'w6-r-bf-run', 'w6-fw-hand', 'w6-r-ex2', 'w6-r-ex5', 'w6-r-ex3', 'w6-r-ex4'] },
  ];

  const checklist = {}, links = {};
  sheet.forEach(([text, ids], i) => {
    const key = `m${i + 1}`;
    checklist[key] = ids.length ? text : `${text} Not on the site yet: its slides have not been added.`;
    links[key] = ids;
  });

  const missing = sections.flatMap(s => s.ids).concat(sheet.flatMap(l => l[1])).filter(id => !byId[id]);
  if (missing.length) console.error('[midterm] Unknown entry ids:', missing.join(', '));

  C.sourceParts = C.parts; /* the weekly grouping, kept for tools/visual-check.js */
  C.weeks = [{ n: 'M', label: 'Midterm', title: 'The fact sheet', checklist, links }];
  C.parts = sections.map(s => ({ id: s.id, title: s.title, sub: s.sub, week: 'M', entries: s.ids.map(id => byId[id]).filter(Boolean) }));
  C.mainPage = '../index.html';
})();
