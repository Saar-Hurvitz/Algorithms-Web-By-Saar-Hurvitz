/* Part A: Lecture 6 entries (order is set in week.js). */
window.E = window.E || {};

(function () {
  const range = (deck, from, to) => Array.from({ length: to - from + 1 }, (_, i) => `${deck}${from + i}`);

  E.w6Review = {
    id: 'w6-review', title: 'Review of Lecture 5: relax, DAGs and Dijkstra', recap: true, slides: range('6L', 2, 5),
    html: String.raw`
<p>Lecture 6 opens by reviewing Lecture 5. Everything here was taught in <a href="#e-w5-review">Week 5</a>.</p>
<ul>
  <li><strong>The general structure of a single-<span class="nt">source</span> algorithm</strong> {{6L2}}: for every [[vertex|node]] $v \in V$, $v.d$ = the length of the shortest [[path]] detected so far. $v.d$ is initialized to infinity (except $s.d = 0$), and may be updated (==decreased==) in [[relax]] operations: $\text{relax}(u, v)$: $v.d = \min\{v.d,\ u.d + w(u, v)\}$, the current best against what we can achieve using $(u, v)$.</li>
  <li><strong>[[dag-sp|The algorithm for a DAG]]</strong> (arbitrary weights) {{6L3}}: 1. topological sort; 2. consider the vertices according to the [[topo-sort|toposort]], and when $v$ is considered, relax all the [[edge|edges]] outgoing from $v$. Time $O(n + m)$.</li>
  <li><strong>[[dijkstra|Dijkstra]]</strong>, for [[graph|graphs]] with ==non-negative weights== {{6L4}}: a data structure $Q$ that supports 'find-min' stores the $v.d$ values; in every iteration, consider a node with minimal $v.d$, relax all the edges outgoing from it, and remove it from $Q$. Three different implementations: $O((m + n)\log n)$, $O(n^2)$ or $O(m + n \log n)$ (<a href="#e-w5-dijkstra-time">Week 5</a>).</li>
</ul>
<div class="box theorem">
  <span class="box-label">What the two algorithms have in common {{6L5}}</span>
  <ul>
    <li>They consider the nodes in some order.</li>
    <li>When $v$ is considered, relax all the edges outgoing from $v$. Therefore: ==every edge is relaxed once==.</li>
  </ul>
  <p>In a [[dag|DAG]], the order is known in advance (determined by the toposort). In Dijkstra, the order is determined dynamically, as it depends on the [[distance]] from $s$.</p>
  <p><strong>In both:</strong> for every shortest path $p$, ==the edges of $p$ are relaxed according to their order in $p$== ([[property-star|property ∗]]).</p>
</div>`,
  };

  E.w6ShiftRecap = {
    id: 'w6-shift-recap', title: 'Dijkstra and negative weights: the shift fix fails', recap: true, slides: range('6L', 6, 8),
    html: String.raw`
<p>These three slides repeat {{5L43}}–{{5L45}} of Lecture 5, with the same [[graph|graphs]]. The full entry, with its exercise, is <a href="#e-w5-negative">in Week 5</a>.</p>
<ul>
  <li>Why does [[dijkstra|Dijkstra]] fail when the graph includes negative weights? {{6L6}}</li>
  <li>Suggested fix {{6L7}}: let $\Delta < 0$ be the minimal weight of an [[edge]]; set $w'(e) = w(e) - \Delta$ for every $e \in E$, run Dijkstra and return the shortest [[path]] in $G'$.</li>
  <li>Does this fix work? ==No== {{6L8}}: the [[path-weight|weight of a path]] with $k$ edges is increased by $\Delta \cdot k$, which is not uniform for all paths. (With $\Delta < 0$, the increase is $|\Delta| \cdot k$; see the note in Week 5.)</li>
</ul>
<p><strong>So we need a totally different approach for graphs with negative weights:</strong> the [[bellman-ford|Bellman-Ford]] algorithm {{6L8}}.</p>`,
  };

  E.w6BFReview = {
    id: 'w6-bf-review', title: 'Review of Bellman-Ford', recap: true, slides: ['6L9', '6L11'],
    html: String.raw`
<p>From <a href="#e-w5-bf">Week 5</a>: [[bellman-ford|Bellman-Ford]], for [[graph|graphs]] with negative weights {{6L9}}.</p>
<ul>
  <li>Perform at most $n - 1$ [[sweep|sweeps]]. A sweep: [[relax]] all [[edge|edges]] one after the other.</li>
  <li>==Until an entire sweep with no $v.d$ update, or $n - 1$ sweeps.==</li>
</ul>
<p><strong>Proof, main arguments</strong> {{6L9}}:</p>
<ol>
  <li>If the shortest [[path]] from $s$ to $v$ consists of $k$ edges, then ==after at most $k$ sweeps==, $v.d = d(s, v)$.</li>
  <li>If there are no [[negative-cycle|negative cycles]], $k$ is at most $n - 1$.</li>
</ol>
<div class="box theorem">
  <span class="box-label">Run-time analysis {{6L11}}</span>
  <p>$|E|$ relax operations in every sweep, $|E|(|V| - 1)$ in total. Each relax takes $O(1)$: it only needs an array with the $v.d$ values and direct access to the edge weights (which can be kept in the graph's data structure). ==The time complexity of BF is $O(|E||V|)$.==</p>
</div>`,
  };

  E.w6BFTable = {
    id: 'w6-bf-table', title: 'Quick review: run Bellman-Ford with a given edge order', exercise: true, slides: ['6L10'],
    html: String.raw`
<p>Run [[bellman-ford|BF]] with the [[edge]] order $sa, sd, ab, cb, ac, bd$ {{6L10}}. The slide <span class="nt">leaves</span> the table of [[sweep|sweeps]] empty; the answers below are computed. {{added}}</p>
<div class="ex-mount" data-ex="bfTable"></div>
<aside class="callout intuition">
  <span class="callout-title">What the table shows</span>
  <p>In sweep 1, $cb$ comes before $ac$, so when $cb$ is [[relax|relaxed]] $c.d$ is still $\infty$ and nothing changes. Only in sweep 2 does $cb$ lower $b.d$ to $1$, and then $bd$ lowers $d.d$ to $2$. Sweep 3 changes nothing, so the run stops after 3 of the $n - 1 = 4$ allowed sweeps. The shortest [[path]] $s \to a \to c \to b \to d$ has 4 edges, but this order needed only 2 sweeps with updates. {{added}}</p>
</aside>`,
  };

  E.w6NegDetect = {
    id: 'w6-neg-detect', title: 'Detecting negative cycles with Bellman-Ford', algo: true, slides: ['6L12', '6L13'],
    html: String.raw`
<div class="box definition">
  <span class="box-label">Negative cycle {{6L12}}</span>
  <p>A [[negative-cycle|negative cycle]]: a directed [[cycle]] whose ==total edge-weight is negative==.</p>
  <ul>
    <li>If a negative cycle exists, then it is always beneficial to repeat it; therefore the shortest [[path]] is infinite and not well-defined.</li>
    <li><strong>Goal:</strong> given a [[directed-graph|directed graph]], identify whether a negative cycle exists.</li>
    <li><strong>Idea:</strong> a negative cycle exists ==iff some shortest path is not [[simple-path|simple]]==.</li>
    <li><strong>Implementing this idea:</strong> add to the [[bellman-ford|BF]] algorithm another [[sweep]] (sweep number $n$).</li>
  </ul>
</div>
<div class="box theorem">
  <span class="box-label">Detecting negative cycles by Bellman-Ford {{6L13}}</span>
  <p><strong>Theorem:</strong> the [[graph]] includes a negative cycle ==if and only if for some vertex $v$, $v.d$ is reduced in sweep number $|V|$==.</p>
  <p><strong>Practically:</strong> after $|V| - 1$ sweeps perform:</p>
  <pre class="code-block">for each (u,v)∈E
  – If v.d > u.d + w(u,v) then print “A negative cycle exists”</pre>
  <p>This is <dfn data-term="nc-detection">negative-cycle detection</dfn> by Bellman-Ford.</p>
</div>
<aside class="callout caution">
  <span class="callout-title">⚠️ Only cycles that s can reach</span>
  <p>The check compares $v.d$ values, and every $v.d$ on a [[cycle]] that $s$ cannot reach stays $\infty$: $\infty > \infty + w$ is false, so nothing is printed even if that cycle is negative. So the theorem of {{6L13}} is about negative cycles ==reachable from $s$==. To test the whole graph, one could add a new [[vertex]] with a 0-weight [[edge]] to every vertex and run from it. {{added}}</p>
</aside>
<p>The animation runs $|V| - 1$ sweeps and then the check. The first graph is the one of {{6L10}}: it has no cycle at all, so nothing is printed. The second is ==added==: the recitation graph of {{6R8}} with $w(B, A) = -1$ in place of $1$, so that $A \to E \to B \to A$ weighs $2 - 2 - 1 = -1$. {{added}}</p>
<div class="algo-mount" data-algo="bellmanFord" data-presets="g6L10,g6R8neg" data-preset="g6R8neg" data-mode="detect"></div>`,
  };

  E.w6NegProof = {
    id: 'w6-neg-proof', title: 'Why the check is right: a message ⇔ a negative cycle', slides: range('6L', 14, 19),
    html: String.raw`
<p>The theorem of {{6L13}}: a message is printed ⇔ there is a [[negative-cycle|negative cycle]]. The two directions, as {{6L17}}–{{6L19}} prove them. ({{6L14}}–{{6L16}} give the same proof in Hebrew.)</p>
<details class="proof" open><summary>1. No negative cycle ⇒ no print {{6L17}}</summary>
<p>No negative cycle, therefore all shortest [[path|paths]] are [[simple-path|simple]]. A simple path consists of at most $n - 1$ [[edge|edges]]. By the proof of [[bellman-ford|BF]], the $v.d$ values are already finalized after $n - 1$ iterations, so ==no update will occur in iteration $n$==.</p>
</details>
<details class="proof" open><summary>2. No print ⇒ no negative cycle: a warm-up example {{6L18}}</summary>
<p>Let $x - u - v - x$ be a [[cycle]] in the [[graph]]. During the $n$-th [[sweep]], the 3 edges are relaxed. Since nothing is printed, the [[relax]] operations do not lead to an update, thus</p>
$$u.d \le x.d + w(x,u), \qquad v.d \le u.d + w(u,v), \qquad x.d \le v.d + w(v,x).$$
<p>Summing up: $(u.d + v.d + x.d) \le (u.d + v.d + x.d) + \sum_{e \text{ in cycle}} w(e)$, so ==$\sum_{e \text{ in cycle}} w(e) \ge 0$==.</p>
</details>
<details class="proof" open><summary>2. The general proof {{6L19}}</summary>
<p>Assume no printout. Let $v_0 - v_1 - \dots - v_k - v_0$ be a cycle. We show that $\sum_{e \text{ in cycle}} w(e) \ge 0$.</p>
<p>Let $(u, v)$ be an edge in the cycle. Since nothing is printed, $v.d \le u.d + w(u, v)$. That is, for $i = 1 \dots n$, $v_i.d \le v_{i-1}.d + w(v_{i-1}, v_i)$. In addition, for the edge $(v_k, v_0)$: $v_0.d \le v_k.d + w(v_k, v_0)$.</p>
<p>Summing up, we get $\sum_i v_i.d \le \sum_i v_i.d + \sum_{e \text{ in cycle}} w(e)$. This implies that $\sum_{e \text{ in cycle}} w(e) \ge 0$. ∎</p>
</details>
<aside class="callout caution">
  <span class="callout-title">⚠️ Two small points in the proof</span>
  <p>On {{6L19}}, "for $i = 1 \dots n$" should be ==$i = 1 \dots k$==: the cycle has the [[vertex|vertices]] $v_0, \dots, v_k$. And subtracting $\sum_i v_i.d$ from both sides needs these values to be finite, which holds when the cycle is reachable from $s$ (see the note on <a href="#e-w6-neg-detect">detection</a>). {{added}}</p>
</aside>
<aside class="callout intuition">
  <span class="callout-title">Why the sum cancels</span>
  <p>Going around the cycle, every $v_i.d$ appears once on the left and once on the right: the inequalities form a chain that returns to where it started. What is left on the right is exactly the cycle's weight, which therefore cannot be negative. {{added}}</p>
</aside>`,
  };

  E.w6Apsp = {
    id: 'w6-apsp', title: 'The all-pair shortest path problem', slides: ['6L20', '6L21'],
    html: String.raw`
<div class="box definition">
  <span class="box-label">All-pair shortest path {{6L20}}</span>
  <p><strong>Input:</strong> a [[directed-graph|directed graph]] $G = (V, E)$ and a weight function $w: E \to R$; $w(u, v)$ ==may be negative==. Let $V = \{1, 2, \dots, n\}$.</p>
  <p><strong>Output:</strong> the <dfn data-term="apsp">all-pair shortest path</dfn>: for any two [[vertex|vertices]] $v, u$ in $V$, what is the shortest [[path]] from $v$ to $u$. We will only be interested in ==the length== of that path.</p>
</div>
<p><strong>Using single-<span class="nt">source</span> algorithms</strong> {{6L21}}: we can run [[bellman-ford|Bellman-Ford]] $|V|$ times, one time for each possible selection of the <span class="nt">source</span> vertex $s$. Time complexity: $|V| \cdot O(|V||E|) = O(|V|^2|E|)$.</p>
<p>We will see a solution based on ==Dynamic Programming== {{6L21}}.</p>
<p>For a [[dense-graph|dense graph]], $|E|$ is about $|V|^2$, so $n$ runs of Bellman-Ford cost about $n^4$; the algorithm below takes $O(n^3)$ {{6L32}}. {{added}}</p>`,
  };

  E.w6Delta = {
    id: 'w6-delta', title: 'δ⁰(i, j) and δᵏ(i, j)', slides: ['6L22'],
    html: String.raw`
<div class="box definition">
  <span class="box-label">Define {{6L22}}</span>
  $$\delta^0(i, j) = \begin{cases} w(e) & \text{if } (i, j) \in E, \\ \infty & \text{if } (i, j) \notin E, \\ 0 & \text{if } i = j. \end{cases}$$
  <p>Let <dfn data-term="delta-k">$\delta^k(i, j)$</dfn> be the length of a shortest [[path]] from $i$ to $j$ ==among all paths which may pass through vertices $1, 2, \dots, k$== but ==do not pass through vertices $k+1, k+2, \dots, n$==.</p>
</div>
<p>"Pass through" means as an internal [[vertex]]: $i$ and $j$ themselves can be any vertices {{6L22}} (the drawing shows $i$ and $j$ outside both clouds). So $\delta^0(i, j)$ allows no vertex in between: only the [[edge]] $(i, j)$ itself. {{added}}</p>
<aside class="callout caution">
  <span class="callout-title">⚠️ The cases of δ⁰ overlap</span>
  <p>When $i = j$, the [[graph]] has no edge $(i, i)$ (it is [[simple-digraph|simple]]), so the second case "$\infty$ if $(i, j) \notin E$" also applies. The value meant is the third: $\delta^0(i, i) = 0$, as the matrix of {{6L25}} shows on its diagonal. {{added}}</p>
</aside>`,
  };

  E.w6FW = {
    id: 'w6-fw', title: 'The Floyd-Warshall algorithm', algo: true, slides: range('6L', 23, 30),
    html: String.raw`
<div class="box definition">
  <span class="box-label">Floyd-Warshall Algorithm (1962) {{6L23}}</span>
  <p>The <dfn data-term="floyd-warshall">Floyd-Warshall algorithm</dfn>, for the [[apsp|all-pair shortest path]] problem:</p>
  <pre class="code-block">1. Init δ⁰(i, j) as defined earlier
2. k ← 1
3. For every 1 ≤ i, j ≤ n compute
   δᵏ(i, j) ← Min { δᵏ⁻¹(i, j),
                    δᵏ⁻¹(i, k) + δᵏ⁻¹(k, j)}.
4. If k = n, stop. If not, increment k and go to step 3.</pre>
</div>
<div class="box theorem">
  <span class="box-label">Why the recurrence is right {{6L24}}</span>
  <p>The shortest [[path]] from $i$ to $j$ which may pass through [[vertex|vertices]] $1, 2, \dots, k$ but does not pass through vertices $k+1, \dots, n$:</p>
  <ol>
    <li>==might not pass through vertex $k$==: then its length is $\delta^{k-1}(i, j)$, or</li>
    <li>==might pass through $k$==, and then it is composed of two already-computed shortest paths: $i \leadsto k$ and $k \leadsto j$, of lengths $\delta^{k-1}(i, k)$ and $\delta^{k-1}(k, j)$.</li>
  </ol>
</div>
<p>The parts in brackets of case 2 are the slide's drawing $i \leadsto k \leadsto j$ in words. Each part uses only vertices up to $k - 1$ inside, because a shortest path passes through $k$ at most once. {{added}}</p>
<p><strong>The example {{6L25}}–{{6L30}}:</strong> the [[graph]] has the vertices $1, \dots, 5$. The slides show $\delta^0, \delta^1, \dots, \delta^5$, with "--" for $\infty$ and the values that changed in red. The animation computes the same six matrices, cell by cell; on the left is the matrix it reads ($\delta^{k-1}$), on the right the one it writes ($\delta^k$).</p>
<ul>
  <li>$\delta^1$ {{6L26}}: through vertex 1, row 4 gets $\delta^1(4,2) = 2 + 3 = 5$ and $\delta^1(4,5) = 2 + (-4) = -2$.</li>
  <li>$\delta^2$ {{6L27}}: through 2, $\delta^2(1,4) = 4$, $\delta^2(3,4) = 5$, $\delta^2(3,5) = 11$.</li>
  <li>$\delta^3$ {{6L28}}: through 3, $\delta^3(4,2) = -5 + 4 = -1$.</li>
  <li>$\delta^4$ {{6L29}}: through 4, ==most of the matrix changes==, since every vertex can now reach 4 and 4 reaches every vertex {{added}}.</li>
  <li>$\delta^5$ {{6L30}}: through 5, row 1 becomes $0, 1, -3, 2, -4$. This is the final answer.</li>
</ul>
<div class="algo-mount" data-algo="floydWarshall" data-presets="g25,gneg"></div>
<p>The second graph is ==added==: {{6L25}} with $w(3, 2) = 3$ in place of $4$, which makes the [[cycle]] $2 \to 4 \to 3 \to 2$ weigh $1 - 5 + 3 = -1$, a [[negative-cycle|negative cycle]]; the end of the run shows the test of {{6L32}}. On the slide's graph this cycle weighs exactly $0$. {{added}}</p>
<aside class="callout intuition">
  <span class="callout-title">Row k and column k never change</span>
  <p>In round $k$, $\delta^k(i, k) = \min\{\delta^{k-1}(i, k),\ \delta^{k-1}(i, k) + \delta^{k-1}(k, k)\}$, and $\delta^{k-1}(k, k) = 0$ when there is no negative cycle. So row $k$ and column $k$ stay as they are, and every other cell reads only its own old value and a value of row $k$ plus a value of column $k$. That is why one matrix can be updated in place in practice. {{added}}</p>
</aside>`,
  };

  E.w6FWHand = {
    id: 'w6-fw-hand', title: 'Compute δᵏ yourself', exercise: true, slides: range('6L', 25, 30),
    html: String.raw`
<p>Compute $\delta^1, \dots, \delta^5$ for the [[graph]] of {{6L25}}, as [[floyd-warshall|Floyd-Warshall]] does: in each round, find the cells that go down. Right and wrong are computed by the algorithm, and the result matches {{6L30}}.</p>
<div class="ex-mount" data-ex="fwByHand"></div>`,
  };

  E.w6FWProof = {
    id: 'w6-fw-proof', title: 'Floyd-Warshall: correctness, time, negative cycles', slides: ['6L31', '6L32'],
    html: String.raw`
<div class="box theorem">
  <span class="box-label">Theorem {{6L31}}</span>
  <p>The value of $\delta^n(i, j)$ is the shortest [[path]] from $i$ to $j$.</p>
  <p><strong>Proof idea:</strong> ==by induction on $k$==, the value of [[delta-k|$\delta^k(i, j)$]] is correct. In particular, for $\delta^n(i, j)$ we get the shortest path.</p>
</div>
<p>The induction: $\delta^0$ is correct by its definition, and the step from $k - 1$ to $k$ is the case analysis of {{6L24}}. With $k = n$, no [[vertex]] is excluded any more. {{added}}</p>
<div class="box theorem">
  <span class="box-label">Time complexity {{6L32}}</span>
  <p>Each application of step 3 requires $O(n^2)$ operations, and step 3 is repeated $n$ times. Thus, the total time complexity is ==$O(n^3)$==.</p>
</div>
<div class="box theorem">
  <span class="box-label">Negative cycles detection {{6L32}}</span>
  <p>If a [[negative-cycle|negative cycle]] exists, then for some $i$ and $k$, we will get ==$\delta^k(i, i) < 0$==.</p>
</div>
<p>A negative [[cycle]] through $i$ is a path from $i$ to $i$ of negative length, so once $k$ is large enough to allow all its vertices, $\delta^k(i, i)$ drops below its start value $0$. The recitation states the converse too ({{6R26}}). {{added}}</p>`,
  };

  E.w6Summary = {
    id: 'w6-summary', title: 'Shortest-path algorithms: summary', slides: ['6L33'],
    html: String.raw`
<div class="table-wrap"><table class="model">
  <thead><tr><th>Problem {{6L33}}</th><th>Algorithm</th><th>Time</th></tr></thead>
  <tbody>
    <tr><td>Single <span class="nt">source</span>, no weights</td><td>[[bfs|BFS]]</td><td>$O(n + m)$</td></tr>
    <tr><td>Single <span class="nt">source</span>, [[dag|DAG]]</td><td>[[dag-sp|DAG algorithm]]</td><td>$O(n + m)$</td></tr>
    <tr><td>Single <span class="nt">source</span>, non-negative weights</td><td>[[dijkstra|Dijkstra]]</td><td>$O((n + m)\log n)$ or $O(n^2)$ or $O(m + n \log n)$</td></tr>
    <tr><td>Single <span class="nt">source</span>, arbitrary weights</td><td>[[bellman-ford|Bellman-Ford]]</td><td>$O(nm)$</td></tr>
    <tr><td>[[apsp|All-pair shortest path]], arbitrary weights</td><td>[[floyd-warshall|Floyd-Warshall]]</td><td>$O(n^3)$</td></tr>
  </tbody>
</table></div>
<p>Pick the most specific row that fits: the more the input promises (no weights, no [[cycle|cycles]], no negative weights), the faster the algorithm. {{added}}</p>`,
  };

  E.w6Techniques = {
    id: 'w6-techniques', title: 'Common techniques in "suggest an algorithm" problems', slides: ['6L37', '6L38'],
    html: String.raw`
<div class="box definition">
  <span class="box-label">Common techniques for shortest path variants {{6L38}}</span>
  <ol>
    <li><dfn data-term="graph-replication">Graph replication</dfn>: each copy corresponds to some ==property of the paths reaching the copy==.</li>
    <li>Nodes addition, edge reversing: changes in the [[graph]].</li>
    <li>Partition a [[path]] into subpaths fulfilling some properties.</li>
  </ol>
</div>
<p>{{6L37}} is the same slide in Hebrew. The two problems that follow use the first two techniques: the gas stations problem replicates the graph, and [[dijkstra|Dijkstra]] Pizza adds a [[vertex|node]] and reverses the [[edge|edges]]. {{added}}</p>`,
  };

  E.w6Gas = {
    id: 'w6-gas', title: 'The gas stations problem: two copies of the graph', algo: true, slides: range('6L', 39, 43),
    html: String.raw`
<div class="box definition">
  <span class="box-label">1. The Gas Stations Problem {{6L40}}</span>
  <p>Let $G = (V, E)$ be a [[directed-graph|directed graph]] with ==positive== [[edge]] weights $w: E \to R^+$. Let $s \in V$ and $U \subseteq V$. It is given that ==$s \notin U$==.</p>
  <p>For every $v \in V$ denote by <dfn data-term="d-u">$d_U(s, v)$</dfn> the length of the shortest [[path]] from $s$ to $v$ ==that visits at least one vertex from $U$==.</p>
  <p>Application: in every $v \in U$ there is a gas station, and you must pass a gas station on your way.</p>
  <p><strong>Clarification:</strong> if $v \in U$, then it is not required to visit another vertex from $U$ before $v$.</p>
  <p>Suggest an efficient algorithm for calculating, given $G, U, s$, the value of $d_U(s, v)$ for every $v \in V$. Describe the algorithm, justify its correctness, specify and justify its time complexity.</p>
</div>
<p><strong>Example</strong> {{6L40}}: for $U = \{a\}$, $d_U(s, s) = 4 + 2 + 5 = 11$, $d_U(s, a) = 4$, $d_U(s, b) = 7$, $d_U(s, c) = 6$. ({{6L39}} is the same slide in Hebrew.)</p>
<div class="box definition">
  <span class="box-label">Algorithm {{6L41}}</span>
  <ol>
    <li>Build a directed [[graph]] $G' = (V', E')$, where $V' = V_0 \cup V_1$ ==(two copies of $V$)==. Denote by $v_i$ the [[vertex]] $v$ in copy $i$. $E'$: for every $(u, v) \in E$, $E'$ includes the edges $(u_0, v_0)$ and $(u_1, v_1)$, with $w(u_0, v_0) = w(u_1, v_1) = w(u, v)$. Also, ==for every $u \in U$, $E'$ includes the edge $(u_0, u_1)$, with $w(u_0, u_1) = 0$==.</li>
    <li>Run [[dijkstra|Dijkstra]] on $G'$, with $s_0$ as <span class="nt">source</span>.</li>
    <li>For all $v \in V$ return $d_U(s, v) = d(s_0, v_1)$.</li>
  </ol>
</div>
<p>This is [[graph-replication|graph replication]]: copy 0 holds the paths that have not passed a gas station yet, and copy 1 the paths that have. {{added}}</p>
<div class="algo-mount" data-algo="dijkstra" data-presets="g6L41" data-preset="g6L41"></div>
<p>The run ends with $d(s_0, s_1) = 11$, $d(s_0, a_1) = 4$, $d(s_0, b_1) = 7$, $d(s_0, c_1) = 6$: the four values of {{6L40}}. {{added}}</p>
<div class="box theorem">
  <span class="box-label">Correctness {{6L42}}</span>
  <p><strong>Idea:</strong> the graphs induced by $V_0$ and $V_1$ are copies of $G$. A transition from $V_0$ to $V_1$ is ==only via edges outgoing from a vertex in $U$==; therefore a path from $s_0$ to any node in $V_1$ includes an edge that <span class="nt">leaves</span> a node from $U$, so such a path includes at least one visit in $U$.</p>
  <p><strong>Main claim:</strong> $G'$ includes a path of length $k$ from $s_0$ to $v_1$ ==iff== $G$ includes a path of length $k$ from $s$ to $v$ that visits at least one vertex from $U$.</p>
  <p>In particular, the correctness of Dijkstra implies that $d(s_0, v_1)$ is the length of a shortest path that includes at least one node from $U$.</p>
</div>
<div class="box theorem">
  <span class="box-label">Time complexity {{6L43}}</span>
  <ol>
    <li>$|V'| = 2|V|$, $|E'| = 2|E| + |U|$. Building $G'$ takes $\Theta(|V'| + |E'|) = \Theta(|E| + |V|)$.</li>
    <li>Running Dijkstra on $G'$: $\Theta((|V'| + |E'|)\log|V'|) = \Theta((|V| + |E|)\log|V|)$ (assuming an implementation with a binary heap).</li>
    <li>Output: $\Theta(|V|)$.</li>
  </ol>
  <p>All together: ==$\Theta((|V| + |E|)\log|V|)$==.</p>
</div>
<aside class="callout caution">
  <span class="callout-title">⚠️ |W| on 6L43 should be |U|</span>
  <p>{{6L43}} writes "$E' = 2|E| + |W|$". This problem has no set $W$ (that is the name of the branches in Dijkstra Pizza): the extra edges are the $(u_0, u_1)$, one for each $u \in U$, so $|E'| = 2|E| + |U|$. The bound does not change, since $|U| \le |V|$. {{added}}</p>
</aside>`,
  };

  E.w6Copies = {
    id: 'w6-copies', title: 'The general structure of a solution based on copies of the graph', slides: range('6L', 44, 47),
    html: String.raw`
<div class="box definition">
  <span class="box-label">Algorithm {{6L44}}</span>
  <ol>
    <li>Given $G = (V, E)$, build $G' = (V', E')$ and define $w: E' \to R$. $V'$ is some function of $V, E$; $E'$ is some function of $V, E$.</li>
    <li>Run some algorithm on $G'$ (==refer to $G'$== when describing this run: for example, the <span class="nt">source</span> should be a [[vertex|node]] in $V'$).</li>
    <li>Conclude something about $G$ from the run on $G'$.</li>
  </ol>
</div>
<div class="box theorem">
  <span class="box-label">Correctness {{6L45}} {{6L46}}</span>
  <p>There is a [[path]] with property $X$ in $G$ ==iff== there is a path with property $Y$ in $G'$.</p>
  <p>In particular: a shortest path with property $X$ corresponds to a shortest path with property $Y$ in $G'$ (be careful here, sometimes the properties are involved).</p>
  <p>What should be included in "property"? The <span class="nt">source</span> and target of the path, and its weight; and the characterization we want to keep track of.</p>
  <p><strong>Example:</strong> in $G$, there is a path from $s$ to $v$, of length $k$, that has an ==even number of [[edge|edges]]== iff in $G'$ there is a path from $s_0$ to $v_2$ of length $k$ {{6L45}}.</p>
  <p>In some cases, the correctness claim distinguishes between several types of paths {{6L46}}: there is a path with property $X_1$ in $G$ iff there is a path with property $Y_1$ in $G'$, and there is a path with property $X_2$ in $G$ iff there is a path with property $Y_2$ in $G'$.</p>
</div>
<div class="box theorem">
  <span class="box-label">Time complexity {{6L47}}</span>
  <ol>
    <li>How much does it cost to build $G'$? What are $|V'|$ and $|E'|$?</li>
    <li>How much time does it take to run on $G'$? Specify it ==as a function of $|V'|$ and $|E'|$, and only then as a function of $|V|$ and $|E|$==.</li>
    <li>How much time does it take to conclude the output?</li>
  </ol>
  <p>The time complexity should be given as a function of the input size ($|V|$ and $|E|$).</p>
</div>
<p>The gas stations problem above follows this structure exactly: $X$ = "from $s$ to $v$, visits $U$", $Y$ = "from $s_0$ to $v_1$". Exercise 3 of the recitation is a case with two types of paths, as on {{6L46}}. {{added}}</p>`,
  };

  E.w6Pizza = {
    id: 'w6-pizza', title: 'Dijkstra Pizza: add a node, reverse the edges', algo: true, slides: ['6L48', '6L49', ...range('6L', 50, 54)],
    html: String.raw`
<div class="box definition">
  <span class="box-label">2. Dijkstra Pizza {{6L48}}</span>
  <p>Given is a [[directed-graph|directed graph]] $G = (V, E)$ with ==positive== weights on the [[edge|edges]]. The [[graph]] represents a geographical map, and edge weights correspond to lengths of roads. Also given is a set of nodes $W \subseteq V$; in every [[vertex|node]] $v \in W$ there is a branch of Dijkstra Pizza.</p>
  <p>Suggest an efficient algorithm for finding, for every $v \in V$, the minimal [[distance]] ==from $v$== to the closest branch of Dijkstra Pizza. Prove the correctness of your algorithm, specify and justify the time complexity.</p>
  <p><strong>Remarks:</strong> 1. For any $v \in W$, the output should be 0. 2. There exists an algorithm whose time complexity is equal to the time complexity of [[dijkstra|Dijkstra]].</p>
</div>
<p>{{6L49}} is the same slide in Hebrew. <strong>Example</strong> {{6L50}}: $W = \{a, b\}$; $d(u, a) = 10$ and $d(u, b) = 13$, so for $u$ we should return $10$.</p>
<div class="box definition">
  <span class="box-label">Algorithm {{6L52}}</span>
  <ol>
    <li>Given $G = (V, E)$, build a graph $G' = (V', E')$: $V' = V \cup \{s\}$, $E' = \{(s, v) \mid v \in W\} \cup \{(u, v) \mid (v, u) \in E\}$. Edges of type $(s, v)$ have weight 0. The reversed edges have the same weight as their corresponding edge in $G$.<br>In words: to construct $G'$ from $G$, ==add a vertex $s$== and connect it to all vertices of $W$ with new 0-weight edges; ==change the direction of all edges== of $G$.</li>
    <li>Run Dijkstra on $G'$, with $s$ as the <span class="nt">source</span>.</li>
    <li>The shortest [[path]] from $v \in V$ to a branch of Dijkstra Pizza is $d(s, v)$.</li>
  </ol>
</div>
<p>The animation runs Dijkstra on the $G'$ of {{6L51}}. Only $a$, $b$ and $u$ are named on the slide; the names $c$ to $h$ are ==added==. {{added}}</p>
<div class="algo-mount" data-algo="dijkstra" data-presets="g6L51" data-preset="g6L51"></div>
<p>It ends with $d(s, u) = 10$, as {{6L50}} says, and $d(s, a) = d(s, b) = 0$, as remark 1 asks. {{added}}</p>
<aside class="callout intuition">
  <span class="callout-title">Why reverse the edges</span>
  <p>Dijkstra measures distances ==from== one <span class="nt">source</span>, but here every vertex needs its distance ==to== some branch. Reversing the edges turns "from $v$ to $w$" into "from $w$ to $v$", and the new vertex $s$ with its 0-weight edges lets all the branches act as one <span class="nt">source</span>. {{added}}</p>
</aside>
<div class="box theorem">
  <span class="box-label">Correctness {{6L53}}</span>
  <p><strong>Claim:</strong> for every $v \in V$, there is a path of length $k$ from $v$ to some $w \in W$ in $G$ ==iff== there is a path of length $k$ from $s$ to $v$ in $G'$.</p>
  <p><strong>Proof:</strong> (i) Let $p$ be a path of length $k$ from $v$ to $w \in W$. The corresponding path from $s$ in $G'$ begins with the 0-weight edge $(s, w)$, followed by the reverse of $p$. By the construction, such a path exists and has the same weight as $p$.</p>
  <p>(ii) Let $p$ be a path of length $k$ from $s$ to $v$ in $G'$. It must begin with a zero-weight edge $(s, w)$ to some $w \in W$ (as these are the only edges outgoing from $s$). The rest of the path corresponds to a reversed path from $v$ to $w$ in $G$, thus its total weight is $k$.</p>
  <p>In particular, by the above claim, the shortest path from $s$ to $v$ in $G'$ corresponds to the length of a shortest path from $v$ to some node $w \in W$ in $G$.</p>
</div>
<div class="box theorem">
  <span class="box-label">Complexity {{6L54}}</span>
  <p>$|V'| = |V| + 1$, $|E'| = |E| + |W| \le |E| + |V|$. Therefore, assuming an implementation of Dijkstra with [[fibonacci-heap|Fibonacci heaps]]:</p>
  <ul>
    <li>Step 1: $\Theta(|V| + |W| + |E|) = \Theta(|V| + |E|)$.</li>
    <li>Step 2: $\Theta(|E'| + |V'|\log|V'|) = \Theta(|E| + |V|\log|V|)$.</li>
    <li>Step 3: $\Theta(|V|)$.</li>
  </ul>
  <p>Total: ==$\Theta(|E| + |V|\log|V|)$==, the time complexity of Dijkstra, as remark 2 promised.</p>
</div>`,
  };
})();
