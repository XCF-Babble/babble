'use strict';

export enum Parse {
  STOP,
  CONTINUE
}

export const walkDOM = (
  root: Element,
  callback: (elem: Element) => Parse,
  down: boolean = true
) => {
  walkDOMDownwards(root, callback);
};

const walkDOMDownwards = (
  root: Element,
  callback: (elem: Element) => Parse
) => {
  if (callback(root) == Parse.STOP) {
    return;
  }
  for (var i = 0; i < root.children.length; i++) {
    const child: Element = root.children[i];
    walkDOMDownwards(child, callback);
  }
};
