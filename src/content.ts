'use strict';

import { ElementPicker } from './element-picker.ts';
import { Parse, walkDOM } from './parse';
import { Request } from './message';

window.onload = (): void => {
  ((): void => {
    var cipherInput: Element;

    const picker = new ElementPicker((selected: Element) => {
      walkDOM(
        selected,
        (childNode: Element): Parse => {
          if (childNode instanceof HTMLElement) {
            chrome.runtime.sendMessage(
              { request: 'debabbleText', data: childNode.innerText },
              (response: any): void => {} // TODO: we want to return if we successfully decrypted something
            );
          }
          return Parse.CONTINUE;
        }
      );
    });

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
          case 'clearInputBox':
            cipherInput.innerHTML = '';
            break;
          case 'toggleElementPicker':
            picker.toggle();
            break;
          default:
            break;
        }
        sendResponse({ success: true });
      }
    );
    const start = () => {
      const editors: NodeListOf<Element> = document.querySelectorAll(
        'div.ql-editor'
      );
      if (editors.length > 0) {
        cipherInput = editors[0];
      }
    };

    setTimeout(start, 1000);
  })();
};
