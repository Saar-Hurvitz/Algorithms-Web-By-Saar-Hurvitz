# Algorithm animations: how to build one

Every algorithm on the site uses the same three pieces. A new animation normally needs only a new generator file.

| Piece | File | Knows about |
|---|---|---|
| Frame generator | `js/algorithms/<name>.js` | the algorithm only, no DOM |
| Player | `js/player.js` | play, pause, step, scrub, speed, keyboard |
| View | `js/algo-view.js` | drawing a frame: code, graph, D[], lists, Q/S, output |

## 1. Copy the pseudo-code exactly
Use the slide's code line for line in a `code` array: `{ n, text }`. If the slides have no code for a step, add the step's wording from the slide that describes it and say so in the entry. Don't reword lines.

Group the lines in `sections`: `{ id, title, slide, from, to }`. Each section gets a heading, a slide button and a jump button.

## 2. Write the generator
Run the real algorithm and call `snap(line, message, extra)` once **each time a line executes**:
- Loops: one frame per condition check, including the final check that exits, for `while` loops.
- `endwhile` / `endfor` are block markers and get no frame.
- Finish with a frame carrying `result: { ok, order }`: on the code's last line if it has one, otherwise with `line: null`.

The tracer in `toposort.js` (`makeTracer`) holds the state and copies it into each frame. Because frames are computed ahead of time, stepping back is exact and no undo logic exists.

### Frame format
| Field | Meaning |
|---|---|
| `line` | code line being executed, or `null` for a closing frame with no line of its own |
| `msg` | one plain sentence on what this line just did; may use `[[term\|text]]` |
| `counts` | `{ line: timesExecuted }` so far |
| `D`, `Q`, `out`, `holding` | the array, the queue/stack, the output, the vertex just taken out |
| `ptr` | `{ owner, idx, name }`: the list cell a pointer is on (`idx` = list length means null) |
| `gone` | ids of deleted edges, written `"A>B"` |
| `cur`, `target` | vertex being processed, vertex at the other end of the edge |
| `activeEdge`, `changed`, `enq` | edge in focus, index of the D[] cell that changed, vertex just inserted |
| `vars` | short strings shown as variable chips, e.g. `"x = 3"` |

Optional: `ready` (highlighted vertices when there is no queue); `nodeStates` / `edgeStates` (override a vertex's or edge's look, e.g. `'c1'` for a vertex whose d is final); `tokenText` (`{ index: text }`, a Q/Output token's text that can change from frame to frame, as Dijkstra's `c · 5`). In the config, `panels: { arrays, strips, queue }` hides panels and `switches` adds option buttons; their values reach `build` as a third argument.

`[[term]]` links render as hover links once the term exists, and as plain text before that.

## 3. Export a config
```js
Algorithms.myAlgo = { presets, build(presetId, modeId), defaultPreset, modes: [{ id, label }] };
```
`build` returns `{ frames, code, sections, ids, adj, words }`, plus optionally `names` (shown names for the D[] rows, e.g. s⁰ for s0), `sideCol` + `arrNames` (a v.π column instead of the lists), `qName` / `holderName` / `outName` and `panels`. A preset is `{ title, width, height, nodes: [[id, x, y]], adj: { id: [neighbor ids, in the slide's list order] } }`. Weighted presets add `weights: { 'u>v': w }`, and may add `labels: { id: shown }` and `bends: { 'u>v': curve }` (negative = above a left-to-right edge) to draw an edge curved as on the slide. The week 5 generators (`js/algorithms/sssp.js`) build their presets from `Exercises.graphs`, so `weights`, `labels` and `bends` live there. List order matters because it decides the output.

## 4. Mount it in an entry (`js/weeks/weekN/`)
```js
{ id: 'my-algo', title: '…', algo: true, slides: […],
  html: String.raw`… <div class="algo-mount" data-algo></div> …`,
  init(root) { AlgoView.mount(root.querySelector('[data-algo]'), Algorithms.myAlgo); } }
```
`algo: true` gives the entry the full-width layout and an "Algorithm" badge in the sidebar. Add the script to `index.html` after the other `js/algorithms/` scripts.

## 5. Verify against the slides
Generators have no DOM, so test them in Node: add the expected answers to `tools/checks/weekN.js` and run `node tools/check-answers.js`. Check every output the slides state before looking at the visuals (for topo-sort: 1,6,2,3,4,5 and 1,2,3,4,5,6 on slides 76 and 80; S,A,B,C,D,E,F and S,B,D,A,C,F,E on slide 33; a cyclic graph must report failure). Then step forward and backward through a run in the browser and confirm the page matches at every frame.

## How the smooth motion works
- **Code highlight:** one bar behind the lines moves with a CSS transform.
- **Graph, D[], lists:** state classes and `data-state` with CSS transitions.
- **Vertices in Q / holder / Output:** one element per vertex moved between containers and animated from its old position (FLIP, in `placeTokens`). A newly ready vertex flies out of its D[] cell, as drawn on slide 76.
- `prefers-reduced-motion` turns the motion off.
