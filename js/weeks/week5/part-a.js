/* Part A: Lecture 5 entries (order is set in week.js). */
window.E = window.E || {};

(function () {
  const range = (deck, from, to) => Array.from({ length: to - from + 1 }, (_, i) => `${deck}${from + i}`);

  E.w5Review = {
    id: 'w5-review', title: 'Review of Lecture 4: the single-source problem and relax', recap: true, slides: range('5L', 2, 8), checklist: ['w5c1', 'w5c2', 'w5c3', 'w5c4', 'w5c5', 'w5c6'],
    html: String.raw`
<p>Lecture 5 opens by reviewing Lecture 4. Everything here was already taught in <a href="#e-w4-weighted">Week 4</a>.</p>
<ul>
  <li>[[spanning-tree|Spanning tree]] {{5L2}}: input, an [[undirected-graph|undirected]] [[connected|connected graph]] $G = (V, E)$; output, $E' \subseteq E$ such that $(V, E')$ is a [[tree]].</li>
  <li>[[bfs|BFS]] finds a spanning tree in time and space $O(|V| + |E|) = O(|E|)$ when $G$ is connected, an analysis similar to [[dfs|DFS]] {{5L3}}.</li>
  <li>BFS for shortest paths from $s$ {{5L4}}: the [[root|root]] $s$ is [[label|labeled]] $0$, and in iteration $i$ the nodes labeled $i$ mark their unlabeled neighbors $i + 1$. The edges from labeled to unlabeled nodes form a [[directed-tree|directed tree]] in which, for every $v$, the only [[path|path]] from $s$ to $v$ is a shortest path ([[bfs-tree|the BFS tree]]). We proved that when it terminates, $\text{label}(v) = d(s, v)$ for every $v \in V$ {{5L5}}. Discussion: BFS vs. DFS {{5L4}} {{5L5}}. The code of {{5L3}} and {{5L4}} is the one of <a href="#e-w4-bfs">BFS</a> and <a href="#e-w4-bfs-shortest">BFS for shortest path</a>.</li>
</ul>
<div class="box definition">
  <span class="box-label">[[sssp|Single-source shortest paths]] {{5L6}} {{5L7}}</span>
  <p>BFS solved the problem assuming all edges have unit length. A more practical setting: edges are not uniform, and the [[path-length|length of a path]] is the ==sum of the [[edge|edge]] weights== ([[path-weight|weight of a path]]).</p>
  <p><strong>Input:</strong> a [[directed-graph|directed graph]] $G = (V, E)$, a weight function $w: E \to R$, and a <span class="nt">source</span> [[vertex|vertex]] $s \in V$. We assume w.l.o.g. that the [[graph|graph]] is ==[[simple-digraph|simple and directed]]==: an undirected edge becomes two [[anti-parallel|anti-parallel edges]], of [[parallel-edges|parallel edges]] only the cheapest stays, and a [[self-loop]] is dropped {{5L7}}.</p>
  <p><strong>Output:</strong> for each vertex $v \in V$, $d(s, v)$, its [[distance]] from $s$: the length of a shortest path from $s$ to $v$.</p>
</div>
<div class="box definition">
  <span class="box-label">What every algorithm keeps {{5L7}} {{5L8}}</span>
  <p>For each node $v$, two variables: ==$v.d$, the length of the shortest path detected so far==, and $v.\pi$, the [[predecessor]] of $v$ (parent).</p>
  <ul>
    <li>$v.d$ is initialized to infinity, except $s.d = 0$.</li>
    <li>The value of $v.d$ may be updated (==decreased==) in [[relax]] operations.</li>
    <li>$\text{relax}(u, v)$: $\quad v.d = \min\{\,v.d,\ u.d + w(u, v)\,\}$, the current best against what we can achieve using $(u, v)$. When the second is smaller, $v.\pi$ becomes $u$ ({{4L44}}).</li>
  </ul>
</div>
<aside class="callout intuition">
  <span class="callout-title">Why v.d falls from ∞ to d(s, v)</span>
  <p>Three properties of every relax-based algorithm, proved in Week 4 {{4L45}}: $v.d$ only goes down; ==$v.d \ge d(s, v)$ at all times==, because every finite $v.d$ is the length of a real path; and once the vertex $u$ before $v$ on a shortest path has $u.d = d(s, u)$, one $\text{relax}(u, v)$ makes $v.d = d(s, v)$ for good. So $v.d$ starts at $\infty$ and is pushed down, step by step, to exactly $d(s, v)$, never below. The algorithms of this week differ in ==which relax operations they do, and in what order==: the first two relax every edge once, Bellman-Ford up to $n - 1$ times. {{added}}</p>
</aside>
<aside class="callout intuition">
  <span class="callout-title">Retrieving the paths with v.π</span>
  <p>When the algorithm completes, $v.\pi$ is the vertex before $v$ on a shortest path. Following $\pi$ back from $v$ to $s$, and printing on the way out, gives the path: $\text{path}(v)$ of {{4L46}}, animated in <a href="#e-w4-path">Week 4</a>. In the animations below, the thick edges are the pairs $(v.\pi, v)$. {{added}}</p>
</aside>`,
  };

  E.w5Classes = {
    id: 'w5-classes', title: 'Four classes of instances', slides: ['5L9'], checklist: [],
    html: String.raw`
<p>The [[sssp|single-source shortest paths]] problem is considered for several classes of instances {{5L9}}:</p>
<ol>
  <li><strong>Unit-weight [[graph|graphs]]:</strong> done, with [[bfs|BFS]].</li>
  <li><strong>[[dag|Directed acyclic graphs]].</strong></li>
  <li><strong>Graphs with non-negative weights.</strong></li>
  <li><strong>Graphs with arbitrary weights.</strong> Here it may be that ==no solution exists==, in case of a <dfn data-term="negative-cycle">negative cycle</dfn>.</li>
</ol>
<p>The lecture takes them in this order: DAGs {{5L10}}, non-negative weights {{5L22}}, arbitrary weights {{5L46}}.</p>
<p>A [[cycle]] of negative total weight can be gone around again and again, and each round makes the [[path|path]] lighter, so there is no shortest path to the [[vertex|vertices]] it reaches. {{added}}</p>`,
  };

  E.w5Dag = {
    id: 'w5-dag', title: 'Shortest paths in a DAG', algo: true, slides: range('5L', 10, 17), checklist: ['w5c7'],
    html: String.raw`
<div class="box definition">
  <span class="box-label">Algorithm {{5L10}}</span>
  <p>The <dfn data-term="dag-sp">DAG shortest-paths</dfn> algorithm, for a [[dag|directed acyclic graph]]:</p>
  <pre class="code-block">1. Compute a topological sort of the vertices.
2. For each vertex u, in sorted order
       for each v such that (u,v)∈E
           relax(u,v)                  ← relax all edges leaving u</pre>
  <p>It proceeds in ==iterations==: in every iteration, the next node in the [[topo-sort|topological sort]] is considered, and every [[edge|edge]] leaving it is [[relax|relaxed]].</p>
</div>
<p>The run of {{5L11}} to {{5L17}}: the [[graph]] is drawn in its sorted order, from left to right. The first [[vertex|vertex]] has no name on the slide; it is called $r$ here. {{added}} $s$ starts at $0$, the others at $\infty$. The slides show the new values; the sums that lead to them are written out here. {{added}}</p>
<ul>
  <li>{{5L12}}: $r$ is first. Its $d$ is $\infty$, so relaxing its edges changes nothing: ==it cannot be reached from $s$==. {{added}}</li>
  <li>{{5L13}}: $s$ relaxes its edges: $a.d = 2$, $b.d = 6$.</li>
  <li>{{5L14}}: $a$: $b$ stays $6$ ($2 + 7 = 9$, computed {{added}}), $c.d = 2 + 4 = 6$, $d.d = 2 + 2 = 4$.</li>
  <li>{{5L15}}: $b$: $c.d = 6 - 1 = 5$, and $d$ stays $4$ ($6 + 1 = 7$).</li>
  <li>{{5L16}}: $c$: $d.d = 5 - 2 = 3$. {{5L17}}: $d$ has no outgoing edges. Final: $r = \infty$, $s = 0$, $a = 2$, $b = 6$, $c = 5$, $d = 3$.</li>
</ul>
<p>The animation uses INIT and RELAX as the recitation writes them {{5R6}}: RELAX also sets $v.\pi$. {{added}} The queue strip holds the vertices still to process, in sorted order.</p>
<div class="algo-mount" data-algo="dagSP"></div>
<aside class="callout caution">
  <span class="callout-title">⚠️ A missing weight on 5L16 and 5L17</span>
  <p>On {{5L16}} and {{5L17}} the weight $1$ of the edge $(b, d)$ is not drawn. It is there on {{5L11}} to {{5L15}}, and $b$ relaxes it on {{5L15}} ($6 + 1 = 7 > 4$). {{added}}</p>
</aside>`,
  };

  E.w5DagProof = {
    id: 'w5-dag-proof', title: 'Why the DAG algorithm is correct', slides: ['5L18', '5L19', '5R12'], checklist: ['w5c8', 'w5c9'],
    html: String.raw`
<div class="box theorem">
  <span class="box-label">Theorem {{5L18}}</span>
  <p>If $G$ is ==[[acyclic|acyclic]]==, then when the algorithm terminates, for each [[vertex|vertex]] $v$, $v.d = d(s, v)$ holds.</p>
  <p><strong>Lemma:</strong> when $v$ is reached in the main loop, $v.d = d(s, v)$ holds.</p>
</div>
<details class="proof" open><summary>Proof {{5L18}} {{5L19}}</summary>
<p><strong>1. Vertices that are not connected from $s$</strong> (before $s$ in the [[topo-sort|topological sort]], or after it but not reachable): their [[distance]] is initialized to $\infty$ and it remains $\infty$ along the algorithm, as required.</p>
<p><strong>2. $s$ and the vertices connected from $s$.</strong> The proof is ==by induction on the order of the vertices in the topological sort==.</p>
<p><strong>Base:</strong> $d(s, s) = 0$. $s.d$ was initialized to $0$ and is not updated during the algorithm.</p>
<p><strong>Step:</strong> let $v$ be the next vertex in the toposort order. Let $s - v_1 - v_2 - \dots - v_k - v$ be some shortest [[path]] from $s$ to $v$. It must be that $s - v_1 - \dots - v_k$ is a shortest path from $s$ to $v_k$. By definition of toposort, ==$v_k$ was processed already==. By the induction hypothesis, when $v_k$ was processed it held that $v_k.d = d(s, v_k)$. In the iteration in which $v_k$ is processed, $\text{relax}(v_k, v)$ is performed and the distance of $v$ is updated to be $d(s, v_k) + w(v_k, v)$, as required.</p>
</details>
<div class="box definition">
  <span class="box-label">The main idea: <dfn data-term="property-star">property ∗</dfn> {{5R12}}</span>
  <p>The algorithm uses the topological sort to make sure that for ==every path $p = e_1 e_2 \dots e_k$== in the [[graph|graph]], the edges of $p$ are [[relax|relaxed]] ==according to their order in $p$==. This is property ∗ for $p$.</p>
</div>
<aside class="callout intuition">
  <span class="callout-title">Why every path has property ∗</span>
  <p>[[edge|Edge]] $e_i = (v_{i-1}, v_i)$ is relaxed exactly when $v_{i-1}$ is processed, and $e_{i+1}$ when $v_i$ is processed. Since $(v_{i-1}, v_i)$ is an edge, $v_{i-1}$ ==comes before $v_i$ in the topological sort==, so $e_i$ is relaxed before $e_{i+1}$. {{added}}</p>
</aside>
<aside class="callout intuition">
  <span class="callout-title">Why property ∗ gives correctness</span>
  <p>Take a shortest path $s = v_0, v_1, \dots, v_k = v$. Its first edge is relaxed after $s.d = 0 = d(s, s)$, so by property 3 of {{4L45}} $v_1.d = d(s, v_1)$ from then on. The second edge is relaxed after that, so $v_2.d = d(s, v_2)$, and so on along the path. ==Relaxing the edges of a shortest path in order fixes the distances one by one==, whatever other relax operations happen in between. This is the induction of {{5L19}}. {{added}}</p>
</aside>
<aside class="callout caution">
  <span class="callout-title">⚠️ "Updated to be"</span>
  <p>On {{5L19}}, $\text{relax}(v_k, v)$ sets $v.d$ to $\min\{v.d,\ d(s, v_k) + w(v_k, v)\}$ ({{5L8}}): $v.d$ may already be that small. It cannot be smaller, because $v.d \ge d(s, v)$ always ({{4L45}}). So ==after the relax, $v.d = d(s, v)$== either way. {{added}}</p>
</aside>`,
  };

  E.w5DagTime = {
    id: 'w5-dag-time', title: 'Time of the DAG algorithm: O(n + m)', slides: ['5L20'], checklist: ['w5c10', 'w5c12'],
    html: String.raw`
<div class="box theorem">
  <span class="box-label">Time analysis {{5L20}}</span>
  <ul>
    <li>Each [[relax]] operation takes $O(1)$.</li>
    <li>[[preprocessing|Preprocessing]]: [[topo-sort|topological sort]] takes $O(n + m)$ (Week 1, {{L79}}).</li>
    <li>Loop through $n$ vertices: $O(n)$.</li>
    <li>Total number of relax operations: when [[vertex|vertex]] $v$ is processed, the number of relax operations is its [[out-degree]]. Each vertex is processed once, so the total number of relax operations is ==$m$== and their total time is $O(m)$.</li>
  </ul>
  <p><strong>Total time: $O(m + n)$.</strong></p>
</div>
<p>To go over the [[edge|edges]] leaving $u$ in $O(\text{out-degree}(u))$, the [[graph|graph]] is kept as [[adjacency-list|adjacency lists]] {{added}}, the same representation as the topological sort of Week 1.</p>
<p>{{5L21}} is "Quiz Time".</p>`,
  };

  E.w5Dijkstra = {
    id: 'w5-dijkstra', title: 'Dijkstra\'s algorithm', algo: true, slides: range('5L', 22, 29), checklist: ['w5c11', 'w5c12'],
    html: String.raw`
<div class="box definition">
  <span class="box-label">Graphs with non-negative weights {{5L22}}</span>
  <p><dfn data-term="dijkstra">Dijkstra's algorithm</dfn>. $Q$ is a <dfn data-term="priority-queue">priority queue</dfn> where priority is according to the value of $d$: ==dequeue returns a [[vertex|vertex]] with minimal $d$==.</p>
  <pre class="code-block">Q ←V(G)
while Q is not empty :
     u ← dequeue(Q)
     for all v such that (u,v)∈E :
           relax(u,v)</pre>
  <p>"Note: The slides are in Dijkstra font!"</p>
</div>
<div class="box definition">
  <span class="box-label">An alternative description {{5L23}}</span>
  <pre class="code-block">1. s.d ← 0 and for all v ≠ s, v.d ← ∞.
2. Q ← V.
3. Let u be a vertex in Q for which u.d is minimum.
4. for all v such that (u,v)∈E, perform relax(u,v)
5. Q = Q – {u}, if Q is not empty go to step 3.</pre>
</div>
<p>It proceeds in iterations: in every iteration, a node having ==minimal $v.d$== among those still in $Q$ is considered, and every [[edge|edge]] leaving it is [[relax|relaxed]].</p>
<p>The run of {{5L24}} to {{5L29}}, from $s$. The slides show the new values; the sums that lead to them are written out here. {{added}}</p>
<ul>
  <li>{{5L25}}: $s$ <span class="nt">leaves</span> $Q$: $a.d = 10$, $c.d = 5$.</li>
  <li>{{5L26}}: $c$ (5 is the minimum): $a.d = 5 + 3 = 8$, $b.d = 5 + 9 = 14$, $d.d = 5 + 2 = 7$.</li>
  <li>{{5L27}}: $d$ (7): $b.d = 7 + 6 = 13$; the edge back to $s$ changes nothing.</li>
  <li>{{5L28}}: $a$ (8): $b.d = 8 + 1 = 9$; $c$ stays $5$.</li>
  <li>{{5L29}}: $b$ (9): $d$ stays $7$. Final: $a = 8$, $b = 9$, $c = 5$, $d = 7$, with the [[predecessor|π]] edges $s \to c$, $c \to a$, $c \to d$, $a \to b$ drawn in blue.</li>
</ul>
<p>Switch between the two descriptions above the animation. INIT and RELAX are the recitation's {{5R6}}. {{added}} The second [[graph|graph]] is $G'$ of Exercise 3 of the recitation {{5R15}}.</p>
<div class="algo-mount" data-algo="dijkstra" data-presets="g24,gR15"></div>
<div class="box theorem">
  <span class="box-label">[[dag|DAG]] and Dijkstra: a lot in common (checklist)</span>
  <p>In both algorithms ==every node is considered once==, and when $v$ is considered, the algorithm performs [[relax]] of ==all edges outgoing from $v$==. Therefore in both algorithms there are ==exactly $m$ relax operations== ({{5L20}}, {{5L39}}). They differ in the order in which the nodes are considered: the [[topo-sort|topological sort]] fixed in advance, or the minimal $d$ at each step. {{added}}</p>
</div>`,
  };

  E.w5SPHand = {
    id: 'w5-sp-hand', title: 'You pick the next vertex', exercise: true, slides: ['5L11', '5L24'], checklist: ['w5c7', 'w5c11'],
    html: String.raw`
<p>On the [[dag|DAG]] of {{5L11}}, pick each next [[vertex|vertex]] of a [[topo-sort|topological sort]]; on the graph of {{5L24}}, pick the vertex [[dijkstra|Dijkstra]] dequeues. After each pick, its outgoing [[edge|edges]] are [[relax|relaxed]] one by one. Which picks are allowed is computed from the [[graph]].</p>
<div class="ex-mount" data-ex="spByHand"></div>`,
  };

  E.w5DijkstraProof = {
    id: 'w5-dijkstra-proof', title: 'Why Dijkstra is correct', slides: range('5L', 30, 38), checklist: ['w5c13'],
    html: String.raw`
<div class="box theorem">
  <span class="box-label">Theorem {{5L30}}</span>
  <p>If ==all edges have non-negative weight==, then when [[dijkstra|Dijkstra]] terminates, for each [[vertex|vertex]] $v$, $v.d = d(s, v)$ holds.</p>
  <p><strong>Lemma (claim):</strong> when a vertex $v$ <span class="nt">leaves</span> the [[priority-queue|priority queue]], $v.d = d(s, v)$ holds.</p>
</div>
<details class="proof" open><summary>Proof {{5L35}} {{5L36}} {{5L37}} {{5L38}}</summary>
<p>==By induction on the order according to which the vertices leave $Q$==.</p>
<p><strong>Base:</strong> $s$ is the first to leave $Q$, and indeed $s.d = d(s, s)$ {{5L35}}.</p>
<p><strong>Step {{5L36}}:</strong> consider the iteration in which $v$ <span class="nt">leaves</span> $Q$. Assume that at this time point $v.\pi = u$. The [[path]] to $u$ together with the [[edge|edge]] $(u, v)$ implies that there exists a path from $s$ to $v$ whose length is $v.d$. Therefore ==$d(s, v) \le v.d$==. Note: this is true in general for every application of the [[relax]] method. We show that no shorter path exists.</p>
<p>{{5L37}} Assume, toward a contradiction, that there is a path $p$ from $s$ to $v$ whose weight satisfies $w(p) < v.d$. If all vertices of $p$ are already out of $Q$, then $v$ would already have been assigned the value $w(p)$. Therefore some vertices of $p$ are still in $Q$. Let $x$ be ==the last vertex on $p$ that has already been removed from $Q$==, and let $y$ be the successor of $x$ on $p$:</p>
$$p = s \leadsto x \to y \leadsto v \qquad (s \leadsto x \text{ left } Q)$$
<p>{{5L38}} We have</p>
$$w(p) \;\ge\; d(s, x) + w(x, y) \;\ge\; y.d \qquad (\ast)$$
<p>The first $\ge$: since the sub-path $y \leadsto v$ has ==non-negative weight==. The second: since $x$ already left $Q$ and $\text{relax}(x, y)$ was performed (so $y.d \le x.d + w(x, y)$, with $x.d = d(s, x)$ by the induction hypothesis {{added}}).</p>
<p>Since Dijkstra chose to consider $v$ (before considering $y$), it must be that $v.d \le y.d$. Combining with $(\ast)$, we get $v.d \le w(p)$, contradicting our assumption that $v.d > w(p)$. ∎</p>
</details>
<p>{{5L31}} to {{5L34}} give the same proof in Hebrew.</p>
<aside class="callout intuition">
  <span class="callout-title">Where non-negative weights are used</span>
  <p>Only in the first $\ge$ of $(\ast)$: going on from $y$ to $v$ ==cannot make the path lighter==. With a negative edge after $y$, a path through a vertex with a larger $d$ could still end lighter, and $v$ would leave $Q$ too early. {{added}}</p>
</aside>
<aside class="callout intuition">
  <span class="callout-title">"v would already have been assigned w(p)"</span>
  <p>If every vertex of $p$ before $v$ already left $Q$, take the last one, $z$. By the induction hypothesis $z.d = d(s, z)$ when it left, and it then performed $\text{relax}(z, v)$, so $v.d \le d(s, z) + w(z, v) \le w(p)$ already: the part of $p$ up to $z$ weighs at least $d(s, z)$. {{added}}</p>
</aside>`,
  };

  E.w5DijkstraTime = {
    id: 'w5-dijkstra-time', title: 'Running time of Dijkstra: three implementations', slides: range('5L', 39, 42), checklist: ['w5c12', 'w5c14'],
    html: String.raw`
<div class="box theorem">
  <span class="box-label">In all implementations {{5L39}}</span>
  <p>There are ==$m$ [[relax]] operations and $n$ dequeue operations==:</p>
  <ul>
    <li>When $u$ is active, there are $\text{out\_degree}(u)$ relax operations ([[out-degree]]), so $m$ relax operations in total.</li>
    <li>Every [[vertex|vertex]] reachable from $s$ is dequeued once, so $n$ dequeue operations (see the note below).</li>
  </ul>
  <p>The 3 implementations differ in the way the [[priority-queue|priority queue]] $Q$ is implemented.</p>
</div>
<div class="box theorem">
  <span class="box-label">Implementation 1: binary heap {{5L40}}</span>
  <p>Data structure: [[adjacency-list|adjacency lists]], and a binary heap for the $d$ values. Each relax/dequeue operation takes $O(\log n)$.</p>
  <p>Initialization $O(n)$; $n$ dequeue operations $O(n \log n)$; $m$ relax operations $O(m \log n)$. <strong>Total: $O((n + m) \log n)$.</strong></p>
</div>
<div class="box theorem">
  <span class="box-label">Implementation 2: array {{5L41}}</span>
  <p>Data structure: adjacency lists, and an array for the $d$ values.</p>
  <p>Dequeue: finding a vertex $u$ in $Q$ with minimal $u.d$. In the whole execution: $O(n^2)$. $m$ relax operations, each takes $O(1)$: $O(m)$.</p>
  <p><strong>Total: $O(m + n^2) = O(n^2)$</strong> (a [[simple-digraph|simple graph]], so $m \le n(n - 1)$).</p>
</div>
<div class="box theorem">
  <span class="box-label">Implementation 3: Fibonacci heaps {{5L42}}</span>
  <p>Data structure: adjacency lists, and a <dfn data-term="fibonacci-heap">Fibonacci heap</dfn> for the $d$ values. <strong>Complexity: $O(m + n \log n)$.</strong></p>
  <p>Fibonacci heap: any sequence of $x$ insert/decrease-key operations and $y$ delete operations takes $O(x + y \log n)$ [[worst-case|worst case]] time, where $n$ is the maximum heap size.</p>
</div>
<aside class="callout intuition">
  <span class="callout-title">Where each bound comes from</span>
  <p>A relax that lowers $v.d$ must also move $v$ forward in $Q$: in a binary heap that costs $O(\log n)$; in the array it is just writing $v.d$, $O(1)$, but each dequeue scans all of $Q$, $O(n)$, $n$ times. With a Fibonacci heap, the $m$ relax operations are $x = m$ decrease-keys and the $n$ dequeues are $y = n$ deletes: $O(m + n \log n)$. {{added}}</p>
  <p>The array is the better choice for a [[dense-graph|dense graph]] ($m$ close to $n^2$), the binary heap for a [[sparse-graph|sparse]] one. One algorithm, ==three implementations, three running times==. {{added}}</p>
</aside>
<aside class="callout caution">
  <span class="callout-title">⚠️ "Every vertex reachable from s is dequeued once"</span>
  <p>With $Q \leftarrow V(G)$ {{5L22}}, every vertex is dequeued once, reachable or not (an unreachable one <span class="nt">leaves</span> with $d = \infty$). Either way there are at most $n$ dequeue operations. {{added}}</p>
</aside>`,
  };

  E.w5Negative = {
    id: 'w5-negative', title: 'Negative weights: why the "shift" fix fails', slides: range('5L', 43, 45), checklist: [],
    html: String.raw`
<p><strong>Discussion {{5L43}}:</strong> why does [[dijkstra|Dijkstra]] fail when the [[graph|graph]] includes negative weights?</p>
<aside class="callout intuition">
  <span class="callout-title">One answer</span>
  <p>The proof used non-negative weights in one place ({{5L38}}): a [[vertex|vertex]] that <span class="nt">leaves</span> $Q$ has its final $d$. With a negative [[edge|edge]], a lighter path to it can still be found later, through a vertex that <span class="nt">leaves</span> $Q$ after it, and its $d$ is never corrected. {{added}}</p>
</aside>
<div class="box definition">
  <span class="box-label">Suggested fix {{5L44}}</span>
  <p>Let $\Delta < 0$ be the minimal weight of an edge. For every edge $e \in E$, set $w'(e) = w(e) - \Delta$. In the resulting graph, all the weights are non-negative. Run Dijkstra and return the shortest [[path]] in $G'$. ==Does this fix work?==</p>
  <p>The example: $\Delta = -5$, and the weights $8, -4, -5, 12$ become $13, 1, 0, 17$.</p>
</div>
<div class="box theorem">
  <span class="box-label">No {{5L45}}</span>
  <p>The [[path-weight|weight of a path]] with $k$ edges is increased by $\Delta \cdot k$ (the slide's words; with $\Delta < 0$ the increase is $-\Delta \cdot k$, see the note below): ==not uniform for all paths==. In the example $\Delta = -6$: the weights $1, 1, 1, 5$ become $7, 7, 7, 11$.</p>
<p>So $s - a - b - t$ weighs $1 + 1 + 1 = 3$ in $G$ and $7 + 7 + 7 = 21$ in $G'$, while $s - t$ weighs $5$ and becomes $11$. {{added}}</p>
</div>
<p>So the shortest path from $s$ to $t$ in $G$ is $s - a - b - t$ (3 against 5), but in $G'$ it is $s - t$ (11 against 21): Dijkstra on $G'$ returns the wrong path. On {{5L44}} both graphs agree ($s - a - t$: $4$ in $G$, $14$ in $G'$), which is why one example is not enough. {{added}}</p>
<aside class="callout caution">
  <span class="callout-title">⚠️ Two vertices named a, and the sign of Δ·k</span>
  <p>On {{5L45}}, the vertex at the end of the $-6$ edge is also <span class="nt">labeled</span> "a"; it is a different vertex from the $a$ on the path $s - a - b - t$ (called a′ in the exercise below). And since $w'(e) = w(e) - \Delta$ with $\Delta < 0$, a path with $k$ edges gains $-\Delta \cdot k = |\Delta| \cdot k$: in the example, $+6$ per edge. {{added}}</p>
</aside>`,
  };

  E.w5ShiftEx = {
    id: 'w5-shift-ex', title: 'Does the fix work?', exercise: true, slides: ['5L44', '5L45'], checklist: [],
    html: String.raw`
<p>Find a shortest [[path]] from $s$ to $t$ in $G$, then shift the weights by $-\Delta$ and find one in $G'$. The [[distance|distances]] are computed from the [[graph|graphs]] of {{5L44}} and {{5L45}}.</p>
<div class="ex-mount" data-ex="shiftFix"></div>`,
  };

  E.w5BF = {
    id: 'w5-bf', title: 'The Bellman-Ford algorithm', algo: true, slides: range('5L', 46, 48), checklist: ['w5c15'],
    html: String.raw`
<div class="box definition">
  <span class="box-label">Graphs with arbitrary weights {{5L46}}</span>
  <p>Input: a [[simple-digraph|simple directed graph]] $G = (V, E)$, a weight function $w: E \to R$, a <span class="nt">source</span> [[vertex|node]] $s \in V$. $w(u, v)$ ==may be negative==. Assume first that there are ==no [[negative-cycle|negative cycles]]==.</p>
  <p>The <dfn data-term="bellman-ford">Bellman-Ford algorithm</dfn>:</p>
  <pre class="code-block">repeat n − 1 times:
   for every edge (u, v) ∈ E:
      relax(u, v)</pre>
</div>
<div class="box definition">
  <span class="box-label">How do we implement this algorithm? {{5L47}}</span>
  <ul>
    <li>Order the edges: $e_1, e_2, \dots, e_m$ (an arbitrary order).</li>
    <li>Every iteration of the repeat loop is called a <dfn data-term="sweep">sweep</dfn>.</li>
    <li>Every sweep consists of $m = |E|$ [[relax]] operations: first relaxing $e_1$, then $e_2$, etc.</li>
    <li>Perform additional sweeps ==until an entire sweep produces no updates== (it might be that fewer than $n - 1$ sweeps are needed).</li>
  </ul>
</div>
<p><strong>Running example {{5L48}}:</strong> the edges in the order $SB, BC, AB, SA, AC$. The slide gives the [[graph|graph]] and the order only; the run below is computed. {{added}} In sweep 1, $SB$ sets $B.d = 4$, $BC$ sets $C.d = -3$, $AB$ changes nothing because $A.d$ is still $\infty$, and $SA$ sets $A.d = 2$. Sweep 2: $AB$ lowers $B.d$ to $3$. Sweep 3: $BC$ lowers $C.d$ to $-4$. That is $n - 1 = 3$ sweeps, and the result is $S = 0$, $A = 2$, $B = 3$, $C = -4$.</p>
<aside class="callout intuition">
  <span class="callout-title">Why the order matters</span>
  <p>The shortest [[path]] to $C$ is $S - A - B - C$. In the slide's order its edges come ==backwards==: $BC$, then $AB$, then $SA$. Each sweep fixes only one more [[edge|edge]] of that path, so 3 sweeps are needed. In the order $SA, AB, BC, \dots$ (the path's own order, [[property-star|property ∗]] of {{5R12}}) one sweep finds every [[distance|distance]], and a second sweep with no updates ends the run. {{added}}</p>
</aside>
<p>Switch between exactly $n - 1$ sweeps and stopping when a sweep changes nothing.</p>
<div class="algo-mount" data-algo="bellmanFord" data-presets="g48" data-modes="full,stop"></div>`,
  };

  E.w5BFOrder = {
    id: 'w5-bf-order', title: 'Order the edges, count the sweeps', exercise: true, slides: ['5L47', '5L48'], checklist: ['w5c15', 'w5c16'],
    html: String.raw`
<p>Choose the order of the [[edge|edges]] in one [[sweep]] of [[bellman-ford|Bellman-Ford]] on the [[graph|graph]] of {{5L48}}. The sweeps then run and are counted, and the fewest possible over all orders is computed.</p>
<div class="ex-mount" data-ex="bfOrder"></div>`,
  };

  E.w5BFProof = {
    id: 'w5-bf-proof', title: 'Why n − 1 sweeps are enough', slides: range('5L', 49, 51), checklist: ['w5c16', 'w5c17'],
    html: String.raw`
<div class="box theorem">
  <span class="box-label">Theorem {{5L49}}</span>
  <p>If $G$ has ==no [[negative-cycle|negative cycles]]==, then when the algorithm terminates, for each $v$, $v.d = d(s, v)$ holds.</p>
  <p><strong>Lemma:</strong> if the shortest [[path|path]] from $s$ to $v$ consists of $k$ edges, then ==after $k$ repetitions of the main loop==, $v.d = d(s, v)$ holds.</p>
  <p>By the lemma, the theorem follows since $k$ is bounded by $n - 1$: with no negative [[cycle|cycles]], there are at most $n - 1$ edges in a shortest path.</p>
</div>
<details class="proof" open><summary>Proof of the lemma {{5L51}}</summary>
<p>Let $v$ be a node reachable from $s$ and let $s = v_0 - v_1 - \dots - v_{k-1} - v_k = v$ be a shortest path from $s$ to $v$. There are no negative cycles, therefore the path is ==[[simple-path|simple]]==.</p>
<p>We prove ==by induction on $i$== that for all $i = 0, \dots, k$ it holds that $v_i.d = d(s, v_i)$ after the $i$-th [[sweep]].</p>
<p><strong>Base:</strong> $i = 0$. We initialize $s.d = 0 = d(s, s)$, and $s.d$ is not updated anymore.</p>
<p><strong>Step:</strong> by the induction hypothesis, $v_{i-1}.d = d(s, v_{i-1})$ after the $(i-1)$-th sweep. During the $i$-th sweep, $\text{relax}(v_{i-1}, v_i)$ is performed, and the value of $v_i.d$ is updated to be $d(s, v_{i-1}) + w(v_{i-1}, v_i)$. This is indeed the length of the shortest path from $s$ to $v_i$.</p>
</details>
<p>{{5L50}} gives the same proof in Hebrew.</p>
<aside class="callout intuition">
  <span class="callout-title">k edges, at most k sweeps; n − 1 is enough</span>
  <p>Sweep $i$ relaxes every [[edge|edge]], so it relaxes the $i$-th edge of the path after sweep $i - 1$ fixed the [[vertex|vertex]] before it: ==each sweep fixes at least one more edge== of every shortest path. A path of $k$ edges is found within $k$ sweeps, maybe fewer if the order is lucky. A simple path has at most $n$ vertices, so at most $n - 1$ edges: $n - 1$ sweeps reach every vertex. {{added}}</p>
</aside>
<aside class="callout caution">
  <span class="callout-title">⚠️ Two small slips on 5L51</span>
  <p>"The length of the SP from $s$ to $v$" at the end of {{5L51}} means ==to $v_i$==. And as on {{5L19}}, [[relax|relax]] sets $v_i.d$ to at most $d(s, v_{i-1}) + w(v_{i-1}, v_i)$, which equals $d(s, v_i)$ because the part of a shortest path up to $v_i$ is a shortest path; it cannot go lower, since $v_i.d \ge d(s, v_i)$ always ({{4L45}}). {{added}}</p>
</aside>`,
  };

  E.w5BFTime = {
    id: 'w5-bf-time', title: 'Running time of Bellman-Ford: O(|E||V|)', slides: ['5L52'], checklist: [],
    html: String.raw`
<div class="box theorem">
  <span class="box-label">Run-time analysis {{5L52}}</span>
  <ul>
    <li>$|E|$ [[relax]] operations in every [[sweep]].</li>
    <li>$|E|(|V| - 1)$ relax operations in total.</li>
    <li>Each relax takes $O(1)$: it only needs an array with the $v.d$ values, and direct access to the [[edge|edge]] weights (they can be kept in the [[graph|graph]]'s data structure).</li>
  </ul>
  <p><strong>The time complexity of [[bellman-ford|BF]] is $O(|E||V|)$.</strong></p>
</div>
<p>Compare: the [[dag|DAG]] algorithm and [[dijkstra|Dijkstra]] each relax every edge once ($m$ relax operations); Bellman-Ford relaxes every edge in each of up to $n - 1$ sweeps, the price of allowing arbitrary weights. {{added}}</p>`,
  };
})();
