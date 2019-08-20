"use strict";

const parse = require("./parse");
const cryptoutils = require("./cryptoutils");

const start = () => {
  console.log(cryptoutils.deriveKey("henlo"));
  parse.walkDOM(document.body, (elem: Element) => {
    const text: String = elem.innerHTML.trim();
    if (text === "keur") {
      elem.innerHTML = "test";
    }
  });
};

//// TODO: instead of doing timout hacks, we should have this
//// be a mutation observer that watches the entire DOM and
//// attempts to decrypt on any changes
setTimeout(start, 1000);
