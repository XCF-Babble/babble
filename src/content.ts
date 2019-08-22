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

// TODO: move the interface out of this file and change request to an enum
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
    switch (request.request) {
      case 'tunnelCipherText':
        cipherInput.innerHTML = request.data;
        break;
      case 'submitCipherText':
        // Send <ENTER>
        // TODO: keyCode is deprecated and thus not supported by typescript. Unwilling
        // to spend more time trying to get this working with `key` and `code`.
        // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent
        cipherInput.dispatchEvent(
          new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            // @ts-ignore
            keyCode: 10
          })
        );
        cipherInput.dispatchEvent(
          new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            // @ts-ignore
            keyCode: 13
          })
        );

        break;
      default:
        console.error('Unknown message request: ', request.request);
        break;
    }
    sendResponse({ success: true });
  }
);
