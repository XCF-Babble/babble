'use strict';

import { ElementPicker } from './element-picker';
import { Parse, walkDOM } from './walkdom';
import { Website } from './website';
import { Request } from '../utils/message';
import { load } from './loader';

window.onload = (): void => {
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

  const website: Website | null = load(window.location);
  if (website) {
    website.register();
  }

  chrome.runtime.onMessage.addListener(
    (
      request: Request,
      sender: chrome.runtime.MessageSender,
      sendResponse
    ): void => {
      if (request.requestClass === 'injectInput') {
        if (!website) {
          sendResponse({ success: false });
          return;
        }
        switch (request.request) {
          case 'tunnelCipherText':
            website.tunnelInput(request.data);
            break;
          case 'submitCipherText':
            website.submitInput();
            break;
          case 'clearInputBox':
            website.clearInput();
            break;
          default:
            break;
        }
        sendResponse({ success: true });
      } else if (request.request === 'toggleElementPicker') {
        picker.toggle();
        sendResponse({ success: true });
      }
    }
  );
};
