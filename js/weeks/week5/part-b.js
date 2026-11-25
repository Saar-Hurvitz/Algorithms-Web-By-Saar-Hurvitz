/* Part B: Recitation 5 entries (order is set in week.js).
   Concepts already taught in Part A are short recap cards with recap: true. */
window.E = window.E || {};

(function () {
  const range = (deck, from, to) => Array.from({ length: to - from + 1 }, (_, i) => `${deck}${from + i}`);

  E.w5RSummary = {
    id: 'w5-r-summary', title: 'The single-source shortest path algorithms', recap: true, slides: range('5R', 2, 5), checklist: [],
    html: String.raw`
<p>Last week: [[dfs|DFS]] on [[directed-graph|directed graphs]], and [[bfs|BFS]] {{5R2}}. This week: shortest paths: [[relax]], shortest paths in [[dag|DAGs]], and [[dijkstra|Dijkstra's algorithm]] {{5R3}}.</p>
<div class="table-wrap"><table class="model">
  <thead><tr><th>Algorithm {{5R4}}</th><th>Input</th><th>Time complexity</th></tr></thead>
  <tbody>
    <tr><td>BFS</td><td>Unweighted graph</td><td>$O(n + m)$</td></tr>
    <tr><td><a href="#e-w5-dag">[[dag-sp|DAG-SP]]</a></td><td>Weighted directed [[acyclic|acyclic]] graph, arbitrary weights</td><td>$O(n + m)$</td></tr>
    <tr><td><a href="#e-w5-dijkstra">Dijkstra</a></td><td>Weighted graph, ==non-negative weights==</td><td>$O((m + n) \log n)$, min heap<br>$O(n^2)$, array of $v.d$<br>$O(m + n \log n)$, [[fibonacci-heap|Fibonacci heap]]</td></tr>
    <tr><td><a href="#e-w5-bf">[[bellman-ford|Bellman-Ford]]</a></td><td>Weighted graph, arbitrary weights</td><td>$O(n \cdot m)$</td></tr>
  </tbody>
</table></div>
<p>The input to all the algorithms is a directed [[graph]] $G$ and a <span class="nt">source</span> [[vertex|vertex]] $s \in V$. The output is the shortest [[path]] from $s$ to each $v \in V$. The vertices have the attributes $v.d$, the length of the shortest path from $s$ to $v$ detected so far, and $v.\pi$, the parent of $v$ in the current shortest path from $s$ to $v$ ([[predecessor]]) {{5R5}}.</p>`,
  };

  E.w5RInit = {
    id: 'w5-r-init', title: 'INIT and RELAX as code', recap: true, slides: ['5R6'], checklist: ['w5c6'],
    html: String.raw`
<p>The same initialization and [[relax]] as {{5L8}}, written as code {{5R6}}. The animations of this week use these lines.</p>
<pre class="code-block">Algorithm 1 INIT                     Algorithm 2 RELAX(u,v)
1: for each vertex v ∈ G.V do        1: if v.d > u.d + w(u,v) then
2:     v.d = ∞                       2:     v.d = u.d + w(u,v)
3:     v.π = NIL                     3:     v.π = u
4: s.d = 0</pre>
<p>INIT visits every [[vertex]] once and takes ==$O(|V|)$==. Note: $(u, v)$ ==must be in $E$==.</p>`,
  };

  E.w5REx1 = {
    id: 'w5-r-ex1', title: 'Exercise 1: sub-paths of shortest paths are shortest', slides: ['5R7', '5R8'], checklist: [],
    html: String.raw`
<div class="box theorem">
  <span class="box-label">Claim {{5R7}}</span>
  <p>Given a weighted, [[directed-graph|directed graph]] $G$, let $p = \langle v_0, v_1, \dots, v_k \rangle$ be a shortest [[path]] from $v_0$ to $v_k$. For any $i, j$ such that $0 \le i \le j \le k$, let $p_{i,j} = \langle v_i, \dots, v_j \rangle$ be a sub-path of $p$. Then ==$p_{i,j}$ is a shortest path from $v_i$ to $v_j$==.</p>
</div>
<details class="proof" open><summary>Proof {{5R8}}</summary>
<p>Decompose $p = \langle v_0, \dots, v_i, \dots, v_j, \dots, v_k \rangle$ into $p = p_{0,i} + p_{i,j} + p_{j,k}$. Note that $w(p) = w(p_{0,i}) + w(p_{i,j}) + w(p_{j,k})$ ([[path-weight|weight of a path]]).</p>
<p>Assume there is a path $p'_{i,j}$ such that $w(p'_{i,j}) < w(p_{i,j})$. Then the path $p_{0,i} - p'_{i,j} - p_{j,k}$ is a path from $v_0$ to $v_k$ whose weight is less than $w(p)$, ==contradicting the assumption== that $p$ is the shortest path from $v_0$ to $v_k$. ∎</p>
</details>
<p>This is the fact the [[bfs|BFS]] proof used in Week 4 ({{4L33}}), now with weights, and the step "it must be that $s - v_1 - \dots - v_k$ is a shortest path" of {{5L19}}. {{added}}</p>`,
  };

  E.w5REx2 = {
    id: 'w5-r-ex2', title: 'Exercise 2: prove or give a counter-example', exercise: true, slides: range('5R', 9, 11), checklist: [],
    html: String.raw`
<p>For each of the following, prove or give a counter-example {{5R9}}:</p>
<ol>
  <li><strong>The shortest path in a graph is unique.</strong> ==False== {{5R9}}: from $a$ to $b$, both $a \to b$ (5) and $a \to c \to b$ ($2 + 3$) weigh 5.</li>
  <li><strong>The shortest path in an undirected [[tree]] is unique.</strong> ==True== {{5R10}}: a tree is a [[graph]] with a unique [[path]] between every pair of [[vertex|vertices]], thus the shortest path is also unique.</li>
  <li><strong>Let $p_1$ be a shortest path in $G$ from $u$ to $v$ and let $p_2$ be a shortest path in $G$ from $v$ to $w$. Then $p_1 p_2$ is a shortest path from $u$ to $w$.</strong> ==False== {{5R11}}: $u \to v$ and $v \to w$ weigh 100 each, but $u \to w$ weighs 1.</li>
</ol>
<p>Claims 1 and 3 on the slides' graphs; the verdicts are computed from the [[path-weight|path weights]].</p>
<div class="ex-mount" data-ex="spClaims"></div>`,
  };

  E.w5RDagDij = {
    id: 'w5-r-dag-dij', title: 'DAG-SP and Dijkstra in the recitation', recap: true, slides: ['5R12', '5R13'], checklist: ['w5c8', 'w5c12'],
    html: String.raw`
<p>The same two algorithms as <a href="#e-w5-dag">the [[dag|DAG]] algorithm</a> and <a href="#e-w5-dijkstra">Dijkstra</a> of the lecture, in the recitation's code.</p>
<pre class="code-block">Algorithm 3 DAG-SP(G, w, s)           Algorithm 4 DIJKSTRA(G, w, s)
1: INIT(G, s)                         1: INIT(G, s)
2: Q = TOPOSORT(G)                    2: S = ∅
3: while Q ≠ ∅ do                     3: Q = V
4:     u = DEQUEUE(Q)                 4: while Q ≠ ∅ do
5:     for each vertex v ∈ u.adj do   5:     u = EXTRACT-MIN(Q)
6:         RELAX(u, v, w)             6:     S = S ∪ {u}
                                      7:     for each vertex v ∈ u.adj do
                                      8:         RELAX(u, v, w)</pre>
<ul>
  <li><strong>[[dag-sp|DAG-SP]] {{5R12}}:</strong> the main idea is using the [[topo-sort|topological sort]] to make sure that every [[path|path]] has [[property-star|property ∗]]. Complexity: $O(|V| + |E|)$.</li>
  <li><strong>[[dijkstra|Dijkstra]] {{5R13}}:</strong> the main idea is to [[relax]] each [[edge|edge]] ==once==, such that property ∗ is valid ==for every shortest path $p$==. Since all edges have positive weights, relaxing the [[incident|incident]] edges of the closest [[vertex|vertex]] guarantees that once a vertex $v$ is relaxed and removed from the queue, the final [[distance|distance]] of $v$ will never change. Complexity: $O(|E| \cdot \text{Relax} + |V| \cdot \text{EXTRACT-MIN})$, which ==depends on the implementation==; the slide writes $O(|E| + |V| \log |V|)$.</li>
</ul>
<p>The set $S$ holds the vertices that already left $Q$: the "Left Q (final)" strip of the animation. {{added}}</p>
<aside class="callout caution">
  <span class="callout-title">⚠️ "Positive" and the one complexity</span>
  <p>{{5R13}} says positive weights; the lecture's theorem needs only ==non-negative== weights ({{5L30}}), as the table of {{5R4}} says. And $O(|E| + |V| \log |V|)$ is the [[fibonacci-heap|Fibonacci heap]] bound ({{5L42}}): with a binary heap it is $O((n + m) \log n)$, with an array $O(n^2)$ ({{5L40}}, {{5L41}}). {{added}}</p>
</aside>`,
  };

  E.w5REx3 = {
    id: 'w5-r-ex3', title: 'Exercise 3: one road against the traffic', algo: true, slides: range('5R', 14, 19), checklist: [],
    html: String.raw`
<div class="box definition">
  <span class="box-label">Exercise 3 {{5R14}}</span>
  <p>Let $G = (V, E)$ be a [[directed-graph|directed graph]] with ==positive== [[edge|edge]] weights. It represents a map: every edge is a road, and the weights are the lengths of the roads. A driver is allowed to travel at most once against the allowed direction of traffic. Formally, a path is <dfn data-term="almost-valid">almost-valid</dfn> if it traverses ==exactly one edge in its opposite direction==.</p>
  <p>Given a <span class="nt">source</span> [[vertex|vertex]] $s \in V$, suggest an algorithm that finds the length of the shortest [[path]] from $s$ to all $v \in V$, allowing both valid and almost-valid paths. Prove its correctness and analyze its time complexity.</p>
</div>
<p><strong>Intuition {{5R15}}:</strong> build ==two copies of the [[graph]]==, such that traversing an edge in its opposite direction moves us from the first copy to the second copy.</p>
<div class="box definition">
  <span class="box-label">Algorithm {{5R16}}</span>
  <ol>
    <li>Build a directed graph $G' = (V', E')$:
      <ul>
        <li>for all $v \in V$, two copies in $G'$: $v^0, v^1 \in V'$;</li>
        <li>for all $(u, v) \in E$, three copies in $G'$: $(u^0, v^0)$, $(u^1, v^1)$ and $(v^0, u^1)$, all with weight $w(u, v)$.</li>
      </ul></li>
    <li>Perform [[dijkstra|Dijkstra]] on $G'$ from $s^0$ as a <span class="nt">source</span>.</li>
    <li>For every $v \in V$, return $\min\{\, d(s^0, v^0),\ d(s^0, v^1) \,\}$.</li>
  </ol>
</div>
<p>The animation runs Dijkstra on $G'$ of {{5R15}}. Its result is not on the slide: $d(s^0, a^0) = 5$ and $d(s^0, b^1) = 2$ (the road $b \to s$ driven backwards), so the answers are $s = 0$, $a = 5$, $b = 2$. {{added}} This is a [[reduction]], as in Exercise 2 of Week 4: the input is changed, not Dijkstra. {{added}}</p>
<div class="algo-mount" data-algo="dijkstra" data-preset="gR15" data-presets="g24,gR15"></div>
<div class="box theorem">
  <span class="box-label">Correctness {{5R17}} {{5R18}}</span>
  <p><strong>Main claim:</strong> (1) there exists a path of cost $c$ from $s$ to $v$ in $G$ iff there exists a path of cost $c$ from $s^0$ to $v^0$ in $G'$; (2) there exists an almost-valid path of cost $c$ from $s$ to $v$ in $G$ iff there exists a path of cost $c$ from $s^0$ to $v^1$ in $G'$. Given the claim, correctness follows from returning $\min\{d(s^0, v^0), d(s^0, v^1)\}$ for each node.</p>
  <p><strong>Proof of the claim {{5R18}}.</strong> (1) The first copy is identical to $G$, so the paths in $V^0$ are identical to paths in $G$. (2) Let $p$ be an almost-valid path from $s$ to $v$ in $G$, and $(a, b)$ the edge used in the opposite direction. By the construction, $G'$ includes the path $s^0 \leadsto b^0 - a^1 \leadsto v^1$. There is a path $s \leadsto b$ in $G$ with the same cost as $s^0 \leadsto b^0$, and a path $a \leadsto v$ in $G$ with the same cost as $a^1 \leadsto v^1$. The edge $b^0 - a^1$ costs the same as $a - b$ in $G$, so the total cost is the same as that of the almost-valid path $s \leadsto b - a \leadsto v$. Direction 2: from a path $s^0 \leadsto b^0 - a^1 \leadsto v^1$ in $G'$, by similar arguments $s \leadsto b - a \leadsto v$ is an almost-valid path in $G$.</p>
</div>
<div class="box theorem">
  <span class="box-label">Time complexity {{5R19}}</span>
  <p>Constructing $G'$: $n' = 2n$, $m' = 3m$, so $O(n' + m') = O(n + m)$. Dijkstra on $G'$: $O(m' + n' \log n') = O(m + n \log n)$. Returning the result: $O(1)$ for each $v$, $O(n') = O(n)$ in total. <strong>Total: $O(m + n \log n)$.</strong></p>
</div>
<aside class="callout intuition">
  <span class="callout-title">Why one copy-switch is the limit</span>
  <p>Every backward road goes from copy 0 to copy 1, and no edge goes back from copy 1 to copy 0. So a path from $s^0$ uses ==at most one== backward road, and it reaches $v^1$ only if it used exactly one. The $O(m + n \log n)$ assumes the [[fibonacci-heap|Fibonacci heap]] of {{5L42}}. {{added}}</p>
</aside>`,
  };

  E.w5REx4 = {
    id: 'w5-r-ex4', title: 'Exercise 4: a single negative edge', slides: ['5R20', '5R21'], checklist: [],
    html: String.raw`
<div class="box definition">
  <span class="box-label">Exercise 4 {{5R20}}</span>
  <p>Let $G = (V, E)$ be a weighted [[directed-graph|directed graph]] with positive weights ==except one [[edge|edge]]==, with $w(a, b) < 0$. Suggest an algorithm that finds the shortest paths from $s \in V$ to all [[vertex|vertices]] in $G$.</p>
</div>
<p><strong>Idea:</strong> calculate separately the length of a shortest [[path]] that ==does not use $(a, b)$==, and one that ==must use $(a, b)$==.</p>
<div class="box definition">
  <span class="box-label">Algorithm {{5R20}}</span>
  <ol>
    <li>Construct a new [[graph|graph]] $G' = (V, E \setminus \{(a, b)\})$.</li>
    <li>Run [[dijkstra|Dijkstra]] on $G'$ from $s$. The output is $d'(s, v)$ for all $v$.</li>
    <li>Run Dijkstra on $G'$ from $b$. The output is $d'(b, v)$ for all $v$.</li>
    <li>For each $v \in V$, output $\min\{\, d'(s, v),\ d'(s, a) + w(a, b) + d'(b, v) \,\}$.</li>
  </ol>
</div>
<div class="box theorem">
  <span class="box-label">Correctness and time {{5R21}}</span>
  <p>If a shortest path from $s$ to $v$ does not contain $(a, b)$, then by the correctness of Dijkstra, $d'(s, v)$ holds the correct shortest path from $s$ to $v$. Else the path is $s \to a \to b \to v$. The shortest path is ==composed of shortest sub-paths== (<a href="#e-w5-r-ex1">Exercise 1</a>): (1) $s \to a$ is a shortest path, found by Dijkstra on $G'$; (2) $b \to v$ is a shortest path, found by Dijkstra on $G'$; (3) $a \to b$ is the only negative edge, and therefore must be a shortest path from $a$ to $b$.</p>
  <p><strong>Time:</strong> building the graph takes $O(n + m)$, and running Dijkstra twice takes $O(m + n \log n)$.</p>
</div>
<aside class="callout caution">
  <span class="callout-title">⚠️ A negative cycle through (a, b)</span>
  <p>The exercise does not say so, but it needs ==no [[negative-cycle|negative cycle]]==: if a path from $b$ back to $a$ weighs less than $-w(a, b)$, the [[cycle|cycle]] $a \to b \leadsto a$ is negative, and no shortest path exists to the vertices it reaches ({{5L9}}). The site's check compares the algorithm with [[bellman-ford|Bellman-Ford]] on a small graph of its own, without such a cycle. {{added}}</p>
</aside>`,
  };
})();
