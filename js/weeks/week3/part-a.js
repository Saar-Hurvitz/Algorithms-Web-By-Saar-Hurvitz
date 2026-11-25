/* Part A: Lecture 3 entries (order is set in week.js). */
window.E = window.E || {};

(function () {
  const range = (deck, from, to) => Array.from({ length: to - from + 1 }, (_, i) => `${deck}${from + i}`);

  E.w3Review = {
    id: 'w3-review', title: 'Review of Lecture 2', recap: true, slides: range('3L', 2, 6), checklist: [],
    html: String.raw`
<p>Lecture 3 opens by reviewing Lecture 2. Everything here was already taught in Week 2.</p>
<ul>
  <li>[[euler-path|Euler path]]: a [[path]] of length $m$ that traverses every [[edge]] exactly once. If it begins and ends at the same node, it is an [[euler-cycle|Euler cycle]] {{3L2}}.</li>
  <li>A connected [[graph]] has an Euler cycle if and only if all its [[vertex|vertices]] have an even [[degree]]. It has an Euler path that is not a [[cycle]] if and only if exactly two vertices have an odd degree {{3L3}}.</li>
  <li>There is an algorithm for finding an Euler cycle {{3L3}}.</li>
  <li>For [[directed-graph|directed graphs]] {{3L4}}: the [[underlying-graph|underlying undirected graph]] is connected, and either (cycle) $d_{in}(v) = d_{out}(v)$ for all $v$, or (path) $d_{in}(v) = d_{out}(v)$ for all but two vertices, with $d_{out}(a) = d_{in}(a) + 1$ for one vertex $a$ ($a$ will be first) and $d_{in}(b) = d_{out}(b) + 1$ for one vertex $b$ ($b$ will be last).</li>
  <li>A [[de-bruijn-sequence|De Bruijn sequence]] is a (circular) sequence $a_0 a_1 \dots a_{L-1}$ over $\Sigma$ such that, for every word $w$ of length $n$ over $\Sigma$, there exists a unique $i$ such that $a_i a_{i+1} \dots a_{i+n-1} = w$. For every positive integers $\sigma$ and $n$ there exists one; the proof is by construction {{3L5}}.</li>
  <li>The construction: given $n$ and $\sigma$, build a directed [[graph]], the [[de-bruijn-graph|De Bruijn graph]], in which every word of length $n$ over $\Sigma$ corresponds to an [[edge]]: $b_1 b_2 \dots b_n$ goes from $b_1 \dots b_{n-1}$ to $b_2 \dots b_n$. An Euler cycle gives a De Bruijn sequence. The example is $n = 4$, $\sigma = 2$ {{3L6}}.</li>
</ul>`,
  };

  E.w3Hamilton = {
    id: 'w3-hamilton', title: 'Hamilton paths: what is and is not known', recap: true, slides: ['3L7'], checklist: ['w3c1', 'w3c2', 'w3c3'],
    html: String.raw`
<p>A [[hamiltonian-path|Hamilton path]] ([[hamiltonian-cycle|cycle]]) visits ==every [[vertex|node]] exactly once==. Equivalently, it is a [[simple-path|simple path]] ([[simple-cycle|simple cycle]]) of length $n-1$ ($n$) {{3L7}}.</p>
<p>Compare with an [[euler-path|Euler path]], which uses every [[edge]] exactly once. An Euler path is decided by [[degree|degrees]] and connectivity. For Hamilton [[path|paths]], nothing like that is known. {{added}}</p>
<div class="box definition">
  <span class="box-label">Efficient {{3L7}} {{2L37}}</span>
  <p><dfn data-term="polynomial-time">Polynomial time</dfn> means $O(n^p)$ for some constant $p$. It is what the course considers efficient.</p>
  <p>For Hamilton paths: ==no efficient (poly-time) algorithm is known==.</p>
</div>
<p>The week's checklist adds: currently, no one knows how to detect a Hamilton path in polynomial time, ==nor has anyone proved that it is impossible==. {{added}}</p>
<p>However, there are some known sufficient conditions, on the next card {{3L7}}.</p>`,
  };

  E.w3Sufficient = {
    id: 'w3-sufficient', title: 'Sufficient conditions for a Hamilton cycle', recap: true, slides: ['3L8'], checklist: ['w3c4'],
    html: String.raw`
<p>The same conditions as in <a href="#e-w2-dirac-ore">the Week 2 entry</a> {{3L8}}:</p>
<ul>
  <li><strong>Undirected, Dirac (1952):</strong> if $n \ge 3$ and for every [[vertex]] $v$, $\deg(v) \ge n/2$, then $G$ has a [[hamiltonian-cycle|Hamiltonian cycle]].</li>
  <li><strong>Undirected, Ore (1960):</strong> if $n \ge 3$ and for every two vertices $v, u$ in $V$, $\deg(u) + \deg(v) \ge n$, then $G$ has a [[hamiltonian-cycle|Hamiltonian cycle]]. Dirac's condition is a special case of Ore's.</li>
  <li><strong>Directed:</strong> every [[tournament-graph|tournament graph]] has a [[hamiltonian-path|Hamiltonian path]].</li>
</ul>
<aside class="callout caution">
  <span class="callout-title">⚠️ The Ore condition again</span>
  <p>{{3L8}} repeats "every two vertices". The standard theorem asks it only of pairs that are not [[adjacent]]. The note in <a href="#e-w2-dirac-ore">the Week 2 entry</a> applies here too. {{added}}</p>
</aside>`,
  };

  E.w3Tournament = {
    id: 'w3-tournament', title: 'Every tournament has a Hamilton path', recap: true, slides: ['3L9', '3L10', '3L11'], checklist: ['w3c5'],
    html: String.raw`
<p>The same model as in <a href="#e-w2-tournament">Week 2</a>, a [[tournament-graph|tournament graph]]: $n$ teams, every pair played, no ties. The model is a [[clique|complete graph]]: each team is represented by a [[vertex]], with an [[edge]] $u \to v$ if $u$ won when playing against $v$ {{3L9}}. Arranging the teams on a line so that every team beat its successor is ==exactly a [[hamiltonian-path|Hamiltonian path]]== {{3L10}}. In the example, $1 \to 3 \to 2 \to 4$.</p>
<p>The solution is by induction on the number of teams {{3L11}}:</p>
<ol>
  <li><strong>Base case</strong> ($n = 2$): one directed edge defines a Hamilton [[path]].</li>
  <li>Solve the problem for the first $n-1$ groups.</li>
  <li>Find the correct place for the $n$-th group. {{3L11}} asks why such a place exists.</li>
</ol>
<p>The answer is worked out in <a href="#e-w2-tournament-path">the Week 2 animation</a>: place $n$ just before the first team on the line that it beat, or at the end if it lost to all of them. {{added}}</p>
<aside class="callout checklist">
  <span class="callout-title">From the checklist</span>
  <p>The checklist also asks you to read the proof by induction available on Moodle. It is not part of these slides, so it is not reproduced here. {{added}}</p>
</aside>`,
  };

  E.w3Tree = {
    id: 'w3-tree', title: 'Undirected trees', slides: ['3L13'], checklist: ['w3c6'],
    html: String.raw`
<div class="box definition">
  <span class="box-label">Definition {{3L13}}</span>
  <p>An <strong class="crucial">undirected</strong> [[graph]] is a <dfn data-term="tree">tree</dfn> if it is ==connected and contains no [[cycle|cycles]]==.</p>
</div>
<p>{{3L13}} shows a tree and two graphs that are not trees, on the same seven [[vertex|vertices]]:</p>
<ul>
  <li>The left box drops the [[edge]] $(E, D)$, so the graph is <strong>not connected</strong>: $D$ and $C$ are cut off from the rest.</li>
  <li>The right box adds the edge $(F, G)$, which <strong>closes a cycle</strong>: $E, F, G, A, E$.</li>
</ul>
<p>The two conditions fail independently. Together they make a tree. {{added}}</p>`,
  };

  E.w3TreeEquiv = {
    id: 'w3-tree-equiv', title: 'Equivalent definitions, and n−1 edges', slides: ['3L14', '3L15'], checklist: ['w3c6', 'w3c7'],
    html: String.raw`
<div class="box theorem">
  <span class="box-label">Theorem: all four are equivalent {{3L14}} {{3L15}}</span>
  <ol type="a">
    <li>$G$ is a [[tree]] (connected and contains no [[cycle|cycles]]).</li>
    <li>$G$ is cycles-free, but ==if any new [[edge]] is added to $G$, a cycle is formed==.</li>
    <li>For every two [[vertex|vertices]] there is a ==unique [[simple-path|simple path]]== connecting them.</li>
    <li>$G$ is connected, but ==if any edge is deleted from $G$, the connectivity of $G$ is interrupted==.</li>
  </ol>
</div>
<p>Condition (d) is the formal meaning of <strong>minimally connected</strong>: connected, with no edge to spare. Condition (b) says the opposite side of the same coin: cycles-free, with no room for one more edge. {{added}}</p>
<div class="box theorem">
  <span class="box-label">Some more equivalent definitions {{3L15}}</span>
  <ol>
    <li>$G$ is connected and has $n - 1$ edges.</li>
    <li>$G$ is [[acyclic]] and has $n - 1$ edges.</li>
  </ol>
</div>
<p>So <strong>every tree on $n$ vertices has $n-1$ edges</strong> {{3L15}}. The recitation relies on this too {{3R11}}.</p>
<details class="proof"><summary>Why a tree has n−1 edges {{added}}</summary>
<p>By induction on $n$. A tree on one vertex has no edges. For $n \ge 2$, connectivity gives an edge $e = (a, b)$. By (d), deleting $e$ disconnects $G$ into exactly two parts, one containing $a$ and one containing $b$. Each part is connected with no cycles, so each is a tree, on $n_1$ and $n_2$ vertices, with $n_1 + n_2 = n$. By induction they have $n_1 - 1$ and $n_2 - 1$ edges. Adding $e$ back gives $(n_1 - 1) + (n_2 - 1) + 1 = n - 1$.</p>
</details>`,
  };

  E.w3TreeProof = {
    id: 'w3-tree-proof', title: 'Proof of the equivalences', slides: range('3L', 16, 23), checklist: ['w3c7'],
    html: String.raw`
<p>The proof goes around a circle: (a) ⟹ (b) ⟹ (c) ⟹ (d) ⟹ (a) {{3L15}}. The Hebrew slides {{3L20}} to {{3L23}} give the same proof.</p>
<details class="proof" open><summary>(a) ⟹ (b) {{3L16}}</summary>
<p>Let $e = (a, b)$ be a new [[edge]], that is, $e \notin E$, $a, b \in V$. If $a = b$, then $e$ forms a [[self-loop]] cycle. If $a \ne b$: $G$ is connected, so there is a [[path]] in $G$ (without $e$) connecting $a$ and $b$. If we add $e$, this path with $e$ forms a [[cycle]].</p>
</details>
<details class="proof" open><summary>(b) ⟹ (c) {{3L17}}</summary>
<p>Let $a$ and $b$ be any two [[vertex|vertices]] of $G$.</p>
<ul>
  <li><strong>Exists:</strong> if there is no path between $a$ and $b$, then we can add an edge $(a, b)$ without creating a cycle, a contradiction.</li>
  <li><strong>Simple:</strong> if a path is not simple, a cycle exists.</li>
  <li><strong>Unique:</strong> assume by contradiction that there are at least two paths, $p$ and $p'$, between $a$ and $b$. Let $u$ be the first vertex in which the paths separate (possibly $u = a$), and let $v$ be the first vertex in which the paths meet again (possibly $v = b$). The two disjoint subpaths between $u$ and $v$ form a cycle in $G$.</li>
</ul>
</details>
<details class="proof" open><summary>(c) ⟹ (d) {{3L18}}</summary>
<p>It is given that $G$ is connected. Assume that an edge $e = (a, b)$ is deleted. If there is now (after the deletion of $e$) a path between $a$ and $b$, then $G$ has more than one [[simple-path|simple path]] between $a$ and $b$.</p>
</details>
<details class="proof" open><summary>(d) ⟹ (a) {{3L19}}</summary>
<p>We assume that $G$ is connected and that no edge can be deleted without interrupting the connectivity. If $G$ contains a [[simple-cycle|simple cycle]], any edge on this cycle can be deleted without interrupting the connectivity. Thus, $G$ is cycles-free.</p>
</details>`,
  };

  E.w3Minimal = {
    id: 'w3-minimal', title: 'Minimally connected, live', exercise: true, slides: ['3L13', '3L14'], checklist: ['w3c7'],
    html: String.raw`
<p>Test the equivalent definitions of a [[tree]] on the tree of {{3L13}}. Deleting any [[edge]] disconnects it, adding any new edge closes a [[cycle]], and any two [[vertex|vertices]] are joined by exactly one simple [[path]] {{3L14}}.</p>
<div class="ex-mount" data-ex="minimalTree"></div>`,
  };

  E.w3DirectedTree = {
    id: 'w3-directed-tree', title: 'Roots and directed trees', slides: ['3L24'], checklist: ['w3c8'],
    html: String.raw`
<div class="box definition">
  <span class="box-label">Definition {{3L24}}</span>
  <p>In a [[directed-graph|directed graph]], $r \in V$ is a <dfn data-term="root">root</dfn> if every [[vertex]] $v \in V$ is reachable from $r$. That is, there is a directed [[path]] that starts in $r$ and ends in $v$.</p>
</div>
<div class="box definition">
  <span class="box-label">Definition {{3L24}}</span>
  <p>A [[directed-graph|directed graph]] is a <dfn data-term="directed-tree">directed tree</dfn> if ==it has a root and its [[underlying-graph|underlying undirected graph]] is a [[tree]]==.</p>
</div>
<p>On {{3L24}}, $D$ is the root: every other vertex is reachable from it along the arrows.</p>`,
  };

  E.w3DirectedAlt = {
    id: 'w3-directed-alt', title: 'Alternative definitions of directed trees', slides: ['3L25'], checklist: ['w3c8'],
    html: String.raw`
<div class="box theorem">
  <span class="box-label">Equivalent {{3L25}}</span>
  <p>(a) $G$ is a [[directed-tree|directed tree]].</p>
  <p>(b) $G$ has a [[root]] from which there is a ==unique== directed [[path]] to every [[vertex]].</p>
  <p>(c) $G$ has a root $r$ for which $d_{in}(r) = 0$ and for every other vertex $v$, $d_{in}(v) = 1$.</p>
</div>
<p>The example on {{3L25}} is the directed [[tree]] of {{3L24}}, with root $D$.</p>`,
  };

  E.w3Broadcast = {
    id: 'w3-broadcast', title: 'Applied algorithm scenario: broadcasting', slides: ['3L26', '3L27'], checklist: [],
    html: String.raw`
<p>The <strong>applied algorithm scenario</strong> {{3L26}}: a real world problem → abstractly model the problem → find an abstract algorithm → adapt it to the original problem.</p>
<div class="box definition">
  <span class="box-label">Broadcasting in a network {{3L27}}</span>
  <p>A network of routers. Goal: organize the routers to efficiently broadcast messages to each other. A router that gets a message duplicates it and sends it to some of its neighbors. Eventually all routers get the message.</p>
  <p>==Goal: minimize the number of messages.==</p>
</div>
<p>The model of this problem is the next card's [[graph]].</p>`,
  };

  E.w3Spanning = {
    id: 'w3-spanning', title: 'Spanning trees', slides: ['3L28', '3L29'], checklist: ['w3c9'],
    html: String.raw`
<p>On {{3L28}} a [[vertex]] is a router and an [[edge]] is a link between routers. A <strong>spanning tree</strong> connects all the vertices with no [[cycle|cycles]]. The slide draws one in red. {{3L31}} draws the same [[graph]] with an extra vertex $8$; with its numbering, the red edges are $(1,2), (2,3), (2,5), (3,7), (6,7), (4,7)$. {{added}}</p>
<div class="box definition">
  <span class="box-label">Spanning Tree Problem {{3L29}}</span>
  <p><strong>Input:</strong> an [[undirected-graph|undirected graph]] $G = (V, E)$. $G$ is connected.</p>
  <p><strong>Output:</strong> $E' \subseteq E$ such that $(V, E')$ is a [[connected|connected graph]] and $(V, E')$ has no cycles.</p>
  <p>Such an $E'$ is a <dfn data-term="spanning-tree">spanning tree</dfn> of $G$: the same vertices, ==a subset of the edges==, and a [[tree]].</p>
</div>`,
  };

  E.w3BuildSpanning = {
    id: 'w3-build-spanning', title: 'Build a spanning tree by hand', exercise: true, slides: ['3L28'], checklist: ['w3c9'],
    html: String.raw`
<p>Pick edges of the network on {{3L28}} until you have a [[spanning-tree|spanning tree]]. Many [[tree|trees]] are correct. The [[vertex|vertices]] have no names on the slide. {{3L31}} draws the same network with an extra vertex $8$, so they are numbered as there. {{added}} An [[edge]] that closes a [[cycle]] is refused.</p>
<div class="ex-mount" data-ex="buildSpanning"></div>`,
  };

  E.w3DFS = {
    id: 'w3-dfs', title: 'Depth First Search', algo: true, slides: range('3L', 30, 39), checklist: ['w3c10', 'w3c13'],
    html: String.raw`
<div class="box definition">
  <span class="box-label">Algorithm {{3L30}}</span>
  <p><dfn data-term="dfs">Depth First Search (DFS)</dfn> is a ==recursive marking algorithm==. Initially every [[vertex]] is unmarked.</p>
  <pre class="code-block">DFS(i : vertex)
  mark i;
  for each j adjacent to i do
    if j is unmarked then DFS(j)</pre>
</div>
<div class="box definition">
  <span class="box-label">Not afraid of recursion {{3L31}}</span>
  <p>A recursive call waits for the call it started. The calls still in progress form the <dfn data-term="running-stack">running stack</dfn>: the one ==on top is running now==, and everything below is paused where it left off. {{3L31}} names the running stack; the explanation is added. {{added}}</p>
</div>
<p>On the [[graph]] of {{3L31}}, starting from $1$, the search goes $1, 2, 3, 4, 5$ ({{3L31}} to {{3L35}}). Then $5$ is no longer in the stack: it is the first vertex to complete its DFS run {{3L36}}, as all its [[adjacent|neighbors]] are marked. {{added}} The search backs up to $4$ and continues to $7$ and $6$ {{3L37}}, backtracks to $1$, and finally visits $8$ {{3L38}}.</p>
<aside class="callout caution">
  <span class="callout-title">⚠️ All marked is not the end</span>
  <p>On {{3L38}} all vertices are marked, but ==DFS does not terminate yet, the stack is still not empty==. It ends on {{3L39}}, when the stack is empty, meaning that all vertices verified that all their neighbors are marked.</p>
</aside>
<p>The [[edge|edges]] traversed in the DFS form a [[spanning-tree|spanning tree]] {{3L39}}. The list order comes from {{3L49}}. It is what decides the run. {{added}} The [[tree]] edges are drawn thick.</p>
<div class="algo-mount" data-algo="dfs"></div>`,
  };

  E.w3DFSHand = {
    id: 'w3-dfs-hand', title: 'You are the DFS', exercise: true, slides: ['3L31', '3L49'], checklist: ['w3c10'],
    html: String.raw`
<p>Run [[dfs|DFS]] by hand on the [[graph]] of {{3L31}}. Follow the [[adjacency-list|adjacency lists]] of {{3L49}}, or switch to any order: the slide's "for each $j$ [[adjacent]] to $i$" {{3L30}} does not fix one. {{added}} The [[running-stack|running stack]] moves with you.</p>
<div class="ex-mount" data-ex="dfsByHand"></div>`,
  };

  E.w3ST = {
    id: 'w3-st', title: 'The Spanning Tree algorithm', algo: true, slides: ['3L40'], checklist: ['w3c11'],
    html: String.raw`
<p>The algorithm is [[dfs|DFS]] plus one line {{3L40}}: ==whenever an unmarked node $j$ is discovered by its neighbor $i$, add the [[edge]] $(i, j)$ to the [[spanning-tree|spanning tree]]==. The [[vertex]] $s$ it starts from is arbitrary.</p>
<div class="algo-mount" data-algo="spanningTree"></div>`,
  };

  E.w3EdgeClass = {
    id: 'w3-edge-class', title: 'Edge classification: tree edges and back edges', slides: ['3L41'], checklist: ['w3c11'],
    html: String.raw`
<div class="box definition">
  <span class="box-label">Edges classification {{3L41}}</span>
  <p>For [[dfs|DFS]] of an [[undirected-graph|undirected graph]], the [[edge|edges]] are classified:</p>
  <p><dfn data-term="tree-edge">Tree edges</dfn> belong to the [[spanning-tree|spanning tree]]. They connect a node and the [[vertex]] that "discovers" it.</p>
  <p><dfn data-term="back-edge">Back edges</dfn> are ==all other edges==. They connect a node and an already-marked neighbor.</p>
</div>
<p>On the [[graph]] of {{3L41}}, the [[tree]] of {{3L39}} leaves four back edges: $(1,6), (1,7), (2,5), (3,7)$.</p>`,
  };

  E.w3Evaluate = {
    id: 'w3-evaluate', title: 'Evaluating the algorithm', slides: ['3L42', '3L43'], checklist: [],
    html: String.raw`
<p>Back to the applied algorithm scenario {{3L42}}: after the abstract algorithm is found and adapted, ==evaluate== it. What can go wrong: the wrong problem, the wrong model, an incorrect algorithm, or poor performance.</p>
<div class="box definition">
  <span class="box-label">Evaluation step expanded {{3L43}}</span>
  <p><strong>Algorithm correct?</strong> If no: a new algorithm, a new model, or a new problem. If yes: <strong>choose a data structure</strong>.</p>
  <p><strong>Performance?</strong> If unsatisfactory: a new data structure, a new algorithm, or a new model. If satisfactory: <strong>implement</strong>.</p>
</div>`,
  };

  E.w3Correct = {
    id: 'w3-correct', title: 'Why the algorithm is correct', slides: ['3L44', '3L45'], checklist: ['w3c11'],
    html: String.raw`
<p>Let $T = (V, E')$ be the [[graph]] resulting from running [[dfs|DFS]] {{3L44}}. Two claims make $T$ a [[spanning-tree|spanning tree]]: no [[cycle|cycles]], and connected.</p>
<div class="box definition">
  <span class="box-label">Definition {{3L44}}</span>
  <p>An <dfn data-term="invariant">invariant</dfn> is a property of a program that is true before (and after) each iteration.</p>
</div>
<div class="box theorem">
  <span class="box-label">Claim 1: there are no cycles in $T$ {{3L44}}</span>
  <p>This is an invariant of the algorithm. Each [[edge]] added to $T$ goes from a [[vertex]] in $T$ to a vertex ==not in $T$==, therefore no cycle is closed.</p>
</div>
<div class="box theorem">
  <span class="box-label">Claim 2: if $G$ is connected then so is $T$ {{3L45}}</span>
  <p>Consider two vertices $i$ and $j$ in $V$. In $G$, there are [[path|paths]] connecting $s$ and $i$ and $s$ and $j$. Assume by contradiction that $i$ and $j$ are not connected in $T$. It must be that at least one vertex along these paths is not marked.</p>
  <p>Let $u$ be a vertex closest to $s$ which is not marked on these paths. Let $v$ be $u$'s neighbor in the path to $s$. The fact that $u$ is unmarked is a contradiction to the DFS execution on $v$.</p>
</div>
<aside class="callout caution">
  <span class="callout-title">⚠️ A stray bracket</span>
  <p>The definition of an invariant on {{3L44}} ends with a stray "]". Nothing is missing from it. {{added}}</p>
</aside>`,
  };

  E.w3DSChoice = {
    id: 'w3-ds-choice', title: 'Choosing the data structure', slides: ['3L46', '3L47'], checklist: ['w3c12'],
    html: String.raw`
<p>The algorithm is correct ("yes!" on {{3L46}}), so the next step of the evaluation is to choose a data structure.</p>
<div class="box definition">
  <span class="box-label">Data structure choice {{3L47}}</span>
  <p>Both the [[adjacency-matrix|adjacency matrix]] and [[adjacency-list|adjacency lists]] support [[dfs|depth first search]] on [[graph|graphs]]. As in many other algorithms, the adjacency matrix is good for ==dense== graphs, while adjacency lists are good for ==sparse== graphs.</p>
  <p><dfn data-term="dense-graph">Dense graph</dfn>: $m = \Theta(n^2)$. For example, "half of the [[vertex|nodes]] have [[degree]] $n/5$".</p>
  <p><dfn data-term="sparse-graph">Sparse graph</dfn>: $m = O(n)$. For example, "5 nodes have degree $n/2$, and all other nodes have degree at most 8".</p>
  <p><strong>Most practical graphs are sparse.</strong></p>
</div>`,
  };

  E.w3Lists = {
    id: 'w3-lists', title: 'Spanning Tree with adjacency lists', algo: true, slides: range('3L', 48, 73), checklist: ['w3c10', 'w3c12'],
    html: String.raw`
<p>The same algorithm, with the data structure made explicit {{3L48}}: $G$ is an array of [[adjacency-list|adjacency lists]], and $M$ is the marking array, a 0/1 entry for each [[vertex]]. The [[dfs|DFS]] walks each list with a pointer $v$.</p>
<aside class="callout caution">
  <span class="callout-title">⚠️ The name on the slide</span>
  <p>On {{3L48}}, Main calls <code>Spanning_Tree(s)</code>, while the procedure below is named <code>ST</code>. They are the same procedure. {{added}}</p>
</aside>
<p>This is the run of {{3L49}} to {{3L73}}. Each paused call keeps its own pointer: a red arrow on the slides, an outlined cell here. On {{3L59}}, list $4$ continues at $7$ after $5$ finishes. That is because the [[running-stack|running stack]] remembers where every call stopped. {{added}} The result is the [[spanning-tree|spanning tree]] of {{3L39}}, as $E'$.</p>
<div class="algo-mount" data-algo="spanningTreeLists"></div>`,
  };

  E.w3Complexity = {
    id: 'w3-complexity', title: 'Complexity of DFS with adjacency lists', slides: ['3L74'], checklist: ['w3c12'],
    html: String.raw`
<div class="box theorem">
  <span class="box-label">Time {{3L74}}</span>
  <p><strong>Initialization:</strong> $O(n)$.</p>
  <p>During the algorithm, ==every [[edge]] is considered twice== (when each of its endpoints is active). Every time an edge is considered, the algorithm performs $O(1)$ operations, so $O(m)$.</p>
  <p><strong>Total: $O(n + m)$.</strong> Assuming that the [[graph]] is connected, $O(n + m) = O(m)$, since $m \ge n - 1$.</p>
</div>
<div class="box theorem">
  <span class="box-label">Space {{3L74}}</span>
  <p>The graph: $O(n + m)$. Recursion stack: $O(n)$. Total: $O(n + m) = O(m)$ assuming $G$ is connected.</p>
</div>
<aside class="callout caution">
  <span class="callout-title">⚠️ The checklist says O(|E|)</span>
  <p>The checklist's $O(|E|)$ is {{3L74}}'s bound for a <strong class="crucial">connected</strong> graph. The slide's general bound is $O(n + m)$. Note that this is the running time of [[dfs|DFS]] when implemented using [[adjacency-list|adjacency lists]]. {{added}}</p>
</aside>`,
  };
})();
