let p, q; // private key, two random primes
let n, y; // public key

let keyPair, publicKey, privateKey;

let m1 = 0n,
  m2 = 1n;
let c1, c2, d1, d2, u1, u2, cResult, mResult;

window.gm = {};

window.gm.generateKeyPair = () => {
  let p = randPrime(10n, 50n);
  // let q = randPrime(10n, 50n);

  // Blum-Zahl
  let q = 3n + 4n * randInt(0n, 20n);

  while (true) {
    const prime = isPrime(q);
    logMessage(`Trying q = ${q}, prime: ${prime}`);
    if (prime) {
      break;
    }
    q += 4n;
    if (q > 10000n) {
      throw Error("Failed to find q");
    }
  }

  const n = p * q;

  // y mit Blum-Zahl
  // let y = n - 1n;

  // General
  let y = 2n;

  while (true) {
    logMessage(`Trying y = ${y}`);
    let isQuadraticRest = false;

    if (ggt(y, n) == 1n && legendre(y, p) == -1n && legendre(y, q) == -1n) {
      break;
    }

    y = (y + 1n) % n;
    if (y == 0) {
      throw Error("Failed to find y");
    }
  }

  return {
    publicKey: [n, y],
    privateKey: [p, q],
  };
};

window.gm.encrypt = (m, publicKey, useU = undefined) => {
  const [n, y] = publicKey;
  assert(0 <= m && m < n, `m = ${m} out of range [0, ${n}]`);
  let u = useU || randTeilerfremd(n);
  const c = (expMod(y, m, n) * expMod(u, 2n, n)) % n;
  logMessage(`Encrypting m = ${m}, u = ${u}, c = ${c}, n = ${n}`);
  return [c, u];
};

window.gm.decrypt = (c, publicKey, privateKey) => {
  const [n, y] = publicKey;
  const [p, q] = privateKey;
  logMessage(`Decrypting c = ${c}`);
  // if (legendre(c, p) == 1n && legendre(c, q) == 1n) {
  if (expMod(c, (p - 1n) / 2n, p) == 1n && expMod(c, (q - 1n) / 2n, q) == 1n) {
    return 0;
  } else {
    return 1;
  }
};

function main() {
  regenerateKeys();
  initUI();
  logMessage(keyPair);

  encryptMessage(1);
  encryptMessage(2);

  update(keyPair);
}

// Benutzeroberfläche initialisieren
function initUI() {
  setValues();

  document.getElementById("encrypt1").onclick = () => {
    encryptMessage(1);
    update();
  };
  document.getElementById("encrypt2").onclick = () => {
    encryptMessage(2);
    update();
  };
  document.getElementById("regenerateKeys").onclick = () => {
    readValues();
    regenerateKeys();
    update();
  };
}

// Schlüsselpaar generieren
function regenerateKeys() {
  keyPair = { publicKey, privateKey } = window.gm.generateKeyPair();
  [n, y] = publicKey;
  [p, q] = privateKey;
}

function update() {
  // Homomorphie: Multiplikation der Ciphertexte = Addition der Klartexte
  readValues();
  encryptMessage(1);
  encryptMessage(2);
  logMessage("m1 = " + m1);
  logMessage("m2 = " + m2);
  logMessage("c1 = " + c1);
  logMessage("c2 = " + c2);
  cResult = homomorphAddMod(c1, c2, n);
  logMessage("cResult = " + cResult);
  mResult = gm.decrypt(cResult, publicKey, privateKey);
  d1 = gm.decrypt(c1, publicKey, privateKey);
  d2 = gm.decrypt(c2, publicKey, privateKey);
  logMessage("mResult = " + mResult);
  displayValues();
}

function encryptMessage(messageName) {
  readValues();
  switch (messageName) {
    case 1:
      [c1, u1] = gm.encrypt(m1, publicKey);
      break;
    case 2:
      [c2, u2] = gm.encrypt(m2, publicKey);
      break;
  }
  displayValues();
}

// Liest alle <input>-Elemente aus und schreibt sie in die entsprechenden Variablen
// Außer r, das wird nur bei Schlüsselpaar-Generierung gesetzt
function readValues() {
  m1 = BigInt(document.getElementById("m1").value);
  m2 = BigInt(document.getElementById("m2").value);
}

// Zeigt alle Variable an
function displayValues() {
  displayValue("p", p);
  displayValue("q", q);
  displayValue("n", n);
  displayValue("y", y);
  displayValue("c1", c1);
  displayValue("c2", c2);
  displayValue("m1", m1);
  displayValue("m2", m2);
  displayValue("d1", d1);
  displayValue("d2", d2);
  displayValue("u1", u1);
  displayValue("u2", u2);
  displayValue("cResult", cResult);
  displayValue("mResult", mResult);
}

// Schreibt value in das Element mit der class outputElClass
function displayValue(outputElClass, value) {
  [...document.getElementsByClassName(outputElClass)].map(
    (el) => (el.textContent = value)
  );
}

// Variablen in <input>-Elemente schreiben
function setValues() {
  document.getElementById("m1").value = m1;
  document.getElementById("m2").value = m2;
}

main();