window.logMessage = (message) => {
  // const logList = document.getElementById("log");
  // const m = (document.createElement("li").textContent = [...arguments]
  //   .map((a) => a.toString)
  //   .join(" "));
  // logList.append(m);
  console.log(message);
};

window.assert = (condition, message) => {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
};
