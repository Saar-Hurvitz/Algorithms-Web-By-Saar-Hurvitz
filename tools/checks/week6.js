// Week 6: what the slides state, compared with what the site computes.
module.exports = ({ eq, L, G, A }) => {
const ids = k => G[k].nodes.map(n => n[0]);
const we = (k, w = G[k].weights) => G[k].edges.map(([a, b], i) => [a, b, w[i]]);
const pick = (obj, keys) => keys.map(k => obj[k]);
const I = Infinity;

// ---- 6L10: BF quick review (the slide's table is empty: computed)
const r10 = L.bellmanFordRun(ids('6L10'), we('6L10'), 's');
eq('6L10 edge order sa, sd, ab, cb, ac, bd', G['6L10'].edges.map(e => e.join('')).join(), 'sa,sd,ab,cb,ac,bd');
eq('6L10 sweep 1: a −3, d 10→3, b 2, c 5 (computed)', pick(r10.sweeps[0].d, ['s', 'a', 'b', 'c', 'd']), [0, -3, 2, 5, 3]);
eq('6L10 sweep 2: b 1, d 2 (computed)', pick(r10.sweeps[1].d, ['b', 'd']), [1, 2]);
eq('6L10 sweep 3 changes nothing: 3 sweeps, 2 with updates (computed)', [r10.sweeps.length, r10.updating, r10.sweeps[2].changed.length], [3, 2, 0]);
eq('6L10 = independent shortest paths', JSON.stringify(r10.d), JSON.stringify(L.shortestPaths(ids('6L10'), we('6L10'), 's').d));
eq('6L11 |E|(|V|−1) relax operations in n−1 sweeps', L.bellmanFordRun(ids('6L10'), we('6L10'), 's', false).relaxes, 6 * 4);

// ---- 6L12-6L13: detecting negative cycles
eq('6L13 no message on 6L10 (no negative cycle)', L.bellmanFordDetect(ids('6L10'), we('6L10'), 's').flagged, []);
eq('6L13 no message on 6R8 (no negative cycle)', L.bellmanFordDetect(ids('6R8'), we('6R8'), 'S').flagged.length, 0);
const neg = L.bellmanFordDetect(ids('6R8neg'), we('6R8neg'), 'S');
eq('6L13 added graph: A→E→B→A weighs 2 − 2 − 1 = −1, and a message is printed', [2 - 2 - 1, neg.flagged.length > 0], [-1, true]);
eq('6L12 added graph: no shortest paths (shortestPaths finds none)', L.shortestPaths(ids('6R8neg'), we('6R8neg'), 'S'), null);
const unreach = [['s', 'a', 1], ['b', 'c', -2], ['c', 'b', 1]];
eq('6L13 note (added): a negative cycle not reachable from s prints nothing', L.bellmanFordDetect(['s', 'a', 'b', 'c'], unreach, 's').flagged, []);

// ---- 6L20-6L21: all pairs by n runs of BF
eq('6L21 n runs of BF: |V|·(|V|−1)·|E| relax operations on 6L25 (computed)', ids('6L25').reduce((s, v) => s + L.bellmanFordRun(ids('6L25'), we('6L25'), v, false).relaxes, 0), 5 * 4 * 9);

// ---- 6L25-6L30: Floyd-Warshall
const fw = L.floydWarshall(ids('6L25'), we('6L25'));
eq('6L25 graph: ids 1..5 in order', ids('6L25').join(), '1,2,3,4,5');
const slides = {
  0: [[0, 3, 8, I, -4], [I, 0, I, 1, 7], [I, 4, 0, I, I], [2, I, -5, 0, I], [I, I, I, 6, 0]],
  1: [[0, 3, 8, I, -4], [I, 0, I, 1, 7], [I, 4, 0, I, I], [2, 5, -5, 0, -2], [I, I, I, 6, 0]],
  2: [[0, 3, 8, 4, -4], [I, 0, I, 1, 7], [I, 4, 0, 5, 11], [2, 5, -5, 0, -2], [I, I, I, 6, 0]],
  3: [[0, 3, 8, 4, -4], [I, 0, I, 1, 7], [I, 4, 0, 5, 11], [2, -1, -5, 0, -2], [I, I, I, 6, 0]],
  4: [[0, 3, -1, 4, -4], [3, 0, -4, 1, -1], [7, 4, 0, 5, 3], [2, -1, -5, 0, -2], [8, 5, 1, 6, 0]],
  5: [[0, 1, -3, 2, -4], [3, 0, -4, 1, -1], [7, 4, 0, 5, 3], [2, -1, -5, 0, -2], [8, 5, 1, 6, 0]],
};
const str = M => M.map(r => r.map(x => (x === I ? '--' : x)).join(' ')).join(' | ');
for (const k in slides) eq(`6L${25 + +k} δ${k} as on the slide`, str(fw.steps[k]), str(slides[k]));
eq('6L31 δⁿ = the shortest paths (BF from every vertex)', str(fw.d), str(ids('6L25').map(s => { const d = L.shortestPaths(ids('6L25'), we('6L25'), s).d; return ids('6L25').map(v => d[v]); })));
eq('6L32 no negative cycle on 6L25: every δⁿ(i,i) = 0', fw.d.map((r, i) => r[i]), [0, 0, 0, 0, 0]);
const fwNeg = L.floydWarshall(ids('6L25neg'), we('6L25neg'));
eq('6L32 added graph: 2→4→3→2 weighs 1 − 5 + 3 = −1, so some δᵏ(i,i) < 0', [1 - 5 + 3, fwNeg.negative], [-1, true]);
eq('6L32 the slide graph has the zero-weight cycle 2→4→3→2 (1 − 5 + 4)', 1 - 5 + 4, 0);

// ---- 6L40-6L43: gas stations
eq('6L40 d_U(s,·) for U = {a}: s 11, a 4, b 7, c 6', pick(L.gasStationsDistances(ids('6L40'), we('6L40'), ['a'], 's'), ['s', 'a', 'b', 'c']), [11, 4, 7, 6]);
const gas = L.gasStationsGraph(ids('6L40'), we('6L40'), ['a']);
eq('6L43 |V′| = 2|V|, |E′| = 2|E| + |U|', [gas.ids.length, gas.wedges.length], [2 * 4, 2 * 5 + 1]);
eq('6L41 G′ as drawn: the copy edges and (a0,a1) of weight 0', gas.wedges.map(([a, b, w]) => `${a}${b}${w}`).sort().join(' '),
  ['s0a04', 's0b06', 'a0c02', 'a0b03', 'c0s05', 's1a14', 's1b16', 'a1c12', 'a1b13', 'c1s15', 'a0a10'].sort().join(' '));

// ---- 6L48-6L54: Dijkstra Pizza
const pz = L.pizzaDistances(ids('6L50'), we('6L50'), ['a', 'b']);
eq('6L50 d(u,a) = 10 and d(u,b) = 13 (each by Bellman-Ford-style shortestPaths)', [L.shortestPaths(ids('6L50'), we('6L50'), 'u').d.a, L.shortestPaths(ids('6L50'), we('6L50'), 'u').d.b], [10, 13]);
eq('6L50 so for u we return 10', pz.u, 10);
eq('6L48 remark 1: 0 for every v ∈ W', [pz.a, pz.b], [0, 0]);
eq('6L53 claim: d(s,v) in G′ = the distance from v to the closest branch, for every v', ids('6L50').every(v => pz[v] === Math.min(...['a', 'b'].map(w => L.shortestPaths(ids('6L50'), we('6L50'), v).d[w]))), true);
const pg = L.pizzaGraph(ids('6L50'), we('6L50'), ['a', 'b']);
eq('6L54 |V′| = |V| + 1, |E′| = |E| + |W|', [pg.ids.length, pg.wedges.length], [9 + 1, 15 + 2]);

// ---- Recitation: Bellman-Ford (6R5-6R20)
const sp8 = L.shortestPaths(ids('6R8'), we('6R8'), 'S');
eq('6R5-6R7 edges on the shortest path to A, B, D: 3, 5, 7', ['A', 'B', 'D'].map(v => L.allShortestPaths(ids('6R8'), we('6R8'), 'S', v).map(p => p.length - 1)), [[3], [5], [7]]);
eq('6R7 the shortest paths are unique, so the counts are well-defined', ['A', 'B', 'D'].map(v => L.allShortestPaths(ids('6R8'), we('6R8'), 'S', v).length), [1, 1, 1]);
const o1 = L.bellmanFordRun(ids('6R8'), we('6R8'), 'S', false);
const row = (r, k) => pick(r.sweeps[k].d, ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G']);
eq('6R10 sweep 1: A 10, G 8', row(o1, 0), [0, 10, I, I, I, I, I, 8]);
eq('6R11 sweep 2: E 12, F 9', row(o1, 1), [0, 10, I, I, I, 12, 9, 8]);
eq('6R12 sweep 3: A 5, B 10, E 8', row(o1, 2), [0, 5, 10, I, I, 8, 9, 8]);
eq('6R13 sweep 4: B 6, C 11, E 7', row(o1, 3), [0, 5, 6, 11, I, 7, 9, 8]);
eq('6R14 sweep 5: B 5, C 7, D 14', row(o1, 4), [0, 5, 5, 7, 14, 7, 9, 8]);
eq('6R15 sweep 6: C 6, D 10', row(o1, 5), [0, 5, 5, 6, 10, 7, 9, 8]);
eq('6R16 sweep 7: D 9, and every vertex is correct', [row(o1, 6), JSON.stringify(o1.d) === JSON.stringify(sp8.d)], [[0, 5, 5, 6, 9, 7, 9, 8], true]);
eq('6R12 A is correct after sweep 3, 6R14 B after sweep 5', [o1.sweeps[2].d.A, o1.sweeps[4].d.B], [sp8.d.A, sp8.d.B]);
const o2 = L.bellmanFordRun(ids('6R17'), we('6R17'), 'S', false);
eq('6R17 the same graph in the second order', we('6R17').map(e => e.join()).sort().join(' '), we('6R8').map(e => e.join()).sort().join(' '));
eq('6R18 sweep 1: A 5, B 6, C 7, E 7, F 9, G 8', row(o2, 0), [0, 5, 6, 7, I, 7, 9, 8]);
eq('6R19 sweep 2: B 5, C 6, D 10', row(o2, 1), [0, 5, 5, 6, 10, 7, 9, 8]);
eq('6R20 sweep 3: D 9, final', row(o2, 2), [0, 5, 5, 6, 9, 7, 9, 8]);
eq('6R18 within sweep 1, A goes 10 → 5 and E goes 8 → 7 (computed by order)', (() => {
  const d = { S: 0, A: I, B: I, C: I, D: I, E: I, F: I, G: I }, seen = { A: [], E: [] };
  we('6R17').forEach(([u, v, w]) => { if (d[u] + w < d[v]) { d[v] = d[u] + w; if (seen[v]) seen[v].push(d[v]); } });
  return seen;
})(), { A: [10, 5], E: [8, 7] });
eq('6R20 stopping early: order 2 needs 3 sweeps with updates (+1 that changes nothing)', [L.bellmanFordRun(ids('6R17'), we('6R17'), 'S').updating, L.bellmanFordRun(ids('6R17'), we('6R17'), 'S').sweeps.length], [3, 4]);
const tree = L.bellmanFordTreeOrder(ids('6R8'), we('6R8'), 'S');
eq('6R8 an order that follows the shortest-path tree needs 1 sweep with updates', tree.updating, 1);
eq('5L48 the tree order agrees with trying every order (1)', L.bellmanFordTreeOrder(ids('5L48'), we('5L48'), 'S').updating, L.bellmanFordBestOrder(ids('5L48'), we('5L48'), 'S').updating);
eq('6L10 the tree order agrees with trying every order', L.bellmanFordTreeOrder(ids('6L10'), we('6L10'), 's').updating, L.bellmanFordBestOrder(ids('6L10'), we('6L10'), 's').updating);

// ---- Exercise 1 (6R21-6R24), on the added n = 5 examples
const perms = a => (a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map(p => [x, ...p])));
eq('6R22 star: every order of the edges needs exactly 1 sweep with updates', [...new Set(perms(we('6R22')).map(o => L.bellmanFordRun(ids('6R22'), o, 'v1').updating))], [1]);
eq('6R24 line in reverse order: n − 1 = 4 sweeps with updates', L.bellmanFordRun(ids('6R24'), we('6R24'), 'v1').updating, 4);
eq('6R24 the order (v4,v5), (v3,v4), (v2,v3), (v1,v2)', G['6R24'].edges.map(e => e.join('')).join(), 'v4v5,v3v4,v2v3,v1v2');

// ---- Exercise 2 (6R27-6R34)
const fwSeq = k => { const g = G[k], r = L.floydWarshall(ids(k), we(k)), i = ids(k).indexOf(g.i), j = ids(k).indexOf(g.j); return r.steps.map(M => M[i][j]); };
for (const k of ['6R28', '6R30']) {
  const s = fwSeq(k);
  eq(`${k} premise: δ(i,j) first finite at δ⁶, and δⁿ = δ⁶`, [s.findIndex(x => x < I), s[11] === s[6]], [6, true]);
}
const inner = (k, p) => p.slice(1, -1).map(Number);
const sp28 = L.allShortestPaths(ids('6R28'), we('6R28'), '10', '11');
eq('6R28 claim 1 false: i–7–j is another shortest path', sp28.map(p => p.join('-')).sort(), ['10-6-11', '10-7-11']);
eq('6R28 claim 1: not every shortest path stays in {1..6}', sp28.every(p => inner('6R28', p).every(x => x <= 6)), false);
eq('6R30 claim 2 false: exactly one shortest path', L.allShortestPaths(ids('6R30'), we('6R30'), '10', '11').length, 1);
/* Claims 3 and 4 are true: test them on random graphs that satisfy the premise (added) */
let tested = 0, broken = 0, seed = 7;
const rnd = m => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % m; };
for (let t = 0; t < 4000 && tested < 300; t++) {
  const V = Array.from({ length: 11 }, (_, x) => String(x + 1)), E = [];
  for (let e = 0; e < 16; e++) { const a = rnd(11), b = rnd(11); if (a !== b && !E.some(x => x[0] === V[a] && x[1] === V[b])) E.push([V[a], V[b], rnd(9) - 2]); }
  const r = L.floydWarshall(V, E);
  if (r.negative) continue;
  for (let i = 0; i < 11; i++) for (let j = 0; j < 11; j++) {
    if (i === j) continue;
    const s = r.steps.map(M => M[i][j]);
    if (s.findIndex(x => x < I) !== 6 || s[11] !== s[6]) continue;
    tested++;
    if (!(s[5] === I) || !(r.steps[6][i][j] === r.d[i][j])) broken++;
  }
}
eq('6R32/6R34 claims 3 and 4 hold on every random graph with the premise (added test)', [tested > 0, broken], [true, 0]);

// ---- Exercise 3 (6R35-6R44)
const tax = L.taxDistances(ids('6R36'), we('6R36'), 's');
eq('6R36 d(s,s) = 0, d(s,a) = 2, d(s,b) = 2, d(s,c) = 8', pick(tax, ['s', 'a', 'b', 'c']), [0, 2, 2, 8]);
eq('6R36 = the cheapest taxed cost over all simple paths (brute force; on 6R36 no repeated vertex helps)', tax, L.taxBrute(ids('6R36'), we('6R36'), 's'));
eq('6R36 the path s-a-b-c costs 12 (1 + 1 + 2·5)', L.taxedCost([1, 1, 5]), 12);
eq('6R37 the WRONG solution returns 6 for t; the correct answer is 4', [L.taxNaive(ids('6R37'), we('6R37'), 's').t, L.taxDistances(ids('6R37'), we('6R37'), 's').t], [6, 4]);
eq('6R37 "see also node c": the WRONG solution returns 12 for c, not 8', L.taxNaive(ids('6R36'), we('6R36'), 's').c, 12);
const tg = L.taxGraph(ids('6R36'), we('6R36'));
eq('6R44 |V′| = 3|V|, |E′| = 3|E|', [tg.ids.length, tg.wedges.length], [3 * 4, 3 * 4]);
eq('6R42 no edge leaves V² (no internal edges in V2)', tg.wedges.filter(([a]) => a.endsWith('2')).length, 0);

// ---- Exercise 4 (6R45-6R48)
const listsOf = (k, order) => { const adj = Object.fromEntries(ids(k).map(v => [v, []])); G[k].edges.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); }); for (const v in adj) adj[v].sort(order); return adj; };
const treeKey = r => r.tree.map(e => e.slice().sort().join('')).sort().join(' ');
const triTrees = new Set(perms(['a', 'b']).flatMap(sO => perms(['s', 'b']).flatMap(aO => perms(['s', 'a']).map(bO => treeKey(L.bfsRun({ s: sO, a: aO, b: bO }, 's'))))));
eq('6R46 the triangle has a single BFS tree rooted at s, and a cycle', [triTrees.size, L.undirectedCycle(ids('6R46'), G['6R46'].edges) != null], [1, true]);
const l48 = listsOf('6R48');
const dfs48 = L.dfsRun(l48, 'S'), bfs48 = L.bfsRun(l48, 'S');
const leaves = t => ids('6R48').filter(v => !t.some(([a]) => a === v));
eq('6R48 DFS(s) numbers S, A, C, D, B as drawn', dfs48.order.join(), 'S,A,C,D,B');
eq('6R48 BFS(s) numbers S, A, B, C, D as drawn', bfs48.order.join(), 'S,A,B,C,D');
eq('6R48 B is a leaf of DFS(s) but not of BFS(s)', [leaves(dfs48.tree).includes('B'), leaves(bfs48.tree).includes('B')], [true, false]);

// ---- Exercise 5 (6R49-6R50)
const ex5 = (w13, w54) => {
  const w = G['6R49'].edges.map(([a, b], i) => (`${a}>${b}` === '1>3' ? w13 : `${a}>${b}` === '5>4' ? w54 : G['6R49'].weights[i]));
  const r = L.floydWarshall(ids('6R49'), we('6R49', w)), i = ids('6R49').indexOf('2'), j = ids('6R49').indexOf('3');
  return { s: r.steps.map(M => M[i][j]), negative: r.negative };
};
const e5 = ex5(14, -4);
eq('6R50 example w(1,3) = 14, w(5,4) = −4: δ⁵(2,3) < δ⁴(2,3) < δ¹(2,3)', [e5.s[5], e5.s[4], e5.s[1], e5.s[5] < e5.s[4] && e5.s[4] < e5.s[1]], [2, 10, 11, true]);
eq('6R50 example: no negative cycle', e5.negative, false);
eq('6R50 condition 2 + 8 < −3 + w(1,3): w(1,3) = 13 fails, 14 works', [ex5(13, -4).s[4] < ex5(13, -4).s[1], ex5(14, -4).s[4] < ex5(14, -4).s[1]], [false, true]);
eq('6R50 condition −2 + w(5,4) + 8 < 2 + 8: w(5,4) = 4 fails, 3 works', [ex5(14, 4).s[5] < ex5(14, 4).s[4], ex5(14, 3).s[5] < ex5(14, 3).s[4]], [false, true]);
eq('6R50 cycle 1-5-4-3-2-1: w(5,4) = −5 gives weight 0 (not negative), −6 is negative', [ex5(14, -5).negative, ex5(14, -6).negative], [false, true]);

const okRange = [];
for (let a = 0; a <= 20; a++) for (let b = -12; b <= 8; b++) { const r = ex5(a, b); if (!r.negative && r.s[5] < r.s[4] && r.s[4] < r.s[1]) okRange.push([a, b]); }
eq('6R49 exercise feedback: the answers are exactly w(1,3) > 13 and −5 ≤ w(5,4) < 4 (searched 0..20 × −12..8)', okRange.every(([a, b]) => a > 13 && b >= -5 && b < 4) && okRange.length === 7 * 9, true);

// ---- Animations end with the same answers
if (A.bellmanFord && A.bellmanFord.presets.g6L10) {
  const f = A.bellmanFord.build('g6L10', 'stop').frames.at(-1);
  eq('6L10 animation (stop early): final d, 3 sweeps', [f.result.order, f.sweeps], [['s:0', 'a:-3', 'c:5', 'd:2', 'b:1'], 3]);
  const o1f = A.bellmanFord.build('g6R8', 'full').frames.at(-1);
  eq('6R16 animation: final d after 7 sweeps', o1f.result.order, ['S:0', 'A:5', 'B:5', 'C:6', 'D:9', 'E:7', 'F:9', 'G:8']);
  const o2f = A.bellmanFord.build('g6R17', 'stop').frames.at(-1);
  eq('6R20 animation (stop early): 4 sweeps, the last with no updates', o2f.sweeps, 4);
  const det = A.bellmanFord.build('g6R8', 'detect').frames.at(-1);
  eq('6L13 animation on 6R8: no message', [det.result.ok, det.printed], [true, 0]);
  const detN = A.bellmanFord.build('g6R8neg', 'detect').frames.at(-1);
  eq('6L13 animation on the added graph: "A negative cycle exists" is printed', detN.printed > 0, true);
}
if (A.floydWarshall) {
  const f = A.floydWarshall.build('g25', 'fw').frames;
  eq('6L30 animation: the last matrix is δ⁵ of the slide', str(f.at(-1).fw.cur.map(r => r.map(x => (x === '∞' ? I : +x)))), str(slides[5]));
  eq('6L23 animation: the δᵏ(i,j) line runs n·n² = 125 times', f.filter(x => x.line === 4).length, 125);
  const nf = A.floydWarshall.build('gneg', 'fw').frames.at(-1);
  eq('6L32 animation on the added graph: a negative δ(i,i) is reported', [nf.result.ok, nf.result.negative, /negative cycle/.test(nf.msg)], [true, true, true]);
  const ok50 = A.floydWarshall.build('g50', 'fw').frames;
  eq('6R50 animation: δ¹(2,3) = 11, δ⁴(2,3) = 10, δ⁵(2,3) = 2', [1, 4, 5].map(k => ok50.find(x => x.line === 5 && x.fw.curK === k).fw.cur[1][2]), ['11', '10', '2']);
}
if (A.dijkstra && A.dijkstra.presets.g6L41) {
  const g = A.dijkstra.build('g6L41', 'pq').frames.at(-1);
  eq('6L41 animation: d(s0, v1) = 11, 4, 7, 6', ['s1', 'a1', 'b1', 'c1'].map(v => g.result.order.find(x => x.startsWith(v + ':'))), ['s1:11', 'a1:4', 'b1:7', 'c1:6']);
  const p = A.dijkstra.build('g6L51', 'pq').frames.at(-1);
  eq('6L51 animation: d(s,u) = 10', p.result.order.find(x => x.startsWith('u:')), 'u:10');
  const t = A.dijkstra.build('g6R39', 'pq').frames.at(-1);
  eq('6R39 animation: d(s⁰,c⁰) = 8, d(s⁰,c²) = 12', ['c0', 'c2'].map(v => t.result.order.find(x => x.startsWith(v + ':'))), ['c0:8', 'c2:12']);
}
};
