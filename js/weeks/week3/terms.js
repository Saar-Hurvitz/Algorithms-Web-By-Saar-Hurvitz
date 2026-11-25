/* Week 3 terms: [[id]] / [[id|text]] in an entry body.
   aliases = words the page's checker looks for in later entries. */
window.TERMS_W3 = {
  'polynomial-time': { name: 'Polynomial time', short: 'Running time $O(n^p)$ for some constant $p$. This is what the course calls efficient.', slide: '3L7', aliases: ['polynomial time', 'poly-time'] },
  tree: { name: 'Tree (undirected)', short: 'An undirected graph that is connected and contains no cycles.', slide: '3L13', aliases: ['tree', 'trees'] },
  root: { name: 'Root', short: 'A vertex $r$ of a directed graph from which every vertex is reachable along a directed path.', slide: '3L24', aliases: ['root', 'roots'] },
  'directed-tree': { name: 'Directed tree', short: 'A directed graph that has a root and whose underlying undirected graph is a tree.', slide: '3L24', aliases: ['directed tree', 'directed trees'] },
  'spanning-tree': { name: 'Spanning tree', short: 'For a connected undirected graph $G = (V, E)$: a set $E’ \\subseteq E$ such that $(V, E’)$ is connected and has no cycles.', slide: '3L29', aliases: ['spanning tree', 'spanning trees'] },
  dfs: { name: 'DFS (Depth First Search)', short: 'A recursive marking algorithm: mark a vertex, then call DFS on each unmarked neighbor.', slide: '3L30', aliases: ['DFS', 'depth first search', 'depth-first search'] },
  'running-stack': { name: 'Running stack', short: 'The recursive calls still in progress, drawn as a stack on 3L31. The call on top is the one running now.', slide: '3L31', aliases: ['running stack'] },
  invariant: { name: 'Invariant', short: 'A property of a program that is true before (and after) each iteration.', slide: '3L44', aliases: ['invariant'] },
  leaf: { name: 'Leaf', short: 'A node of an undirected tree whose degree is 1.', slide: '3R8', aliases: ['leaf', 'leaves'] },
  'tree-edge': { name: 'Tree edge', short: 'An edge of the spanning tree produced by DFS: it connects a node and the vertex that discovers it.', slide: '3L41', aliases: ['tree edge', 'tree edges', 'tree-edge', 'tree-edges'] },
  'back-edge': { name: 'Back edge', short: 'Any edge that is not a tree edge: it connects a node and an already-marked neighbor.', slide: '3L41', aliases: ['back edge', 'back edges', 'back-edge', 'back-edges'] },
  'dense-graph': { name: 'Dense graph', short: 'A graph with $m = \\Theta(n^2)$. The adjacency matrix is good for it.', slide: '3L47', aliases: ['dense graph', 'dense graphs'] },
  'sparse-graph': { name: 'Sparse graph', short: 'A graph with $m = O(n)$. Adjacency lists are good for it. Most practical graphs are sparse.', slide: '3L47', aliases: ['sparse graph', 'sparse graphs'] },
};
