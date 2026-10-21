// Verifies the engine against an independent Machin-formula implementation,
// then times large runs and checks well-known positions.
const { piDecimals } = require("./src/pi-engine.js");

function machin(digits) {
  const D = digits + 15;
  const one = 10n ** BigInt(D);
  function arctanInv(x) {
    const x2 = BigInt(x) * BigInt(x);
    let term = one / BigInt(x);
    let sum = term;
    let n = 1n;
    let sign = -1n;
    while (term > 0n) {
      term = term / x2;
      n += 2n;
      sum += (sign * term) / n;
      sign = -sign;
    }
    return sum;
  }
  const pi = 16n * arctanInv(5) - 4n * arctanInv(239);
  return pi.toString().slice(1, 1 + digits);
}

const first50 = "14159265358979323846264338327950288419716939937510";
const a = piDecimals(50);
console.log("first 50 match known:", a === first50);

const N = 20000;
const c = piDecimals(N);
const m = machin(N);
console.log("chudnovsky vs machin, " + N + " digits:", c === m);

for (const n of [100000, 1000000]) {
  const t0 = Date.now();
  const s = piDecimals(n);
  const ms = Date.now() - t0;
  console.log(n + " digits in " + ms + " ms, length " + s.length);
  if (n === 1000000) {
    console.log("six nines at place:", s.indexOf("999999") + 1);
    console.log("123456 at place:", (s.indexOf("123456") + 1) || "not in first 1M (first appears past 2 million)");
    console.log("prefix of 100k run matches:", s.startsWith(piDecimals(100000)));
  }
}
