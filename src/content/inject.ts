'use strict';

import { ElementPicker } from './element-picker';
import { Walk, walkDOM } from './walkdom';
import { Website } from './website';
import { Request } from '../utils/message';
import { load } from './loader';

window.onload = (): void => {
  const picker = new ElementPicker((selected: Element) => {
    walkDOM(
      selected,
      (childNode: Node): Walk => {
        if (childNode.textContent) {
          chrome.runtime.sendMessage(
            { request: 'debabbleText', data: childNode.textContent },
            (response: any): void => {} // TODO: we want to return if we successfully decrypted something
          );
        }
        return Walk.CONTINUE;
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
