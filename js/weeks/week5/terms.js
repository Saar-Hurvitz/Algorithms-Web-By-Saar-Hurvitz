/* Week 5 terms: [[id]] / [[id|text]] in an entry body.
   aliases = words the page's checker looks for in later entries. */
window.TERMS_W5 = {
  'negative-cycle': { name: 'Negative cycle', short: 'Graphs with arbitrary weights: it may be that no solution exists, in case of a negative cycle.', slide: '5L9', aliases: ['negative cycle', 'negative cycles'] },
  'dag-sp': { name: 'Shortest paths in a DAG', short: 'Compute a topological sort; for each vertex u in sorted order, relax every edge (u, v). Time O(n + m).', slide: '5L10', aliases: ['DAG shortest-paths', 'DAG-SP'] },
  'priority-queue': { name: 'Priority queue', short: 'In Dijkstra, Q is a priority queue where priority is according to the value of d: dequeue returns a vertex with minimal d.', slide: '5L22', aliases: ['priority queue'] },
  dijkstra: { name: 'Dijkstra\'s algorithm', short: 'For non-negative weights. Q ← V(G); while Q is not empty: u ← dequeue(Q), the vertex with minimal d, and relax(u, v) for all edges (u, v).', slide: '5L22', aliases: ['Dijkstra', 'Dijkstra\'s algorithm'] },
  'fibonacci-heap': { name: 'Fibonacci heap', short: 'Any sequence of x insert/decrease-key operations and y delete operations takes O(x + y log n) worst case time, n the maximum heap size.', slide: '5L42', aliases: ['Fibonacci heap', 'Fibonacci heaps'] },
  'bellman-ford': { name: 'Bellman-Ford algorithm', short: 'For arbitrary weights with no negative cycles: repeat n − 1 times: for every edge (u, v) ∈ E: relax(u, v). Time O(|E||V|).', slide: '5L46', aliases: ['Bellman-Ford', 'Bellman Ford'] },
  sweep: { name: 'Sweep', short: 'One iteration of the repeat loop of Bellman-Ford: m = |E| relax operations, first e₁, then e₂, etc.', slide: '5L47', aliases: ['sweep', 'sweeps'] },
  'property-star': { name: 'Property ∗', short: 'For a path p = e₁e₂…eₖ: the edges of p are relaxed according to their order in p.', slide: '5R12', aliases: ['property ∗'] },
  'almost-valid': { name: 'Almost-valid path', short: 'A path that traverses exactly one edge in its opposite direction (Exercise 3 of the recitation).', slide: '5R14', aliases: ['almost-valid', 'almost valid'] },
};
