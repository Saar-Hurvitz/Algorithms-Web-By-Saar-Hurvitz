/* Week 6 terms: [[id]] / [[id|text]] in an entry body.
   aliases = words the page's checker looks for in later entries. */
window.TERMS_W6 = {
  'nc-detection': { name: 'Negative-cycle detection (Bellman-Ford)', short: 'After |V| − 1 sweeps, for each (u,v) ∈ E: if v.d > u.d + w(u,v), print "A negative cycle exists". Theorem: a negative cycle exists iff some v.d is reduced in sweep number |V|.', slide: '6L13', aliases: ['negative-cycle detection'] },
  apsp: { name: 'All-pair shortest path', short: 'Input: a directed graph G = (V, E), V = {1, …, n}, and weights w: E → R that may be negative. Output: for any two vertices, the length of a shortest path between them.', slide: '6L20', aliases: ['all-pair shortest path', 'all-pairs shortest paths', 'all-pair'] },
  'delta-k': { name: 'δᵏ(i, j)', short: 'The length of a shortest path from i to j among all paths which may pass through vertices 1, …, k but not through k+1, …, n. δ⁰(i, j) is w(i, j) if (i, j) ∈ E, ∞ if not, and 0 if i = j.', slide: '6L22', aliases: [] },
  'floyd-warshall': { name: 'Floyd-Warshall algorithm', short: 'Init δ⁰; for k = 1, …, n, for every 1 ≤ i, j ≤ n: δᵏ(i, j) ← min{δᵏ⁻¹(i, j), δᵏ⁻¹(i, k) + δᵏ⁻¹(k, j)}. All pairs, arbitrary weights, O(n³).', slide: '6L23', aliases: ['Floyd-Warshall', 'Floyd Warshall'] },
  'graph-replication': { name: 'Graph replication', short: 'Build G′ from copies of G, each copy corresponding to some property of the paths reaching it; run an algorithm on G′; conclude something about G.', slide: '6L38', aliases: ['graph replication', 'copies of the graph'] },
  'd-u': { name: 'd_U(s, v)', short: 'Gas stations problem: the length of the shortest path from s to v that visits at least one vertex from U.', slide: '6L40', aliases: [] },
  'taxed-cost': { name: 'Taxed cost', short: 'Exercise 3 of Recitation 6: the cost of a path when the last edge of any path with an odd number of edges costs double.', slide: '6R41', aliases: ['taxed cost', 'taxed-cost'] },
};
