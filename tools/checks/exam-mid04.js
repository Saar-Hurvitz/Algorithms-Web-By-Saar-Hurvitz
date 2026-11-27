// Exam mid04 (Exams/MidTermExams/mid04sol.pdf): every official answer, compared with
// what the page's visualizations compute. `key` is the answer key in past-exams/mid04/mid04.js.
module.exports = ({ eq, L, G, A, key }) => {
const ids = k => G[k].nodes.map(n => n[0]);
const we = k => G[k].edges.map(([a, b], i) => [a, b, G[k].weights[i]]);
const last = frames => frames[frames.length - 1];
const edgesTo = (pi, s, v) => L.pathByPi(pi, s, v).length - 1;

// ---- A1: Bellman-Ford, v final in sweep 2 → the path has at least 2 edges
const finalSweep = k => { const r = L.bellmanFordRun(ids(k), we(k), 's', false); return 1 + r.sweeps.map(x => x.changed.includes('v')).lastIndexOf(true); };
const bfEdges = k => edgesTo(L.bellmanFordRun(ids(k), we(k), 's', false).pi, 's', 'v');
eq('A1 example 1: v final in sweep 2, path of 2 edges', [finalSweep('2004E1a'), bfEdges('2004E1a')], [2, 2]);
eq('A1 example 2: v final in sweep 2, path of 3 edges', [finalSweep('2004E1b'), bfEdges('2004E1b')], [2, 3]);
eq('A1 a 1-edge path is final in sweep 1 (s→v alone)', finalSweep('2004E1a') > 1 && L.bellmanFordRun(['s', 'v'], [['s', 'v', 4]], 's', false).sweeps[0].changed.includes('v'), true);
eq('A1 key = option 2 ("at least 2")', key['x04-a1'], 1);

// ---- A2: DFS marks u from v; BFS labels can be equal
const g2 = G['2004E2'], d2 = L.dfsRun(g2.lists, 's'), b2 = L.bfsRun(g2.lists, 's');
eq('A2 DFS(s): v marked first, (v,u) a tree edge', [d2.order.join(''), d2.tree.some(([a, b]) => a === 'v' && b === 'u')], ['svu', true]);
eq('A2 BFS(s): label(u) = label(v) = 1', [b2.label.u, b2.label.v], [1, 1]);
eq('A2 key = option 3 (can be equal)', key['x04-a2'], 2);

// ---- A3: Dijkstra, d.v goes down 4 times → in-degree at least 4
const drops = k => { const r = L.dijkstraRun(ids(k), we(k), 's'); let prev = Infinity, n = 0; r.steps.forEach(s => { if (s.d.v < prev) { n++; prev = s.d.v; } }); return n; };
const dropsAnim = p => { const f = last(A.dijkstra.build(p, 'pq').frames); return f.vars.find(x => /went down/.test(x)); };
const indeg = k => G[k].edges.filter(([, b]) => b === 'v').length;
eq('A3 example 1: v.d goes down 4 times, in-degree 4', [drops('2004E3a'), indeg('2004E3a')], [4, 4]);
eq('A3 example 2: v.d goes down 4 times, in-degree 5', [drops('2004E3b'), indeg('2004E3b')], [4, 5]);
eq('A3 the animation counts the same', [dropsAnim('x04c'), dropsAnim('x04d')], ['v.d went down 4 times', 'v.d went down 4 times']);
eq('A3 key = option 2 ("at least 4")', key['x04-a3'], 1);

// ---- A4: ABDC is a topological sort, from the stack version, never from the queue
const topo = (mode, lists) => last(A.toposort.build('x04', mode, { lists }).frames).result.order.join('');
eq('A4 ABDC is a topological sort of the exam graph', G['2004E4'].edges.every(([a, b]) => 'ABDC'.indexOf(a) < 'ABDC'.indexOf(b)), true);
eq('A4 stack: ABDC (lists A: C, B); queue: ACBD', [topo('stack', 'slide'), topo('queue', 'slide')], ['ABDC', 'ACBD']);
eq('A4 reversed lists: stack ACBD, queue ABCD (never ABDC)', [topo('stack', 'reversed'), topo('queue', 'reversed')], ['ACBD', 'ABCD']);
eq('A4 key = option 2 (stack)', key['x04-a4'], 1);

// ---- A5: Floyd-Warshall, δ(i,j) unchanged from δ⁵ on
const fw = L.floydWarshall(ids('2004E5'), we('2004E5')), I5 = ids('2004E5').indexOf('7'), J5 = ids('2004E5').indexOf('8');
const seq5 = fw.steps.map(M => M[I5][J5]);
eq('A5 vertex order 1..8 in the matrix', ids('2004E5').join(), '1,2,3,4,5,6,7,8');
eq('A5 δᵏ(7,8): ∞ until δ⁴, 2 from δ⁵ to δ⁸', seq5, [Infinity, Infinity, Infinity, Infinity, Infinity, 2, 2, 2, 2]);
const sp5 = L.allShortestPaths(ids('2004E5'), we('2004E5'), '7', '8').map(p => p.join('-'));
eq('A5 two shortest paths, one through 6: options 1 and 2 false, 3 true', sp5.sort(), ['7-5-8', '7-6-8']);
eq('A5 key = option 3', key['x04-a5'], 2);

// ---- A6: an Euler cycle that is Hamiltonian only on the cycle
const hamTour = k => { const t = L.eulerTour(ids(k), G[k].edges, false); return new Set(t.vertices.slice(0, -1)).size === t.vertices.length - 1 && t.edges.length === ids(k).length; };
eq('A6 Euler cycle is Hamiltonian: C₅ yes, K₅ no, two triangles no', ['2004E6a', '2004E6b', '2004E6c'].map(hamTour), [true, false, false]);
eq('A6 all three have an Euler cycle', ['2004E6a', '2004E6b', '2004E6c'].map(k => L.eulerStatus(ids(k), G[k].edges, false).kind), ['cycle', 'cycle', 'cycle']);
eq('A6 key = option 2 (a cycle)', key['x04-a6'], 1);

// ---- A7: the drawn tree is neither a DFS(s) nor a BFS(s) tree
const g7 = G['2004E7'];
eq('A7 the drawn tree is a spanning tree of the graph', L.treeStatus(ids('2004E7'), g7.tree).tree && g7.tree.every(([a, b]) => g7.edges.some(([x, y]) => (x === a && y === b) || (x === b && y === a))), true);
eq('A7 no BFS(s) tree equals it', L.allBfsTrees(ids('2004E7'), g7.edges, 's').some(t => L.sameTree(t, g7.tree)), false);
eq('A7 no DFS(s) tree equals it', L.allDfsTrees(ids('2004E7'), g7.edges, 's').some(t => L.sameTree(t, g7.tree)), false);
eq('A7 key = option 1 (neither)', key['x04-a7'], 0);

// ---- B1: a DFS leaf need not be a BFS leaf
const g8 = G['2004E8'];
eq('B1 4-cycle: a counterexample exists when the runs order neighbors differently', !!L.leafGap(ids('2004E8'), g8.edges, 'S', false), true);
eq('B1 note: no counterexample on the 4-cycle with the same lists in both runs', L.leafGap(ids('2004E8'), g8.edges, 'S', true), null);
eq('B1 key = false', key['x04-b1'], false);

// ---- B2: a unique BFS tree, yet a cycle
const g46 = G['6R46'];
eq('B2 triangle: one BFS tree, and a cycle', [L.allBfsTrees(ids('6R46'), g46.edges, g46.start).length, !!L.undirectedCycle(ids('6R46'), g46.edges)], [1, true]);
eq('B2 key = false', key['x04-b2'], false);

// ---- B3: Σdeg = 2(n−5) → not connected
let minComps = Infinity;
for (let n = 6; n <= 16; n++) for (let t = 0; t < 200; t++) {
  const v = Array.from({ length: n }, (_, i) => String(i + 1)), all = v.flatMap((a, i) => v.slice(i + 1).map(b => [a, b])), e = [];
  while (e.length < n - 5) e.push(all.splice(Math.floor(Math.random() * all.length), 1)[0]);
  minComps = Math.min(minComps, L.components(v, e, false).length);
}
eq('B3 random simple graphs with m = n − 5 (n = 6..16): at least 5 components', minComps >= 5, true);
eq('B3 key = true', key['x04-b3'], true);

// ---- B4: binary De Bruijn sequences have as many 0s as 1s
eq('B4 n = 2..6: valid sequences with equal 0s and 1s', [2, 3, 4, 5, 6].map(n => { const s = L.deBruijnSequence(2, n); return L.isDeBruijn(s, 2, n) && s.split('0').length - 1 === s.length / 2; }), [true, true, true, true, true]);
eq('B4 key = true', key['x04-b4'], true);

// ---- B5: the DAG algorithm relaxes each edge once
const dag = A.dagSP.build('g11'), m11 = G['5L11'].edges.length;
eq('B5 5L11: relax(u,v) runs once per edge (animation line 8)', last(dag.frames).counts[8], m11);
eq('B5 5L11: relax calls in the logic = m', L.dagShortestPaths(ids('5L11'), we('5L11'), 's').relaxes, m11);
eq('B5 key = true', key['x04-b5'], true);

// ---- B6: spanning trees on {1..5} with 1 a leaf = 4³
const v5 = ['1', '2', '3', '4', '5'], k5 = v5.flatMap((a, i) => v5.slice(i + 1).map(b => [a, b]));
const trees = L.spanningTrees(v5, k5).map(t => t.map(i => k5[i])), leaf1 = trees.filter(t => t.filter(e => e.includes('1')).length === 1);
eq('B6 125 spanning trees, 64 = 4³ with 1 a leaf', [trees.length, leaf1.length], [125, 64]);
eq('B6 their words avoid 1 and are all different', [leaf1.every(t => !L.pruferCode(v5, t).includes('1')), new Set(leaf1.map(t => L.pruferCode(v5, t))).size], [true, 64]);
eq('B6 key = true', key['x04-b6'], true);
};
