/* Part A: Lecture 4 entries (order is set in week.js). */
window.E = window.E || {};

(function () {
  const range = (deck, from, to) => Array.from({ length: to - from + 1 }, (_, i) => `${deck}${from + i}`);

  E.w4Review = {
    id: 'w4-review', title: 'Review of Lecture 3', recap: true, slides: range('4L', 2, 8), checklist: ['w4c1'],
    html: String.raw`
<p>Lecture 4 opens by reviewing Lecture 3. Everything here was already taught in Week 3.</p>
<ul>
  <li>A [[hamiltonian-path|Hamilton path]] ([[hamiltonian-cycle|cycle]]) visits every [[vertex|node]] exactly once: a [[simple-path|simple path]] (or cycle) of length $n-1$ (or $n$). No efficient ([[polynomial-time|poly-time]]) algorithm is known. Sufficient conditions: Dirac and Ore for [[undirected-graph|undirected graphs]], and the [[tournament-graph|tournament]] for directed ones, drawn as $T_5$, $T_6$, $T_7$ {{4L2}}.</li>
  <li>An undirected [[graph]] is a [[tree]] if it is connected and contains no [[cycle|cycles]]. A [[directed-graph|directed graph]] is a [[directed-tree|tree]] if it has a [[root]] and its [[underlying-graph|underlying undirected graph]] is a tree. The slide draws one of each, the directed one with root $D$; we proved several equivalent conditions {{4L3}}.</li>
  <li>[[spanning-tree|Spanning tree]]: for an undirected [[connected|connected graph]] $G = (V, E)$, a set $E' \subseteq E$ such that $(V, E')$ is a tree {{4L4}}.</li>
  <li>[[dfs|DFS]], the recursive marking algorithm, with the [[adjacency-list|adjacency lists]] and the array $M$ of the lecture graph {{4L5}}. Initially every vertex is unmarked. <code>DFS(i: vertex): mark i; for each j adjacent to i do if j is unmarked then DFS(j)</code> ([[adjacent]]). Whenever a node $u$ detects an unmarked neighbor $v$, the [[edge]] $(u, v)$ is added to $E'$, and $(V, E')$ is connected and cycle-free {{4L6}}.</li>
  <li>Time with adjacency lists {{4L7}}: initializing the Mark array is $O(|V|)$. Every node considers all its neighbors, each in $O(1)$: all together the sum of [[degree|degrees]], $O(|E|)$. Another view: every edge is considered twice, once from each endpoint, $O(1)$ per consideration. Total $O(|V| + |E|)$. Space: $O(|V| + |E|)$ for the adjacency lists and the Mark array, and $O(|V|)$ for the recursion stack. In a connected graph $|E| \ge |V| - 1$, so $|E| + |V| \le 2|E| + 1$ and $O(|V| + |E|) = O(|E|)$.</li>
</ul>
<div class="box definition">
  <span class="box-label">Remark {{4L6}}</span>
  <p>For an unconnected graph, by running DFS on every component, we get a <dfn data-term="spanning-forest">spanning forest</dfn> of $G$.</p>
</div>
<p>DFS can do anything that requires touring the whole graph {{4L8}}: it can be used to ==check connectivity== (the slide asks how), and to solve mazes. The lecture did DFS in undirected graphs. The recitation does DFS for directed graphs, whose applications include computing [[scc|strongly connected components]] and [[topo-sort|topological sort]] {{4L8}}.</p>
<aside class="callout intuition">
  <span class="callout-title">Checking connectivity</span>
  <p>One answer to "how?": run DFS from any vertex. The graph is connected exactly when every vertex ends up marked. {{added}}</p>
</aside>`,
  };

  E.w4BFS = {
    id: 'w4-bfs', title: 'Breadth First Search (BFS)', algo: true, slides: range('4L', 10, 23), checklist: ['w4c2', 'w4c3'],
    html: String.raw`
<div class="box definition">
  <span class="box-label">Algorithm: spanning tree using BFS {{4L10}}</span>
  <p><dfn data-term="bfs">Breadth First Search (BFS)</dfn> builds a [[spanning-tree|spanning tree]] $E'$ with a ==queue== $Q$, going over the [[adjacent]] vertices of each vertex it takes out. The [[vertex]] $s$ is an arbitrary node, to be the [[root]].</p>
  <pre class="code-block">Initialize E'=∅;
Initialize Q to be empty;
Enqueue(Q, s) and mark s;
while (Q is not empty) do
    i ←Dequeue(Q);
    for each j adjacent to i do
        if j is not marked then
            add (i,j) to E';
            mark j;
            Enqueue(Q, j);</pre>
</div>
<p>A queue is first in, first out: Enqueue adds at the back and Dequeue takes from the front. {{added}} Compare with [[dfs|DFS]], which goes deep first along the [[running-stack|running stack]]: BFS handles ==all the neighbors of $i$ before it moves on==, so the [[graph]] is explored in layers around $s$. {{added}}</p>
<p>The run of {{4L11}} to {{4L23}} uses the lecture graph and [[adjacency-list|adjacency lists]] of Week 3 ({{3L49}}), with the marking array $M$. Starting at $1$, the queue becomes $2, 6, 7, 8$ {{4L12}}; $2$ adds $3$ and $5$ {{4L14}}; $7$ adds $4$ {{4L18}}; and the queue empties {{4L23}}. The [[tree]] [[edge|edges]] are $(1,2), (1,6), (1,7), (1,8), (2,3), (2,5), (7,4)$.</p>
<aside class="callout intuition">
  <span class="callout-title">Stack → deep tree, queue → shallow tree</span>
  <p>[[dfs|DFS]] always continues from the vertex it ==discovered last== (the top of the [[running-stack|recursion stack]]), so it keeps extending one long [[path]] and the [[spanning-tree|spanning tree]] comes out deep. BFS continues from the vertex it ==discovered first== (the front of the queue), so every vertex is attached to the closest vertex that can reach it, and the tree stays shallow: its depth is the largest distance from $s$, as the next cards prove. {{added}}</p>
</aside>
<div class="algo-mount" data-algo="bfs"></div>
<aside class="callout caution">
  <span class="callout-title">Why the queue does not change on 4L16</span>
  <p>{{4L15}} shows $6$ just dequeued, and {{4L16}} shows its list scanned, like the pairs {{4L13}}/{{4L14}} and {{4L17}}/{{4L18}}. Both neighbors of $6$, $1$ and $7$, are already marked, so the queue and $M$ stay the same. {{added}}</p>
</aside>`,
  };

  E.w4BFSHand = {
    id: 'w4-bfs-hand', title: 'You are the BFS', exercise: true, slides: ['4L11'], checklist: ['w4c2'],
    html: String.raw`
<p>Run [[bfs|BFS]] by hand on the [[graph]] of {{4L11}}. Follow its [[adjacency-list|adjacency lists]], or switch to any order: "for each $j$ [[adjacent]] to $i$" {{4L10}} does not fix one. The recitation graph of {{4R51}} is there too.</p>
<div class="ex-mount" data-ex="bfsByHand"></div>`,
  };

  E.w4BFSComplexity = {
    id: 'w4-bfs-complexity', title: 'Complexity of BFS with adjacency lists', slides: ['4L24'], checklist: ['w4c1'],
    html: String.raw`
<div class="box theorem">
  <span class="box-label">Time {{4L24}}</span>
  <p><strong>Initialization:</strong> $O(n)$.</p>
  <p>During the algorithm, ==every [[vertex]] is active once==. The iteration in which $v$ is active takes $O(\text{degree}(v))$, its [[degree]]. All together: $O(m)$.</p>
  <p><strong>Total: $O(n + m)$.</strong> Assuming that the [[graph]] is connected, $O(n + m) = O(m)$, since $m \ge n - 1$.</p>
</div>
<div class="box theorem">
  <span class="box-label">Space {{4L24}}</span>
  <p>The graph: $O(n + m)$. Running queue: $O(n)$. Total: $O(n + m) = O(m)$ assuming $G$ is connected.</p>
</div>
<p>The same bounds as [[dfs|DFS]] with [[adjacency-list|adjacency lists]], where the recursion stack takes the place of the queue {{3L74}}. "All together $O(m)$" is the [[handshaking|Handshaking Theorem]]: the degrees add up to $2m$. {{added}}</p>`,
  };

  E.w4Shortest = {
    id: 'w4-shortest', title: 'The shortest-path problem', slides: ['4L25'], checklist: ['w4c9'],
    html: String.raw`
<p><strong>Scenario {{4L25}}:</strong> one router creates messages. Each message needs to reach other routers (one or more) along the shortest possible [[path]].</p>
<div class="box definition">
  <span class="box-label">Abstraction {{4L25}}</span>
  <p>Given a [[vertex]] $s$, find the shortest path from $s$ to any other vertex of $G$. The path's length is the ==number of [[edge|edges]]== in the path ([[path-length|length of the path]]).</p>
  <p>For a node $v$, the length of a shortest path from $s$ to $v$ is denoted $d(s, v)$: the <dfn data-term="distance">distance</dfn> from $s$ to $v$.</p>
</div>
<p>Other shortest path problems are coming ("stay tuned") {{4L25}}: edges with different weights (length, delay, cost, etc.), and the all-pair shortest path problem, with no specific start.</p>`,
  };

  E.w4BFSShortest = {
    id: 'w4-bfs-shortest', title: 'BFS for shortest path', algo: true, slides: range('4L', 26, 31), checklist: ['w4c5'],
    html: String.raw`
<p>[[bfs|BFS]], which builds a [[spanning-tree|spanning tree]] ([[tree]]) of [[adjacent]] steps, solves the problem: it ==[[label|labels]] every [[vertex]] with its [[distance]] from $s$==. First a "centralized" version {{4L26}}, which finds the vertices layer by layer:</p>
<pre class="code-block">1. Label vertex s with 0.
2. i ← 0
3. Find all unlabeled vertices adjacent to at least one vertex labeled i.
   If none are found, stop.
4. Label all the vertices found in (3) with i + 1.
5. i ← i + 1 and go to (3).</pre>
<p>On the [[graph]] of {{4L27}}, the vertices whose distance from $s$ is $0$, then $1$, $2$, $3$ are labeled {{4L27}} {{4L28}} {{4L29}} {{4L30}}. In the next iteration the whole graph is labeled and we stop {{4L30}}. The vertices have no names on the slides, so they get letters here. {{added}}</p>
<div class="box definition">
  <span class="box-label">The implementation {{4L31}}</span>
  <p>The centralized version is for simplification only. ==When implemented, we need the queue as before==. The arrow on the slide marks the line <u>label(j) ← label(i) + 1</u> as the addition to the spanning tree algorithm. The code also starts with label(s)=0 instead of "mark s", tests "not labeled" instead of "not marked", and has no "mark j".</p>
  <pre class="code-block">Initialize E' to be empty;
Initialize Q to be empty;
Enqueue(Q, s) and label(s)=0;
while (Q is not empty) do
    i ←Dequeue(Q);
    for each j adjacent to i do
        if j is not labeled then
            add (i,j) to E';
            label(j) ←label(i) + 1;
            Enqueue(Q, j);</pre>
</div>
<p>Switch between the two versions above the animation. Both end with the same labels. The order of the [[adjacency-list|adjacency lists]] is not on the slides: it is chosen so that the queue version discovers each vertex from the same neighbor as {{4L38}}. {{added}}</p>
<div class="algo-mount" data-algo="bfsShortest"></div>`,
  };

  E.w4LabelEx = {
    id: 'w4-label-ex', title: 'Label the distances', exercise: true, slides: ['4L27', '4L30', '4R71'], checklist: ['w4c5'],
    html: String.raw`
<p>[[label|Label]] each [[vertex]] with its [[distance]] from the start, as [[bfs|BFS]] does. The answers are on {{4L30}} and {{4R71}}, and they are computed here from the [[graph]]. Each check shows a shortest [[path]].</p>
<div class="ex-mount" data-ex="labelDistances"></div>`,
  };

  E.w4BFSProof = {
    id: 'w4-bfs-proof', title: 'Why the labels are the distances', slides: range('4L', 32, 37), checklist: ['w4c4', 'w4c5'],
    html: String.raw`
<div class="box theorem">
  <span class="box-label">Theorem {{4L32}}</span>
  <p>Each [[vertex]] is [[label|labeled]] by its [[distance]] from $s$.</p>
</div>
<details class="proof" open><summary>Proof {{4L32}} {{4L33}} {{4L34}}</summary>
<p>We show ==by induction on $k$== that $\text{label}(v) = k$ ==iff== $d(s, v) = k$.</p>
<p><strong>Base case:</strong> $k = 0$. The only node labeled $0$ is $s$, and indeed $d(s, s) = 0$.</p>
<p><strong>Step:</strong> assume the claim is valid for all $l < k$ and prove it for $k$.</p>
<p><strong>⇐ Assume $d(s, v) = k$.</strong> We show that $v$ would be labeled $k$ {{4L33}}. Let $s - v_1 - \dots - u - v$ be a shortest [[path]] from $s$ to $v$. It must be that $s - v_1 - \dots - u$ is a shortest path from $s$ to $u$, as otherwise it is possible to shorten the shortest path to $v$. By the induction hypothesis, $\text{label}(u) = k - 1$. In the iteration in which $u$ is active, it will consider $v$, and $\text{label}(v)$ will be determined to be $k - 1 + 1 = k$. This label will not change later. It is not possible that $v$ is labeled already by a label less than $k$, because, by the induction hypothesis, it would mean that $d(s, v) < k$.</p>
<p><strong>⇒ Assume $\text{label}(v) = k$.</strong> We show that $d(s, v) = k$ {{4L34}}. $v$ is labeled $k$ by some neighbor $u$ for which $\text{label}(u) = k - 1$. By the induction hypothesis, $d(s, u) = k - 1$. Together with the [[edge]] $(u, v)$ we have a path of length $k$ from $s$ to $v$. Thus $d(s, v) \le k$. In addition, $d(s, v) \ge k$, since if it were less than $k$, then by the induction hypothesis, $v$ was supposed to be marked already.</p>
</details>
<p>{{4L35}}, {{4L36}} and {{4L37}} give the same proof in Hebrew.</p>
<aside class="callout caution">
  <span class="callout-title">⚠️ "It will consider v and label it k"</span>
  <p>The English {{4L33}} omits a condition: $u$ labels $v$ only ==if $v$ is <u>not labeled yet</u>==. The Hebrew version on {{4L36}} says so ("if it is not labeled yet"). $v$ may already have been labeled $k$ by another neighbor with label $k - 1$ that was dequeued before $u$. Either way its label is $k$. {{added}}</p>
</aside>`,
  };

  E.w4BFSTree = {
    id: 'w4-bfs-tree', title: 'The directed BFS tree', slides: ['4L38'], checklist: ['w4c5'],
    html: String.raw`
<div class="box definition">
  <span class="box-label">Definition {{4L38}}</span>
  <p>For any $v \ne s$, let $p(v)$ be the [[vertex]] that "discovered" $v$ in [[bfs|BFS]]. The <dfn data-term="bfs-tree">directed BFS tree</dfn> is $T = \{(p(v), v)\}$.</p>
  <p>$T$ is a [[directed-tree|directed spanning tree]] rooted in $s$, and ==for each vertex $v$, the [[path]] from $s$ to $v$ in $T$ is a shortest path from $s$ to $v$ in $G$==.</p>
</div>
<p><strong>Why a directed [[tree]]?</strong> {{4L38}} $s$ is a [[root]]. $d_{in}(s) = 0$, and for every other vertex $v$, $d_{in}(v) = 1$: its one incoming [[edge]] is $(p(v), v)$.</p>
<p>The shortest paths follow from the theorem: along $T$, every step goes from label $k - 1$ to label $k$, so the path to $v$ has as many edges as its [[label]], which is its [[distance]] $d(s, v)$. {{added}}</p>
<p>The [[graph]] is the one of {{4L30}}. In the animation of the previous cards, $T$ is the set $E'$. {{added}}</p>`,
  };

  E.w4Weighted = {
    id: 'w4-weighted', title: 'Weighted graphs: single-source shortest paths', slides: range('4L', 39, 42), checklist: ['w4c8', 'w4c9'],
    html: String.raw`
<p>Using [[bfs|BFS]], we solved the problem assuming all [[edge|edges]] have unit length {{4L39}}. A more practical setting: ==edges are not uniform==. There are tons of applications.</p>
<div class="box definition">
  <span class="box-label">Definition {{4L40}}</span>
  <p>Assume each edge $(u, v)$ has non-negative weight $w(u, v)$. The weight reflects the cost of using this edge: distance (km), cost (dollars), delay (minutes), resource consumption, risk and more.</p>
  <p>The <dfn data-term="path-weight">weight of a path</dfn> is the total of the weights of all edges on the [[path]].</p>
  <p><dfn data-term="sssp">Single-source shortest paths</dfn>. <strong>Input:</strong> a [[graph]] $G = (V, E)$, a weight function $w: E \to R$, and a [[vertex]] $s \in V$. <strong>Output:</strong> for each vertex $v \in V$, $d(s, v)$, the length of a shortest path from $s$ to $v$ ($v$'s [[distance]] from $s$).</p>
</div>
<div class="box definition">
  <span class="box-label">Weighted directed graphs {{4L41}}</span>
  <p>The distance from $s$ to $t$ is the length of the shortest path ==according to weight== connecting them, denoted $d(s, t)$.</p>
  <p>Example: the distance from $s$ to $t$ is $6$, and the shortest path is $s - b - d - c - t$. There are other paths from $s$ to $t$, whose weights are $7$ ($s - a - t$) and $8$ ($s - c - t$).</p>
</div>
<div class="box definition">
  <span class="box-label">Assumptions {{4L42}}</span>
  <ul>
    <li>The input graph is ==[[directed-graph|directed]]==. All the algorithms can be adapted to [[undirected-graph|undirected graphs]] by replacing each edge $e = (u, v)$ by two <dfn data-term="anti-parallel">anti-parallel edges</dfn> $(u, v)$ and $(v, u)$, both having weight $w(e)$. The time complexity remains the same.</li>
    <li>The input graph is ==[[simple-digraph|simple]]==. If there are [[parallel-edges|parallel edges]], all but the cheapest one can be removed. If there is a [[self-loop]], it can be removed, or, <u>if it is negative, no solution exists</u>.</li>
  </ul>
  <p>The drawings: an undirected edge of weight 8 becomes two anti-parallel edges of weight 8; a self-loop of weight 3 plus parallel edges of weights 8, 12 and 5 become the single edge of weight 5.</p>
</div>
<aside class="callout caution">
  <span class="callout-title">⚠️ Non-negative, but the example has −2</span>
  <p>{{4L40}} assumes ==non-negative== weights, yet the example on {{4L41}} has the edge $(d, c)$ of weight $-2$, and {{4L40}}'s own input is $w: E \to R$. The example's numbers are right: $2 + 3 - 2 + 3 = 6$. The general method on the next cards does not need the assumption; a negative [[cycle]] would leave no solution, like the negative self-loop of {{4L42}}. {{added}}</p>
</aside>`,
  };

  E.w4WeightedEx = {
    id: 'w4-weighted-ex', title: 'Find the shortest path from s to t', exercise: true, slides: ['4L41'], checklist: ['w4c9'],
    html: String.raw`
<p>Find a shortest [[path]] from $s$ to $t$ on the [[graph]] of {{4L41}}, following the arrows. The [[path-weight|weight of the path]] is added up as you go, and the [[distance]] it is compared with is computed.</p>
<div class="ex-mount" data-ex="weightedPath"></div>`,
  };

  E.w4DistFacts = {
    id: 'w4-dist-facts', title: 'Properties of distances', slides: ['4L43'], checklist: ['w4c4'],
    html: String.raw`
<div class="box theorem">
  <span class="box-label">Fact 1 {{4L43}}</span>
  <p>For every [[edge]] $(u, v)$: $\quad d(s, v) \le d(s, u) + w(u, v)$.</p>
</div>
<div class="box theorem">
  <span class="box-label">Fact 2 {{4L43}}</span>
  <p>For every $v$ ==(except $s$)== there exists a [[vertex]] $u$ such that $\quad d(s, v) = d(s, u) + w(u, v)$.</p>
</div>
<p>In the example of {{4L43}}, three edges enter $v$: $d(s, v) \le 20 + 10$ through $u$, $d(s, v) \le 22 + 3$ through $w$, and $d(s, v) = 10 + 11$ through $z$. Fact 1 is a bound for every edge; Fact 2 says ==one of them is tight==.</p>
<aside class="callout intuition">
  <span class="callout-title">Why they hold</span>
  <p>Fact 1: a shortest [[path]] to $u$ followed by $(u, v)$ is a path to $v$ of [[path-weight|weight]] $d(s, u) + w(u, v)$, and the shortest one is no heavier. Fact 2: take $u$ to be the vertex just before $v$ on a shortest path to $v$. Its part up to $u$ must be a shortest path to $u$, the same argument as {{4L33}}. {{added}}</p>
</aside>`,
  };

  E.w4General = {
    id: 'w4-general', title: 'The general method: relax', algo: true, exercise: true, slides: ['4L44', '4L45'], checklist: ['w4c10', 'w4c11', 'w4c12'],
    html: String.raw`
<div class="box definition">
  <span class="box-label">The general method {{4L44}}</span>
  <pre class="code-block">Init:                       Main loop:
s.d ← 0                       repeat
s.π ← null                       choose an edge (u,v)
for all other v:                 relax(u,v)
   v.d ← infinity
   v.π ← null               relax(u,v):   (u,v)∈E
                               if v.d > u.d + w(u,v) :
                                  v.d ← u.d + w(u,v)
                                  v.π ← u</pre>
  <p>$v.d$ is the length of the shortest [[path]] detected so far. $v.\pi$ is the <dfn data-term="predecessor">predecessor</dfn> of $v$ (its parent).</p>
  <p><dfn data-term="relax">relax(u, v)</dfn> asks whether going to $v$ ==through $u$== is shorter than the best path known so far. If it is, $v.d$ and $v.\pi$ are updated.</p>
</div>
<div class="box theorem">
  <span class="box-label">Properties of this method {{4L45}}</span>
  <p>Any algorithm of this type satisfies:</p>
  <ol>
    <li>For each $v$, the value $v.d$ is monotonically decreasing during the execution of the algorithm.</li>
    <li>For each $v$, at any time during the run of the algorithm, ==$v.d \ge d(s, v)$==.</li>
    <li>Let $u$ be the last [[vertex]] on a shortest path from $s$ to $v$. If at some point $u.d = d(s, u)$ is true, and then $\text{relax}(u, v)$ is performed, then ==from this time on, $v.d = d(s, v)$ holds==.</li>
  </ol>
</div>
<p>The slide does not say which [[edge]] to choose. Here you make it: each click runs relax on that edge, with the code lit line by line. Try to reach the [[distance|distances]] with as few calls as you can. The second [[graph]] is the one of {{4L43}}. Its curved arrows from $s$ may stand for whole paths (like the wavy line of {{4L44}}); here each is treated as a single edge of that weight. {{added}}</p>
<div class="ex-mount" data-ex="relaxTool"></div>
<h3>Watch it run</h3>
<p>The same code, run by itself, with every line lit as it executes. The slide does not fix two things: which [[edge]] to choose, and when the repeat stops. The animation offers two choices, both {{added}}:</p>
<ul>
  <li><strong>All edges, round after round:</strong> go over the edges in a fixed order, again and again, and ==stop after a round in which no relax changed anything==. {{added}} On the [[graph]] of {{4L41}}, $c.d$ drops from 5 to 3 only after $(c, t)$ was already relaxed, so $(c, t)$ must be relaxed again in round 2. {{added}}</li>
  <li><strong>Each edge once, in a good order:</strong> relax the edges out of a [[vertex]] only once that vertex has its final $d$. {{added}} Property 3 of {{4L45}} then gives every $v.d$ right after a single relax per edge, by induction along each shortest path. The order here is computed from the true distances, which the algorithm does not know in advance. {{added}}</li>
</ul>
<p>$v.d$ is written beside each vertex and in the <code>v.d</code> column; the thick edges are the pairs $(v.\pi, v)$.</p>
<div class="algo-mount" data-algo="relax"></div>
<aside class="callout caution">
  <span class="callout-title">⚠️ "Monotonically decreasing"</span>
  <p>Property 1 on {{4L45}} means $v.d$ ==never increases==. A relax call that changes nothing keeps $v.d$ the same, so "non-increasing" is the precise word. {{added}}</p>
</aside>
<aside class="callout intuition">
  <span class="callout-title">Why "last vertex" in property 3</span>
  <p>"The last vertex on a shortest path from $s$ to $v$" means the one just before $v$, as in Fact 2 of {{4L43}}. {{added}}</p>
</aside>`,
  };

  E.w4Path = {
    id: 'w4-path', title: 'path(v): retrieving a shortest path', algo: true, slides: ['4L46'], checklist: ['w4c10'],
    html: String.raw`
<div class="box definition">
  <span class="box-label">$v.\pi$ is used to retrieve a shortest path {{4L46}}</span>
  <pre class="code-block">path(v)
if v≠s :
   path(v.π)
print v</pre>
  <p><strong>Observation:</strong> once, for all $v \in V$, it holds that $v.d = d(s, v)$, the procedure $\text{path}(v)$ prints a shortest [[path]] from $s$ to $v$.</p>
</div>
<p>The [[predecessor|predecessors]] point backward, from $v$ toward $s$, so the recursion first walks back to $s$ and ==prints on the way out==, in the right order. On the chain of {{4L46}}, $c.\pi = b$, $b.\pi = a$, $a.\pi = s$, and $\text{path}(c)$ prints $s, a, b, c$. {{added}}</p>
<p>On the [[graph]] of {{4L41}}, the $\pi$ values are the ones [[relax|relax]] ends with (computed). {{added}} $\text{path}(t)$ prints $s, b, d, c, t$, the shortest path of {{4L41}}. The calls wait on the [[running-stack|running stack]]. {{added}}</p>
<div class="algo-mount" data-algo="pathPrint"></div>`,
  };
})();
