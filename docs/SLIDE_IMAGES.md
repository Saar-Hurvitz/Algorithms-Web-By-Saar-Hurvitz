# Slide images: how to extract and attach them

## Extract
Requires poppler (`brew install poppler`), which provides `pdftoppm` and `pdfinfo`. For week 2:

```sh
mkdir -p assets/slides/week2/lecture assets/slides/week2/recitation
pdftoppm -png -r 110 weeks/week2/Lecture2.pdf    assets/slides/week2/lecture/L
pdftoppm -png -r 110 weeks/week2/Recitation2.pdf assets/slides/week2/recitation/R
pdfinfo weeks/week2/Lecture2.pdf | grep Pages    # this is the deck's count
```

- 110 dpi keeps slides sharp in the full-size viewer and small on disk (about 100 KB each).
- `pdftoppm` zero-pads to the digits the page count needs, and the site expects exactly that, so `count` must be the real page count.
- Add each PDF as a deck in that week's `week.js` (`wide: true` for 16:9 slides):
  ```js
  decks: {
    '2L': { name: 'Lecture 2', kind: 'Lecture', count: 75, path: 'assets/slides/week2/lecture/L-', wide: false },
    '2R': { name: 'Recitation 2', kind: 'Recitation', count: 30, path: 'assets/slides/week2/recitation/R-', wide: true },
  }
  ```

## Slide references
A reference is the deck key plus the slide number. Week 1's keys are `L` and `R`, so `L41` is Lecture 1 slide 41. From week 2 on, the key starts with the week number, so `2L41` is week 2's lecture, slide 41. A week with a second lecture uses another capital letter, such as `2M`. The number is the PDF page number.

## Attach to an entry (`js/weeks/weekN/`)
1. List the slides where the concept appears in the entry's `slides` array, in slide order. They become the "From the slides" strip at the bottom of the entry and the chips under its title.
   ```js
   { id: 'w2-example', title: 'An example', slides: ['2L29', '2L30'], … }
   ```
2. To cite a slide inside the text, write `{{2L34}}`. It renders as a small button that opens that slide.

Always check the slide before citing it: read the PNG, or the PDF page, and confirm it shows what the text says.

## Viewer behavior
Clicking a thumbnail or slide button opens a modal `<dialog>`. Prev/next and the ←/→ keys move through the **whole deck**, so the neighboring slides are one key away. Esc or a click on the backdrop closes it.
