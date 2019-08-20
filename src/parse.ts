'use strict';

export const walkDOM = (root: Element, callback: (elem: Element) => void) => {
  parseDOM(root, callback);
};

const parseDOM = (root: Element, callback: (elem: Element) => void) => {
  for (var i = 0; i < root.children.length; i++) {
    const child: Element = root.children[i];
    callback(child);
    parseDOM(child, callback);
  }
};
