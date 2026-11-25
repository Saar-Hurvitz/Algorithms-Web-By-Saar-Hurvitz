/* Week 4: this file sets the order of the week. The entries live in part-a.js
   and part-b.js. The writing syntax is documented at the top of js/course.js. */

addWeek({
  n: 4,
  title: 'Breadth First Search & Shortest Paths',
  checklistNote: 'No slide states w4c3 (a stack gives a deep spanning tree, a queue a shallow one); the BFS card explains it, tagged as added. Exercise 2 of the recitation (the shortest even path, 4R72–4R79) is outside the checklist. Slides 4L1, 4L9 and 4L47 (title, "Quiz Time") have no content. 4L35–4L37 repeat the BFS proof in Hebrew.',

  decks: {
    '4L': { name: 'Lecture 4', kind: 'Lecture', count: 47, path: 'assets/slides/week4/lecture/L-', wide: false },
    '4R': { name: 'Recitation 4', kind: 'Recitation', count: 79, path: 'assets/slides/week4/recitation/R-', wide: true },
  },

  checklist: {
    w4c1: 'I understand how DFS and BFS are implemented in time O(m).',
    w4c2: 'I know how to run the BFS algorithm from a given root s∈V.',
    w4c3: 'I understand why the use of a stack (recursion in DFS) leads to a deep spanning tree, while the use of a queue (BFS) leads to a shallow spanning tree.',
    w4c4: 'I understand why if s-v₁-v₂-…..-vₖ-t is a shortest path from s to t then for every 1≤i≤k it holds that s-v₁-v₂-…..-vᵢ is a shortest path from s to vᵢ.',
    w4c5: 'I understand why the spanning tree produced in BFS contains, for every v∈V, a shortest path from s to v (proof by induction).',
    w4c6: 'I know how to run the DFS algorithm on a directed graph (as discussed in the recitation).',
    w4c7: 'I understand why in a directed graph, different DFS executions may produce different numbers of trees in the DFS forest.',
    w4c8: 'I know the definition of the single-source shortest path problem: a simple directed graph, a single source vertex s∈V, and a weight function w:E→R.',
    w4c9: 'I know that d(s,v) denotes the length of a shortest path from s to v. We call it the distance from s to v.',
    w4c10: 'I know that the algorithm keeps two values for every node v, and I know what they mean: (i) v.d – length of shortest path discovered so far, (ii) v.π - predecessor of v (parent) in the shortest path discovered so far.',
    w4c11: 'I know that a relax operation takes an edge as a parameter, and I know what is performed in a single relax(u,v) operation.',
    w4c12: 'Intuitively, I understand why performing many relax operations will eventually find shortest paths. I am wondering what the correct order is for performing these relax operations.',
  },

  terms: window.TERMS_W4,

  parts: [
    {
      id: 'A', title: 'Part A: Lecture 4', sub: 'In the order of the lecture slides',
      entries: [
        E.w4Review, E.w4BFS, E.w4BFSHand, E.w4BFSComplexity, E.w4Shortest, E.w4BFSShortest, E.w4LabelEx,
        E.w4BFSProof, E.w4BFSTree, E.w4Weighted, E.w4WeightedEx, E.w4DistFacts, E.w4General, E.w4Path,
      ],
    },
    {
      id: 'B', title: 'Part B: Recitation 4', sub: 'In the order of the recitation slides',
      entries: [E.w4RDFS, E.w4REx1, E.w4RBFS, E.w4REx2],
    },
  ],
});
