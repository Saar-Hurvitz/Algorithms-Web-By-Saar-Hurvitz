/* Week 5: this file sets the order of the week. The entries live in part-a.js
   and part-b.js. The writing syntax is documented at the top of js/course.js. */

addWeek({
  n: 5,
  title: 'Shortest Paths: DAGs, Dijkstra, Bellman-Ford',
  checklistNote: 'Outside the checklist: the negative-weights discussion of the lecture (5L43–5L45) and Exercises 1–4 of the recitation (5R7–5R11, 5R14–5R21). Slides 5L1 and 5R1 (titles) and 5L21 ("Quiz Time") have no content. 5L31–5L34 and 5L50 repeat the proofs of Dijkstra and Bellman-Ford in Hebrew. The run of 5L48 is not on the slides: it is computed.',

  decks: {
    '5L': { name: 'Lecture 5', kind: 'Lecture', count: 52, path: 'assets/slides/week5/lecture/L-', wide: false },
    '5R': { name: 'Recitation 5', kind: 'Recitation', count: 21, path: 'assets/slides/week5/recitation/R-', wide: true },
  },

  checklist: {
    w5c1: 'I know how a single-source shortest path problem is defined: a simple directed graph, a single source vertex s∈V, a weight function w:E→R.',
    w5c2: 'I know that d(s,v) denotes the length of a shortest path from s to v.',
    w5c3: 'I know that the algorithm keeps for every node v the value v.d, which stores the length of the shortest path detected so far.',
    w5c4: 'I know how to use the v.π fields to retrieve the shortest paths when the algorithm completes.',
    w5c5: 'I understand why we expect v.d to reduce from ∞ to d(s,v).',
    w5c6: 'I know what is performed in a single relax(u,v) operation.',
    w5c7: 'I know the algorithm for DAG. It proceeds in iterations, where in every iteration, the next node in the topological sort is considered.',
    w5c8: 'I understand why in this algorithm, for every path in the graph, p=e₁e₂…eₖ, the edges of p are relaxed in their order in p.',
    w5c9: 'I understand why this property implies the correctness of the algorithm.',
    w5c10: 'I can implement this algorithm in time O(n+m).',
    w5c11: 'I know how Dijkstra\'s algorithm work. It proceeds in iterations, where in every iteration, a node having minimal v.d value is considered.',
    w5c12: 'I see that the two algorithms have a lot in common: every node is considered once, when v is considered, the algorithm performs relax of all edges outgoing from v. Therefore, in both algorithms there are exactly m relax operations.',
    w5c13: 'I really understand the correctness proof of Dijkstra.',
    w5c14: 'I know that there are several ways to implement Dijkstra\'s algorithm, depending on the data structure used, the time complexity is O((m+n)logn) or O(n²) or O(m + n log n). I think it\'s a nice demonstration of how one algorithm can be implemented in several ways.',
    w5c15: 'I know how Bellman-Ford algorithm works, and I understand why the order the edges are considered influences the number of sweeps required.',
    w5c16: 'I understand why a shortest path that consists of k edges will be detected after at most k sweeps.',
    w5c17: 'I understand why n-1 sweeps are sufficient if there are no negative cycles.',
  },

  terms: window.TERMS_W5,

  parts: [
    {
      id: 'A', title: 'Part A: Lecture 5', sub: 'In the order of the lecture slides',
      entries: [
        E.w5Review, E.w5Classes, E.w5Dag, E.w5DagProof, E.w5DagTime, E.w5Dijkstra, E.w5SPHand, E.w5DijkstraProof,
        E.w5DijkstraTime, E.w5Negative, E.w5ShiftEx, E.w5BF, E.w5BFOrder, E.w5BFProof, E.w5BFTime,
      ],
    },
    {
      id: 'B', title: 'Part B: Recitation 5', sub: 'In the order of the recitation slides',
      entries: [E.w5RSummary, E.w5RInit, E.w5REx1, E.w5REx2, E.w5RDagDij, E.w5REx3, E.w5REx4],
    },
  ],
});
