'use strict';

import { sendMessageActiveTab, Request } from './message';

window.addEventListener('DOMContentLoaded', (event: Event) => {
  const plaintext: HTMLInputElement | null = document.getElementById(
    'plaintext'
  ) as HTMLInputElement;

  const decryptedText: HTMLInputElement | null = document.getElementById(
    'decrypted-text'
  ) as HTMLInputElement;

  const debabbleIcon: HTMLElement | null = document.getElementById(
    'debabble-icon'
  ) as HTMLElement;

  const keystoreIcon: HTMLElement | null = document.getElementById(
    'keystore-icon'
  ) as HTMLElement;

  if (debabbleIcon) {
    debabbleIcon.addEventListener('click', (event: MouseEvent) => {
      sendMessageActiveTab(
        { request: 'toggleElementPicker', data: null },
        (response: any): void => {}
      );
    });
  }

  if (keystoreIcon) {
    keystoreIcon.addEventListener('click', (event: MouseEvent) => {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL('../html/options.html'));
      }
    });
  }

  if (plaintext) {
    plaintext.addEventListener('input', (kevent: Event) => {
      chrome.runtime.sendMessage(
        { request: 'babbleText', data: plaintext.value },
        (response: any): void => {}
      );
    });

    const isEnter = (event: KeyboardEvent) => {
      return event.ctrlKey && (event.keyCode == 10 || event.keyCode == 13);
    };

    plaintext.addEventListener('keydown', (kevent: KeyboardEvent) => {
      if (isEnter(kevent)) {
        sendMessageActiveTab(
          { request: 'submitCipherText', data: null },
          (response: any): void => {
            if (response.success) {
              plaintext.value = '';
            }
          }
        );
      }
    });
  }
  chrome.runtime.onMessage.addListener(
    (
      request: Request,
      sender: chrome.runtime.MessageSender,
      sendResponse
    ): void => {
      const cleanedData: string = request.data.trim();
      switch (request.request) {
        case 'displayDebabbled':
          if (decryptedText) {
            sendResponse({ success: true });
            decryptedText.value = cleanedData;
          }
          break;
        default:
          break;
      }
    }
  );
});
