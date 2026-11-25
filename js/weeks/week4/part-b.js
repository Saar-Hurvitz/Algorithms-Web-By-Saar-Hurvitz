/* Part B: Recitation 4 entries (order is set in week.js).
   Concepts already taught in Part A are short recap cards with recap: true. */
window.E = window.E || {};

(function () {
  const range = (deck, from, to) => Array.from({ length: to - from + 1 }, (_, i) => `${deck}${from + i}`);

  E.w4RDFS = {
    id: 'w4-r-dfs', title: 'DFS of a directed graph', algo: true, slides: range('4R', 2, 31), checklist: ['w4c6', 'w4c7'],
    html: String.raw`
<p>Last week: [[tree|trees]] and [[dfs|DFS]] of [[undirected-graph|undirected graphs]] {{4R2}}. This week: DFS of [[directed-graph|directed graphs]], and [[bfs|BFS]] {{4R3}}.</p>
<div class="box definition">
  <span class="box-label">DFS of a directed graph {{4R4}}</span>
  <pre class="code-block">Algorithm 1 DFS(G)              Algorithm 2 DFS-Visit(G,v)
For each v ∈ V:                 mark v
    if v is unmarked then       For each u s.t. (v, u) ∈ E:
        DFS-Visit(G,v)              if u is unmarked then
                                        add (v, u) to the spanning tree
                                        DFS-Visit(G,u)</pre>
  <p>==Note: it can result in a forest and not a tree==. Complexity: $O(n + m)$.</p>
  <p>DFS-Visit follows the arrows of the [[graph]] only: from $v$ it goes to $u$ when $(v, u) \in E$. The [[edge|edges]] it adds form a [[spanning-tree|spanning tree]] of what it reaches, and the outer loop over all [[vertex|vertices]] starts a new tree whenever one is left unmarked. {{added}}</p>
</div>
<p>The run of {{4R6}} to {{4R30}} starts at $C$, which reaches $A$ and $B$. Then it needs to start from a ==new [[root]] among the unmarked vertices== {{4R12}}, which is $D$ {{4R13}}. The slides do not say why $C$ and then $D$; the animation uses that order, and the order of each list that reproduces the slides. {{added}} Each [[tree]] has its own color.</p>
<div class="algo-mount" data-algo="dfsDirected"></div>
<div class="box definition">
  <span class="box-label">DFS: resulting forest {{4R31}}</span>
  <p>The trees together are the <dfn data-term="dfs-forest">DFS forest</dfn>. The resulting forest is ==different for each initial root==: $DFS(D)$ produces a tree, and $DFS(H)$ may produce a forest with 3 trees.</p>
</div>
<aside class="callout caution">
  <span class="callout-title">⚠️ "Every tree contains all the vertices reachable from the root"</span>
  <p>{{4R31}} says so, but in its own forest $D$ reaches $C$, $A$ and $B$ ($D \to C \to A \to B$), and they are in the first tree, not in $D$'s. A tree contains all the vertices reachable from its root ==that were still unmarked when it started==. For the first tree, that is all of them. {{added}}</p>
</aside>`,
  };

  E.w4REx1 = {
    id: 'w4-r-ex1', title: 'Exercise 1: find a root in O(n+m)', algo: true, slides: range('4R', 32, 49), checklist: ['w4c7'],
    html: String.raw`
<div class="box definition">
  <span class="box-label">Exercise 1 {{4R32}}</span>
  <p>Definition: a [[root]] is a [[vertex]] with a directed [[path]] to every vertex in the [[graph]]. Given a [[directed-graph|directed graph]] $G = (V, E)$, suggest an algorithm that finds a root in time $O(n + m)$ or informs that no root exists. Prove the correctness and analyze the running time.</p>
</div>
<p><strong>Intuition {{4R33}}:</strong> if there is a root, [[dfs|DFS]](root) will result in a [[tree]]. The naive solution: for every vertex $v$, run $DFS(v)$. If $DFS(v)$ returns a tree, report $v$. If none returns a tree, report there is no root. Complexity $O(n(n + m))$. We will see a more efficient solution.</p>
<div class="box definition">
  <span class="box-label">Algorithm {{4R34}}</span>
  <ol>
    <li>Perform $DFS(v)$ on some random vertex.</li>
    <li>If we obtain a [[spanning-tree|spanning tree]], return $v$.</li>
    <li>Else, perform $DFS(r)$, where $r$ is the root of ==the last tree in the [[dfs-forest|DFS forest]]== obtained in (1).</li>
    <li>If we obtain a spanning tree, return $r$.</li>
    <li>Else, return "No root in G".</li>
  </ol>
</div>
<p>{{4R35}} draws the forest of step 1: trees $T_1, T_2, \dots, T_r$ with roots $v_1, v_2, \dots, v_r$. On the graph of {{4R5}}: from $v = D$ one tree spans everything {{4R36}}; from $v = H$ the forest has three trees {{4R39}} {{4R41}}, and the last root $r$ is $D$, which is a root {{4R43}} {{4R44}}. In step 1, "$DFS(v)$" is DFS(G) with $v$ first in the outer loop. {{added}}</p>
<div class="algo-mount" data-algo="findRoot"></div>
<div class="box theorem">
  <span class="box-label">Correctness {{4R45}} {{4R46}}</span>
  <p>If the algorithm returns some vertex as the root, it is indeed a root, since we obtain a spanning tree when performing DFS on that vertex. We need to show: if $r$, ==the only candidate root tested== by the algorithm, is not a root, then no other vertex is a root.</p>
  <p>Assume towards contradiction that the algorithm outputs "No root exists", while some vertex $w \ne r$ is a root. Consider two cases.</p>
  <p><strong>$w$ belongs to the tree rooted by $r$ {{4R47}}:</strong> there is a path from $r$ to $w$, and a path from $w$ to every other vertex. So there is a path from $r$ to every other vertex, through $w$: $r$ is a root, a contradiction.</p>
  <p><strong>$w$ does not belong to the tree rooted by $r$ {{4R48}}:</strong> since $r$ is the root of the last tree in the DFS forest, $w$ was marked before $r$. If $w$ is a root, then $r$ was supposed to be discovered and be part of the tree $w$ belongs to, a contradiction.</p>
</div>
<div class="box theorem">
  <span class="box-label">Complexity {{4R49}}</span>
  <p>We perform 2 DFS in the [[worst-case|worst case]]. Thus the running time is $2 \cdot O(m + n) = O(m + n)$.</p>
</div>
<aside class="callout caution">
  <span class="callout-title">⚠️ The step the second case skips</span>
  <p>On {{4R48}}, "r was supposed to be discovered" needs one more step: when $w$ was reached, some vertex on the path from $w$ to $r$ could already be marked. Take the ==first-marked vertex $x$ that has a path to $r$==. When $x$ is marked, every vertex on its path to $r$ is still unmarked (each of them also reaches $r$, and none was marked earlier), so DFS-Visit from $x$ reaches $r$ before it ends. $x$ is marked no later than $w$, so before $r$, so $r$ joins $x$'s tree, and it is not the root of a tree. {{added}}</p>
</aside>
<aside class="callout caution">
  <span class="callout-title">⚠️ Two different list orders</span>
  <p>With the names of {{4R5}} ($u$ is $C$): on {{4R41}} and {{4R43}}, the tree uses both [[edge|edges]] $C \to A$ and $C \to B$. On {{4R44}}, as on {{4R6}} to {{4R30}}, it uses $C \to A$ and then $A \to B$. No single order of the lists produces both pictures. The animation keeps the order of {{4R6}} to {{4R30}}. {{added}}</p>
</aside>
<p>Find the roots yourself. The answer is computed from the graph of {{4R5}}.</p>
<div class="ex-mount" data-ex="findRoots" data-graphs="4R5,3R6a,3R6b,3R6c"></div>`,
  };

  E.w4RBFS = {
    id: 'w4-r-bfs', title: 'BFS on the recitation graph', recap: true, algo: true, slides: range('4R', 50, 71), checklist: ['w4c2'],
    html: String.raw`
<p>The same [[bfs|BFS]] as in <a href="#e-w4-bfs">the lecture</a>, written as Algorithm 3 $BFS(G, v)$ with the tree $T$ {{4R50}}. Complexity: $O(n + m)$. The run of {{4R51}} to {{4R70}} starts at $A$, and the result is the [[tree]] of {{4R71}}.</p>
<aside class="callout caution">
  <span class="callout-title">⚠️ The numbers beside the vertices</span>
  <p>The slides write each [[vertex|vertex's]] [[distance]] beside it, ∞ until it is found. Algorithm 3 does not compute them: they are the [[label|labels]] of <a href="#e-w4-bfs-shortest">BFS for shortest path</a>, the length of a shortest [[path]], $\text{label}(w) = \text{label}(u) + 1$. The [[adjacency-list|list]] order is the one that reproduces the slides' queue. {{added}}</p>
</aside>
<div class="algo-mount" data-algo="bfsRecitation"></div>`,
  };

  E.w4REx2 = {
    id: 'w4-r-ex2', title: 'Exercise 2: the shortest even path', algo: true, exercise: true, slides: range('4R', 72, 79), checklist: [],
    html: String.raw`
<div class="box definition">
  <span class="box-label">Exercise 2 {{4R72}}</span>
  <p>Let $G(V, E)$ be an [[undirected-graph|undirected graph]], and let $s \in V$ be some [[vertex]] in $G$. Suggest a linear algorithm that finds, for every vertex $v \in V$, the shortest [[path]] from $s$ to $v$ ==consisting of an even number of edges==.</p>
</div>
<p><strong>Intuition {{4R73}}:</strong> we want to use [[bfs|BFS]], but need to make some changes. Important: if we make changes in BFS, ==we need to prove correctness and analyze complexity again==! Therefore we try to avoid modifying algorithms. Instead of changing the algorithm, we can change the input to the BFS algorithm.</p>
<div class="box definition">
  <span class="box-label">Definition {{4R73}}</span>
  <p><dfn data-term="reduction">Reduction</dfn>: solve a different problem and prove that solving the reduced problem is equivalent to solving the original problem.</p>
</div>
<div class="box definition">
  <span class="box-label">Algorithm {{4R74}} {{4R75}}</span>
  <ol>
    <li>Build the following [[bipartite]] [[graph]] $G' = (V', E')$:
      <ul>
        <li>for all $v \in V$, two copies in $G'$: $v^0, v^1 \in V'$;</li>
        <li>for all $(u, v) \in E$, two copies in $G'$: $(u^0, v^1) \in E'$ and $(u^1, v^0) \in E'$.</li>
      </ul></li>
    <li>Run $BFS(G', s^0)$.</li>
    <li>For all $v \in V$, return the [[label]] of $v^0$. It equals $d(s^0, v^0)$, the [[distance]].</li>
  </ol>
</div>
<p>Every [[edge]] of $G'$ ==switches sides== {{4R76}}, so a path in $G'$ that ends on the side it started on has an even number of edges. The animation builds $G'$ for the graph of {{4R74}}, then runs BFS.</p>
<div class="algo-mount" data-algo="evenPath"></div>
<div class="box theorem">
  <span class="box-label">Correctness {{4R76}} {{4R77}} {{4R78}}</span>
  <p>$G'$ is built such that every path from $V^i$ to $V^{1-i}$, $i \in \{0, 1\}$, corresponds to an odd path in $G$, and every path from $V^i$ to $V^i$ corresponds to an even path in $G$, and vice versa. This is true since all edges connect different sides of a bipartite graph. Also, every path in $G$ corresponds to a path in $G'$ that alternates between $V^0$ and $V^1$ {{4R76}}.</p>
  <p>To show that the problems are equivalent, we show that every path of even length in $G$ exists with the same length in $G'$, and vice versa {{4R77}}.</p>
  <p><strong>Claim:</strong> there exists a path $p$ of length $2k$ from $s$ to $v$ in $G$ ==if and only if== there exists a path $p'$ of length $2k$ from $s^0$ to $v^0$ in $G'$.</p>
  <p><strong>Proof ⇒ {{4R78}}:</strong> let $p = (v_0, v_1, \dots, v_{2k})$ be some path of even length in $G$. From the construction of $G'$, there exists the path $p' = (v_0^0, v_1^1, \dots, v_{2k}^0)$ in $G'$. The length does not change, and every edge from some $v_i$ to $v_{i+1}$ is present from $V^1$ to $V^0$ and vice versa. <strong>⇐</strong> Similar.</p>
</div>
<div class="box theorem">
  <span class="box-label">Complexity {{4R79}}</span>
  <p>Building the graph: $n' = 2n$, $m' = 2m$, so $O(m + n)$. BFS on $G'$: $O(n' + m') = O(m + n)$. Returning $d(s^0, v^0)$: $O(1)$ for every $v \in V$, so $O(n)$. All together: $O(n + m)$.</p>
</div>
<aside class="callout caution">
  <span class="callout-title">⚠️ The even path may repeat vertices</span>
  <p>In the course, a [[path]] may visit a vertex twice; a [[simple-path|simple path]] may not. The answer here is a path in that sense. On the slide's own graph {{4R74}}, $s$ has the one neighbor $b$, so every simple path from $s$ to $b$ is $s - b$, of length 1. Yet the algorithm returns 4 for $b$: $s - b - c - d - b$, which ==goes through $b$ twice==. And if $v^0$ is never reached, it gets no label: there is no even path to $v$. {{added}}</p>
</aside>
<div class="ex-mount" data-ex="evenPaths"></div>`,
  };
})();
