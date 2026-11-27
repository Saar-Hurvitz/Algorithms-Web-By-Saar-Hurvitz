/* ==========================================================================
   Past exam: midterm, 1.12.2004 (Exams/MidTermExams/mid04sol.pdf).
   Data only: js/exam.js turns it into the page. The stems, options and the
   official solutions (blue in the PDF; the underlined option is the answer) are
   copied word for word. `explain` and `notes` are the site's, tagged {{added}}.
   Every answer is checked against what its visualization computes:
   tools/checks/exam-mid04.js.
   ========================================================================== */
(function () {
  const A = window.Algorithms, P = A.ssspPreset;
  const G = window.Exercises.graphs;

  /* Animation presets for this exam only, so the weekly pages never list them */
  A.bellmanFord.presets.x04a = Object.assign(P('2004E1a'), { watch: 'v' });
  A.bellmanFord.presets.x04b = Object.assign(P('2004E1b'), { watch: 'v' });
  A.dijkstra.presets.x04c = Object.assign(P('2004E3a'), { watch: 'v' });
  A.dijkstra.presets.x04d = Object.assign(P('2004E3b'), { watch: 'v' });
  const g4 = G['2004E4'];
  /* The exam gives no adjacency lists: A lists C before B (added), so the stack pops B first */
  A.toposort.presets.x04 = { title: 'The exam\'s graph (page 2)', width: 500, height: 290, nodes: g4.nodes, adj: { A: ['C', 'B'], B: ['D'], C: [], D: [] } };

  window.EXAM = {
    id: 'mid04',
    pdf: 'Exams/MidTermExams/mid04sol.pdf',
    title: 'בוחן אמצע סמסטר, 1.12.2004',
    deck: '2004E',
    deckInfo: { name: 'בוחן 2004', kind: 'בוחן', unit: 'עמוד', of: 'מתוך', count: 4, path: '../../assets/exams/mid04/P-', wide: false },
    parts: [
      { id: 'A', kind: 'mc', title: 'חלק א\'', sub: '56 = 7·(4+4) נקודות: בחירת תשובה ונימוק',
        note: 'עבור כל אחת מהשאלות הבאות הקף את העיגול המתאים לתשובה הנכונה ונמק בקצרה במקום המוקצה לכך בלבד. בכל שאלה יינתנו 4 נקודות עבור בחירת התשובה הנכונה ו-4 נקודות עבור הנימוק.' },
      { id: 'B', kind: 'tf', title: 'חלק ב\'', sub: '48 = 6·(4+4) נקודות: נכון או לא נכון',
        note: 'לכל אחת מהטענות הבאות הקף נכון או לא נכון ונמק בקצרה (במקום המוקצה לכך בלבד). בכל שאלה יינתנו 4 נקודות עבור אבחנה נכונה ו-4 נקודות עבור הנימוק.' },
    ],
    questions: [
      /* ---------------- Part A ---------------- */
      { id: 'x04-a1', part: 'A', title: 'סימון סופי ב-sweep השני של Bellman-Ford', page: '2004E1',
        stem: String.raw`מריצים את אלגוריתם [[bellman-ford|Bellman-Ford]] על גרף מכוון קשיר עם משקלים כלשהם על הקשתות (אבל חסר [[negative-cycle|מעגלים שליליים]]), מצומת מקור $s$. הצומת $v$ מקבל את סימונו הסופי במהלך ה-[[sweep]] השני.`,
        options: [
          String.raw`מספר הקשתות במק"ב מ-$s$ ל-$v$ שמוצא האלגוריתם הוא לכל היותר 2 (יתכן שבדיוק 2, ויתכן שפחות)`,
          String.raw`מספר הקשתות במק"ב מ-$s$ ל-$v$ שמוצא האלגוריתם הוא לפחות 2 (יתכן שבדיוק 2, ויתכן שיותר)`,
          String.raw`לא ניתן להסיק האם אחת מהטענות לעיל נכונה`,
        ],
        answer: 1,
        solution: String.raw`אם המק"ב מורכב מקשת אחת אז הסימון הסופי היה מתקבל בsweep הראשון.`,
        explain: String.raw`<p>בהנפשה, סדר הקשתות בכל sweep הוא הסדר שברשימה. בדוגמה הראשונה המק"ב $s - a - v$ הוא בן 2 קשתות ו-$v$ מקבל את סימונו הסופי ב-sweep השני. בדוגמה השנייה המק"ב $s - a - b - v$ הוא בן ==3 קשתות==, ובכל זאת $v$ מקבל את סימונו הסופי כבר ב-sweep השני, כי $a$ ו-$b$ מסומנים סופית כבר ב-sweep הראשון. לכן "לכל היותר 2" אינו נכון. המונה "v.d went down" מראה מתי $v.d$ ירד בפעם האחרונה. {{added}}</p>`,
        viz: '<div class="algo-mount" data-lazy-algo="bellmanFord" data-presets="x04a,x04b" data-preset="x04a" data-modes="full"></div>',
        taught: ['w5-bf'] },

      { id: 'x04-a2', part: 'A', title: 'אחרי DFS: האם ב-BFS יתכן ש-label(v) = label(u)?', page: '2004E1',
        stem: String.raw`$G$ גרף לא מכוון. מבצעים [[dfs|DFS]] מצומת $s$. במהלך הריצה הצומת $v$ מסמן את הצומת $u$. כלומר, $v$ מסומן תחילה והקשת $(v,u)$ משתתפת ב[[spanning-tree|עץ הפורש]] המתקבל.`,
        options: [
          String.raw`אם נבצע BFS(s) על הגרף אז label(v) תמיד קטן מ-label(u).`,
          String.raw`אם נבצע BFS(s) על הגרף אז label(v) תמיד גדול מ-label(u).`,
          String.raw`אם נבצע BFS(s) על הגרף אז יתכן ש-label(v) יהיה זהה ל-label(u).`,
        ],
        answer: 2,
        solution: String.raw`במעגל בגודל 3 (משולש) שצמתיו $s,v,u$ נקבל ש-$u$ ו-$v$ שניהם מסומנים 1`,
        explain: String.raw`<p>במשולש, $u$ ו-$v$ שניהם שכנים של $s$, ולכן [[bfs|BFS]](s) שם את שניהם בשכבה 1, בלי קשר לסדר שבו DFS סימן אותם. דוגמה אחת שבה התוויות שוות מפריכה את שתי האפשרויות של "תמיד". {{added}}</p>`,
        viz: '<div class="ex-mount" data-lazy-ex="dfsBfsLabels"></div>',
        taught: ['w3-dfs', 'w4-bfs-shortest'] },

      { id: 'x04-a3', part: 'A', title: 'ב-Dijkstra, הערך v.d ירד 4 פעמים', page: '2004E2',
        stem: String.raw`$G$ גרף מכוון עם משקלים חיוביים על הקשתות. מריצים את האלגוריתם של [[dijkstra|דייקסטרא]] למציאת מרחקים קצרים ביותר מצומת מקור $s$. במהלך הריצה, הערך של $v.d$ עבור צומת $v$ מסוים ירד 4 פעמים.`,
        options: [
          String.raw`לצומת $v$ יש דרגה לכל היותר 4.`,
          String.raw`לצומת $v$ יש דרגה לפחות 4.`,
          String.raw`לא ניתן להסיק האם אחת מהטענות לעיל נכונה`,
        ],
        answer: 1,
        solution: String.raw`ערך $v.d$ יורד כתוצאה מפעולת $relax(u,v)$. לכל קשת מבצעים relax פעם אחת בדיוק וכל צומת $u$ שמבצע relax יוצא מהתור ולא יבצע עדכונים נוספים, לכן לפחות 4 צמתים שונים שהם שכנים של $v$ ביצעו $relax(u,v)$.`,
        notes: String.raw`<aside class="callout caution"><span class="callout-title">⚠️ "דרגה" כאן היא דרגת הכניסה</span><p>רק קשת $(u,v)$ שנכנסת ל-$v$ יכולה להוריד את $v.d$, ולכן מה שנובע הוא ש[[in-degree|דרגת הכניסה]] של $v$ היא לפחות 4 (ומכאן גם הדרגה). {{added}}</p></aside>`,
        explain: String.raw`<p>בדוגמה הראשונה ל-$v$ יש בדיוק 4 קשתות נכנסות, וכל אחת מורידה את $v.d$: $\infty \to 11 \to 10 \to 9 \to 8$. בדוגמה השנייה יש ל-$v$ ==5 קשתות נכנסות== ו-$v.d$ עדיין יורד רק 4 פעמים (הקשת $(e,v)$ לא משפרת), ולכן "לכל היותר 4" אינו נכון. המונה "v.d went down" סופר את הירידות. {{added}}</p>`,
        viz: '<div class="algo-mount" data-lazy-algo="dijkstra" data-presets="x04c,x04d" data-preset="x04c" data-modes="pq"></div>',
        taught: ['w5-dijkstra'] },

      { id: 'x04-a4', part: 'A', title: 'הסדרה ABDC: מיון טופולוגי בתור או במחסנית?', page: '2004E2',
        stem: String.raw`עבור הגרף המכוון שבציור והסדרה (משמאל לימין) $ABDC$
<div class="ex-mount" data-ex="graphFigure" data-graph="2004E4"></div>`,
        options: [
          String.raw`הסדרה אינה מתארת [[topo-sort|מיון טופולוגי]] של הגרף.`,
          String.raw`הסדרה מתארת מיון טופולוגי שהתקבל על ידי מימוש האלגוריתם למיון טופולוגי בעזרת מחסנית.`,
          String.raw`הסדרה מתארת מיון טופולוגי שהתקבל על ידי מימוש האלגוריתם למיון טופולוגי בעזרת תור.`,
        ],
        answer: 1,
        solution: String.raw`זהו מיון טופולוגי על פי ההגדרה. המימוש הוא עם מחסנית מכיוון ש-$D$ לפני $C$ במיון למרות ש-$C$ קרוב יותר ל-$A$ והפך לצומת בעל דרגת כניסה 0 לפני $D$.`,
        explain: String.raw`<p>כש-$A$ יוצא, גם $B$ וגם $C$ מקבלים דרגת כניסה 0 ונכנסים למבנה. $D$ נכנס רק אחרי ש-$B$ יוצא. ==בתור== $C$ נכנס לפני $D$ ולכן גם יוצא לפניו: תור אף פעם לא ייתן $ABDC$. ==במחסנית== $B$ נשלף ראשון אם נדחף אחרי $C$, ו-$D$, שנדחף אחריו, נשלף לפני $C$. בהנפשה רשימת השכנים של $A$ היא $C, B$ (תוספת: המבחן לא נותן רשימות). החליפו ל-"Queue" כדי לראות את הסדר $ACBD$, או הפכו את הרשימות. {{added}}</p>`,
        viz: '<div class="algo-mount" data-lazy-algo="toposort" data-presets="x04" data-preset="x04" data-mode="stack"></div>',
        taught: ['toposort-queue', 'topo-stack', 'r-queue-stack'] },

      { id: 'x04-a5', part: 'A', title: 'ב-Floyd-Warshall, δ(i,j) לא משתנה מהאיטרציה החמישית', page: '2004E2',
        stem: String.raw`נתון גרף $G$ עם משקלים כלשהם על הקשתות (אבל חסר מעגלים שליליים). במהלך הרצת אלגוריתם [[floyd-warshall|Floyd-Warshall]] למציאת משקל המסלולים הקצרים ביותר בין כל זוג צמתים, קיים זוג צמתים $i,j$ עבורם הערך של $\delta(i,j)$ לא משתנה מאז האיטרציה החמישית (בעת חישוב [[delta-k|$\delta^5(i,j)$]]) ועד סיום הריצה.`,
        options: [
          String.raw`כל מק"ב בין $i$ ל-$j$ עובר רק בצמתים מתוך קבוצת הצמתים $i,j,1,2,3,4,5$`,
          String.raw`קיימים לפחות חמישה מק"בים שונים בין $i$ ל-$j$.`,
          String.raw`קיים מק"ב בין $i$ ל-$j$ שעובר רק בצמתים מתוך קבוצת הצמתים $i,j,1,2,3,4,5$`,
        ],
        answer: 2,
        solution: String.raw`קיים מק"ב כזה על-פי הגדרת $\delta^5(i,j)$. יתכן שקיימים מק"בים נוספים העוברים גם בצמתים $6,\dots,n$ אבל מכיוון שערך $\delta$ מתעדכן רק כשיורד, הם לא ישפיעו על ערך $\delta(i,j)$`,
        explain: String.raw`<p>זו כמעט אותה שאלה כמו <a href="#e-w6-r-ex2">תרגול 6, תרגיל 2</a>. בהנפשה כל אפשרות נבדקת על גרף לדוגמה: שני מק"בים באורך 2, אחד דרך הצומת 5 ואחד דרך הצומת 6. {{added}}</p>`,
        viz: '<div class="ex-mount" data-lazy-ex="fwClaims" data-set="2004E5"></div>',
        taught: ['w6-delta', 'w6-fw', 'w6-r-ex2'] },

      { id: 'x04-a6', part: 'A', title: 'מעגל אוילר שהוא גם מעגל המילטוני', page: '2004E3',
        stem: String.raw`ידוע שבגרף לא מכוון $G$ יש [[euler-cycle|מעגל אוילר]] ושמעגל זה הוא גם [[hamiltonian-cycle|מעגל המילטוני]].`,
        options: [
          String.raw`$G$ חייב להיות גרף מלא (שיש בו קשת בין כל זוג צמתים)`,
          String.raw`$G$ חייב להיות מעגל`,
          String.raw`יש אפשרויות רבות למבנה של $G$ שבהם שהתכונה לעיל מתקיימת.`,
        ],
        answer: 1,
        solution: String.raw`מעגל הוא הגרף היחיד שלכל הצמתים בו דרגה 2, וזו תכונה המתקיימת גם במעגל אוילר וגם במסלול אוילר.`,
        notes: String.raw`<aside class="callout caution"><span class="callout-title">⚠️ הנימוק הרשמי מבולבל</span><p>הוא מובא כפי שהוא, אבל "וזו תכונה המתקיימת גם במעגל אוילר וגם במסלול אוילר" אינו חלק מהטיעון, ו"הגרף היחיד שלכל הצמתים בו דרגה 2" נכון רק ל[[connected|גרף קשיר]] (שני משולשים זרים הם גרף שכל דרגותיו 2). הטיעון: מעגל אוילר עובר בכל קשת פעם אחת, ומעגל המילטוני עובר בכל צומת פעם אחת. אם זה אותו מעגל, יש בו בדיוק $n$ קשתות וכל צומת מופיע בו פעם אחת, כלומר ==דרגת כל צומת היא 2== והגרף קשיר: $G$ הוא מעגל. {{added}}</p></aside>`,
        explain: String.raw`<p>בהנפשה: ב-$K_5$ ובשני המשולשים יש מעגל אוילר, אבל הוא עובר בחלק מהצמתים יותר מפעם אחת, כי יש בהם יותר מ-$n$ קשתות. רק במעגל $C_5$ מעגל האוילר הוא גם המילטוני. {{added}}</p>`,
        viz: '<div class="ex-mount" data-lazy-ex="eulerHam"></div>',
        taught: ['w2-euler-def', 'w2-hamilton', 'w2-r-ex4'] },

      { id: 'x04-a7', part: 'A', title: 'האם העץ הפורש התקבל מ-DFS(s) או מ-BFS(s)?', page: '2004E3',
        stem: String.raw`בציור נתונים גרף לא מכוון ועץ פורש שלו
<div class="exam-figs"><div class="ex-mount" data-ex="graphFigure" data-graph="2004E7"></div><div class="ex-mount" data-ex="graphFigure" data-graph="2004E7" data-tree></div></div>`,
        options: [
          String.raw`עץ זה אינו יכול להתקבל על-ידי הרצת DFS(s) ולא על ידי הרצת BFS(s)`,
          String.raw`עץ זה יכול להתקבל על ידי הרצת DFS(s)`,
          String.raw`עץ זה יכול להתקבל על ידי הרצת BFS(s)`,
        ],
        answer: 0,
        solution: String.raw`לא BFS כי הצומת $C$ הוא במרחק 2 מ-$s$, לא DFS כי $A$ קשיר מ-$B$ לכן לא יתכן שהאלגוריתם נסוג ל-$S$ כדי לסמן את השני מבין $B,A$`,
        explain: String.raw`<p>==BFS:== בכל [[bfs-tree|עץ BFS]] עומק הצומת שווה ל[[distance|מרחק]] שלו מ-$s$. $C$ שכן של $A$ ו-$A$ שכן של $s$, לכן $C$ במרחק 2, ובעץ שבציור הוא בעומק 3 ($s - B - E - C$). ==DFS:== אחרי ש-DFS נכנס לאחד מ-$A, B$, אפשר להגיע ממנו לשני בלי לעבור דרך $s$ (למשל בקשת $A - B$), ולכן DFS מסמן את השני לפני שהוא חוזר ל-$s$. לכן ל-$s$ יש בעץ DFS בן אחד בלבד, ובעץ שבציור יש לו שניים. השמות $D$ ו-$E$ נוספו: המבחן מסמן רק את $s, A, B, C$. {{added}}</p>`,
        viz: '<div class="ex-mount" data-lazy-ex="treeOrigin"></div>',
        taught: ['w3-st', 'w4-bfs', 'w3-r-ex1'] },

      /* ---------------- Part B ---------------- */
      { id: 'x04-b1', part: 'B', title: 'עלה בעץ DFS הוא עלה בעץ BFS?', page: '2004E3',
        stem: String.raw`נתון גרף קשיר לא מכוון $G=(V,E)$. בוחרים צומת מסוים $s$, ומריצים BFS(s) ו-DFS(s) על הגרף $G$. $u$ הוא צומת כלשהו בגרף. אם $u$ [[leaf|עלה]] בעץ ה-DFS אז $u$ הוא ==בהכרח== עלה גם בעץ ה-BFS.`,
        answer: false,
        solution: String.raw`במעגל באורך 4, השכן של $S$ שלא מתחילים ממנו את ה-DFS יהיה עלה ב-DFS אך לא ב-BFS`,
        notes: String.raw`<aside class="callout caution"><span class="callout-title">⚠️ הדוגמה עובדת רק בסדר שכנים שונה בשתי הריצות</span><p>במעגל באורך 4, ה-DFS נכנס לשכן אחד של $S$ (נניח $a$) ומקיף את המעגל, ולכן השכן השני ($c$) הוא עלה. כדי ש-$c$ לא יהיה עלה ב-BFS, ה-BFS צריך להוציא את $c$ מהתור לפני $a$, כלומר לקרוא את השכנים של $S$ בסדר אחר. אם שתי הריצות משתמשות באותן רשימות שכנים, אין במעגל באורך 4 דוגמת נגד (נבדק על כל סדרי הרשימות). לכן <a href="#e-w6-r-ex4">תרגול 6, תרגיל 4</a> מוסיף לטענה "אותו מבנה נתונים בשתי הריצות" ומשתמש בגרף אחר. בהנפשה יש את שתי הדוגמאות. {{added}}</p></aside>`,
        viz: '<div class="ex-mount" data-lazy-ex="spClaims" data-graphs="2004E8,6R48"></div>',
        taught: ['w6-r-ex4', 'w3-dfs', 'w4-bfs'] },

      { id: 'x04-b2', part: 'B', title: 'עץ BFS יחיד ⇒ אין מעגלים?', page: '2004E4',
        stem: String.raw`נתון גרף לא מכוון $G=(V,E)$ וצומת $s \in V$. אם קיים [[bfs-tree|עץ BFS]] ==יחיד== ששורשו $s$, אז $G$ חסר [[cycle|מעגלים]].`,
        answer: false,
        solution: String.raw`למעגל בגודל 3 (משולש) שצמתיו יש עץ BFS יחיד.`,
        explain: String.raw`<p>במשולש $s, a, b$: $a$ ו-$b$ שניהם שכנים של $s$, ולכן BFS(s) בונה תמיד את אותו עץ ($s - a$, $s - b$), בכל סדר של רשימות השכנים, ובכל זאת יש בגרף מעגל. זו הטענה הראשונה של <a href="#e-w6-r-ex4">תרגול 6, תרגיל 4</a>. {{added}}</p>`,
        viz: '<div class="ex-mount" data-lazy-ex="spClaims" data-graphs="6R46"></div>',
        taught: ['w6-r-ex4', 'w4-bfs'] },

      { id: 'x04-b3', part: 'B', title: 'סכום הדרגות 2(n−5) ⇒ הגרף אינו קשיר', page: '2004E4',
        stem: String.raw`נתון גרף לא מכוון $G=(V,E)$. אין בגרף [[parallel-edges|קשתות מקבילות]] (בעלות אותם צמתי-קצה). נתון ש-$\sum_v deg(v) = 2(n-5)$ ($n$ הוא מספר הצמתים בגרף ונתון ש-$n>5$). הגרף $G$ אינו [[connected|קשיר]].`,
        answer: true,
        solution: String.raw`ידוע ש-$\sum_v deg(v)=2m$ לכן נתון $m=n-5$. בכל גרף קשיר יש לפחות $n-1$ קשתות.`,
        explain: String.raw`<p>הראשון הוא [[handshaking|משפט לחיצות הידיים]]. בהנפשה: כל קשת מחברת לכל היותר שני [[connected-component|רכיבי קשירות]] לאחד, ולכן בגרף עם $m$ קשתות יש לפחות $n - m$ רכיבים. כאן $n - m = 5$. {{added}}</p>`,
        viz: '<div class="ex-mount" data-lazy-ex="edgeBudget"></div>',
        taught: ['handshaking', 'w3-tree-equiv'] },

      { id: 'x04-b4', part: 'B', title: 'בסדרת דה-ברוין בינארית יש אותו מספר אפסים ואחדים', page: '2004E4',
        stem: String.raw`בכל [[de-bruijn-sequence|סדרת דה-ברוין]] מעל א"ב $\Sigma=\{0,1\}$, יש מספר זהה של אפסים ואחדים.`,
        answer: true,
        solution: String.raw`מספר המילים המתחילות ב-0 שווה למספר המילים המתחילות ב-1 $= 2^{n-1}$ (שתיים בחזקת אן מינוס 1). מכיוון שכל מילה מקודדת בדיוק פעם אחת בסדרה, כך שיש תו אחד בסדרה שמכיל את הביט הראשון במילה, אז בהכרח מס' האפסים שווה למספר האחדים בסדרה.`,
        explain: String.raw`<p>בהנפשה הסדרה נבנית ממעגל אוילר של [[de-bruijn-graph|גרף דה-ברוין]] $G_{2,n}$. ריחוף מעל אות מראה את המילה (באורך $n$, קריאה מעגלית) שהיא האות הראשונה שלה. {{added}}</p>`,
        viz: '<div class="ex-mount" data-lazy-ex="deBruijnCount"></div>',
        taught: ['w2-de-bruijn-seq', 'w2-de-bruijn-iff'] },

      { id: 'x04-b5', part: 'B', title: 'מסלולים קצרים בגרף חסר מעגלים: relax על כל קשת פעם אחת', page: '2004E4',
        stem: String.raw`בהרצת [[dag-sp|האלגוריתם למסלולים קצרים עבור גרפים חסרי מעגלים]] לא יתכן שמבצעים $relax(u,v)$ עבור קשת $(u,v)$ מסוימת יותר מפעם אחת.`,
        answer: true,
        solution: String.raw`אחרי שמבצעים $relax(u,v)$ הצומת $u$ לא משתתף יותר.`,
        explain: String.raw`<p>האלגוריתם עובר על כל צומת $u$ פעם אחת, לפי המיון הטופולוגי, ומבצע [[relax]] רק על הקשתות היוצאות ממנו. בהנפשה, המונה של השורה "relax(u,v)" מגיע בסוף בדיוק למספר הקשתות, פעם אחת לכל קשת. {{added}}</p>`,
        viz: '<div class="algo-mount" data-lazy-algo="dagSP" data-presets="g11" data-preset="g11"></div>',
        taught: ['w5-dag'] },

      { id: 'x04-b6', part: 'B', title: 'עצים פורשים על {1,…,5} שבהם 1 הוא עלה', page: '2004E4',
        stem: String.raw`מספר [[spanning-tree|העצים הפורשים]] מעל 5 הצמתים $\{1,2,3,4,5\}$ שבהם הצומת 1 הוא [[leaf|עלה]], שווה למספר המילים באורך 3 מעל הא"ב $\Sigma=\{1,2,3,4\}$.`,
        answer: true,
        solution: String.raw`המילים המתאימות לעצים בהם הצומת 1 הוא עלה מורכבות רק מהאותיות $\{2,3,4,5\}$ וארכן הוא 3. מספר המילים האלו הוא $4^3$ - כמספר המילים באורך 3 מעל הא"ב $\Sigma=\{1,2,3,4\}$.`,
        notes: String.raw`<aside class="callout caution"><span class="callout-title">⚠️ ההתאמה בין עצים למילים לא נלמדה בשבועות 1 עד 6</span><p>הפתרון משתמש בהתאמה בין העצים הפורשים על $\{1,\dots,n\}$ למילים באורך $n-2$ (קוד Prüfer). היא לא מופיעה בהרצאות ובתרגולים שעל האתר. ההנפשה סופרת את העצים ישירות, בלי ההתאמה: 125 עצים, ומתוכם 64 שבהם 1 עלה. {{added}}</p></aside>`,
        viz: '<div class="ex-mount" data-lazy-ex="treeCount"></div>',
        taught: ['w3-r-count', 'w3-spanning'] },
    ],
  };
})();
