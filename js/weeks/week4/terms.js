/* Week 4 terms: [[id]] / [[id|text]] in an entry body.
   aliases = words the page's checker looks for in later entries. */
window.TERMS_W4 = {
  'spanning-forest': { name: 'Spanning forest', short: 'For an unconnected graph: what we get by running DFS on every component.', slide: '4L6', aliases: ['spanning forest'] },
  bfs: { name: 'BFS (Breadth First Search)', short: 'Enqueue and mark a start vertex. While the queue is not empty, dequeue a vertex $i$, and mark and enqueue each unmarked neighbor $j$, adding $(i, j)$ to the tree.', slide: '4L10', aliases: ['BFS', 'breadth first search', 'breadth-first search'] },
  distance: { name: 'Distance $d(s, v)$', short: 'The length of a shortest path from $s$ to $v$. Without weights, length is the number of edges. With weights, it is the total weight.', slide: '4L25', aliases: ['distance', 'distances'] },
  'bfs-tree': { name: 'Directed BFS tree', short: '$T = \\{(p(v), v)\\}$, where $p(v)$ discovered $v$ in BFS. A directed spanning tree rooted in $s$ whose path to each $v$ is a shortest path in $G$.', slide: '4L38', aliases: ['BFS tree', 'directed BFS tree'] },
  'path-weight': { name: 'Weight of a path', short: 'The total of the weights of all edges on the path.', slide: '4L40', aliases: ['weight of a path', 'path weight', 'weight of the path'] },
  sssp: { name: 'Single-source shortest paths', short: 'Input: a graph, a weight function $w: E \\to R$ and a vertex $s$. Output: $d(s, v)$ for each vertex $v$.', slide: '4L40', aliases: ['single-source shortest paths', 'single-source shortest path'] },
  'anti-parallel': { name: 'Anti-parallel edges', short: 'The two edges $(u, v)$ and $(v, u)$, in opposite directions between the same two vertices.', slide: '4L42', aliases: ['anti-parallel edges', 'anti-parallel'] },
  relax: { name: 'relax(u, v)', short: 'If $v.d > u.d + w(u, v)$: set $v.d \\leftarrow u.d + w(u, v)$ and $v.\\pi \\leftarrow u$.', slide: '4L44', aliases: ['relax', 'relaxed', 'relaxing'] },
  predecessor: { name: 'Predecessor $v.\\pi$', short: 'The predecessor of $v$ (its parent). path(v) uses it to retrieve a shortest path.', slide: '4L44', aliases: ['predecessor'] },
  'dfs-forest': { name: 'DFS forest', short: 'DFS of a directed graph can result in a forest and not a tree. The forest is different for each initial root.', slide: '4R31', aliases: ['DFS forest'] },
  reduction: { name: 'Reduction', short: 'Solve a different problem and prove that solving the reduced problem is equivalent to solving the original problem.', slide: '4R73', aliases: ['reduction'] },
};
