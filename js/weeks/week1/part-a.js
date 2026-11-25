/* Part A: Lecture 1 entries (order is set in week.js).
   Writing syntax is documented at the top of js/course.js. */
window.E = window.E || {};

E.complexity = {
  id: 'complexity', title: 'Types of complexity', slides: ['L7', 'L8', 'L4', 'L5', 'L6'], checklist: [],
  html: String.raw`
<p>An algorithm should be correct and efficient, and simple if possible {{L7}}. To talk about efficiency we need a way to measure it. ==Processing time is surely a bad measure== {{L8}}, because it depends on the machine {{L10}}. We need a stable measure, <strong class="crucial">independent</strong> of the implementation {{L8}}.</p>

<div class="box definition">
  <span class="box-label">Definition</span>
  <p>A <dfn data-term="complexity-function">complexity function</dfn> is a function $T: N \to N$. $T(n)$ is the number of operations the algorithm does on an input of size $n$.</p>
</div>

<p>Good inputs and bad inputs should be analyzed separately. Three different things can be measured:</p>
<ul>
  <li><dfn data-term="worst-case">Worst-case</dfn> complexity: the largest number of operations over all inputs of size $n$. {{added}}</li>
  <li><strong>Best-case</strong> complexity: the smallest number of operations over all inputs of size $n$. {{added}}</li>
  <li><strong>Average-case</strong> complexity: the average number of operations over the inputs of size $n$. {{added}}</li>
</ul>
<aside class="callout example">
  <span class="callout-title">Example {{added}}</span>
  <p>Searching for a value in an unsorted array of $n$ cells takes 1 comparison in the best case (it is in the first cell) and $n$ comparisons in the worst case (it is last or missing).</p>
</aside>
<aside class="callout intuition">
  <span class="callout-title">Before the content: what the course is for {{L4}} {{L5}} {{L6}}</span>
  <p><strong>Course goals {{L4}}:</strong> a better sense of how to model problems you encounter as well-known algorithmic problems; a deeper understanding of the issues and tradeoffs in algorithm design; a large toolbox of classical algorithms, concepts and techniques; an appreciation for applications in the real world. And fun and beauty.</p>
  <p><strong>Applied algorithm scenario {{L5}}:</strong> real world problem → abstractly model the problem → find an abstract algorithm → adapt to the original problem.</p>
  <p><strong>Modeling {{L6}}:</strong> What kind of algorithm is needed? Can I find an algorithm, or do I have to invent one? Can I "tune" an existing algorithm? Does it remind me of a familiar problem?</p>
</aside>`,
};

E.ram = {
  id: 'ram', title: 'The RAM model of computation', slides: ['L9'], checklist: [],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Definition</span>
  <p>In the <dfn data-term="ram-model">RAM model</dfn>:</p>
  <ul>
    <li>Each simple operation takes 1 time step.</li>
    <li>Loops and subroutines are <strong class="crucial">not</strong> simple operations.</li>
    <li>Each memory access takes one time step, and there is no shortage of memory.</li>
  </ul>
  <p>For a given problem instance, the <strong>running time</strong> of an algorithm is the number of RAM steps, and the <strong>space</strong> it uses is the number of RAM memory cells.</p>
</div>
<p>Real computers don't behave exactly like this. {{added}} It is a useful abstraction: ==it allows us to analyze algorithms in a machine independent fashion== {{L9}}.</p>`,
};

E.bigo = {
  id: 'big-o', title: 'Big O notation and growth rates', slides: ['L10', 'L11'], checklist: ['c4', 'c7'],
  html: String.raw`
<p>The goal is a stable measurement independent of the machine. The way to get it: ==ignore constant factors== {{L10}}.</p>

<div class="box definition">
  <span class="box-label">Definition</span>
  <p><dfn data-term="big-o">$f(n) = O(g(n))$</dfn> if $c \cdot g(n)$ is an upper bound on $f(n)$. That is, there exist $c, N$ such that for any $n \ge N$:</p>
  $$f(n) \le c \cdot g(n)$$
</div>

<aside class="callout caution">
  <span class="callout-title">Likely typo on slide 10</span>
  <p>The slide reads "for any $n \in N$". The bound has to hold from some point on, so it should read $n \ge N$, as above.</p>
</aside>

<div class="fig-mount" data-widget="bigO"></div>

<aside class="callout intuition">
  <span class="callout-title">Why ignoring constants is enough</span>
  <p>Even by ignoring constant factors, ==we can get an excellent idea of whether an algorithm will run in a reasonable amount of time==. Big O and [[worst-case]] analysis greatly simplify comparing the efficiency of algorithms {{L11}}.</p>
</aside>`,
};

E.anagram = {
  id: 'anagram', title: 'The Anagram problem: three solutions', algo: true,
  slides: ['L14', 'L15', 'L16', 'L17', 'L18', 'L19', 'L20', 'L21', 'L22', 'L23', 'L24', 'L25'], checklist: [],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Problem {{L14}}</span>
  <p>You are given a 70,000-word dictionary. Write an anagram utility that, given a word as input, returns all anagrams of that word appearing in the dictionary.</p>
  <p>Examples {{L15}}: input CAT gives ACT, CAT, TAC. Input SUBESSENTIAL gives SUITABLENESS.</p>
</div>

<h3>Solution 1: Impatient Hacker {{L16}}</h3>
<p>Loop through all possible ways of rearranging the input word. Use binary search to look up each resulting word in the dictionary, and output it if found.</p>
<p>On the input "microphotographic" the loop runs $17! \gg 3 \cdot 10^{14}$ times. Even at one microsecond per iteration that is $3 \cdot 10^8$ seconds: ==about a decade== {{L17}}.</p>

<h3>Solution 2: "Expert" Hacker {{L18}}</h3>
<p>A subroutine ANAGRAM(X,Y) returns TRUE if X and Y are anagrams, by sorting the letters of both. Input X, loop through all dictionary words Y, and output Y if ANAGRAM(X,Y). Comparing with each of the 70,000 entries takes several seconds. The hacker is satisfied.</p>

<h3>Solution 3: The master {{L19}} {{L20}}</h3>
<p>The master's program has the minimal possible time complexity. The trick: ==don't keep the dictionary in sorted order==. Rearrange it into anagram classes.</p>

<div class="box definition">
  <span class="box-label">Definition</span>
  <p>The <dfn data-term="signature">signature</dfn> of a word is the word with its letters sorted {{L22}}. An <dfn data-term="anagram-class">anagram class</dfn> is a group of dictionary words with the same signature {{L20}} {{added}}.</p>
</div>

<div class="algo-mount" data-anagram></div>

<aside class="callout intuition">
  <span class="callout-title">Binary search {{added}}</span>
  <p>The slides name binary search but give no steps. The animation compares X with the middle signature and continues in one half of the list. When it finds a match, it outputs all the neighbors with that signature. CAT is on slide 24, but none of its anagrams are in the 7-word dictionary of slide 21, so its output is empty here.</p>
</aside>

<h3>Comparing the three solutions {{L25}}</h3>
<p>For a dictionary of $n$ words, input word $W$, and $Z$ output words:</p>
<div class="table-wrap"><table class="model">
  <thead><tr><th>Solution</th><th>Time</th></tr></thead>
  <tbody>
    <tr><td>1. Impatient Hacker</td><td>$O(|W|! \cdot \log n)$</td></tr>
    <tr><td>2. "Expert" Hacker</td><td>$O(n|W|)$</td></tr>
    <tr><td>3. The master</td><td>$O(\log n + Z|W|)$</td></tr>
  </tbody>
</table></div>
<p>Solution 3 costs ==output size + one Find operation==, and we cannot expect to do significantly better; a hash table for the signatures reduces $O(\log n)$ to $O(1)$ {{L25}}. The query takes about $\log_2(70000) \times 25$ microseconds, roughly 0.0004 seconds {{L24}}. All three times are [[big-o]] bounds {{L25}}.</p>`,
  init(root) { AnagramView.mount(root.querySelector('[data-anagram]')); },
};

E.preprocessing = {
  id: 'preprocessing', title: 'Add to toolbox: preprocessing', slides: ['L26', 'L27', 'L12', 'L13'], checklist: [],
  html: String.raw`
<p>The master's solution needs the dictionary rearranged first, and that takes about 20 seconds. It is perfectly fair to think of this as programming time: building the dictionary is ==a one-time cost that is part of writing the program== {{L26}}.</p>
<div class="box definition">
  <span class="box-label">Definition</span>
  <p><dfn data-term="preprocessing">Preprocessing</dfn>: it is sometimes possible to pay a reasonable, one-time preprocessing cost to reorganize your data in such a way as to use it more efficiently later. The extra time can be thought of as additional programming effort {{L27}}.</p>
</div>
<p>The [[signature]] table is exactly this: pay once to sort, then every query is fast. {{added}}</p>
<aside class="callout intuition">
  <span class="callout-title">Learning tip from the lecture</span>
  <p>When presented with multiple solutions, don't remember only the easiest one. The expert learner ==thinks through the similarities and differences between the approaches== {{L13}}.</p>
</aside>
<p><strong>Your goal {{L12}}:</strong> build a toolbox of abstract structures and concepts. ==Know the capacities and limits of each tool.==</p>`,
};

E.directed = {
  id: 'directed', title: 'Directed vs undirected graphs', slides: ['L42', 'L43'], checklist: ['c1'],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Definition</span>
  <p>In a <dfn data-term="directed-graph">directed graph</dfn> <span class="syn">(also called a digraph)</span>, the order of the nodes in every pair matters: $(v_1, v_2) \ne (v_2, v_1)$.</p>
  <p>In an <dfn data-term="undirected-graph">undirected graph</dfn>, $(v_1, v_2) = (v_2, v_1)$: the order of the nodes in every pair does <strong class="crucial">not</strong> matter.</p>
</div>
<div class="fig-row">
  <figure><div data-fig="l43d" data-alt="Directed graph with edges in both directions between v1 and v2"></div><figcaption>Directed: $(v_1, v_2)$ and $(v_2, v_1)$ are two different edges.</figcaption></figure>
  <figure><div data-fig="l43u" data-alt="Undirected path on v1, v2, v3"></div><figcaption>Undirected: one line per pair, no arrows.</figcaption></figure>
</div>
<h3>Reading a graph as sets {{L42}}</h3>
<p>Here is a directed [[graph]] $G = (V, E)$. Each [[edge]] is a pair $(v_1, v_2)$, where $v_1, v_2$ are [[vertex|vertices]] in $V$:</p>
<div class="fig-solo"><div data-fig="l42" data-alt="Directed graph on A to F"></div></div>
$$V = \{A, B, C, D, E, F\}$$
$$E = \{(A,B), (A,D), (B,C), (C,D), (C,E), (D,E)\}$$
<p>$F$ is a vertex with no edges at all. That's allowed. {{added}}</p>`,
};

E.adjacent = {
  id: 'adjacent', title: 'Adjacent and incident', slides: ['L44', 'L45'], checklist: ['c1'],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Definition</span>
  <p>Two [[vertex|vertices]] $u$ and $v$ are <dfn data-term="adjacent">adjacent</dfn> in an [[undirected-graph|undirected graph]] $G$ if $(u, v)$ is an [[edge]] in $G$.</p>
  <p>The edge $e = (u, v)$ is <dfn data-term="incident">incident</dfn> with vertex $u$ and with vertex $v$.</p>
</div>
<p>==Adjacent relates vertex to vertex. Incident relates an edge to a vertex.== {{added}}</p>
<div class="playground"><div data-fig="l45" data-alt="Undirected graph from slide 45"></div></div>`,
};

E.degree = {
  id: 'degree', title: 'Degree', slides: ['L44', 'L45'], checklist: ['c1'],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Definition</span>
  <p>The <dfn data-term="degree">degree</dfn> of a [[vertex]] in an [[undirected-graph|undirected graph]] is the number of [[edge|edges]] [[incident]] with it, denoted $\deg(v)$.</p>
  <p>A <dfn data-term="self-loop">self-loop</dfn>, an edge $(v, v)$, ==counts twice== because both of its ends count.</p>
</div>
<div class="playground"><div data-fig="l45d" data-alt="Undirected graph from slide 45"></div></div>
<aside class="callout example">
  <span class="callout-title">From slide 45</span>
  <p>$\deg(D) = 3$ and $\deg(F) = 0$. Hover $C$: it has three ordinary edges and a self-loop, so its degree is 5 (computed). {{added}}</p>
</aside>`,
};

E.simple = {
  id: 'simple', title: 'Simple undirected graph', slides: ['L44'], checklist: [],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Definition</span>
  <p>An [[undirected-graph|undirected graph]] is <dfn data-term="simple-graph">simple</dfn> if there are <strong class="crucial">no</strong> [[self-loop|self-loops]] and <strong class="crucial">no</strong> <dfn data-term="parallel-edges">parallel edges</dfn> (several [[edge|edges]] between the same two [[vertex|vertices]]).</p>
</div>
<div class="fig-solo"><div data-fig="l44" data-alt="Parallel edges between u and v, and a self-loop at v"></div></div>
<p class="fig-note">Not simple: two parallel edges $(u, v)$ and a self-loop $(v, v)$.</p>`,
};

E.initial = {
  id: 'initial', title: 'Initial and terminal vertex', slides: ['L46', 'L47'], checklist: [],
  html: String.raw`
<p>In a [[directed-graph|directed graph]], an [[edge]] $(u, v)$ goes from $u$ to $v$.</p>
<div class="box definition">
  <span class="box-label">Definition</span>
  <ul>
    <li>[[vertex|Vertex]] $u$ is the <dfn data-term="initial-vertex">initial</dfn> <span class="syn">(or source)</span> vertex of $(u, v)$.</li>
    <li>Vertex $v$ is the <dfn data-term="terminal-vertex">terminal</dfn> <span class="syn">(or target, or end)</span> vertex of $(u, v)$.</li>
  </ul>
</div>
<aside class="callout caution">
  <span class="callout-title">Two meanings of "source"</span>
  <p>Here "source" describes one end of <em>an edge</em>. Later, a source will mean <em>a vertex with no incoming edges</em> at all. They are different ideas with the same word. {{added}}</p>
</aside>`,
};

E.inout = {
  id: 'inout', title: 'In-degree and out-degree', slides: ['L46', 'L47'], checklist: ['c1'],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Definition</span>
  <p>In a [[directed-graph|directed graph]]:</p>
  <ul>
    <li><dfn data-term="in-degree">In-degree</dfn> is the number of [[edge|edges]] with the [[vertex]] as the [[terminal-vertex|terminal vertex]]: ==arrows coming in==.</li>
    <li><dfn data-term="out-degree">Out-degree</dfn> is the number of edges with the vertex as the [[initial-vertex|initial vertex]]: ==arrows going out==.</li>
  </ul>
</div>
<div class="playground"><div data-fig="l47" data-alt="Directed graph from slide 47"></div></div>
<aside class="callout example">
  <span class="callout-title">From slide 47</span>
  <p>$D$ has in-degree 2 and out-degree 1. $F$ has in-degree 0 and out-degree 0.</p>
</aside>`,
};

E.simpledi = {
  id: 'simple-directed', title: 'Simple directed graph', slides: ['L46'], checklist: [],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Definition</span>
  <p>A [[directed-graph|directed graph]] is <dfn data-term="simple-digraph">simple</dfn> if there are <strong class="crucial">no</strong> [[self-loop|self loops]] and <strong class="crucial">no</strong> [[parallel-edges|parallel edges]].</p>
</div>
<div class="fig-solo"><div data-fig="l46" data-alt="Directed parallel edges and a self-loop"></div></div>
<p class="fig-note">Not simple: two parallel [[edge|edges]] from $u$ to $v$ and a self-loop at $v$. See also the recitation's note on opposite edges in Part B.</p>`,
};

E.families = {
  id: 'families', title: 'Path, cycle, clique, star', slides: ['L48'], checklist: ['c2'],
  html: String.raw`
<p>Slide 48 names these basic [[graph]] families; their definitions were given in class, so the wording below is {{added}}.</p>
<div class="box definition">
  <span class="box-label">Definition</span>
  <ul>
    <li>A <dfn data-term="path-graph">path</dfn> $P_n$: $n$ [[vertex|vertices]] in a line, each joined to the next. It has $n - 1$ [[edge|edges]].</li>
    <li>A <dfn data-term="cycle-graph">cycle</dfn> $C_n$, defined for <strong class="crucial">$n \ge 3$</strong>: $n$ vertices in a ring. It has $n$ edges.</li>
    <li>A <dfn data-term="clique">complete graph (clique)</dfn> $K_n$: every pair of vertices is connected by an edge.</li>
    <li>A <dfn data-term="star">star</dfn> $S_n$: one center joined to $n$ other vertices. Slide 48 says a star is $K_{1,n}$, so $S_n$ has $n + 1$ vertices.</li>
  </ul>
</div>
<div class="fig-mount" data-widget="family"></div>`,
};

E.bipartite = {
  id: 'bipartite', title: 'Bipartite graph', slides: ['L48'], checklist: ['c2'],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Definition</span>
  <p>A <dfn data-term="bipartite">bipartite</dfn> [[graph]] is $G = (V_1, V_2, E)$ where for <strong class="crucial">every</strong> [[edge]] $e = (u, v)$: $u \in V_1$ and $v \in V_2$.</p>
</div>
<p>The [[vertex|vertices]] split into two sides, and ==edges only cross between the sides==. No edge stays inside one side.</p>`,
};

E.kab = {
  id: 'complete-bipartite', title: 'Complete bipartite graph', slides: ['L48', 'R20'], checklist: ['c2'],
  exercise: true,
  html: String.raw`
<div class="box definition">
  <span class="box-label">Definition</span>
  <p>A <dfn data-term="complete-bipartite">complete bipartite</dfn> [[graph]] $K_{a,b}$ is a [[bipartite]] graph in which $E = V_1 \times V_2$, so $|E| = ab$.</p>
</div>
<div class="fig-mount" data-widget="kab"></div>
<ul>
  <li>Note from slide 48: a [[star]] is a complete bipartite $K_{1,n}$.</li>
  <li>Note from slide 48: a [[path-graph|path]] is bipartite.</li>
  <li>"What about a [[cycle-graph|cycle]]?" ==$C_n$ is bipartite exactly when $n$ is even.== {{added}} Try $C_4$ and $C_5$ below.</li>
</ul>
<p>Slide 48 names these families but draws none of them: the graphs $P_5$, $C_4$, $C_5$, $S_4$ and $K_{2,3}$ below are drawn here. {{added}} The last one is the third [[graph]] of {{R20}}, with its [[vertex|vertices]] numbered here. {{added}}</p>
<div class="ex-mount" data-ex="twoColor"></div>`,
};

E.handshake = {
  id: 'handshaking', title: 'Handshaking Theorem', slides: ['L49', 'R25'], checklist: ['c3'],
  exercise: true,
  html: String.raw`
<div class="box theorem">
  <span class="box-label">Theorem</span>
  <p>The <dfn data-term="handshaking">Handshaking Theorem</dfn>: let $G = (V, E)$ be an [[undirected-graph|undirected graph]]. Then</p>
  $$\sum_{v \in V} \deg(v) = 2 \cdot |E|$$
</div>
<details class="proof" open><summary>Proof</summary>
  <p>Every [[edge]] contributes $+1$ to the [[degree]] of each of the two [[vertex|vertices]] it is [[incident]] with. <span class="qed">∎</span></p>
</details>
<ul>
  <li>The number of edges is exactly half the sum of $\deg(v)$.</li>
  <li>Note: the sum of the $\deg(v)$ values ==must be even==.</li>
</ul>

<div class="box theorem">
  <span class="box-label">In a digraph {{added}}</span>
  <p>The checklist also asks for the [[directed-graph|digraph]] version, which no slide states:</p>
  $$\sum_{v \in V} \text{in-deg}(v) = \sum_{v \in V} \text{out-deg}(v) = |E|$$
</div>
<details class="proof" open><summary>Proof {{added}}</summary>
  <p>Every edge $(u, v)$ adds exactly 1 to the [[out-degree]] of $u$ and exactly 1 to the [[in-degree]] of $v$. Summing over all edges gives $|E|$ for each sum. <span class="qed">∎</span></p>
</details>

<div class="ex-mount" data-ex="handshake"></div>
<aside class="callout intuition">
  <span class="callout-title">Why it matters {{added}}</span>
  <p>Slide 49 asks what the importance of this theorem is. One answer: when an algorithm visits every vertex and walks through all of its edges, the total work is proportional to $\sum \deg(v) = 2m$. That is why running times like $O(n + m)$ appear.</p>
</aside>`,
};

E.notation = {
  id: 'notation', title: 'Notation: n and m', slides: ['L50'], checklist: ['c1'],
  html: String.raw`
<p>Space and time of [[graph]] algorithms are analyzed in terms of two numbers:</p>
<div class="box definition">
  <span class="box-label">Notation</span>
  <ul>
    <li>Number of [[vertex|vertices]]: $n = |V|$</li>
    <li>Number of [[edge|edges]]: $m = |E|$</li>
  </ul>
</div>
<p>There are at least two ways of representing graphs: the adjacency matrix and the adjacency list. They come next.</p>`,
};

E.matrix = {
  id: 'adjacency-matrix', title: 'Adjacency matrix', slides: ['L51', 'L52'], checklist: ['c4'],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Definition</span>
  <p>The <dfn data-term="adjacency-matrix">adjacency matrix</dfn> of a [[graph]] is the $|V| \times |V|$ table:</p>
  $$M(v, w) = \begin{cases} 1 & \text{if } (v, w) \in E \\ 0 & \text{otherwise} \end{cases}$$
</div>
<ul>
  <li>==Space $= |V|^2$==, so $O(n^2)$, no matter how few [[edge|edges]] there are {{added}}.</li>
  <li>In an [[undirected-graph|undirected graph]] each edge fills <strong>two</strong> cells, $(v, w)$ and $(w, v)$ {{L51}}.</li>
  <li>In a [[directed-graph|digraph]] each edge fills <strong>one</strong> cell {{L52}}.</li>
</ul>`,
};

E.list = {
  id: 'adjacency-list', title: 'Adjacency list', slides: ['L53', 'L54'], checklist: ['c4'],
  exercise: true,
  html: String.raw`
<div class="box definition">
  <span class="box-label">Definition</span>
  <p>In the <dfn data-term="adjacency-list">adjacency list</dfn> representation, for each $v \in V$, $L(v)$ is a linked list of all $w$ such that $(v, w)$ is in $E$.</p>
</div>
<div class="table-wrap"><table class="model">
  <thead><tr><th></th><th>Space</th><th>Why</th><th>Slide</th></tr></thead>
  <tbody>
    <tr><td>[[undirected-graph|Undirected]]</td><td>$a|V| + 2b|E|$</td><td>each [[edge]] is in two lists {{added}}</td><td>{{L53}}</td></tr>
    <tr><td>[[directed-graph|Digraph]]</td><td>$a|V| + b|E|$</td><td>each edge is in one list {{added}}</td><td>{{L54}}</td></tr>
  </tbody>
</table></div>
<p>Here $a$ is the size of an array cell and $b$ the size of a list cell. Since $a$ and $b$ are constants {{added}}, ==the space is $O(n + m)$==, compared with $O(n^2)$ for the [[adjacency-matrix|adjacency matrix]]. This uses the [[big-o]] rule of ignoring constant factors {{L10}}.</p>
<div class="ex-mount" data-ex="represent"></div>
<aside class="callout caution">
  <span class="callout-title">⚠️ Two different digraphs</span>
  <p>The digraph on {{L54}} is not the one on {{L52}}: {{L54}} has $C \to E$ (so $C$'s list is $D, E$ and $E$'s list is empty), while {{L52}} draws $E \to C$. The exercises use the [[graph]] of {{L52}}. {{added}}</p>
</aside>`,
};

E.toposort = {
  id: 'topological-sort', title: 'Topological sort', slides: ['L38', 'L55', 'L56'], checklist: ['c5'],
  html: String.raw`
<p>In order to take a course, you must take <strong class="crucial">all</strong> of its prerequisites first. Problem: find an order in which all the courses can be taken {{L55}}.</p>
<div class="box definition">
  <span class="box-label">Definition</span>
  <p>Given a [[directed-graph|directed graph]] $G = (V, E)$, a <dfn data-term="topo-sort">topological sort</dfn> is a linear ordering of its [[vertex|vertices]] such that for <strong class="crucial">any</strong> [[edge]] $(v, w) \in E$, ==$v$ precedes $w$ in the ordering==.</p>
</div>
<aside class="callout example">
  <span class="callout-title">From slide 55</span>
  <p>One valid order of the courses: 142, 143, 378, 370, 321, 341, 322, 326, 421, 401.</p>
</aside>`,
};

E.valid = {
  id: 'valid-orders', title: 'Valid and invalid topo-sorts', slides: ['L57', 'L58'], checklist: ['c5', 'c8'],
  exercise: true,
  html: String.raw`
<p>Write the [[vertex|vertices]] of a [[topo-sort|topological sort]] on a line and draw the [[edge|edges]] as arrows:</p>
<ul>
  <li>Any linear ordering in which ==all the arrows go to the right== is a valid solution {{L57}}.</li>
  <li>Any linear ordering in which an arrow goes to the <strong class="crucial">left</strong> is not a valid solution {{L58}}.</li>
</ul>
<p>In general, the solution is ==not necessarily unique==. On slide 57, $F$ can go anywhere in the list because it is not connected to anything.</p>
<div class="ex-mount" data-ex="order"></div>`,
};

E.pathcycle = {
  id: 'paths-cycles', title: 'Paths, cycles and acyclic graphs', slides: ['L59', 'L60'], checklist: ['c6'],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Definition</span>
  <p>Given a [[directed-graph|digraph]] $G = (V, E)$, a <dfn data-term="path">path</dfn> is a sequence of [[vertex|vertices]] $v_1, v_2, …, v_k$ such that $(v_i, v_{i+1}) \in E$ for all $1 \le i < k$.</p>
  <p>A path is a <dfn data-term="cycle">cycle</dfn> if $k > 1$ and $v_1 = v_k$.</p>
  <p>$G$ is <dfn data-term="acyclic">acyclic</dfn> if it has no cycles.</p>
</div>
<div class="fig-solo"><div data-fig="l59" data-alt="Cycle A, B, C, D"></div></div>
<p class="fig-note">Example from slide 59: the cycle $A, B, C, D, A$.</p>
<div class="fig-mount" data-widget="pathWalker"></div>
<p>More examples {{L60}}: $P_1 = F, D, C, B, E$ ==is a path==; $P_2 = F, D, C, B, A$ ==is not a path==; $P_3 = E, D, C, B, E$ ==is a cycle==.</p>
<p>Paths can also be described by a sequence of [[edge|edges]]. For example, $P_3$ can be described as $e_3, e_8, e_7, e_9$.</p>
<aside class="callout caution">
  <span class="callout-title">Likely typo on slide 60</span>
  <p>The slide also writes $P_3$ as $E \xrightarrow{e_1} D \xrightarrow{e_8} C \xrightarrow{e_7} B \xrightarrow{e_9} E$. The first edge should be $e_3$, because $e_1$ is the edge from $F$ to $D$.</p>
</aside>
<aside class="callout caution">
  <span class="callout-title">Don't mix these up</span>
  <p>A path here is a <em>sequence inside a [[graph]]</em>, and it may repeat vertices. The [[path-graph|graph $P_n$]] is a <em>whole graph</em>. The recitation adds the term "simple path" for a path without repeats. {{added}}</p>
</aside>`,
};

E.onlyacyclic = {
  id: 'only-acyclic', title: 'Only acyclic graphs can be sorted', slides: ['L61'], checklist: ['c6'],
  html: String.raw`
<div class="box theorem">
  <span class="box-label">Fact</span>
  <p>A [[directed-graph|directed graph]] with a [[cycle]] <strong class="crucial">cannot</strong> be topologically sorted.</p>
</div>
<div class="fig-solo"><div data-fig="l61" data-alt="Graph with the cycle A, B, C, D highlighted"></div></div>
<p class="fig-note">There is no valid ordering of $A, B, C, D$ {{L61}}.</p>
<p>Whichever [[vertex]] of the cycle you place first, the [[edge]] entering it would have to point left, which a [[topo-sort|topological sort]] does not allow. {{added}} The full proof is in Part B.</p>`,
};

E.source = {
  id: 'source', title: 'Source and DAG', slides: ['L62', 'L63'], checklist: ['c6', 'c7'],
  html: String.raw`
<div class="box definition">
  <span class="box-label">Definition</span>
  <p>A [[vertex]] with no incoming [[edge|edges]] has [[in-degree]] zero. Such a vertex is called <dfn data-term="source">a source</dfn> {{L62}}.</p>
  <p>A <dfn data-term="dag">DAG</dfn> is a directed [[acyclic]] [[graph]]. {{L63}} uses the name ("not a DAG"); the expansion is on {{R27}}.</p>
</div>
<div class="fig-solo"><div data-fig="l62" data-alt="Graph with sources A and F highlighted"></div></div>
<p class="fig-note">$A$ and $F$ are the sources of this graph.</p>
<p>If <strong class="crucial">no</strong> source exists, the graph includes a [[cycle]], and a [[topo-sort|topological sort]] is not possible {{L63}}.</p>
<aside class="callout caution">
  <span class="callout-title">It only works in one direction</span>
  <p>No source means there is a cycle. But ==having a source does <strong>not</strong> mean there is no cycle==: on {{L61}}, $F$ is a source and the graph still has the cycle $A, B, C, D$. {{added}}</p>
</aside>`,
};

E.removal = {
  id: 'source-removal', title: 'Topo-sort by removing sources', algo: true, exercise: true,
  slides: ['L62', 'L63', 'L64', 'L65', 'L66', 'L67', 'L68', 'L69', 'L70', 'L71'], checklist: ['c7', 'c8'],
  html: String.raw`
<p>The idea of the [[topo-sort|topological sort]] algorithm, before any data structure: ==keep taking a [[source]] out of the [[graph]]==.</p>
<div class="algo-mount" data-algo="sourceRemoval"></div>
<aside class="callout intuition">
  <span class="callout-title">Yes, we could select F earlier</span>
  <p>$F$ could be selected in any step. ==The topological sort is not necessarily unique== {{L70}}. The animation always picks the first source in alphabetical order, which reproduces the slides' run.</p>
</aside>
<div class="ex-mount" data-ex="byHand"></div>`,
};

E.impl = {
  id: 'implementation', title: 'Implementation setup', slides: ['L72', 'L73'], checklist: ['c7'],
  html: String.raw`
<p>To turn the idea into a program, assume the [[graph]] is given in the [[adjacency-list|adjacency list]] representation {{L72}}.</p>
<div class="box definition">
  <span class="box-label">Definition</span>
  <p>A <dfn data-term="translation-array">translation array</dfn> maps the [[vertex|vertices]] to the numbers $1…n$, for example $A \to 1, B \to 2, …$, {{L72}}, so that arrays can be indexed by vertex number. {{added}}</p>
</div>
<p>Each list cell has two fields, ==value and next== {{L72}}. We also keep an [[in-degree]] array $D$; alternatively, add a field to array $A$ {{L73}}.</p>`,
};

E.indeg = {
  id: 'calculate-in-degrees', title: 'Calculate in-degrees', algo: true, slides: ['L73', 'L74'], checklist: ['c7'],
  html: String.raw`
<p>Before the sort starts, walk through every [[adjacency-list|adjacency list]]. Each list cell is an [[edge]] entering the [[vertex]] it names, so it adds 1 to that vertex's [[in-degree]]. {{added}}</p>
<div class="algo-mount" data-algo="indegree"></div>
<aside class="callout intuition">
  <span class="callout-title">Time complexity: $O(n + m)$ {{L74}}</span>
  <p>The two for loops take $O(n)$ in total, and the inner while loop runs once per list cell, so $O(m)$ overall. {{added}}</p>
</aside>`,
};

E.analysis = {
  id: 'analysis', title: 'Running-time analysis', slides: ['L78', 'L79'], checklist: ['c7'],
  html: String.raw`
<div class="table-wrap"><table class="model">
  <thead><tr><th>Step</th><th>Time {{L79}}</th></tr></thead>
  <tbody>
    <tr><td>Initialize the [[in-degree]] array</td><td>$O(|V| + |E|)$</td></tr>
    <tr><td>Initialize the queue with [[source]] [[vertex|vertices]]</td><td>$O(|V|)$</td></tr>
    <tr><td>Dequeue and output: $|V|$ vertices, $O(1)$ each</td><td>$O(|V|)$</td></tr>
    <tr><td>Reduce the in-degree of [[adjacent]] vertices and enqueue those that reach 0</td><td>$O(|E|)$, the total [[out-degree]] of all vertices</td></tr>
  </tbody>
</table></div>
<div class="box theorem">
  <span class="box-label">Result</span>
  <p>For input [[graph]] $G = (V, E)$, the total run time of [[topo-sort|topological sort]] is $O(|V| + |E|)$: ==linear time==.</p>
</div>
<aside class="callout caution">
  <span class="callout-title">Read slide 78 carefully</span>
  <p>"Time complexity? $O(\text{out\_degree}(x))$" is the cost of <strong>one</strong> pass of the main loop, for the vertex $x$ that was just removed. Adding that up over all vertices gives the $O(|E|)$ above. {{added}}</p>
</aside>
<aside class="callout intuition">
  <span class="callout-title">Why adjacency lists matter {{added}}</span>
  <p>With an [[adjacency-list|adjacency list]], visiting the neighbors of $x$ costs only its out-degree. With an [[adjacency-matrix|adjacency matrix]], it would cost a scan of a whole row, $n$ cells per vertex, for $O(n^2)$ in total.</p>
</aside>`,
};

E.stack = {
  id: 'topo-stack', title: 'Topo-sort with a stack', algo: true, slides: ['L80', 'R33'], checklist: ['c7', 'c8'],
  html: String.raw`
<p>The [[source|sources]] can be kept in a stack instead of a queue: after each [[vertex]] is output, <em>push</em> any vertex whose [[in-degree]] becomes zero {{L80}}. The result is a ==different valid== [[topo-sort|topological sort]].</p>
<p>{{L80}} describes the stack version in words only. The code in the animation is {{L78}}'s, with Pop and Push in place of Dequeue and Enqueue. {{added}}</p>
<div class="algo-mount" data-algo="toposort" data-mode="stack"></div>
<aside class="callout intuition">
  <span class="callout-title">What decides which order you get?</span>
  <p>The output depends on the implementation in three ways. Try each switch above:</p>
  <ul>
    <li><strong>Queue or stack.</strong> On {{L76}} the queue gives 1,6,2,3,4,5; on {{L80}} the stack gives 1,2,3,4,5,6.</li>
    <li><strong>The order the sources go in.</strong> Slide 80 assumes push(6) and then push(1). A plain "for i = 1 to n" loop pushes 1 first, so 6 comes out first and the output is 6,1,2,3,4,5. {{added}}</li>
    <li><strong>The order inside the [[adjacency-list|adjacency lists]].</strong> Reversing them on the recitation [[graph]] gives S,B,A,D,C,F,E with a queue. {{added}}</li>
  </ul>
</aside>`,
};
