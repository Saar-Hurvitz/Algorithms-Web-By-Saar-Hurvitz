/* Week 3: this file sets the order of the week. The entries live in part-a.js
   and part-b.js. The writing syntax is documented at the top of js/course.js. */

addWeek({
  n: 3,
  title: 'Trees & Depth First Search',
  checklistNote: 'Slides 3L1 and 3L12 (title, "Quiz Time") have no content. Slides 3L25–3L27, 3L41–3L43, 3L46 and 3L47 are outside the checklist; they were added at the content review.',

  decks: {
    '3L': { name: 'Lecture 3', kind: 'Lecture', count: 74, path: 'assets/slides/week3/lecture/L-', wide: false },
    '3R': { name: 'Recitation 3', kind: 'Recitation', count: 45, path: 'assets/slides/week3/recitation/R-', wide: true },
  },

  checklist: {
    w3c1: 'I know the definitions of a Hamilton path and cycle, and it is clear to me why it is different from an Euler path and cycle.',
    w3c2: 'I know that polynomial time (O(np) for some constant p) is considered efficient, and that for some problems, no efficient algorithm is known.',
    w3c3: 'I wish I could develop an algorithm that detects in polynomial time whether a given graph has a Hamilton path. Currently, no one knows how to do this, nor has anyone proved that it is impossible.',
    w3c4: 'I am aware that there are several sufficient conditions for a graph to have a Hamilton path.',
    w3c5: 'In particular, I understand why every directed tournament graph has a Hamilton path. I read the proof by induction available on Moodle, and I was able to follow it.',
    w3c6: 'I know the definition of an undirected tree, and I know that every tree on n vertices has n-1 edges.',
    w3c7: "I understand why a tree is a 'minimaly connected' graph, and that this property can be described formally in several equivalent ways.",
    w3c8: 'I know what a root in a directed graph is, and I know the definition of a directed tree.',
    w3c9: 'I know what a spanning tree of an undirected graph is.',
    w3c10: 'I know how the DFS (Depth-First Search) algorithm proceeds.',
    w3c11: 'I understand why the set of edges collected in a DFS run forms a spanning tree.',
    w3c12: 'I understand why DFS takes O(|E|) time when implemented using adjacency lists.',
    w3c13: "I'm not afraid of recursions.",
  },

  terms: window.TERMS_W3,

  parts: [
    {
      id: 'A', title: 'Part A: Lecture 3', sub: 'In the order of the lecture slides',
      entries: [
        E.w3Review, E.w3Hamilton, E.w3Sufficient, E.w3Tournament,
        E.w3Tree, E.w3TreeEquiv, E.w3TreeProof, E.w3Minimal, E.w3DirectedTree, E.w3DirectedAlt, E.w3Broadcast,
        E.w3Spanning, E.w3BuildSpanning, E.w3DFS, E.w3DFSHand, E.w3ST, E.w3EdgeClass, E.w3Evaluate, E.w3Correct, E.w3DSChoice, E.w3Lists, E.w3Complexity,
      ],
    },
    {
      id: 'B', title: 'Part B: Recitation 3', sub: 'In the order of the recitation slides',
      entries: [
        E.w3RTrees, E.w3RIdentify, E.w3RRoots, E.w3RFindRoots, E.w3RLeaf, E.w3RDFS, E.w3RSpanning, E.w3RCount,
        E.w3REx1, E.w3REx2, E.w3REx3, E.w3REdges, E.w3REx6, E.w3REx7,
      ],
    },
  ],
});
