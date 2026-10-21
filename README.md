# Is Your Number in Pi?

Type a phone number, a birthday or a word and see whether it appears in the digits of pi.

The page works out pi in your browser, up to the first 20 million digits, and searches them as you type. Everything runs on your device. Nothing you type is sent anywhere.

## How it answers

- **Found:** your digits appear in the digits the page has computed. It shows the decimal place and the surrounding digits in blocks of ten.
- **Almost certain / Probable / Possible / Unlikely:** your digits are not in the computed range, so the page estimates the chance that they appear somewhere in the 314 trillion digits computed so far (StorageReview, 2025). For an n-digit string the expected number of appearances is `314e12 / 10^n`, and the chance of at least one is `1 - exp(-expected)`.

That estimate assumes pi's digits behave like random digits. This is strongly suspected (pi is believed to be a normal number) but unproven. It is an estimate, not a lookup. The 314 trillion digits are not available to search from a web page.

An 11-digit string, such as a UK mobile number, should appear about 3,000 times in 314 trillion digits, so it will usually show as "Almost certain". It has only about a 0.02% chance of being inside the first 20 million.

## Words

Letters are converted to digits before searching. Choose the scheme with the selector under the search box:

| Scheme | Example: `HELLO` |
| --- | --- |
| A=1 … Z=26 | `85121215` |
| A=01 … Z=26 | `0805121215` |
| Phone keypad (ABC=2 … WXYZ=9) | `43556` |

Digits stay as they are. Spaces and punctuation are ignored, and accents are dropped.

## How pi is computed

`src/pi-engine.js` uses the Chudnovsky series with binary splitting and JavaScript `BigInt`, with an integer square root. A Web Worker computes 100,000, 1,000,000, 10,000,000 and 20,000,000 digits in turn, so you can search as soon as the first batch is ready. Each batch is computed from scratch.

Rough timings in Node 22: 1 million digits in about 3 seconds, 10 million in about 50 seconds, 20 million in about 100 seconds. Phones are slower. A "Stop" link ends the computing early.

## Run it

Open `index.html` in a browser. It has no dependencies, apart from the Google Fonts stylesheet.

```sh
node build.js   # rebuild index.html from src/
node test.js    # verify the engine, see timings
```

`test.js` checks the first 50 digits, compares 20,000 digits against an independent Machin-formula implementation, and checks known positions (six 9s at decimal place 762, the Feynman point).

## Files

- `index.html`: the built, self-contained page
- `src/template.html`: page markup, styles and UI script
- `src/pi-engine.js`: the digit engine
- `build.js`: wraps the template and inlines the engine
- `test.js`: engine tests

## Licence

MIT. See `LICENSE`.
