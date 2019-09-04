'use strict';

import { Request } from '../utils/message';

window.onload = (): void => {
  const decryptBox: HTMLTextAreaElement = document.querySelector(
    'textarea'
  ) as HTMLTextAreaElement;
  const aside: HTMLElement = document.querySelector('aside') as HTMLElement;
  chrome.runtime.onMessage.addListener(
    (
      request: Request,
      sender: chrome.runtime.MessageSender,
      sendResponse
    ): void => {
      switch (request.request) {
        case 'displayText':
          decryptBox.value = request.data;
          if (!aside.classList.contains('show')) {
            aside.classList.add('show');
          }
          break;
        case 'hidePopup':
          if (aside.classList.contains('show')) {
            aside.classList.remove('show');
          }
          decryptBox.value = '';
          break;
        default:
          break;
      }
    }
  );
};
