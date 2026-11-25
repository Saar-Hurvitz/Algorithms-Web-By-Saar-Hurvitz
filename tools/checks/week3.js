// Week 3: what the slides state, compared with what the site computes.
module.exports = ({ eq, L, G, A }) => {
const ids = k => G[k].nodes.map(n => n[0]);
const es = k => G[k].edges;
const key = list => list.map(([a, b]) => (a < b ? a + b : b + a)).sort().join(' ');
const tree = k => L.treeStatus(ids(k), es(k));

// Trees (3L13) and the recitation's "Identify the trees" (3R5, answers computed: the slide gives none)
eq('3L13 is a tree', tree('3L13').tree, true);
eq('3L13 has n-1 edges (3L15)', es('3L13').length, ids('3L13').length - 1);
const lessDE = es('3L13').filter(([a, b]) => !(a === 'E' && b === 'D'));
eq('3L13 box 1 (no D-E): not connected', L.treeStatus(ids('3L13'), lessDE).connected, false);
const plusFG = [...es('3L13'), ['F', 'G']];
eq('3L13 box 2 (+F-G): has a cycle', L.treeStatus(ids('3L13'), plusFG).acyclic, false);
eq('3R5 trees (computed)', ['3R5a', '3R5b', '3R5c', '3R5d'].map(k => tree(k).tree), [true, true, false, false]);
eq('3R5 graph 3 disconnected (computed)', tree('3R5c').connected, false);
eq('3R5 graph 4 has a cycle (computed)', tree('3R5d').acyclic, false);

// Roots (3R6, answers computed)
eq('3R6 left roots (computed)', L.rootsOf(ids('3R6a'), es('3R6a')), ['A']);
eq('3R6 middle roots (computed)', L.rootsOf(ids('3R6b'), es('3R6b')).sort(), ['A', 'B', 'C']);
eq('3R6 right roots (computed)', L.rootsOf(ids('3R6c'), es('3R6c')), []);

// The lecture's DFS (3L31-3L39, 3L49-3L73)
const lec = L.dfsRun(G['3L31'].lists, '1');
eq('3L31 lists match the edges', ids('3L31').every(v => G['3L31'].lists[v].slice().sort().join() === es('3L31').flatMap(([a, b]) => (a === v ? [b] : b === v ? [a] : [])).sort().join()), true);
eq('3L31-38 visit order', lec.order.join(), '1,2,3,4,5,7,6,8');
eq('3L36 5 finishes first', lec.finish[0], '5');
eq('3L38 8 is last to start', lec.order.at(-1), '8');
eq('3L39 tree edges', key(lec.tree), key([['1', '2'], ['2', '3'], ['3', '4'], ['4', '5'], ['4', '7'], ['6', '7'], ['1', '8']]));

// Animation frames against the slide run
const dfsRun = A.dfs.build();
const names = (run, list) => list.map(i => run.ids[i]);
const calls = dfsRun.frames.filter(f => f.line === 1).map(f => names(dfsRun, f.Q).join(''));
eq('3L31-37 running stack at each call', calls, ['1', '12', '123', '1234', '12345', '12347', '123476', '18']);
eq('3L49 list order used by the run', dfsRun.frames.at(-1).tree.length, 7);
eq('DFS ends with an empty stack', dfsRun.frames.at(-1).Q, []);
eq('DFS marks everything', dfsRun.frames.at(-1).ready.length, 8);
const backs = dfsRun.frames.filter(f => /Back in/.test(f.msg)).map(f => f.msg.match(/Back in DFS\((\d)\)/)[1]).join('');
eq('3L36-38 backtrack order', backs, '4743211');

const st = A.spanningTree.build();
eq('3L40 line 7 adds n-1 edges', st.frames.filter(f => f.line === 7).length, 7);
eq("3L39 E' edges", key(st.frames.at(-1).tree.map(e => e.split('>'))), key(lec.tree));

const li = A.spanningTreeLists.build();
const callStack = li.frames.filter(f => f.line === 5).map(f => `${li.ids[f.holding]}:${names(li, f.Q).join('')}`);
eq('3L49-71 running vertex and stack', callStack, ['1:', '2:1', '3:12', '4:123', '5:1234', '7:1234', '6:12347', '8:1']);
const backTo = li.frames.filter(f => f.line === 12 && /Back in/.test(f.msg)).map(f => `${li.ids[f.holding]}:${names(li, f.Q).join('')}`);
eq('3L59-72 stack after each return', backTo, ['4:123', '7:1234', '4:123', '3:12', '2:1', '1:', '1:']);
const at59 = li.frames.findIndex(f => f.line === 12 && /Back in/.test(f.msg));
// 3L59 draws the state after "Back to DFS(4)" and v := v.next (line 13): list 4's pointer is already on 7.
const after59 = li.frames.findIndex((f, i) => i > at59 && f.line === 13);
const ptrs59 = Object.fromEntries(li.ids.map((id, i) => [id, li.frames[after59].ptrs[i]]));
eq('3L59 pointers: 1 at 2, 2 at 3, 3 at 4, 4 at 7, 5 at null', [ptrs59[1], ptrs59[2], ptrs59[3], ptrs59[4], ptrs59[5]], [0, 1, 1, 2, 2]);
eq('3L59 the frame shows list 4 at cell 7', li.ids[li.adj[li.ids.indexOf('4')][li.frames[after59].ptr.idx]], '7');
eq('3L59 M for 1 to 8', ['1', '2', '3', '4', '5', '6', '7', '8'].map(v => li.frames[at59].D[li.ids.indexOf(v)]).join(''), '11111000');
const m = id => li.frames.at(-1).D[li.ids.indexOf(id)];
eq('3L73 every M is 1', li.ids.every(id => m(id) === 1), true);
eq("3L73 E' has n-1 edges", li.frames.at(-1).outEdges.length, 7);
eq('3L73 same tree as 3L39', key(li.frames.at(-1).tree.map(e => e.split('>'))), key(lec.tree));

// The recitation's DFS (3R16-3R26)
const re = A.dfsRecitation.build();
const rStacks = re.frames.filter(f => f.line === 1).map(f => names(re, f.Q).join(''));
eq('3R18-26 running stack at each call', rStacks, ['4', '42', '423', '426', '41', '415']);
eq('3R26 tree', key(re.frames.at(-1).tree.map(e => e.split('>'))), key([['1', '5'], ['1', '4'], ['4', '2'], ['2', '3'], ['2', '6']]));

// Spanning trees (3R29)
eq('3R29 third graph has 3', L.spanningTrees(ids('3R29c'), es('3R29c')).length, 3);
eq('3R29 tree with 9 nodes has 1', L.spanningTrees(ids('3R29t'), es('3R29t')).length, 1);
for (const n of [3, 5, 8]) {
  const v = Array.from({ length: n }, (_, i) => String(i));
  eq(`3R29 cycle with ${n} nodes has ${n}`, L.spanningTrees(v, v.map((x, i) => [x, v[(i + 1) % n]])).length, n);
}

// Exercises 1 and 7: the possible candidates are computed; compare with brute force over all graphs
const Q = Exercises.treeQuestions;
const possibleBrute = (T1, r1, T2, r2) => {
  const v = T1.flat().filter((x, i, a) => a.indexOf(x) === i).sort();
  const all = []; v.forEach((a, i) => v.slice(i + 1).forEach(b => all.push([a, b])));
  const inT = (x, y) => [...T1, ...T2].some(([a, b]) => (a === x && b === y) || (a === y && b === x));
  const opt = all.filter(([a, b]) => !inT(a, b)), base = all.filter(([a, b]) => inT(a, b));
  for (let m = 0; m < 1 << opt.length; m++) {
    const g = [...base, ...opt.filter((_, i) => m >> i & 1)];
    if (L.allDfsTrees(v, g, r1).some(t => key(t) === key(T1)) && L.allDfsTrees(v, g, r2).some(t => key(t) === key(T2))) return true;
  }
  return false;
};
const check = (q, want) => {
  const got = q.candidates.map(c => L.dfsTreesCompatible(q.given.edges, q.givenRoot, c.edges, q.newRoot).ok);
  eq(q.slide + ' candidates, as on the solution slide', got, want);
  eq(q.slide + ' same as a search over all graphs', q.candidates.map(c => possibleBrute(q.given.edges, q.givenRoot, c.edges, q.newRoot)), want);
};
check(Q.ex1, [true, false, false]);
check(Q.ex7, [false, false, true]);
eq('3R32 witness adds (a,e)', key(L.dfsTreesCompatible(Q.ex1.given.edges, 'a', Q.ex1.candidates[0].edges, 'e').extra), 'ae');
eq('3R33 candidates use the edge (b,d)', [1, 2].map(i => L.dfsTreesCompatible(Q.ex1.given.edges, 'a', Q.ex1.candidates[i].edges, 'e').cross.some(c => key([c.edge]) === 'bd')), [true, true]);
const fig4Extra = key(L.dfsTreesCompatible(Q.ex7.given.edges, 'a', Q.ex7.candidates[2].edges, 'b').extra);
eq('3R45 witness adds (a,c) and (b,d)', fig4Extra, 'ac bd');
eq('3R45 Figure 2 has the edge (e,d)', L.dfsTreesCompatible(Q.ex7.given.edges, 'a', Q.ex7.candidates[0].edges, 'b').cross.some(c => key([c.edge]) === 'de'), true);

// Exercise 2 (3R35)
const kids = (tree, v) => tree.filter(([p]) => p === v).length;
const fromU = L.allDfsTrees(ids('3R35'), es('3R35'), 'u'), fromV = L.allDfsTrees(ids('3R35'), es('3R35'), 'v');
eq('3R35 some DFS(u) gives v 2 children', fromU.some(t => kids(t, 'v') === 2), true);
eq('3R35 every DFS(v) gives v a single child', fromV.every(t => kids(t, 'v') === 1), true);

// Exercise 3 (3R36-38)
const sol = es('3R37');
eq('3R37 every DFS(B) has deg(B) = 2', L.allDfsTrees(ids('3R37'), sol, 'B').every(t => t.filter(e => e.includes('B')).length === 2), true);
eq('3R38 has a Hamilton path', !!L.hamiltonianPath(ids('3R37'), sol), true);
eq('3R37 has no Hamilton cycle', L.hamiltonianCycle(ids('3R37'), sol, false), null);
eq('3R37 a vertex has degree above 2', Math.max(...Object.values(L.degrees(ids('3R37'), sol))) > 2, true);

// Exercises 5 and 6 on the 3R17 graph
const r = L.dfsRun(G['3R17'].lists, '4');
eq('3R41 back edges = |E|-|V|+1', es('3R17').length - r.tree.length, es('3R17').length - ids('3R17').length + 1);
eq('3R41 formula on the 3R17 graph (computed)', es('3R17').length - r.tree.length, 3);
const noS = es('3R17').filter(([a, b]) => a !== '4' && b !== '4');
const rest = ids('3R17').filter(v => v !== '4');
eq('3R42 removing 4 separates 1 from 2', L.pathBetween(rest, noS, '1', '2'), null);
eq('3R43 every DFS(4) has deg(4) > 1', L.allDfsTrees(ids('3R17'), es('3R17'), '4').every(t => t.filter(e => e.includes('4')).length > 1), true);

// Spanning tree by hand (3L28)
eq('3L28 is connected', L.treeStatus(ids('3L28'), es('3L28')).connected, true);
eq('3L28 has 10 edges on 7 vertices', [es('3L28').length, ids('3L28').length], [10, 7]);
};
