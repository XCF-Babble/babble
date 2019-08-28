'use strict';

export enum Walk {
  STOP,
  CONTINUE
}

export const walkDOM = (root: Node, callback: (elem: Node) => Walk) => {
  if (callback(root) == Walk.STOP) {
    return;
  }
  for (var i = 0; i < root.childNodes.length; i++) {
    const child: Node = root.childNodes[i];
    walkDOM(child, callback);
  }
};
