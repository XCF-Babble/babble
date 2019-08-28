'use strict';

export enum Walk {
  STOP,
  CONTINUE
}

export const walkDOM = (root: Element, callback: (elem: Element) => Walk) => {
  if (callback(root) == Walk.STOP) {
    return;
  }
  for (var i = 0; i < root.children.length; i++) {
    const child: Element = root.children[i];
    walkDOM(child, callback);
  }
};
