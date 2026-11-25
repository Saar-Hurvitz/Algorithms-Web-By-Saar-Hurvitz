/* Part B: Recitation 3 entries (order is set in week.js).
   Concepts already taught in Part A are short recap cards with recap: true. */
window.E = window.E || {};

(function () {
  const range = (deck, from, to) => Array.from({ length: to - from + 1 }, (_, i) => `${deck}${from + i}`);

  E.w3RTrees = {
    id: 'w3-r-trees', title: 'Trees, four definitions', recap: true, slides: ['3R4'], checklist: ['w3c6', 'w3c7'],
    html: String.raw`
<p>The recitation states the four equivalent definitions from the lecture for a [[tree]]: $G$ is [[acyclic]] and connected, $G$ is acyclic and adding any [[edge]] will form a [[cycle]], $G$ is connected and deleting any edge will disconnect $G$, or every two [[vertex|vertices]] have a unique [[path]] connecting them {{3R4}}.</p>`,
  };

  E.w3RIdentify = {
    id: 'w3-r-identify', title: 'Identify the trees', exercise: true, slides: ['3R5'], checklist: ['w3c6'],
    html: String.raw`
<p>{{3R5}} asks which of its four drawings are [[tree|trees]] and gives no answers, so the answers here are computed from the [[graph|graphs]]. {{added}}</p>
<div class="ex-mount" data-ex="identifyTrees"></div>`,
  };

  E.w3RRoots = {
    id: 'w3-r-roots', title: 'Roots and directed trees', recap: true, slides: ['3R6', '3R7'], checklist: ['w3c8'],
    html: String.raw`
<p>The same [[root]]: a [[vertex]] with a directed [[path]] to every vertex of a [[directed-graph|directed graph]] $G$. ==Not only for trees!== {{3R6}} The same [[directed-tree|directed tree]]: a [[directed-graph|directed graph]] that has a root and whose [[underlying-graph|underlying undirected graph]] is a [[tree]] {{3R7}}.</p>`,
  };

  E.w3RFindRoots = {
    id: 'w3-r-find-roots', title: 'Find the roots', exercise: true, slides: ['3R6'], checklist: ['w3c8'],
    html: String.raw`
<p>{{3R6}} asks for the [[root|roots]] of three [[directed-graph|directed graphs]] and gives no answers, so they are computed. {{added}} The [[graph]] has one [[root]], several, or none.</p>
<div class="ex-mount" data-ex="findRoots"></div>`,
  };

  E.w3RLeaf = {
    id: 'w3-r-leaf', title: 'Every tree has at least two leaves', slides: range('3R', 8, 15), checklist: [],
    html: String.raw`
<div class="box definition">
  <span class="box-label">Definition {{3R8}}</span>
  <p>Let $T$ be an undirected [[tree]]. A <dfn data-term="leaf">leaf</dfn> in $T$ is a node whose [[degree]] is 1.</p>
</div>
<div class="box theorem">
  <span class="box-label">Lemma 1 {{3R8}}</span>
  <p>Every undirected [[tree]] over $n \ge 2$ nodes has ==at least two leaves==.</p>
</div>
<details class="proof" open><summary>Proof 1: counting {{3R9}} {{3R10}} {{3R11}}</summary>
<p>Let $x$ be the number of leaves in $T$, so $n - x$ vertices are not leaves. By the [[handshaking|handshaking theorem]], $\sum_{v \in V} \deg(v) = 2|E|$:</p>
<p>$$2m = \sum_{v \text{ a leaf}} \deg(v) + \sum_{v \text{ not a leaf}} \deg(v) \ge x \cdot 1 + (n - x) \cdot 2 = 2n - x.$$</p>
<p>In a tree, $m = n - 1$ {{3R11}}, so $2n - 2 \ge 2n - x$, which gives $x \ge 2$.</p>
</details>
<details class="proof" open><summary>Proof 2: induction {{3R12}} {{3R13}} {{3R14}} {{3R15}}</summary>
<p><strong>Base case:</strong> a tree of size $n = 2$ has 2 leaves. <strong>Hypothesis:</strong> every tree of size between 2 and $n - 1$ has at least 2 leaves.</p>
<p><strong>Step:</strong> let $T$ be a tree of size $n$, let $v$ be any [[vertex]], and let $\deg(v) = k$. Remove $v$ and its [[adjacent]] [[edge|edges]] to obtain $k$ sub-trees $T_1, …, T_k$, each over less than $n$ nodes {{3R13}}.</p>
<p>If $|T_i| \ge 2$, then $T_i$ has at least two leaves, and at most one of them is adjacent to $v$ in $T$. So $T_i$ includes at least one leaf of $T$ {{3R14}}. If $|T_i| = 1$, its single node is a leaf in $T$.</p>
<p>Therefore every $T_i$ includes at least one leaf of $T$, and $T$ has at least $k$ leaves. If $k = 1$ then $v$ itself is a leaf, and $T_i$ includes at least one leaf {{3R15}}.</p>
<p>{{3R13}} draws the step for a vertex with $k = 3$ sub-trees, and {{3R15}} draws the case $k = 1$.</p>
</details>`,
  };

  E.w3RDFS = {
    id: 'w3-r-dfs', title: 'DFS on the recitation graph', recap: true, algo: true, slides: range('3R', 16, 26), checklist: ['w3c10'],
    html: String.raw`
<p>The same [[dfs|DFS]], written as $DFS(G, v)$ on {{3R16}}: it visits the child [[vertex|vertices]] first, and traverses the depth of any particular [[path]] before exploring its breadth. The example runs $DFS(4)$ on the [[graph]] of {{3R17}}.</p>
<p>Every call is added to the [[running-stack|running stack]], and it goes back out when it finishes: $DFS(3)$ is popped on {{3R21}}, then $DFS(6)$ on {{3R23}}, and so on. The [[spanning-tree|spanning tree]] appears on {{3R26}}.</p>
<aside class="callout example">
  <span class="callout-title">Which order the lists are in</span>
  <p>The slides give no [[adjacency-list|adjacency lists]] for this graph. The run on {{3R18}} to {{3R26}} visits 2 before 1, so it is not numerical order. This animation uses an order that reproduces the slides' run. {{added}}</p>
</aside>
<div class="algo-mount" data-algo="dfsRecitation"></div>`,
  };

  E.w3RSpanning = {
    id: 'w3-r-spanning', title: 'Spanning tree', recap: true, slides: ['3R27'], checklist: ['w3c9'],
    html: String.raw`
<p>$T = (V', E')$ is a [[spanning-tree|spanning tree]] of $G = (V, E)$ if it is a [[tree]] and $V' = V$, $E' \subseteq E$ {{3R27}}.</p>`,
  };

  E.w3RCount = {
    id: 'w3-r-count', title: 'How many spanning trees?', exercise: true, slides: ['3R28', '3R29'], checklist: ['w3c9'],
    html: String.raw`
<p>{{3R29}} gives the answers: a [[cycle-graph|cycle with $n$ nodes]] has $n$ [[spanning-tree|spanning trees]] (delete any one [[edge]]), a [[tree]] with 9 [[vertex|nodes]] has exactly one (itself), and the third [[graph]] has 3. The reasons in parentheses are added. {{added}} The slide names no vertices of the [[cycle-graph|cycle]] or of the third [[graph]]; the numbers $1 \dots n$ and the letters $a$–$e$ in the exercise are added. {{added}}</p>
<div class="ex-mount" data-ex="countSpanning"></div>`,
  };

  E.w3REx1 = {
    id: 'w3-r-ex1', title: 'Exercise 1: which tree can DFS(e) output?', exercise: true, slides: ['3R30', '3R31', '3R32', '3R33'], checklist: ['w3c11'],
    html: String.raw`
<p>Let $G$ be an undirected [[graph]] on $\{a, b, c, d, e\}$ {{3R30}}. $DFS(a)$ produces the [[tree]] shown. Which trees can [[dfs|DFS]]$(e)$ output {{3R31}}?</p>
<div class="ex-mount" data-ex="whichTreeEx1"></div>
<details class="proof"><summary>The slide's solution</summary>
<p>The first tree can be derived if $G$ consists of the given tree with the [[edge]] $(a, e)$ {{3R32}}. Both other trees include the edge $(b, d)$. If this edge were in $G$, then $d$ should have been marked by $b$ and not by $a$ in $DFS(a)$ {{3R33}}.</p>
</details>
<aside class="callout caution">
  <span class="callout-title">⚠️ One case of the argument</span>
  <p>{{3R33}} covers the case where $DFS(a)$ reaches $b$ before $d$. The argument that covers every order: in a DFS [[tree]] of an [[undirected-graph|undirected graph]], ==every edge of $G$ joins a [[vertex]] and one of its ancestors==. It can never join two separate branches. In the given tree, $b$ and $d$ sit on separate branches under $a$, so $(b, d)$ is not in $G$. {{added}}</p>
</aside>`,
  };

  E.w3REx2 = {
    id: 'w3-r-ex2', title: 'Exercise 2: the children of v', exercise: true, slides: ['3R34', '3R35'], checklist: ['w3c10'],
    html: String.raw`
<p>In the [[dfs|DFS]] [[tree]] of some run $DFS(u)$, a [[vertex]] $v \ne u$ has $x$ children. True or false: in every run of $DFS(v)$, $v$ has at least $x$ children {{3R34}}?</p>
<p>==False== {{3R35}}. When starting from $u$, $v$ has 2 children. When starting from $v$, $v$ has a single child. Use the exercise to find the slide's two runs on the [[graph]] of {{3R35}}. The two bottom vertices have no names on the slide: $c$ and $d$ are added here. {{added}}</p>
<div class="ex-mount" data-ex="childrenOfV"></div>`,
  };

  E.w3REx3 = {
    id: 'w3-r-ex3', title: 'Exercise 3: complete the graph', exercise: true, slides: ['3R36', '3R37', '3R38'], checklist: ['w3c10'],
    html: String.raw`
<p>Complete the [[graph]] so that it satisfies all of these {{3R36}}:</p>
<ul>
  <li>For every run of [[dfs|DFS]]$(B)$, in the resulting [[spanning-tree|spanning tree]], $\deg(B) = 2$.</li>
  <li>$G$ has a [[hamiltonian-path|Hamilton path]] and not a [[hamiltonian-cycle|Hamilton cycle]].</li>
  <li>There is a [[vertex]] $v$ with [[degree|$\deg(v)$]] $> 2$.</li>
</ul>
<div class="ex-mount" data-ex="completeGraph"></div>
<p>The solution on {{3R37}} is one of many. {{added}} {{3R38}} shows a possible $DFS(B)$ [[tree]] and a Hamilton [[path]], $E, A, B, C, D$.</p>`,
  };

  E.w3REdges = {
    id: 'w3-r-edges', title: 'Tree edges and back edges', exercise: true, slides: ['3R39', '3R40', '3R41'], checklist: [],
    html: String.raw`
<div class="box definition">
  <span class="box-label">Definition {{3R39}}</span>
  <p>When a [[spanning-tree|spanning tree]] is produced by [[dfs|DFS]], every [[edge]] in an undirected [[graph]] $G$ is either a [[tree-edge|tree edge]], which belongs to the [[tree]], or a [[back-edge|back edge]], as in <a href="#e-w3-edge-class">the lecture</a>.</p>
  <p>Back edges are the edges which point from a [[vertex|node]] to one of its already marked neighbors.</p>
</div>
<p>Exercise 4 {{3R40}}: if there are no back edges then there are no [[cycle|cycles]] in $G$. <strong>True:</strong> all the edges are tree edges, therefore $G$ is a tree.</p>
<p>Exercise 5 {{3R41}}: how many back edges? There are $|E| - |E'|$, and a spanning tree has $|V| - 1$ edges, so there are $|E| - |V| + 1$.</p>
<p>The exercise below applies Exercises 4 and 5 to the [[graph]] of {{3R17}}, a choice made here. {{added}}</p>
<div class="ex-mount" data-ex="backEdges"></div>
<aside class="callout caution">
  <span class="callout-title">⚠️ Reading these slides carefully</span>
  <p>Read literally, "edges which point to an already marked neighbor" also fits a tree edge seen from the child, whose parent is marked. The lecture's version on {{3L41}} is clear: a back edge is ==any edge that is not a tree edge==. Exercises 4 and 5 also assume $G$ is connected: if it is not, $DFS$ reaches only one [[connected-component|component]], and Exercise 4's claim says nothing about the others. {{added}}</p>
</aside>`,
  };

  E.w3REx6 = {
    id: 'w3-r-ex6', title: 'Exercise 6: the vertex every path goes through', exercise: true, slides: ['3R42', '3R43'], checklist: ['w3c11'],
    html: String.raw`
<p>Let $G$ be an undirected [[graph]] and let $a, b, s \in V$ be such that every [[path]] between $a$ and $b$ goes through $s$. True or false: if we perform [[dfs|DFS]]$(s)$ then $\deg(s) > 1$ in the resulting [[spanning-tree|spanning tree]] {{3R42}}?</p>
<p>{{3R42}} has no graph. The exercise below tries the claim on the graph of {{3R17}}, with $a = 1$, $b = 2$, $s = 4$, a choice made here. {{added}}</p>
<div class="ex-mount" data-ex="cutVertex"></div>
<details class="proof"><summary>The slide's solution {{3R43}}</summary>
<p>True. The algorithm must visit both $a$ and $b$. Assume towards contradiction that $\deg(s) = 1$ in $T = DFS(s)$. Then both $a$ and $b$ must appear in the subtree $T'$ that results from deleting $s$ from $T$. Since $T'$ is a [[tree]], $a, b$ are connected in it, so there is a path between them in $T'$. Since $s$ is not in $T'$, we have a contradiction.</p>
</details>
<aside class="callout caution">
  <span class="callout-title">⚠️ Two silent assumptions</span>
  <p>{{3R42}} also needs $a, b \ne s$: with $a = s$, the single [[edge]] $(s, b)$ satisfies the condition and $DFS(s)$ gives $\deg(s) = 1$. It also needs $a$ and $b$ to be connected, otherwise "every path" says nothing and $DFS(s)$ cannot visit both. {{added}}</p>
</aside>`,
  };

  E.w3REx7 = {
    id: 'w3-r-ex7', title: 'Exercise 7: which tree can DFS(b) output?', exercise: true, slides: ['3R44', '3R45'], checklist: ['w3c11'],
    html: String.raw`
<p>Let $G$ be an undirected, connected [[graph]]. $DFS(a)$ produces Figure 1. Which trees can [[dfs|DFS]]$(b)$ produce {{3R44}}?</p>
<div class="ex-mount" data-ex="whichTreeEx7"></div>
<details class="proof"><summary>The slide's solution {{3R45}}</summary>
<p>Figures 2 and 3 cannot be $DFS(b)$: each needs the [[edge]] $(e, d)$. Figure 4 can: take Figure 1 with the additional edges $(a, c)$ and $(b, d)$.</p>
</details>
<aside class="callout caution">
  <span class="callout-title">⚠️ One case of the argument</span>
  <p>{{3R45}} says $DFS(a)$ "should look like $a \to b \to c \to d \to e$", which assumes it reaches $b$ first. The argument that covers every order is the one of Exercise 1: in a DFS [[tree]], every edge of $G$ joins a [[vertex]] and one of its ancestors. In Figure 1, $e$ and $d$ sit on separate branches, so $(e, d)$ is not in $G$. {{added}}</p>
</aside>`,
  };
})();
