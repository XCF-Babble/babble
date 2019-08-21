'use strict';

export const walkDOM = (root: Element, callback: (elem: Element) => boolean, down:boolean = true) => {
  if (down) {
    walkDOMDownwards(root, callback);
  } else {
    if (root) {
      walkDOMUpwards(root, callback);
    }
  }
};

const walkDOMDownwards = (root: Element, callback: (elem: Element) => boolean) => {
  if (callback(root)) {
    return;
  }
  for (var i = 0; i < root.children.length; i++) {
    const child: Element = root.children[i];
    walkDOMDownwards(child, callback);
  }
};

const walkDOMUpwards = (node: Element, callback: (elem: Element) => boolean) => {
  if (callback(node)) {
    return;
  }
  if (node.parentElement) {
    walkDOMUpwards(node.parentElement, callback);
  }
};
