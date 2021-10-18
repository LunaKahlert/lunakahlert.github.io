// https://de.wikipedia.org/wiki/Euklidischer_Algorithmus
window.ggt = (a, b) => {
  if (b == 0) return a;
  return ggt(b, a % b);
};

// https://de.wikipedia.org/wiki/Probedivision
window.isPrime = (p) => {
  if (p == 2n) return true; // n means integer (BigInt in JavaScript)
  if (p % 2n == 0) return false; // % geteilt durch
  for (let i = 3n; i * i <= p; i += 2n) {
    // i * i --> Wurzel mal Wurzel ergibt die Zahl selbst
    if (p % i == 0) return false;
  }
  return true;
};

// Berechnung aller Primfaktoren
window.primeFactors = (n) => {
  if (!n || n < 2n) return [];

  const f = [];
  for (let i = 2n; i * i <= n; i++) {
    if (n % i == 0) f.push(i); // push --> hinzufügen zu array

    while (n % i == 0) n /= i;
  }

  return f;
};

window.homomorphAddMod = (c1, c2, n) => {
  return (c1 * c2) % n;
};

// Schnelle Exponentiation
// https://de.wikipedia.org/wiki/Bin%C3%A4re_Exponentiation
window.expMod = (base, exp, m) => {
  if (exp == 0) return 1n;
  if (exp % 2n == 0) {
    const d = expMod(base, exp / 2n, m);
    return (d * d) % m;
  } else {
    return (base * expMod(base, exp - 1n, m)) % m;
  }
};

// Berechne zufällige Zahl x zwischen minN und maxN
window.randInt = (minN, maxN) => {
  const range = Number(maxN - minN + 1n);
  return BigInt(Math.floor(Math.random() * range)) + minN;
};

// Berechne zufällige Primzahl x zwischen minN und maxN
window.randPrime = (minN, maxN) => {
  let p = 0n;
  const MAX_TRIES = 10000;

  for (let i = 0; i < MAX_TRIES; i++) {
    p = randInt(minN, maxN);
    if (isPrime(p)) {
      return p;
    }
  }

  throw Error(
    `Could not find prime in range ${minN}...${maxN} in ${MAX_TRIES} tries.`
  );
};

// Zufällige zu n teilerfremde Zahl
window.randTeilerfremd = (n) => {
  let x = randInt(2n, n);
  while (!isTeilerfremd(x, n)) {
    x = randInt(2n, n);
  }
  return x;
};


window.isTeilerfremd = (a, b) => {
  if (ggt(a, b) == 1n) return true;
  else return false;
};

window.legendre = (a, p) => {
  if (a % p == 0n) return 0n;

  for (let i = 0n; i <= p / 2n; i++) {
    if ((i * i) % p == a % p) return 1n;
  }
  return -1n;
};