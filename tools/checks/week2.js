// Week 2: what the slides state, compared with what the site computes.
module.exports = ({ eq, L, G, A }) => {
const ids = k => G[k].nodes.map(n => n[0]);
const degs = k => ids(k).map(v => L.degrees(ids(k), G[k].edges)[v]).join(',');
const status = k => L.eulerStatus(ids(k), G[k].edges, G[k].directed).kind;
const odd = k => L.oddVertices(ids(k), G[k].edges).join('');

// Euler conditions
eq('2L17 degrees t,l,r,m,a,b', degs('2L17'), '2,4,4,4,3,3');
eq('2L17 only a,b odd', odd('2L17'), 'ab');
eq('2L17 has a path, not a cycle', status('2L17'), 'path');
eq('2L17 after (a,b): degrees', degs('2L17+'), '2,4,4,4,4,4');
eq('2L17 after (a,b): cycle', status('2L17+'), 'cycle');
eq('2L21 every degree even (computed)', odd('2L21'), '');
eq('2L21 has a cycle', status('2L21'), 'cycle');
eq('2R5 deg(C), deg(B) odd', odd('2R5').split('').sort().join(''), 'BC');
eq('2R5 no Euler cycle', status('2R5'), 'path');
eq('2R6 with the extra edge: cycle', status('2R6'), 'cycle');
eq('2R8 cycle', status('2R8'), 'cycle');
eq('2L36 I Euler cycle (computed)', status('2L36I'), 'cycle');
eq('2L36 II four odd: neither (computed)', [status('2L36II'), odd('2L36II')], ['none', 'BCDE']);

// A witness tour uses every edge exactly once and really is a walk
const validTour = k => {
  const g = G[k], t = L.eulerTour(ids(k), g.edges, g.directed);
  const once = new Set(t.edges).size === g.edges.length && t.edges.length === g.edges.length;
  const walk = t.edges.every((e, i) => {
    const [a, b] = g.edges[e], [u, v] = [t.vertices[i], t.vertices[i + 1]];
    return (a === u && b === v) || (!g.directed && a === v && b === u);
  });
  return once && walk;
};
for (const k of ['2L17', '2L17+', '2L21', '2R5', '2R6', '2R8', '2L29', '2L30', '2L36I']) eq(k + ' witness tour valid', validTour(k), true);
const pathEnds = L.eulerTour(ids('2L17'), G['2L17'].edges, false).vertices;
eq('2L17 path ends at a and b', [pathEnds[0], pathEnds.at(-1)].sort().join(''), 'ab');

// Digraphs and the underlying graph
eq('2L25 underlying graph connected', L.connectedExceptIsolated(ids('2L25'), G['2L25'].edges), true);
eq('2L25 no Euler path (computed)', status('2L25'), 'none');
const io = k => { const { inD, outD } = L.inOutDegrees(ids(k), G[k].edges); return ids(k).every(v => inD[v] === outD[v]); };
eq('2L33 G2,3 dout = din', io('2L29'), true);
eq('2L33 G3,2 dout = din', io('2L30'), true);
eq('2L29 G2,3 has a cycle (computed)', status('2L29'), 'cycle');
eq('2L30 G3,2 has a cycle (computed)', status('2L30'), 'cycle');
const dirLine = L.eulerStatus(['a', 'b', 'c'], [['a', 'b'], ['b', 'c'], ['c', 'a'], ['a', 'b']], true);
eq('2L26 condition 2 picks start and end', [dirLine.kind, dirLine.a, dirLine.b], ['path', 'a', 'b']);

// De Bruijn
eq('2L27 0011 for n=2', L.isDeBruijn('0011', 2, 2), true);
eq('2L34 sequence is De Bruijn (computed)', L.isDeBruijn('00010111', 2, 3), true);
eq('2L34 words in order', L.cyclicWindows('00010111', 3).join(','), '000,001,010,101,011,111,110,100');
eq('non-example rejected', L.isDeBruijn('0101', 2, 2), false);
eq('2L28 G2,3 sizes', [L.deBruijnGraph(2, 3).ids.length, L.deBruijnGraph(2, 3).edges.length], [4, 8]);
eq('2L28 G3,2 sizes', [L.deBruijnGraph(3, 2).ids.length, L.deBruijnGraph(3, 2).edges.length], [3, 9]);
const e101 = L.deBruijnGraph(2, 3).edges.find(e => e.word === '101');
eq('2L28 edge 101 goes 10 → 01', [e101.from, e101.to], ['10', '01']);
eq('2R22 G2,2 edges', L.deBruijnGraph(2, 2).edges.map(e => `${e.from}>${e.to}`).join(' '), '0>0 0>1 1>0 1>1');

// Hamilton
const ham = k => L.hamiltonianCycle(ids(k), G[k].edges, G[k].directed);
eq('2L36 I has no Hamiltonian cycle (computed)', ham('2L36I'), null);
eq('2L36 II has a Hamiltonian cycle (computed)', ham('2L36II').length, 6);
const neighbors = v => G['2L36II'].edges.flatMap(([a, b]) => (a === v ? [b] : b === v ? [a] : [])).sort().join('');
eq('2L38 tree: children of B', neighbors('B'), 'CDG');
eq('2L38 tree: children of D (minus B)', neighbors('D').replace('B', ''), 'EG');
eq('2L38 tree: children of G (minus B)', neighbors('G').replace('B', ''), 'CDE');
eq('2L38 tree: children of C (minus B)', neighbors('C').replace('B', ''), 'EG');

// The Euler animation reproduces the slides
const run = (p, sw) => A.euler.build(p, 'run', sw);
const last = r => r.frames.at(-1);
const asc = { lists: 'asc', pick: 'first' };
const L21 = run('lecture', asc);
eq('2L21-23 cycles', L21.cycles, ['ABCA', 'BDECGB', 'DFEGD']);
eq('2L22 first merge', L21.tours[1], 'ABDECGBCA');
eq('2L23 Euler cycle', last(L21).result.order.join(''), 'ABDFEGDECGBCA');
eq('2L21 3 iterations', last(L21).iterations, 3);
eq('2L24 every list cell scanned once', last(L21).scanned, 24);
const after = L21.frames.find(f => f.cycleDone === 0);
const row = v => { const i = L21.ids.indexOf(v); return L21.lists[i].map((c, k) => `${c.label}${after.bits[i][k]}`).join(' '); };
eq('2L24 list A after ABCA', row('A'), 'B1 C1');
eq('2L24 list B after ABCA', row('B'), 'A1 C1 D0 G0');
eq('2L24 list C after ABCA', row('C'), 'A1 B1 E0 G0');
eq('2L24 list G after ABCA', row('G'), 'B0 C0 D0 E0');
const rev = run('lecture', { lists: 'desc', pick: 'first' });
eq('reversed lists: one iteration', [last(rev).iterations, last(rev).result.order.join('')], [1, 'ACGEFDGBDECBA']);
const lastPick = run('lecture', { lists: 'asc', pick: 'last' });
eq('latest tour vertex: other cycle', [lastPick.cycles, last(lastPick).result.order.join('')], [['ABCA', 'CEDBGC', 'GDFEG'], 'ABCEDBGDFEGCA']);
const P = run('path', asc);
const pOrder = last(P).result.order;
eq('2L17 Euler path has 10 edges', pOrder.length - 1, 10);
eq('2L17 path ends at a and b', [pOrder[0], pOrder.at(-1)].sort().join(''), 'ab');
eq('Euler view ends on the last code line', [last(L21).line, last(P).line], [12, 16]);

const R = A.eulerRecitation.build('recitation', 'run', {});
eq('2R9-10 cycles', R.cycles, ['0320', '3143']);
eq('2R10 joined tour', last(R).result.order.join(''), '0314320');
eq('2R7 loop exit on line 3', last(R).line, 3);

const D = A.deBruijn.build('g23', 'run', { lists: 'slide' });
eq('2L34 sequence from the run', last(D).letters.join(''), '00010111');
eq('2L34 edges in order', D.tourWords, ['000', '001', '010', '101', '011', '111', '110', '100']);
const Dasc = A.deBruijn.build('g23', 'run', { lists: 'asc' });
eq('A→Z lists: 3 iterations, still De Bruijn', [last(Dasc).iterations, L.isDeBruijn(last(Dasc).letters.join(''), 2, 3)], [3, true]);

// Tournament
const T = A.tournament.build();
eq('2L41 Hamiltonian path', last(T).result.order.join(','), '1,3,2,4');
const beats = (u, v) => G['2L40'].edges.some(([a, b]) => a === u && b === v);
const o = last(T).result.order;
eq('2L41 each team beat its successor', o.slice(1).every((v, i) => beats(o[i], v)), true);
eq('2L40 every pair played once', G['2L40'].edges.length, 6);

// Added at the content review: 2L18, 2R15, 2R19-20, 2R37-40
const idsOf = k => G[k].nodes.map(n => n[0]);
const deg18 = L.degrees(idsOf('2L18'), G['2L18'].edges);
eq('2L18 degrees A3 B5 C3 D3', ['A', 'B', 'C', 'D'].map(v => deg18[v]).join(''), '3533');
eq('2L18 no Euler cycle and no Euler path', L.eulerStatus(idsOf('2L18'), G['2L18'].edges, false).kind, 'none');
eq('2R15 k=1 example: the odd vertices are 3 and 4 (computed from the drawing)', L.oddVertices(['0', '1', '2', '3', '4'], [['0', '3'], ['0', '2'], ['3', '2'], ['3', '1'], ['1', '4']]).sort().join(), '3,4');
{ const n = 183, ids = Array.from({ length: n }, (_, i) => String(i)), E = [];
  for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) if (!(a === 0 && (b === 1 || b === 2))) E.push([String(a), String(b)]);
  const d = L.degrees(ids, E), vals = Object.values(d);
  eq('2R19 degrees: one 180, two 181, rest 182', [vals.filter(x => x === 180).length, vals.filter(x => x === 181).length, vals.filter(x => x === 182).length], [1, 2, 180]);
  eq('2R20 Euler path but no Euler cycle', L.eulerStatus(ids, E, false).kind, 'path'); }
const eh = k => [L.eulerStatus(idsOf(k), G[k].edges, false).kind === 'cycle', !!L.hamiltonianCycle(idsOf(k), G[k].edges, false)];
eq('2R37 no Euler cycle, no Hamiltonian cycle', eh('2R37'), [false, false]);
eq('2R38 Hamiltonian cycle, no Euler cycle', eh('2R38'), [false, true]);
eq('2R39 Euler cycle, no Hamiltonian cycle', eh('2R39'), [true, false]);
eq('2R40 both', eh('2R40'), [true, true]);
};
