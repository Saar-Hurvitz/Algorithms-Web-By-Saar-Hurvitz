/* ==========================================================================
   Exercises: six hands-on practice tools. Every graph comes from the slides and
   every right/wrong answer is computed by GraphLogic from that graph's edges.
   Every action gets an animation and a sentence saying what just changed.
   ========================================================================== */
window.Exercises = (function () {
  const L = GraphLogic;
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const anim = (node, frames, opts) => (reduced() || !node ? null : node.animate(frames, opts));
  const shake = n => anim(n, [0, -6, 6, -4, 4, 0].map(x => ({ transform: `translateX(${x}px)` })), { duration: 340 });
  const pop = n => anim(n, [{ transform: 'scale(1)' }, { transform: 'scale(1.28)' }, { transform: 'scale(1)' }], { duration: 300, easing: 'ease-out' });
  const say = (box, text, kind) => {
    box.textContent = text;
    box.classList.toggle('ok', kind === 'ok');
    box.classList.toggle('fail', kind === 'fail');
    anim(box, [{ opacity: .35 }, { opacity: 1 }], { duration: 220 });
  };
  const pairs = list => list.map(s => { const [a, b] = s.split(/[>-]/); return [a, b]; });
  const edgeObjs = (edges, sep) => GraphView.autoBend(edges.map(([from, to], i) => ({ id: `${from}${sep}${to}${from === to ? '' : ''}`, from, to })));

  /* Fly a small label from one screen position to an element */
  function flyFrom(target, rect) {
    if (reduced() || !rect) return;
    const d = target.getBoundingClientRect();
    anim(target, [{ transform: `translate(${rect.left - d.left}px,${rect.top - d.top}px)`, opacity: .7 }, { transform: 'none', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.3,.7,.2,1)' });
  }

  /* Graphs, copied edge by edge from the slides */
  const nodes = s => s.split(' ').map(t => { const [id, x, y] = t.split(','); return [id, +x, +y]; });
  const G = {
    L56: { title: 'Lecture graph (slide 56)', directed: true, nodes: nodes('A,70,130 B,190,45 C,340,85 D,200,240 E,350,250 F,450,160'), edges: pairs(['A>B', 'A>D', 'B>C', 'C>D', 'C>E', 'D>E']), start: ['A', 'B', 'F', 'C', 'E', 'D'] },
    R33: { title: 'Recitation graph (slide 33)', directed: true, nodes: nodes('S,45,145 A,165,65 C,300,65 E,450,65 B,165,225 D,300,225 F,450,225'), edges: pairs(['S>A', 'S>B', 'A>C', 'B>D', 'C>E', 'C>F']), start: ['F', 'E', 'D', 'C', 'B', 'A', 'S'] },
    L61: { title: 'Source + cycle (slide 61)', directed: true, nodes: nodes('A,90,130 B,195,40 C,340,75 D,200,240 E,350,245 F,450,140'), edges: pairs(['A>B', 'B>C', 'C>D', 'D>A', 'C>E', 'D>E']), start: ['A', 'B', 'C', 'D', 'E', 'F'] },
    L63: { title: 'No source (slide 63)', directed: true, nodes: nodes('A,170,120 B,265,40 C,400,85 D,275,235 E,85,235 F,430,235'), edges: pairs(['A>B', 'A>E', 'B>C', 'C>D', 'C>F', 'D>A', 'E>D']), start: ['A', 'B', 'C', 'D', 'E', 'F'] },
    L45: { title: 'Undirected graph (slide 45)', directed: false, nodes: nodes('A,70,130 B,190,45 C,340,85 D,180,235 E,330,250 F,450,190'), edges: pairs(['A>B', 'A>D', 'B>C', 'C>D', 'C>E', 'D>E', 'C>C']) },
    L47: { title: 'Directed graph (slide 47)', directed: true, nodes: nodes('A,70,130 B,190,45 C,340,85 D,180,235 E,330,250 F,450,190'), edges: pairs(['A>B', 'A>D', 'B>C', 'C>D', 'C>E', 'D>E', 'C>C']) },
    L51: { title: 'Undirected (slide 51)', directed: false, nodes: nodes('A,60,120 B,170,45 C,340,85 D,150,235 E,300,250 F,420,170'), edges: pairs(['A>B', 'A>D', 'B>C', 'C>D', 'C>E', 'D>E']) },
    L52: { title: 'Digraph (slide 52)', directed: true, nodes: nodes('A,60,120 B,170,45 C,340,85 D,150,235 E,300,250 F,420,170'), edges: pairs(['A>B', 'A>D', 'B>C', 'C>D', 'D>E', 'E>C']) },
    P5: { title: 'Path P₅ (slide 48)', directed: false, nodes: nodes('1,50,140 2,150,140 3,250,140 4,350,140 5,450,140'), edges: pairs(['1>2', '2>3', '3>4', '4>5']) },
    C4: { title: 'Cycle C₄', directed: false, nodes: nodes('1,160,50 2,340,50 3,340,230 4,160,230'), edges: pairs(['1>2', '2>3', '3>4', '4>1']) },
    C5: { title: 'Cycle C₅', directed: false, nodes: nodes('1,250,35 2,410,120 3,350,250 4,150,250 5,90,120'), edges: pairs(['1>2', '2>3', '3>4', '4>5', '5>1']) },
    S4: { title: 'Star S₄ = K₁,₄ (slide 48)', directed: false, nodes: nodes('c,250,140 1,110,50 2,390,50 3,390,235 4,110,235'), edges: pairs(['c>1', 'c>2', 'c>3', 'c>4']) },
    K23: { title: 'Complete bipartite K₂,₃', directed: false, nodes: nodes('a,130,90 b,130,200 1,370,45 2,370,145 3,370,245'), edges: pairs(['a>1', 'a>2', 'a>3', 'b>1', 'b>2', 'b>3']) },
    R20: { title: 'Square in a square (slide 20)', directed: false, nodes: nodes('1,90,30 2,410,30 3,410,260 4,90,260 5,190,105 6,310,105 7,310,185 8,190,185'), edges: pairs(['1>2', '2>3', '3>4', '4>1', '5>6', '6>7', '7>8', '8>5', '1>5', '2>6', '3>7', '4>8']) },
    R19: { title: 'Directed graph (slide 19)', directed: true, nodes: nodes('a,70,55 b,205,55 c,315,55 d,445,55 e,70,235 f,205,235 g,315,235 h,445,235'), edges: pairs(['a>b', 'b>c', 'b>e', 'b>f', 'e>a', 'e>f', 'c>d', 'd>c', 'c>g', 'd>h', 'h>d', 'h>g', 'f>g', 'g>f']) },
    R8: { title: 'Undirected graph (slide 8)', directed: false, nodes: nodes('A,110,70 C,235,120 B,135,235 D,300,185 E,405,60 F,345,235 G,465,235'), edges: pairs(['A>B', 'A>C', 'E>F', 'E>G', 'F>G']) },

    /* Week 2. An edge listed twice is a pair of parallel edges; A-A is a self-loop. */
    /* 2L17 names only a and b; t, l, r, m are added names (the page says so) */
    '2L17': { title: 'Only a and b are odd (slide 17)', directed: false, nodes: nodes('t,250,30 l,130,105 r,370,105 m,250,165 a,130,250 b,370,250'), edges: pairs(['t-l', 't-r', 'l-r', 'l-m', 'r-m', 'm-a', 'm-b', 'a-b', 'l-a', 'r-b']) },
    '2L17+': { title: 'After adding the edge (a,b) (slide 17)', directed: false, nodes: nodes('t,250,30 l,130,105 r,370,105 m,250,165 a,130,250 b,370,250'), edges: pairs(['t-l', 't-r', 'l-r', 'l-m', 'r-m', 'm-a', 'm-b', 'a-b', 'l-a', 'r-b', 'a-b']), added: [10] },
    '2L21': { title: 'Lecture example (slide 21)', directed: false, nodes: nodes('A,250,30 B,130,90 C,370,90 G,250,145 D,130,205 E,370,205 F,250,262'), edges: pairs(['A-B', 'A-C', 'B-C', 'B-D', 'B-G', 'C-E', 'C-G', 'D-E', 'D-F', 'D-G', 'E-F', 'E-G']) },
    '2L25': { title: 'Directed graph (slide 25)', directed: true, nodes: nodes('F,60,60 D,165,130 E,295,85 A,425,160 C,190,250 B,325,230'), edges: pairs(['F>D', 'D>E', 'D>C', 'C>B', 'B>E', 'A>E', 'A>B']) },
    '2L29': Object.assign({ title: 'G₂,₃ (slide 29)', directed: true, sigma: 2, n: 3, nodes: nodes('00,250,82 10,120,150 01,380,150 11,250,218'), loops: { '00': -Math.PI / 2, 11: Math.PI / 2 } }, deBruijnRecord(2, 3)),
    '2L30': Object.assign({ title: 'G₃,₂ (slide 30)', directed: true, sigma: 3, n: 2, nodes: nodes('0,250,86 2,120,212 1,380,212'), loops: { 0: -Math.PI / 2, 1: Math.PI / 4, 2: 3 * Math.PI / 4 } }, deBruijnRecord(3, 2)),
    '2L36I': { title: 'Graph I (slide 36)', directed: false, nodes: nodes('B,90,40 C,410,40 G,250,145 D,90,250 E,410,250'), edges: pairs(['B-C', 'D-E', 'B-G', 'C-G', 'D-G', 'E-G']) },
    '2L36II': { title: 'Graph II (slide 36)', directed: false, nodes: nodes('B,90,40 C,410,40 G,250,145 D,90,250 E,410,250'), edges: pairs(['B-C', 'D-E', 'B-D', 'C-E', 'B-G', 'C-G', 'D-G', 'E-G']) },
    '2L40': { title: 'Tournament (slide 40)', directed: true, nodes: nodes('1,110,55 2,390,55 3,110,235 4,390,235'), edges: pairs(['1>2', '1>3', '1>4', '2>4', '3>2', '3>4']) },
    '2R5': { title: 'Recitation graph (slide 5)', directed: false, nodes: nodes('A,65,115 B,210,92 C,400,135 D,320,258 E,125,258'), edges: pairs(['A-B', 'A-D', 'B-B', 'B-C', 'B-E', 'C-D', 'C-D', 'E-D']), loops: { B: -Math.PI / 2 } },
    '2R6': { title: 'With the extra edge B–C (slide 6)', directed: false, nodes: nodes('A,65,115 B,210,92 C,400,135 D,320,258 E,125,258'), edges: pairs(['A-B', 'A-D', 'B-B', 'B-C', 'B-E', 'C-D', 'C-D', 'E-D', 'B-C']), loops: { B: -Math.PI / 2 } },
    '2L18': { title: 'The Seven Bridges (slide 18)', directed: false, nodes: nodes('A,130,40 B,130,150 C,130,260 D,330,150'), edges: pairs(['A-B', 'A-B', 'B-C', 'B-C', 'A-D', 'B-D', 'C-D']) },
    '2R37': { title: 'Exercise 4.1 (slide 37)', directed: false, nodes: nodes('0,150,50 1,300,50 3,150,240 4,300,240 2,430,240'), edges: pairs(['0-1', '1-4', '4-3', '3-0', '4-2']) },
    '2R38': { title: 'Exercise 4.2 (slide 38)', directed: false, nodes: nodes('0,160,50 1,340,50 2,160,240 3,340,240'), edges: pairs(['0-1', '0-2', '1-2', '1-3', '2-3']) },
    '2R39': { title: 'Exercise 4.3 (slide 39)', directed: false, nodes: nodes('0,150,40 1,350,40 2,250,145 3,150,250 4,350,250'), edges: pairs(['0-1', '0-2', '1-2', '2-3', '2-4', '3-4']) },
    '2R40': { title: 'Exercise 4.4 (slide 40)', directed: false, nodes: nodes('0,160,50 1,340,50 3,160,240 4,340,240'), edges: pairs(['0-1', '1-4', '4-3', '3-0']) },
    '2R8': { title: 'Recitation example (slide 8)', directed: false, nodes: nodes('0,90,85 4,235,32 1,345,92 3,130,240 2,320,262'), edges: pairs(['0-3', '0-2', '3-2', '3-1', '3-4', '4-1']) },

    /* Week 3. The slides' unlabeled drawings get letters so the text can name their vertices. */
    '3L13': { title: 'The tree on slide 13', directed: false, nodes: nodes('F,50,133 E,193,66 D,360,35 C,450,145 B,216,187 A,393,220 G,93,255'), edges: pairs(['E-F', 'E-B', 'E-A', 'E-D', 'D-C', 'A-G']) },
    '3L28': { title: 'The network on slide 28', directed: false, nodes: nodes('1,155,64 2,312,30 5,470,88 3,296,137 4,445,211 6,122,210 7,296,260'), edges: pairs(['1-2', '1-6', '1-7', '2-3', '2-5', '3-4', '3-7', '4-5', '4-7', '6-7']) },
    '3L31': { title: 'The lecture graph (slide 31)', directed: false, nodes: nodes('8,30,64 1,155,64 2,312,30 5,470,88 3,296,137 4,445,211 6,122,210 7,296,260'), edges: pairs(['1-2', '1-6', '1-7', '1-8', '2-3', '2-5', '3-4', '3-7', '4-5', '4-7', '6-7']),
      lists: { 1: ['2', '6', '7', '8'], 2: ['1', '3', '5'], 3: ['2', '4', '7'], 4: ['3', '5', '7'], 5: ['2', '4'], 6: ['1', '7'], 7: ['1', '3', '4', '6'], 8: ['1'] } },
    '3R5a': { title: 'Graph 1 (slide 5)', directed: false, nodes: nodes('a,74,30 b,214,30 c,353,30 d,40,122 e,390,122 f,214,260 g,460,260'), edges: pairs(['a-f', 'b-d', 'b-e', 'c-f', 'e-f', 'd-g']) },
    '3R5b': { title: 'Graph 2 (slide 5)', directed: false, nodes: nodes('a,140,40 b,360,40 c,140,250 d,360,250'), edges: pairs(['a-b', 'a-d', 'b-c']) },
    '3R5c': { title: 'Graph 3 (slide 5)', directed: false, nodes: nodes('a,90,50 b,250,50 c,410,50 d,90,240 e,250,240 f,410,240'), edges: pairs(['a-d', 'b-d', 'c-e', 'c-f']) },
    '3R5d': { title: 'Graph 4 (slide 5)', directed: false, nodes: nodes('a,90,50 b,250,50 c,410,50 d,90,240 e,250,240 f,410,240'), edges: pairs(['a-d', 'a-f', 'b-d', 'b-e', 'c-e', 'c-f']) },
    '3R6a': { title: 'Left graph (slide 6)', directed: true, nodes: nodes('A,40,114 B,183,114 C,307,30 E,403,138 D,272,243 F,460,260'), edges: pairs(['A>B', 'B>C', 'C>E', 'E>D', 'D>B', 'E>F']) },
    '3R6b': { title: 'Middle graph (slide 6)', directed: true, nodes: nodes('A,90,40 B,410,40 D,90,250 C,410,250'), edges: pairs(['A>B', 'A>D', 'B>C', 'C>A', 'C>D']) },
    '3R6c': { title: 'Right graph (slide 6)', directed: true, nodes: nodes('A,130,50 B,370,50 C,250,240'), edges: pairs(['A>C', 'B>C']) },
    '3R17': { title: 'The recitation graph (slide 17)', directed: false, nodes: nodes('1,186,42 5,387,73 4,230,140 3,425,175 2,262,242 6,69,200'), edges: pairs(['1-5', '1-4', '4-5', '4-6', '4-2', '4-3', '2-6', '2-3']),
      lists: { 1: ['4', '5'], 2: ['3', '4', '6'], 3: ['2', '4'], 4: ['2', '1', '3', '5', '6'], 5: ['1', '4'], 6: ['2', '4'] } },
    '3R29c': { title: 'The third graph (slide 29)', directed: false, nodes: nodes('a,70,50 b,250,55 c,430,55 d,70,240 e,430,240'), edges: pairs(['a-b', 'a-d', 'b-d', 'b-c', 'c-e']) },
    '3R29t': { title: 'Tree with 9 nodes (slide 29)', directed: false, nodes: nodes('1,279,30 2,170,104 3,379,106 4,99,177 5,238,177 6,325,177 7,460,177 8,40,260 9,166,260'), edges: pairs(['1-2', '1-3', '2-4', '2-5', '3-6', '3-7', '4-8', '4-9']) },
    '3R35': { title: 'The graph of slide 35', directed: false, nodes: nodes('u,130,50 v,370,50 c,130,240 d,370,240'), edges: pairs(['u-v', 'u-c', 'u-d', 'v-c', 'v-d']) },
    '3R37': { title: 'Slide 37 solution', directed: false, nodes: nodes('B,240,30 C,396,75 A,100,148 D,400,201 E,247,260'), edges: pairs(['A-B', 'B-E', 'B-C', 'C-D', 'A-E']) },

    /* Week 4. The vertices of 4L27 are unlabeled on the slide: the letters are added
       so the text can name them. `lists` reproduce the runs drawn on the slides.
       `weights[i]` is the weight of `edges[i]`. */
    '4L27': { title: 'The shortest-path graph (slide 27)', directed: false, start: 's', nodes: nodes('s,71,62 a,224,30 b,40,209 c,209,260 d,209,137 e,376,88 f,353,209 g,460,164'),
      edges: pairs(['s-a', 's-b', 's-c', 'a-d', 'a-e', 'b-c', 'c-d', 'c-f', 'd-f', 'e-f', 'e-g', 'f-g']),
      lists: { s: ['a', 'b', 'c'], a: ['s', 'd', 'e'], b: ['s', 'c'], c: ['s', 'b', 'd', 'f'], d: ['a', 'c', 'f'], e: ['a', 'f', 'g'], f: ['c', 'd', 'e', 'g'], g: ['e', 'f'] } },
    '4R51': { title: 'The recitation graph (slide 51)', directed: false, start: 'A', nodes: nodes('A,72,46 G,357,30 C,252,92 B,145,154 E,362,153 F,40,216 D,256,215 H,460,260'),
      edges: pairs(['A-G', 'A-C', 'A-B', 'A-F', 'G-E', 'F-E', 'F-D', 'E-D', 'D-H']),
      lists: { A: ['F', 'B', 'C', 'G'], F: ['A', 'D', 'E'], B: ['A'], C: ['A'], G: ['A', 'E'], D: ['F', 'E', 'H'], E: ['G', 'F', 'D'], H: ['D'] } },
    '4R5': { title: 'The directed graph (slide 5)', directed: true, nodes: nodes('A,40,30 B,196,30 C,118,101 D,40,171 E,196,171 F,196,260 G,292,74 I,340,235 H,460,60 J,460,174'),
      edges: pairs(['A>B', 'C>A', 'C>B', 'D>C', 'D>E', 'E>C', 'E>F', 'E>I', 'G>E', 'I>G', 'I>H', 'I>J', 'H>J']),
      order: ['C', 'D', 'A', 'B', 'E', 'F', 'G', 'H', 'I', 'J'],
      lists: { A: ['B'], B: [], C: ['A', 'B'], D: ['C', 'E'], E: ['C', 'F', 'I'], F: [], G: ['E'], H: ['J'], I: ['G', 'H', 'J'], J: [] } },
    '4L41': { title: 'Weighted directed graph (slide 41)', directed: true, start: 's', nodes: nodes('s,40,30 a,222,40 t,384,114 c,258,176 b,120,260 d,460,252'),
      edges: pairs(['s>a', 's>c', 's>b', 'a>t', 'c>t', 'c>b', 'b>d', 'd>c']), weights: [3, 5, 2, 4, 3, 1, 3, -2] },
    '4L43': { title: 'Properties of distances (slide 43)', directed: true, start: 's', nodes: nodes('s,40,163 u,302,30 v,460,96 w,316,164 z,387,260'),
      edges: pairs(['s>u', 's>w', 's>z', 'u>v', 'w>v', 'z>v']), weights: [20, 22, 10, 10, 3, 11] },
    '4L46': { title: 'The chain of slide 46', directed: true, start: 's', nodes: nodes('s,60,145 a,180,145 b,300,145 c,420,145'), edges: pairs(['s>a', 'a>b', 'b>c']), pi: { s: null, a: 's', b: 'a', c: 'b' } },
    '4R74': { title: 'The graph G (slide 74)', directed: false, start: 's', nodes: nodes('s,120,60 b,380,60 c,120,240 d,380,240'), edges: pairs(['s-b', 'b-c', 'b-d', 'c-d']) },

    /* Week 5. `weights[i]` is the weight of `edges[i]`; `bends` curve an edge as the
       slide draws it (negative = above). 5L11's first vertex has no name: r is added.
       5L48 lists the edges in the slide's order SB, BC, AB, SA, AC.
       5L45 names two vertices "a": the lower one is a′ here. */
    '5L11': { title: 'The DAG (slide 11)', directed: true, start: 's', nodes: nodes('r,40,115 s,124,115 a,208,115 b,292,115 c,376,115 d,460,115'),
      edges: pairs(['r>s', 'r>a', 's>a', 's>b', 'a>b', 'a>c', 'a>d', 'b>c', 'b>d', 'c>d']), weights: [5, 3, 2, 6, 7, 4, 2, -1, 1, -2],
      bends: { 'r>a': 48, 's>b': -40, 'a>c': 48, 'a>d': 80, 'b>d': -40 } },
    '5L24': { title: 'Dijkstra example (slide 24)', directed: true, start: 's', nodes: nodes('s,40,150 a,180,50 b,420,50 c,180,250 d,420,250'),
      edges: pairs(['s>a', 's>c', 'a>b', 'a>c', 'c>a', 'c>b', 'c>d', 'b>d', 'd>b', 'd>s']), weights: [10, 5, 1, 2, 3, 9, 2, 4, 6, 7] },
    '5L44': { title: 'The fix works here (slide 44)', directed: true, start: 's', target: 't', nodes: nodes('s,60,150 a,250,55 b,250,245 t,440,150'),
      edges: pairs(['s>a', 'a>t', 's>b', 'b>t']), weights: [8, -4, -5, 12] },
    '5L45': { title: 'The fix fails here (slide 45)', directed: true, start: 's', target: 't', nodes: nodes('a′,50,255 s,150,150 a,230,55 b,340,55 t,450,150'),
      edges: pairs(['s>a', 'a>b', 'b>t', 's>t', 's>a′']), weights: [1, 1, 1, 5, -6] },
    '5L48': { title: 'Bellman-Ford example (slide 48)', directed: true, start: 'S', nodes: nodes('S,50,150 A,240,55 B,240,245 C,440,150'),
      edges: pairs(['S>B', 'B>C', 'A>B', 'S>A', 'A>C']), weights: [4, -7, 1, 2, 3] },
    '5R9': { title: 'Two shortest paths (recitation slide 9)', directed: true, start: 'a', target: 'b', nodes: nodes('a,110,230 b,250,60 c,390,230'),
      edges: pairs(['a>b', 'a>c', 'c>b']), weights: [5, 2, 3] },
    '5R11': { title: 'p₁p₂ is not shortest (recitation slide 11)', directed: true, start: 'u', nodes: nodes('u,120,60 w,400,100 v,230,250'),
      edges: pairs(['u>w', 'u>v', 'v>w']), weights: [1, 100, 100] },
    '5R15': { title: 'Exercise 3: the graph G (recitation slide 15)', directed: true, start: 's', nodes: nodes('s,110,70 a,390,70 b,250,240'),
      edges: pairs(['s>a', 'a>b', 'b>s']), weights: [5, 3, 2] },
  };
  /* Past exam: midterm 2004 (Exams/MidTermExams/mid04sol.pdf), key = 2004E + question.
     The exam draws graphs only for A4 (page 2), A7 (page 3); the others are added examples
     that satisfy each question's premise, and the page tags them as added. */
  Object.assign(G, {
    /* A1: v gets its final d in sweep 2. The edges are listed in Bellman-Ford's order. */
    '2004E1a': { title: 'Shortest path with 2 edges (added)', directed: true, start: 's', nodes: nodes('s,60,150 a,250,55 v,440,150'),
      edges: pairs(['a>v', 's>v', 's>a']), weights: [1, 5, 1] },
    '2004E1b': { title: 'Shortest path with 3 edges (added)', directed: true, start: 's', nodes: nodes('s,50,150 a,180,50 b,330,50 v,450,150'),
      edges: pairs(['b>v', 's>v', 's>a', 'a>b']), weights: [1, 10, 1, 1] },
    /* A2: the triangle of the solution. s lists v first, so DFS(s) marks v, and v marks u. */
    '2004E2': { title: 'Triangle s, u, v (the solution\'s example)', directed: false, start: 's', nodes: nodes('s,250,45 v,120,240 u,380,240'),
      edges: pairs(['s-v', 's-u', 'v-u']), lists: { s: ['v', 'u'], v: ['s', 'u'], u: ['s', 'v'] } },
    /* A3: d.v goes down 4 times */
    '2004E3a': { title: 'v.d goes down 4 times, in-degree 4 (added)', directed: true, start: 's', nodes: nodes('s,50,145 a,230,28 b,230,108 c,230,188 d,230,265 v,450,145'),
      edges: pairs(['s>a', 's>b', 's>c', 's>d', 'a>v', 'b>v', 'c>v', 'd>v']), weights: [1, 2, 3, 4, 10, 8, 6, 4] },
    '2004E3b': { title: 'v.d goes down 4 times, in-degree 5 (added)', directed: true, start: 's', nodes: nodes('s,50,145 a,230,28 b,230,108 c,230,188 d,230,265 e,380,265 v,450,120'),
      edges: pairs(['s>a', 's>b', 's>c', 's>d', 'a>v', 'b>v', 'c>v', 'd>v', 'd>e', 'e>v']), weights: [1, 2, 3, 4, 10, 8, 6, 4, 1, 9] },
    /* A4: the exam's drawing (page 2) */
    '2004E4': { title: 'The exam\'s graph (page 2)', directed: true, nodes: nodes('A,70,150 B,250,60 C,250,240 D,430,150'), edges: pairs(['A>B', 'A>C', 'B>D']) },
    /* A5: δ(i,j) is first finite at δ⁵ and never changes after it. i = 7, j = 8, every weight 1.
       Floyd-Warshall numbers the vertices in this list's order, so it lists them 1..8. */
    '2004E5': { title: 'Example: i = 7, j = 8 (added)', directed: true, i: '7', j: '8', nodes: nodes('1,130,145 2,200,145 3,300,145 4,370,145 5,250,40 6,250,250 7,45,145 8,455,145'),
      edges: pairs(['7>5', '5>8', '7>6', '6>8']), weights: [1, 1, 1, 1] },
    /* A6: three graphs with an Euler cycle */
    '2004E6a': { title: 'A cycle, C₅', directed: false, nodes: nodes('1,250,35 2,410,120 3,350,250 4,150,250 5,90,120'), edges: pairs(['1-2', '2-3', '3-4', '4-5', '5-1']) },
    '2004E6b': { title: 'The complete graph K₅', directed: false, nodes: nodes('1,250,35 2,410,120 3,350,250 4,150,250 5,90,120'),
      edges: pairs(['1-2', '1-3', '1-4', '1-5', '2-3', '2-4', '2-5', '3-4', '3-5', '4-5']) },
    '2004E6c': { title: 'Two triangles that share a vertex', directed: false, nodes: nodes('1,90,50 2,90,240 3,250,145 4,410,50 5,410,240'), edges: pairs(['1-2', '2-3', '3-1', '3-4', '4-5', '5-3']) },
    /* A7: the exam's drawing (page 3). The exam names s, A, B, C; D and E are added. */
    '2004E7': { title: 'The exam\'s graph (page 3)', directed: false, start: 's', nodes: nodes('s,250,35 A,160,120 B,340,120 D,70,245 C,250,245 E,430,245'),
      edges: pairs(['s-A', 's-B', 'A-B', 'A-D', 'A-C', 'D-C', 'B-C', 'B-E', 'C-E']), tree: pairs(['s-A', 's-B', 'A-D', 'B-E', 'E-C']) },
    /* B1: the solution's 4-cycle. The names S, a, b, c are added. */
    '2004E8': { title: 'A cycle of length 4 (the exam\'s example)', directed: false, start: 'S', nodes: nodes('S,250,40 a,120,145 c,380,145 b,250,250'), edges: pairs(['S-a', 'a-b', 'b-c', 'c-S']) },
  });
  /* 4L11 draws the same graph and the same lists as 3L31 */
  G['4L11'] = Object.assign({}, G['3L31'], { title: 'The lecture graph (slide 11)', start: '1' });
  /* 5R15: G′ of Exercise 3 is built from G by GraphLogic.almostValidGraph (5R16), laid out as the slide draws it */
  (function () {
    const g = G['5R15'], gp = L.almostValidGraph(g.nodes.map(n => n[0]), g.edges.map(([a, b], i) => [a, b, g.weights[i]]));
    const pos = { s0: [40, 80], a0: [180, 80], b0: [110, 230], s1: [320, 80], a1: [460, 80], b1: [390, 230] };
    G['5R15′'] = { title: 'Exercise 3: G′, two copies (recitation slide 15)', directed: true, start: 's0',
      nodes: gp.ids.map(v => [v, ...pos[v]]), edges: gp.wedges.map(([a, b]) => [a, b]), weights: gp.wedges.map(e => e[2]),
      labels: { s0: 's⁰', a0: 'a⁰', b0: 'b⁰', s1: 's¹', a1: 'a¹', b1: 'b¹' },
      bends: { 'a0>s1': -40, 's0>b1': 40, 'b0>a1': 60 } };
  })();

  /* Week 6. Edge lists are in the slide's order where the slide gives one (6L10, 6R8,
     6R17). Graphs whose key ends in "neg", and 6R22/6R24/6R28/6R30, are not drawn on
     any slide: they are added examples, and their titles say so. */
  Object.assign(G, {
    '6L10': { title: 'BF quick review (slide 10)', directed: true, start: 's', nodes: nodes('s,50,150 a,220,50 c,440,50 d,220,250 b,440,250'),
      edges: pairs(['s>a', 's>d', 'a>b', 'c>b', 'a>c', 'b>d']), weights: [-3, 10, 5, -4, 8, 1] },
    '6R8': { title: 'Recitation graph, first order (slides 8–16)', directed: true, start: 'S', nodes: nodes('S,183,25 A,313,25 B,416,112 C,423,201 D,334,266 E,196,266 F,100,206 G,100,117'),
      edges: pairs(['C>D', 'B>C', 'E>B', 'D>E', 'A>E', 'F>E', 'B>A', 'F>A', 'G>F', 'S>A', 'S>G']), weights: [3, 1, -2, -1, 2, -1, 1, -4, 1, 10, 8] },
    '6R17': { title: 'Recitation graph, second order (slides 17–20)', directed: true, start: 'S', nodes: nodes('S,183,25 A,313,25 B,416,112 C,423,201 D,334,266 E,196,266 F,100,206 G,100,117'),
      edges: pairs(['S>A', 'S>G', 'G>F', 'F>E', 'F>A', 'C>D', 'E>B', 'B>C', 'B>A', 'A>E', 'D>E']), weights: [10, 8, 1, -1, -4, 3, -2, 1, 1, 2, -1] },
    '6R8neg': { title: 'Added: the recitation graph with w(B,A) = −1', directed: true, start: 'S', nodes: nodes('S,183,25 A,313,25 B,416,112 C,423,201 D,334,266 E,196,266 F,100,206 G,100,117'),
      edges: pairs(['S>A', 'S>G', 'G>F', 'F>E', 'F>A', 'C>D', 'E>B', 'B>C', 'B>A', 'A>E', 'D>E']), weights: [10, 8, 1, -1, -4, 3, -2, 1, -1, 2, -1] },
    '6R22': { title: 'Added: star, n = 5 (slide 22)', directed: true, start: 'v1', nodes: nodes('v1,250,145 v2,250,30 v3,430,145 v4,250,260 v5,70,145'),
      edges: pairs(['v1>v2', 'v1>v3', 'v1>v4', 'v1>v5']), weights: [1, 1, 1, 1] },
    '6R24': { title: 'Added: line, n = 5 (slide 24)', directed: true, start: 'v1', nodes: nodes('v1,50,145 v2,150,145 v3,250,145 v4,350,145 v5,450,145'),
      edges: pairs(['v4>v5', 'v3>v4', 'v2>v3', 'v1>v2']), weights: [1, 1, 1, 1] },
    /* Floyd-Warshall numbers the vertices 1..n (6L22): ids in that order */
    '6L25': { title: 'Floyd-Warshall example (slide 25)', directed: true, nodes: nodes('1,60,121 2,250,30 3,440,121 4,360,250 5,150,254'),
      edges: pairs(['1>2', '1>3', '1>5', '2>4', '2>5', '3>2', '4>1', '4>3', '5>4']), weights: [3, 8, -4, 1, 7, 4, 2, -5, 6] },
    '6L25neg': { title: 'Added: slide 25 with w(3,2) = 3', directed: true, nodes: nodes('1,60,121 2,250,30 3,440,121 4,360,250 5,150,254'),
      edges: pairs(['1>2', '1>3', '1>5', '2>4', '2>5', '3>2', '4>1', '4>3', '5>4']), weights: [3, 8, -4, 1, 7, 3, 2, -5, 6] },
    /* 6R49 leaves w(1,3) and w(5,4) blank (`blanks`); the weights here are 6R50's example answer */
    '6R49': { title: 'Exercise 5, with w(1,3) = 14 and w(5,4) = −4 (slide 50)', directed: true, nodes: nodes('1,224,30 2,80,144 3,212,267 4,416,208 5,416,68'),
      edges: pairs(['2>1', '1>5', '2>5', '2>4', '1>3', '5>4', '4>3', '3>2']), weights: [-3, 1, 4, 2, 14, -4, 8, -1], blanks: ['1>3', '5>4'] },
    '6R28': { title: 'Added: Claim 1 counterexample, n = 11 (slide 28)', directed: true, nodes: nodes('1,250,22 2,357,52 3,428,128 4,445,215 5,380,268 6,290,255 7,200,268 8,105,250 9,60,180 10,72,95 11,150,40'),
      edges: pairs(['10>6', '6>11', '10>7', '7>11']), weights: [1, 1, 1, 1], labels: { 10: 'i', 11: 'j' }, i: '10', j: '11' },
    '6R30': { title: 'Added: Claim 2 counterexample, n = 11 (slide 30)', directed: true, nodes: nodes('1,250,22 2,357,52 3,428,128 4,445,215 5,380,268 6,290,255 7,200,268 8,105,250 9,60,180 10,72,95 11,150,40'),
      edges: pairs(['10>6', '6>11']), weights: [1, 1], labels: { 10: 'i', 11: 'j' }, i: '10', j: '11' },
    '6L40': { title: 'Gas stations, U = {a} (slide 40)', directed: true, start: 's', U: ['a'], nodes: nodes('s,60,70 a,276,40 b,417,154 c,191,250'),
      edges: pairs(['s>a', 's>b', 'a>c', 'a>b', 'c>s']), weights: [4, 6, 2, 3, 5] },
    /* 6L50: only a, b and u are named on the slide; c–h are added names */
    '6L50': { title: 'Dijkstra Pizza, W = {a, b} (slide 50)', directed: true, W: ['a', 'b'], nodes: nodes('a,80,83 c,185,25 u,360,28 d,476,83 e,185,149 f,360,149 g,100,197 h,293,232 b,465,232'),
      edges: pairs(['a>c', 'c>u', 'u>d', 'u>e', 'e>c', 'a>e', 'e>g', 'g>a', 'e>f', 'f>d', 'd>b', 'g>h', 'h>f', 'h>b', 'b>f']), weights: [4, 7, 10, 5, 3, 6, 3, 2, 5, 2, 3, 1, 4, 9, 8] },
    '6R36': { title: 'Exercise 3 example (slide 36)', directed: true, start: 's', nodes: nodes('s,40,170 a,180,170 b,320,170 c,460,170'),
      edges: pairs(['s>a', 'a>b', 's>b', 'b>c']), weights: [1, 1, 3, 5], bends: { 's>b': -70 } },
    '6R37': { title: 'The "WRONG" solution\'s graph (slide 37)', directed: true, start: 's', target: 't', nodes: nodes('s,250,40 a,120,240 t,380,240'),
      edges: pairs(['s>a', 'a>t', 's>t']), weights: [2, 2, 3] },
    '6R46': { title: 'A simple cycle of length 3 (slide 46 names it; the drawing is added)', directed: false, start: 's', nodes: nodes('s,250,40 a,120,240 b,380,240'), edges: pairs(['s-a', 's-b', 'a-b']) },
    '6R48': { title: 'Exercise 4.2: the graph G (slide 48)', directed: false, start: 'S', nodes: nodes('S,83,61 B,278,50 D,452,145 C,276,240 A,60,239'), edges: pairs(['S-A', 'S-B', 'A-C', 'C-D', 'B-D']) },
  });
  /* The G′ graphs of week 6 are built by GraphLogic from G, as the slides define them */
  (function () {
    const ids = k => G[k].nodes.map(n => n[0]), we = k => G[k].edges.map(([a, b], i) => [a, b, G[k].weights[i]]);
    const build = (key, gp, pos, extra) => {
      G[key] = Object.assign({ directed: true, nodes: gp.ids.map(v => [v, ...pos[v]]), edges: gp.wedges.map(([a, b]) => [a, b]), weights: gp.wedges.map(e => e[2]) }, extra);
    };
    const sub = { 0: '₀', 1: '₁', 2: '₂' }, sup = { 0: '⁰', 1: '¹', 2: '²' };
    const named = (gp, marks) => Object.fromEntries(gp.ids.map(v => [v, v.slice(0, -1) + marks[v.slice(-1)]]));
    /* 6L41: two copies, side by side as drawn */
    const gas = L.gasStationsGraph(ids('6L40'), we('6L40'), G['6L40'].U);
    build('6L41', gas, { s0: [30, 146], a0: [134, 123], c0: [80, 265], b0: [232, 205], s1: [290, 133], a1: [396, 110], c1: [335, 258], b1: [470, 200] },
      { title: 'Gas stations: G′, two copies (slide 41)', start: 's0', labels: named(gas, sub), bends: { 'a0>a1': -70 } });
    /* 6L51: the new vertex s below the graph, every edge reversed */
    const pz = L.pizzaGraph(ids('6L50'), we('6L50'), G['6L50'].W);
    build('6L51', pz, Object.assign({ s: [30, 255] }, Object.fromEntries(G['6L50'].nodes.map(([v, x, y]) => [v, [x, y]]))),
      { title: 'Dijkstra Pizza: G′ (slide 51)', start: 's', bends: { 's>b': 22 } });
    /* 6R39: the copies V¹ | V⁰ | V² from left to right, as drawn */
    const tx = L.taxGraph(ids('6R36'), we('6R36'));
    const col = { 1: 70, 0: 250, 2: 430 }, row = { s: 30, a: 107, b: 183, c: 260 };
    build('6R39', tx, Object.fromEntries(tx.ids.map(v => [v, [col[v.slice(-1)], row[v.slice(0, -1)]]])),
      { title: 'Exercise 3: G′ of the slide 36 graph (slides 38–39)', start: 's0', labels: named(tx, sup) });
  })();

  /* Exercises 1 and 7: the tree DFS produced, and the candidates the slide offers.
     Each tree is drawn with the slide's layout. Which candidates are possible is computed. */
  const treeQuestions = {
    ex1: {
      title: 'Which of these can DFS(e) output?', slide: '3R31', givenRoot: 'a', newRoot: 'e',
      given: { nodes: nodes('a,150,30 d,70,110 b,230,110 e,170,200 c,290,200'), edges: pairs(['a-d', 'a-b', 'b-e', 'b-c']) },
      candidates: [
        { name: 'Left tree', layout: nodes('e,70,30 a,150,100 d,70,190 b,230,190 c,290,265'), edges: pairs(['e-a', 'a-d', 'a-b', 'b-c']) },
        { name: 'Middle tree', layout: nodes('e,70,30 b,150,100 d,70,190 a,230,190 c,290,265'), edges: pairs(['e-b', 'b-d', 'b-a', 'a-c']) },
        { name: 'Right tree', layout: nodes('e,70,30 d,150,100 a,70,190 b,230,190 c,290,265'), edges: pairs(['e-d', 'd-a', 'd-b', 'b-c']) },
      ],
    },
    ex7: {
      title: 'Which of these can DFS(b) output?', slide: '3R44', givenRoot: 'a', newRoot: 'b',
      given: { nodes: nodes('a,150,30 e,60,110 b,240,110 c,200,190 d,290,265'), edges: pairs(['a-e', 'a-b', 'b-c', 'c-d']) },
      candidates: [
        { name: 'Figure 2', layout: nodes('b,40,30 a,110,85 e,180,145 d,250,205 c,320,265'), edges: pairs(['b-a', 'a-e', 'e-d', 'd-c']) },
        { name: 'Figure 3', layout: nodes('b,40,30 c,110,85 d,180,145 e,250,205 a,320,265'), edges: pairs(['b-c', 'c-d', 'd-e', 'e-a']) },
        { name: 'Figure 4', layout: nodes('b,40,30 d,110,85 c,180,145 a,250,205 e,320,265'), edges: pairs(['b-d', 'd-c', 'c-a', 'a-e']) },
      ],
    },
  };
  /* The edges of G(σ,n) are computed from the rule on slide 2L28, not typed in */
  function deBruijnRecord(sigma, n) {
    const { edges } = L.deBruijnGraph(sigma, n);
    return { edges: edges.map(e => [e.from, e.to]), words: edges.map(e => e.word) };
  }

  const gvOf = (box, g, extra = {}) => {
    box.innerHTML = '';
    return GraphView.create(box, Object.assign({
      nodes: g.nodes.map(([id, x, y]) => ({ id, x, y, label: id })),
      edges: edgeObjs(g.edges, '>'), width: 500, height: 290, r: 22, directed: g.directed, ariaLabel: g.title,
    }, extra));
  };
  const presetSelect = (keys, onChange) => {
    const label = document.createElement('label');
    label.className = 'algo-field';
    label.innerHTML = `Graph <select>${keys.map(k => `<option value="${k}">${G[k].title}</option>`).join('')}</select>`;
    label.querySelector('select').addEventListener('change', e => onChange(e.target.value));
    return label;
  };

  /* ------------------------------------------------------------------------
     1. Build your own order (slides 57-58)
     ------------------------------------------------------------------------ */
  function order(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: build a topological sort</p>
      <p class="ex-hint">Drag the vertices into a line, or focus one and use ← and →. Every arrow must point right.</p>
      <div class="ex-controls" data-c></div>
      <div class="ord-stage"><svg class="ord-arcs" aria-hidden="true"></svg><div class="ord-row"></div></div>
      <div class="ex-msg" aria-live="polite"></div>
      <div class="ord-found"></div></div>`;
    const c = host.querySelector('[data-c]'), stage = host.querySelector('.ord-stage'), row = host.querySelector('.ord-row'),
      svg = host.querySelector('.ord-arcs'), msg = host.querySelector('.ex-msg'), foundBox = host.querySelector('.ord-found');
    const NS = 'http://www.w3.org/2000/svg';
    let g, seq, tokens = {}, arcs = [], found = new Set(), total = 0, until = 0, drag = null, raf = null;

    function draw() {
      const s = stage.getBoundingClientRect();
      svg.setAttribute('viewBox', `0 0 ${s.width} ${s.height}`);
      const pos = Object.fromEntries(seq.map((v, i) => [v, i]));
      arcs.forEach(a => {
        const u = tokens[a.u].getBoundingClientRect(), v = tokens[a.v].getBoundingClientRect();
        const base = Math.min(u.top, v.top) - s.top - 3;
        const x1 = u.left - s.left + u.width / 2 + 7, x2 = v.left - s.left + v.width / 2 - 7;
        const h = Math.min(base - 8, 22 + Math.abs(x1 - x2) * .42);
        a.path.setAttribute('d', `M${x1},${base} C${x1},${base - h} ${x2},${base - h} ${x2},${base}`);
        a.head.setAttribute('d', `M${x2},${base + 1} l-5,-9 l10,0 Z`);
        const bad = pos[a.u] > pos[a.v];
        a.g.classList.toggle('left', bad);
      });
    }
    function kick(ms = 460) {
      until = Math.max(until, performance.now() + ms);
      if (raf) return;
      const loop = () => {
        draw();
        if (drag || performance.now() < until) raf = requestAnimationFrame(loop); else raf = null;
      };
      raf = requestAnimationFrame(loop);
    }
    function reorder(mutate, exclude) {
      const first = {};
      seq.forEach(v => { first[v] = tokens[v].getBoundingClientRect(); });
      mutate();
      seq.forEach(v => row.appendChild(tokens[v]));
      seq.forEach(v => {
        if (v === exclude) return;
        const r = tokens[v].getBoundingClientRect(), dx = first[v].left - r.left;
        if (dx) anim(tokens[v], [{ transform: `translateX(${dx}px)` }, { transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.3,.7,.2,1)' });
      });
      kick();
    }
    function verdict(moved) {
      const left = L.leftEdges(seq, g.edges);
      const prefix = moved ? `You moved ${moved}. ` : '';
      if (!total) {
        const [u, v] = left[0];
        say(msg, `${prefix}Arrow ${u} → ${v} points left. This graph has a cycle, so no order can make every arrow point right.`, 'fail');
        return;
      }
      if (left.length) {
        const [u, v] = left[0];
        say(msg, `${prefix}Not valid yet: arrow ${u} → ${v} points left, because ${v} comes before ${u}.${left.length > 1 ? ` ${left.length} arrows point left in total.` : ''}`, 'fail');
        return;
      }
      const key = seq.join(' ');
      const isNew = !found.has(key);
      found.add(key);
      say(msg, `${prefix}Valid: every arrow points right. ${seq.join(', ')} is a topological sort.`, 'ok');
      if (isNew) {
        const chip = document.createElement('span');
        chip.className = 'chip'; chip.textContent = seq.join(' ');
        foundBox.querySelector('.found-list').appendChild(chip);
        pop(chip);
      }
      foundBox.querySelector('.found-n').textContent = `Valid orders you found: ${found.size} of ${total}`;
    }
    function load(key) {
      g = G[key]; seq = g.start.slice(); total = L.countTopoOrders(g.nodes.map(n => n[0]), g.edges); found = new Set();
      row.innerHTML = ''; svg.innerHTML = ''; tokens = {}; arcs = [];
      foundBox.innerHTML = total ? `<span class="found-n">Valid orders you found: 0 of ${total}</span><span class="found-list"></span>` : '';
      seq.forEach(v => {
        const t = document.createElement('button');
        t.type = 'button'; t.className = 'ord-token'; t.textContent = v; t.setAttribute('aria-label', `Vertex ${v}`);
        tokens[v] = t; row.appendChild(t);
        t.addEventListener('pointerdown', e => {
          drag = { v, grab: e.clientX - t.getBoundingClientRect().left };
          t.setPointerCapture(e.pointerId); t.classList.add('dragging'); kick();
        });
        t.addEventListener('pointermove', e => {
          if (!drag || drag.v !== v) return;
          const home = () => { t.style.transform = ''; const r = t.getBoundingClientRect(); return r; };
          let h = home();
          const dx = e.clientX - drag.grab - h.left;
          const centre = h.left + dx + h.width / 2;
          const i = seq.indexOf(v);
          const nb = dx > 0 ? seq[i + 1] : seq[i - 1];
          if (nb) {
            const n = tokens[nb].getBoundingClientRect();
            if (Math.abs(centre - (n.left + n.width / 2)) < n.width * .45 || (dx > 0 ? centre > n.left + n.width / 2 : centre < n.left + n.width / 2)) {
              reorder(() => { seq.splice(i, 1); seq.splice(dx > 0 ? i + 1 : i - 1, 0, v); }, v);
              h = home();
              drag.moved = true;
            }
          }
          t.style.transform = `translateX(${e.clientX - drag.grab - h.left}px)`;
        });
        const end = () => {
          if (!drag || drag.v !== v) return;
          const r = t.getBoundingClientRect(), moved = drag.moved;
          drag = null; t.classList.remove('dragging'); t.style.transform = '';
          const h = t.getBoundingClientRect();
          anim(t, [{ transform: `translateX(${r.left - h.left}px)` }, { transform: 'none' }], { duration: 220, easing: 'ease-out' });
          kick(); if (moved) verdict(v);
        };
        t.addEventListener('pointerup', end);
        t.addEventListener('pointercancel', end);
        t.addEventListener('keydown', e => {
          const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          const i = seq.indexOf(v), j = i + d;
          if (j < 0 || j >= seq.length) return;
          reorder(() => { seq.splice(i, 1); seq.splice(j, 0, v); });
          t.focus(); verdict(v);
        });
      });
      arcs = g.edges.map(([u, v]) => {
        const a = document.createElementNS(NS, 'g'); a.setAttribute('class', 'ord-arc');
        const path = document.createElementNS(NS, 'path'), head = document.createElementNS(NS, 'path');
        path.setAttribute('class', 'shaft'); head.setAttribute('class', 'head');
        a.appendChild(path); a.appendChild(head); svg.appendChild(a);
        return { u, v, g: a, path, head };
      });
      draw(); kick(); verdict();
    }
    c.appendChild(presetSelect(['L56', 'R33', 'L61'], load));
    const shuffle = document.createElement('button');
    shuffle.type = 'button'; shuffle.className = 'ex-btn'; shuffle.textContent = 'Shuffle';
    shuffle.addEventListener('click', () => {
      reorder(() => { for (let i = seq.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [seq[i], seq[j]] = [seq[j], seq[i]]; } });
      verdict();
    });
    c.appendChild(shuffle);
    load('L56');
    window.addEventListener('resize', () => draw());
  }

  /* ------------------------------------------------------------------------
     2. Run topo-sort by hand (slides 62-71)
     ------------------------------------------------------------------------ */
  function byHand(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: run the algorithm by hand</p>
      <p class="ex-hint">Click a source to delete it. If you get stuck, press the button that says so.</p>
      <div class="ex-controls" data-c></div>
      <div class="ex-graph"></div>
      <div class="ex-msg" aria-live="polite"></div>
      <p class="strip-name">Output</p><div class="strip out" data-out></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg'), outBox = host.querySelector('[data-out]');
    let g, gv, out = [], ids = [], timer = null, finished = false;

    const remaining = () => ids.filter(v => !out.includes(v));
    function paint() {
      const rem = new Set(remaining());
      ids.forEach(v => gv.setNodeState(v, rem.has(v) ? '' : 'gone'));
      g.edges.forEach(([a, b]) => gv.setEdgeState(`${a}>${b}`, rem.has(a) ? '' : 'gone'));
    }
    function load(key) {
      g = G[key]; ids = g.nodes.map(n => n[0]); out = []; finished = false;
      gv = gvOf(box, g); outBox.innerHTML = ''; paint();
      say(msg, 'Start with a vertex that has no incoming edges.');
    }
    function finishCheck() {
      if (!remaining().length) {
        finished = true;
        say(msg, `The graph is empty. Output: ${out.join(', ')}. That is a valid topological sort.`, 'ok');
      }
    }
    box.addEventListener('click', e => {
      const n = e.target.closest('.node');
      if (!n || finished) return;
      const v = n.dataset.id;
      if (out.includes(v)) { say(msg, `${v} was already deleted.`); return; }
      clearTimeout(timer);
      const rem = remaining();
      const inc = g.edges.filter(([a, b]) => b === v && rem.includes(a));
      paint();
      if (inc.length) {
        inc.forEach(([a, b]) => gv.setEdgeState(`${a}>${b}`, 'blocked'));
        shake(n);
        say(msg, `${v} is not a source: ${inc.map(x => `the edge from ${x[0]}`).join(' and ')} still ${inc.length > 1 ? 'enter' : 'enters'} it.`, 'fail');
        timer = setTimeout(paint, 1300);
        return;
      }
      const rect = gv.nodeEl(v).getBoundingClientRect();
      const del = g.edges.filter(([a]) => a === v);
      out.push(v); paint();
      const t = document.createElement('span');
      t.className = 'token in-out'; t.textContent = v; outBox.appendChild(t); flyFrom(t, rect);
      say(msg, `Deleted ${v}${del.length ? ` and its outgoing edges to ${del.map(x => x[1]).join(', ')}` : ''}. ${v} is number ${out.length} in the output.`);
      finishCheck();
    });
    c.appendChild(presetSelect(['L56', 'R33', 'L61', 'L63'], load));
    const stuck = document.createElement('button');
    stuck.type = 'button'; stuck.className = 'ex-btn'; stuck.textContent = 'No source left';
    stuck.addEventListener('click', () => {
      if (finished) return;
      clearTimeout(timer); paint();
      const rem = remaining();
      const src = L.sources(rem, g.edges);
      if (src.length) {
        src.forEach(v => { gv.setNodeState(v, 'ready'); pop(gv.nodeEl(v)); });
        say(msg, `Not yet: ${src.join(', ')} ${src.length > 1 ? 'have' : 'has'} no incoming edges.`, 'fail');
        timer = setTimeout(paint, 1300);
        return;
      }
      finished = true;
      const cyc = L.findCycle(rem, g.edges);
      for (let i = 0; i + 1 < cyc.length; i++) gv.setEdgeState(`${cyc[i]}>${cyc[i + 1]}`, 'active');
      cyc.forEach(v => gv.setNodeState(v, 'target'));
      say(msg, `Correct. Every remaining vertex has an incoming edge, so the graph includes a cycle (${cyc.join(' → ')}) and a topological sort is not possible.`, 'ok');
    });
    const undo = document.createElement('button');
    undo.type = 'button'; undo.className = 'ex-btn'; undo.textContent = 'Undo';
    undo.addEventListener('click', () => {
      if (!out.length) return;
      clearTimeout(timer);
      const v = out.pop(); finished = false;
      outBox.lastChild.remove(); paint(); pop(gv.nodeEl(v));
      say(msg, `Put ${v} and its outgoing edges back.`);
    });
    const restart = document.createElement('button');
    restart.type = 'button'; restart.className = 'ex-btn'; restart.textContent = 'Restart';
    restart.addEventListener('click', () => load(c.querySelector('select').value));
    c.append(stuck, undo, restart);
    load('L56');
  }

  /* ------------------------------------------------------------------------
     3. Handshaking counter (slides 44-49)
     ------------------------------------------------------------------------ */
  function handshake(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: watch the degrees add up</p>
      <p class="ex-hint">Click one vertex and then another to add an edge. Click the same vertex twice for a self-loop. Click an edge to remove it.</p>
      <div class="ex-controls" data-c></div>
      <div class="ex-graph"></div>
      <div class="deg-table"></div>
      <div class="deg-eq"></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), table = host.querySelector('.deg-table'),
      eq = host.querySelector('.deg-eq'), msg = host.querySelector('.ex-msg');
    const base = G.L45;
    const ids = base.nodes.map(n => n[0]);
    let edges = [], uid = 0, first = null, gv, directed = false;

    const counts = () => {
      const deg = {}, ind = {}, outd = {};
      ids.forEach(v => { deg[v] = ind[v] = outd[v] = 0; });
      edges.forEach(e => { deg[e.from] += 1; deg[e.to] += 1; outd[e.from] += 1; ind[e.to] += 1; });
      return { deg, ind, outd };
    };
    function draw(prev, changed = []) {
      box.innerHTML = '';
      const list = GraphView.autoBend(edges.map(e => ({ ...e })));
      gv = GraphView.create(box, { nodes: base.nodes.map(([id, x, y]) => ({ id, x, y, label: id })), edges: list, width: 500, height: 290, r: 22, directed, ariaLabel: 'Graph you are building' });
      if (first) gv.setNodeState(first, 'cur');
      const { deg, ind, outd } = counts();
      const m = edges.length;
      const rows = directed
        ? [['in-degree', ind], ['out-degree', outd]]
        : [['deg', deg]];
      table.innerHTML = `<div class="deg-row head"><span></span>${ids.map(v => `<span>${v}</span>`).join('')}<span>Sum</span></div>` +
        rows.map(([name, map]) => `<div class="deg-row" data-row="${name}"><span class="deg-name">${name}</span>${ids.map(v => `<span class="deg-cell" data-v="${v}">${map[v]}</span>`).join('')}<span class="deg-sum">${ids.reduce((s, v) => s + map[v], 0)}</span></div>`).join('');
      const terms = map => ids.map(v => map[v]).join(' + ');
      eq.innerHTML = directed
        ? `<span>Σ in-deg = ${terms(ind)} = <b>${m}</b></span><span>Σ out-deg = ${terms(outd)} = <b>${m}</b></span><span>m = <b>${m}</b></span>`
        : `<span>Σ deg = ${terms(deg)} = <b>${2 * m}</b></span><span>2 · m = 2 · ${m} = <b>${2 * m}</b></span>`;
      changed.forEach(v => table.querySelectorAll(`.deg-cell[data-v="${v}"]`).forEach(pop));
      if (changed.length) eq.querySelectorAll('b').forEach(pop);
    }
    function floatText(v, text) {
      if (reduced()) return;
      const n = base.nodes.find(x => x[0] === v);
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('class', 'floater'); t.setAttribute('x', n[1]); t.setAttribute('y', n[2] - 28);
      t.textContent = text; gv.svg.appendChild(t);
      t.animate([{ transform: 'translateY(8px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1, offset: .3 }, { transform: 'translateY(-16px)', opacity: 0 }], { duration: 1000 }).onfinish = () => t.remove();
    }
    function drawIn(id) {
      const shaft = gv.edgeEl(id).querySelector('line:not(.hit), path.curve');
      if (reduced() || !shaft || !shaft.getTotalLength) return;
      const len = shaft.getTotalLength();
      shaft.animate([{ strokeDasharray: `${len}`, strokeDashoffset: len }, { strokeDasharray: `${len}`, strokeDashoffset: 0 }], { duration: 380, easing: 'ease-out' });
    }
    function addEdge(a, b) {
      const id = `e${uid++}`;
      edges.push({ id, from: a, to: b });
      first = null;
      draw(null, [a, b]);
      drawIn(id);
      if (a === b) {
        floatText(a, directed ? '+1 in, +1 out' : '+2');
        say(msg, directed ? `Added a self-loop at ${a}. It adds 1 to the in-degree and 1 to the out-degree of ${a}.` : `Added a self-loop at ${a}. Both of its ends touch ${a}, so deg(${a}) goes up by 2.`);
      } else if (directed) {
        floatText(a, '+1 out'); floatText(b, '+1 in');
        say(msg, `Added the edge ${a} → ${b}. The out-degree of ${a} and the in-degree of ${b} each go up by 1, so each sum grows by 1.`);
      } else {
        floatText(a, '+1'); floatText(b, '+1');
        say(msg, `Added the edge (${a},${b}). deg(${a}) and deg(${b}) each go up by 1, so the sum grows by 2.`);
      }
    }
    box.addEventListener('click', e => {
      const n = e.target.closest('.node');
      if (n) {
        const v = n.dataset.id;
        if (first === null) { first = v; gv.setNodeState(v, 'cur'); pop(gv.nodeEl(v)); say(msg, `${v} selected. Now click where the edge should end.`); return; }
        addEdge(first, v);
        return;
      }
      const eg = e.target.closest('.edge');
      if (eg) {
        const edge = edges.find(x => x.id === eg.dataset.id);
        edges = edges.filter(x => x !== edge);
        first = null;
        draw(null, [edge.from, edge.to]);
        say(msg, `Removed the edge between ${edge.from} and ${edge.to}. The degrees drop again.`);
      }
    });
    const seg = document.createElement('div');
    seg.className = 'seg small'; seg.innerHTML = '<button type="button" data-d="0" aria-pressed="true">Undirected</button><button type="button" data-d="1" aria-pressed="false">Directed</button>';
    seg.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      directed = b.dataset.d === '1';
      seg.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      first = null; draw();
      say(msg, directed ? 'Directed: each edge now counts once as outgoing and once as incoming.' : 'Undirected: each edge counts once at each of its two ends.');
    });
    const load = document.createElement('button');
    load.type = 'button'; load.className = 'ex-btn'; load.textContent = 'Load the slide graph';
    load.addEventListener('click', () => {
      edges = base.edges.map(([from, to]) => ({ id: `e${uid++}`, from, to }));
      first = null; draw(null, ids);
      say(msg, `This is the graph from ${directed ? 'slide 47' : 'slide 45'}: ${edges.length} edges.`);
    });
    const clear = document.createElement('button');
    clear.type = 'button'; clear.className = 'ex-btn'; clear.textContent = 'Clear';
    clear.addEventListener('click', () => { edges = []; first = null; draw(null, ids); say(msg, 'All edges removed. Every degree is 0.'); });
    c.append(seg, load, clear);
    draw();
    say(msg, 'Click a vertex to begin.');
  }

  /* ------------------------------------------------------------------------
     4. Fill the representation (slides 51-54)
     ------------------------------------------------------------------------ */
  function represent(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: fill in the representation</p>
      <p class="ex-hint" data-hint></p>
      <div class="ex-controls" data-c></div>
      <div class="rep-grid"><div class="ex-graph"></div><div class="rep-panel"></div></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), panel = host.querySelector('.rep-panel'),
      msg = host.querySelector('.ex-msg'), hint = host.querySelector('[data-hint]');
    let g, gv, ids, view = 'matrix', filled, listRows, activeRow, wrong = 0;
    const hasEdge = (a, b) => g.edges.some(([x, y]) => (x === a && y === b) || (!g.directed && x === b && y === a));
    const edgeId = (a, b) => (g.edges.some(([x, y]) => x === a && y === b) ? `${a}>${b}` : `${b}>${a}`);
    const flashEdge = (a, b) => {
      gv.highlight({ nodes: [a, b], edges: [edgeId(a, b)] });
      setTimeout(() => gv.highlight(), 800);
    };
    const need = () => ids.flatMap(a => ids.filter(b => hasEdge(a, b)).map(b => `${a}|${b}`));

    function buildMatrix() {
      hint.textContent = 'Click every cell that should hold a 1. Hover a cell to see which pair it stands for.';
      filled = new Set();
      panel.innerHTML = `<div class="mx" style="grid-template-columns: repeat(${ids.length + 1}, minmax(0, 1fr))"><span></span>${ids.map(v => `<span class="mx-h">${v}</span>`).join('')}` +
        ids.map(a => `<span class="mx-h">${a}</span>` + ids.map(b => `<button type="button" class="mx-c ${a === b ? 'diag' : ''}" data-a="${a}" data-b="${b}" aria-label="M(${a},${b})"></button>`).join('')).join('') + '</div>';
    }
    function setCell(a, b) {
      const cell = panel.querySelector(`.mx-c[data-a="${a}"][data-b="${b}"]`);
      cell.textContent = '1'; cell.classList.add('one'); pop(cell);
      filled.add(`${a}|${b}`);
    }
    function matrixDone() {
      if (need().every(k => filled.has(k))) {
        panel.querySelectorAll('.mx-c:not(.one)').forEach((x, i) => {
          x.textContent = '0'; x.classList.add('zero');
          anim(x, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: i * 12, fill: 'backwards' });
        });
        say(msg, `Complete, with ${wrong} wrong ${wrong === 1 ? 'click' : 'clicks'}. Every other cell is 0. The matrix uses |V|² = ${ids.length * ids.length} cells, however few edges there are.${g.directed ? '' : ' It is symmetric, because (v,w) and (w,v) are the same edge.'}`, 'ok');
      }
    }
    function buildList() {
      hint.textContent = 'Pick a row, then click the neighbors of that vertex in the graph. Any order inside a list is fine.';
      listRows = Object.fromEntries(ids.map(v => [v, []]));
      activeRow = ids[0];
      panel.innerHTML = ids.map(v => `<div class="lst-row" data-v="${v}"><button type="button" class="lst-head">${v}</button><span class="lst-cells"></span><span class="lst-null">null</span></div>`).join('');
      markRow();
    }
    function markRow() {
      panel.querySelectorAll('.lst-row').forEach(r => r.classList.toggle('active', r.dataset.v === activeRow));
    }
    const listDone = v => ids.filter(b => hasEdge(v, b)).length === listRows[v].length;
    function clickList(b) {
      const a = activeRow;
      if (!a) return;
      const row = panel.querySelector(`.lst-row[data-v="${a}"]`);
      if (a === b && !hasEdge(a, b)) { shake(row); say(msg, `There is no edge from ${a} to itself.`, 'fail'); wrong += 1; return; }
      if (listRows[a].includes(b)) { shake(row); say(msg, `${b} is already in the list of ${a}.`, 'fail'); return; }
      if (!hasEdge(a, b)) { shake(gv.nodeEl(b)); wrong += 1; say(msg, `(${a}, ${b}) is not an edge${g.directed ? `: the direction matters in a digraph` : ''}, so ${b} does not belong in L(${a}).`, 'fail'); return; }
      listRows[a].push(b);
      const rect = gv.nodeEl(b).getBoundingClientRect();
      const cell = document.createElement('span');
      cell.className = 'cell'; cell.textContent = b;
      const link = document.createElement('span');
      link.className = 'link'; link.textContent = '→';
      row.querySelector('.lst-cells').append(cell, link);
      flyFrom(cell, rect); flashEdge(a, b);
      say(msg, `(${a}, ${b}) is an edge, so ${b} joins L(${a}).`);
      if (listDone(a)) {
        const next = ids.find(v => !listDone(v));
        activeRow = next || null; markRow();
        if (!next) {
          const m = g.edges.length, cells = Object.values(listRows).flat().length;
          say(msg, `Complete, with ${wrong} wrong ${wrong === 1 ? 'click' : 'clicks'}. The lists hold ${cells} cells for ${m} edges: ${g.directed ? 'one per edge' : 'two per edge, since each edge appears in both lists'}. Space = a|V| + ${g.directed ? '' : '2'}b|E|.`, 'ok');
        }
      }
    }
    function load(key) {
      g = G[key]; ids = g.nodes.map(n => n[0]); wrong = 0;
      gv = gvOf(box, g);
      if (view === 'matrix') buildMatrix(); else buildList();
      say(msg, g.directed ? 'In this digraph, M(v,w) = 1 only when the arrow goes from v to w.' : 'This graph is undirected, so each edge appears twice.');
    }
    panel.addEventListener('click', e => {
      const head = e.target.closest('.lst-head');
      if (head) { activeRow = head.parentElement.dataset.v; markRow(); pop(head); return; }
      const cell = e.target.closest('.mx-c');
      if (!cell || cell.classList.contains('one') || cell.classList.contains('zero')) return;
      const { a, b } = cell.dataset;
      if (!hasEdge(a, b)) {
        wrong += 1; shake(cell); cell.classList.add('wrong'); setTimeout(() => cell.classList.remove('wrong'), 500);
        say(msg, `M(${a},${b}) stays 0: (${a}, ${b}) is not an edge.${g.directed && hasEdge(b, a) ? ` The edge goes the other way, from ${b} to ${a}.` : ''}`, 'fail');
        return;
      }
      setCell(a, b); flashEdge(a, b);
      if (!g.directed) {
        setTimeout(() => { setCell(b, a); matrixDone(); }, 220);
        say(msg, `(${a}, ${b}) is an edge. In an undirected graph (${a}, ${b}) = (${b}, ${a}), so M(${b},${a}) becomes 1 too.`);
      } else {
        say(msg, `(${a}, ${b}) is an edge, so M(${a},${b}) = 1.`);
        matrixDone();
      }
    });
    panel.addEventListener('mouseover', e => {
      const cell = e.target.closest('.mx-c');
      if (cell) gv.highlight({ nodes: [cell.dataset.a, cell.dataset.b] });
    });
    panel.addEventListener('mouseout', e => { if (e.target.closest('.mx-c')) gv.highlight(); });
    box.addEventListener('click', e => {
      const n = e.target.closest('.node');
      if (n && view === 'list') clickList(n.dataset.id);
    });
    const sel = presetSelect(['L51', 'L52'], load);
    const seg = document.createElement('div');
    seg.className = 'seg small'; seg.innerHTML = '<button type="button" data-v="matrix" aria-pressed="true">Adjacency matrix</button><button type="button" data-v="list" aria-pressed="false">Adjacency list</button>';
    seg.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      view = b.dataset.v;
      seg.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      load(c.querySelector('select').value);
    });
    const restart = document.createElement('button');
    restart.type = 'button'; restart.className = 'ex-btn'; restart.textContent = 'Restart';
    restart.addEventListener('click', () => load(c.querySelector('select').value));
    c.append(sel, seg, restart);
    load('L51');
  }

  /* ------------------------------------------------------------------------
     5. Two-color a graph (slides 48 and 20)
     ------------------------------------------------------------------------ */
  function twoColor(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: split the vertices into V₁ and V₂</p>
      <p class="ex-hint">Click a vertex to color it. Every edge must join two different colors.</p>
      <div class="ex-controls" data-c></div>
      <div class="ex-graph"></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg');
    let g, gv, ids, color = {}, closed = false;
    function paint() {
      ids.forEach(v => gv.setNodeState(v, color[v] ? `c${color[v]}` : ''));
      const bad = g.edges.filter(([a, b]) => color[a] && color[a] === color[b]);
      g.edges.forEach(([a, b]) => gv.setEdgeState(`${a}>${b}`, bad.some(x => x[0] === a && x[1] === b) ? 'blocked' : ''));
      return bad;
    }
    function load(key) {
      g = G[key]; ids = g.nodes.map(n => n[0]); color = {}; closed = false;
      gv = gvOf(box, g); paint();
      say(msg, 'Color each vertex, or press "Impossible" if no split exists.');
    }
    box.addEventListener('click', e => {
      const n = e.target.closest('.node');
      if (!n || closed) return;
      const v = n.dataset.id;
      color[v] = ((color[v] || 0) + 1) % 3;
      pop(n);
      const bad = paint();
      if (bad.length) {
        const [a, b] = bad[0];
        bad.forEach(([x, y]) => pop(gv.edgeEl(`${x}>${y}`)));
        say(msg, `Edge (${a},${b}) joins two vertices of the same color, so this split is not bipartite.`, 'fail');
      } else if (ids.every(x => color[x])) {
        const V1 = ids.filter(x => color[x] === 1), V2 = ids.filter(x => color[x] === 2);
        say(msg, `Every edge joins V₁ = {${V1.join(', ')}} to V₂ = {${V2.join(', ')}}. This graph is bipartite.`, 'ok');
      } else {
        say(msg, color[v] ? `${v} is now in V${color[v] === 1 ? '₁' : '₂'}. No edge breaks the rule so far.` : `${v} has no color now.`);
      }
    });
    c.appendChild(presetSelect(['P5', 'C4', 'C5', 'S4', 'K23', 'R20'], load));
    const imp = document.createElement('button');
    imp.type = 'button'; imp.className = 'ex-btn'; imp.textContent = 'Impossible';
    imp.addEventListener('click', () => {
      if (closed) return;
      const r = L.bipartition(ids, g.edges);
      if (r.ok) { say(msg, 'It is possible. Pick one vertex and alternate colors along its edges.', 'fail'); shake(box); return; }
      closed = true; color = {}; paint();
      const cyc = r.oddCycle;
      for (let i = 0; i + 1 < cyc.length; i++) {
        const [a, b] = [cyc[i], cyc[i + 1]];
        gv.setEdgeState(g.edges.some(([x, y]) => x === a && y === b) ? `${a}>${b}` : `${b}>${a}`, 'active');
      }
      cyc.forEach(v => gv.setNodeState(v, 'target'));
      say(msg, `Correct. Going around ${cyc.join(' – ')} the colors would have to alternate, and an odd cycle cannot end on the right color.`, 'ok');
    });
    const clear = document.createElement('button');
    clear.type = 'button'; clear.className = 'ex-btn'; clear.textContent = 'Clear';
    clear.addEventListener('click', () => load(c.querySelector('select').value));
    c.append(imp, clear);
    load('P5');
  }

  /* ------------------------------------------------------------------------
     6. Find the components (slides 18-19)
     ------------------------------------------------------------------------ */
  function components(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: find the components</p>
      <p class="ex-hint">Pick a group, click the vertices that belong in it, then press Check.</p>
      <div class="ex-controls" data-c></div>
      <div class="ex-graph"></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg');
    let g, gv, ids, group = {}, active = 1, reach, timer = null;
    const paint = () => ids.forEach(v => gv.setNodeState(v, group[v] ? `g${group[v]}` : ''));
    function load(key) {
      g = G[key]; ids = g.nodes.map(n => n[0]); group = {};
      reach = L.reachability(ids, g.edges, g.directed);
      gv = gvOf(box, g); paint();
      say(msg, g.directed ? 'Vertices belong together only if each can reach the other along directed paths.' : 'Vertices belong together if a path connects them.');
    }
    box.addEventListener('click', e => {
      const n = e.target.closest('.node');
      if (!n) return;
      clearTimeout(timer); paint();
      const v = n.dataset.id;
      if (group[v] === active) { delete group[v]; say(msg, `${v} removed from group ${active}.`); }
      else { group[v] = active; say(msg, `${v} is now in group ${active}.`); }
      paint(); pop(n);
    });
    const flash = list => {
      list.forEach(v => { gv.setNodeState(v, 'cur'); shake(gv.nodeEl(v)); });
      timer = setTimeout(paint, 1400);
    };
    const palette = document.createElement('div');
    palette.className = 'palette';
    [1, 2, 3, 4].forEach(i => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = `swatch g${i}`; b.textContent = i; b.setAttribute('aria-label', `Group ${i}`);
      b.setAttribute('aria-pressed', String(i === active));
      b.addEventListener('click', () => {
        active = i;
        palette.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        pop(b);
      });
      palette.appendChild(b);
    });
    const check = document.createElement('button');
    check.type = 'button'; check.className = 'ex-btn primary'; check.textContent = 'Check';
    check.addEventListener('click', () => {
      clearTimeout(timer); paint();
      const missing = ids.filter(v => !group[v]);
      if (missing.length) { flash(missing); say(msg, `${missing.join(', ')} ${missing.length > 1 ? 'are' : 'is'} not in any group yet.`, 'fail'); return; }
      for (const u of ids) for (const v of ids) {
        if (u === v) continue;
        if (group[u] === group[v] && !reach[u][v]) {
          flash([u, v]);
          say(msg, `${u} and ${v} are in the same group, but there is no ${g.directed ? 'directed ' : ''}path from ${u} to ${v}.`, 'fail');
          return;
        }
        if (group[u] !== group[v] && reach[u][v] && reach[v][u]) {
          flash([u, v]);
          say(msg, `${u} and ${v} can reach each other, so they must be in the same group. A component is a maximal set.`, 'fail');
          return;
        }
      }
      const comps = L.components(ids, g.edges, g.directed);
      ids.forEach((v, i) => anim(gv.nodeEl(v), [{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 420, delay: i * 50 }));
      say(msg, `Correct. The ${g.directed ? 'strongly ' : ''}connected components are ${comps.map(x => `{${x.join(', ')}}`).join(', ')}.`, 'ok');
    });
    const clear = document.createElement('button');
    clear.type = 'button'; clear.className = 'ex-btn'; clear.textContent = 'Clear';
    clear.addEventListener('click', () => load(c.querySelector('select').value));
    c.append(presetSelect(['R19', 'R8'], load), palette, check, clear);
    load('R19');
  }


  /* ------------------------------------------------------------------------
     Week 2 helpers: graphs that may have parallel edges and self-loops.
     Each edge gets the id e0, e1, … so two parallel edges stay separate.
     ------------------------------------------------------------------------ */
  const idsOf = g => g.nodes.map(n => n[0]);
  const multiEdges = g => GraphView.autoBend(g.edges.map(([from, to], i) => ({ id: `e${i}`, from, to, loopAngle: g.loops ? g.loops[from] : undefined })));
  const gvMulti = (box, g, extra = {}) => {
    box.innerHTML = '';
    const gv = GraphView.create(box, Object.assign({
      nodes: g.nodes.map(([id, x, y]) => ({ id, x, y, label: id })), edges: multiEdges(g),
      width: 500, height: 290, r: 22, directed: g.directed, ariaLabel: g.title,
    }, extra));
    (g.added || []).forEach(i => { gv.edgeEl(`e${i}`).dataset.extra = '1'; });
    return gv;
  };
  /* Light the edges of a tour up one after another; returns a function that cancels it */
  function playEdges(gv, edgeIndices, state = 'out') {
    const timers = edgeIndices.map((e, i) => setTimeout(() => { gv.setEdgeState(`e${e}`, state); pop(gv.edgeEl(`e${e}`)); }, reduced() ? 0 : i * 130));
    return () => timers.forEach(clearTimeout);
  }
  /* The edge indices along a list of vertices (first unused edge between each pair) */
  function edgesAlong(g, vertices) {
    const used = new Set();
    return vertices.slice(1).map((v, i) => {
      const u = vertices[i];
      const k = g.edges.findIndex(([a, b], j) => !used.has(j) && ((a === u && b === v) || (!g.directed && a === v && b === u)));
      used.add(k);
      return k;
    });
  }
  const verdictButton = (label, onClick) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'ex-btn'; b.textContent = label;
    b.addEventListener('click', () => onClick(b));
    return b;
  };

  /* ------------------------------------------------------------------------
     7. Euler cycle, Euler path or neither? (slides 2L15-17)
     ------------------------------------------------------------------------ */
  function eulerClassify(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: cycle, path or neither?</p>
      <p class="ex-hint">Click every vertex of odd degree. Then give your verdict.</p>
      <div class="ex-controls" data-c></div>
      <div class="ex-graph"></div>
      <div class="ex-verdicts" data-v></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg'), verdicts = host.querySelector('[data-v]');
    let g, gv, ids, deg, st, marked, stop = () => {}, done = false;
    function load(key) {
      stop(); g = G[key]; ids = idsOf(g); deg = L.degrees(ids, g.edges); st = L.eulerStatus(ids, g.edges, false);
      marked = new Set(); done = false; gv = gvMulti(box, g);
      verdicts.querySelectorAll('button').forEach(b => b.classList.remove('right', 'wrong'));
      say(msg, 'Count the edge ends at each vertex. A self-loop counts twice.');
    }
    box.addEventListener('click', e => {
      const n = e.target.closest('.node');
      if (!n || done) return;
      const v = n.dataset.id;
      if (deg[v] % 2 === 0) { shake(n); say(msg, `deg(${v}) = ${deg[v]}, which is even, so ${v} stays unmarked.`, 'fail'); return; }
      if (marked.has(v)) { marked.delete(v); gv.setNodeState(v, ''); pop(n); say(msg, `Unmarked ${v}.`); return; }
      marked.add(v); gv.setNodeState(v, 'ready'); pop(n);
      const left = st.odd.length - marked.size;
      say(msg, `deg(${v}) = ${deg[v]}, which is odd. ${left ? `${left} more odd ${left === 1 ? 'vertex' : 'vertices'} to find.` : 'That is every odd vertex. Now give your verdict.'}`, left ? undefined : 'ok');
    });
    const oddText = () => `${st.odd.length} ${st.odd.length === 1 ? 'vertex has' : 'vertices have'} odd degree`;
    const judge = (kind, b) => {
      if (done) return;
      verdicts.querySelectorAll('button').forEach(x => x.classList.remove('right', 'wrong'));
      if (kind !== st.kind) {
        b.classList.add('wrong'); shake(b);
        if (!st.connected) { say(msg, 'Neither: the graph is not connected (apart from isolated vertices), and both an Euler cycle and an Euler path need a connected graph.', 'fail'); return; }
        if (kind === 'cycle') say(msg, `No Euler cycle: ${oddText()} (${st.odd.join(', ')}). A cycle needs every degree even.`, 'fail');
        else if (kind === 'path') say(msg, st.odd.length ? `No Euler path: ${oddText()} (${st.odd.join(', ')}), and a path needs exactly two.` : 'Every degree is even, so there are no two odd endpoints. This graph has an Euler cycle, not a path that is not a cycle.', 'fail');
        else say(msg, st.odd.length ? `One does exist: exactly two vertices (${st.odd.join(', ')}) have odd degree.` : 'One does exist: the graph is connected and every degree is even.', 'fail');
        return;
      }
      done = true; b.classList.add('right'); pop(b);
      st.odd.forEach(v => gv.setNodeState(v, 'ready'));
      if (st.kind === 'none') {
        st.odd.forEach(v => shake(gv.nodeEl(v)));
        say(msg, `Correct: ${oddText()} (${st.odd.join(', ')}), which is more than two, so there is no Euler cycle and no Euler path.`, 'ok');
        return;
      }
      const tour = L.eulerTour(ids, g.edges, false);
      stop = playEdges(gv, tour.edges);
      say(msg, st.kind === 'cycle'
        ? `Correct: connected, with every degree even. Watch one Euler cycle: ${tour.vertices.join(' ')}.`
        : `Correct: exactly ${st.odd.join(' and ')} have odd degree. Watch one Euler path between them: ${tour.vertices.join(' ')}.`, 'ok');
    };
    verdicts.append(verdictButton('Euler cycle', b => judge('cycle', b)), verdictButton('Euler path, no cycle', b => judge('path', b)), verdictButton('Neither', b => judge('none', b)));
    const restart = document.createElement('button');
    restart.type = 'button'; restart.className = 'ex-btn'; restart.textContent = 'Restart';
    restart.addEventListener('click', () => load(c.querySelector('select').value));
    const keys = host.dataset.graphs ? host.dataset.graphs.split(',') : ['2L17', '2L17+', '2L21', '2R5', '2R6', '2L36II'];
    c.append(presetSelect(keys, load), restart);
    load(keys[0]);
  }

  /* ------------------------------------------------------------------------
     8. Trace an Euler cycle by hand (slides 2L19-23). Also reads off a De
        Bruijn sequence (slide 2L34) when the graph carries words.
     ------------------------------------------------------------------------ */
  function traceTool(host, keys, title, hintText) {
    host.innerHTML = `<div class="ex"><p class="ex-title">${title}</p>
      <p class="ex-hint">${hintText}</p>
      <div class="ex-controls" data-c></div>
      <div class="ex-graph"></div>
      <div class="ex-msg" aria-live="polite"></div>
      <p class="strip-name">Current walk</p><div class="strip eu-strip" data-sub></div>
      <p class="strip-name">Tour</p><div class="strip eu-strip" data-tour></div>
      <div data-lblock hidden><p class="strip-name">First letters</p><div class="strip eu-strip" data-letters></div></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg'),
      subBox = host.querySelector('[data-sub]'), tourBox = host.querySelector('[data-tour]'), lettersBox = host.querySelector('[data-letters]'), lblock = host.querySelector('[data-lblock]');
    let g, gv, ids, used, cur, tour, sub, tourE, subE, insertAt, cycleNo, phase, keyN, tokens;

    const untracedAt = v => g.edges.map((e, i) => i).filter(i => !used.has(i) && (g.edges[i][0] === v || (!g.directed && g.edges[i][1] === v)));
    const left = () => g.edges.length - used.size;
    const label = i => (g.words ? `edge ${g.words[i]}` : `edge (${g.edges[i][0]},${g.edges[i][1]})`);
    function renderTokens() {
      const first = new Map();
      tokens.forEach((el, k) => first.set(k, el.getBoundingClientRect()));
      const live = new Set([...tour, ...sub].map(t => t.key));
      tokens.forEach((el, k) => { if (!live.has(k)) { el.remove(); tokens.delete(k); } });
      const put = (t, target) => {
        let el = tokens.get(t.key);
        if (!el) { el = document.createElement('span'); el.className = `token eu-tok tk${t.cycle % 4}`; el.textContent = t.v; tokens.set(t.key, el); }
        target.appendChild(el);
      };
      tour.forEach(t => put(t, tourBox));
      sub.forEach(t => put(t, subBox));
      [...tour, ...sub].forEach(t => {
        const el = tokens.get(t.key), last = el.getBoundingClientRect();
        const from = first.get(t.key) || gv.nodeEl(t.v).getBoundingClientRect();
        anim(el, [{ transform: `translate(${from.left - last.left}px,${from.top - last.top}px)` }, { transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.3,.7,.2,1)' });
      });
    }
    const token = v => ({ key: keyN++, v, cycle: cycleNo });
    function setCur(v) {
      if (cur != null) gv.setNodeState(cur, '');
      cur = v;
      if (v != null) { gv.setNodeState(v, 'cur'); pop(gv.nodeEl(v)); }
    }
    function load(key) {
      g = G[key]; ids = idsOf(g); used = new Set(); tour = []; sub = []; tourE = []; subE = []; cycleNo = 0; phase = 'start'; keyN = 0; insertAt = null; cur = null;
      tokens = new Map(); subBox.innerHTML = ''; tourBox.innerHTML = ''; lettersBox.innerHTML = '';
      lblock.hidden = !g.words;
      gv = gvMulti(box, g, { edgeLabels: !!g.words });
      say(msg, 'Click a vertex to start from.');
    }
    function startWalk(v, text) {
      sub = [token(v)]; subE = []; phase = 'walk'; setCur(v); renderTokens();
      say(msg, text);
    }
    function closeWalk() {
      if (cycleNo === 0 || !tour.length) { tour = sub; tourE = subE; }
      else {
        tour = [...tour.slice(0, insertAt + 1), ...sub.slice(1), ...tour.slice(insertAt + 1)];
        tourE = [...tourE.slice(0, insertAt), ...subE, ...tourE.slice(insertAt)];
      }
      const closedAt = cur;
      sub = []; subE = []; renderTokens();
      if (!left()) {
        phase = 'done'; setCur(null);
        const route = tour.map(t => t.v).join(' ');
        if (!g.words) { say(msg, `Done: all ${g.edges.length} edges are used exactly once. Euler cycle: ${route}.`, 'ok'); return; }
        const seq = tourE.map(i => g.words[i][0]).join('');
        lettersBox.innerHTML = '';
        [...seq].forEach((ch, i) => {
          const t = document.createElement('span');
          t.className = 'token in-out'; t.textContent = ch; lettersBox.appendChild(t);
          anim(t, [{ opacity: 0, transform: 'translateY(-12px)' }, { opacity: 1, transform: 'none' }], { duration: 260, delay: i * 90, fill: 'backwards' });
        });
        const ok = L.isDeBruijn(seq, g.sigma, g.n);
        say(msg, `Done: all ${g.edges.length} edges are used. Their first letters are ${seq}. ${ok ? `Read around the circle, every word of length ${g.n} appears exactly once, so this is a De Bruijn sequence.` : 'Something went wrong.'}`, ok ? 'ok' : 'fail');
        return;
      }
      cycleNo += 1; phase = 'pick'; setCur(null);
      say(msg, `Stuck at ${closedAt}, where the walk started, so it is a cycle. ${left()} edges are still untraced. Click a vertex on the tour that has one.`);
    }
    function step(i) {
      const [a, b] = g.edges[i];
      const to = a === cur ? b : a;
      used.add(i); subE.push(i);
      gv.setEdgeState(`e${i}`, `t${cycleNo % 4}`); pop(gv.edgeEl(`e${i}`));
      sub.push(token(to)); setCur(to); renderTokens();
      const more = untracedAt(to).length;
      if (!more) { closeWalk(); return; }
      say(msg, `Traced the ${label(i)}. Now at ${to}, which has ${more} untraced ${more === 1 ? 'edge' : 'edges'}.`);
    }
    function refuse(el, text) { shake(el); say(msg, text, 'fail'); }
    box.addEventListener('click', e => {
      const n = e.target.closest('.node'), eg = e.target.closest('.edge');
      if (phase === 'done') return;
      if (phase === 'start') {
        if (n) startWalk(n.dataset.id, `Start at ${n.dataset.id}. Click an edge that touches it.`);
        else say(msg, 'Click a vertex first, not an edge.', 'fail');
        return;
      }
      if (phase === 'pick') {
        if (!n) { say(msg, 'Click a vertex on the tour, not an edge.', 'fail'); return; }
        const v = n.dataset.id, at = tour.findIndex(t => t.v === v);
        if (at < 0) { refuse(n, `${v} is not on the tour yet. Merging needs a vertex the two cycles share.`); return; }
        if (!untracedAt(v).length) { refuse(n, `${v} is on the tour, but all of its edges are already traced.`); return; }
        insertAt = at;
        startWalk(v, `The new walk starts at ${v}. Click one of its untraced edges.`);
        return;
      }
      let i;
      if (eg) {
        i = +eg.dataset.id.slice(1);
        const [a, b] = g.edges[i];
        if (used.has(i)) { refuse(eg, `The ${label(i)} is already traced. Each edge is used exactly once.`); return; }
        if (g.directed && a !== cur) { refuse(eg, `The ${label(i)} starts at ${a}. Edges must be traced according to their direction, and you are at ${cur}.`); return; }
        if (a !== cur && b !== cur) { refuse(eg, `The ${label(i)} does not touch ${cur}, the vertex you are at.`); return; }
      } else if (n) {
        const v = n.dataset.id;
        i = g.edges.findIndex(([a, b], j) => !used.has(j) && ((a === cur && b === v) || (!g.directed && b === cur && a === v)));
        if (i < 0) { refuse(n, `There is no untraced edge from ${cur} to ${v}.`); return; }
      } else return;
      step(i);
    });
    const restart = document.createElement('button');
    restart.type = 'button'; restart.className = 'ex-btn'; restart.textContent = 'Restart';
    restart.addEventListener('click', () => load(c.querySelector('select').value));
    if (keys.length > 1) c.append(presetSelect(keys, load));
    c.append(restart);
    if (keys.length === 1) { const s = document.createElement('select'); s.hidden = true; s.innerHTML = `<option value="${keys[0]}"></option>`; c.append(s); }
    load(keys[0]);
  }
  const eulerTrace = host => traceTool(host, ['2L21', '2L17+', '2R6', '2R8'], 'Try it: trace an Euler cycle yourself', 'Click a start vertex, then click edges to walk. When you get stuck, start a new walk from a vertex on the tour.');
  const deBruijnTrace = host => traceTool(host, ['2L29'], 'Try it: read off a De Bruijn sequence', 'Trace an Euler cycle along the arrows. When every edge is used, the first letters are collected.');

  /* ------------------------------------------------------------------------
     9. Complete G(σ,n) (slides 2L29-30, "complete in class")
     ------------------------------------------------------------------------ */
  function deBruijnBuild(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: complete the graph</p>
      <p class="ex-hint">Click the vertex an edge starts at, then the vertex it ends at. Click the same vertex twice for a self-loop.</p>
      <div class="ex-controls" data-c></div>
      <div class="ex-graph"></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg');
    let g, gv, drawn, first, wrong;
    function draw() {
      const shown = { ...g, edges: drawn.map(i => g.edges[i]) };
      box.innerHTML = '';
      const edges = GraphView.autoBend(drawn.map((i, k) => ({ id: `e${k}`, from: g.edges[i][0], to: g.edges[i][1], label: g.words[i], loopAngle: g.loops[g.edges[i][0]] })));
      gv = GraphView.create(box, { nodes: shown.nodes.map(([id, x, y]) => ({ id, x, y, label: id })), edges, width: 500, height: 290, r: 22, directed: true, edgeLabels: true, ariaLabel: g.title });
    }
    function load(key) {
      g = G[key]; drawn = []; first = null; wrong = 0; draw();
      say(msg, `The vertices are the words of length ${g.n - 1}. Add the ${g.edges.length} edges: one for each word of length ${g.n}.`);
    }
    box.addEventListener('click', e => {
      const n = e.target.closest('.node');
      if (!n || drawn.length === g.edges.length) return;
      const v = n.dataset.id;
      if (first === null) { first = v; gv.setNodeState(v, 'cur'); pop(n); say(msg, `An edge from ${v}. Now click where it ends.`); return; }
      const u = first; first = null;
      if (u.slice(1) !== v.slice(0, -1)) {
        wrong += 1; gv.setNodeState(u, ''); shake(n);
        const targets = idsOf(g).filter(w => w.slice(0, -1) === u.slice(1));
        say(msg, `No edge from ${u} to ${v}: the edge b₁…bₙ ends at b₂…bₙ, so from ${u} it can only reach ${targets.join(' or ')}.`, 'fail');
        return;
      }
      const word = u + v.slice(-1);
      const i = g.words.indexOf(word);
      if (drawn.includes(i)) { wrong += 1; gv.setNodeState(u, ''); shake(n); say(msg, `The edge ${word} is already drawn.`, 'fail'); return; }
      drawn.push(i); draw();
      const shaft = gv.edgeEl(`e${drawn.length - 1}`).querySelector('line:not(.hit), path.curve');
      if (!reduced() && shaft.getTotalLength) {
        const len = shaft.getTotalLength();
        shaft.animate([{ strokeDasharray: `${len}`, strokeDashoffset: len }, { strokeDasharray: `${len}`, strokeDashoffset: 0 }], { duration: 380, easing: 'ease-out' });
      }
      const left = g.edges.length - drawn.length;
      if (!left) say(msg, `Complete, with ${wrong} wrong ${wrong === 1 ? 'click' : 'clicks'}. All ${g.edges.length} = ${g.sigma}^${g.n} edges are drawn, and every vertex has exactly ${g.sigma} edges in and ${g.sigma} out.`, 'ok');
      else say(msg, `Added edge ${word}: it starts at ${u} (its first ${g.n - 1} ${g.n === 2 ? 'letter' : 'letters'}) and ends at ${v} (its last ${g.n - 1}). ${left} to go.`);
    });
    const restart = document.createElement('button');
    restart.type = 'button'; restart.className = 'ex-btn'; restart.textContent = 'Restart';
    restart.addEventListener('click', () => load(c.querySelector('select').value));
    c.append(presetSelect(['2L29', '2L30'], load), restart);
    load('2L29');
  }

  /* ------------------------------------------------------------------------
     10. Euler or Hamilton? (slide 2L36)
     ------------------------------------------------------------------------ */
  function eulerOrHamilton(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: Euler or Hamilton?</p>
      <p class="ex-hint">Answer both questions for each graph. A right answer shows why.</p>
      <div class="ex-controls" data-c></div>
      <div class="ex-graph"></div>
      <div class="ex-verdicts" data-q="euler"><span class="ex-q">Euler cycle?</span></div>
      <div class="ex-verdicts" data-q="ham"><span class="ex-q">Hamiltonian cycle?</span></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg');
    let g, gv, ids, stop = () => {};
    const clearButtons = () => host.querySelectorAll('[data-q] button').forEach(b => b.classList.remove('right', 'wrong'));
    function load(key) {
      stop(); g = G[key]; ids = idsOf(g); gv = gvMulti(box, g); clearButtons();
      say(msg, 'Euler uses every edge exactly once. Hamilton visits every vertex exactly once.');
    }
    function paint() { stop(); g.edges.forEach((e, i) => gv.setEdgeState(`e${i}`, '')); ids.forEach(v => gv.setNodeState(v, '')); }
    function answer(q, yes, b) {
      b.parentElement.querySelectorAll('button').forEach(x => x.classList.remove('right', 'wrong'));
      paint();
      const st = L.eulerStatus(ids, g.edges, false);
      const ham = L.hamiltonianCycle(ids, g.edges, false);
      const truth = q === 'euler' ? st.kind === 'cycle' : !!ham;
      if (yes !== truth) {
        b.classList.add('wrong'); shake(b);
        if (q === 'euler') say(msg, truth ? 'It does: the graph is connected and every degree is even.' : `It does not: ${st.odd.join(', ')} have odd degree.`, 'fail');
        else say(msg, truth ? `It does: look for a cycle through all ${ids.length} vertices.` : 'It does not: trying every order of the vertices finds no cycle through all of them.', 'fail');
        return;
      }
      b.classList.add('right'); pop(b);
      if (q === 'euler') {
        if (truth) {
          const t = L.eulerTour(ids, g.edges, false);
          stop = playEdges(gv, t.edges);
          say(msg, `Yes: connected, with every degree even. One Euler cycle is ${t.vertices.join(' ')}.`, 'ok');
        } else {
          st.odd.forEach(v => { gv.setNodeState(v, 'ready'); pop(gv.nodeEl(v)); });
          say(msg, `No: ${st.odd.join(', ')} have odd degree, and a cycle needs every degree even.`, 'ok');
        }
      } else if (truth) {
        stop = playEdges(gv, edgesAlong(g, ham));
        say(msg, `Yes: ${ham.join(' ')} visits every vertex exactly once and returns to the start.`, 'ok');
      } else {
        ids.forEach(v => pop(gv.nodeEl(v)));
        say(msg, 'No: an exhaustive search over every order of the vertices finds no such cycle.', 'ok');
      }
    }
    host.querySelectorAll('[data-q]').forEach(row => {
      const q = row.dataset.q;
      row.append(verdictButton('Yes', b => answer(q, true, b)), verdictButton('No', b => answer(q, false, b)));
    });
    const keys = host.dataset.graphs ? host.dataset.graphs.split(',') : ['2L36I', '2L36II'];
    c.append(presetSelect(keys, load));
    load(keys[0]);
  }

  /* ------------------------------------------------------------------------
     Week 3 helpers
     ------------------------------------------------------------------------ */
  const eIndex = (g, a, b) => g.edges.findIndex(([x, y]) => (x === a && y === b) || (!g.directed && x === b && y === a));
  const seq = (steps, gap) => {
    const timers = steps.map((fn, i) => setTimeout(fn, reduced() ? 0 : i * gap));
    return () => timers.forEach(clearTimeout);
  };
  const drawIn = g => {
    const s = g && g.querySelector('line:not(.hit), path.curve');
    if (!s || reduced() || !s.getTotalLength) return;
    const len = s.getTotalLength();
    s.animate([{ strokeDasharray: `${len}`, strokeDashoffset: len }, { strokeDasharray: `${len}`, strokeDashoffset: 0 }], { duration: 420, easing: 'ease-out' });
  };
  const neighborsOf = g => {
    const adj = Object.fromEntries(idsOf(g).map(v => [v, []]));
    g.edges.forEach(([a, b]) => { adj[a].push(b); if (!g.directed) adj[b].push(a); });
    return adj;
  };
  const clearGraph = (gv, g) => {
    g.edges.forEach((_, i) => gv.setEdgeState(`e${i}`, ''));
    idsOf(g).forEach(v => gv.setNodeState(v, ''));
  };
  const makeBtn = (label, cls, onClick) => {
    const b = verdictButton(label, onClick);
    if (cls) b.classList.add(cls);
    return b;
  };

  /* ------------------------------------------------------------------------
     8. Minimally connected, live (3L13, 3L14)
     ------------------------------------------------------------------------ */
  function minimalTree(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: a tree is minimally connected</p>
      <p class="ex-hint">Pick what to test, then click on the tree. Each property below is one of the equivalent definitions.</p>
      <div class="ex-controls" data-c></div>
      <div class="ex-graph"></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg');
    const g = G['3L13'], ids = idsOf(g);
    let gv, mode, pick = null, stop = () => {};
    const modes = {
      del: ['Delete an edge', 'Click any edge. (d) says the tree falls apart.'],
      add: ['Add an edge', 'Click two vertices that have no edge between them. (b) says a cycle appears.'],
      path: ['Unique path', 'Click two vertices. (c) says exactly one simple path joins them.'],
    };
    const reset = () => { stop(); stop = () => {}; pick = null; gv = gvMulti(box, g); };
    const setMode = m => {
      mode = m; reset();
      c.querySelectorAll('button').forEach(b => b.classList.toggle('primary', b.dataset.m === m));
      say(msg, modes[m][1]);
    };
    Object.keys(modes).forEach(m => { const b = verdictButton(modes[m][0], () => setMode(m)); b.dataset.m = m; c.append(b); });
    box.addEventListener('click', e => {
      const n = e.target.closest('.node'), eg = e.target.closest('.edge');
      if (mode === 'del') {
        if (!eg) { say(msg, 'Click an edge, not a vertex.', 'fail'); return; }
        reset();
        const i = +eg.dataset.id.slice(1);
        const rest = g.edges.filter((_, k) => k !== i);
        const comps = L.components(ids, rest, false);
        gv.setEdgeState(`e${i}`, 'removed');
        comps.forEach((comp, k) => comp.forEach(v => { gv.setNodeState(v, `g${k + 1}`); pop(gv.nodeEl(v)); }));
        const [a, b] = g.edges[i];
        say(msg, `Deleted the edge (${a},${b}). The tree split into ${comps.length} connected parts, {${comps.map(x => x.join(', ')).join('} and {')}}, so this edge was needed.`, 'ok');
        return;
      }
      if (!n) { say(msg, 'Click a vertex, not an edge.', 'fail'); return; }
      const v = n.dataset.id;
      if (pick === null) { reset(); pick = v; gv.setNodeState(v, 'cur'); pop(gv.nodeEl(v)); say(msg, `First vertex: ${v}. Now click the second one.`); return; }
      const a = pick, b = v; pick = null;
      if (mode === 'add') {
        if (a !== b && eIndex(g, a, b) >= 0) { reset(); shake(n); say(msg, `(${a},${b}) is already an edge of the tree. A new edge is one that is not in E.`, 'fail'); return; }
        stop();
        const added = { ...g, edges: [...g.edges, [a, b]] };
        gv = gvMulti(box, added);
        const last = added.edges.length - 1;
        gv.setEdgeState(`e${last}`, 'blocked');
        drawIn(gv.edgeEl(`e${last}`));
        if (a === b) {
          gv.setNodeState(a, 'bad'); pop(gv.nodeEl(a));
          say(msg, `Adding (${a},${a}) makes a self-loop, which is a cycle on its own.`, 'ok');
          return;
        }
        const path = L.pathBetween(ids, g.edges, a, b);
        stop = playEdges(gv, edgesAlong(g, path), 'out');
        say(msg, `The tree already joins ${a} and ${b} by the path ${path.join(' – ')}. With the new edge that path closes a cycle.`, 'ok');
        return;
      }
      if (a === b) { reset(); shake(n); say(msg, 'Pick two different vertices.', 'fail'); return; }
      reset();
      const path = L.pathBetween(ids, g.edges, a, b);
      stop = playEdges(gv, edgesAlong(g, path), 'out');
      gv.setNodeState(a, 'cur'); gv.setNodeState(b, 'target');
      say(msg, `The only simple path from ${a} to ${b} is ${path.join(' – ')}.`, 'ok');
    });
    setMode('del');
  }

  /* ------------------------------------------------------------------------
     13. Build a spanning tree by hand (3L28)
     ------------------------------------------------------------------------ */
  function buildSpanning(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: pick the edges of a spanning tree</p>
      <p class="ex-hint">Click edges to add them, and click again to remove one. An edge that would close a cycle is refused.</p>
      <div class="ex-controls" data-c></div>
      <div class="ex-graph"></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg');
    const g = G['3L28'], ids = idsOf(g);
    let gv, chosen = [], timer = null;
    const paint = () => { g.edges.forEach((_, i) => gv.setEdgeState(`e${i}`, chosen.includes(i) ? 'out' : '')); };
    const load = () => { clearTimeout(timer); chosen = []; gv = gvMulti(box, g); say(msg, `You need ${ids.length - 1} edges for ${ids.length} vertices: connected, and no cycles.`); };
    box.addEventListener('click', e => {
      const eg = e.target.closest('.edge');
      if (!eg) return;
      clearTimeout(timer); paint();
      const i = +eg.dataset.id.slice(1), [a, b] = g.edges[i];
      if (chosen.includes(i)) {
        chosen = chosen.filter(x => x !== i); paint(); pop(eg);
        say(msg, `Removed (${a},${b}). ${chosen.length} of ${ids.length - 1} edges chosen.`);
        return;
      }
      if (chosen.length === ids.length - 1) { shake(eg); say(msg, `You already have ${ids.length - 1} edges: that is a spanning tree. Remove one to change it.`, 'fail'); return; }
      const path = L.pathBetween(ids, chosen.map(k => g.edges[k]), a, b);
      if (path) {
        gv.setEdgeState(`e${i}`, 'blocked'); shake(eg);
        edgesAlong(g, path).forEach(k => gv.setEdgeState(`e${k}`, 'blocked'));
        say(msg, `Refused: ${a} and ${b} are already joined by ${path.join(' – ')}, so (${a},${b}) would close a cycle.`, 'fail');
        timer = setTimeout(paint, 1400);
        return;
      }
      chosen.push(i); paint(); pop(eg);
      drawIn(eg);
      if (chosen.length === ids.length - 1) {
        ids.forEach(v => pop(gv.nodeEl(v)));
        say(msg, `Added (${a},${b}). Done: ${chosen.length} edges, connected, no cycles. That is a spanning tree.`, 'ok');
      } else say(msg, `Added (${a},${b}). ${chosen.length} of ${ids.length - 1} edges chosen.`);
    });
    c.append(makeBtn('Restart', null, load));
    load();
  }

  /* ------------------------------------------------------------------------
     DFS by hand: shared engine for #15 and #33
     ------------------------------------------------------------------------ */
  function dfsCore(box, stackBox, msg, g, start, opts = {}) {
    const ids = idsOf(g), adj = neighborsOf(g);
    const lists = opts.strict ? g.lists : adj;
    let gv, stack, marked, tree, found, done, timer;
    const top = () => stack[stack.length - 1];
    const firstOpen = v => lists[v].find(w => !marked.has(w));
    const openOf = v => adj[v].filter(w => !marked.has(w));
    const paint = () => {
      ids.forEach(v => gv.setNodeState(v, v === top() ? 'cur' : marked.has(v) ? 'ready' : ''));
      g.edges.forEach((_, i) => gv.setEdgeState(`e${i}`, tree.includes(i) ? 'out' : ''));
    };
    const token = v => {
      const t = document.createElement('span');
      t.className = 'token word'; t.textContent = `DFS(${v})`; t.dataset.v = v;
      stackBox.appendChild(t);
      flyFrom(t, gv.nodeEl(v).getBoundingClientRect());
    };
    const push = (v, viaEdge) => {
      if (viaEdge != null) { found.push({ a: top(), b: v }); tree.push(viaEdge); drawIn(gv.edgeEl(`e${viaEdge}`)); }
      marked.add(v); stack.push(v);
      paint(); pop(gv.nodeEl(v)); token(v);
    };
    function restart() {
      clearTimeout(timer);
      gv = gvMulti(box, g); stackBox.innerHTML = ''; marked = new Set(); stack = []; tree = []; found = []; done = false;
      push(start, null);
      say(msg, opts.intro || `DFS(${start}) is running. Click the next vertex, or press Back up when ${start} has nothing left to explore.`);
    }
    function refuse(el, text, flash) {
      clearTimeout(timer); paint(); shake(el);
      if (flash != null) { gv.setNodeState(flash, 'target'); timer = setTimeout(paint, 1100); }
      say(msg, text, 'fail');
    }
    box.addEventListener('click', e => {
      const n = e.target.closest('.node');
      if (!n) return;
      if (done) { say(msg, 'This run is finished. Press Restart to do another.'); return; }
      const v = n.dataset.id, u = top();
      if (v === u) { refuse(n, `${v} is already on top of the stack: DFS(${v}) is running now.`); return; }
      if (marked.has(v)) { refuse(n, `${v} is already marked, so DFS will not visit it again.`); return; }
      if (!adj[u].includes(v)) { refuse(n, `${v} is not adjacent to ${u}. DFS only moves along an edge from the vertex on top of the stack.`); return; }
      if (opts.strict) {
        const want = firstOpen(u);
        if (v !== want) { refuse(n, `The adjacency list of ${u} is ${lists[u].join(', ')}. Skipping the marked vertices, the next one is ${want}.`, want); return; }
      }
      push(v, eIndex(g, u, v));
      say(msg, `${u} found the unmarked neighbor ${v}. DFS(${v}) is called, and ${v} goes on top of the stack.`);
    });
    function back() {
      if (done) return;
      const u = top();
      const open = openOf(u);
      if (open.length) { refuse(gv.nodeEl(u), `Not yet: ${u} still has the unmarked ${open.length === 1 ? 'neighbor' : 'neighbors'} ${open.join(', ')}, so DFS(${u}) cannot end.`, open[0]); return; }
      stack.pop();
      const t = stackBox.lastElementChild;
      const remove = () => t.remove();
      if (reduced()) remove();
      else t.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-14px)' }], { duration: 240, easing: 'ease-in' }).onfinish = remove;
      paint(); pop(gv.nodeEl(u));
      if (!stack.length) {
        done = true;
        say(msg, `DFS(${u}) ends and the stack is empty. The ${tree.length} edges traversed form a spanning tree.`, 'ok');
        ids.forEach(v => pop(gv.nodeEl(v)));
        if (opts.onDone) opts.onDone(found);
        return;
      }
      say(msg, `DFS(${u}) ends: all its neighbors are marked. Back in DFS(${top()}).`);
    }
    return { restart, back };
  }
  const dfsStage = () => `<div class="dfs-stage"><div class="ex-graph"></div><div class="dfs-stack"><p class="strip-name">Running stack (top is at the top)</p><div class="strip stack" data-stack></div></div></div><div class="ex-msg" aria-live="polite"></div>`;

  /* ------------------------------------------------------------------------
     15. You are the DFS (3L31, 3L49)
     ------------------------------------------------------------------------ */
  function dfsByHand(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: you are the DFS</p>
      <p class="ex-hint">Click the next vertex DFS moves to. Press Back up when the vertex on top of the stack has no unmarked neighbor.</p>
      <div class="ex-controls" data-c></div>${dfsStage()}
      <div class="ex-lists" data-lists></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), stackBox = host.querySelector('[data-stack]'), msg = host.querySelector('.ex-msg'), listBox = host.querySelector('[data-lists]');
    const g = G['3L31'];
    let core, strict = true, stage = box;
    function load() {
      /* A new core binds one click handler, so the graph box is replaced each time */
      const fresh = stage.cloneNode(false); stage.replaceWith(fresh); stage = fresh;
      stackBox.innerHTML = '';
      core = dfsCore(fresh, stackBox, msg, g, '1', { strict });
      core.restart();
      listBox.innerHTML = strict ? `<p class="strip-name">Adjacency lists (3L49)</p>${Object.keys(g.lists).map(v => `<code>${v}: ${g.lists[v].join(' → ')}</code>`).join('')}` : '';
    }
    const mode = document.createElement('label');
    mode.className = 'algo-field';
    mode.innerHTML = 'Follow <select><option value="strict">the lists of slide 49</option><option value="free">any legal order</option></select>';
    mode.querySelector('select').addEventListener('change', e => { strict = e.target.value === 'strict'; load(); });
    c.append(mode, makeBtn('Back up', 'primary', () => core.back()), makeBtn('Restart', null, () => core.restart()));
    load();
  }

  /* ------------------------------------------------------------------------
     25. Identify the trees (3R5)
     ------------------------------------------------------------------------ */
  function identifyTrees(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: identify the trees</p>
      <p class="ex-hint">Pick a graph from the slide and decide. The vertices have no names on the slide, so letters are added here.</p>
      <div class="ex-controls" data-c></div>
      <div class="ex-graph"></div>
      <div class="ex-verdicts" data-v><span class="ex-q">Is it a tree?</span></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg'), row = host.querySelector('[data-v]');
    let g, ids, gv, stop = () => {};
    const clearBtns = () => row.querySelectorAll('button').forEach(b => b.classList.remove('right', 'wrong'));
    function load(key) { stop(); stop = () => {}; g = G[key]; ids = idsOf(g); gv = gvMulti(box, g); clearBtns(); say(msg, `${ids.length} vertices and ${g.edges.length} edges. Connected, with no cycles?`); }
    function answer(yes, b) {
      clearBtns(); stop(); stop = () => {}; clearGraph(gv, g);
      const st = L.treeStatus(ids, g.edges);
      const right = yes === st.tree;
      b.classList.add(right ? 'right' : 'wrong');
      if (right) pop(b); else shake(b);
      if (st.tree) {
        stop = playEdges(gv, g.edges.map((_, i) => i), 'out');
        say(msg, `${right ? 'Yes' : 'It is a tree'}: connected and no cycles, with ${g.edges.length} edges on ${ids.length} vertices, which is n − 1.`, right ? 'ok' : 'fail');
        return;
      }
      if (!st.connected) {
        st.components.forEach((comp, k) => comp.forEach(v => { gv.setNodeState(v, `g${k + 1}`); pop(gv.nodeEl(v)); }));
        say(msg, `${right ? 'Correct, it is not a tree' : 'Not a tree'}: it is not connected. The colors are its ${st.components.length} connected parts.`, right ? 'ok' : 'fail');
        return;
      }
      stop = playEdges(gv, edgesAlong(g, st.cycle), 'blocked');
      st.cycle.forEach(v => gv.setNodeState(v, 'target'));
      say(msg, `${right ? 'Correct, it is not a tree' : 'Not a tree'}: it contains the cycle ${st.cycle.join(' – ')}.`, right ? 'ok' : 'fail');
    }
    row.append(verdictButton('A tree', b => answer(true, b)), verdictButton('Not a tree', b => answer(false, b)));
    c.append(presetSelect(['3R5a', '3R5b', '3R5c', '3R5d'], load));
    load('3R5a');
  }

  /* ------------------------------------------------------------------------
     27. Find the roots (3R6)
     ------------------------------------------------------------------------ */
  function findRoots(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: find the roots</p>
      <p class="ex-hint">Click a vertex to claim it is a root. A wave shows what is reachable from it. Press the button when you have found them all.</p>
      <div class="ex-controls" data-c></div>
      <div class="ex-graph"></div>
      <div class="ex-msg" aria-live="polite"></div>
      <div class="ord-found"><span class="found-n" data-n></span><span class="found-list" data-found></span></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg'), nBox = host.querySelector('[data-n]'), foundBox = host.querySelector('[data-found]');
    let g, ids, gv, roots, found, stop = () => {};
    const adj = () => neighborsOf(g);
    const paint = () => { clearGraph(gv, g); found.forEach(v => gv.setNodeState(v, 'g1')); };
    function load(key) {
      stop(); stop = () => {}; g = G[key]; ids = idsOf(g); gv = gvMulti(box, g);
      roots = L.rootsOf(ids, g.edges); found = new Set();
      foundBox.innerHTML = ''; nBox.textContent = 'Roots found: none yet';
      say(msg, 'A root reaches every vertex along the arrows.');
    }
    /* Breadth-first layers along the arrows, for the wave */
    const layers = v => {
      const seen = new Set([v]), out = [[v]], a = adj();
      while (true) {
        const next = [];
        out[out.length - 1].forEach(x => a[x].forEach(y => { if (!seen.has(y)) { seen.add(y); next.push(y); } }));
        if (!next.length) break;
        out.push(next);
      }
      return { layers: out, seen };
    };
    box.addEventListener('click', e => {
      const n = e.target.closest('.node');
      if (!n) return;
      const v = n.dataset.id;
      stop(); stop = () => {}; paint();
      const wave = layers(v), isRoot = roots.includes(v), missing = ids.filter(x => !wave.seen.has(x));
      const steps = wave.layers.map((layer, d) => () => layer.forEach(x => { gv.setNodeState(x, d === 0 ? 'cur' : 'ready'); pop(gv.nodeEl(x)); }));
      if (isRoot) found.add(v);   // recorded now, so pressing the button mid-wave still counts it
      steps.push(() => {
        if (isRoot) {
          nBox.textContent = `Roots found: ${[...found].sort().join(', ')}`;
          if (![...foundBox.children].some(ch => ch.textContent === v)) {
            const chip = document.createElement('span');
            chip.className = 'chip'; chip.textContent = v; foundBox.appendChild(chip); pop(chip);
          }
        } else missing.forEach(x => gv.setNodeState(x, 'gone'));
      });
      stop = seq(steps, 300);
      if (isRoot) say(msg, `${v} is a root: every vertex is reachable from it along the arrows.`, 'ok');
      else { shake(n); say(msg, `${v} is not a root: there is no directed path from ${v} to ${missing.join(', ')}.`, 'fail'); }
    });
    const keys = host.dataset.graphs ? host.dataset.graphs.split(',') : ['3R6a', '3R6b', '3R6c'];
    c.append(presetSelect(keys, load), makeBtn('I found them all', 'primary', () => {
      stop(); stop = () => {}; paint();
      const left = roots.filter(v => !found.has(v));
      if (left.length) { say(msg, `Not yet: ${left.length} more ${left.length === 1 ? 'root is' : 'roots are'} still hiding.`, 'fail'); return; }
      roots.forEach(v => pop(gv.nodeEl(v)));
      say(msg, roots.length ? `Correct. The roots are ${roots.join(', ')}: ${roots.length === 1 ? 'it reaches' : 'each reaches'} every vertex.` : 'Correct: this graph has no root, so a root is not guaranteed to exist.', 'ok');
    }));
    load(keys[0]);
  }

  /* ------------------------------------------------------------------------
     31. How many spanning trees? (3R28, 3R29)
     ------------------------------------------------------------------------ */
  function countSpanning(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: how many spanning trees?</p>
      <p class="ex-hint">Type the number and press Check. Every spanning tree is then shown in turn.</p>
      <div class="ex-controls" data-c></div>
      <div class="ex-graph"></div>
      <p class="ex-step" data-step></p>
      <div class="ex-verdicts"><span class="ex-q">Spanning trees:</span><input class="ex-num" type="number" min="0" aria-label="Number of spanning trees"><button type="button" class="ex-btn primary" data-go>Check</button><button type="button" class="ex-btn" data-play>Replay</button></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg'), input = host.querySelector('.ex-num'), go = host.querySelector('[data-go]'), play = host.querySelector('[data-play]'), step = host.querySelector('[data-step]');
    let g, ids, gv, list, stop = () => {};
    const cycleGraph = n => {
      const v = Array.from({ length: n }, (_, i) => String(i + 1));
      const R = 110, nodesAt = v.map((id, i) => [id, Math.round(250 + R * Math.cos(2 * Math.PI * i / n - Math.PI / 2)), Math.round(145 + R * Math.sin(2 * Math.PI * i / n - Math.PI / 2))]);
      return { title: `Cycle with ${n} nodes (slide 29)`, directed: false, nodes: nodesAt, edges: v.map((x, i) => [x, v[(i + 1) % n]]) };
    };
    function show() {
      stop(); stop = () => {};
      if (!list.length) return;
      stop = seq(list.map((tree, k) => () => {
        g.edges.forEach((_, i) => gv.setEdgeState(`e${i}`, tree.includes(i) ? 'out' : 'gone'));
        step.textContent = `Spanning tree ${k + 1} of ${list.length}: ${tree.map(i => `(${g.edges[i].join(',')})`).join(' ')}`;
        anim(step, [{ opacity: .3 }, { opacity: 1 }], { duration: 300 });
      }), 1100);
    }
    function load(next) {
      stop(); stop = () => {}; g = next; ids = idsOf(g); gv = gvMulti(box, g); list = L.spanningTrees(ids, g.edges); input.value = ''; step.textContent = '';
      say(msg, `${ids.length} vertices, ${g.edges.length} edges. A spanning tree keeps all the vertices and has ${ids.length - 1} edges.`);
    }
    const pick = document.createElement('label');
    pick.className = 'algo-field';
    pick.innerHTML = 'Graph <select><option value="cycle">Cycle with n nodes</option><option value="3R29t">Tree with 9 nodes</option><option value="3R29c">The third graph</option></select>';
    const nField = document.createElement('label');
    nField.className = 'algo-field';
    nField.innerHTML = 'n = <input type="range" min="3" max="8" value="5"><output>5</output>';
    const nInput = nField.querySelector('input'), nOut = nField.querySelector('output');
    const fromPick = () => { const v = pick.querySelector('select').value; nField.hidden = v !== 'cycle'; load(v === 'cycle' ? cycleGraph(+nInput.value) : G[v]); };
    pick.querySelector('select').addEventListener('change', fromPick);
    nInput.addEventListener('input', () => { nOut.textContent = nInput.value; fromPick(); });
    go.addEventListener('click', () => {
      const got = input.value.trim();
      if (got === '') { shake(input); say(msg, 'Type a number first.', 'fail'); return; }
      const right = +got === list.length;
      if (right) { pop(input); say(msg, `Correct: ${list.length}. Watch each one below.`, 'ok'); }
      else { shake(input); say(msg, `${got} is not right. This graph has ${list.length}: watch each one below.`, 'fail'); }
      show();
    });
    play.addEventListener('click', () => { show(); say(msg, 'Replaying every spanning tree of this graph.'); });
    c.append(pick, nField);
    fromPick();
  }

  /* ------------------------------------------------------------------------
     32, 37. Which tree can this DFS output? (3R31, 3R44)
     ------------------------------------------------------------------------ */
  function whichTree(host, qKey) {
    const q = treeQuestions[qKey];
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: ${q.title}</p>
      <p class="ex-hint">The first tree is what DFS(${q.givenRoot}) produced. For each candidate, decide whether DFS(${q.newRoot}) could output it on the same graph.</p>
      <div class="tq-given"><p class="strip-name">DFS(${q.givenRoot}) produced</p><div class="tq-svg" data-given></div></div>
      <div class="tq-grid" data-cards></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const msg = host.querySelector('.ex-msg'), givenBox = host.querySelector('[data-given]'), cards = host.querySelector('[data-cards]');
    const given = { directed: false, nodes: q.given.nodes, edges: q.given.edges, title: `DFS(${q.givenRoot}) tree` };
    let gvGiven, gvs = [], stop = () => {};
    const drawGiven = (extra = [], state = 'out') => {
      const g = { ...given, edges: [...given.edges, ...extra] };
      gvGiven = gvMulti(givenBox, g, { width: 360, height: 300, r: 25 });
      extra.forEach((_, i) => {
        const id = `e${given.edges.length + i}`;
        gvGiven.setEdgeState(id, state);
        drawIn(gvGiven.edgeEl(id));
      });
    };
    drawGiven();
    q.candidates.forEach((cand, idx) => {
      const card = document.createElement('div');
      card.className = 'tq-card';
      card.innerHTML = `<p class="strip-name">${cand.name}</p><div class="tq-svg"></div><div class="ex-verdicts"></div>`;
      cards.appendChild(card);
      const svgBox = card.querySelector('.tq-svg'), row = card.querySelector('.ex-verdicts');
      const c = { directed: false, nodes: cand.layout, edges: cand.edges, title: cand.name };
      const gv = gvMulti(svgBox, c, { width: 360, height: 300, r: 25 });
      gvs.push(gv);
      const decide = (yes, btn) => {
        row.querySelectorAll('button').forEach(b => b.classList.remove('right', 'wrong'));
        stop(); stop = () => {};
        const res = L.dfsTreesCompatible(q.given.edges, q.givenRoot, cand.edges, q.newRoot);
        const right = yes === res.ok;
        btn.classList.add(right ? 'right' : 'wrong');
        if (right) pop(btn); else shake(btn);
        gvs.forEach((v, k) => q.candidates[k].edges.forEach((_, i) => v.setEdgeState(`e${i}`, '')));
        if (res.ok) {
          drawGiven(res.extra, 'blocked');
          stop = playEdges(gv, cand.edges.map((_, i) => i), 'out');
          const list = res.extra.map(([a, b]) => `(${a},${b})`).join(' and ');
          say(msg, `${right ? 'Right, it is possible' : 'It is possible'}: take the DFS(${q.givenRoot}) tree plus the ${res.extra.length === 1 ? 'edge' : 'edges'} ${list}. On that graph, DFS(${q.newRoot}) can output this tree.`, right ? 'ok' : 'fail');
          return;
        }
        const bad = res.cross.filter(x => x.tree === 1).map(x => x.edge);
        const shown = bad.length ? bad : [res.cross[0].edge];
        drawGiven(shown, 'blocked');
        shown.forEach(([a, b]) => {
          const on = cand.edges.findIndex(([x, y]) => (x === a && y === b) || (x === b && y === a));
          if (on >= 0) gv.setEdgeState(`e${on}`, 'blocked');
        });
        const names = shown.map(([a, b]) => `(${a},${b})`).join(' and ');
        const inWhich = bad.length ? `the DFS(${q.givenRoot}) tree` : 'this candidate';
        say(msg, `${right ? 'Right, it is impossible' : 'It is impossible'}: this tree uses ${names}, which ${shown.length === 1 ? 'joins' : 'join'} different branches of ${inWhich}. With such an edge in the graph, DFS would have reached one end from the other, so the two ends could not sit on separate branches.`, right ? 'ok' : 'fail');
      };
      row.append(verdictButton('Possible', b => decide(true, b)), verdictButton('Impossible', b => decide(false, b)));
    });
  }

  /* ------------------------------------------------------------------------
     33. Exercise 2: the children of v (3R35)
     ------------------------------------------------------------------------ */
  function childrenOfV(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: how many children does v get?</p>
      <p class="ex-hint">Run DFS by hand. First find a run of DFS(u) where v has 2 children, then run DFS(v) and see how many it can have.</p>
      <div class="ex-controls" data-c></div>${dfsStage()}
      <div class="ord-found"><span class="found-list" data-found></span></div></div>`;
    const c = host.querySelector('[data-c]'), stackBox = host.querySelector('[data-stack]'), msg = host.querySelector('.ex-msg'), foundBox = host.querySelector('[data-found]');
    let box = host.querySelector('.ex-graph');
    const g = G['3R35'];
    let core, startAt = 'u';
    const seen = {};
    function record(pairs) {
      /* pairs are { a: parent, b: child }, in the order DFS discovered them */
      const kids = pairs.filter(({ a }) => a === 'v').length;
      const key = `${startAt}:${kids}`;
      if (!seen[key]) {
        seen[key] = true;
        const chip = document.createElement('span');
        chip.className = 'chip'; chip.textContent = `DFS(${startAt}): v has ${kids} ${kids === 1 ? 'child' : 'children'}`;
        foundBox.appendChild(chip); pop(chip);
      }
      const fromU2 = seen['u:2'], fromV1 = seen['v:1'];
      const note = fromU2 && fromV1
        ? 'You found both cases: v had 2 children in a run of DFS(u), and a single child in DFS(v). So the claim is false.'
        : startAt === 'u' ? (kids === 2 ? 'v has 2 children in this run of DFS(u). Now run DFS(v).' : `v has ${kids} child in this run. Try another order to give it 2.`)
        : 'In DFS(v), v has a single child. Run DFS(u) to find a case with 2.';
      say(msg, note, fromU2 && fromV1 ? 'ok' : undefined);
    }
    function load(s) {
      startAt = s;
      const fresh = box.cloneNode(false); box.replaceWith(fresh); box = fresh;
      stackBox.innerHTML = '';
      core = dfsCore(fresh, stackBox, msg, g, s, { onDone: record, intro: `DFS(${s}) is running. Choose any unmarked neighbor, then press Back up when the top has none left.` });
      core.restart();
    }
    c.append(makeBtn('Start DFS(u)', null, () => load('u')), makeBtn('Start DFS(v)', null, () => load('v')), makeBtn('Back up', 'primary', () => core.back()), makeBtn('Restart', null, () => core.restart()));
    load('u');
  }

  /* ------------------------------------------------------------------------
     34. Exercise 3: complete the graph (3R36-3R38)
     ------------------------------------------------------------------------ */
  function completeGraph(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: complete the graph</p>
      <p class="ex-hint">Click two vertices to add the edge between them, and click the same pair again to remove it. Each condition is rechecked after every change.</p>
      <div class="ex-controls" data-c></div>
      <div class="ex-graph"></div>
      <ul class="ex-conds" data-conds></ul>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg'), condBox = host.querySelector('[data-conds]');
    const base = G['3R37'], ids = idsOf(base);
    let edges = [], pick = null, gv, stop = () => {};
    const conds = [
      { name: 'For every run of DFS(B), deg(B) = 2 in the spanning tree', test: () => {
        const trees = L.treeStatus(ids, edges).connected ? L.allDfsTrees(ids, edges, 'B') : [];
        if (!trees.length) return [false, 'not connected yet, so DFS(B) cannot span the graph'];
        const degs = trees.map(t => t.filter(e => e.includes('B')).length);
        return [degs.every(d => d === 2), `in ${trees.length} possible ${trees.length === 1 ? 'run' : 'runs'}, deg(B) is ${[...new Set(degs)].sort().join(' or ')}`];
      } },
      { name: 'G has a Hamilton path and not a Hamilton cycle', test: () => {
        const path = L.hamiltonianPath(ids, edges), cycle = L.hamiltonianCycle(ids, edges, false);
        return [!!path && !cycle, path ? (cycle ? `it also has the Hamilton cycle ${cycle.join(' ')}` : `Hamilton path: ${path.join(' ')}`) : 'no Hamilton path yet'];
      } },
      { name: 'There is a vertex v with deg(v) > 2', test: () => {
        const d = L.degrees(ids, edges);
        const big = ids.filter(v => d[v] > 2);
        return [big.length > 0, big.length ? `deg(${big[0]}) = ${d[big[0]]}` : 'every degree is at most 2'];
      } },
    ];
    const items = conds.map(cond => {
      const li = document.createElement('li');
      li.className = 'ex-cond';
      li.innerHTML = `<span class="ex-cond-name">${cond.name}</span><span class="ex-cond-why"></span>`;
      condBox.appendChild(li);
      return { li, state: null, cond };
    });
    function check() {
      let all = true;
      items.forEach(it => {
        const [ok, why] = it.cond.test();
        it.li.querySelector('.ex-cond-why').textContent = why;
        it.li.classList.toggle('met', ok); it.li.classList.toggle('unmet', !ok);
        if (ok !== it.state) { pop(it.li); it.state = ok; }
        all = all && ok;
      });
      return all;
    }
    function draw(newIdx) {
      const g = { ...base, edges: edges.slice() };
      gv = gvMulti(box, g);
      if (pick) gv.setNodeState(pick, 'cur');
      if (newIdx != null) drawIn(gv.edgeEl(`e${newIdx}`));
    }
    function toggle(a, b) {
      const i = edges.findIndex(([x, y]) => (x === a && y === b) || (x === b && y === a));
      if (i >= 0) {
        gv.setEdgeState(`e${i}`, 'removed');
        edges = edges.filter((_, k) => k !== i);
        stop(); stop = seq([() => {}, () => draw()], 340);
        say(msg, `Removed the edge (${a},${b}).`);
      } else {
        edges = [...edges, [a, b]];
        draw(edges.length - 1);
        say(msg, `Added the edge (${a},${b}).`);
      }
      if (check()) say(msg, `All three conditions hold for your graph, with ${edges.length} edges. Your graph need not match the slide's: any graph meeting the conditions is a solution.`, 'ok');
    }
    box.addEventListener('click', e => {
      const n = e.target.closest('.node');
      if (!n) return;
      const v = n.dataset.id;
      if (pick === null) { pick = v; gv.setNodeState(v, 'cur'); pop(n); say(msg, `Selected ${v}. Now click the other end of the edge.`); return; }
      if (pick === v) { pick = null; gv.setNodeState(v, ''); say(msg, `Unselected ${v}.`); return; }
      const a = pick; pick = null;
      toggle(a, v);
    });
    c.append(makeBtn('Clear', null, () => { stop(); pick = null; edges = []; draw(); check(); say(msg, 'All edges removed.'); }),
      makeBtn('Show the slide’s solution', null, () => {
        stop(); pick = null; edges = []; draw();
        stop = seq(base.edges.map(([a, b], k) => () => {
          edges = base.edges.slice(0, k + 1);
          draw(k);
          check();
        }), 500);
        say(msg, 'This is the solution drawn on slide 37. Other solutions exist.', 'ok');
      }));
    draw();
    check();
    say(msg, 'Start by clicking B, then one of its neighbors.');
  }

  /* ------------------------------------------------------------------------
     35. Exercises 4 and 5: back edges (3R40, 3R41), on the graph of 3R17
     ------------------------------------------------------------------------ */
  function backEdges(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: back edges</p>
      <p class="ex-hint">Run on the graph of slide 17. Answer, then watch the run: tree edges light up, back edges are flagged and then deleted.</p>
      <div class="ex-graph"></div>
      <div class="ex-verdicts"><span class="ex-q">Exercise 4: no back edges means no cycles.</span><button type="button" class="ex-btn" data-v="t">True</button><button type="button" class="ex-btn" data-v="f">False</button></div>
      <div class="ex-verdicts"><span class="ex-q">Exercise 5: how many back edges?</span><input class="ex-num" type="number" min="0" aria-label="Number of back edges"><button type="button" class="ex-btn primary" data-go>Check</button></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg'), input = host.querySelector('.ex-num'), go = host.querySelector('[data-go]');
    const g = G['3R17'], ids = idsOf(g);
    const run = L.dfsRun(g.lists, '4');
    const treeIdx = run.tree.map(([a, b]) => eIndex(g, a, b));
    const backIdx = g.edges.map((_, i) => i).filter(i => !treeIdx.includes(i));
    let gv = gvMulti(box, g), stop = () => {};
    const reset = () => { stop(); stop = () => {}; clearGraph(gv, g); };
    const play = (then) => {
      reset();
      const steps = [
        ...treeIdx.map(i => () => { gv.setEdgeState(`e${i}`, 'out'); pop(gv.edgeEl(`e${i}`)); drawIn(gv.edgeEl(`e${i}`)); }),
        ...backIdx.map(i => () => { gv.setEdgeState(`e${i}`, 'blocked'); pop(gv.edgeEl(`e${i}`)); }),
      ];
      if (then) steps.push(() => backIdx.forEach(i => gv.setEdgeState(`e${i}`, 'removed')));
      stop = seq(steps, 280);
    };
    host.querySelectorAll('[data-v]').forEach(b => b.addEventListener('click', () => {
      host.querySelectorAll('[data-v]').forEach(x => x.classList.remove('right', 'wrong'));
      const right = b.dataset.v === 't';
      b.classList.add(right ? 'right' : 'wrong');
      if (right) pop(b); else shake(b);
      play(true);
      say(msg, `${right ? 'True' : 'It is true'}: if there are no back edges, every edge of G is a tree edge, so G is the tree itself. Watch the back edges disappear: what stays is a tree, with no cycles.`, right ? 'ok' : 'fail');
    }));
    go.addEventListener('click', () => {
      const got = input.value.trim();
      if (got === '') { shake(input); say(msg, 'Type a number first.', 'fail'); return; }
      const right = +got === backIdx.length;
      if (right) pop(input); else shake(input);
      play(false);
      say(msg, `${right ? 'Correct' : `Not ${got}`}: |E| − |V| + 1 = ${g.edges.length} − ${ids.length} + 1 = ${backIdx.length}. The tree takes |V| − 1 = ${treeIdx.length} edges and the rest are back edges (flagged in red).`, right ? 'ok' : 'fail');
    });
    say(msg, `DFS(4), with the list order that reproduces the run on slides 18-26. ${g.edges.length} edges, ${ids.length} vertices.`);
  }

  /* ------------------------------------------------------------------------
     36. Exercise 6: a vertex every path goes through (3R42, 3R43)
     ------------------------------------------------------------------------ */
  function cutVertex(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: the vertex every path goes through</p>
      <p class="ex-hint">On the graph of slide 17, every path between a = 1 and b = 2 goes through s = 4. Decide, then watch why.</p>
      <div class="ex-graph"></div>
      <div class="ex-verdicts"><span class="ex-q">If we perform DFS(s), then deg(s) &gt; 1 in the spanning tree.</span><button type="button" class="ex-btn" data-v="t">True</button><button type="button" class="ex-btn" data-v="f">False</button><button type="button" class="ex-btn" data-run>Run DFS(4)</button></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg'), runBtn = host.querySelector('[data-run]');
    const g = G['3R17'], ids = idsOf(g), s = '4', a = '1', b = '2';
    let gv, stop = () => {};
    const base = () => {
      stop(); stop = () => {}; gv = gvMulti(box, g);
      gv.setNodeState(a, 'g1'); gv.setNodeState(b, 'g2'); gv.setNodeState(s, 'cur');
    };
    function showCut() {
      base();
      const rest = ids.filter(v => v !== s);
      const noS = g.edges.filter(([x, y]) => x !== s && y !== s);
      const comps = L.components(rest, noS, false);
      const steps = [
        () => g.edges.forEach(([x, y], i) => { if (x === s || y === s) gv.setEdgeState(`e${i}`, 'removed'); }),
        () => { gv.setNodeState(s, 'gone'); },
        ...comps.map((comp, k) => () => comp.forEach(v => { gv.setNodeState(v, `g${k + 1}`); pop(gv.nodeEl(v)); })),
      ];
      stop = seq(steps, 480);
      return comps;
    }
    host.querySelectorAll('[data-v]').forEach(btn => btn.addEventListener('click', () => {
      host.querySelectorAll('[data-v]').forEach(x => x.classList.remove('right', 'wrong'));
      const right = btn.dataset.v === 't';
      btn.classList.add(right ? 'right' : 'wrong');
      if (right) pop(btn); else shake(btn);
      const comps = showCut();
      say(msg, `${right ? 'True' : 'It is true'}: without s the vertices fall into ${comps.length} parts, {${comps.map(c => c.join(', ')).join('} and {')}}. If deg(s) were 1, the rest of the tree would join a and b without s.`, right ? 'ok' : 'fail');
    }));
    runBtn.addEventListener('click', () => {
      base();
      const trees = L.allDfsTrees(ids, g.edges, s);
      const degs = trees.map(t => t.filter(e => e.includes(s)).length);
      const run = L.dfsRun(g.lists, s);
      stop = seq(run.tree.map(([x, y]) => () => {
        const i = eIndex(g, x, y);
        gv.setEdgeState(`e${i}`, 'out'); drawIn(gv.edgeEl(`e${i}`)); pop(gv.edgeEl(`e${i}`));
      }), 360);
      say(msg, `In this run s has ${run.tree.filter(e => e.includes(s)).length} children. Over all ${trees.length} possible runs of DFS(4), deg(s) is ${[...new Set(degs)].sort().join(' or ')}: always more than 1.`, 'ok');
    });
    base();
    say(msg, 'Every path between 1 and 2 goes through 4.');
  }

  /* ========================================================================
     Week 4
     ======================================================================== */
  const vertexToken = (box, text, fromEl) => {
    const t = document.createElement('span');
    t.className = 'token'; t.textContent = text;
    box.appendChild(t);
    if (fromEl) flyFrom(t, fromEl.getBoundingClientRect());
    return t;
  };
  const shortWalk = list => list.join(' – ');
  /* A weighted graph: each edge carries its weight as a label */
  const gvWeighted = (box, g, extra = {}) => {
    box.innerHTML = '';
    const edges = GraphView.autoBend(g.edges.map(([from, to], i) => ({ id: `e${i}`, from, to, label: g.weights ? g.weights[i] : undefined, bend: g.bends ? g.bends[`${from}>${to}`] : undefined })));
    return GraphView.create(box, Object.assign({
      nodes: g.nodes.map(([id, x, y]) => ({ id, x, y, label: g.labels && g.labels[id] ? g.labels[id] : id })), edges,
      width: 500, height: 290, r: 22, directed: g.directed, edgeLabels: !!g.weights, ariaLabel: g.title,
    }, extra));
  };
  const numberPicker = (values, onPick) => {
    const wrap = document.createElement('div');
    wrap.className = 'seg small'; wrap.setAttribute('role', 'group'); wrap.setAttribute('aria-label', 'Value to write');
    wrap.innerHTML = values.map(v => `<button type="button" data-val="${v}" aria-pressed="false">${v}</button>`).join('');
    wrap.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      wrap.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      onPick(b.dataset.val);
    });
    return wrap;
  };

  /* ------------------------------------------------------------------------
     You are the BFS (4L10, 4L11, 4R51)
     ------------------------------------------------------------------------ */
  function bfsByHand(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: you are the BFS</p>
      <p class="ex-hint">Press Dequeue to take the vertex at the front of the queue. Then click each of its unmarked neighbors: it is marked and enqueued. Press Dequeue again when none is left.</p>
      <div class="ex-controls" data-c></div>
      <div class="dfs-stage"><div class="ex-graph"></div>
        <div class="dfs-stack"><p class="strip-name">Queue Q (front is on the left)</p><div class="strip" data-q></div>
        <p class="strip-name">Dequeued: i</p><div class="strip holder" data-i></div></div></div>
      <div class="ex-msg" aria-live="polite"></div>
      <div class="ex-lists" data-lists></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), qBox = host.querySelector('[data-q]'), iBox = host.querySelector('[data-i]'), msg = host.querySelector('.ex-msg'), listBox = host.querySelector('[data-lists]');
    let key = '4L11', strict = true, g, ids, adj, gv, Q, marked, active, tree, done, timer;
    const open = v => adj[v].filter(w => !marked.has(w));
    const paint = () => {
      ids.forEach(v => gv.setNodeState(v, v === active ? 'cur' : marked.has(v) ? 'ready' : ''));
      g.edges.forEach((_, k) => gv.setEdgeState(`e${k}`, tree.includes(k) ? 'out' : ''));
    };
    function load() {
      clearTimeout(timer);
      g = G[key]; ids = idsOf(g); adj = neighborsOf(g);
      gv = gvMulti(box, g); qBox.innerHTML = ''; iBox.innerHTML = '';
      Q = [g.start]; marked = new Set([g.start]); active = null; tree = []; done = false;
      paint(); vertexToken(qBox, g.start, gv.nodeEl(g.start));
      listBox.innerHTML = strict ? `<p class="strip-name">Adjacency lists</p>${ids.map(v => `<code>${v}: ${g.lists[v].join(' → ')}</code>`).join('')}` : '';
      say(msg, `Enqueue(Q, ${g.start}) and mark ${g.start}. Press Dequeue to start the while loop.`);
    }
    function refuse(el, text, flash) {
      clearTimeout(timer); paint(); shake(el);
      if (flash != null) { gv.setNodeState(flash, 'target'); timer = setTimeout(paint, 1100); }
      say(msg, text, 'fail');
    }
    box.addEventListener('click', e => {
      const n = e.target.closest('.node');
      if (!n) return;
      const v = n.dataset.id;
      if (done) { say(msg, 'The queue is empty, so this run is finished. Press Restart to do another.'); return; }
      if (active == null) { refuse(n, 'First press Dequeue: the loop takes a vertex out of the queue before it looks at neighbors.'); return; }
      if (v === active) { refuse(n, `${v} is the vertex being handled now (i = ${v}).`); return; }
      if (!adj[active].includes(v)) { refuse(n, `${v} is not adjacent to ${active}. The loop only goes over the neighbors j of i = ${active}.`); return; }
      if (marked.has(v)) { refuse(n, `${v} is already marked, so nothing happens: it is not added again.`); return; }
      if (strict) {
        const want = g.lists[active].find(w => !marked.has(w));
        if (v !== want) { refuse(n, `The list of ${active} is ${g.lists[active].join(', ')}. Skipping the marked vertices, the next one is ${want}.`, want); return; }
      }
      const k = eIndex(g, active, v);
      tree.push(k); marked.add(v); Q.push(v);
      paint(); pop(n); drawIn(gv.edgeEl(`e${k}`));
      vertexToken(qBox, v, n);
      const left = open(active);
      say(msg, `${v} is not marked: add (${active},${v}) to ${key === '4R51' ? 'T' : 'E′'}, mark ${v} and Enqueue(Q, ${v}). ${left.length ? `${active} still has ${left.length} unmarked ${left.length === 1 ? 'neighbor' : 'neighbors'}.` : `${active} has no unmarked neighbor left: press Dequeue.`}`);
    });
    function dequeue() {
      if (done) return;
      if (active != null) {
        const left = open(active);
        if (left.length) { refuse(gv.nodeEl(active), `Not yet: ${active} still has the unmarked ${left.length === 1 ? 'neighbor' : 'neighbors'} ${left.join(', ')}. The for loop goes over all neighbors of i before the next Dequeue.`, left[0]); return; }
      }
      if (!Q.length) {
        done = true; active = null; iBox.innerHTML = ''; paint();
        ids.forEach(v => pop(gv.nodeEl(v)));
        say(msg, `Q is empty, so the while loop ends. ${key === '4R51' ? 'T' : 'E′'} has ${tree.length} edges on ${ids.length} vertices: a spanning tree.`, 'ok');
        return;
      }
      active = Q.shift();
      const t = qBox.firstElementChild;
      const first = t.getBoundingClientRect();
      iBox.innerHTML = ''; iBox.appendChild(t); flyFrom(t, first);
      paint(); pop(gv.nodeEl(active));
      const left = open(active);
      say(msg, `i ← Dequeue(Q) = ${active}. ${left.length ? `Now click its unmarked neighbors${strict ? ', in list order' : ''}.` : `All its neighbors are already marked, so press Dequeue again.`}`);
    }
    const graphSel = presetSelect(['4L11', '4R51'], k => { key = k; load(); });
    const mode = document.createElement('label');
    mode.className = 'algo-field';
    mode.innerHTML = 'Follow <select><option value="strict">the adjacency lists</option><option value="free">any legal order</option></select>';
    mode.querySelector('select').addEventListener('change', e => { strict = e.target.value === 'strict'; load(); });
    c.append(graphSel, mode, makeBtn('Dequeue', 'primary', dequeue), makeBtn('Restart', null, load));
    load();
  }

  /* ------------------------------------------------------------------------
     Label the distances (4L27-4L30, 4R71)
     ------------------------------------------------------------------------ */
  function labelDistances(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: label every vertex with its distance</p>
      <p class="ex-hint">Pick a number, then click every vertex at that distance from the start. The distance is the number of edges on a shortest path.</p>
      <div class="ex-controls" data-c></div>
      <div class="ex-graph"></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg');
    let g, ids, gv, run, done, pick = null, timer;
    const pathTo = v => { const p = []; for (let x = v; x != null; x = run.parent[x]) p.unshift(x); return p; };
    const paint = () => {
      ids.forEach(v => gv.setNodeState(v, v === g.start ? 'cur' : v in done ? 'ready' : ''));
      g.edges.forEach((_, k) => gv.setEdgeState(`e${k}`, ''));
    };
    function load(key) {
      clearTimeout(timer);
      g = G[key || '4L27']; ids = idsOf(g);
      gv = gvMulti(box, g, { badges: true });
      run = L.bfsRun(neighborsOf(g), g.start);
      done = { [g.start]: 0 };
      paint(); gv.setBadge(g.start, 0);
      say(msg, `${g.start} is the start, labeled 0. Label the others.`);
    }
    box.addEventListener('click', e => {
      const n = e.target.closest('.node');
      if (!n) return;
      const v = n.dataset.id;
      clearTimeout(timer); paint();
      if (pick == null) { shake(n); say(msg, 'First pick a number above.', 'fail'); return; }
      if (v in done) { shake(n); say(msg, `${v} is already labeled ${done[v]}.`, 'fail'); return; }
      const k = +pick, d = run.label[v], p = pathTo(v);
      const lightPath = state => edgesAlong(g, p).forEach(i => gv.setEdgeState(`e${i}`, state));
      if (k !== d) {
        shake(n); lightPath('blocked');
        timer = setTimeout(paint, 1600);
        say(msg, k > d
          ? `Too big: ${shortWalk(p)} is a path with only ${d} ${d === 1 ? 'edge' : 'edges'}, so d(${g.start},${v}) ≤ ${d}.`
          : `Too small: ${v} is not adjacent to any vertex at distance ${k - 1}, so no path from ${g.start} to ${v} has ${k} ${k === 1 ? 'edge' : 'edges'}.`, 'fail');
        return;
      }
      done[v] = d; paint(); gv.setBadge(v, d); pop(n); lightPath('out');
      timer = setTimeout(paint, 1400);
      const left = ids.filter(x => !(x in done));
      if (!left.length) {
        clearTimeout(timer);
        paint();
        run.tree.forEach(([a, b]) => gv.setEdgeState(`e${eIndex(g, a, b)}`, 'out'));
        say(msg, `All labeled. The thick edges join each vertex to the one that discovered it in BFS: the BFS tree, where every path from ${g.start} is a shortest path.`, 'ok');
        return;
      }
      say(msg, `Right: d(${g.start},${v}) = ${d}, along ${shortWalk(p)}. ${left.length} left.`, 'ok');
    });
    c.append(presetSelect(['4L27', '4R51'], load), numberPicker([1, 2, 3, 4], v => { pick = v; }), makeBtn('Restart', null, () => load(host.querySelector('select').value)));
    load('4L27');
  }

  /* ------------------------------------------------------------------------
     Find the shortest s→t path (4L41)
     ------------------------------------------------------------------------ */
  function weightedPath(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: find a shortest path from s to t</p>
      <p class="ex-hint">Click edges along the arrows, starting at s. The weight of your path is added up as you go.</p>
      <div class="ex-controls" data-c></div>
      <div class="ex-graph"></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg');
    const g = G['4L41'], ids = idsOf(g), target = 't';
    const wedges = g.edges.map(([a, b], i) => [a, b, g.weights[i]]);
    const best = L.shortestPaths(ids, wedges, g.start).d[target];
    let gv, walk, used;
    const sum = () => used.reduce((s, i) => s + g.weights[i], 0);
    const sumText = () => (used.length ? `${used.map(i => g.weights[i]).join(' + ').replace(/\+ -/g, '− ')} = ${sum()}` : '0');
    const paint = () => {
      ids.forEach(v => gv.setNodeState(v, v === walk[walk.length - 1] ? 'cur' : walk.includes(v) ? 'ready' : ''));
      g.edges.forEach((_, i) => gv.setEdgeState(`e${i}`, used.includes(i) ? 'out' : ''));
    };
    function load() { gv = gvWeighted(box, g); walk = [g.start]; used = []; paint(); say(msg, `Your path: s. Weight 0. Click an edge leaving s.`); }
    box.addEventListener('click', e => {
      const eg = e.target.closest('.edge');
      if (!eg) { if (e.target.closest('.node')) say(msg, 'Click an edge, not a vertex: the path grows one edge at a time.', 'fail'); return; }
      const i = +eg.dataset.id.slice(1), [a, b] = g.edges[i], end = walk[walk.length - 1];
      if (end === target) { shake(eg); say(msg, 'Your path already reached t. Press Undo or Restart to try another.', 'fail'); return; }
      if (a !== end) { shake(eg); say(msg, `(${a},${b}) does not leave ${end}, the end of your path. A path follows the arrows.`, 'fail'); return; }
      if (walk.includes(b)) { shake(eg); say(msg, `${b} is already on your path, so (${a},${b}) would close a cycle. Press Undo to go another way.`, 'fail'); return; }
      walk.push(b); used.push(i); paint(); pop(gv.nodeEl(b)); drawIn(eg);
      if (b !== target) { say(msg, `Your path: ${shortWalk(walk)}. Weight ${sumText()}.`); return; }
      if (sum() === best) {
        say(msg, `Your path: ${shortWalk(walk)}. Weight ${sumText()}. That is a shortest path: d(s,t) = ${best}.`, 'ok');
        walk.forEach(v => pop(gv.nodeEl(v)));
      } else say(msg, `Your path: ${shortWalk(walk)}. Weight ${sumText()}. It reaches t, but a lighter path exists. Restart and look again.`, 'fail');
    });
    c.append(makeBtn('Undo', null, () => {
      if (!used.length) { say(msg, `Nothing to undo: your path is just ${walk[0]}.`); return; }
      walk.pop(); used.pop(); paint();
      say(msg, `Your path: ${shortWalk(walk)}. Weight ${sumText()}.`);
    }), makeBtn('Restart', null, load));
    load();
  }

  /* ------------------------------------------------------------------------
     You choose the edge: the general method (4L44, 4L45)
     ------------------------------------------------------------------------ */
  const relaxCode = [
    { n: 1, text: 's.d ← 0' }, { n: 2, text: 's.π ← null' }, { n: 3, text: 'for all other v:' }, { n: 4, text: '   v.d ← infinity' }, { n: 5, text: '   v.π ← null' },
    { n: 6, text: 'repeat' }, { n: 7, text: '   choose an edge (u,v)' }, { n: 8, text: '   relax(u,v)' },
    { n: 9, text: 'relax(u,v):   (u,v)∈E' }, { n: 10, text: '   if v.d > u.d + w(u,v) :' }, { n: 11, text: '      v.d ← u.d + w(u,v)' }, { n: 12, text: '      v.π ← u' },
  ];
  function relaxTool(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: you choose the edge</p>
      <p class="ex-hint">Each click on an edge (u,v) runs relax(u,v). Keep choosing edges until no edge can lower any v.d.</p>
      <div class="ex-controls" data-c></div>
      <div class="relax-grid">
        <div class="algo-code"><div class="code-inner" data-code><div class="code-bar" data-bar></div></div></div>
        <div class="ex-graph"></div>
        <table class="relax-table"><thead><tr><th>v</th><th>v.d</th><th>v.π</th></tr></thead><tbody data-rows></tbody></table>
      </div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg'), rowsBox = host.querySelector('[data-rows]');
    const panel = AlgoView.codePanel(host.querySelector('[data-code]'), host.querySelector('[data-bar]'));
    panel.build(relaxCode, [
      { id: 'init', title: 'Init', slide: '4L44', from: 1, to: 5 },
      { id: 'main', title: 'Main loop', slide: '4L44', from: 6, to: 8 },
      { id: 'relax', title: 'relax(u,v)', slide: '4L44', from: 9, to: 12 },
    ]);
    let g, ids, gv, d, pi, counts, steps = 0, stop = () => {}, busy = false, wedges, truth;
    const fmt = x => (x === Infinity ? '∞' : String(x));
    const tense = () => wedges.filter(([u, v, w]) => d[u] + w < d[v]);
    const show = line => { if (line != null) counts[line] = (counts[line] || 0) + 1; panel.show({ line, counts }, reduced() ? 0 : 260); };
    const cell = (v, k) => rowsBox.querySelector(`tr[data-v="${v}"] td:nth-child(${k})`);
    const paint = () => {
      ids.forEach(v => { gv.setBadge(v, fmt(d[v])); gv.setNodeState(v, v === g.start ? 'cur' : d[v] < Infinity ? 'ready' : ''); });
      g.edges.forEach(([a, b], i) => gv.setEdgeState(`e${i}`, pi[b] === a ? 'out' : ''));
      ids.forEach(v => { cell(v, 2).textContent = fmt(d[v]); cell(v, 3).textContent = pi[v] == null ? 'null' : pi[v]; });
    };
    function load(key) {
      stop(); busy = false;
      g = G[key || '4L41']; ids = idsOf(g);
      wedges = g.edges.map(([a, b], i) => [a, b, g.weights[i]]);
      truth = L.shortestPaths(ids, wedges, g.start).d;
      gv = gvWeighted(box, g, { badges: true });
      rowsBox.innerHTML = ids.map(v => `<tr data-v="${v}"><td>${v}</td><td></td><td></td></tr>`).join('');
      d = Object.fromEntries(ids.map(v => [v, v === g.start ? 0 : Infinity]));
      pi = Object.fromEntries(ids.map(v => [v, null]));
      counts = {}; steps = 0;
      [1, 2, 3, 4, 5].forEach(show);
      show(6);
      paint();
      say(msg, `Init: ${g.start}.d = 0 and every other v.d = ∞. Every π is null. Now choose an edge.`);
    }
    box.addEventListener('click', e => {
      const eg = e.target.closest('.edge');
      if (!eg) { if (e.target.closest('.node') && !busy) say(msg, 'Click an edge, not a vertex: relax works on an edge (u,v).', 'fail'); return; }
      if (busy) return; /* the running relax step keeps its own message; the click is ignored */
      const i = +eg.dataset.id.slice(1), [u, v] = g.edges[i], w = g.weights[i];
      const better = d[u] + w < d[v];
      const sumText = `${fmt(d[u])} + ${w < 0 ? `(${w})` : w}`;
      busy = true; steps++;
      paint(); gv.setEdgeState(`e${i}`, 'active'); gv.setNodeState(v, 'target'); pop(eg);
      const actions = [
        () => { show(7); say(msg, `Relax #${steps}: choose the edge (${u},${v}), of weight ${w}.`); },
        () => { show(8); },
        () => { show(9); },
        () => {
          show(10);
          say(msg, better
            ? `Is ${v}.d > ${u}.d + w(${u},${v})? ${fmt(d[v])} > ${sumText} = ${d[u] + w}. Yes: a shorter path to ${v} was detected, through ${u}.`
            : `Is ${v}.d > ${u}.d + w(${u},${v})? ${fmt(d[v])} > ${sumText}${d[u] === Infinity ? '' : ` = ${d[u] + w}`}. No, so nothing changes.`);
        },
      ];
      if (better) {
        actions.push(() => { show(11); d[v] = d[u] + w; paint(); gv.setEdgeState(`e${i}`, 'active'); pop(cell(v, 2)); pop(gv.nodeEl(v)); });
        actions.push(() => { show(12); pi[v] = u; paint(); gv.setEdgeState(`e${i}`, 'active'); pop(cell(v, 3)); });
      }
      actions.push(() => {
        busy = false; show(6); paint();
        const left = tense();
        const change = better ? `${v}.d is now ${d[v]} and ${v}.π = ${u}.` : 'No value changed.';
        if (left.length) { say(msg, `${change} Choose another edge.`); return; }
        const allRight = ids.every(x => d[x] === truth[x]);
        ids.forEach(x => pop(gv.nodeEl(x)));
        say(msg, `${change} No edge can lower any v.d now${allRight ? `, and every v.d equals the distance d(${g.start},v)` : ''}. That took ${steps} relax ${steps === 1 ? 'call' : 'calls'}. The thick edges are the (v.π, v) pairs.`, allRight ? 'ok' : undefined);
      });
      stop = seq(actions, 420);
    });
    c.append(presetSelect(['4L41', '4L43'], load),
      makeBtn('Hint', null, () => {
        if (busy) return;
        paint();
        const left = tense();
        if (!left.length) { say(msg, 'No edge can lower any v.d. You are done.'); return; }
        left.forEach(([a, b]) => gv.setEdgeState(`e${g.edges.findIndex(([x, y]) => x === a && y === b)}`, 'blocked'));
        say(msg, `${left.length} ${left.length === 1 ? 'edge' : 'edges'} would still lower a v.d: ${left.map(([a, b]) => `(${a},${b})`).join(', ')}.`);
      }),
      makeBtn('Restart', null, () => load(host.querySelector('select').value)));
    load('4L41');
  }

  /* ------------------------------------------------------------------------
     Shortest even paths (4R72-4R79)
     ------------------------------------------------------------------------ */
  function evenPaths(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: the shortest even path to each vertex</p>
      <p class="ex-hint">Pick a length, then click a vertex: the length of a shortest path from s to it with an even number of edges.</p>
      <div class="ex-controls" data-c></div>
      <div class="ex-graph"></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg');
    const g = G['4R74'], ids = idsOf(g), res = L.evenDistances(ids, g.edges, g.start);
    let gv, done, pick = null, stop = () => {};
    const paint = () => {
      ids.forEach(v => gv.setNodeState(v, v in done ? 'ready' : ''));
      g.edges.forEach((_, i) => gv.setEdgeState(`e${i}`, ''));
    };
    function load() { stop(); gv = gvMulti(box, g, { badges: true }); done = {}; paint(); say(msg, 'Every vertex needs a label, s included.'); }
    box.addEventListener('click', e => {
      const n = e.target.closest('.node');
      if (!n) return;
      stop(); paint();
      const v = n.dataset.id;
      if (pick == null) { shake(n); say(msg, 'First pick a length above.', 'fail'); return; }
      if (v in done) { shake(n); say(msg, `${v} is already labeled ${done[v]}.`, 'fail'); return; }
      const k = +pick, want = res.dist[v];
      if (k % 2) { shake(n); say(msg, `${k} is odd. The path must have an even number of edges.`, 'fail'); return; }
      if (k !== want) {
        shake(n);
        say(msg, k > want ? `There is a shorter path from s to ${v} with an even number of edges.` : `No path from s to ${v} has exactly ${k} edges.`, 'fail');
        return;
      }
      done[v] = k; gv.setBadge(v, k); pop(n);
      const walk = res.walk[v], along = edgesAlong(g, walk);
      stop = playEdges(gv, along);
      const repeats = new Set(walk).size < walk.length;
      const left = ids.filter(x => !(x in done));
      say(msg, `Right: ${walk.length > 1 ? shortWalk(walk) : 's itself'}, ${k} edges.${repeats ? ` It goes through ${walk.find((x, i) => walk.indexOf(x) !== i)} twice, so it is not a simple path.` : ''}${left.length ? '' : ' All four are labeled: these are the labels of s⁰, b⁰, c⁰, d⁰ after BFS(G′, s⁰).'}`, 'ok');
    });
    c.append(numberPicker([0, 1, 2, 3, 4, 5, 6], v => { pick = v; }), makeBtn('Restart', null, load));
    load();
  }

  /* ========================================================================
     Week 5
     ======================================================================== */
  const wedgesOf = (g, weights = g.weights) => g.edges.map(([a, b], i) => [a, b, weights[i]]);
  const fmtD = x => (x === Infinity ? '∞' : String(x));
  const nm = (g, v) => (g.labels && g.labels[v]) || v;
  const plusW = (a, w) => `${fmtD(a)} + ${w < 0 ? `(${w})` : w}`;

  /* ------------------------------------------------------------------------
     You pick the next vertex: DAG order (5L10, 5L11) or Dijkstra (5L22, 5L24)
     ------------------------------------------------------------------------ */
  function spByHand(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: you pick the next vertex</p>
      <p class="ex-hint" data-hint></p>
      <div class="ex-controls" data-c></div>
      <div class="relax-grid">
        <div class="ex-graph"></div>
        <table class="relax-table"><thead><tr><th>v</th><th>v.d</th><th>v.π</th></tr></thead><tbody data-rows></tbody></table>
      </div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg'), rowsBox = host.querySelector('[data-rows]'), hint = host.querySelector('[data-hint]');
    const modeOf = { '5L11': 'dag', '5L24': 'dijkstra' };
    let g, ids, gv, d, pi, done, relaxes, busy, stop = () => {}, timer, mode;
    const cell = (v, k) => rowsBox.querySelector(`tr[data-v="${v}"] td:nth-child(${k})`);
    const paint = () => {
      ids.forEach(v => { gv.setBadge(v, fmtD(d[v])); gv.setNodeState(v, done.includes(v) ? 'c1' : d[v] < Infinity ? 'ready' : ''); });
      g.edges.forEach(([a, b], i) => gv.setEdgeState(`e${i}`, pi[b] === a ? 'out' : ''));
      ids.forEach(v => { cell(v, 2).textContent = fmtD(d[v]); cell(v, 3).textContent = pi[v] == null ? 'NIL' : pi[v]; });
    };
    function load(key) {
      stop(); clearTimeout(timer); busy = false;
      g = G[key]; ids = idsOf(g); mode = modeOf[key];
      gv = gvWeighted(box, g, { badges: true });
      rowsBox.innerHTML = ids.map(v => `<tr data-v="${v}"><td>${v}</td><td></td><td></td></tr>`).join('');
      d = Object.fromEntries(ids.map(v => [v, v === g.start ? 0 : Infinity]));
      pi = Object.fromEntries(ids.map(v => [v, null])); done = []; relaxes = 0;
      hint.textContent = mode === 'dag'
        ? 'Click the vertices in an order the DAG algorithm may use: the next vertex of a topological sort. Each one relaxes its outgoing edges.'
        : 'Click the vertex Dijkstra dequeues next: one with minimal d among those not yet taken out. Each one relaxes its outgoing edges.';
      paint();
      say(msg, `INIT: ${g.start}.d = 0, every other v.d = ∞. ${mode === 'dag' ? 'Which vertex comes first in a topological sort?' : 'Every vertex is in Q. Which one is dequeued first?'}`);
    }
    function refuse(n, text, flash) {
      clearTimeout(timer); paint(); shake(n);
      flash.forEach(x => gv.setNodeState(x, 'target'));
      timer = setTimeout(paint, 1300);
      say(msg, text, 'fail');
    }
    box.addEventListener('click', e => {
      const n = e.target.closest('.node');
      if (!n) { if (e.target.closest('.edge') && !busy) say(msg, 'Click a vertex, not an edge: you choose the next vertex to process.', 'fail'); return; }
      if (busy) return; /* the running step keeps its own message; the click is ignored */
      const v = n.dataset.id, left = ids.filter(x => !done.includes(x));
      if (!left.length) { say(msg, 'Every vertex is processed. Press Restart to try again.'); return; }
      if (done.includes(v)) { refuse(n, `${v} was already processed. Every vertex is processed exactly once.`, []); return; }
      if (mode === 'dag') {
        const before = g.edges.filter(([a, b]) => b === v && !done.includes(a)).map(([a]) => a);
        if (before.length) { refuse(n, `Not yet: ${before.map(a => `(${a},${v})`).join(', ')} ${before.length === 1 ? 'is an edge' : 'are edges'} into ${v}, so ${before.join(' and ')} must come before ${v} in a topological sort.`, before); return; }
      } else {
        const min = Math.min(...left.map(x => d[x]));
        if (d[v] > min) {
          const best = left.filter(x => d[x] === min);
          refuse(n, `${v}.d = ${fmtD(d[v])}, but ${best.map(x => `${x}.d = ${fmtD(min)}`).join(' and ')} is smaller. Dijkstra dequeues a vertex with minimal d.`, best);
          return;
        }
      }
      clearTimeout(timer);
      done.push(v); paint(); pop(n);
      const out = g.edges.map((ed, i) => [ed, i]).filter(([[a]]) => a === v);
      const first = mode === 'dag'
        ? `Right: every edge into ${v} comes from a processed vertex. ${v}.d = ${fmtD(d[v])}.`
        : `Right: ${v} has the minimal d in Q, ${fmtD(d[v])}. That is its final value: d(${g.start},${v}) = ${fmtD(d[v])}.`;
      say(msg, out.length ? `${first} Now relax its ${out.length} outgoing ${out.length === 1 ? 'edge' : 'edges'}.` : `${first} No edge leaves ${v}.`, 'ok');
      busy = true;
      const steps = out.map(([[a, b], i]) => () => {
        const w = g.weights[i], better = d[a] + w < d[b], old = d[b];
        relaxes++;
        paint(); gv.setEdgeState(`e${i}`, 'active'); gv.setNodeState(b, 'target'); drawIn(gv.edgeEl(`e${i}`));
        if (better) { d[b] = d[a] + w; pi[b] = a; }
        gv.setBadge(b, fmtD(d[b])); cell(b, 2).textContent = fmtD(d[b]); cell(b, 3).textContent = pi[b] == null ? 'NIL' : pi[b];
        if (better) { pop(gv.nodeEl(b)); pop(cell(b, 2)); }
        say(msg, `relax(${a},${b}): ${fmtD(old)} > ${plusW(d[a], w)}${d[a] === Infinity ? '' : ` = ${d[a] + w}`}? ${better ? `Yes: ${b}.d = ${d[b]} and ${b}.π = ${a}.` : 'No, nothing changes.'}`);
      });
      steps.push(() => {
        busy = false; paint();
        const rest = ids.filter(x => !done.includes(x));
        if (rest.length) { say(msg, `${v} is done. ${mode === 'dag' ? 'Which vertex is next in the topological sort?' : 'Which vertex in Q has the minimal d now?'}`); return; }
        const truth = L.shortestPaths(ids, wedgesOf(g), g.start).d, ok = ids.every(x => d[x] === truth[x]);
        ids.forEach(x => pop(gv.nodeEl(x)));
        say(msg, `All ${ids.length} vertices are processed, with ${relaxes} relax calls: one per edge (m = ${g.edges.length}). ${ok ? `Every v.d equals d(${g.start},v)` : 'Some v.d is wrong'}, and the thick edges (v.π, v) are the shortest-path tree.`, ok ? 'ok' : 'fail');
      });
      stop = seq(steps, 650);
    });
    c.append(presetSelect(['5L11', '5L24'], load), makeBtn('Restart', null, () => load(host.querySelector('select').value)));
    load('5L11');
  }

  /* ------------------------------------------------------------------------
     Does the fix work? Shift every weight by −Δ (5L44, 5L45)
     ------------------------------------------------------------------------ */
  function shiftFix(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: does the fix work?</p>
      <p class="ex-hint">Click edges from s along the arrows to build a shortest path to t, first in G and then in G′.</p>
      <div class="ex-controls" data-c></div>
      <div class="ex-graph"></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg');
    let key = '5L44', g, ids, gv, weights, stage, walk, used, firstAnswer, shiftBtn;
    const sum = () => used.reduce((s, i) => s + weights[i], 0);
    const sumText = () => (used.length > 1 ? `${used.map(i => weights[i]).join(' + ').replace(/\+ -/g, '− ')} = ${sum()}` : String(sum()));
    const paint = () => {
      ids.forEach(v => gv.setNodeState(v, v === walk[walk.length - 1] ? 'cur' : walk.includes(v) ? 'ready' : ''));
      g.edges.forEach((_, i) => gv.setEdgeState(`e${i}`, used.includes(i) ? 'out' : ''));
    };
    const draw = () => { gv = gvWeighted(box, Object.assign({}, g, { weights })); };
    function load(k) {
      key = k || key; g = G[key]; ids = idsOf(g); weights = g.weights.slice(); stage = 'G'; walk = [g.start]; used = []; firstAnswer = null;
      draw(); paint(); shiftBtn.disabled = true;
      say(msg, `Stage 1, in G: find a shortest path from s to t. Your path: s, weight 0.`);
    }
    function shift() {
      if (stage !== 'G' || !firstAnswer) return;
      const r = L.shiftWeights(g.weights);
      weights = r.weights; stage = 'G′'; walk = [g.start]; used = [];
      draw(); paint(); shiftBtn.disabled = true;
      g.edges.forEach((_, i) => { const t = gv.edgeEl(`e${i}`).querySelector('.elabel'); if (t) setTimeout(() => pop(t), reduced() ? 0 : i * 110); });
      say(msg, `Δ = ${r.delta}, the minimal weight. Every edge gets w′(e) = w(e) − (${r.delta}) = w(e) + ${-r.delta}, so all weights are now non-negative. Stage 2, in G′: find a shortest path from s to t.`);
    }
    box.addEventListener('click', e => {
      const eg = e.target.closest('.edge');
      if (!eg) { if (e.target.closest('.node')) say(msg, 'Click an edge, not a vertex: the path grows one edge at a time.', 'fail'); return; }
      const i = +eg.dataset.id.slice(1), [a, b] = g.edges[i], end = walk[walk.length - 1];
      if (end === g.target) { shake(eg); say(msg, 'Your path already reached t. Press Undo to try another.', 'fail'); return; }
      if (a !== end) { shake(eg); say(msg, `(${a},${b}) does not leave ${end}, the end of your path. A path follows the arrows.`, 'fail'); return; }
      if (walk.includes(b)) { shake(eg); say(msg, `${b} is already on your path.`, 'fail'); return; }
      walk.push(b); used.push(i); paint(); pop(gv.nodeEl(b)); drawIn(eg);
      if (b !== g.target) {
        const dead = !g.edges.some(([x]) => x === b);
        say(msg, `Your path: ${shortWalk(walk)}. Weight ${sumText()}.${dead ? ` No edge leaves ${b}, so this path cannot reach t. Press Undo.` : ''}`, dead ? 'fail' : undefined);
        return;
      }
      const best = L.shortestPaths(ids, wedgesOf(g, weights), g.start).d[g.target];
      if (sum() !== best) { shake(gv.nodeEl(b)); say(msg, `Your path: ${shortWalk(walk)}, weight ${sumText()}. It reaches t, but a lighter path exists in ${stage}. Press Undo and look again.`, 'fail'); return; }
      walk.forEach(v => pop(gv.nodeEl(v)));
      if (stage === 'G') {
        firstAnswer = walk.slice(); shiftBtn.disabled = false;
        say(msg, `Right: ${shortWalk(walk)} is a shortest path in G, of weight ${best}. Now press "Shift the weights" to build G′.`, 'ok');
        return;
      }
      const same = walk.join() === firstAnswer.join();
      const k1 = firstAnswer.length - 1, k2 = walk.length - 1, delta = -L.shiftWeights(g.weights).delta;
      say(msg, same
        ? `Right: ${shortWalk(walk)} is shortest in G′, of weight ${best}. It is the same path as in G, so on this graph the fix happens to work. Does it always?`
        : `Right: ${shortWalk(walk)} is shortest in G′, of weight ${best}. But in G a shortest path is ${shortWalk(firstAnswer)}. ==The fix fails==: a path with k edges gains ${delta}·k, so ${shortWalk(firstAnswer)} (${k1} edges) gained ${delta * k1}, and ${shortWalk(walk)} (${k2} ${k2 === 1 ? 'edge' : 'edges'}) only ${delta * k2}.`.replace(/==/g, ''), 'ok');
    });
    shiftBtn = makeBtn('Shift the weights', 'primary', shift);
    c.append(presetSelect(['5L44', '5L45'], load), shiftBtn, makeBtn('Undo', null, () => {
      if (!used.length) { say(msg, `Nothing to undo: your path is just ${walk[0]}.`); return; }
      walk.pop(); used.pop(); paint();
      say(msg, `Your path: ${shortWalk(walk)}. Weight ${sumText()}.`);
    }), makeBtn('Restart', null, () => load()));
    load('5L44');
  }

  /* ------------------------------------------------------------------------
     Bellman-Ford: choose the order of the edges, count the sweeps (5L47, 5L48)
     ------------------------------------------------------------------------ */
  function bfOrder(host) {
    /* data-graphs: the graphs offered (default 5L48). Up to 7 edges, every order is tried;
       above that (6R8 has 11), an order that follows a shortest-path tree gives the fewest. */
    const keys = (host.dataset.graphs || '5L48').split(',');
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: order the edges, count the sweeps</p>
      <p class="ex-hint" data-hint></p>
      <div class="ex-controls" data-c></div>
      <div class="dfs-stage"><div class="ex-graph"></div>
        <div class="dfs-stack"><p class="strip-name">Your edge order</p><div class="strip" data-order></div>
        <p class="strip-name">Sweeps</p><div class="sweep-log" data-log></div></div></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg'), orderBox = host.querySelector('[data-order]'), log = host.querySelector('[data-log]'), hint = host.querySelector('[data-hint]');
    let g, ids, all, n, best, slide, tried;
    let gv, chosen, d, stop = () => {}, busy = false;
    const setGraph = key => {
      g = G[key]; ids = idsOf(g); all = wedgesOf(g); n = ids.length;
      tried = all.length <= 7;
      best = tried ? L.bellmanFordBestOrder(ids, all, g.start) : L.bellmanFordTreeOrder(ids, all, g.start);
      slide = L.bellmanFordRun(ids, all, g.start);
      hint.textContent = `Click the edges in the order one sweep should relax them. When all are chosen, the sweeps run until one produces no updates, or until n − 1 = ${n - 1} sweeps are done, whichever comes first.`;
    };
    const label = i => g.edges[i].join('');
    const paint = () => {
      ids.forEach(v => { gv.setBadge(v, fmtD(d[v])); gv.setNodeState(v, v === g.start ? 'cur' : d[v] < Infinity ? 'ready' : ''); });
      g.edges.forEach((_, i) => gv.setEdgeState(`e${i}`, chosen.includes(i) && !busy ? 'out' : ''));
    };
    function load() {
      stop(); busy = false;
      gv = gvWeighted(box, g, { badges: true }); chosen = [];
      d = Object.fromEntries(ids.map(v => [v, v === g.start ? 0 : Infinity]));
      orderBox.innerHTML = ''; log.innerHTML = '';
      paint();
      say(msg, `INIT: ${g.start}.d = 0, the others ∞. Click the first edge of your order (${g.edges.length} edges).`);
    }
    function run() {
      const order = chosen.map(i => all[i]);
      const res = L.bellmanFordRun(ids, order, g.start);
      busy = true;
      d = Object.fromEntries(ids.map(v => [v, v === g.start ? 0 : Infinity]));
      paint();
      const steps = [];
      res.sweeps.forEach((sw, k) => {
        steps.push(() => say(msg, `Sweep ${k + 1}: relax the ${order.length} edges in your order.`));
        chosen.forEach((i, j) => steps.push(() => {
          const [a, b, w] = all[i], better = d[a] + w < d[b];
          if (better) d[b] = d[a] + w;
          paint(); gv.setEdgeState(`e${i}`, 'active');
          [...orderBox.children].forEach((t, x) => t.classList.toggle('in-out', x === j));
          if (better) pop(gv.nodeEl(b));
          say(msg, `Sweep ${k + 1}, relax(${a},${b}): ${better ? `${b}.d drops to ${d[b]}.` : 'no change.'}`);
        }));
        steps.push(() => {
          const row = document.createElement('p');
          row.className = 'sweep-row';
          row.textContent = sw.changed.length ? `Sweep ${k + 1}: ${[...new Set(sw.changed)].map(v => `${v}.d → ${sw.d[v]}`).join(', ')}` : `Sweep ${k + 1}: no updates`;
          log.appendChild(row); pop(row);
          [...orderBox.children].forEach(t => t.classList.remove('in-out'));
        });
      });
      steps.push(() => {
        busy = false; paint();
        const total = res.sweeps.length, upd = res.updating, isBest = upd === best.updating;
        const why = total === n - 1 && res.sweeps[total - 1].changed.length ? `It stopped because n − 1 = ${n - 1} sweeps were done.` : `The last sweep produced no updates, so it stopped (5L47).`;
        const howBest = tried ? `computed over all ${[...Array(g.edges.length).keys()].reduce((x, i) => x * (i + 1), 1)} orders` : 'an order that follows a shortest-path tree reaches it, and no order can do better, because the first sweep always updates something';
        say(msg, `Final: ${ids.map(v => `${v}.d = ${fmtD(d[v])}`).join(', ')}. Your order needed ${upd} ${upd === 1 ? 'sweep' : 'sweeps'} with updates, ${total} in all. ${why} ${isBest
          ? `That is the fewest possible on this graph (${howBest})${best.updating === 1 ? ': the first sweep already found every distance' : ''}.`
          : `The fewest possible is ${best.updating}: try an order where each edge of a shortest path comes before the next edge on that path. (The slide's order needs ${slide.updating}.)`}`, isBest ? 'ok' : undefined);
      });
      stop = seq(steps, 420);
    }
    box.addEventListener('click', e => {
      const eg = e.target.closest('.edge');
      if (!eg) { if (e.target.closest('.node') && !busy) say(msg, 'Click an edge, not a vertex: a sweep order is a list of edges.', 'fail'); return; }
      if (busy) return; /* the running sweep keeps its own message; the click is ignored */
      const i = +eg.dataset.id.slice(1);
      if (chosen.length === g.edges.length) { say(msg, 'All edges are already in your order. Press Clear to choose a new order.'); return; }
      if (chosen.includes(i)) { shake(eg); say(msg, `(${g.edges[i].join(',')}) is already in your order: one sweep relaxes every edge exactly once.`, 'fail'); return; }
      chosen.push(i); paint(); drawIn(eg);
      vertexToken(orderBox, label(i), eg);
      if (chosen.length < g.edges.length) { say(msg, `Edge ${chosen.length} of your order: (${g.edges[i].join(',')}). ${g.edges.length - chosen.length} left.`); return; }
      say(msg, `Your order: ${chosen.map(label).join(', ')}. Running the sweeps…`);
      run();
    });
    if (keys.length > 1) c.append(presetSelect(keys, k => { setGraph(k); load(); }));
    c.append(makeBtn('Use the slide\'s order', null, () => {
      load(); chosen = g.edges.map((_, i) => i);
      chosen.forEach(i => vertexToken(orderBox, label(i), gv.edgeEl(`e${i}`)));
      say(msg, `The slide's order: ${chosen.map(label).join(', ')}. Running the sweeps…`);
      run();
    }), makeBtn('Clear', null, load));
    setGraph(keys[0]);
    load();
  }

  /* ------------------------------------------------------------------------
     Exercise 2 of Recitation 5: prove or refute (5R9, 5R11)
     ------------------------------------------------------------------------ */
  function spClaims(host) {
    const keys = (host.dataset.graphs || '5R9,5R11').split(',');
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: true or false?</p>
      <p class="ex-hint" data-claim></p>
      <div class="ex-controls" data-c></div>
      <div class="ex-graph"></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg'), claim = host.querySelector('[data-claim]');
    const claims = {
      '5R9': {
        text: 'Claim 1: the shortest path in a graph is unique.',
        /* false iff the graph has two different shortest a→b paths */
        verdict: g => L.allShortestPaths(idsOf(g), wedgesOf(g), 'a', 'b').length < 2,
        show: g => {
          const paths = L.allShortestPaths(idsOf(g), wedgesOf(g), 'a', 'b');
          const wOf = p => p.slice(1).map((v, i) => g.weights[eIndex(g, p[i], v)]);
          return { paths, text: `On this graph there are ${paths.length} shortest paths from a to b: ${paths.map(p => `${shortWalk(p)} (${wOf(p).join(' + ')} = ${wOf(p).reduce((x, y) => x + y, 0)})`).join(' and ')}. So the claim is false.` };
        },
      },
      '5R11': {
        text: 'Claim 3: if p₁ is a shortest path from u to v and p₂ a shortest path from v to w, then p₁p₂ is a shortest path from u to w.',
        verdict: g => { const sp = L.shortestPaths(idsOf(g), wedgesOf(g), 'u'), r = L.shortestPaths(idsOf(g), wedgesOf(g), 'v'); return sp.d.v + r.d.w === sp.d.w; },
        show: g => {
          const sp = L.shortestPaths(idsOf(g), wedgesOf(g), 'u'), r = L.shortestPaths(idsOf(g), wedgesOf(g), 'v');
          return { paths: [['u', 'v', 'w'], L.pathByPi(sp.pi, 'u', 'w')], text: `p₁ = u – v weighs ${sp.d.v} and p₂ = v – w weighs ${r.d.w}, both shortest. But p₁p₂ weighs ${sp.d.v + r.d.w}, while the edge u – w weighs ${sp.d.w}. So the claim is false.` };
        },
      },
      /* Week 6, Exercise 4 (6R45-6R48). The claims are false iff the slide's graph breaks them. */
      '6R46': {
        text: 'Claim 1: let G be an undirected graph. If there exists a single BFS tree rooted at s, then G contains no cycles.',
        verdict: g => { const t = bfsTreesOf(g); return !(t.size === 1 && L.undirectedCycle(idsOf(g), g.edges)); },
        show: g => {
          const n = bfsTreesOf(g).size, cyc = L.undirectedCycle(idsOf(g), g.edges);
          return { paths: [["a", "s", "b"], cyc || []], text: `Every order of the neighbor lists gives the same BFS tree, s – a and s – b (${n} ${n === 1 ? 'tree' : 'trees'} in all, computed; shown first): a and b are both found from s. Yet the graph has the cycle ${cyc ? cyc.join(' – ') : '(none)'} (shown second). So the claim is false. (The vertex names a, b are added.)` };
        },
      },
      '6R48': {
        text: 'Claim 2: let G be an undirected graph. We perform DFS(s) followed by BFS(s), with the same data structure in both runs. If u is a leaf in the DFS tree, then it must be a leaf in the BFS tree.',
        verdict: g => { const r = dfsBfsLeaves(g); return !r.bad.length; },
        show: g => {
          const r = dfsBfsLeaves(g), u = r.bad[0];
          const kids = r.bfs.tree.filter(([a]) => a === u).map(([, b]) => b);
          const idx = t => t.map(([a, b]) => eIndex(g, a, b));
          return { paths: [[], []], sets: [idx(r.dfs.tree), idx(r.bfs.tree)], text: `With the neighbors in alphabetical order (added; the slide gives no lists), DFS(S) visits ${r.dfs.order.join(', ')}, and ${u} is a leaf of its tree (shown first). BFS(S) visits ${r.bfs.order.join(', ')}, and ${u} is the parent of ${kids.join(', ')} in its tree (shown second). So the claim is false.` };
        },
      },
    };
    /* Past exam 2004, Part B 1: no "same data structure", so the two runs may order the neighbors differently */
    claims['2004E8'] = {
      text: 'Claim: G is a connected undirected graph. Run BFS(s) and DFS(s). If u is a leaf in the DFS tree, then u is a leaf in the BFS tree.',
      intro: 'The exam\'s counterexample: a cycle of length 4 (the names S, a, b, c are added). True or false?',
      verdict: g => !L.leafGap(idsOf(g), g.edges, g.start, false),
      show: g => {
        const ids = idsOf(g), r = L.leafGap(ids, g.edges, g.start, false), same = L.leafGap(ids, g.edges, g.start, true);
        const kids = r.bfs.filter(([a]) => a === r.u).map(([, b]) => b);
        const idx = t => t.map(([a, b]) => eIndex(g, a, b));
        const first = t => t.filter(([a]) => a === g.start).map(([, b]) => b);
        return { paths: [[], []], sets: [idx(r.dfs), idx(r.bfs)], text: `DFS(S) can enter ${first(r.dfs)[0]} first and go around the cycle, so ${r.u} is a leaf of its tree (shown first). BFS(S) can take ${first(r.bfs).join(' before ')}, and then ${r.u} is the parent of ${kids.join(', ')} (shown second). So the claim is false. Note: the two runs read S's neighbors in different orders. With the same lists in both runs, the 4-cycle has ${same ? 'a' : 'no'} counterexample (computed over every order).` };
      },
    };
    let key, g, gv, stop = () => {};
    function load(k) {
      stop(); key = k; g = G[key];
      gv = gvWeighted(box, g); claim.textContent = claims[key].text;
      say(msg, claims[key].intro ? claims[key].intro : key === '6R46' ? 'Is the claim true or false? The slide draws no graph: this is its "simple cycle of length 3", drawn here, with the names a and b added.' : 'Is the claim true or false? The graph is the one on the slide.');
    }
    const answer = said => {
      stop();
      g.edges.forEach((_, i) => gv.setEdgeState(`e${i}`, ''));
      const truth = claims[key].verdict(g), r = claims[key].show(g);
      const states = ['out', 'blocked'];
      const timers = r.paths.map((p, j) => setTimeout(() => {
        g.edges.forEach((_, i) => { if (gv.edgeEl(`e${i}`).dataset.state === states[j]) gv.setEdgeState(`e${i}`, ''); });
        (r.sets ? r.sets[j] : edgesAlong(g, p)).forEach(i => { gv.setEdgeState(`e${i}`, states[j]); drawIn(gv.edgeEl(`e${i}`)); });
      }, reduced() ? 0 : j * 900));
      stop = () => timers.forEach(clearTimeout);
      if (said === truth) say(msg, `Right. ${r.text}`, 'ok');
      else { shake(box); say(msg, `Not quite. ${r.text}`, 'fail'); }
    };
    c.append(presetSelect(keys, load), makeBtn('True', null, () => answer(true)), makeBtn('False', null, () => answer(false)));
    load(keys[0]);
  }
  /* Neighbor lists in alphabetical order (for the BFS/DFS claims of 6R48) */
  const sortedLists = g => { const adj = neighborsOf(g); for (const v in adj) adj[v].sort(); return adj; };
  /* Every BFS tree from g.start, over every order of the neighbor lists */
  function bfsTreesOf(g) {
    const ids = idsOf(g), adj = neighborsOf(g), out = new Set();
    const perms = a => (a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map(p => [x, ...p])));
    (function pick(i, lists) {
      if (i === ids.length) { out.add(L.bfsRun(lists, g.start).tree.map(e => e.slice().sort().join('')).sort().join(' ')); return; }
      perms(adj[ids[i]]).forEach(p => pick(i + 1, Object.assign({}, lists, { [ids[i]]: p })));
    })(0, {});
    return out;
  }
  function dfsBfsLeaves(g) {
    const lists = sortedLists(g), dfs = L.dfsRun(lists, g.start), bfs = L.bfsRun(lists, g.start);
    const leaves = t => idsOf(g).filter(v => !t.some(([a]) => a === v));
    const bfsLeaves = leaves(bfs.tree);
    return { dfs, bfs, bad: leaves(dfs.tree).filter(v => !bfsLeaves.includes(v)) };
  }

  /* ========================================================================
     Week 6
     ======================================================================== */
  const supN = n => String(n).split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('');
  /* Reads what the student typed: 5, -3, −3 (a typographic minus), ∞ or inf */
  const readNum = text => {
    const t = String(text).trim().replace(/−/g, '-').toLowerCase();
    if (t === '∞' || t === 'inf' || t === 'infinity') return Infinity;
    return /^-?\d+$/.test(t) ? +t : null;
  };
  const numInput = (label, size = 4) => {
    const wrap = document.createElement('label');
    wrap.className = 'algo-field';
    wrap.innerHTML = `${label} <input type="text" inputmode="numeric" class="ex-input" size="${size}" autocomplete="off">`;
    return wrap;
  };
  /* Two matrices, δᵏ⁻¹ and δᵏ, with the classes of the Floyd-Warshall animation */
  function fwTables(box, names) {
    const table = m => `<div class="fw-mat" data-m="${m}"><p class="strip-name" data-h></p><table><thead><tr><th></th>${names.map(x => `<th scope="col">${x}</th>`).join('')}</tr></thead>
      <tbody>${names.map((x, i) => `<tr><th scope="row">${x}</th>${names.map((_, j) => `<td data-i="${i}" data-j="${j}"></td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    box.innerHTML = `<div class="fw-mats">${table('prev')}${table('cur')}</div>`;
    const out = {};
    for (const m of ['prev', 'cur']) {
      const el = box.querySelector(`[data-m="${m}"]`);
      out[m] = { box: el, head: el.querySelector('[data-h]'), cells: names.map((_, i) => names.map((__, j) => el.querySelector(`td[data-i="${i}"][data-j="${j}"]`))) };
    }
    return out;
  }

  /* ------------------------------------------------------------------------
     Fill in the Bellman-Ford table of 6L10, cell by cell
     ------------------------------------------------------------------------ */
  function bfTable(host) {
    const g = G[host.dataset.graphs || '6L10'], ids = idsOf(g), all = wedgesOf(g);
    const run = L.bellmanFordRun(ids, all, g.start);
    const rowsN = run.sweeps.length;
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: fill in the table</p>
      <p class="ex-hint">The edges are relaxed in the slide's order, ${g.edges.map(e => e.join('')).join(', ')}. For each cell, type the new value of v.d after relax(u, v), or press "No change".</p>
      <div class="ex-controls" data-c></div>
      <div class="dfs-stage"><div class="ex-graph"></div>
        <div class="table-wrap"><table class="bf-table"><thead><tr><th></th>${g.edges.map(e => `<th>${e.join('')}</th>`).join('')}</tr></thead>
        <tbody>${run.sweeps.map((_, r) => `<tr><th>Sweep ${r + 1}</th>${g.edges.map((__, e) => `<td data-r="${r}" data-e="${e}"></td>`).join('')}</tr>`).join('')}</tbody></table></div></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg');
    const cellAt = (r, e) => host.querySelector(`td[data-r="${r}"][data-e="${e}"]`);
    const inp = numInput('v.d =');
    const field = inp.querySelector('input');
    let gv, d, r, e, changedThisSweep;
    const paint = () => {
      ids.forEach(v => { gv.setBadge(v, fmtD(d[v])); gv.setNodeState(v, v === g.start ? 'cur' : d[v] < Infinity ? 'ready' : ''); });
      g.edges.forEach((_, i) => gv.setEdgeState(`e${i}`, r < rowsN && i === e ? 'active' : ''));
      host.querySelectorAll('td[data-r]').forEach(td => td.classList.toggle('now', +td.dataset.r === r && +td.dataset.e === e));
    };
    const ask = () => {
      const [u, v] = g.edges[e];
      say(msg, `Sweep ${r + 1}, edge ${u}${v}: relax(${u},${v}). What is ${v}.d now?`);
      field.value = ''; field.focus({ preventScroll: true });
    };
    function load() {
      gv = gvWeighted(box, g, { badges: true });
      d = Object.fromEntries(ids.map(v => [v, v === g.start ? 0 : Infinity]));
      r = 0; e = 0; changedThisSweep = 0;
      host.querySelectorAll('td[data-r]').forEach(td => { td.textContent = ''; td.classList.remove('down'); });
      paint();
      say(msg, `INIT: ${g.start}.d = 0, every other v.d = ∞. Sweep 1, edge ${g.edges[0].join('')}: what is ${g.edges[0][1]}.d after relax(${g.edges[0].join(',')})?`);
    }
    function answer(said) {
      if (r >= rowsN) { say(msg, 'The table is complete. Press Restart to fill it again.'); return; }
      const [u, v, w] = all[e], better = d[u] + w < d[v], value = d[u] + w, old = d[v];
      const right = better ? said === value : said === 'same';
      const cell = cellAt(r, e);
      if (said === null) { shake(field); say(msg, 'Type a whole number (for example 5 or −3), or press "No change".', 'fail'); return; }
      if (!right) {
        shake(cell); shake(field);
        say(msg, `Not quite. Compare ${v}.d = ${fmtD(old)} with ${u}.d + w(${u},${v}) = ${plusW(d[u], w)}, using the values on the graph now. relax changes ${v}.d only if the second is smaller.`, 'fail');
        return;
      }
      if (better) { d[v] = value; changedThisSweep++; cell.textContent = `${v}.d = ${value}`; cell.classList.add('down'); }
      else cell.textContent = '–';
      pop(cell); drawIn(gv.edgeEl(`e${e}`));
      const why = better
        ? `Right: ${fmtD(old)} > ${plusW(d[u], w)} = ${value}, so ${v}.d becomes ${value}.`
        : `Right: ${fmtD(old)} > ${plusW(d[u], w)}${d[u] === Infinity ? ' = ∞' : ` = ${value}`} is false, so nothing changes.`;
      e++;
      if (e === g.edges.length) {
        const made = changedThisSweep;
        r++; e = 0; changedThisSweep = 0;
        paint(); if (better) pop(gv.nodeEl(v));
        if (r === rowsN) {
          ids.forEach(x => pop(gv.nodeEl(x)));
          say(msg, `${why} Sweep ${r} ${made ? `made ${made} ${made === 1 ? 'update' : 'updates'}` : 'made no updates, so Bellman-Ford stops'}. Final: ${ids.map(x => `${x}.d = ${fmtD(d[x])}`).join(', ')}. That is d(${g.start}, v) for every v, after ${run.updating} ${run.updating === 1 ? 'sweep' : 'sweeps'} with updates.`, 'ok');
          return;
        }
        say(msg, `${why} Sweep ${r} is done, with ${made} ${made === 1 ? 'update' : 'updates'}, so another sweep follows. Sweep ${r + 1}, edge ${g.edges[0].join('')}: what is ${g.edges[0][1]}.d now?`, 'ok');
      } else {
        paint(); if (better) pop(gv.nodeEl(v));
        say(msg, `${why} Next, edge ${g.edges[e].join('')}: what is ${g.edges[e][1]}.d after relax(${g.edges[e].join(',')})?`, 'ok');
      }
      field.value = '';
    }
    field.addEventListener('keydown', ev => { if (ev.key === 'Enter') answer(readNum(field.value)); });
    c.append(inp, makeBtn('Enter', 'primary', () => answer(readNum(field.value))), makeBtn('No change', null, () => answer('same')), makeBtn('Restart', null, load));
    load();
  }

  /* ------------------------------------------------------------------------
     How many edges in the shortest path from s to …? (6R5-6R7)
     ------------------------------------------------------------------------ */
  function spEdgeCount(host) {
    const g = G[host.dataset.graphs || '6R8'], ids = idsOf(g), targets = (host.dataset.targets || 'A,B,D').split(',');
    const sp = L.shortestPaths(ids, wedgesOf(g), g.start);
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: how many edges in the shortest path?</p>
      <p class="ex-hint" data-hint></p>
      <div class="ex-controls" data-c></div>
      <div class="ex-graph"></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg'), hint = host.querySelector('[data-hint]');
    let gv, walk, used, t, ti, solved;
    const sum = () => used.reduce((x, i) => x + g.weights[i], 0);
    const sumText = () => (used.length > 1 ? `${used.map(i => g.weights[i]).join(' + ').replace(/\+ -/g, '− ')} = ${sum()}` : String(sum()));
    const paint = () => {
      ids.forEach(v => gv.setNodeState(v, v === t ? 'target' : v === walk[walk.length - 1] ? 'cur' : walk.includes(v) ? 'ready' : ''));
      g.edges.forEach((_, i) => gv.setEdgeState(`e${i}`, used.includes(i) ? 'out' : ''));
    };
    function start(k) {
      ti = k; t = targets[ti]; walk = [g.start]; used = []; solved = false;
      gv = gv || gvWeighted(box, g);
      hint.textContent = `Build the shortest path from ${g.start} to ${t}: click its edges one by one, starting at ${g.start}, along the arrows.`;
      paint();
      say(msg, `Target ${ti + 1} of ${targets.length}: ${t}. Your path: ${g.start}, weight 0.`);
    }
    box.addEventListener('click', ev => {
      const eg = ev.target.closest('.edge');
      if (solved) { if (eg || ev.target.closest('.node')) say(msg, 'This path is done. Press "Next vertex" or Restart.'); return; }
      if (!eg) { if (ev.target.closest('.node')) say(msg, 'Click an edge, not a vertex: the path grows one edge at a time.', 'fail'); return; }
      const i = +eg.dataset.id.slice(1), [a, b] = g.edges[i], end = walk[walk.length - 1];
      if (a !== end) { shake(eg); say(msg, `(${a},${b}) does not leave ${end}, the end of your path. A path follows the arrows.`, 'fail'); return; }
      if (walk.includes(b)) { shake(eg); say(msg, `${b} is already on your path.`, 'fail'); return; }
      walk.push(b); used.push(i); paint(); pop(gv.nodeEl(b)); drawIn(eg);
      if (b !== t) { say(msg, `Your path: ${shortWalk(walk)}. Weight ${sumText()}, ${used.length} ${used.length === 1 ? 'edge' : 'edges'}.`); return; }
      if (sum() !== sp.d[t]) { shake(gv.nodeEl(b)); say(msg, `Your path: ${shortWalk(walk)}, weight ${sumText()}. It reaches ${t}, but a lighter path exists: some negative edges are worth a detour. Press Undo and look again.`, 'fail'); return; }
      solved = true;
      walk.forEach(v => pop(gv.nodeEl(v)));
      const next = ti + 1 < targets.length;
      say(msg, `Right: ${shortWalk(walk)} weighs ${sumText()} = d(${g.start},${t}), and it has ${used.length} edges. So [[bellman-ford|Bellman-Ford]] finds d(${g.start},${t}) within ${used.length} sweeps, whatever the order of the edges.${next ? ' Press "Next vertex".' : ' All three are done.'}`.replace(/\[\[[^|]+\|([^\]]+)\]\]/g, '$1'), 'ok');
    });
    c.append(makeBtn('Undo', null, () => {
      if (solved) { say(msg, 'This path is done. Press "Next vertex" or Restart.'); return; }
      if (!used.length) { say(msg, `Nothing to undo: your path is just ${walk[0]}.`); return; }
      walk.pop(); used.pop(); paint();
      say(msg, `Your path: ${shortWalk(walk)}. Weight ${sumText()}.`);
    }), makeBtn('Next vertex', 'primary', () => start((ti + 1) % targets.length)), makeBtn('Restart', null, () => start(ti)));
    start(0);
  }

  /* ------------------------------------------------------------------------
     Floyd-Warshall by hand: find the cells of δᵏ that go down (6L25-6L30)
     ------------------------------------------------------------------------ */
  function fwByHand(host) {
    const g = G[host.dataset.graphs || '6L25'], ids = idsOf(g), n = ids.length, run = L.floydWarshall(ids, wedgesOf(g));
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: compute δᵏ yourself</p>
      <p class="ex-hint">For each k, click a cell of δᵏ that goes down and type its new value. When every such cell is done, press "δᵏ is done". The cells that stay keep the value of δᵏ⁻¹.</p>
      <div class="ex-controls" data-c></div>
      <div class="dfs-stage"><div class="ex-graph"></div><div data-mats></div></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg');
    const T = fwTables(host.querySelector('[data-mats]'), ids);
    const inp = numInput('new value'), field = inp.querySelector('input');
    let gv, k, sel, cur, found, doneBtn;
    const sumT = (a, b) => `${fmtD(a)} + ${b < 0 ? `(${b})` : fmtD(b)}`;
    const goesDown = (i, j) => run.steps[k][i][j] < run.steps[k - 1][i][j];
    const paint = () => {
      const P = run.steps[k - 1], kk = k - 1;
      T.prev.head.textContent = `δ${supN(k - 1)}`;
      T.cur.head.textContent = k > n ? `δ${supN(n)}` : `δ${supN(k)}: click a cell that goes down`;
      T.prev.cells.forEach((row, i) => row.forEach((td, j) => {
        td.textContent = fmtD(P[i][j]);
        td.classList.toggle('rowk', i === kk); td.classList.toggle('colk', j === kk);
        td.classList.toggle('read-ij', !!sel && sel[0] === i && sel[1] === j);
        td.classList.toggle('read-via', !!sel && ((i === sel[0] && j === kk) || (i === kk && j === sel[1])));
      }));
      T.cur.cells.forEach((row, i) => row.forEach((td, j) => {
        td.textContent = fmtD(cur[i][j]);
        td.classList.toggle('now', !!sel && sel[0] === i && sel[1] === j);
        td.classList.toggle('down', found.has(`${i},${j}`));
        td.classList.add('pick');
      }));
      ids.forEach((v, i) => gv.setNodeState(v, sel && i === sel[0] ? 'cur' : sel && i === sel[1] ? 'target' : i === kk ? 'ready' : ''));
    };
    function setK(newK) {
      k = newK; sel = null; found = new Set(); cur = run.steps[k - 1].map(r => r.slice());
      doneBtn.textContent = `δ${supN(k)} is done`;
      paint();
    }
    function load() {
      gv = gvWeighted(box, g);
      setK(1);
      say(msg, `δ⁰ is the edge weights (6L22). k = 1: which cells go down when paths may pass through ${ids[0]}? The shaded row and column of δ⁰ are what you add.`);
    }
    T.cur.box.addEventListener('click', ev => {
      const td = ev.target.closest('td[data-i]');
      if (!td) return; /* a click between the cells */
      if (k > n) { say(msg, `Every matrix is filled: δ${supN(n)} holds every distance.`); return; }
      sel = [+td.dataset.i, +td.dataset.j]; paint(); pop(td);
      const [i, j] = sel, kk = k - 1;
      say(msg, `(${ids[i]},${ids[j]}): compare δ${supN(k - 1)}(${ids[i]},${ids[j]}) = ${fmtD(run.steps[k - 1][i][j])} with δ${supN(k - 1)}(${ids[i]},${ids[kk]}) + δ${supN(k - 1)}(${ids[kk]},${ids[j]}), the two cells outlined in blue. Type the value of δ${supN(k)}(${ids[i]},${ids[j]}).`);
      field.value = ''; field.focus({ preventScroll: true });
    });
    function enter() {
      if (k > n) { say(msg, `Every matrix is filled: δ${supN(n)} holds every distance.`); return; }
      if (!sel) { say(msg, 'First click a cell of δᵏ.', 'fail'); return; }
      const v = readNum(field.value), [i, j] = sel, kk = k - 1, P = run.steps[k - 1], want = run.steps[k][i][j];
      const td = T.cur.cells[i][j];
      if (v === null) { shake(field); say(msg, 'Type a whole number, for example 4 or −1 (or ∞).', 'fail'); return; }
      const via = P[i][kk] + P[kk][j];
      if (v !== want) {
        shake(td); shake(field);
        say(msg, `Not quite. δ${supN(k)}(${ids[i]},${ids[j]}) = min{ δ${supN(k - 1)}(${ids[i]},${ids[j]}), δ${supN(k - 1)}(${ids[i]},${ids[kk]}) + δ${supN(k - 1)}(${ids[kk]},${ids[j]}) }. Read the three outlined cells of δ${supN(k - 1)} again.`, 'fail');
        return;
      }
      cur[i][j] = want;
      if (goesDown(i, j)) found.add(`${i},${j}`);
      paint(); pop(td);
      const left = run.steps[k].flatMap((r, a) => r.map((_, b) => (goesDown(a, b) && !found.has(`${a},${b}`) ? 1 : 0))).reduce((x, y) => x + y, 0);
      say(msg, goesDown(i, j)
        ? `Right: through ${ids[kk]}, ${sumT(P[i][kk], P[kk][j])} = ${via} < ${fmtD(P[i][j])}, so δ${supN(k)}(${ids[i]},${ids[j]}) = ${want}: the path ${ids[i]} → … → ${ids[kk]} → … → ${ids[j]} is shorter. ${left ? 'Find the next cell that goes down.' : `That is every cell that goes down: press "δ${supN(k)} is done".`}`
        : `Right: ${fmtD(want)}. This cell does not go down (${sumT(P[i][kk], P[kk][j])}${P[i][kk] === Infinity || P[kk][j] === Infinity ? ' = ∞' : ` = ${via}`} is not less than ${fmtD(P[i][j])}). Look for a cell that does.`, 'ok');
      field.value = '';
    }
    function done() {
      if (k > n) { say(msg, 'All of δ¹ … δⁿ are done. Press Restart to compute them again.'); return; }
      const missing = run.steps[k].flatMap((r, a) => r.map((_, b) => (goesDown(a, b) && !found.has(`${a},${b}`) ? [a, b] : null))).filter(Boolean);
      if (missing.length) {
        shake(T.cur.box);
        say(msg, `Not yet: ${missing.length} more ${missing.length === 1 ? 'cell goes' : 'cells go'} down in δ${supN(k)}. Only a pair (i, j) with both δ${supN(k - 1)}(i,${ids[k - 1]}) and δ${supN(k - 1)}(${ids[k - 1]},j) finite can change: look along the shaded row and column.`, 'fail');
        return;
      }
      const from = T.cur.box.getBoundingClientRect();
      const count = found.size;
      if (k === n) {
        k = n + 1; sel = null;
        T.prev.head.textContent = `δ${supN(n - 1)}`; T.cur.head.textContent = `δ${supN(n)}: the shortest paths`;
        T.cur.cells.forEach(row => row.forEach(td => td.classList.remove('now', 'pick')));
        ids.forEach(v => gv.setNodeState(v, ''));
        T.cur.cells.forEach(row => row.forEach(td => pop(td)));
        say(msg, `Right: δ${supN(n)} had ${count} ${count === 1 ? 'cell' : 'cells'} going down. δ${supN(n)}(i, j) is the shortest path from i to j for every pair (6L31), and every diagonal cell is ${run.negative ? 'not ' : ''}0${run.negative ? '' : ', so there is no negative cycle (6L32)'}.`, 'ok');
        return;
      }
      setK(k + 1);
      const to = T.prev.box.getBoundingClientRect();
      anim(T.prev.box, [{ transform: `translate(${from.left - to.left}px, ${from.top - to.top}px)`, opacity: .4 }, { transform: 'none', opacity: 1 }], { duration: 500, easing: 'cubic-bezier(.3,.7,.2,1)' });
      say(msg, `Right: δ${supN(k - 1)} is done, with ${count} ${count === 1 ? 'cell' : 'cells'} going down. It becomes the left matrix. k = ${k}: paths may now also pass through ${ids[k - 1]}.`, 'ok');
    }
    field.addEventListener('keydown', ev => { if (ev.key === 'Enter') enter(); });
    doneBtn = makeBtn('δ¹ is done', 'primary', done);
    c.append(inp, makeBtn('Enter', null, enter), doneBtn, makeBtn('Restart', null, load));
    load();
  }

  /* ------------------------------------------------------------------------
     Exercise 2 of Recitation 6: true or false about a Floyd-Warshall run
     (6R27-6R34). Each claim is judged on a graph that satisfies the premise: the
     counterexamples of 6R28 and 6R30. Claims 3 and 4 are true in general; the
     random test in tools/checks/week6.js backs them.
     ------------------------------------------------------------------------ */
  function fwClaims(host) {
    const recPremise = 'G is a directed graph with arbitrary weights (no negative cycles) and n > 10 vertices. For a pair i, j, the value of δ(i,j) decreases for the first time (from ∞ to a finite value) when δ⁶(i,j) is calculated. Also, δⁿ(i,j) = δ⁶(i,j).';
    const facts = key => {
      const g = G[key], ids = idsOf(g), r = L.floydWarshall(ids, wedgesOf(g)), i = ids.indexOf(g.i), j = ids.indexOf(g.j);
      const seq = r.steps.map(M => M[i][j]);
      const paths = L.allShortestPaths(ids, wedgesOf(g), g.i, g.j);
      return { g, seq, paths, inner: p => p.slice(1, -1).map(Number) };
    };
    const recClaims = [
      { key: '6R28', slide: '6R28', text: '1. Every shortest path from i to j passes only in {1,2,3,4,5,6} as internal nodes.',
        verdict: f => f.paths.every(p => f.inner(p).every(x => x <= 6)),
        why: f => `False (6R28): it is possible, for example, that i–7–j is another shortest path. In this graph, ${f.paths.map(p => p.map(v => nm(f.g, v)).join('–')).join(' and ')} both weigh ${f.seq[f.seq.length - 1]}, and one of them uses vertex 7.` },
      { key: '6R30', slide: '6R30', text: '2. There are at least 6 different shortest paths between i and j.',
        verdict: f => f.paths.length >= 6,
        why: f => `False (6R30): for example, if the only edges are i–6 and 6–j. Here there ${f.paths.length === 1 ? 'is exactly one shortest path' : `are ${f.paths.length}`}, ${f.paths.map(p => p.map(v => nm(f.g, v)).join('–')).join(', ')}.` },
      { key: '6R30', slide: '6R32', text: '3. There exists a shortest path from i to j that passes only in {1,2,3,4,5,6} as internal nodes.',
        verdict: f => f.seq[6] === f.seq[f.seq.length - 1],
        why: f => `True (6R32): because δⁿ(i,j) = δ⁶(i,j). δ⁶(i,j) is the length of a shortest path among those whose internal vertices are in {1,…,6}, and it equals δⁿ(i,j), the length of a shortest path. Here δ⁶(i,j) = δ¹¹(i,j) = ${f.seq[6]}.` },
      { key: '6R30', slide: '6R34', text: '4. There is no path from i to j that passes only in {1,2,3,4,5} as internal nodes.',
        verdict: f => f.seq[5] === Infinity,
        why: f => `True (6R34): otherwise the value of δ(i,j) would be finite before δ⁶(i,j) is calculated. Here δ⁵(i,j) = ${fmtD(f.seq[5])}.` },
    ];
    /* data-set picks the question: Recitation 6 Exercise 2 (default), or a past exam's version */
    const sets = {
      '6R': { premise: recPremise, claims: recClaims, first: 6,
        intro: 'The graph is an example with n = 11 that satisfies the premise (added: i is vertex 10, j is vertex 11). δ(i,j) is ∞ up to δ⁵ and first finite at δ⁶, and δ¹¹ = δ⁶. True or false?' },
      '2004E5': { first: 5,
        premise: 'G has arbitrary weights (no negative cycles). During Floyd-Warshall, for some pair i, j, the value of δ(i,j) does not change from the 5th iteration (when δ⁵(i,j) is computed) until the end of the run.',
        intro: 'The graph is an example with n = 8 that satisfies the premise (added: i is vertex 7, j is vertex 8, every weight is 1). δ(i,j) is first finite at δ⁵ and stays the same up to δ⁸. Is each option true or false?',
        claims: [
          { key: '2004E5', text: '1. Every shortest path between i and j passes only through the vertices i, j, 1, 2, 3, 4, 5.',
            verdict: f => f.paths.every(p => f.inner(p).every(x => x <= 5)),
            why: f => `False: here ${f.paths.map(p => p.map(v => nm(f.g, v)).join('–')).join(' and ')} both weigh ${f.seq[f.seq.length - 1]}, and the second passes through vertex 6. δ only changes when it goes down, so a second shortest path found later leaves δ(i,j) as it was.` },
          { key: '2004E5', text: '2. There are at least five different shortest paths between i and j.',
            verdict: f => f.paths.length >= 5,
            why: f => `False: here there ${f.paths.length === 1 ? 'is exactly one shortest path' : `are only ${f.paths.length}`}, ${f.paths.map(p => p.map(v => nm(f.g, v)).join('–')).join(', ')}.` },
          { key: '2004E5', text: '3. There is a shortest path between i and j that passes only through the vertices i, j, 1, 2, 3, 4, 5.',
            verdict: f => f.seq[5] === f.seq[f.seq.length - 1],
            why: f => `True: δ⁵(i,j) is the length of a shortest path whose internal vertices are in {1,…,5}, and it equals δⁿ(i,j), the length of a shortest path. Here δ⁵(i,j) = δ⁸(i,j) = ${fmtD(f.seq[5])}.` },
        ] },
    };
    const S = sets[host.dataset.set || '6R'], premise = S.premise, claims = S.claims;
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: true or false?</p>
      <p class="ex-hint">${premise}</p>
      <div class="ex-controls" data-claims></div>
      <p class="fw-claim" data-claim></p>
      <div class="ex-controls" data-c></div>
      <div class="ex-graph"></div>
      <p class="strip-name">δᵏ(i, j) for k = 0, 1, …, n (computed on the graph above)</p>
      <div class="seq-chips" data-seq></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const cb = host.querySelector('[data-claims]'), c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg'), claimBox = host.querySelector('[data-claim]'), seqBox = host.querySelector('[data-seq]');
    let q, f, gv, stop = () => {};
    const seg = document.createElement('div');
    seg.className = 'seg small'; seg.setAttribute('role', 'group'); seg.setAttribute('aria-label', 'Claim');
    seg.innerHTML = claims.map((_, x) => `<button type="button" data-q="${x}" aria-pressed="false">Claim ${x + 1}</button>`).join('');
    seg.addEventListener('click', ev => { const b = ev.target.closest('button'); if (b) load(+b.dataset.q); });
    cb.append(seg);
    function load(x) {
      stop(); q = claims[x]; f = facts(q.key);
      seg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.q === x)));
      claimBox.textContent = q.text;
      gv = gvWeighted(box, f.g);
      seqBox.innerHTML = f.seq.map((v, k) => `<span class="seq-chip${k === S.first ? ' first' : ''}"><small>δ${supN(k)}</small>${fmtD(v)}</span>`).join('');
      say(msg, S.intro);
    }
    function answer(said) {
      stop();
      const truth = q.verdict(f), chips = [...seqBox.children];
      f.g.edges.forEach((_, i) => gv.setEdgeState(`e${i}`, ''));
      const timers = chips.map((ch, k) => setTimeout(() => pop(ch), reduced() ? 0 : k * 70));
      f.paths.forEach((p, k) => timers.push(setTimeout(() => edgesAlong(f.g, p).forEach(i => { gv.setEdgeState(`e${i}`, k ? 'blocked' : 'out'); drawIn(gv.edgeEl(`e${i}`)); }), reduced() ? 0 : 400 + k * 700)));
      stop = () => timers.forEach(clearTimeout);
      if (said === truth) say(msg, `Right. ${q.why(f)}`, 'ok');
      else { shake(claimBox); say(msg, `Not quite. ${q.why(f)}`, 'fail'); }
    }
    c.append(makeBtn('True', null, () => answer(true)), makeBtn('False', null, () => answer(false)));
    load(0);
  }

  /* ------------------------------------------------------------------------
     Exercise 3 of Recitation 6: the cheapest taxed path (6R36, 6R37)
     ------------------------------------------------------------------------ */
  function taxPath(host) {
    const sets = { '6R36': ['c', 'a'], '6R37': ['t'] };
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: the cheapest path, with the tax</p>
      <p class="ex-hint" data-hint></p>
      <div class="ex-controls" data-c></div>
      <div class="ex-graph"></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg'), hint = host.querySelector('[data-hint]');
    let key, g, ids, gv, walk, used, t, ti, solved, best, naive;
    const ws = () => used.map(i => g.weights[i]);
    const costText = () => {
      const w = ws(), plain = w.reduce((a, b) => a + b, 0), odd = w.length % 2 === 1;
      return w.length ? `${w.length} ${w.length === 1 ? 'edge' : 'edges'} (${odd ? 'odd: the last edge costs double' : 'even: no tax'}), cost ${odd ? `${w.slice(0, -1).concat(`2·${w[w.length - 1]}`).join(' + ')} = ${L.taxedCost(w)}` : `${w.join(' + ')} = ${plain}`}` : 'cost 0';
    };
    const paint = () => {
      ids.forEach(v => gv.setNodeState(v, v === t ? 'target' : v === walk[walk.length - 1] ? 'cur' : walk.includes(v) ? 'ready' : ''));
      g.edges.forEach((_, i) => gv.setEdgeState(`e${i}`, used.includes(i) ? 'out' : ''));
    };
    function start(k, x) {
      if (k) { key = k; g = G[key]; ids = idsOf(g); gv = gvWeighted(box, g); best = L.taxDistances(ids, wedgesOf(g), g.start); naive = L.taxNaive(ids, wedgesOf(g), g.start); }
      ti = x; t = sets[key][ti]; walk = [g.start]; used = []; solved = false;
      hint.textContent = `Find the cheapest path from ${g.start} to ${t} under the tax rule: click its edges from ${g.start}, along the arrows. A path with an odd number of edges pays its last edge twice.`;
      paint();
      say(msg, `Your path: ${g.start}, cost 0.`);
    }
    box.addEventListener('click', ev => {
      const eg = ev.target.closest('.edge');
      if (solved) { if (eg || ev.target.closest('.node')) say(msg, 'This path is done. Press "Next vertex" or Restart.'); return; }
      if (!eg) { if (ev.target.closest('.node')) say(msg, 'Click an edge, not a vertex: the path grows one edge at a time.', 'fail'); return; }
      const i = +eg.dataset.id.slice(1), [a, b] = g.edges[i], end = walk[walk.length - 1];
      if (a !== end) { shake(eg); say(msg, `(${a},${b}) does not leave ${end}, the end of your path. A path follows the arrows.`, 'fail'); return; }
      if (walk.includes(b)) { shake(eg); say(msg, `${b} is already on your path.`, 'fail'); return; }
      walk.push(b); used.push(i); paint(); pop(gv.nodeEl(b)); drawIn(eg);
      if (b !== t) { say(msg, `Your path: ${shortWalk(walk)}: ${costText()}.`); return; }
      const cost = L.taxedCost(ws());
      if (cost !== best[t]) { shake(gv.nodeEl(b)); say(msg, `Your path: ${shortWalk(walk)}: ${costText()}. A cheaper path to ${t} exists. Press Undo and compare a path with the other parity.`, 'fail'); return; }
      solved = true;
      walk.forEach(v => pop(gv.nodeEl(v)));
      const wrong = naive[t] !== best[t]
        ? ` The WRONG solution of 6R37 (a shortest path by Dijkstra, then the tax if it is odd) returns ${naive[t]} here, not ${best[t]}: the cheapest path before tax is not always the cheapest after it.`
        : ` Here the WRONG solution of 6R37 happens to give the same ${naive[t]}.`;
      const more = ti + 1 < sets[key].length;
      say(msg, `Right: ${shortWalk(walk)}, ${costText()}: the cheapest, computed with the three copies of G (6R38).${wrong}${more ? ' Press "Next vertex".' : ''}`, 'ok');
    });
    c.append(presetSelect(Object.keys(sets), k => start(k, 0)), makeBtn('Undo', null, () => {
      if (solved) { say(msg, 'This path is done. Press "Next vertex" or Restart.'); return; }
      if (!used.length) { say(msg, `Nothing to undo: your path is just ${walk[0]}.`); return; }
      walk.pop(); used.pop(); paint();
      say(msg, `Your path: ${shortWalk(walk)}: ${costText()}.`);
    }), makeBtn('Next vertex', 'primary', () => start(null, (ti + 1) % sets[key].length)), makeBtn('Restart', null, () => start(null, ti)));
    start('6R36', 0);
  }

  /* ------------------------------------------------------------------------
     Exercise 5 of Recitation 6: complete the missing weights (6R49, 6R50)
     ------------------------------------------------------------------------ */
  function fwWeights(host) {
    const g = G['6R49'], ids = idsOf(g), blanks = g.blanks.map(b => g.edges.findIndex(([a, c]) => `${a}>${c}` === b));
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: complete the missing edge weights</p>
      <p class="ex-hint">Choose w(1,3) and w(5,4) so that the graph has no negative cycles and, when Floyd-Warshall runs on it, δ⁵(2,3) < δ⁴(2,3) < δ¹(2,3).</p>
      <div class="ex-controls" data-c></div>
      <div class="dfs-stage"><div class="ex-graph"></div>
        <div><p class="strip-name">Computed by Floyd-Warshall</p><div class="seq-chips" data-vals></div><ul class="fw-checks" data-checks></ul></div></div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg'), vals = host.querySelector('[data-vals]'), checks = host.querySelector('[data-checks]');
    const in13 = numInput('w(1,3) ='), in54 = numInput('w(5,4) =');
    let gv;
    const draw = w => { gv = gvWeighted(box, Object.assign({}, g, { weights: g.weights.map((x, i) => (blanks.includes(i) ? (w ? w[blanks.indexOf(i)] : '?') : x)) })); };
    function check() {
      const a = readNum(in13.querySelector('input').value), b = readNum(in54.querySelector('input').value);
      if (a === null || b === null || a === Infinity || b === Infinity) { shake(c); say(msg, 'Type a whole number in both boxes, for example 14 and −4.', 'fail'); return; }
      const w = g.weights.slice(); w[blanks[0]] = a; w[blanks[1]] = b;
      const r = L.floydWarshall(ids, wedgesOf(g, w)), i = ids.indexOf('2'), j = ids.indexOf('3');
      const d = k => r.steps[k][i][j];
      draw([a, b]);
      blanks.forEach((e, x) => { const t = gv.edgeEl(`e${e}`).querySelector('.elabel'); if (t) setTimeout(() => pop(t), reduced() ? 0 : x * 150); });
      vals.innerHTML = [1, 4, 5].map(k => `<span class="seq-chip"><small>δ${supN(k)}(2,3)</small>${fmtD(d(k))}</span>`).join('');
      [...vals.children].forEach((ch, x) => setTimeout(() => pop(ch), reduced() ? 0 : 200 + x * 150));
      const negs = ids.filter((v, x) => r.d[x][x] < 0);
      const rows = [
        [d(4) < d(1), `δ⁴(2,3) = ${fmtD(d(4))} < δ¹(2,3) = ${fmtD(d(1))}`],
        [d(5) < d(4), `δ⁵(2,3) = ${fmtD(d(5))} < δ⁴(2,3) = ${fmtD(d(4))}`],
        [!negs.length, negs.length ? `a negative cycle exists: δ⁵(${negs[0]},${negs[0]}) = ${r.d[ids.indexOf(negs[0])][ids.indexOf(negs[0])]} < 0` : 'no negative cycle: every δ⁵(i,i) = 0'],
      ];
      checks.innerHTML = rows.map(([ok, t]) => `<li class="${ok ? 'ok' : 'bad'}">${ok ? '✓' : '✗'} ${t}</li>`).join('');
      [...checks.children].forEach((li, x) => setTimeout(() => pop(li), reduced() ? 0 : 500 + x * 150));
      if (rows.every(x => x[0])) { say(msg, `Right: with w(1,3) = ${a} and w(5,4) = ${b}, all three conditions hold. The slide's example is w(1,3) = 14, w(5,4) = −4; any w(1,3) > 13 with −5 ≤ w(5,4) < 4 works (computed from 6R50's conditions).`, 'ok'); return; }
      const why = [];
      if (!rows[0][0]) why.push('δ⁴(2,3) must beat δ¹(2,3) = −3 + w(1,3), the path 2–1–3; δ⁴ adds the path 2–4–3 of weight 2 + 8 = 10 (6R50)');
      if (!rows[1][0]) why.push('δ⁵(2,3) must beat δ⁴(2,3): vertex 5 adds the path 2–1–5–4–3 of weight −2 + w(5,4) + 8 (6R50)');
      if (!rows[2][0]) why.push('a negative cycle breaks the rule: check 1-5-4-3-2-1, 5-4-3-2-5 and 1-3-2-1 (6R50)');
      shake(checks);
      say(msg, `Not yet: ${why.join('; and ')}.`, 'fail');
    }
    [in13, in54].forEach(x => x.querySelector('input').addEventListener('keydown', ev => { if (ev.key === 'Enter') check(); }));
    c.append(in13, in54, makeBtn('Run Floyd-Warshall', 'primary', check), makeBtn('Clear', null, () => {
      in13.querySelector('input').value = ''; in54.querySelector('input').value = '';
      draw(null); vals.innerHTML = ''; checks.innerHTML = '';
      say(msg, 'The two weights marked "?" are missing.');
    }));
    draw(null);
    say(msg, 'The two weights marked "?" are missing.');
  }


  /* ========================================================================
     Past exams (past-exams/). Each widget visualizes one question; its answer is
     computed here and checked in tools/checks/exam-*.js.
     ======================================================================== */
  const exShell = (title, hint) => `<div class="ex"><p class="ex-title">${title}</p>${hint ? `<p class="ex-hint">${hint}</p>` : ''}
      <div class="ex-controls" data-c></div><div class="ex-graph"></div><div class="ex-msg" aria-live="polite"></div></div>`;
  const segOf = (labels, onPick, aria) => {
    const seg = document.createElement('div');
    seg.className = 'seg small'; seg.setAttribute('role', 'group'); seg.setAttribute('aria-label', aria);
    seg.innerHTML = labels.map((l, x) => `<button type="button" data-k="${x}" aria-pressed="${x === 0}">${l}</button>`).join('');
    seg.addEventListener('click', ev => {
      const b = ev.target.closest('button'); if (!b) return;
      seg.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      onPick(+b.dataset.k);
    });
    return seg;
  };
  /* Depth of every vertex in a tree given as [[a, b], …] edges, rooted at r */
  const treeDepth = (tree, r) => {
    const depth = { [r]: 0 };
    let grew = true;
    while (grew) {
      grew = false;
      tree.forEach(([a, b]) => {
        if (a in depth && !(b in depth)) { depth[b] = depth[a] + 1; grew = true; }
        else if (b in depth && !(a in depth)) { depth[a] = depth[b] + 1; grew = true; }
      });
    }
    return depth;
  };

  /* A drawing of a graph from an exam question, with no controls. data-graph = the key;
     data-tree: draw only the graph's `tree` edges (a spanning tree drawn beside its graph) */
  function graphFigure(host) {
    const g = G[host.dataset.graph], tree = host.dataset.tree != null;
    host.innerHTML = `<figure class="exam-fig"><div class="ex-graph"></div><figcaption>${tree ? 'The spanning tree' : g.title}</figcaption></figure>`;
    const gv = gvWeighted(host.querySelector('.ex-graph'), tree ? Object.assign({}, g, { edges: g.tree, title: `${g.title}: the spanning tree` }) : g);
    if (tree) g.tree.forEach((_, i) => gv.setEdgeState(`e${i}`, 'out'));
  }

  /* A2 (2004): DFS(s) on the triangle marks v, then u from v; BFS(s) labels both 1 */
  function dfsBfsLabels(host) {
    const g = G['2004E2'], ids = idsOf(g);
    host.innerHTML = exShell('Try it: DFS(s), then BFS(s), on the triangle',
      `Adjacency lists (added: the exam gives none): ${ids.map(v => `${v}: ${g.lists[v].join(', ')}`).join(' · ')}. With s listing v first, DFS(s) marks v, and v marks u, as the question says.`);
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg');
    let gv, stop = () => {};
    const reset = () => { stop(); gv = gvWeighted(box, g, { badges: true }); };
    const showTree = (tree, state) => tree.map(([a, b]) => () => { const i = eIndex(g, a, b); gv.setEdgeState(`e${i}`, state); drawIn(gv.edgeEl(`e${i}`)); });
    c.append(makeBtn('Run DFS(s)', null, () => {
      reset();
      const r = L.dfsRun(g.lists, 's');
      const steps = r.order.map((v, k) => () => { gv.setNodeState(v, 'c1'); gv.setBadge(v, `#${k + 1}`); pop(gv.nodeEl(v)); });
      const tree = showTree(r.tree, 'out');
      stop = seq([steps[0], tree[0], steps[1], tree[1], steps[2]].filter(Boolean), 500);
      const parentU = r.tree.find(([, b]) => b === 'u')[0];
      say(msg, `DFS(s) marks ${r.order.join(', ')} (the badges give the order). u is marked from ${parentU}, so the edge (${parentU},u) is in the spanning tree: the premise holds.`);
    }), makeBtn('Run BFS(s)', null, () => {
      reset();
      const r = L.bfsRun(g.lists, 's');
      const steps = r.order.map(v => () => { gv.setNodeState(v, 'c2'); gv.setBadge(v, r.label[v]); pop(gv.nodeEl(v)); });
      const tree = showTree(r.tree, 'blocked');
      stop = seq([steps[0], tree[0], tree[1], steps[1], steps[2]], 500);
      const same = r.label.u === r.label.v;
      say(msg, `BFS(s) labels s = ${r.label.s}, v = ${r.label.v}, u = ${r.label.u} (the badges). label(v) ${same ? '=' : '≠'} label(u): ${same ? 'equal labels are possible, so neither "always smaller" nor "always larger" holds.' : 'they differ here.'}`, same ? 'ok' : null);
    }));
    reset();
    say(msg, 'Run DFS(s) first, then BFS(s), and compare the labels of u and v.');
  }

  /* A6 (2004): is the Euler cycle also a Hamiltonian cycle? */
  function eulerHam(host) {
    const keys = ['2004E6a', '2004E6b', '2004E6c'];
    host.innerHTML = exShell('Try it: is the Euler cycle also a Hamiltonian cycle?');
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg');
    let g, gv, stop = () => {};
    function load(k) {
      stop(); g = G[k]; gv = gvWeighted(box, g, { badges: true });
      const deg = L.degrees(idsOf(g), g.edges);
      idsOf(g).forEach(v => gv.setBadge(v, `deg ${deg[v]}`));
      say(msg, `${g.title}: n = ${idsOf(g).length}, m = ${g.edges.length}, every degree is even. Trace its Euler cycle and see whether it passes through each vertex exactly once.`);
    }
    c.append(presetSelect(keys, load), makeBtn('Trace the Euler cycle', null, () => {
      stop(); clearGraph(gv, g);
      const ids = idsOf(g), tour = L.eulerTour(ids, g.edges, false);
      const visits = Object.fromEntries(ids.map(v => [v, tour.vertices.slice(0, -1).filter(x => x === v).length]));
      ids.forEach(v => gv.setBadge(v, ''));
      stop = playEdges(gv, tour.edges);
      const later = setTimeout(() => ids.forEach(v => { gv.setBadge(v, `×${visits[v]}`); if (visits[v] > 1) { gv.setNodeState(v, 'bad'); pop(gv.nodeEl(v)); } }), reduced() ? 0 : tour.edges.length * 130 + 200);
      const prev = stop; stop = () => { prev(); clearTimeout(later); };
      const twice = ids.filter(v => visits[v] > 1);
      const ham = !twice.length && tour.edges.length === ids.length;
      say(msg, ham
        ? `Euler cycle: ${shortWalk(tour.vertices)}. It passes through each of the ${ids.length} vertices exactly once, so it is also a Hamiltonian cycle. That takes exactly n = ${ids.length} edges, every vertex of degree 2: this graph is a cycle.`
        : `Euler cycle: ${shortWalk(tour.vertices)}. It passes through ${twice.join(', ')} more than once (red), so it is not a Hamiltonian cycle. An Euler cycle uses all m = ${g.edges.length} edges, and a Hamiltonian cycle has exactly n = ${ids.length}.`, ham ? 'ok' : 'fail');
    }));
    load(keys[0]);
  }

  /* A7 (2004): can the drawn spanning tree come from DFS(s) or BFS(s)? */
  function treeOrigin(host) {
    const g = G['2004E7'], ids = idsOf(g);
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: which trees can DFS(s) and BFS(s) build?</p>
      <p class="ex-hint">Every order of the neighbor lists is tried (computed). The names D and E are added: the exam names only s, A, B and C.</p>
      <div class="ex-controls" data-c></div>
      <div class="ex-pair">
        <div><p class="strip-name">The tree in the question</p><div class="ex-graph" data-mine></div></div>
        <div><p class="strip-name" data-cand-name>A tree the algorithm can build</p><div class="ex-graph" data-cand></div></div>
      </div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), msg = host.querySelector('.ex-msg'), candName = host.querySelector('[data-cand-name]');
    const mine = gvWeighted(host.querySelector('[data-mine]'), g);
    g.tree.forEach(([a, b]) => mine.setEdgeState(`e${eIndex(g, a, b)}`, 'out'));
    g.edges.forEach(([a, b], i) => { if (!g.tree.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) mine.setEdgeState(`e${i}`, 'gone'); });
    let cand = gvWeighted(host.querySelector('[data-cand]'), g), stop = () => {};
    const show = tree => {
      g.edges.forEach((_, i) => cand.setEdgeState(`e${i}`, 'gone'));
      tree.forEach(([a, b]) => { const i = eIndex(g, a, b); cand.setEdgeState(`e${i}`, 'blocked'); drawIn(cand.edgeEl(`e${i}`)); });
    };
    const run = (name, trees, why) => {
      stop();
      const hit = trees.some(t => L.sameTree(t, g.tree));
      const steps = trees.map((t, k) => () => { candName.textContent = `${name} tree ${k + 1} of ${trees.length}`; show(t); });
      stop = seq(steps, 700);
      say(msg, `${name} can build ${trees.length} different ${trees.length === 1 ? 'tree' : 'trees'} here, shown one after another. ${hit ? 'One of them is the drawn tree.' : 'None of them is the drawn tree.'} ${why(trees)}`, hit ? null : 'ok');
    };
    const depthMine = treeDepth(g.tree, 's');
    c.append(makeBtn('Every BFS(s) tree', null, () => run('BFS(s)', L.allBfsTrees(ids, g.edges, 's'), trees => {
      const dC = [...new Set(trees.map(t => treeDepth(t, 's').C))];
      return `In every BFS tree C is at depth ${dC.join(', ')}, its distance from s (s – A – C). In the drawn tree C is at depth ${depthMine.C} (s – B – E – C).`;
    })), makeBtn('Every DFS(s) tree', null, () => run('DFS(s)', L.allDfsTrees(ids, g.edges, 's'), trees => {
      const kids = [...new Set(trees.map(t => t.filter(([a]) => a === 's').length))];
      return `In every DFS tree s has ${kids.join(', ')} ${kids[0] === 1 ? 'child' : 'children'}: whichever of A and B DFS enters first, the other is reachable from it without passing through s (by the edge A – B, for one), so DFS marks it before it backs up to s. In the drawn tree s has two children, A and B.`;
    })));
    say(msg, 'The drawn tree is on top. Show every tree BFS(s) can build, then every tree DFS(s) can build.');
  }

  /* B3 (2004): Σ deg(v) = 2(n − 5) leaves too few edges for a connected graph */
  function edgeBudget(host) {
    host.innerHTML = exShell('Try it: a simple graph with Σ deg(v) = 2(n − 5)', 'Pick n and draw a random simple graph with n − 5 edges. Its connected components get colors (computed).');
    const c = host.querySelector('[data-c]'), box = host.querySelector('.ex-graph'), msg = host.querySelector('.ex-msg');
    const field = document.createElement('label');
    field.className = 'algo-field';
    field.innerHTML = 'n = <input type="range" min="6" max="16" value="9"> <b>9</b>';
    const range = field.querySelector('input'), shown = field.querySelector('b');
    let stop = () => {};
    function draw() {
      stop();
      const n = +range.value, m = n - 5;
      shown.textContent = n;
      const ids = Array.from({ length: n }, (_, i) => String(i + 1));
      const all = ids.flatMap((a, i) => ids.slice(i + 1).map(b => [a, b]));
      const edges = [];
      while (edges.length < m) edges.push(all.splice(Math.floor(Math.random() * all.length), 1)[0]);
      const g = { title: `Random simple graph, n = ${n}, m = ${m}`, directed: false,
        nodes: ids.map((v, i) => [v, 250 + 200 * Math.sin(2 * Math.PI * i / n), 145 - 112 * Math.cos(2 * Math.PI * i / n)]), edges };
      const gv = gvWeighted(box, g, { r: 15 });
      const comps = L.components(ids, edges, false);
      const colors = ['g1', 'g2', 'g3', 'g4', 'c1', 'c2'];
      let k = 0;
      const steps = [
        ...edges.map((_, i) => () => drawIn(gv.edgeEl(`e${i}`))),
        ...comps.filter(cp => cp.length > 1).map(cp => { const col = colors[k++ % colors.length]; return () => cp.forEach(v => { gv.setNodeState(v, col); pop(gv.nodeEl(v)); }); }),
      ];
      stop = seq(steps, 160);
      say(msg, `n = ${n}: Σ deg(v) = 2(n − 5) = ${2 * m} = 2m, so m = ${m}. A connected graph on ${n} vertices needs at least n − 1 = ${n - 1} edges, and there are only ${m}. This graph has ${comps.length} connected components (each edge joins at most two components into one, so at least n − m = 5 remain).`, 'ok');
    }
    range.addEventListener('input', draw);
    c.append(field, makeBtn('Another random graph', null, draw));
    draw();
  }

  /* B4 (2004): a binary De Bruijn sequence has as many 0s as 1s */
  function deBruijnCount(host) {
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: count the 0s and 1s of a De Bruijn sequence</p>
      <div class="ex-controls" data-c></div><div class="seq-chips" data-seq></div><div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), seqBox = host.querySelector('[data-seq]'), msg = host.querySelector('.ex-msg');
    const ns = [2, 3, 4, 5];
    let stop = () => {};
    function load(k) {
      stop();
      const n = ns[k], s = L.deBruijnSequence(2, n), len = s.length;
      const z = [...s].filter(x => x === '0').length, o = len - z;
      const words = L.cyclicWindows(s, n);
      seqBox.innerHTML = [...s].map((x, i) => `<span class="seq-chip db-${x}" title="starts the word ${words[i]}"><small>${i}</small>${x}</span>`).join('');
      stop = seq([...seqBox.children].map(ch => () => pop(ch)), 45);
      say(msg, `A De Bruijn sequence for n = ${n}, from an Euler cycle of G₂,${n} (computed${L.isDeBruijn(s, 2, n) ? ', and every word of length ' + n + ' appears exactly once' : ''}): ${len} letters, ${z} zeros and ${o} ones. Each letter is the first letter of exactly one of the ${len} words of length ${n}, and ${len / 2} of those words start with 0. Hover a letter to see its word.`, z === o ? 'ok' : 'fail');
    }
    c.append(segOf(ns.map(n => `n = ${n}`), load, 'Word length'));
    load(0);
  }

  /* B6 (2004): spanning trees on {1,…,5} in which vertex 1 is a leaf */
  function treeCount(host) {
    const ids = ['1', '2', '3', '4', '5'];
    const all = ids.flatMap((a, i) => ids.slice(i + 1).map(b => [a, b]));
    const trees = L.spanningTrees(ids, all).map(t => t.map(k => all[k]));
    const pos = Object.fromEntries(ids.map((v, i) => [v, [50 + 36 * Math.sin(2 * Math.PI * i / 5), 52 - 36 * Math.cos(2 * Math.PI * i / 5)]]));
    const leaf1 = t => t.filter(e => e.includes('1')).length === 1;
    const mini = t => `<svg viewBox="0 0 100 100" class="mini-tree" aria-hidden="true">${t.map(([a, b]) => `<line x1="${pos[a][0]}" y1="${pos[a][1]}" x2="${pos[b][0]}" y2="${pos[b][1]}"/>`).join('')}${ids.map(v => `<circle cx="${pos[v][0]}" cy="${pos[v][1]}" r="10" class="${v === '1' ? 'one' : ''}"/><text x="${pos[v][0]}" y="${pos[v][1] + 4}">${v}</text>`).join('')}</svg>`;
    host.innerHTML = `<div class="ex"><p class="ex-title">Try it: the ${trees.length} spanning trees on {1, 2, 3, 4, 5}</p>
      <p class="ex-hint">Every spanning tree of the complete graph on 5 vertices, computed. Under each tree is its word (Prüfer code, added: not taught in the course).</p>
      <div class="ex-controls" data-c></div>
      <div class="tree-grid">${trees.map(t => `<figure class="tree-cell${leaf1(t) ? ' leaf1' : ''}">${mini(t)}<figcaption>${L.pruferCode(ids, t)}</figcaption></figure>`).join('')}</div>
      <div class="ex-msg" aria-live="polite"></div></div>`;
    const c = host.querySelector('[data-c]'), grid = host.querySelector('.tree-grid'), msg = host.querySelector('.ex-msg');
    let stop = () => {};
    const k = trees.filter(leaf1).length;
    c.append(segOf(['All trees', 'Vertex 1 is a leaf'], x => {
      stop();
      grid.classList.toggle('filtered', x === 1);
      if (x === 1) {
        const cells = [...grid.querySelectorAll('.leaf1')];
        stop = seq(cells.slice(0, 40).map(cell => () => pop(cell)), 25);
        const no1 = trees.filter(leaf1).every(t => !L.pruferCode(ids, t).includes('1'));
        say(msg, `${k} of the ${trees.length} trees have vertex 1 as a leaf, and 4³ = ${4 ** 3}. ${no1 ? 'Their words never contain 1: they are exactly the words of length 3 over {2, 3, 4, 5}, a 4-letter alphabet, like Σ = {1, 2, 3, 4}.' : ''}`, k === 4 ** 3 ? 'ok' : 'fail');
      } else say(msg, `All ${trees.length} = 5³ spanning trees, one per word of length 3 over {1, …, 5}. Filter the ones where vertex 1 is a leaf.`);
    }, 'Which trees'));
    say(msg, `All ${trees.length} = 5³ spanning trees, one per word of length 3 over {1, …, 5}. Filter the ones where vertex 1 is a leaf.`);
  }
  const whichTreeEx1 = host => whichTree(host, 'ex1');
  const whichTreeEx7 = host => whichTree(host, 'ex7');

  return { order, byHand, handshake, represent, twoColor, components, eulerClassify, eulerTrace, deBruijnTrace, deBruijnBuild, eulerOrHamilton, gvMulti, graphs: G, treeQuestions,
    minimalTree, buildSpanning, dfsByHand, identifyTrees, findRoots, countSpanning, whichTreeEx1, whichTreeEx7, childrenOfV, completeGraph, backEdges, cutVertex,
    bfsByHand, labelDistances, weightedPath, relaxTool, evenPaths,
    spByHand, shiftFix, bfOrder, spClaims,
    bfTable, spEdgeCount, fwByHand, fwClaims, taxPath, fwWeights,
    graphFigure, dfsBfsLabels, eulerHam, treeOrigin, edgeBudget, deBruijnCount, treeCount };
})();
