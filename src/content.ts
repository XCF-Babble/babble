'use strict';

import * as parse from './parse';

var cipherInput: Element;
const start = () => {
  const editors: NodeListOf<Element> = document.querySelectorAll(
    'div.ql-editor'
  );
  if (editors.length > 0) {
    cipherInput = editors[0];
  }

  parse.walkDOM(document.body, (elem: Element): boolean => {
    const text: String = elem.innerHTML.trim();
    if (text === 'keur') {
      elem.innerHTML = 'test';
    }
    return false;
  });
};

//// TODO: instead of doing timout hacks, we should have this
//// be a mutation observer that watches the entire DOM and
//// attempts to decrypt on any changes
setTimeout(start, 3000);

interface Request {
  request: string;
  data: string;
}
chrome.runtime.onMessage.addListener(
  (
    request: Request,
    sender: chrome.runtime.MessageSender,
    sendResponse
  ): void => {
    cipherInput.innerHTML = request.data;
    sendResponse({success: true});
  }
);
