/* Part B: Recitation 2 entries (order is set in week.js).
   Concepts already taught in Part A are short recap cards with recap: true. */
window.E = window.E || {};

E.w2REuler = {
  id: 'w2-r-euler', title: 'Euler path and cycle', recap: true, slides: ['2R4', '2R5', '2R6'], checklist: ['w2c3'],
  html: String.raw`
<p>The same [[euler-path|Euler path]] and [[euler-cycle|Euler cycle]] as in the lecture. The recitation adds two notes {{2R4}}: an [[euler-path|Euler path]] may visit a [[vertex]] more than once, and $G$ may not be simple.</p>
<p>In the example of {{2R5}}, $\deg(B)$ and $\deg(C)$ are odd, so there is no [[euler-cycle|Euler cycle]]. The [[graph]] does have an [[euler-path|Euler path]], drawn on {{2R4}}.</p>
<aside class="callout caution">
  <span class="callout-title">⚠️ Slide 6 changes the graph without saying so</span>
  <p>The annotated drawing on {{2R6}} has an extra [[edge]] between $B$ and $C$ that the left drawing lacks. That edge is what makes every [[degree]] even, so the [[euler-cycle|Euler cycle]] drawn there exists. {{added}}</p>
</aside>
<aside class="callout caution">
  <span class="callout-title">A small difference in wording</span>
  <p>{{2R4}} defines an [[euler-path|Euler path]] for a [[connected]] graph, while {{2L13}} does not assume connectivity. The lecture handles unconnected graphs in its remarks on {{2L15}} and {{2L16}}.</p>
</aside>`,
};

E.w2RAlgo = {
  id: 'w2-r-algo', title: 'The algorithm in pseudo-code', recap: true, algo: true, slides: ['2R7', '2R8', '2R9', '2R10', '2R11'], checklist: ['w2c6'],
  html: String.raw`
<p>The same algorithm as in Part A, now as pseudo-code {{2R7}}, run on the [[graph]] of {{2R8}}. It finds the [[cycle]] $0, 3, 2, 0$ {{2R9}}, then $3, 1, 4, 3$, and joins them {{2R10}} into an [[euler-cycle|Euler cycle]]. Complexity: $O(m + n)$ {{2R11}}.</p>
<div class="algo-mount" data-euler></div>
<aside class="callout example">
  <span class="callout-title">Which order the lists are in</span>
  <p>The slides draw the walks but not the [[adjacency-list|adjacency lists]]. The list order here is chosen to give the walks on {{2R9}} and {{2R10}}. {{added}}</p>
</aside>`,
  init(root) { EulerView.mount(root.querySelector('[data-euler]'), Algorithms.eulerRecitation); },
};

E.w2RImpl = {
  id: 'w2-r-impl', title: 'Implementation in O(|V|+|E|)', recap: true, slides: ['2R12', '2R13'], checklist: ['w2c6'],
  html: String.raw`
<p>The same implementation as on {{2L24}}: [[adjacency-list|adjacency lists]] with a 0/1 entry per list cell, a pair of pointers between the two entries of the same [[edge]], and a pointer to the next untraced edge. ==Every list is scanned exactly once along the whole algorithm== {{2R13}}.</p>`,
};

E.w2REx1 = {
  id: 'w2-r-ex1', title: 'Exercise 1: k edge-disjoint paths', slides: ['2R14', '2R15', '2R16'], checklist: ['w2c5'],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Exercise 1 {{2R14}}</span>
  <p>Let $G = (V, E)$ be an undirected [[connected|connected graph]] where exactly $l = 2k$, $k \in \mathbb{N}$ of its [[vertex|vertices]] have an odd [[degree]]. Prove that there exists a partition of the [[graph]] [[edge|edges]] to $k$ edge-disjoint [[path|paths]].</p>
</div>
<details class="proof" open><summary>Solution {{2R15}} {{2R16}}</summary>
<p>We want to use an [[euler-cycle|Euler cycle]] (a [[cycle]]). For that, add $k$ edges to the graph in order to get a graph with all even degrees {{2R15}}.</p>
<p>Let $\{v_1, \dots, v_{2k}\}$ be the vertices with an odd degree. Add $k$ new edges: $\{(v_1, v_2), (v_3, v_4), \dots, (v_{2k-1}, v_{2k})\}$. Now all vertices have an even degree, and the resulting graph contains an Euler cycle. After removing the $k$ added edges from the Euler cycle, we are left with $k$ disjoint paths {{2R16}}.</p>
</details>
<p>The example for $k = 1$ on {{2R15}}: edges $(0,3), (0,2), (3,2), (3,1), (1,4)$. The odd vertices are $3$ and $4$, so the edge $(3,4)$ is added. {{added}}</p>`,
};

E.w2RTheorems = {
  id: 'w2-r-theorems', title: 'The three theorems', recap: true, slides: ['2R17'], checklist: ['w2c4', 'w2c9'],
  html: String.raw`
<ul>
  <li>A [[connected]] [[undirected-graph|undirected graph]] has an [[euler-cycle|Euler cycle]] if and only if every [[vertex]] has an even [[degree]].</li>
  <li>A [[strongly-connected|strongly connected]] [[directed-graph|directed graph]] has an [[euler-cycle|Euler cycle]] if and only if for every $v \in V$, $d_{in}(v) = d_{out}(v)$.</li>
  <li>A [[connected|connected graph]] has an [[euler-path|Euler path]] that is not an [[euler-cycle|Euler cycle]] if and only if exactly two vertices have an odd degree.</li>
</ul>
<aside class="callout caution">
  <span class="callout-title">Strongly connected or just connected?</span>
  <p>{{2R17}} assumes a strongly connected digraph, while {{2L26}} only asks that the [[underlying-graph|underlying graph]] is connected. Both are correct: when $d_{in}(v) = d_{out}(v)$ at every vertex, an [[underlying-graph|underlying graph]] that is connected forces the digraph to be strongly connected. {{added}}</p>
</aside>`,
};

E.w2REx2 = {
  id: 'w2-r-ex2', title: 'Exercise 2: a complete graph minus two edges', slides: ['2R18', '2R19', '2R20'], checklist: ['w2c4'],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Exercise 2 {{2R18}}</span>
  <p>Let $G$ be a [[clique|complete graph]] with 183 [[vertex|vertices]]. Two [[edge|edges]] with a common vertex were removed. Which claims are true?</p>
  <ol><li>$G$ contains an [[euler-cycle|Euler cycle]].</li><li>$G$ contains an [[euler-path|Euler path]], but no Euler cycle.</li><li>There is no Euler cycle or Euler path in $G$.</li></ol>
</div>
<details class="proof" open><summary>Solution {{2R19}} {{2R20}}</summary>
<p>Before removing, every node has [[degree]] 182. After removing, 1 node has degree 180, 2 nodes have degree 181, and the rest 182 {{2R19}}.</p>
<p>1. ==No==: 2 vertices with odd degree. 2. ==Yes== {{2R20}}. 3. False: the slide gives no answer, and it follows from 2 {{added}}. These follow the theorems of {{2R17}}: an Euler [[cycle]] needs every degree even, and an Euler [[path]] that is not a cycle needs exactly two odd vertices.</p>
</details>`,
};

E.w2RDeBruijn = {
  id: 'w2-r-de-bruijn', title: 'De Bruijn sequences and graphs', recap: true, slides: ['2R21', '2R22', '2R23'], checklist: ['w2c10', 'w2c11'],
  html: String.raw`
<p>The same [[de-bruijn-sequence|De Bruijn sequence]]: a cyclic sequence in which every possible length-$n$ string occurs exactly once as a substring {{2R21}}. For $\Sigma = \{0, 1\}$, $n = 2$ it is $0011$ {{2R22}}, and the slide draws the [[graph]] beside it.</p>
<p>The [[de-bruijn-graph|De Bruijn graph]] $G_{\sigma,n}$, summarized on {{2R23}}:</p>
<ol>
  <li>$|V| = \sigma^{n-1}$.</li>
  <li>$|E| = \sigma^n$.</li>
  <li>The [[edge]] $b_1 b_2 … b_n$ starts from the [[vertex]] $b_1 b_2 … b_{n-1}$ and ends at the vertex $b_2 b_3 … b_n$.</li>
  <li>Every vertex has exactly $\sigma$ incoming edges and $\sigma$ outgoing edges.</li>
  <li>The graph $G_{\sigma,n}$ contains a directed [[euler-cycle|Euler cycle]].</li>
  <li>An [[euler-cycle|Euler cycle]] corresponds to a De Bruijn sequence.</li>
</ol>`,
};

E.w2REx3 = {
  id: 'w2-r-ex3', title: 'Exercise 3: the sub-sequence 012012', slides: ['2R24', '2R25', '2R26', '2R27', '2R28', '2R29'], checklist: ['w2c10', 'w2c11'],
  html: String.raw`
<p>$012012$ is a [[de-bruijn-sequence|De Bruijn]] sub-sequence over some $\Sigma, n$. Which of the following claims are true {{2R24}}?</p>
<ol>
  <li>If $n = 5$, then in the corresponding [[de-bruijn-graph|$G_{\sigma,n}$]] there must be an [[edge]] from [[vertex]] $0120$ to vertex $2012$ {{2R24}}.<br>
  <strong>False</strong> {{2R25}}: all the vertices connected from $0120$ are $120x$, where $x \in \Sigma$.</li>
  <li>If the next character in the sequence is $0$, then it must be that $n > 4$ {{2R26}}.<br>
  <strong>True</strong> {{2R27}}: the sub-sequence becomes $0120120$. For $n = 2, 3, 4$ we get a repetition of a word. For $n > 4$ it is possible to avoid a repetition: $0120120x$, by choosing $x \ne 1$.</li>
  <li>If $n = 4$ and $\Sigma = \{0, 1, 2, 3\}$, then the next character in the sequence must be $3$ {{2R28}}.<br>
  <strong>False</strong> {{2R29}}: $0120120$ gives a repetition, but $0120121$ gives none ($0120122$ is also good, but it is enough to find one option).</li>
</ol>`,
};

E.w2RHamilton = {
  id: 'w2-r-hamilton', title: 'Hamiltonian path and cycle', recap: true, slides: ['2R30', '2R31'], checklist: ['w2c14'],
  html: String.raw`
<p>The same [[hamiltonian-path|Hamiltonian path]], which ==visits each [[vertex]] exactly once==, and [[hamiltonian-cycle|Hamiltonian cycle]], a [[hamiltonian-path|Hamiltonian path]] that is a [[cycle]]. {{2R30}} defines it for a connected [[graph]] $G$. Compare with [[euler-path|Euler paths]], which use each [[edge]] exactly once {{2R4}}.</p>
<p><strong>Complexity {{2R31}}:</strong> ==much harder than an Euler [[path]]==. The brute force algorithm runs in time $O(n!)$, and the best known algorithm runs in time $O(n^2 2^n)$.</p>`,
};

E.w2RGnHamilton = {
  id: 'w2-r-gn-hamilton', title: 'Theorem: G(2,n) has a Hamilton cycle', slides: ['2R32', '2R33', '2R34', '2R35', '2R36'], checklist: ['w2c14'],
  html: String.raw`
<div class="box theorem">
  <span class="box-label">Theorem {{2R32}}</span>
  <p>For every $n \ge 2$, the [[de-bruijn-graph|De Bruijn graph]] $G_{2,n}$ has a ==[[hamiltonian-cycle|Hamilton cycle]]==.</p>
</div>
<details class="proof" open><summary>Proof {{2R33}} {{2R34}} {{2R35}} {{2R36}}</summary>
<p>As seen in class (property 5), $G_{2,n-1}$ contains an [[euler-cycle|Euler cycle]]. Denote it $C = e_1, e_2, \dots, e_{2^{n-1}}, e_1$. Every [[edge]] in the cycle is a word of length $n-1$ over the alphabet, so every edge corresponds to a [[vertex]] of $G_{2,n}$. Explicitly, the [[path]] $C' = v_1, v_2, \dots, v_{2^{n-1}}, v_1$ exists in $G_{2,n}$, and as such is a Hamiltonian cycle {{2R33}}.</p>
<p>The length of $C$ is $2^{n-1} = |V_{2,n}|$. Every edge in $C$ appears once, thus each vertex in $C'$ appears at most once. Goal: show that there is an edge between every two vertices in $C'$ {{2R34}}.</p>
<p>Let $e_i = a_1, \dots, a_{n-1}$ and $e_{i+1} = a_2, \dots, a_n$ be two consecutive edges in $G_{2,n-1}$: $e_i$ goes from $a_1 \dots a_{n-2}$ to $a_2 \dots a_{n-1}$, and $e_{i+1}$ from $a_2 \dots a_{n-1}$ to $a_3 \dots a_n$ {{2R35}}. Then the [[cycle]] $C'$ works: the nodes $v_i = a_1 \dots a_{n-1}$ and $v_{i+1} = a_2 \dots a_n$ are joined in $G_{2,n}$ by the edge $a_1 \dots a_n$ {{2R36}}.</p>
</details>
<aside class="callout caution">
  <span class="callout-title">⚠️ Two words on these slides</span>
  <p>"An edge between every two vertices in $C'$" {{2R34}} means every two ==consecutive== vertices of $C'$, as the proof then shows. And "the nodes $v_i$ and $v_{i+1}$ are incident" {{2R36}} means [[adjacent]]: in the course, "[[incident]]" relates an edge to its endpoints. {{added}}</p>
</aside>`,
};

E.w2REx4 = {
  id: 'w2-r-ex4', title: 'Exercise 4: Euler cycle, Hamiltonian cycle, both or neither', exercise: true, slides: ['2R37', '2R38', '2R39', '2R40'], checklist: ['w2c14'],
  html: String.raw`
<p>Give an example of the following undirected [[graph|graphs]]. The slides' answers:</p>
<ol>
  <li>No [[hamiltonian-cycle|Hamiltonian cycle]] and no [[euler-cycle|Euler cycle]] {{2R37}}. (Each is a kind of [[cycle]].)</li>
  <li>A Hamiltonian cycle but no Euler cycle {{2R38}}; the slide highlights the cycle $0, 1, 3, 2, 0$.</li>
  <li>No Hamiltonian cycle but an Euler cycle {{2R39}}.</li>
  <li>Both a Hamiltonian cycle and an Euler cycle {{2R40}}.</li>
</ol>
<p>Check each one below; the answers are computed from the [[edge|edges]].</p>
<div class="ex-mount" data-ex="eulerOrHamilton" data-graphs="2R37,2R38,2R39,2R40"></div>`,
};
