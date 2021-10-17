window.benaloh = {};

window.benaloh.generateKeyPair = (r) => {
  let p = r + 1n;
  while (true) {
    const prime = isPrime(p);
    const ggtP = ggt((p - 1n) / r, r);

    logMessage(`Trying p = ${p}, prime: ${prime}, ggT((p-1)/r, r): ${ggtP}`);

    if (prime && ggtP == 1n) {
      break;
    }
    p += r;
    if (p > 10000n) {
      throw Error("Failed to find p");
    }
  }

  let q = 3n;

  while (true) {
    const prime = isPrime(q);
    const ggtQ = ggt(q - 1n, r);
    logMessage(`Trying q = ${q}, ggT(q - 1, r): ${ggtQ}`);
    if (ggtQ == 1n && prime) {
      break;
    }
    q += 2n;
    if (q > 10000n) {
      throw Error("Failed to find q");
    }
  }

  const n = p * q;

  let y = 2n;
  const rFactors = primeFactors(r);

  while (true) {
    logMessage(`Trying y = ${y}`);

    if (
      ggt(y, n) == 1n &&
      rFactors.every((s) => {
        const exp = ((p - 1n) * (q - 1n)) / s;
        const pow = expMod(y, exp, n);
        logMessage(
          `  s = ${s}, expMod(y=${y}, (p-1)*(q-1)/s=(${p}-1)(${q}-1)/${s}=${exp}, n=${n}): ${pow}`
        );
        return pow != 1n;
      })
    ) {
      break;
    }

    y = (y + 1n) % n;
    if (y == 0) {
      throw Error("Failed to find y");
    }
  }

  return {
    publicKey: [r, n, y],
    privateKey: [p, q],
  };
};

window.benaloh.encrypt = (m, publicKey, useU = undefined) => {
  const [r, n, y] = publicKey;
  assert(0 <= m && m < n, `m = ${m} out of range [0, ${n}]`);
  let u = useU || randTeilerfremd(n);
  const c = (expMod(y, m, n) * expMod(u, r, n)) % n;
  logMessage(`Encrypting m = ${m}, u = ${u}, c = ${c}, n = ${n}`);
  return [c, u];
};

window.benaloh.decrypt = (c, publicKey, privateKey) => {
  const [r, n, y] = publicKey;
  const [p, q] = privateKey;
  const exp = ((p - 1n) * (q - 1n)) / r;
  const a = expMod(c, exp, n);
  const b = expMod(y, exp, n);
  logMessage(`Decrypting c = ${c}`);
  logMessage(
    `a = c^phi/r = ${a}, b = y^phi/r = ${b}, n = ${n}, (p-1)(q-1)/r = (${p}-1)(${q}-1)/${r} = ${exp}`
  );
  for (let m = 0n; m < n; m++) {
    // logMessage(`  m = ${m}, expMod(b, m, n): ${expMod(b, m, n)}`);
    if (a == expMod(b, m, n)) {
      return m;
    }
  }

  throw Error(`Failed to decrypt ${c}`);
};
