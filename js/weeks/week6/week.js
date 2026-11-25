/* Week 6: this file sets the order of the week. The entries live in part-a.js
   and part-b.js. The writing syntax is documented at the top of js/course.js. */

addWeek({
  n: 6,
  title: 'Negative Cycles, Floyd-Warshall, Graph Copies',
  checklistNote: 'No checklist yet; connect it with /connect-checklist 6. Slides 6L1, 6L34–6L36 and 6R1 (titles, "Quiz Time", the quiz and midterm dates) have no content. 6L14–6L16, 6L37, 6L39 and 6L49 repeat 6L17–6L19, 6L38, 6L40 and 6L48 in Hebrew. 6L6–6L8 repeat 5L43–5L45. The table of 6L10 is empty on the slide: its run is computed. The graphs with a negative cycle, and the n = 5 and n = 11 examples of Exercises 1 and 2, are added.',

  decks: {
    '6L': { name: 'Lecture 6', kind: 'Lecture', count: 54, path: 'assets/slides/week6/lecture/L-', wide: false },
    '6R': { name: 'Recitation 6', kind: 'Recitation', count: 50, path: 'assets/slides/week6/recitation/R-', wide: true },
  },

  checklist: {},

  terms: window.TERMS_W6,

  parts: [
    {
      id: 'A', title: 'Part A: Lecture 6', sub: 'In the order of the lecture slides',
      entries: [
        E.w6Review, E.w6ShiftRecap, E.w6BFReview, E.w6BFTable, E.w6NegDetect, E.w6NegProof, E.w6Apsp, E.w6Delta,
        E.w6FW, E.w6FWHand, E.w6FWProof, E.w6Summary, E.w6Techniques, E.w6Gas, E.w6Copies, E.w6Pizza,
      ],
    },
    {
      id: 'B', title: 'Part B: Recitation 6', sub: 'In the order of the recitation slides',
      entries: [E.w6RBF, E.w6REdges, E.w6RBFRun, E.w6REx1, E.w6RFW, E.w6REx2, E.w6REx3, E.w6REx4, E.w6REx5],
    },
  ],
});
