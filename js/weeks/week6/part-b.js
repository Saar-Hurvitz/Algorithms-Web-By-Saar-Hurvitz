/* Part B: Recitation 6 entries (order is set in week.js).
   Concepts already taught in Part A are short recap cards with recap: true. */
window.E = window.E || {};

(function () {
  const range = (deck, from, to) => Array.from({ length: to - from + 1 }, (_, i) => `${deck}${from + i}`);

  E.w6RBF = {
    id: 'w6-r-bf', title: 'Bellman-Ford in the recitation', recap: true, slides: range('6R', 2, 4),
    html: String.raw`
<p>Last week: shortest [[path|paths]], [[relax]], shortest paths in [[dag|DAGs]], [[dijkstra|Dijkstra's algorithm]] {{6R2}}. This week: [[bellman-ford|Bellman-Ford]], [[floyd-warshall|Floyd-Warshall]], and general shortest-path exercises {{6R3}}.</p>
<p>Bellman-Ford {{6R4}}: a single <span class="nt">source</span> $s$; supports [[graph|graphs]] with ==arbitrary weights==; can be used to find [[negative-cycle|negative cycles]] (<a href="#e-w6-neg-detect">as in the lecture</a>). The recitation writes it as code:</p>
<pre class="code-block">Algorithm 1 Bellman-Ford(G,s)          Algorithm 1 INIT
1: Init(G,s)                           1: for each vertex v ∈ G.V do
2: for n-1 times do                    2:     v.d = ∞
3:     for each edge (u,v) ∈ E do      3:     v.π = NIL
4:         Relax(u,v)                  4: s.d = 0

                                       Algorithm 2 RELAX
                                       1: if v.d > u.d + w(u,v) then
                                       2:     v.d = u.d + w(u,v)
                                       3:     v.π = u</pre>
<p>The same algorithm as {{5L46}}, with INIT (once per [[vertex]]) and RELAX (of one [[edge]]) of {{5R6}}. The animations of the recitation's [[graph|graphs]] below show this code.</p>`,
  };

  E.w6REdges = {
    id: 'w6-r-edges', title: 'How many edges are in the shortest path?', exercise: true, slides: range('6R', 5, 7),
    html: String.raw`
<p>How many [[edge|edges]] are in the shortest [[path]] from $s$ to $A$, $B$ and $D$ {{6R5}}? The answers on the slides: ==$A$: 3, $B$: 5, $D$: 7== {{6R5}} {{6R6}} {{6R7}}, with the edges of these paths drawn in red on {{6R7}}.</p>
<p>The question matters because of {{6L9}}: a shortest path of $k$ edges is found after at most $k$ [[sweep|sweeps]] of [[bellman-ford|Bellman-Ford]]. $D$ needs 7 edges and the [[graph]] has $n = 8$ [[vertex|vertices]], so here the bound of $n - 1$ sweeps can really be needed. {{added}}</p>
<div class="ex-mount" data-ex="spEdgeCount"></div>`,
  };

  E.w6RBFRun = {
    id: 'w6-r-bf-run', title: 'The order of the edges: 7 sweeps against 3', algo: true, slides: range('6R', 8, 20),
    html: String.raw`
<p>The same [[graph]], run twice with two different orders of the [[edge|edges]].</p>
<p><strong>First order</strong> {{6R8}}: $(C,D)$, $(B,C)$, $(E,B)$, $(D,E)$, $(A,E)$, $(F,E)$, $(B,A)$, $(F,A)$, $(G,F)$, $(S,A)$, $(S,G)$. This order lists the edges of the shortest [[path|paths]] roughly ==backwards==, so each [[sweep]] advances them by about one edge {{added}}:</p>
<div class="table-wrap"><table class="model">
  <thead><tr><th>After</th><th>S</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th><th>G</th><th>Slide</th></tr></thead>
  <tbody>
    <tr><td>Init</td><td>0</td><td>∞</td><td>∞</td><td>∞</td><td>∞</td><td>∞</td><td>∞</td><td>∞</td><td>{{6R8}}</td></tr>
    <tr><td>Sweep 1</td><td>0</td><td>10</td><td>∞</td><td>∞</td><td>∞</td><td>∞</td><td>∞</td><td>8</td><td>{{6R10}}</td></tr>
    <tr><td>Sweep 2</td><td>0</td><td>10</td><td>∞</td><td>∞</td><td>∞</td><td>12</td><td>9</td><td>8</td><td>{{6R11}}</td></tr>
    <tr><td>Sweep 3</td><td>0</td><td>5</td><td>10</td><td>∞</td><td>∞</td><td>8</td><td>9</td><td>8</td><td>{{6R12}}</td></tr>
    <tr><td>Sweep 4</td><td>0</td><td>5</td><td>6</td><td>11</td><td>∞</td><td>7</td><td>9</td><td>8</td><td>{{6R13}}</td></tr>
    <tr><td>Sweep 5</td><td>0</td><td>5</td><td>5</td><td>7</td><td>14</td><td>7</td><td>9</td><td>8</td><td>{{6R14}}</td></tr>
    <tr><td>Sweep 6</td><td>0</td><td>5</td><td>5</td><td>6</td><td>10</td><td>7</td><td>9</td><td>8</td><td>{{6R15}}</td></tr>
    <tr><td>Sweep 7</td><td>0</td><td>5</td><td>5</td><td>6</td><td>9</td><td>7</td><td>9</td><td>8</td><td>{{6R16}}</td></tr>
  </tbody>
</table></div>
<p>After sweep 3, ==$A$ has the correct [[distance]] and path== {{6R12}} (3 edges). After sweep 5, $B$ {{6R14}} (5 edges). After sweep 7, $D$ (and all other [[vertex|nodes]]) {{6R16}} (7 edges).</p>
<p><strong>Remark</strong> {{6R9}}: if $v.d = u.d = \infty$, we do not update $v.d$, even if $w(u, v) < 0$.</p>
<p><strong>Second order</strong> {{6R17}}: $(S,A)$, $(S,G)$, $(G,F)$, $(F,E)$, $(F,A)$, $(C,D)$, $(E,B)$, $(B,C)$, $(B,A)$, $(A,E)$, $(D,E)$. The table ends after ==3 sweeps==; most edges now come in path order {{added}}:</p>
<div class="table-wrap"><table class="model">
  <thead><tr><th>After</th><th>S</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th><th>G</th><th>Slide</th></tr></thead>
  <tbody>
    <tr><td>Sweep 1</td><td>0</td><td>10 → 5</td><td>6</td><td>7</td><td>∞</td><td>8 → 7</td><td>9</td><td>8</td><td>{{6R18}}</td></tr>
    <tr><td>Sweep 2</td><td>0</td><td>5</td><td>5</td><td>6</td><td>10</td><td>7</td><td>9</td><td>8</td><td>{{6R19}}</td></tr>
    <tr><td>Sweep 3</td><td>0</td><td>5</td><td>5</td><td>6</td><td>9</td><td>7</td><td>9</td><td>8</td><td>{{6R20}}</td></tr>
  </tbody>
</table></div>
<p>In sweep 1, $A$ goes from 10 (via $(S,A)$) to 5 (via $(F,A)$), and $E$ from 8 (via $(F,E)$) to 7 (via $(A,E)$), all in the same sweep {{6R18}}. $(C,D)$ comes before $(B,C)$ in this order, so each improvement of $C$ reaches $D$ only one sweep later: $D.d = 10$ in sweep 2 and $9$ in sweep 3. {{added}}</p>
<p>Both tables are checked against a run of the algorithm. The animation shows the recitation's code {{6R4}}; with "stop when a sweep changes nothing", the second order ends after a 4th sweep with no updates. {{added}}</p>
<div class="algo-mount" data-algo="bellmanFord" data-presets="g6R8,g6R17" data-preset="g6R8" data-modes="full,stop"></div>
<p>Choose an order yourself, on this [[graph]] or the one of {{6L10}}. The fewest updating sweeps, and the order that reaches them (one that follows a shortest-path [[tree]]), are computed, not on the slides. {{added}}</p>
<div class="ex-mount" data-ex="bfOrder" data-graphs="6R8,6L10"></div>`,
  };

  E.w6REx1 = {
    id: 'w6-r-ex1', title: 'Exercise 1: one sweep, or n − 1 sweeps', algo: true, slides: range('6R', 21, 24),
    html: String.raw`
<p>For every $n \ge 1$:</p>
<ol>
  <li><strong>Find a [[graph]] with $n$ [[vertex|vertices]] where [[bellman-ford|BF]] is done after a single iteration, ==regardless of the ordering of the [[edge|edges]]==</strong> {{6R21}}.<br>
  <em>Solution</em> {{6R22}}: we want all the shortest [[path|paths]] to consist of a single edge. This happens when all the vertices are [[adjacent]] to the <span class="nt">source</span>. For example, a <span class="nt">directed star</span>, in which $E = \{(s, v) \mid s \ne v\}$.</li>
  <li><strong>Find a graph with $n$ vertices where $n - 1$ iterations are essential in ==some== run of BF</strong> {{6R23}}.<br>
  <em>Solution</em> {{6R24}}: we want a path that contains $n - 1$ edges. Take the [[path-graph|path graph]] ("line"), with $s = v_1$ and the order of the edges $(v_{n-1}, v_n), \dots, (v_1, v_2)$.</li>
</ol>
<aside class="callout caution">
  <span class="callout-title">⚠️ The line must be directed</span>
  <p>{{6R24}} draws the line without arrows. For the order $(v_{n-1}, v_n), \dots, (v_1, v_2)$ to mean anything, the edges are directed from $v_i$ to $v_{i+1}$. {{added}}</p>
</aside>
<p>Why "some" run: in the line, [[sweep]] $i$ finds $v_{i+1}$ only, because each edge comes before the edge that would feed it. In the order $(v_1, v_2), \dots, (v_{n-1}, v_n)$, one sweep finds everything. {{added}}</p>
<p>Both examples with $n = 5$ and weight 1 on every edge (the slides give no weights) {{added}}:</p>
<div class="algo-mount" data-algo="bellmanFord" data-presets="g6R22,g6R24" data-preset="g6R24" data-modes="stop,full" data-mode="stop"></div>`,
  };

  E.w6RFW = {
    id: 'w6-r-fw', title: 'Floyd-Warshall in the recitation', recap: true, slides: ['6R25', '6R26'],
    html: String.raw`
<p>[[floyd-warshall|Floyd-Warshall]] {{6R25}}: the shortest [[path]] between ==every pair of [[vertex|vertices]]== ([[apsp|all-pair shortest path]]); supports [[graph|graphs]] with arbitrary weights. Taught in <a href="#e-w6-fw">the lecture</a>.</p>
<div class="box theorem">
  <span class="box-label">Two lemmas {{6R26}}</span>
  <ul>
    <li><strong>Lemma:</strong> if there are no [[negative-cycle|negative cycles]], $\delta^n(i, j) = d(i, j)$.</li>
    <li><strong>Lemma:</strong> there exists a negative cycle ==iff== there exists $1 \le i \le n$ such that $\delta^n(i, i) < 0$.</li>
  </ul>
</div>
<p>The first lemma is the theorem of {{6L31}}. The second is the test of {{6L32}} for a negative [[cycle]], in both directions, for the last matrix $\delta^n$. {{added}}</p>`,
  };

  E.w6REx2 = {
    id: 'w6-r-ex2', title: 'Exercise 2: what a Floyd-Warshall run tells you', exercise: true, slides: range('6R', 27, 34),
    html: String.raw`
<p>$G$ is a [[directed-graph|directed graph]] with arbitrary weights on the [[edge|edges]] (but no [[negative-cycle|negative cycles]]), and $n > 10$ [[vertex|vertices]]. During an execution of the [[floyd-warshall|Floyd-Warshall]] algorithm, there exists a pair of vertices $i, j$ for which the value of $\delta(i, j)$ ==decreases for the first time== (from $\infty$ to some finite value) when $\delta^6(i, j)$ is calculated. Also, ==$\delta^n(i, j) = \delta^6(i, j)$== {{6R27}}. True or false?</p>
<ol>
  <li>Every shortest [[path]] from $i$ to $j$ passes only in $\{1, 2, 3, 4, 5, 6\}$ as internal nodes. <strong>False</strong> {{6R28}}: it is possible, for example, that $i - 7 - j$ is another shortest path.</li>
  <li>There are at least 6 different shortest paths between $i$ and $j$. <strong>False</strong> {{6R30}}: for example, if there are only two edges, $i - 6$ and $6 - j$, in the [[graph]].</li>
  <li>There exists a shortest path from $i$ to $j$ that passes only in $\{1, \dots, 6\}$ as internal nodes. <strong>True</strong> {{6R32}}: because $\delta^n(i, j) = \delta^6(i, j)$.</li>
  <li>There is no path from $i$ to $j$ that passes only in $\{1, \dots, 5\}$ as internal nodes. <strong>True</strong> {{6R34}}: as otherwise the value of $\delta(i, j)$ would be finite before $\delta^6(i, j)$ is calculated.</li>
</ol>
<p>The questions are on {{6R29}}, {{6R31}} and {{6R33}} too. In the exercise, each claim is judged on a graph that satisfies the premise: the counterexamples of {{6R28}} and {{6R30}}, built with $n = 11$, $i$ = vertex 10, $j$ = vertex 11 and weight 1 on every edge (==added==). The row of [[delta-k|$\delta^k(i, j)$]] values is computed by Floyd-Warshall. {{added}}</p>
<div class="ex-mount" data-ex="fwClaims"></div>`,
  };

  E.w6REx3 = {
    id: 'w6-r-ex3', title: 'Exercise 3: the tax on odd paths, with three copies', algo: true, slides: range('6R', 35, 44),
    html: String.raw`
<div class="box definition">
  <span class="box-label">Exercise 3 {{6R35}}</span>
  <p>Let $G = (V, E)$ be a [[directed-graph|directed graph]] with ==non-negative== costs on the [[edge|edges]]. Let $s \in V$ be a <span class="nt">source</span> [[vertex]]. According to a new tax rule, ==the cost of the last edge in any [[path]] consisting of an odd number of edges is doubled==.</p>
  <p>Suggest an efficient algorithm for computing, for every $v \in V$, the cheapest path from $s$ to $v$, considering the above tax rule. Describe the algorithm, justify its correctness, and analyze its time complexity.</p>
</div>
<p><strong>For example</strong> {{6R36}}: in the given [[graph]], $d(s,s) = 0$, $d(s,a) = 2$, $d(s,b) = 2$, $d(s,c) = 8$. The cheapest path to the nodes $a$ and $c$ is affected by the tax. The cost of the path $s - a - b - c$ is 12. Remember: the tax is applied ==only on paths consisting of an odd number of edges==.</p>
<aside class="callout caution">
  <span class="callout-title">Solution? WRONG {{6R37}}</span>
  <p>"Find a shortest path, then check whether it has an odd number of edges (backtrack to $s$ using the parent field to check it), and if yes, add the cost of the last edge." For the graph of {{6R37}} and a path $s - t$: this algorithm will return 6, but the correct answer is 4. See also node $c$ in the previous example. ==We must also check a candidate path with an even number of edges.==</p>
</aside>
<div class="box definition">
  <span class="box-label">Solution {{6R38}} {{6R40}}</span>
  <ol>
    <li>Construct the graph $G' = (V', E')$. $V' = V^0 \cup V^1 \cup V^2$, where each of $V^0, V^1, V^2$ is a copy of $V$. $E' = \{(v^0, u^1), (v^1, u^0) \mid (v, u) \in E\} \cup \{(v^0, u^2) \mid (v, u) \in E\}$. The weights of edges between the first two copies (of type $(v^0, u^1)$ and $(v^1, u^0)$) are as in the original graph. The weight of edges from the first to the third copy (of type $(v^0, u^2)$) is ==$2 \times$ the original weights==.</li>
    <li>Run [[dijkstra|Dijkstra]] on $G'$ from the vertex $s^0$ as a <span class="nt">source</span>.</li>
    <li>Return, for each vertex $v$, the minimum of $\{d(s^0, v^0), d(s^0, v^2)\}$.</li>
  </ol>
</div>
<p>{{6R39}} draws $G'$ as three blobs $V^1 \leftrightarrows V^0 \to V^2$: $w'(e) = w(e)$ on the arrows between $V^1$ and $V^0$, and $w'(e) = 2w(e)$ on the arrow into $V^2$. This is [[graph-replication|graph replication]]: a path in $V^0$ has used an even number of edges, in $V^1$ an odd number, and $V^2$ is reached by an odd-numbered ==last== edge. {{added}}</p>
<p>The animation runs Dijkstra on $G'$ built from the graph of {{6R36}}, laid out as $V^1 \mid V^0 \mid V^2$ ({{added}}: the slides draw no $G'$ for this graph). It ends with $d(s^0, c^0) = 8$ (the even path $s - b - c$) and $d(s^0, c^2) = 12$ (the odd path $s - a - b - c$ with the tax), so $c$ gets $\min\{8, 12\} = 8$, as {{6R36}} says.</p>
<div class="algo-mount" data-algo="dijkstra" data-presets="g6R39" data-preset="g6R39"></div>
<div class="box theorem">
  <span class="box-label">Correctness {{6R41}}</span>
  <p><strong>Main claim:</strong></p>
  <ol>
    <li>There is a path $p'$ in $G'$ from $s^0$ to $v^0$ of cost $c$ ==iff== there is a path $p$ in $G$ from $s$ to $v$ having an ==even== number of edges and cost $c$.</li>
    <li>There is a path $p'$ in $G'$ from $s^0$ to $v^2$ of cost $c$ ==iff== there is a path $p$ in $G$ from $s$ to $v$ having an ==odd== number of edges and <dfn data-term="taxed-cost">taxed-cost</dfn> $c$.</li>
  </ol>
</div>
<details class="proof" open><summary>Proof of 2 (1 is simpler) {{6R42}}</summary>
<p>Let $p'$ be a path in $G'$ from $s^0$ to $v^2$. By the construction, there are no internal edges in $V^2$; thus, edges from $V^0$ to $V^2$ can only be used as a last edge in a path, and only after a prefix of an even number of edges. Therefore $p'$ has an odd number of edges.</p>
<p>By the construction, the edges of $p'$ correspond to edges of a path $p$ from $s$ to $v$ in $G$ passing in the same vertices. The last edge of $p'$ corresponds to the last edge in $p$, and its cost in $G'$ is doubled; therefore the cost of $p'$ is the taxed-cost of $p$.</p>
</details>
<p><strong>Correctness (cont.)</strong> {{6R43}}: therefore, $d(s^0, v^0)$ is the shortest path from $s$ to $v$ consisting of an even number of edges, while $d(s^0, v^2)$ is the shortest path from $s$ to $v$ using an odd number of edges, with a double-cost last edge.</p>
<div class="box theorem">
  <span class="box-label">Time complexity {{6R44}}</span>
  <ol>
    <li>Building $G'$: $|V'| = 3|V|$, $|E'| = 3|E|$. Therefore, the size of $G'$ is $O(|V| + |E|)$.</li>
    <li>Running Dijkstra on a graph with $3n$ vertices and $3m$ edges: $O(m + n\log n)$ (it is OK to write $O((n + m)\log n)$ or $O(n^2)$).</li>
    <li>Calculating $\min\{d(s^0, v^0), d(s^0, v^2)\}$ and the output take $O(n)$ additional time.</li>
  </ol>
  <p>All together: ==$O(m + n\log n)$==.</p>
</div>
<div class="ex-mount" data-ex="taxPath"></div>`,
  };

  E.w6REx4 = {
    id: 'w6-r-ex4', title: 'Exercise 4: BFS and DFS trees, true or false', exercise: true, slides: range('6R', 45, 48),
    html: String.raw`
<ol>
  <li><strong>Let $G$ be an [[undirected-graph|undirected graph]]. If there exists a single [[bfs-tree|BFS tree]] rooted at $s$, then $G$ contains no [[cycle|cycles]].</strong> {{6R45}}<br>
  ==False== {{6R46}}. For example, a [[simple-cycle|simple cycle]] of length 3.</li>
  <li><strong>Let $G$ be an undirected [[graph]]. We perform [[dfs|DFS]](s) followed by [[bfs|BFS]](s), where ==the same data structure is used in both runs==. Let $u$ be some [[vertex]] in $G$. If $u$ is a [[leaf]] in the DFS [[tree]], then it must be a leaf in the BFS tree.</strong> {{6R47}}<br>
  ==False== {{6R48}}. In the slide's graph, $B$ is a leaf in DFS(s), but not a leaf in BFS(s).</li>
</ol>
<p>Why the triangle: from $s$, BFS finds both other vertices in the first layer, whatever the order of the lists, so it always builds the same tree; yet the three [[edge|edges]] form a cycle. On {{6R48}}, DFS(s) numbers the vertices $S, A, C, D, B$ and goes around the cycle, so $B$ comes last, with no child; BFS(s) numbers them $S, A, B, C, D$, and $D$ is found from $B$. {{added}}</p>
<div class="ex-mount" data-ex="spClaims" data-graphs="6R46,6R48"></div>`,
  };

  E.w6REx5 = {
    id: 'w6-r-ex5', title: 'Exercise 5: complete the missing weights', exercise: true, slides: ['6R49', '6R50'],
    html: String.raw`
<p>Complete the missing [[edge]] weights so that the resulting weighted [[graph]] has ==no [[negative-cycle|negative cycles]]==, and such that when running the [[floyd-warshall|Floyd-Warshall]] algorithm on it, the following holds: ==$\delta^5(2,3) < \delta^4(2,3) < \delta^1(2,3)$== {{6R49}}. The missing weights are $w(1,3)$ and $w(5,4)$.</p>
<div class="box theorem">
  <span class="box-label">Solution {{6R50}}</span>
  <ul>
    <li>In order to get $\delta^4(2,3) < \delta^1(2,3)$ we need that $2 + 8 < -3 + w(1,3)$.</li>
    <li>In order to get $\delta^5(2,3) < \delta^4(2,3)$ we need that $-2 + w(5,4) + 8 < 2 + 8$.</li>
    <li>The [[cycle]] $1-5-4-3-2-1$ must not be negative, so we need that $w(5,4) > -5$.</li>
    <li>The cycle $5-4-3-2-5$ must not be negative, so we need that $w(5,4) > -11$.</li>
    <li>The cycle $1-3-2-1$ must not be negative, so we need that $w(1,3) > 4$.</li>
  </ul>
  <p>For example: ==$w(1,3) = 14$, $w(5,4) = -4$==.</p>
</div>
<p>Where the numbers come from: [[delta-k|$\delta^1(2,3)$]] may pass only through 1, so it is the [[path]] $2 - 1 - 3$, of weight $-3 + w(1,3)$. $\delta^4$ adds $2 - 4 - 3$, of weight $2 + 8$. $\delta^5$ adds $2 - 1 - 5 - 4 - 3$, of weight $-3 + 1 + w(5,4) + 8$ (the slide's $-2$ is $-3 + 1$). {{added}}</p>
<aside class="callout caution">
  <span class="callout-title">⚠️ "&gt;" should be "≥" in the cycle conditions</span>
  <p>A cycle of weight exactly 0 is not negative. So "must not be negative" gives $w(5,4) \ge -5$ and $w(1,3) \ge 4$, not $>$. The answer does not change: the first condition already needs $w(1,3) > 13$. In all, the weights that work are exactly ==$w(1,3) \ge 14$ and $-5 \le w(5,4) \le 3$== among whole numbers (computed for $w(1,3)$ from 0 to 20 and $w(5,4)$ from −12 to 8). {{added}}</p>
</aside>
<div class="ex-mount" data-ex="fwWeights"></div>
<p>The slide's answer, run through Floyd-Warshall: $\delta^1(2,3) = 11$, $\delta^4(2,3) = 10$, $\delta^5(2,3) = 2$. {{added}}</p>
<div class="algo-mount" data-algo="floydWarshall" data-presets="g50" data-preset="g50"></div>`,
  };
})();
