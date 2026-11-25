// Week 5: what the slides state, compared with what the site computes.
module.exports = ({ eq, L, G, A }) => {
const ids = k => G[k].nodes.map(n => n[0]);
const we = k => G[k].edges.map(([a, b], i) => [a, b, G[k].weights[i]]);
const pick = (obj, keys) => keys.map(k => obj[k]);

// ---- 5L11-5L17: DAG shortest paths
const dag = L.dagShortestPaths(ids('5L11'), we('5L11'), 's');
eq('5L11 the drawing is in topological order r,s,a,b,c,d', dag.order.join(), 'r,s,a,b,c,d');
eq('5L13 after s: a = 2, b = 6', pick(dag.steps[1].d, ['a', 'b']), [2, 6]);
eq('5L14 after a: b = 6, c = 6, d = 4', pick(dag.steps[2].d, ['b', 'c', 'd']), [6, 6, 4]);
eq('5L15 after b: c = 5, d = 4', pick(dag.steps[3].d, ['c', 'd']), [5, 4]);
eq('5L16 after c: d = 3', dag.steps[4].d.d, 3);
eq('5L17 final: first vertex ∞, s 0, a 2, b 6, c 5, d 3', pick(dag.d, ['r', 's', 'a', 'b', 'c', 'd']), [Infinity, 0, 2, 6, 5, 3]);
eq('5L12 the first vertex changes nothing (its d is ∞)', JSON.stringify(dag.steps[0].d) === JSON.stringify({ r: Infinity, s: 0, a: Infinity, b: Infinity, c: Infinity, d: Infinity }), true);
eq('5L20 exactly m relax operations', dag.relaxes, G['5L11'].edges.length);
eq('5L17 = Bellman-Ford distances (independent check)', JSON.stringify(dag.d), JSON.stringify(L.shortestPaths(ids('5L11'), we('5L11'), 's').d));

// ---- 5L24-5L29: Dijkstra
const dj = L.dijkstraRun(ids('5L24'), we('5L24'), 's');
eq('5L25-29 vertices leave Q in the order s, c, d, a, b', dj.order.join(), 's,c,d,a,b');
eq('5L25 after s: a = 10, c = 5', pick(dj.steps[0].d, ['a', 'c']), [10, 5]);
eq('5L26 after c: a = 8, b = 14, d = 7', pick(dj.steps[1].d, ['a', 'b', 'd']), [8, 14, 7]);
eq('5L27 after d: b = 13', dj.steps[2].d.b, 13);
eq('5L28 after a: b = 9', dj.steps[3].d.b, 9);
eq('5L29 final: a 8, b 9, c 5, d 7', pick(dj.d, ['a', 'b', 'c', 'd']), [8, 9, 5, 7]);
eq('5L29 tree edges (blue): s→c, c→a, c→d, a→b', ['a', 'b', 'c', 'd'].map(v => `${dj.pi[v]}>${v}`).sort().join(' '), 'a>b c>a c>d s>c');
eq('5L39 m relax operations', dj.relaxes, G['5L24'].edges.length);

// ---- 5L44-5L45: the shift "fix"
const best = (k, w) => { const wd = G[k].edges.map(([a, b], i) => [a, b, w[i]]); return L.allShortestPaths(ids(k), wd, 's', 't').map(p => p.join('')); };
const s44 = L.shiftWeights(G['5L44'].weights), s45 = L.shiftWeights(G['5L45'].weights);
eq('5L44 Δ = −5 and G′ weights 13, 1, 0, 17', [s44.delta, s44.weights], [-5, [13, 1, 0, 17]]);
eq('5L45 Δ = −6 and G′ weights 7, 7, 7, 11, 0', [s45.delta, s45.weights], [-6, [7, 7, 7, 11, 0]]);
eq('5L44 shortest s→t: s-a-t in G and in G′ (computed)', [best('5L44', G['5L44'].weights), best('5L44', s44.weights)], [['sat'], ['sat']]);
eq('5L45 shortest s→t: s-a-b-t in G, s-t in G′ (the fix fails)', [best('5L45', G['5L45'].weights), best('5L45', s45.weights)], [['sabt'], ['st']]);

// ---- 5L48: Bellman-Ford running example (the slide states no result: computed)
const bf = L.bellmanFordRun(ids('5L48'), we('5L48'), 'S');
eq('5L48 edge order SB, BC, AB, SA, AC', G['5L48'].edges.map(e => e.join('')).join(), 'SB,BC,AB,SA,AC');
eq('5L48 final d: S 0, A 2, B 3, C −4', pick(bf.d, ['S', 'A', 'B', 'C']), [0, 2, 3, -4]);
eq('5L48 in the slide order every one of the n−1 = 3 sweeps updates', [bf.sweeps.length, bf.updating], [3, 3]);
const bfBest = L.bellmanFordBestOrder(ids('5L48'), we('5L48'), 'S');
eq('5L47 (computed) a better order needs only 1 updating sweep (+1 to see nothing changes)', [bfBest.updating, L.bellmanFordRun(ids('5L48'), bfBest.order, 'S').sweeps.length], [1, 2]);
eq('5L49 (computed) shortest path S-A-B-C has 3 edges, found by sweep 3 in the slide order', [L.pathByPi(bf.pi, 'S', 'C').join(''), bf.sweeps.findIndex(x => x.d.C === -4) + 1], ['SABC', 3]);
eq('5L52 |E|(|V|−1) relax operations', bf.relaxes, 5 * 3);

// ---- Recitation
eq('5R9 two different shortest paths from a to b', L.allShortestPaths(ids('5R9'), we('5R9'), 'a', 'b').map(p => p.join('')).sort(), ['ab', 'acb']);
const r11 = L.shortestPaths(ids('5R11'), we('5R11'), 'u');
eq('5R11 p1 = u→v (100), p2 = v→w (100), but d(u,w) = 1', [r11.d.v, 100, r11.d.w], [100, 100, 1]);
const gp = L.almostValidGraph(ids('5R15'), we('5R15'));
eq("5R15/5R16 G′: n′ = 2n, m′ = 3m", [gp.ids.length, gp.wedges.length], [6, 9]);
eq("5R15 G′ edges, as drawn", gp.wedges.map(([a, b, w]) => `${a}${b}${w}`).sort().join(' '), ['s0a05', 's1a15', 'a0s15', 'a0b03', 'a1b13', 'b0a13', 'b0s02', 'b1s12', 's0b12'].sort().join(' '));
eq('5R15 almost-valid distances (computed: the slide gives none)', L.almostValidDistances(ids('5R15'), we('5R15'), 's'), { s: 0, a: 5, b: 2 });
const neg = [['s', 'a', 4], ['a', 'b', -3], ['s', 'b', 2], ['b', 'c', 1], ['a', 'c', 5]];
eq('5R20 two-Dijkstra algorithm = Bellman-Ford on a test graph (added)', L.oneNegativeEdge(['s', 'a', 'b', 'c'], neg, 's'), L.shortestPaths(['s', 'a', 'b', 'c'], neg, 's').d);

// ---- Animations end with the same answers
if (A.dagSP) {
  const f = A.dagSP.build('g11').frames.at(-1);
  eq('5L17 animation: final d', f.result.order, ['r:∞', 's:0', 'a:2', 'b:6', 'c:5', 'd:3']);
  eq('5L10 animation: one relax per edge', A.dagSP.build('g11').frames.filter(x => x.line === 8).length, 10);
}
if (A.dijkstra) {
  for (const m of ['pq', 'alt']) {
    const r = A.dijkstra.build('g24', m), f = r.frames.at(-1);
    eq(`5L29 animation (${m}): final d`, f.result.order, ['s:0', 'a:8', 'b:9', 'c:5', 'd:7']);
    eq(`5L25-29 animation (${m}): dequeue order`, f.out.map(i => r.ids[i]).join(''), 'scdab');
  }
  const r3 = A.dijkstra.build('gR15', 'pq').frames.at(-1);
  eq("5R15 animation on G′: d(s⁰,·)", r3.result.order, ['s0:0', 'a0:5', 'b0:8', 's1:4', 'a1:9', 'b1:2']);
}
if (A.bellmanFord) {
  const full = A.bellmanFord.build('g48', 'full').frames.at(-1), stop = A.bellmanFord.build('g48', 'stop').frames.at(-1);
  eq('5L46 animation: final d', full.result.order, ['S:0', 'A:2', 'B:3', 'C:-4']);
  eq('5L47 animation (stop early): final d, 3 sweeps', [stop.result.order, stop.sweeps], [['S:0', 'A:2', 'B:3', 'C:-4'], 3]);
}
};
