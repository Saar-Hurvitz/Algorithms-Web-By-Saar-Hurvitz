/* Week 2 terms: [[id]] / [[id|text]] in an entry body.
   aliases = words the page's checker looks for in later entries. */
window.TERMS_W2 = {
  'start-vertex': { name: 'Start vertex', short: 'The first vertex $v_0$ of a path $v_0, v_1, …, v_k$.', slide: '2L7', aliases: ['start vertex'] },
  'end-vertex': { name: 'End vertex', short: 'The last vertex $v_k$ of a path $v_0, v_1, …, v_k$.', slide: '2L7', aliases: ['end vertex'] },
  'path-length': { name: 'Length of a path', short: 'The number of edges on the path: $k$ for $v_0, v_1, …, v_k$.', slide: '2L7', aliases: ['length of the path', 'length of a path'] },
  'euler-path': { name: 'Euler path', short: 'A path that includes each edge of the graph exactly once.', slide: '2L13', aliases: ['Euler path', 'Euler paths'] },
  'euler-cycle': { name: 'Euler cycle', short: 'An Euler path that starts and ends at the same vertex.', slide: '2L13', aliases: ['Euler cycle', 'Euler cycles'] },
  'underlying-graph': { name: 'Underlying graph', short: 'For a directed graph: the undirected graph with the same vertices and the same edges, without their direction.', slide: '2L25', aliases: ['underlying graph', 'underlying undirected graph'] },
  'de-bruijn-sequence': { name: 'De Bruijn sequence', short: 'A circular sequence of length $L = \\sigma^n$ in which every word of length $n$ over $\\Sigma$ appears exactly once.', slide: '2L27', aliases: ['De Bruijn sequence', 'De Bruijn sequences'] },
  'de-bruijn-graph': { name: 'De Bruijn graph $G_{\\sigma,n}$', short: 'Vertices: the words of length $n-1$. Edges: the words of length $n$. Edge $b_1…b_n$ goes from $b_1…b_{n-1}$ to $b_2…b_n$.', slide: '2L28', aliases: ['De Bruijn graph', 'De Bruijn graphs'] },
  'hamiltonian-cycle': { name: 'Hamiltonian cycle', short: 'A cycle which goes through each vertex of the graph exactly once.', slide: '2L35', aliases: ['Hamiltonian cycle', 'Hamiltonian cycles', 'Hamilton cycle'] },
  'hamiltonian-path': { name: 'Hamiltonian path', short: 'A path that visits each vertex of the graph exactly once.', slide: '2R30', aliases: ['Hamiltonian path', 'Hamiltonian paths', 'Hamilton path'] },
  'exhaustive-search': { name: 'Exhaustive search', short: 'Trying every candidate path. For Hamiltonian cycles this takes exponential time in the worst case.', slide: '2L37', aliases: ['exhaustive search'] },
  'tournament-graph': { name: 'Tournament graph', short: 'A complete graph with one direction on each edge: $u \\to v$ if team $u$ won against team $v$.', slide: '2L40', aliases: ['tournament graph', 'tournament graphs'] },
};
