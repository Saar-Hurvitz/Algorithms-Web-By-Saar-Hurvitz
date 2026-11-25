/* Part B: Recitation 1 entries (order is set in week.js).
   Concepts already taught in Part A are short recap cards with recap: true. */
window.E = window.E || {};

E.bGraph = {
  id: 'r-graph', title: 'Graph and notation', recap: true, slides: ['R7'], checklist: ['c1'],
  html: String.raw`
<p>Same [[graph]] as in the lecture: $V$ is the set of [[vertex|vertices]], $E$ the set of [[edge|edges]], with $|V| = n$ and $|E| = m$.</p>
<aside class="callout caution">
  <span class="callout-title">A difference to notice</span>
  <p>The recitation says every edge is "a subset of 2 elements from $V$" {{R7}}. Taken literally that rules out [[self-loop|self-loops]], yet the lecture ({{L44}}) and this recitation ({{R22}}) both draw them.</p>
</aside>`,
};

E.bDirs = {
  id: 'r-directed', title: 'Undirected and directed graphs', recap: true, slides: ['R8', 'R9'], checklist: [],
  html: String.raw`
<p>The same two kinds: [[undirected-graph|undirected graphs]] and [[directed-graph|directed graphs]]. The recitation stresses that directed [[edge|edges]] are <strong class="crucial">ordered</strong> pairs of [[vertex|vertices]].</p>
<p>The examples {{R8}} {{R9}}: $V = \{A, B, C, D, E, F, G\}$. Undirected: $E = \{(A,B), (A,C), (E,F), (E,G), (F,G)\}$. Directed: $E = \{(B,A), (C,A), (F,E), (G,E), (G,F)\}$.</p>`,
};

E.bSimple = {
  id: 'r-simple', title: 'Simple graphs', recap: true, slides: ['R10', 'R11'], checklist: [],
  html: String.raw`
<p>Covers [[simple-graph|simple undirected graphs]] and [[simple-digraph|simple directed graphs]], with three additions to the lecture:</p>
<ul>
  <li>The recitation's definition also says <strong>unweighted</strong>; the lecture ({{L44}}) doesn't require that.</li>
  <li>[[edge|Edges]] in different directions are ==not considered [[parallel-edges|parallel]]== {{R11}}, so $(u, v)$ together with $(v, u)$ is still simple.</li>
  <li>A simple [[graph]] may be either connected or disconnected {{R10}}.</li>
</ul>`,
};

E.bClique = {
  id: 'r-clique', title: 'Complete graph (clique)', slides: ['R12'], checklist: ['c2'],
  html: String.raw`
<p>A [[clique]] is an [[undirected-graph|undirected graph]] in which ==every pair of [[vertex|vertices]] is connected by an [[edge]]==.</p>
<div class="box theorem">
  <span class="box-label">How many edges?</span>
  $$|E| = \frac{n(n-1)}{2}$$
</div>
<p>Each of the $n$ vertices connects to the other $n - 1$. That counts every edge twice, once from each end. {{added}} It is the [[handshaking|Handshaking Theorem]] with every [[degree]] equal to $n - 1$. {{added}}</p>`,
};

E.bPath = {
  id: 'r-path', title: 'Path (recitation version)', slides: ['R13'], checklist: [],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Recitation wording</span>
  <p>A [[path]]: a sequence of [[edge|edges]] which connect a sequence of [[vertex|vertices]].</p>
</div>
<p>Compared with the lecture ({{L59}}): the lecture defines a path in a [[directed-graph|digraph]] as a sequence of vertices. This slide draws it in an [[undirected-graph|undirected graph]]. In both {{added}}, ==vertices may repeat==.</p>
<aside class="callout caution">
  <span class="callout-title">The example on this slide is cut off</span>
  <p>The slide image shows only $1 \to 2 \to 3 \to 4 \to 1$. The PDF's text continues the line as $1 \to 2 \to 3 \to 4 \to 1 \to 2 \to 3 \to 5 \to 6 \to 5$.</p>
</aside>`,
};

E.bSimplePath = {
  id: 'r-simple-path', title: 'Simple path', slides: ['R14'], checklist: [],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Definition</span>
  <p>A <dfn data-term="simple-path">simple path</dfn> is a [[path]] with ==distinct [[vertex|vertices]]==.</p>
</div>
<div class="fig-solo"><div data-fig="r13" data-alt="The simple path 1, 2, 3, 5, 6 highlighted"></div></div>
<p class="fig-note">The simple path $1 \to 2 \to 3 \to 5 \to 6$. No vertex appears twice.</p>`,
};

E.bConnected = {
  id: 'r-connected', title: 'Connected graph', slides: ['R15', 'R16'], checklist: ['c1'],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Definition</span>
  <p>A <dfn data-term="connected">connected</dfn> [[graph]] is an [[undirected-graph|undirected graph]] that includes <strong class="crucial">at least one</strong> [[path]] between every pair of [[vertex|vertices]].</p>
</div>
<div class="fig-solo"><div data-fig="r15" data-alt="A connected graph"></div></div>
<aside class="callout example">
  <span class="callout-title">Questions from slide 16 {{added}}</span>
  <p><strong>Is every connected graph a [[clique|complete graph]]?</strong> No: a connected graph needs a path between each pair, not an [[edge]]. The graph above is connected but not complete.</p>
  <p><strong>Is every complete graph a connected graph?</strong> Yes: every pair has an edge, and an edge is a path.</p>
</aside>`,
};

E.bStrong = {
  id: 'r-strongly-connected', title: 'Strongly connected directed graph', slides: ['R17'], checklist: ['c1'],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Definition</span>
  <p>A [[directed-graph|directed graph]] is <dfn data-term="strongly-connected">strongly connected</dfn> if for every pair of [[vertex|vertices]] $u$ and $v$, there exists a <strong class="crucial">directed</strong> [[path]] from $u$ to $v$.</p>
</div>
<div class="fig-solo"><div data-fig="r17" data-alt="Strongly connected graph on A, B, C, D"></div></div>
<aside class="callout intuition">
  <span class="callout-title">Both directions count {{added}}</span>
  <p>"Every pair" includes the pair $(v, u)$, so ==you must be able to get from $u$ to $v$ and also back==. Here the [[edge]] from $D$ to $A$ is what makes the way back possible.</p>
</aside>`,
};

E.bCC = {
  id: 'r-connected-components', title: 'Connected components', slides: ['R18'], checklist: ['c1'],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Definition</span>
  <p>Given an [[undirected-graph|undirected graph]], a set of [[vertex|vertices]] is connected if and only if there is a [[path]] between every pair of vertices in the set. A <dfn data-term="connected-component">connected component</dfn> is a <strong class="crucial">maximal</strong> such set.</p>
  <p>The collection of all connected components of a [[graph]] $G$ forms a partition of the vertices of $G$.</p>
</div>
<p>==An undirected graph cannot have [[edge|edges]] between different connected components.== Such an edge would join them into one component. {{added}}</p>`,
};

E.bSCC = {
  id: 'r-scc', title: 'Strongly connected components', slides: ['R19'], checklist: ['c1'], exercise: true,
  html: String.raw`
<div class="box definition">
  <span class="box-label">Definition</span>
  <p>Given a [[directed-graph|directed graph]], a set of [[vertex|vertices]] is [[strongly-connected|strongly connected]] if and only if there is a directed [[path]] between every pair of vertices in the set. A <dfn data-term="scc">strongly connected component</dfn> is a <strong class="crucial">maximal</strong> such set.</p>
  <p>The collection of all strongly connected components of a [[graph]] $G$ forms a partition of the vertices of $G$.</p>
</div>
<p>==A directed graph might have [[edge|edges]] between different components.== Unlike a [[connected-component|connected component]], an edge between two of them doesn't merge them, because you may not be able to come back. {{added}}</p>
<aside class="callout caution">
  <span class="callout-title">Wording on slide 19</span>
  <p>The footer says "connected components". In a directed graph it means <em>strongly</em> connected components. {{added}}</p>
</aside>
<div class="ex-mount" data-ex="components"></div>`,
};

E.bBip = {
  id: 'r-bipartite', title: 'Bipartite graph', recap: true, slides: ['R20'], checklist: ['c2'],
  html: String.raw`
<p>The same [[bipartite]] [[graph]], written formally as $G = (V = \{V_1, V_2\},\ E \subseteq V_1 \times V_2)$: two mutually exclusive sets of [[vertex|vertices]], and every [[edge]] connects vertices from different sets. The third example on the slide is the "square in a square" you can color in the exercise in Part A.</p>`,
};

E.bSimpleCycle = {
  id: 'r-simple-cycle', title: 'Simple cycle', slides: ['R21'], checklist: [],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Definition</span>
  <p>A <dfn data-term="simple-cycle">simple cycle</dfn> is a [[path]] that starts and ends at the same [[vertex]], containing <strong class="crucial">no repetitions</strong> of vertices or [[edge|edges]].</p>
</div>
<div class="fig-solo"><div data-fig="r21" data-alt="The simple cycle 1, 2, 3, 4 highlighted"></div></div>
<p class="fig-note">$1 \to 2 \to 3 \to 4 \to 1$ {{R21}}. Only the start and end vertex are the same. A general [[cycle]] ({{L59}}) doesn't have this restriction.</p>`,
};

E.bRep = {
  id: 'r-representations', title: 'Graph representations', recap: true, slides: ['R22', 'R23', 'R24'], checklist: ['c4'],
  html: String.raw`
<p>The [[adjacency-matrix|adjacency matrix]] and [[adjacency-list|adjacency list]] again, with extra properties:</p>
<div class="table-wrap"><table class="model">
  <thead><tr><th></th><th>Matrix {{R23}}</th><th>List {{R24}}</th></tr></thead>
  <tbody>
    <tr><td>Size</td><td>$O(n^2)$, depends only on the number of [[vertex|vertices]]</td><td>$O(n + m)$</td></tr>
    <tr><td>Is $(u, v)$ in $E$?</td><td>==$O(1)$==</td><td>search a linked list</td></tr>
  </tbody>
</table></div>
<ul>
  <li>If a [[graph]] contains no [[self-loop|self-loops]], the principal diagonal of the matrix is 0.</li>
  <li>In an [[undirected-graph|undirected graph]], the matrix is symmetric with respect to the principal diagonal.</li>
</ul>
<p>The example on {{R23}} and {{R24}} is a directed [[graph]] on $1…6$. Its matrix has 1 at $(1,2)$, $(1,4)$, $(2,5)$, $(3,5)$, $(3,6)$, $(4,2)$, $(5,4)$, $(6,6)$, and its lists are $1: 2, 4$; $2: 5$; $3: 6, 5$; $4: 2$; $5: 4$; $6: 6$ {{R24}}. {{R23}} also asks: is this representation good or bad?</p>`,
};

E.bHand = {
  id: 'r-handshaking', title: 'Handshaking Theorem', recap: true, slides: ['R25'], checklist: ['c3'],
  html: String.raw`
<p>The same [[handshaking|Handshaking Theorem]], with this proof: each [[edge]] is [[incident]] to exactly two [[vertex|vertices]]. When we add up the [[degree|degrees]] of all the vertices, we count each endpoint once, so each edge is counted twice. ∎</p>
<aside class="callout caution">
  <span class="callout-title">Two wording differences</span>
  <p>This slide says degree counts the edges "[[adjacent]]" to a vertex; the lecture's word, used on this site, is incident ({{L44}}). And for a [[self-loop]] both endpoints are the same vertex; the lecture counts a self-loop twice ({{L44}}), which keeps the count right. {{added}}</p>
</aside>`,
};

E.bOdd = {
  id: 'r-odd-degree', title: 'Odd-degree vertices', slides: ['R26'], checklist: ['c3'],
  html: String.raw`
<div class="box theorem">
  <span class="box-label">Claim</span>
  <p>Every [[undirected-graph|undirected graph]] has an ==even number of [[vertex|vertices]] of odd [[degree]]==.</p>
</div>
<details class="proof" open><summary>Proof</summary>
  <p>By the [[handshaking|Handshaking Theorem]] the sum of all degrees is $2m$, and thus even. Split the vertices into two disjoint sets: vertices with even degree and vertices with odd degree.</p>
  $$2m = \sum_{v \in \text{Even}(V)} \deg(v) + \sum_{v \in \text{Odd}(V)} \deg(v)$$
  <p>The sum over the even-degree vertices is even, so the sum over the odd-degree vertices must also be even. Thus there must be an even number of vertices of odd degree. <span class="qed">∎</span></p>
</details>`,
};

E.bDag = {
  id: 'r-dag', title: 'Directed acyclic graphs', slides: ['R27'], checklist: ['c6'],
  html: String.raw`
<p>The formal definition of a [[dag|DAG]]: a [[directed-graph|directed graph]] with ==no directed [[cycle|cycles]]==.</p>
<aside class="callout caution">
  <span class="callout-title">Note from slide 27</span>
  <p>The underlying [[undirected-graph|undirected graph]] may include cycles, for example $o - r - s - p - o$. Only cycles that follow the arrows count.</p>
</aside>`,
};

E.bTopo = {
  id: 'r-topo', title: 'Topological sort', recap: true, slides: ['R28'], checklist: ['c5'],
  html: String.raw`
<p>The same definition of a [[topo-sort|topological sort]]: if $G$ contains an [[edge]] $(u, v)$, then $u$ appears before $v$ in the ordering. This slide's example is getting dressed: socks before shoes, shirt before tie.</p>`,
};

E.bAlgo = {
  id: 'r-algorithm', title: 'The algorithm and its running time', recap: true, slides: ['R29'], checklist: ['c7'],
  html: String.raw`
<p>Algorithm 1 on this slide is a 6-line summary of the [[topo-sort|topological sort]] you can step through in Part A:</p>
<div class="table-wrap"><table class="model">
  <thead><tr><th>Step</th><th>Time</th></tr></thead>
  <tbody>
    <tr><td>Initializing $D$</td><td>$O(n + m)$</td></tr>
    <tr><td>Initializing $Q$</td><td>$O(n)$</td></tr>
    <tr><td>Enqueueing a [[vertex]] with [[in-degree]] zero and outputting it</td><td>$O(1)$, done $O(n)$ times</td></tr>
    <tr><td>Reducing the in-degree of all [[adjacent]] vertices</td><td>$O(m)$</td></tr>
    <tr><td><strong>Total</strong></td><td>==$O(n + m)$==</td></tr>
  </tbody>
</table></div>
<pre class="code-block">Algorithm 1 TOPOLOGICAL SORT(G)
1: D ← In-degree of all vertices in G
2: Q ← Enqueue all in-degree zero vertices
3: while Q do
4:     Dequeue and output a vertex
5:     Reduce in-degree of all vertices adjacent to it by 1
6:     Enqueue any of these vertices whose in-degree became zero</pre>`,
};

E.bSource = {
  id: 'r-source', title: 'Every DAG has a source', slides: ['R30'], checklist: ['c6'],
  html: String.raw`
<p>Recall that a [[vertex]] is a [[source]] if its [[in-degree]] is 0.</p>
<div class="box theorem">
  <span class="box-label">Claim</span>
  <p>Every [[dag|DAG]] has at least one source vertex.</p>
</div>
<details class="proof" open><summary>Proof</summary>
  <p>Pick some arbitrary vertex $v_1$. If $v_1$ is a source, we are done.</p>
  <p>Otherwise, let $v_2$ be a vertex such that $(v_2, v_1) \in E$. $v_2 \ne v_1$ since the [[graph]] is a DAG.</p>
  <p>If $v_2$ is a source, we are done. Otherwise, proceed backward (as with $v_1$).</p>
  <p>After at most $n$ steps of backward traversals, we will find a source vertex, since the graph is finite and contains no [[cycle|cycles]]. <span class="qed">∎</span></p>
</details>`,
};

E.bCorrect = {
  id: 'r-correctness', title: 'Why the algorithm is correct', slides: ['R31', 'R32'], checklist: ['c6', 'c7'],
  html: String.raw`
<div class="box theorem">
  <span class="box-label">Claim</span>
  <p>The algorithm produces a [[topo-sort|topological sort]] of a [[dag|DAG]] $G$.</p>
</div>
<details class="proof" open><summary>Proof, by induction</summary>
  <p>We show that for every $k$, after $k$ iterations, the output is a valid topological sort of the [[graph]] induced by the [[vertex|vertices]] already in the output. In other words, for the vertex $v_k$ chosen in iteration $k$, ==there are no [[edge|edges]] from it to previously sorted vertices==.</p>
  <p><strong>Base case:</strong> $k = 0$, empty output.</p>
  <p><strong>Induction step:</strong> Consider the $k$-th iteration. The output is extended by a vertex with [[in-degree]] zero (such a vertex exists in every DAG). It is appended to the end of the output, which is, by the induction hypothesis, a valid topological sort of the first $k - 1$ vertices.</p>
  <p>Let $v_k$ be the output vertex and $A$ the set of vertices output before it. Let $v_i \in A$. For every edge $(v_i, v_k)$, since $v_k$ is appended to the end, the output is valid for such edges.</p>
  <p>Also, no edge $(v_k, v_i)$ exists, since $v_i$ was output earlier and in-degree$(v_i)$ was 0 at the time it was added to $A$. <span class="qed">∎</span></p>
</details>`,
};

E.bQS = {
  id: 'r-queue-stack', title: 'Queue vs stack', algo: true, slides: ['R33'], checklist: ['c8'],
  html: String.raw`
<p>Both structures store [[vertex|vertices]] whose current [[in-degree]] is 0.</p>
<ul>
  <li><strong>Queue (FIFO):</strong> takes the vertex that has waited longest. Output S, A, B, C, D, E, F.</li>
  <li><strong>Stack (LIFO):</strong> takes the most recently inserted vertex. Output S, B, D, A, C, F, E.</li>
</ul>
<p>==Different orders, both valid.== The running time is $O(n + m)$ for both. Each is a [[topo-sort|topological sort]] of this [[graph]]. Switch between Queue and Stack below.</p>
<div class="algo-mount" data-algo="toposort" data-preset="recitation"></div>`,
};

E.bIff = {
  id: 'r-iff', title: 'A topo-sort exists if and only if G is a DAG', slides: ['R34', 'R35', 'R36'], checklist: ['c6'],
  html: String.raw`
<div class="box theorem">
  <span class="box-label">Claim</span>
  <p>$G$ has a [[topo-sort|topological sort]] if and only if $G$ is a [[dag|DAG]].</p>
</div>
<details class="proof" open><summary>Proof of →: if $G$ has a topo-sort then $G$ is a DAG</summary>
  <p>We prove the contrapositive: let $A$ = "$G$ has a topo-sort" and $B$ = "$G$ is a DAG". {{added}} We assume $\neg B$ and show $\neg A$.</p>
  <p>Let $G$ be a [[directed-graph|directed graph]] and let $C$ be a directed [[cycle]] in $G$. We show that $G$ has no topo-sort. Assume towards contradiction that it has one.</p>
  <p>Let $v_i$ be the lowest indexed [[vertex|node]] in $C$, and let $v_j$ be the node just before $v_i$ in the cycle. Therefore $(v_j, v_i)$ is an [[edge]]. By our choice of $i$, we know that $v_i$ precedes $v_j$ in the topo-sort. Since $(v_j, v_i)$ is an edge, we get a contradiction. <span class="qed">∎</span></p>
</details>
<details class="proof" open><summary>Proof of ←: if $G$ is a DAG then $G$ has a topo-sort</summary>
  <p><strong>Base case:</strong> a DAG with a single vertex has a topo-sort (the vertex itself).</p>
  <p><strong>Induction hypothesis:</strong> if $G$ is a DAG of size $n$, then $G$ has a topo-sort.</p>
  <p><strong>Induction step:</strong> If $G$ is a DAG with $n + 1$ vertices, let $s$ be a [[source]] vertex. Remove $s$ and the outgoing edges from $s$. The resulting [[graph]] is a DAG, since we only removed a vertex and some edges, so we could not possibly have created a cycle.</p>
  <p>By the induction hypothesis, the resulting graph (with $n$ vertices) has a topological sort. We append that topo-sort after $s$ to obtain a topo-sort of $G$. <span class="qed">∎</span></p>
</details>
<aside class="callout intuition">
  <span class="callout-title">An alternative proof of ← {{R36}}</span>
  <p>The proof above is identical to the correctness proof of the algorithm. So: we proved the topo-sort algorithm finds a topo-sort for every DAG. ∎</p>
</aside>`,
};
