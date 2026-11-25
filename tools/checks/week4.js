// Week 4: what the slides state, compared with what the site computes.
module.exports = ({ eq, L, G, A }) => {
const ids = k => G[k].nodes.map(n => n[0]);
const es = k => G[k].edges;
const ukey = list => list.map(([a, b]) => (a < b ? a + '-' + b : b + '-' + a)).sort().join(' ');
const dkey = list => list.map(([a, b]) => a + '>' + b).sort().join(' ');
const listsMatch = k => ids(k).every(v => G[k].lists[v].slice().sort().join() === es(k).flatMap(([a, b]) => (a === v ? [b] : !G[k].directed && b === v ? [a] : [])).sort().join());
const names = (run, list) => list.map(i => run.ids[i]);

// ---- 4L10-4L23: BFS with the adjacency lists of 4L11
eq('4L11 is the graph and lists of 3L31', JSON.stringify(G['4L11'].lists) === JSON.stringify(G['3L31'].lists) && es('4L11') === es('3L31'), true);
const lec = L.bfsRun(G['4L11'].lists, '1');
eq('4L11-22 dequeue order', lec.order.join(), '1,2,6,7,8,3,5,4');
eq('4L12-22 queue after each vertex is handled', lec.queues.map(q => q.join('')), ['2678', '67835', '7835', '8354', '354', '54', '4', '']);
eq('4L23 tree edges', ukey(lec.tree), ukey([['1', '2'], ['1', '6'], ['1', '7'], ['1', '8'], ['2', '3'], ['2', '5'], ['7', '4']]));
const bfs = A.bfs.build();
const deq = bfs.frames.filter(f => f.line === 5);
eq('4L13/15/17/19-22 queue right after each Dequeue', deq.map(f => `${bfs.ids[f.holding]}:${names(bfs, f.Q).join('')}`), ['1:', '2:678', '6:7835', '7:835', '8:354', '3:54', '5:4', '4:']);
const afterTwo = bfs.frames.findIndex(f => f.line === 5 && bfs.ids[f.holding] === '6');
eq('4L14 M for 1..8 once 2 is handled', ['1', '2', '3', '4', '5', '6', '7', '8'].map(v => bfs.frames[afterTwo].D[bfs.ids.indexOf(v)]).join(''), '11101111');
eq('4L23 E\' has n-1 edges and the queue is empty', [bfs.frames.at(-1).outEdges.length, bfs.frames.at(-1).Q.length], [7, 0]);
eq('4L23 E\' edges = slide tree', ukey(bfs.frames.at(-1).tree.map(e => e.split('>'))), ukey(lec.tree));

// ---- 4L26-4L31: BFS for shortest path, graph of 4L27
eq('4L27 lists match the edges', listsMatch('4L27'), true);
const want = { s: 0, a: 1, b: 1, c: 1, d: 2, e: 2, f: 2, g: 3 };
const sp = L.bfsRun(G['4L27'].lists, 's');
eq('4L30 labels (queue version)', sp.label, want);
const layers = L.bfsLayers(ids('4L27'), es('4L27'), 's');
eq('4L27-30 centralized labels', layers.label, want);
eq('4L28-30 set found for i = 0, 1, 2, then none (4L30: stop)', layers.found.map(x => x.join('')), ['abc', 'def', 'g', '']);
eq('4L38 BFS tree', ukey(sp.tree), ukey([['s', 'a'], ['s', 'b'], ['s', 'c'], ['a', 'd'], ['a', 'e'], ['c', 'f'], ['e', 'g']]));
eq('4L38 the 3 is discovered by the top-right 2 (e)', sp.parent.g, 'e');
const spRun = A.bfsShortest.build('sp', 'queue');
const lab = spRun.frames.at(-1).D;
eq('4L31 animation: final labels', Object.fromEntries(spRun.ids.map((id, i) => [id, lab[i]])), want);
const cen = A.bfsShortest.build('sp', 'central');
eq('4L26 animation: final labels', Object.fromEntries(cen.ids.map((id, i) => [id, cen.frames.at(-1).D[i]])), want);
eq('4L26 animation: step 3 runs for i = 0,1,2,3', cen.frames.filter(f => f.line === 3).length, 4);

// ---- 4L41: weighted directed graph
const w41 = es('4L41').map(([a, b], i) => [a, b, G['4L41'].weights[i]]);
const sp41 = L.shortestPaths(ids('4L41'), w41, 's');
eq('4L41 d(s,t) = 6', sp41.d.t, 6);
eq('4L41 shortest path s-b-d-c-t', L.pathByPi(sp41.pi, 's', 't').join('-'), 's-b-d-c-t');
const weight = path => path.slice(1).reduce((sum, v, i) => sum + w41.find(([a, b]) => a === path[i] && b === v)[2], 0);
eq('4L41 s-a-t weighs 7, s-c-t weighs 8', [weight(['s', 'a', 't']), weight(['s', 'c', 't'])], [7, 8]);
eq('4L41 has the negative weight -2 (4L40 says non-negative)', Math.min(...G['4L41'].weights), -2);

// ---- 4L43: properties of distances
const w43 = es('4L43').map(([a, b], i) => [a, b, G['4L43'].weights[i]]);
const sp43 = L.shortestPaths(ids('4L43'), w43, 's');
eq('4L43 d(s,v) = 10 + 11 through z', [sp43.d.v, sp43.pi.v], [21, 'z']);
eq('4L43 Fact 1 bounds: 20+10 and 22+3 are at least d(s,v)', [20 + 10 >= sp43.d.v, 22 + 3 >= sp43.d.v], [true, true]);

// ---- 4L44: the general method, animated (edge orders are added; the answers are 4L41 and 4L43)
for (const [pid, mode] of [['g41', 'sweep'], ['g41', 'good'], ['g43', 'sweep'], ['g43', 'good']]) {
  const r = A.relax.build(pid, mode), f = r.frames.at(-1);
  eq(`4L44 animation ${pid}/${mode}: ends with every v.d = d(s,v)`, f.result.ok, true);
}
const rx41 = A.relax.build('g41', 'sweep').frames.at(-1);
eq('4L41 animation: t.d = 6 with t.π = c (path s-b-d-c-t)', rx41.result.order.filter(x => x.startsWith('t:')), ['t:6:c']);
eq('4L43 animation: v.d = 21 with v.π = z', A.relax.build('g43', 'good').frames.at(-1).result.order.filter(x => x.startsWith('v:')), ['v:21:z']);
eq('4L44 good order relaxes each edge once', A.relax.build('g41', 'good').frames.at(-1).calls, es('4L41').length);
eq('4L45 property 1: no v.d ever increases', ['sweep', 'good'].every(m => { const fr = A.relax.build('g41', m).frames; return fr.every((f, i) => !i || f.D.every((x, v) => fr[i - 1].D[v] == null || x == null || (x === '∞' ? fr[i - 1].D[v] === '∞' : fr[i - 1].D[v] === '∞' || +x <= +fr[i - 1].D[v]))); }), true);

// ---- 4L46: path(v)
const pp = A.pathPrint.build('w41');
eq('4L41 path(t) prints s,b,d,c,t', pp.frames.at(-1).result.order.join(','), 's,b,d,c,t');
const pp46 = A.pathPrint.build('w46');
eq('4L46 path(c) prints s,a,b,c', pp46.frames.at(-1).result.order.join(','), 's,a,b,c');
eq('4L46 path(c): deepest running stack is 4 calls', Math.max(...pp46.frames.map(f => f.Q.length)), 4);

// ---- 4R4-4R31: DFS of a directed graph
eq('4R5 lists match the edges', listsMatch('4R5'), true);
const forest = L.dfsForest(G['4R5'].order, G['4R5'].lists);
eq('4R6-30 trees start at C, then D', forest.map(t => t.root), ['C', 'D']);
eq('4R30 tree edges', dkey(forest.flatMap(t => t.edges)), dkey([['C', 'A'], ['A', 'B'], ['D', 'E'], ['E', 'F'], ['E', 'I'], ['I', 'G'], ['I', 'H'], ['H', 'J']]));
eq('4R31 DFS(D) produces a tree', L.dfsForest(['D', ...G['4R5'].order], G['4R5'].lists).length, 1);
eq('4R31 DFS(H) may produce a forest with 3 trees', L.dfsForest(['H', 'C', 'D', 'A', 'B', 'E', 'F', 'G', 'I', 'J'], G['4R5'].lists).length, 3);
const dd = A.dfsDirected.build();
eq('4R4 animation: same tree edges', dkey(dd.frames.at(-1).outEdges.map(o => o.label.slice(1, -1).split(','))), dkey(forest.flatMap(t => t.edges)));
eq('4R4 animation: DFS-Visit called as on 4R6-30', dd.frames.filter(f => f.line === 4).map(f => dd.ids[f.cur]).join(''), 'CABDEFIGHJ');

// ---- 4R32-4R49: Exercise 1, find a root
eq('4R5 roots: D only', L.rootsOf(ids('4R5'), es('4R5')), ['D']);
const fromH = L.findRootAlgorithm(G['4R5'].order, G['4R5'].lists, 'H');
eq('4R37-44 v = H: three trees, r = D, return D', [fromH.first.length, fromH.r, fromH.answer], [3, 'D', 'D']);
const fromD = L.findRootAlgorithm(G['4R5'].order, G['4R5'].lists, 'D');
eq('4R36 v = D: one spanning tree, return D', [fromD.first.length, fromD.answer], [1, 'D']);
const noRoot = L.findRootAlgorithm(['A', 'B', 'C'], { A: ['C'], B: ['C'], C: [] }, 'A');
eq('3R6 right graph: no root (computed)', [noRoot.answer, L.rootsOf(ids('3R6c'), es('3R6c')).length], [null, 0]);
for (const k of ['H', 'D', 'A', 'noRoot']) {
  const run = A.findRoot.build(k), res = run.frames.at(-1).result;
  const g = A.findRoot.presets[k], truth = L.rootsOf(g.nodes.map(n => n[0]), g.nodes.flatMap(([a]) => (g.adj[a] || []).map(b => [a, b])));
  eq(`4R34 animation (${k}) answer is a root iff one exists`, res.ok ? truth.includes(res.order[0]) : truth.length === 0, true);
}

// ---- 4R50-4R71: recitation BFS
eq('4R51 lists match the edges', listsMatch('4R51'), true);
const rec = L.bfsRun(G['4R51'].lists, 'A');
eq('4R52-70 dequeue order', rec.order.join(''), 'AFBCGDEH');
eq('4R56-69 queue after each vertex is handled', rec.queues.map(q => q.join('')), ['FBCG', 'BCGDE', 'CGDE', 'GDE', 'DE', 'EH', 'H', '']);
eq('4R71 labels', rec.label, { A: 0, F: 1, B: 1, C: 1, G: 1, D: 2, E: 2, H: 3 });
eq('4R71 tree', ukey(rec.tree), ukey([['A', 'G'], ['A', 'C'], ['A', 'B'], ['A', 'F'], ['F', 'E'], ['F', 'D'], ['D', 'H']]));
const rr = A.bfsRecitation.build();
eq('4R71 animation: distance badges', rr.frames.at(-1).badges.map(String).join(''), rr.ids.map(id => rec.label[id]).join(''));
eq('4R71 animation: tree', ukey(rr.frames.at(-1).tree.map(e => e.split('>'))), ukey(rec.tree));

// ---- 4R72-4R79: Exercise 2, shortest even paths
const g74 = L.evenGraph(ids('4R74'), es('4R74'));
eq("4R74 G' edges", ukey(g74.edges), ukey([['s0', 'b1'], ['s1', 'b0'], ['b0', 'c1'], ['b0', 'd1'], ['b1', 'c0'], ['b1', 'd0'], ['c0', 'd1'], ['c1', 'd0']]));
eq("4R79 n' = 2n, m' = 2m", [g74.ids.length, g74.edges.length], [2 * ids('4R74').length, 2 * es('4R74').length]);
const even = L.evenDistances(ids('4R74'), es('4R74'), 's');
eq('4R74 shortest even paths (computed: the slides give none)', even.dist, { s: 0, b: 4, c: 2, d: 2 });
eq('4R74 the even path to b repeats b', even.walk.b.join(''), 'sbcdb');
const ev = A.evenPath.build();
eq('4R75 animation returns the same labels', ev.frames.at(-1).result.order, ['s:0', 'b:4', 'c:2', 'd:2']);
eq("4R75 animation builds 8 vertices and 8 edges", [ev.frames.filter(f => f.line === 2).length * 2, ev.frames.filter(f => f.line === 4 || f.line === 5).length], [8, 8]);
};
