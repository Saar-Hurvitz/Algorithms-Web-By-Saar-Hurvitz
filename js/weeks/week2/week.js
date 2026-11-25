/* Week 2: this file sets the order of the week. The entries live in part-a.js
   and part-b.js. The writing syntax is documented at the top of js/course.js. */

addWeek({
  n: 2,
  title: 'Paths & Cycles',
  checklistNote: 'The checklist\'s last line (signing up for the Piazza forum) is not a course definition, so it has no entry. Slides 2L2–2L4 review Lecture 1 and are covered in Week 1; 2L1, 2L5, 2L6 and 2R1–2R3 are titles, a quiz and the agenda.',

  decks: {
    '2L': { name: 'Lecture 2', kind: 'Lecture', count: 42, path: 'assets/slides/week2/lecture/L-', wide: false },
    '2R': { name: 'Recitation 2', kind: 'Recitation', count: 40, path: 'assets/slides/week2/recitation/R-', wide: true },
  },

  checklist: {
    w2c1: 'I know the definitions of a simple path and a simple cycle.',
    w2c2: 'Given a digraph, I know what its underlying undirected graph is.',
    w2c3: 'I know the definitions of an Euler path and an Euler cycle.',
    w2c4: 'I know the conditions for the existence of an Euler path and an Euler cycle in an undirected graph.',
    w2c5: 'I understand why, if some node has an odd degree, the graph cannot have an Euler cycle.',
    w2c6: 'Given an undirected connected graph in which every node has an even degree, I can find an Euler cycle in the graph (I know the algorithm).',
    w2c7: "I understand why we don't need a different algorithm for finding an Euler path. If a graph has exactly two nodes of odd degree, I know how to use the Euler-cycle algorithm to find an Euler path.",
    w2c8: 'I understand how the data structure used affects the number of iterations in the algorithm and the Euler cycle produced (when it is not unique).',
    w2c9: 'I know the conditions for the existence of an Euler path and an Euler cycle in a digraph.',
    w2c10: 'I know what a De-Bruijn sequence is.',
    w2c11: 'Given two integers n and σ, I know how to construct the directed De-Bruin graph Gσ,n.',
    w2c12: 'I understand why Gσ,n has a directed Euler cycle.',
    w2c13: 'I understand why an Euler cycle in Gσ,n corresponds to a De-Bruijn sequence encoding words of length n over alphabet of size σ.',
    w2c14: 'I know the definition of a Hamilton path and a Hamilton cycle, and I understand how they differ from Euler paths and cycles.',
    w2c15: 'I know that we are not going to study an efficient algorithm for finding a Hamiltonian cycle, because no such algorithm is known.',
  },

  terms: window.TERMS_W2,

  parts: [
    {
      id: 'A', title: 'Part A: Lecture 2', sub: 'In the order of the lecture slides',
      entries: [
        E.w2PathWords, E.w2Simple, E.w2Bridges, E.w2EulerDef, E.w2CycleCond, E.w2PathCond, E.w2PathFromCycle, E.w2BridgesBack, E.w2Classify,
        E.w2Find, E.w2Linear, E.w2Structure, E.w2Trace, E.w2Underlying, E.w2Digraph,
        E.w2DeBruijnSeq, E.w2DeBruijnGraph, E.w2DeBruijnIff, E.w2DeBruijnEuler, E.w2DeBruijnBuild,
        E.w2Hamilton, E.w2EulerOrHam, E.w2Exhaustive, E.w2DiracOre, E.w2Tournament, E.w2TournamentPath,
      ],
    },
    {
      id: 'B', title: 'Part B: Recitation 2', sub: 'In the order of the recitation slides',
      entries: [E.w2REuler, E.w2RAlgo, E.w2RImpl, E.w2REx1, E.w2RTheorems, E.w2REx2, E.w2RDeBruijn, E.w2REx3, E.w2RHamilton, E.w2RGnHamilton, E.w2REx4],
    },
  ],
});
