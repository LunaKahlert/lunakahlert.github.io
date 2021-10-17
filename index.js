let r = 101n; // blocksize messages are from Z/rZ
let p, q; // private key, two random primes
let n, y; // public key

let keyPair, publicKey, privateKey;

let m1 = 3,
  m2 = 5;
let c1, c2, u1, u2, cResult, mResult;
let cSum, mSum, numStudents, markAverage;

const ENCRYPT_STUDENT_NAME = true;
const totalNumStudents = 6;
let serverState = {
  marks: [],
  students: [],
};

function main() {
  regenerateKeys(r);
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
    r = BigInt(document.getElementById("r").value);
    if (r % 2n == 0) r++;
    setValues();
    regenerateKeys(r);
    update();
  };

  document.getElementById("reset").onclick = resetMarkServer;

  const client = document.getElementById("client-list");
  // for (let i = 1; i <= totalNumStudents; i++) {
  //   client.append(makeStudent(`Schüler ${i}`));
  // }
  client.append(makeStudent(`Luna`));
  client.append(makeStudent(`Talesia`));
  client.append(makeStudent(`Karl`));
  client.append(makeStudent(`Lina`));
  client.append(makeStudent(`Leon`));
  client.append(makeStudent(`Dörthe`));
  client.append(makeStudent(`Eva`));
  client.append(makeStudent(`Erik`));

  resetMarkServer();
}

// Schüler hinzufügen
function makeStudent(name, container) {
  const student = document.createElement("div");
  const label = document.createElement("label");
  label.textContent = `${name}: `;

  const input = document.createElement("input");
  input.type = "number";
  input.min = "0";
  input.max = "15";
  input.value = randInt(8n, 15n);
  label.append(input);

  const button = document.createElement("button");
  button.textContent = "Senden";
  button.className = "send-mark";
  button.onclick = () => {
    const mark = BigInt(input.value);
    const [cMark, _] = benaloh.encrypt(mark, publicKey);

    let serverStudentName = name;
    if (ENCRYPT_STUDENT_NAME) {
      serverStudentName = rot13(serverStudentName);
    }

    if (!serverState.students.includes(serverStudentName)) {
      serverState.students.push(serverStudentName);
      serverState.marks.push(cMark);
    }

    button.disabled = true;
    updateClientServerUI();
    logSend(name, "Server", `Note: ${cMark}`);
    logSend("Server", "Clients", `Summe: ${cSum}, Anzahl: ${numStudents}`);
  };

  student.append(label);
  student.append(" ");
  student.append(button);
  return student;
}

// Füge Nachricht dem Nachrichtenlog hinzu
function logSend(from, to, message) {
  const loggedMessage = document.createElement("li");
  const fromClass = from == "Server" ? "message--server" : "message--client";
  const toClass = to == "Server" ? "message--server" : "message--client";

  loggedMessage.innerHTML = `<span class="${fromClass}">${from}</span> ⟶ <span class="${toClass}">${to}</span>: ${message}`;
  document.getElementById("log").append(loggedMessage);
}

// Server Benutzeroberfläche und Notendurchschnitt aktualisieren
function updateClientServerUI() {
  numStudents = serverState.students.length;
  if (serverState.marks.length == 0) {
    cSum = undefined;
  } else {
    cSum = serverState.marks.reduce(
      (a, b) => homomorphAddMod(BigInt(a), BigInt(b), n),
      1n
    );
    mSum = benaloh.decrypt(cSum, publicKey, privateKey);
    markAverage = Number(mSum) / numStudents;
  }

  window.logMessage(document.getElementById("server-state"), serverState);
  document.getElementById("server-state").innerHTML = `
    <div><strong>Anzahl Schüler:</strong> ${serverState.students.length}</div>
    <div><strong>Schüler:</strong> ${serverState.students.join(", ")}</div>
    <div><strong>Verschlüsselte Noten:</strong> ${serverState.marks.join(
      ", "
    )}</div>
    <div><strong>Gesamt:</strong> ${
      serverState.marks.length > 0
        ? katex.renderToString(`\\prod \\text{Noten} \\equiv \\;`) +
          '<span class="valueFor cSum"></span>' +
          katex.renderToString(`\\;\\text{mod} `) +
          ' <span class="valueFor n"></span>'
        : ""
    }</div>
  `;
  displayValues();
}

// Setze Server zurück
function resetMarkServer() {
  cSum = undefined;
  mSum = undefined;
  markAverage = undefined;

  serverState = {
    marks: [],
    students: [],
  };
  [...document.getElementsByClassName("send-mark")].forEach((button) => {
    button.disabled = false;
  });
  document.getElementById("log").innerText = "";
  updateClientServerUI();
}

// Schlüsselpaar generieren
function regenerateKeys(r) {
  keyPair = { publicKey, privateKey } = window.benaloh.generateKeyPair(r);
  [r, n, y] = publicKey;
  [p, q] = privateKey;
  resetMarkServer();
}

function update() {
  // Homomorphie: Multiplikation der Ciphertexte = Addition der Klartexte
  readValues();
  logMessage("m1 = " + m1);
  logMessage("m2 = " + m2);
  logMessage("c1 = " + c1);
  logMessage("c2 = " + c2);
  cResult = homomorphAddMod(c1, c2, n);
  logMessage("cResult = " + cResult);
  mResult = benaloh.decrypt(cResult, publicKey, privateKey);
  logMessage("mResult = " + mResult);
  displayValues();
}

function encryptMessage(messageName) {
  readValues();
  switch (messageName) {
    case 1:
      [c1, u1] = benaloh.encrypt(m1, publicKey);
      break;
    case 2:
      [c2, u2] = benaloh.encrypt(m2, publicKey);
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
  displayValue("r", r);
  displayValue("p", p);
  displayValue("q", q);
  displayValue("n", n);
  displayValue("y", y);
  displayValue("c1", c1);
  displayValue("c2", c2);
  displayValue("u1", u1);
  displayValue("u2", u2);
  displayValue("cResult", cResult);
  displayValue("mResult", mResult);
  displayValue("mSum", mSum);
  displayValue("cSum", cSum);
  displayValue("numStudents", numStudents);
  displayValue("markAverage", markAverage);
  if (p && q) displayValue("phi", (p - 1n) * (q - 1n));
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
  document.getElementById("r").value = r;
}

main();

// ========== Sonstiges ==========

function rot13(str) {
  return str
    .split("")
    .map((char) => {
      if (char.match(/[a-z]/)) {
        if (char.charCodeAt(0) <= 90) {
          return String.fromCharCode(
            ((char.charCodeAt(0) - 65 + 13) % 26) + 65
          );
        } else {
          return String.fromCharCode(
            ((char.charCodeAt(0) - 97 + 13) % 26) + 97
          );
        }
      } else {
        return char;
      }
    })
    .join("");
}

// ========== Wikipedia Example ==========

function useWikipediaKey() {
  r = 9n;
  p = 883n;
  q = 1019n;
  n = 899777n;
  y = 85147n;
  publicKey = [r, n, y];
  privateKey = [p, q];
  keyPair = [publicKey, privateKey];
}

function wikipediaExample() {
  useWikipediaKey();
  m = 6n;
  u = 175884n;
  [c, _] = benaloh.encrypt(m, publicKey, u);
  benaloh.decrypt(c, publicKey, privateKey);
}
