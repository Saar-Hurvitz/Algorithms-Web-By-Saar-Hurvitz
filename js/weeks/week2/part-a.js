/* Part A: Lecture 2 entries (order is set in week.js). */
window.E = window.E || {};

E.w2PathWords = {
  id: 'w2-path-words', title: 'Path vocabulary', slides: ['2L7'], checklist: [],
  html: String.raw`
<p>A [[path]] was defined in Week 1. This lecture numbers its [[vertex|vertices]] from 0 and adds some words for its parts.</p>
<div class="box definition">
  <span class="box-label">Definition {{2L7}}</span>
  <p>A path is a sequence of vertices $v_0, v_1, …, v_k$ such that $(v_i, v_{i+1}) \in E$ for all $0 \le i < k$.</p>
  <ul>
    <li>$v_0$ is the <dfn data-term="start-vertex">start vertex</dfn> and $v_k$ is the <dfn data-term="end-vertex">end vertex</dfn>.</li>
    <li>The <dfn data-term="path-length">length of the path</dfn> is $k$, the ==number of [[edge|edges]]==.</li>
  </ul>
</div>
<p>A path can also be written with its edges between the vertices, $v_0 \overset{e_1}{-} v_1 \overset{e_2}{-} \cdots \overset{e_k}{-} v_k$, or as the list of edges alone, $e_1, e_2, …, e_k$.</p>
<aside class="callout caution">
  <span class="callout-title">Count the edges, not the vertices</span>
  <p>A path with length $k$ lists <strong class="crucial">$k + 1$</strong> vertices. {{added}}</p>
</aside>`,
};

E.w2Simple = {
  id: 'w2-simple', title: 'Simple paths and simple cycles', slides: ['2L8'], checklist: ['w2c1'],
  html: String.raw`
<p>A [[cycle]] is a [[path]] whose [[start-vertex|start]] and [[end-vertex|end]] [[vertex|vertices]] are the same {{2L8}}.</p>
<div class="box definition">
  <span class="box-label">Definitions {{2L8}}</span>
  <ul>
    <li>A path is [[simple-path|simple]] if !!no vertex appears on it more than once!!.</li>
    <li>A cycle is [[simple-cycle|simple]] if no vertex, !!other than the start-end vertex!!, appears more than once, and the start-end vertex does not appear elsewhere in the cycle.</li>
  </ul>
</div>
<p>The exception is needed because every cycle repeats its start-end vertex: it is written first and last. ==That one repetition is the only one a simple cycle is allowed.== {{added}}</p>`,
};

E.w2Bridges = {
  id: 'w2-bridges', title: 'Euler and the Seven Bridges', slides: ['2L9', '2L10', '2L11', '2L12'], checklist: [],
  html: String.raw`
<p><strong>Leonhard Euler</strong> (1707–1783) was a Swiss mathematician, one of the most prolific of all times: calculus, differential geometry, number theory and more. The natural base $e$ is named after him; he introduced the notation $f(x)$ and the notation for complex numbers $a + ib$. He also contributed to optics, mechanics, magnetism and electricity. Laplace said: "Read Euler, read Euler, he is our master in everything" {{2L9}}.</p>
<div class="box definition">
  <span class="box-label">The Seven Bridges Problem {{2L10}} {{2L11}}</span>
  <p>Königsberg (today Kaliningrad) had seven bridges over the river Pregel. Goal: find a way to walk through the city by ==crossing each bridge exactly once== {{2L10}}.</p>
  <p>The model: each "area" is a [[vertex]] ($A, B, C, D$) and each bridge is an [[edge]]. Goal: find a [[path]] that traverses each edge exactly once {{2L11}}. The [[graph]] has [[parallel-edges|parallel edges]].</p>
</div>
<div class="box definition">
  <span class="box-label">Well-known puzzles {{2L12}}</span>
  <p><strong>P1.</strong> Can you draw these figures without lifting your pen from the paper, drawing each line only once? <strong>P2.</strong> Can you start and end at the same point?</p>
  <ul>
    <li>A: P1 yes, P2 yes.</li>
    <li>B: P1 yes, ==if you start at the lowest right (or left) corner==; P2 no.</li>
    <li>C: P1 no, P2 no.</li>
  </ul>
</div>`,
};

E.w2EulerDef = {
  id: 'w2-euler-def', title: 'Euler paths and Euler cycles', slides: ['2L13', '2L14'], checklist: ['w2c3'],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Definition {{2L13}}</span>
  <p>Given $G = (V, E)$, an <dfn data-term="euler-path">Euler path</dfn> is a [[path]] that includes ==each [[edge]] exactly once== (Problem 1).</p>
  <p>An <dfn data-term="euler-cycle">Euler cycle</dfn> is an Euler path that ==starts and ends at the same [[vertex]]== (Problem 2).</p>
</div>
<aside class="callout caution">
  <span class="callout-title">In this unit, multigraphs are allowed</span>
  <p>The [[graph|graphs]] are <strong class="crucial">not necessarily simple</strong>: [[parallel-edges|parallel edges]] and [[self-loop|self-loops]] are allowed {{2L13}}. So do not assume a [[simple-graph|simple graph]] when you meet an Euler question.</p>
</aside>
<p>Problem 1 is P1 of the puzzles (draw without lifting the pen); Problem 2 is P2 (start and end at the same point). {{2L14}} shows an Euler [[cycle]] for Puzzle A: each edge is [[label|labeled]] with its index in the path.</p>
<aside class="callout intuition">
  <span class="callout-title">Edges are the limit, vertices are not {{added}}</span>
  <p>Each edge is used exactly once, but a vertex may be visited as many times as its edges allow.</p>
</aside>`,
};

E.w2CycleCond = {
  id: 'w2-cycle-condition', title: 'When an Euler cycle exists', slides: ['2L15'], checklist: ['w2c4', 'w2c5'],
  html: String.raw`
<div class="box theorem">
  <span class="box-label">Characterization {{2L15}}</span>
  <p>A [[connected|connected graph]] has an [[euler-cycle|Euler cycle]] ==if and only if all its [[vertex|vertices]] have even [[degree|degrees]]==.</p>
</div>
<details class="proof" open><summary>Why an odd degree rules it out (only if)</summary>
  <p>A vertex has to be entered and left whenever it appears in a [[cycle]], hence need an even number of [[edge|edges]] at each vertex {{2L15}}.</p>
  <p>Each visit uses two edges at that vertex, one in and one out. The [[start-vertex|start vertex]] is no exception: its first edge out pairs with its last edge in. Every edge is used exactly once, so the edges at any vertex split into pairs. ==A vertex of odd degree would have one edge left over.== {{added}}</p>
</details>
<details class="proof"><summary>Why even degrees are enough (if)</summary>
  <p>By construction: there is a linear-time algorithm that builds the cycle {{2L15}}. It appears a few entries below.</p>
</details>
<aside class="callout caution">
  <span class="callout-title">What if the graph is not connected?</span>
  <p>An unconnected [[graph]] has an [[euler-cycle|Euler cycle]] only if it consists of !!isolated nodes and one component!! fulfilling the above conditions {{2L15}}.</p>
</aside>`,
};

E.w2PathCond = {
  id: 'w2-path-condition', title: 'When an Euler path exists', slides: ['2L16'], checklist: ['w2c4'],
  html: String.raw`
<div class="box theorem">
  <span class="box-label">Characterization {{2L16}}</span>
  <p>A [[connected|connected graph]] has an [[euler-path|Euler path]] which is !!not a [[cycle]]!! ==if and only if exactly two of its [[vertex|vertices]] have odd [[degree|degrees]]==.</p>
</div>
<p>Call the odd-degree vertices $a$ and $b$. ==One of them will be the start point and the other one will be the end point== {{2L16}}.</p>
<aside class="callout caution">
  <span class="callout-title">Not connected?</span>
  <p>Once again, the [[graph]] might be unconnected with one single [[connected-component|connected component]] and other isolated nodes {{2L16}}.</p>
</aside>`,
};

E.w2PathFromCycle = {
  id: 'w2-path-from-cycle', title: 'Euler path: no new algorithm needed', slides: ['2L16', '2L17'], checklist: ['w2c7'],
  html: String.raw`
<p>We don't need a separate algorithm for the [[euler-path|Euler path]] {{added}}. ==Reduce it to the [[euler-cycle|Euler cycle]]== {{2L16}}:</p>
<div class="box definition">
  <span class="box-label">Construction {{2L16}}</span>
  <ol>
    <li>Denote by $a$ and $b$ the odd-[[degree]] [[vertex|vertices]].</li>
    <li>Add an [[edge]] $(a, b)$. Now all vertices have even degrees.</li>
    <li>Build the Euler cycle, and at the end delete the edge $(a, b)$.</li>
  </ol>
</div>
<p>Deleting one edge from a [[cycle]] leaves a [[path]] that uses all the original edges, and its two ends are exactly $a$ and $b$.</p>
<div class="playground" data-play="w2-add-edge">
  <p class="playground-title">Add the edge $(a, b)$</p>
  <p class="playground-hint">The graph is from {{2L17}}. The number beside each vertex is its degree, and the vertices named a and b have odd degree. The slide names only a and b; t, l, r and m are added names. {{added}}</p>
  <div class="controls"><button type="button" class="ex-btn">Add the edge (a,b)</button></div>
  <div class="graph-box"></div>
  <p class="caption-live" aria-live="polite"></p>
</div>
<aside class="callout caution">
  <span class="callout-title">The new edge can be parallel</span>
  <p>On {{2L17}} an edge $(a, b)$ already exists, so the added one is a [[parallel-edges|parallel edge]]. The [[graph]] may not be simple, and that is OK {{2L17}}.</p>
</aside>
<aside class="callout caution">
  <span class="callout-title">⚠️ Typo on slide 17</span>
  <p>"Euler path whole endpoints" should read "whose endpoints".</p>
</aside>`,
  init(root) {
    const pg = root.querySelector('[data-play="w2-add-edge"]');
    const box = pg.querySelector('.graph-box'), cap = pg.querySelector('.caption-live'), btn = pg.querySelector('.controls button');
    let added = false;
    const draw = () => {
      const g = Exercises.graphs[added ? '2L17+' : '2L17'];
      const ids = g.nodes.map(n => n[0]), deg = GraphLogic.degrees(ids, g.edges), odd = GraphLogic.oddVertices(ids, g.edges);
      const gv = Exercises.gvMulti(box, g, { badges: true });
      ids.forEach(v => { gv.setBadge(v, deg[v]); gv.setNodeState(v, deg[v] % 2 ? 'ready' : ''); });
      btn.textContent = added ? 'Delete the edge (a,b)' : 'Add the edge (a,b)';
      cap.textContent = added ? 'With the extra edge, every degree is even, so an Euler cycle exists.'
        : `Only ${odd.join(' and ')} have odd degree, so an Euler path runs between them.`;
    };
    btn.addEventListener('click', () => { added = !added; draw(); });
    draw();
  },
};

E.w2BridgesBack = {
  id: 'w2-bridges-back', title: 'Back to the Seven Bridges', exercise: true, slides: ['2L18'], checklist: ['w2c4'],
  html: String.raw`
<p>The [[degree|degrees]] of the four [[vertex|vertices]] on {{2L18}}: $\deg(A) = 3$, $\deg(B) = 5$, $\deg(C) = 3$, $\deg(D) = 3$.</p>
<ul>
  <li>Sorry, ==no Euler cycle==: not all vertices have even degrees ([[euler-cycle|Euler cycle]], a [[cycle]]).</li>
  <li>Sorry, ==no Euler path==: more than 2 vertices have odd degrees ([[euler-path|Euler path]], a [[path]]).</li>
</ul>
<p>Check it on the [[graph]] of {{2L18}}; the answers are computed from its [[edge|edges]].</p>
<div class="ex-mount" data-ex="eulerClassify" data-graphs="2L18"></div>`,
};

E.w2Classify = {
  id: 'w2-classify', title: 'Cycle, path or neither?', slides: ['2L17', '2L21', '2L36', '2R5', '2R6'], checklist: ['w2c4'], exercise: true,
  html: String.raw`
<p>Practice the two characterizations. Count the [[degree]] of each [[vertex]], then decide whether the [[graph]] has an [[euler-cycle|Euler cycle]], an [[euler-path|Euler path]] that is not a [[cycle]], or neither. The graphs are copied from {{2L17}}, {{2L21}}, {{2L36}}, {{2R5}} and {{2R6}}.</p>
<div class="ex-mount" data-ex="eulerClassify"></div>`,
};

E.w2Find = {
  id: 'w2-find-cycle', title: 'Finding an Euler cycle', algo: true, slides: ['2L19', '2L20', '2L21', '2L22', '2L23'], checklist: ['w2c6', 'w2c7'],
  html: String.raw`
<p>Walk along untraced [[edge|edges]] until you get stuck, which is at the start. If edges remain, ==start a new walk from a [[vertex]] already on the tour, and merge the two [[cycle|cycles]]== {{2L20}}.</p>
<div class="algo-mount" data-euler></div>
<aside class="callout caution">
  <span class="callout-title">Where the code lines come from</span>
  <p>The lecture has no pseudo-code for this algorithm. The lines above are the bullets of {{2L19}} and {{2L20}}, with two differences: 2L20's question "Why?" after "The iteration will stop at A" is left out, and 2L19's Note is the box below. The recitation's pseudo-code is in Part B.</p>
</aside>
<div class="box theorem">
  <span class="box-label">Note {{2L19}}</span>
  <p>Each time we pass through a vertex we use up two of its [[incident]] edges. The [[degree]] of the vertex is even. Thus, the number of untraced incident edges after leaving it is even ==(a [[self-loop]] is counted twice)==.</p>
</div>
<aside class="callout example">
  <span class="callout-title">When the walk reached C {{2L22}}</span>
  <p>In the second walk BDECGB, when we reached $C$ we had to go to $G$, since $(C,B)$, $(C,A)$ and $(C,E)$ were already traced {{2L22}}.</p>
</aside>
<aside class="callout intuition">
  <span class="callout-title">Why does the walk stop at A? {{added}}</span>
  <p>{{2L20}} asks this. Using the Note above, after leaving any vertex other than $A$ an even number of its edges are untraced, and on entering it an odd number are. ==An odd number is never zero, so the walk can always leave.== It can only stop at $A$.</p>
</aside>
<aside class="callout intuition">
  <span class="callout-title">Why is there always an edge next to the cycle? {{added}}</span>
  <p>{{2L20}} asks this too. The [[graph]] is [[connected]]. If edges are still untraced, take a [[path]] from a tour vertex to an endpoint of one of them. Walking along it from the tour, the first untraced edge met starts at a vertex that already has a traced edge, so that vertex is on the tour.</p>
</aside>
<aside class="callout example">
  <span class="callout-title">The example on the slides</span>
  <p>With lists in A → Z order and the earliest tour vertex, the run matches {{2L21}}, {{2L22}} and {{2L23}}: ABCA, then BDECGB merged into ABDECGBCA, then DFEGD merged into ABDFEGDECGBCA. The slides only say "assume", so this list order is my reading of them. {{added}}</p>
  <p>Choose "[[euler-path|Euler path]] by adding (a,b)" in the Example menu to run the construction from the previous entries.</p>
</aside>`,
  init(root) { EulerView.mount(root.querySelector('[data-euler]'), Algorithms.euler); },
};

E.w2Linear = {
  id: 'w2-linear', title: 'Implementation in linear time', slides: ['2L24'], checklist: ['w2c6'],
  html: String.raw`
<p>Assume the [[graph]] is stored as [[adjacency-list|adjacency lists]]. We should keep track of already-traced [[edge|edges]] {{2L24}}:</p>
<ul>
  <li>Add a ==0/1 entry== in each linked-list cell: 1 means traced.</li>
  <li>Add ==a pair of pointers between the two entries of the same edge==, since an undirected edge sits in two lists {{added}}.</li>
  <li>Add ==a pointer to the next untraced edge== in every linked list.</li>
</ul>
<div class="table-wrap">
<table class="model">
  <caption>The status after A-B-C-A is traced {{2L24}}</caption>
  <thead><tr><th>List</th><th>Cells (neighbor, bit)</th><th>Next untraced</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>B 1, C 1</td><td>none</td></tr>
    <tr><td>B</td><td>A 1, C 1, D 0, G 0</td><td>D</td></tr>
    <tr><td>C</td><td>A 1, B 1, E 0, G 0</td><td>E</td></tr>
    <tr><td>G</td><td>B 0, C 0, D 0, E 0</td><td>B</td></tr>
  </tbody>
</table>
</div>
<div class="box theorem">
  <span class="box-label">Running time {{2L24}}</span>
  <p>==Every list is scanned exactly once== along the whole algorithm, so the time is $O(n + m)$.</p>
</div>
<p>The pointer between the two entries is what makes this work: tracing an edge from one end marks its other entry at once, so the other list never has to search for that entry; its next-untraced pointer just steps over it once. {{added}} The animation's counter shows it: at the end the number of list cells scanned is exactly $2m$. {{added}}</p>`,
};

E.w2Structure = {
  id: 'w2-structure', title: 'How the data structure changes the run', slides: ['2L21', '2L22', '2L23', '2L24'], checklist: ['w2c8'],
  html: String.raw`
<aside class="callout caution">
  <span class="callout-title">Not on the slides</span>
  <p>The checklist asks for this, but no slide states it. Everything here is computed by running the algorithm on the [[graph]] of {{2L21}}. {{added}}</p>
</aside>
<p>The algorithm says "choose <em>any</em> untraced [[edge]]" and "choose <em>any</em> edge [[adjacent]] to the [[cycle]]" {{2L19}} {{2L20}}. ==The data structure is what makes those choices==, so it decides how many iterations the run takes and which [[euler-cycle|Euler cycle]] comes out.</p>
<div class="table-wrap">
<table class="model">
  <thead><tr><th>[[adjacency-list|Adjacency lists]]</th><th>Next tour [[vertex]]</th><th>Cycles found</th><th>Iterations</th><th>Euler cycle</th></tr></thead>
  <tbody>
    <tr><td>A → Z</td><td>Earliest</td><td>ABCA, BDECGB, DFEGD</td><td>3</td><td>ABDFEGDECGBCA</td></tr>
    <tr><td>A → Z</td><td>Latest</td><td>ABCA, CEDBGC, GDFEG</td><td>3</td><td>ABCEDBGDFEGCA</td></tr>
    <tr><td>Z → A</td><td>Either</td><td>ACGEFDGBDECBA</td><td>1</td><td>ACGEFDGBDECBA</td></tr>
  </tbody>
</table>
</div>
<p>Try the switches in the animation above. All three results are valid Euler cycles {{added}}, and ==the running time stays $O(n + m)$==, because the lists are still scanned exactly once {{2L24}}.</p>
<aside class="callout intuition">
  <span class="callout-title">Same idea as Week 1</span>
  <p>A [[topo-sort]] also came out differently depending on the implementation (<a href="#e-topo-stack">Week 1</a>). When a problem has several valid answers, the data structure picks one. {{added}}</p>
</aside>`,
};

E.w2Trace = {
  id: 'w2-trace', title: 'Trace an Euler cycle yourself', slides: ['2L17', '2L21', '2R6', '2R8'], checklist: ['w2c6'], exercise: true,
  html: String.raw`
<p>Run the algorithm by hand on [[graph|graphs]] from {{2L21}}, {{2L17}}, {{2R6}} and {{2R8}}. Walk along [[edge|edges]] until you get stuck. If edges remain, start again from a [[vertex]] on the tour, and the new [[cycle]] is merged in. The result is an [[euler-cycle|Euler cycle]].</p>
<div class="ex-mount" data-ex="eulerTrace"></div>`,
};

E.w2Underlying = {
  id: 'w2-underlying', title: 'The underlying graph of a digraph', slides: ['2L25'], checklist: ['w2c2'],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Definition {{2L25}}</span>
  <p>Let $G = (V, E)$ be a [[directed-graph|directed graph]]. The <dfn data-term="underlying-graph">underlying graph</dfn> of $G$ is an [[undirected-graph|undirected graph]], with ==the same set of [[vertex|vertices]] and the same set of [[edge|edges]], without their direction==.</p>
</div>
<div class="playground" data-play="w2-underlying">
  <p class="playground-title">Directed graph and underlying graph</p>
  <p class="playground-hint">This is the [[graph]] from {{2L25}}.</p>
  <div class="controls"><button type="button" class="ex-btn">Remove the directions</button></div>
  <div class="graph-box"></div>
  <p class="caption-live" aria-live="polite"></p>
</div>`,
  init(root) {
    const pg = root.querySelector('[data-play="w2-underlying"]');
    const btn = pg.querySelector('.controls button'), cap = pg.querySelector('.caption-live');
    const gv = Exercises.gvMulti(pg.querySelector('.graph-box'), Exercises.graphs['2L25']);
    let directed = true;
    const show = () => {
      gv.setDirected(directed);
      btn.textContent = directed ? 'Remove the directions' : 'Put the directions back';
      cap.textContent = directed ? 'The directed graph G.' : 'The underlying graph of G: the same vertices and edges, without direction.';
    };
    btn.addEventListener('click', () => { directed = !directed; show(); });
    show();
  },
};

E.w2Digraph = {
  id: 'w2-digraph', title: 'Euler paths and cycles in digraphs', slides: ['2L26'], checklist: ['w2c9'],
  html: String.raw`
<div class="box theorem">
  <span class="box-label">Theorem {{2L26}}</span>
  <p>A [[directed-graph|digraph]] has an [[euler-path|Euler path]] if and only if its [[underlying-graph|underlying graph]] is connected (except maybe some isolated [[vertex|vertices]]) and one of the following two conditions holds:</p>
  <ol>
    <li>For all vertices $v$, $d_{out}(v) = d_{in}(v)$.</li>
    <li>There is one vertex $a$ such that $d_{out}(a) = d_{in}(a) + 1$ and another vertex $b$ such that $d_{out}(b) + 1 = d_{in}(b)$, while for all other vertices $v$, $d_{out}(v) = d_{in}(v)$.</li>
  </ol>
  <p>If 1 holds then every directed [[euler-path|Euler path]] is a directed [[euler-cycle|Euler cycle]]. If 2 holds then every directed [[euler-path|Euler path]] starts in $a$ and ends in $b$.</p>
</div>
<p>Here $d_{out}$ is the [[out-degree]] and $d_{in}$ the [[in-degree]].</p>
<aside class="callout caution">
  <span class="callout-title">Connected means the underlying graph</span>
  <p>The condition is on the !![[underlying-graph|underlying graph]]!!, so you may ignore the directions when checking connectivity {{2L26}}.</p>
</aside>
<div class="box definition">
  <span class="box-label">Algorithm {{2L26}}</span>
  <p>Identical to the undirected case. ==[[edge|Edges]] must be traced according to their direction.==</p>
</div>
<aside class="callout caution">
  <span class="callout-title">⚠️ Typo on slide 26</span>
  <p>"if any only if" should read "if and only if".</p>
</aside>`,
};

E.w2DeBruijnSeq = {
  id: 'w2-de-bruijn-seq', title: 'De Bruijn sequences', slides: ['2L27'], checklist: ['w2c10'],
  html: String.raw`
<p>Let $\Sigma = \{0, 1, …, \sigma - 1\}$ be an alphabet of $\sigma$ letters. There are $L = \sigma^n$ different words of length $n$ over $\Sigma$ {{2L27}}.</p>
<div class="box definition">
  <span class="box-label">Definition {{2L27}}</span>
  <p>A <dfn data-term="de-bruijn-sequence">De Bruijn sequence</dfn> is a ==circular== sequence $a_0 a_1 … a_{L-1}$ over $\Sigma$ such that for every word $w$ of length $n$ over $\Sigma$ there exists a !!unique!! $i$ such that</p>
  $$a_i a_{i+1} … a_{i+n-1} = w,$$
  <p>where the computation of the indices is modulo $L$.</p>
</div>
<p>The most important case is $\sigma = 2$, $\Sigma = \{0, 1\}$ {{2L27}}. De Bruijn was a Dutch mathematician (1918–2012) {{2L27}}.</p>
<aside class="callout example">
  <span class="callout-title">Example for $n = 2$ {{2L27}}</span>
  <p>The sequence is $0011$. Reading around the circle gives $00, 01, 11, 10$: each of the four words exactly once. The last word wraps around from the end to the start. {{added}}</p>
</aside>`,
};

E.w2DeBruijnGraph = {
  id: 'w2-de-bruijn-graph', title: 'The De Bruijn graph', slides: ['2L28', '2L29', '2L30'], checklist: ['w2c11'], exercise: true,
  html: String.raw`
<div class="box theorem">
  <span class="box-label">Theorem {{2L28}}</span>
  <p>For every positive integers $\sigma$ and $n$ there exists a [[de-bruijn-sequence|De Bruijn sequence]].</p>
</div>
<p>The proof is by construction. In order to find the sequence, build the following [[directed-graph|digraph]].</p>
<div class="box definition">
  <span class="box-label">Definition {{2L28}}</span>
  <p>The <dfn data-term="de-bruijn-graph">De Bruijn graph</dfn> $G_{\sigma,n} = (V, E)$:</p>
  <ol>
    <li>$V$ is the set of all $\sigma^{n-1}$ words of length $n - 1$ over $\Sigma$.</li>
    <li>$E$ is the set of all $\sigma^n$ words of length $n$ over $\Sigma$.</li>
    <li>The [[edge]] $b_1 b_2 … b_n$ starts at [[vertex]] $b_1 b_2 … b_{n-1}$ and ends at vertex $b_2 b_3 … b_n$.</li>
  </ol>
</div>
<p>==An edge is a word, and its two ends are that word without its last letter and without its first letter.== {{added}}</p>
<div class="ex-mount" data-ex="deBruijnBuild"></div>
<aside class="callout caution">
  <span class="callout-title">⚠️ Slides 29 and 30 are left for class</span>
  <p>{{2L29}} and {{2L30}} show only the vertices and say "complete in class". The edges in this exercise are computed from the rule on {{2L28}}. {{added}}</p>
</aside>`,
};

E.w2DeBruijnIff = {
  id: 'w2-de-bruijn-iff', title: 'De Bruijn sequences are Euler cycles', slides: ['2L31'], checklist: ['w2c13'],
  html: String.raw`
<p>Think of each word of length $n$ as an [[edge]] of the [[de-bruijn-graph|De Bruijn graph]] $G_{\sigma,n}$ {{2L28}}. Two properties link the [[graph]] to the sequence {{2L31}}:</p>
<ol>
  <li>The word $w_2$ can follow the word $w_1$ in a [[de-bruijn-sequence|De Bruijn sequence]] ==only if== the edge $w_2$ starts at the [[vertex]] in which $w_1$ ends.</li>
  <li>==If== the edge $w_2$ starts at the vertex in which $w_1$ ends, then the word $w_2$ can follow the word $w_1$ in a De Bruijn sequence.</li>
</ol>
<div class="box theorem">
  <span class="box-label">Therefore {{2L31}}</span>
  <p>A De Bruijn sequence for $\sigma$ and $n$ exists ==if and only if== $G_{\sigma,n}$ has a directed [[euler-cycle|Euler cycle]].</p>
</div>
<aside class="callout intuition">
  <span class="callout-title">Why this matches {{added}}</span>
  <p>Consecutive words in the sequence overlap in $n - 1$ letters, which is exactly the vertex between the two edges. The sequence must contain every word once, and an [[euler-cycle|Euler cycle]] uses every edge once.</p>
</aside>`,
};

E.w2DeBruijnEuler = {
  id: 'w2-de-bruijn-euler', title: 'Why the graph has an Euler cycle', slides: ['2L32', '2L33'], checklist: ['w2c12'],
  html: String.raw`
<p>We show that [[de-bruijn-graph|$G_{\sigma,n}$]] meets the conditions for a directed [[euler-cycle|Euler cycle]].</p>
<div class="box theorem">
  <span class="box-label">1. The [[underlying-graph|underlying graph]] is connected {{2L32}}</span>
  <p>Let $b_1 b_2 … b_{n-1}$ and $c_1 c_2 … c_{n-1}$ be any two [[vertex|vertices]]. A directed [[path]] leads from the first to the second, by following these [[edge|edges]]:</p>
  $$b_1 b_2 … b_{n-1} c_1, \quad b_2 … b_{n-1} c_1 c_2, \quad …, \quad b_{n-1} c_1 c_2 … c_{n-1}$$
  <p>Each edge drops the first letter and appends the next $c$. After $n - 1$ steps all the $b$'s are gone. {{added}}</p>
</div>
<div class="box theorem">
  <span class="box-label">2. $d_{out}(v) = d_{in}(v)$ for each vertex {{2L33}}</span>
  <p>The vertex $b_1 b_2 … b_{n-1}$ is entered by edges $c\,b_1 b_2 … b_{n-1}$, where $c$ can be chosen in $\sigma$ ways, and is the [[start-vertex|start vertex]] of edges $b_1 b_2 … b_{n-1} c$, where again $c$ can be chosen in $\sigma$ ways.</p>
</div>
<p>==So every vertex has [[in-degree]] $\sigma$ and [[out-degree]] $\sigma$==, and by the [[directed-graph|digraph]] theorem $G_{\sigma,n}$ has an [[euler-cycle|Euler cycle]] {{2L33}}.</p>`,
};

E.w2DeBruijnBuild = {
  id: 'w2-de-bruijn-build', title: 'Building a De Bruijn sequence', algo: true, slides: ['2L34'], checklist: ['w2c13'], exercise: true,
  html: String.raw`
<p>Given the [[de-bruijn-graph|De Bruijn graph]], the sequence comes straight from its [[euler-cycle|Euler cycle]] {{2L34}}. The lines of the animation are the steps of {{2L34}}, word for word.</p>
<div class="algo-mount" data-euler></div>
<aside class="callout example">
  <span class="callout-title">The example on the slide {{2L34}}</span>
  <p>For $n = 3$, $\sigma = 2$, the [[edge|edges]] are $000, 001, 010, 101, 011, 111, 110, 100$. Their first letters give $00010111$.</p>
  <p>{{2L34}} does not say which adjacency-list order produces this [[cycle]], so "As on slide 34" is an order chosen to reproduce it. Switch to A → Z: the run needs 3 iterations and gives a different valid sequence. {{added}}</p>
</aside>
<div class="ex-mount" data-ex="deBruijnTrace"></div>
<aside class="callout caution">
  <span class="callout-title">⚠️ Spelling on slide 34</span>
  <p>The slide writes "De-Bruin"; the name is De Bruijn. The code line is kept as the slide wrote it.</p>
</aside>`,
  init(root) { EulerView.mount(root.querySelector('[data-euler]'), Algorithms.deBruijn); },
};

E.w2Hamilton = {
  id: 'w2-hamilton', title: 'Hamiltonian paths and cycles', slides: ['2L35', '2R30'], checklist: ['w2c14'],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Definition {{2L35}} {{2R30}}</span>
  <p>A [[graph]] $G = (V, E)$ has a <dfn data-term="hamiltonian-cycle">Hamiltonian cycle</dfn> if there exists a [[cycle]] which goes through ==each [[vertex]] exactly once==.</p>
  <p>A <dfn data-term="hamiltonian-path">Hamiltonian path</dfn> is a [[path]] that visits ==each vertex exactly once==.</p>
</div>
<p>It seems closely related to the [[euler-cycle|Euler cycle]]. <strong class="crucial">It is not</strong> {{2L35}}.</p>
<div class="table-wrap">
<table class="model">
  <thead><tr><th></th><th>Euler</th><th>Hamilton</th></tr></thead>
  <tbody>
    <tr><td>Uses exactly once</td><td>each [[edge]]</td><td>each vertex</td></tr>
    <tr><td>Simple test</td><td>[[degree|degrees]] and connectivity</td><td>none known {{added}}</td></tr>
    <tr><td>Time to solve {{2L35}}</td><td>linear</td><td>search over every candidate, exponential in the [[worst-case|worst case]]</td></tr>
  </tbody>
</table>
</div>`,
};

E.w2EulerOrHam = {
  id: 'w2-euler-or-ham', title: 'Euler or Hamilton?', slides: ['2L36'], checklist: ['w2c14'], exercise: true,
  html: String.raw`
<p>{{2L36}} asks these questions about Graph I and Graph II without answering them. The answers below are computed from the [[graph|graphs]] and tagged accordingly. {{added}} Decide whether each graph has an [[euler-cycle|Euler cycle]] and a [[hamiltonian-cycle|Hamiltonian cycle]].</p>
<div class="ex-mount" data-ex="eulerOrHamilton"></div>`,
};

E.w2Exhaustive = {
  id: 'w2-exhaustive', title: 'No efficient algorithm is known', slides: ['2L37', '2L38'], checklist: ['w2c15'],
  html: String.raw`
<p>"Does $G$ contain a [[hamiltonian-cycle|Hamiltonian cycle]]?" is apparently an easy yes-or-no question {{2L37}}.</p>
<div class="box theorem">
  <span class="box-label">What is known {{2L37}}</span>
  <p>==No known efficient algorithm==, that is, no algorithm that runs in $O(n^p)$, polynomial time in the number of [[vertex|vertices]]. It requires <dfn data-term="exhaustive-search">exhaustive search</dfn>.</p>
</div>
<p>==We will not study an efficient algorithm for this, because none is known.==</p>
<div class="playground" data-play="w2-tree">
  <p class="playground-title">Search tree of paths from B {{2L38}}</p>
  <p class="playground-hint">Each level tries the unvisited neighbors of the last [[vertex]], in the [[graph]] of {{2L38}} (the same drawing as Graph II on {{2L36}}). The slide draws one more level, under $G$, before "Etc."; this tree shows the first two.</p>
  <div class="graph-box"></div>
</div>
<div class="box definition">
  <span class="box-label">How many candidate paths? {{2L38}}</span>
  <p>Let $r$ be the average branching factor at each node. The total number of [[path|paths]] to be examined can be estimated by $r \cdot r \cdot r \cdots r = O(r^n)$.</p>
  <p>Exponential time, so not practical.</p>
</div>`,
  init(root) {
    const pg = root.querySelector('[data-play="w2-tree"]');
    const nodes = [['B', 260, 22], ['D', 90, 88], ['G', 260, 88], ['C', 430, 88], ['G1', 45, 165], ['E1', 135, 165], ['D1', 205, 165], ['E2', 260, 165], ['C1', 315, 165], ['G2', 385, 165], ['E3', 475, 165]];
    const pairs = [['B', 'D'], ['B', 'G'], ['B', 'C'], ['D', 'G1'], ['D', 'E1'], ['G', 'D1'], ['G', 'E2'], ['G', 'C1'], ['C', 'G2'], ['C', 'E3']];
    GraphView.create(pg.querySelector('.graph-box'), {
      nodes: nodes.map(([id, x, y]) => ({ id, x, y, label: id[0] })),
      edges: pairs.map(([from, to]) => ({ id: `${from}>${to}`, from, to })),
      width: 520, height: 195, r: 16, directed: true, ariaLabel: 'Search tree of paths from B, two levels deep',
    });
  },
};

E.w2DiracOre = {
  id: 'w2-dirac-ore', title: 'Sufficient conditions: Dirac and Ore', slides: ['2L39'], checklist: [],
  html: String.raw`
<div class="box theorem">
  <span class="box-label">Sufficient conditions, undirected {{2L39}}</span>
  <ul>
    <li><strong>Dirac Theorem (1952):</strong> if $n \ge 3$ and for every [[vertex]] $v$, $d(v) \ge n/2$, then $G$ has a [[hamiltonian-cycle|Hamiltonian cycle]].</li>
    <li><strong>Ore Theorem (1960):</strong> if $n \ge 3$ and for every two vertices $v, u$ in $V$, $d(u) + d(v) \ge n$, then $G$ has a [[hamiltonian-cycle|Hamiltonian cycle]].</li>
  </ul>
  <p>Note: Dirac's condition is a special case of Ore's condition.</p>
</div>
<p>==These are sufficient, not necessary==: a [[graph]] can fail them and still have a [[hamiltonian-cycle|Hamiltonian cycle]]. {{added}}</p>
<p>For [[directed-graph|directed graphs]], the slide states one more fact: every tournament graph has a [[hamiltonian-path|Hamiltonian path]]. The next entries show why.</p>
<aside class="callout caution">
  <span class="callout-title">⚠️ These need a simple graph</span>
  <p>{{2L13}} says the graphs in this unit may have [[self-loop|self-loops]] and [[parallel-edges|parallel edges]], but these theorems hold for [[simple-graph|simple graphs]]. For example, the [[path]] $a - b - c$ with a self-loop on $a$ and on $c$ meets Dirac's condition and has no [[hamiltonian-cycle|Hamiltonian cycle]]. {{added}}</p>
</aside>
<aside class="callout caution">
  <span class="callout-title">⚠️ Ore is usually stated for non-adjacent pairs</span>
  <p>{{2L39}} says "every two vertices". The statement is true as written. The standard theorem asks for the condition only on pairs that are not [[adjacent]], which makes it stronger. {{added}}</p>
</aside>`,
};

E.w2Tournament = {
  id: 'w2-tournament', title: 'Tournament graphs', slides: ['2L40', '2L41'], checklist: [],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Model {{2L40}}</span>
  <p>$N$ teams. The input says, for each pair of teams, who won the game between them: all pairs of teams competed and there were no ties.</p>
  <p>A <dfn data-term="tournament-graph">tournament graph</dfn> is a [[clique|complete graph]] where each team is represented by a [[vertex]], with an [[edge]] $u \to v$ if $u$ won when playing against $v$.</p>
</div>
<p>The problem: find an arrangement of the teams on a line, so that every team won in the game against its successor {{2L41}}. ==This is exactly a [[hamiltonian-path|Hamiltonian path]]!==</p>
<div class="playground" data-play="w2-tourn">
  <p class="playground-title">The example from {{2L41}}</p>
  <p class="playground-hint">The highlighted [[path]] is $1 \to 3 \to 2 \to 4$.</p>
  <div class="graph-box"></div>
</div>`,
  init(root) {
    const g = Exercises.graphs['2L40'];
    const gv = Exercises.gvMulti(root.querySelector('[data-play="w2-tourn"] .graph-box'), g, { r: 24 });
    [['1', '3'], ['3', '2'], ['2', '4']].forEach(([a, b]) => gv.setEdgeState(`e${g.edges.findIndex(e => e[0] === a && e[1] === b)}`, 'out'));
  },
};

E.w2TournamentPath = {
  id: 'w2-tournament-path', title: 'Finding the Hamiltonian path of a tournament', algo: true, slides: ['2L42'], checklist: [],
  html: String.raw`
<p>The solution is by induction {{2L42}}. One directed [[edge]] defines a [[hamiltonian-path|Hamiltonian path]]. Solve the problem for the first $N - 1$ groups, then find the correct place for the $N$-th group. The lines below are the bullets of {{2L42}}, word for word.</p>
<div class="algo-mount" data-tournament></div>
<div class="box theorem">
  <span class="box-label">Why such a location exists {{added}}</span>
  <p>{{2L42}} asks this. Take the line $u_1, …, u_{N-1}$ and the new team $N$:</p>
  <ul>
    <li>If $N$ won against $u_1$, put $N$ first.</li>
    <li>If every team on the line won against $N$, put $N$ last.</li>
    <li>Otherwise let $u_i$ be the ==first team on the line that $N$ won against==. Then $u_{i-1}$ won against $N$, and $N$ won against $u_i$, so $N$ fits between them.</li>
  </ul>
  <p>Every pair played, so one of these always applies. That is the animation's rule, and it shows that every [[tournament-graph|tournament graph]] has a [[hamiltonian-path|Hamiltonian path]] {{2L39}}.</p>
</div>`,
  init(root) { TournamentView.mount(root.querySelector('[data-tournament]')); },
};
