// Pi digit engine: Chudnovsky series with binary splitting, BigInt only.
// Returns the decimal digits after the point, as a string ("14159265...").

function bitLength(n) {
  var h = n.toString(16);
  return (h.length - 1) * 4 + (32 - Math.clz32(parseInt(h.charAt(0), 16)));
}

function isqrt(n) {
  if (n < 2n) return n;
  var bl = bitLength(n);
  var r;
  if (bl <= 52) {
    r = BigInt(Math.floor(Math.sqrt(Number(n))));
  } else {
    var k = bl >> 2;
    var r0 = isqrt(n >> BigInt(2 * k)) << BigInt(k);
    r = (r0 + n / r0) >> 1n;
  }
  while (r * r > n) r -= 1n;
  while ((r + 1n) * (r + 1n) <= n) r += 1n;
  return r;
}

function piDecimals(digits) {
  var D = digits + 12;
  var terms = Math.ceil(D / 14.1816474627) + 2;
  var C3_24 = (640320n ** 3n) / 24n;

  function bs(a, b) {
    if (b - a === 1) {
      if (a === 0) return [1n, 1n, 13591409n];
      var A = BigInt(a);
      var P = (6n * A - 5n) * (2n * A - 1n) * (6n * A - 1n);
      var Q = A * A * A * C3_24;
      var T = P * (13591409n + 545140134n * A);
      if (a & 1) T = -T;
      return [P, Q, T];
    }
    var m = (a + b) >> 1;
    var left = bs(a, m);
    var right = bs(m, b);
    return [
      left[0] * right[0],
      left[1] * right[1],
      right[1] * left[2] + left[0] * right[2]
    ];
  }

  var res = bs(0, terms);
  var Q = res[1], T = res[2];
  var one = 10n ** BigInt(D);
  var sqrtC = isqrt(10005n * one * one);
  var pi = (Q * 426880n * sqrtC) / T;
  var s = pi.toString();
  return s.slice(1, 1 + digits);
}

if (typeof module !== "undefined") module.exports = { piDecimals: piDecimals };
