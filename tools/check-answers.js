// Checks every computed answer against what the slides state.
// Each week's expected answers live in tools/checks/weekN.js.
global.window = global;
const fs = require('fs'), path = require('path');
const d = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, '..');
global.GraphView = { autoBend: e => e, create: () => ({}) };
global.Algorithms = {};
// The same logic files, in the same order, as the page
const scripts = [...fs.readFileSync(d + '/index.html', 'utf8').matchAll(/<script src="(js\/[^"]+)"/g)].map(m => m[1]);
for (const f of scripts) if (/^js\/(graph-logic\.js|exercises\.js|algorithms\/)/.test(f)) require(d + '/' + f);

let bad = 0;
const eq = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) bad++;
  console.log(ok ? 'ok  ' : 'FAIL', name, ok ? '' : 'got ' + JSON.stringify(got) + ' want ' + JSON.stringify(want));
};
const checksDir = path.join(d, 'tools/checks');
const weekNum = f => parseInt(f.match(/\d+/)[0], 10);
for (const f of fs.readdirSync(checksDir).filter(x => /^week\d+\.js$/.test(x)).sort((a, b) => weekNum(a) - weekNum(b))) {
  console.log(`\n# Week ${weekNum(f)}`);
  require(path.join(checksDir, f))({ eq, L: GraphLogic, G: Exercises.graphs, A: Algorithms });
}
console.log(bad ? `\n${bad} FAILED` : '\nall passed');
process.exit(bad ? 1 : 0);
