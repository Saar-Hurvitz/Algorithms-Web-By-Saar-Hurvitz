/* Week 1: this file sets the order of the week. Most entries live in part-a.js
   and part-b.js. The writing syntax is documented at the top of js/course.js. */

addWeek({
  n: 1,
  title: 'Graphs & Topological Sort',
  checklistNote: 'The checklist\'s last three lines (keep a notebook, Mentimeter, "can hardly wait") are not course definitions, so they have no entry.',

  decks: {
    L: { name: 'Lecture 1', kind: 'Lecture', count: 80, path: 'assets/slides/week1/lecture/L-', wide: false },
    R: { name: 'Recitation 1', kind: 'Recitation', count: 36, path: 'assets/slides/week1/recitation/R-', wide: true },
  },

  checklist: {
    c1: 'I know the notations and definitions of graphs G=(V,E), |V|=n, |E|=m. Undirected graphs: degree, connected components. Directed graphs: in-degree, out-degree, strongly connected components.',
    c2: "I'm familiar with basic graph structures (path, cycle, clique, star) and I know what a bipartite graph is.",
    c3: 'I understand and remember the Handshaking Thm in undirected graphs: Σ deg(v) = 2m. In a digraph it holds that Σ in-deg(v) = Σ out-deg(v) = m.',
    c4: 'I know the two common graph representations and understand their space complexities: 1. Adjacency Matrix O(n²), 2. Adjacency lists O(n+m).',
    c5: 'I know the definition of Topological sort and understand its meaning.',
    c6: 'I understand the proof (see recitation) that a toposort exists iff the graph is acyclic.',
    c7: 'I can find a topological sort of an acyclic graph, and I understand why it takes linear time O(n+m) when adjacency lists are used.',
    c8: 'I understand why some graphs may have several valid toposorts and I understand how the implementation of the algorithm [determines] which specific one is produced, if there are several valid toposorts.',
  },

  /* name: shown in the hover card. short: one-sentence definition (may use $math$).
     slide: where it is defined. aliases: words the dev check looks for in later entries. */
  terms: Object.assign({}, window.TERMS, {
    graph:  { name: 'Graph', short: 'A pair $G = (V, E)$: a set of vertices $V$ and a set of edges $E$ that connect vertices.', slide: 'L41', aliases: ['graph', 'graphs'] },
    vertex: { name: 'Vertex (node)', short: 'An element of $V$, one of the "things" in a graph. Vertex and node mean the same.', slide: 'L41', aliases: ['vertex', 'vertices', 'node', 'nodes'] },
    edge:   { name: 'Edge (arc)', short: 'An element of $E$: a connection between two vertices, written as the pair $(u, v)$.', slide: 'L41', aliases: ['edge', 'edges', 'arc', 'arcs'] },
    label:  { name: 'Label', short: 'Extra information attached to a vertex or an edge, such as a name, a course number or a transmission rate. L31 lists labeled and unlabeled nodes and edges; this wording is added.', slide: 'L31', aliases: ['label', 'labels', 'labeled', 'unlabeled'] },
  }),

    parts: [
    {
      id: 'A', title: 'Part A: Lecture 1', sub: 'In the order of the lecture slides',
      entries: [
        E.complexity, E.ram, E.bigo, E.anagram, E.preprocessing,
        /* ---------------------------------------------------------------- graph */
        {
          id: 'graph', title: 'What is a graph?',
          slides: ['L29', 'L30', 'L32', 'L33', 'L41', 'L35', 'L36', 'L37', 'L40'],
          checklist: ['c1'],
          html: String.raw`
<aside class="callout caution">
  <span class="callout-title">Not this kind of graph</span>
  <p>A chart of values over time, like "people in a store" {{L29}}, is also called a graph, but that is not what this course means.</p>
</aside>

<div class="box definition">
  <span class="box-label">Definition</span>
  <p>A <dfn data-term="graph">graph</dfn> $G$ is a pair $(V, E)$ where</p>
  <ul>
    <li>$V$ is a set of <dfn data-term="vertex">vertices</dfn> <span class="syn">(also called nodes)</span></li>
    <li>$E$ is a set of <dfn data-term="edge">edges</dfn> <span class="syn">(also called arcs)</span> that ==connect vertices==.</li>
  </ul>
  <p>Each edge is written as the pair of vertices it connects, for example $(A, B)$ {{L42}}.</p>
</div>

<p>Graphs consist of nodes and edges {{L30}}. Think of the vertices as the ==things== and the edges as the ==connections between things==. {{added}}</p>

<p>A graph records <strong class="crucial">only</strong> which vertices are connected. Where a vertex is drawn, how long an edge is, and whether two lines cross mean nothing. The same graph can be drawn in many different ways. {{added}}</p>

<div class="playground" data-play="graph-sets">
  <p class="playground-title">Explore $G = (V, E)$</p>
  <p class="playground-hint">Hover a vertex or an edge, either in the drawing or in the sets below it.</p>
  <div class="graph-box"></div>
  <div class="sets"></div>
  <p class="caption-live" aria-live="polite">This graph has 5 vertices and 6 edges.</p>
</div>

<h3>Why graphs?</h3>
<aside class="callout intuition">
  <span class="callout-title">You already know some graphs</span>
  <p>The data structures from earlier courses are graphs with strict rules {{L32}}:</p>
  <ul>
    <li><strong>Linked list:</strong> each node has 1 incoming edge and 1 outgoing edge.</li>
    <li><strong>Binary tree / heap:</strong> each node has 1 incoming edge and 2 outgoing edges.</li>
    <li><strong>B-tree:</strong> each node has 1 incoming edge and many outgoing edges.</li>
  </ul>
  <p>A general graph drops all of these limits, so ==graphs can model connections between any type of objects== {{L33}}.</p>
</aside>

<div class="table-wrap">
<table class="model">
  <thead><tr><th>What is modeled</th><th>Vertices</th><th>Edges</th><th>Slide</th></tr></thead>
  <tbody>
    <tr><td>Computer network</td><td>computers</td><td>links, labeled with transmission rates</td><td>{{L34}}</td></tr>
    <tr><td>Geographical map</td><td>cities</td><td>connecting highways</td><td>{{L35}}</td></tr>
    <tr><td>Electrical circuit</td><td>battery, switch, resistor…</td><td>connections</td><td>{{L36}}</td></tr>
    <tr><td>A program's statements</td><td>statements $S_1 … S_6$</td><td>"must execute before"</td><td>{{L37}}</td></tr>
    <tr><td>University courses</td><td>courses</td><td>prerequisites</td><td>{{L38}}</td></tr>
    <tr><td>World Wide Web</td><td>sites</td><td>links</td><td>{{L39}}</td></tr>
    <tr><td>Social network</td><td>people</td><td>friendships {{added}}</td><td>{{L40}}</td></tr>
  </tbody>
</table>
</div>

<aside class="callout example">
  <span class="callout-title">Precedence constraints {{L37}}</span>
  <p>Statements $S_1$: a=0; $S_2$: b=1; $S_3$: c=a+1; $S_4$: d=b+a; $S_5$: e=d+1; $S_6$: f=c+d. Nodes are statements and edges are precedence requirements. Which statements must execute before $S_5$? ==$S_1, S_2, S_4$==.</p>
</aside>`,
          init(root) {
            const nodes = [
              { id: 'A', x: 230, y: 42, label: 'A' }, { id: 'B', x: 100, y: 140, label: 'B' },
              { id: 'C', x: 360, y: 140, label: 'C' }, { id: 'D', x: 185, y: 245, label: 'D' },
              { id: 'E', x: 300, y: 268, label: 'E' },
            ];
            const edges = [['A', 'B'], ['A', 'C'], ['A', 'E'], ['B', 'D'], ['D', 'C'], ['C', 'E']]
              .map(([from, to]) => ({ id: from + to, from, to }));
            const pg = root.querySelector('[data-play="graph-sets"]');
            const gv = GraphView.create(pg.querySelector('.graph-box'), {
              nodes, edges, width: 460, height: 300, r: 21,
              ariaLabel: 'A graph with vertices A to E and six edges',
            });
            const sets = pg.querySelector('.sets');
            const caption = pg.querySelector('.caption-live');
            const defaultCaption = caption.textContent;
            const row = (name, items) => {
              const r = document.createElement('div');
              r.className = 'set-row';
              r.innerHTML = `<span class="set-name">${name} =</span><span class="set-brace">{</span>` +
                items.map(i => `<span class="chip" data-kind="${i.kind}" data-id="${i.id}" tabindex="0">${i.text}</span>`).join('') +
                `<span class="set-brace">}</span>`;
              sets.appendChild(r);
            };
            row('V', nodes.map(n => ({ kind: 'node', id: n.id, text: n.id })));
            row('E', edges.map(e => ({ kind: 'edge', id: e.id, text: `(${e.from},${e.to})` })));

            const show = (sel) => {
              pg.querySelectorAll('.chip').forEach(c => c.classList.remove('on'));
              if (!sel || !sel.type) { gv.highlight(); caption.textContent = defaultCaption; return; }
              if (sel.type === 'node') {
                gv.highlight({ nodes: [sel.id] });
                pg.querySelector(`.chip[data-kind="node"][data-id="${sel.id}"]`).classList.add('on');
                caption.textContent = `${sel.id} is a vertex: an element of the set V.`;
              } else {
                const e = edges.find(x => x.id === sel.id);
                gv.highlight({ nodes: [e.from, e.to], edges: [e.id] });
                pg.querySelector(`.chip[data-kind="edge"][data-id="${sel.id}"]`).classList.add('on');
                caption.textContent = `(${e.from},${e.to}) is an edge: an element of the set E. It connects vertex ${e.from} to vertex ${e.to}.`;
              }
            };
            gv.onHover(show);
            pg.querySelectorAll('.chip').forEach(c => {
              const sel = { type: c.dataset.kind, id: c.dataset.id };
              c.addEventListener('mouseenter', () => show(sel));
              c.addEventListener('focus', () => show(sel));
              c.addEventListener('mouseleave', () => show(null));
              c.addEventListener('blur', () => show(null));
            });
          },
        },

        /* ---------------------------------------------------------------- 2 */
        {
          id: 'variants', title: 'Variants of graphs',
          slides: ['L31', 'L34', 'L38', 'L39'],
          checklist: [],
          html: String.raw`
<p>Every [[graph]] is made of [[vertex|nodes]] and [[edge|edges]]. Graphs come in variants, depending on ==what extra information the nodes and edges carry== {{L31}}.</p>

<div class="box definition">
  <span class="box-label">Definition</span>
  <p>A <dfn data-term="label">label</dfn> is extra information attached to a node or an edge: a name, a number, a weight. {{added}}</p>
  <ul>
    <li><strong>Nodes</strong> are labeled or unlabeled.</li>
    <li><strong>Edges</strong> are directed or undirected.</li>
    <li><strong>Edges</strong> are labeled or unlabeled.</li>
  </ul>
</div>

<p>A <strong>directed</strong> edge has a direction and is drawn as an arrow. A web link from site X to site Y {{L39}} does <strong class="crucial">not</strong> mean that Y links back to X {{added}}. An <strong>undirected</strong> edge works both ways, like a highway between two cities. {{added}} The formal definitions are in the next entry.</p>

<div class="playground" data-play="variants">
  <p class="playground-title">Switch the variants on and off</p>
  <p class="playground-hint">This is the computer network from {{L34}}. Each switch changes one variant.</p>
  <div class="controls">
    <label><input type="checkbox" data-opt="nodeLabels" checked> Label the nodes</label>
    <label><input type="checkbox" data-opt="edgeLabels" checked> Label the edges</label>
    <label><input type="checkbox" data-opt="directed"> Make the edges directed</label>
  </div>
  <div class="graph-box"></div>
  <p class="caption-live" aria-live="polite"></p>
</div>

<aside class="callout caution">
  <span class="callout-title">The three choices are independent</span>
  <p>Any combination is possible {{added}}. The network on {{L34}} is ==undirected, with labeled nodes and labeled edges==. The course map on {{L38}} is ==directed, with labeled nodes and unlabeled edges==.</p>
</aside>

<aside class="callout intuition">
  <span class="callout-title">Weights {{added}}</span>
  <p>When an edge's label is a number (a distance, a cost, a transmission rate) it is usually called the edge's <em>weight</em>. The recitation uses the word "unweighted" for a graph with no such numbers {{R10}}.</p>
</aside>
`,
          init(root) {
            const nodes = [
              { id: 'seoul', x: 70, y: 52, label: 'Seoul', labelSide: 'above' }, { id: 'tokyo', x: 200, y: 70, label: 'Tokyo', labelSide: 'above' },
              { id: 'sydney', x: 175, y: 262, label: 'Sydney' }, { id: 'seattle', x: 350, y: 85, label: 'Seattle', labelSide: 'above' },
              { id: 'ny', x: 510, y: 125, label: 'New York', labelSide: 'above' }, { id: 'ta', x: 375, y: 245, label: 'Tel-Aviv' },
            ];
            const edges = [
              ['seoul', 'tokyo', 56], ['tokyo', 'sydney', 160], ['sydney', 'seattle', 300],
              ['seattle', 'ny', 128], ['seattle', 'ta', 181], ['ta', 'ny', 140],
            ].map(([from, to, label]) => ({ id: from + '-' + to, from, to, label }));
            const pg = root.querySelector('[data-play="variants"]');
            const state = { nodeLabels: true, edgeLabels: true, directed: false };
            const gv = GraphView.create(pg.querySelector('.graph-box'), {
              nodes, edges, width: 580, height: 320, r: 16, labelPos: 'below',
              nodeLabels: true, edgeLabels: true, directed: false,
              ariaLabel: 'Computer network with six cities',
            });
            const caption = pg.querySelector('.caption-live');
            const describe = () => {
              const parts = [
                state.directed ? 'directed edges' : 'undirected edges',
                state.nodeLabels ? 'labeled nodes' : 'unlabeled nodes',
                state.edgeLabels ? 'labeled edges' : 'unlabeled edges',
              ];
              let extra = '';
              if (state.directed) extra = ' Now Seoul → Tokyo is a one-way link: data can go from Seoul to Tokyo but not back.';
              else if (!state.nodeLabels && !state.edgeLabels) extra = ' Only the structure is left: which computers are connected.';
              else if (state.edgeLabels) extra = ' Each edge label is the transmission rate of that link.';
              caption.textContent = `A graph with ${parts.join(', ')}.${extra}`;
            };
            pg.querySelectorAll('input[data-opt]').forEach(inp => {
              inp.addEventListener('change', () => {
                state[inp.dataset.opt] = inp.checked;
                gv.setNodeLabels(state.nodeLabels); gv.setEdgeLabels(state.edgeLabels); gv.setDirected(state.directed);
                describe();
              });
            });
            describe();
          },
        },

        E.directed,
        E.adjacent,
        E.degree,
        E.simple,
        E.initial,
        E.inout,
        E.simpledi,
        E.families,
        E.bipartite,
        E.kab,
        E.handshake,
        E.notation,
        E.matrix,
        E.list,
        E.toposort,
        E.valid,
        E.pathcycle,
        E.onlyacyclic,
        E.source,
        E.removal,
        E.impl,
        E.indeg,
        /* ---------------------------------------------------------------- 25 */
        {
          id: 'toposort-queue', title: 'Topo-sort with a queue', algo: true,
          slides: ['L72', 'L73', 'L74', 'L75', 'L76', 'L77', 'L78', 'L80'],
          checklist: ['c7', 'c8'],
          html: String.raw`
<p>The [[graph]] is stored as [[adjacency-list|adjacency lists]]. The algorithm repeatedly removes a [[vertex]] that has no incoming [[edge|edges]]. {{added}} To avoid searching for one each time, ==keep all such vertices in a queue (or a stack)== {{L75}}.</p>

<div class="box definition">
  <span class="box-label">Algorithm {{L77}}</span>
  <ol>
    <li>Store each vertex's [[in-degree]] in an array $D$.</li>
    <li>Initialize the queue with all [[source]] vertices (in-degree 0).</li>
    <li>While there are vertices remaining in the queue:
      <br>(a) Dequeue and output a vertex.
      <br>(b) Reduce the in-degree of all vertices [[adjacent]] to it by 1.
      <br>(c) Enqueue any of these vertices whose in-degree became zero.</li>
    <li>If all vertices are output then success, otherwise there is a [[cycle]].</li>
  </ol>
</div>

<div class="algo-mount" data-algo="toposort"></div>

<aside class="callout caution">
  <span class="callout-title">Lines the code on the slides leaves out</span>
  <p>Line 9 is step 2 of {{L77}}, and lines 20 and 21 are step 4 of {{L77}}. They follow the slide's words ("Initialize queue with all source vertices (in-deg(v)=0)" on {{L77}}), because the code on {{L74}} and {{L78}} has no lines for them.</p>
</aside>

<aside class="callout intuition">
  <span class="callout-title">Why the structure changes the answer</span>
  <p>Switch between Queue and Stack and compare the Output row. Both keep the vertices that are ready, and ==both orders are valid [[topo-sort|topological sorts]]== ({{R33}} shows both for the recitation graph). They differ only in which ready vertex comes out next {{L80}}. {{added}}</p>
</aside>
`,
        },
        E.analysis,
        E.stack,
      ],
    },
    {
      id: 'B', title: 'Part B: Recitation 1', sub: 'In the order of the recitation slides',
      entries: [
        E.bGraph,
        E.bDirs,
        E.bSimple,
        E.bClique,
        E.bPath,
        E.bSimplePath,
        E.bConnected,
        E.bStrong,
        E.bCC,
        E.bSCC,
        E.bBip,
        E.bSimpleCycle,
        E.bRep,
        E.bHand,
        E.bOdd,
        E.bDag,
        E.bTopo,
        E.bAlgo,
        E.bSource,
        E.bCorrect,
        E.bQS,
        E.bIff,
      ],
    },
  ],
});
