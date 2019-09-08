'use strict';

import { Request } from '../utils/message';
import * as keystore from '../utils/keystore';

window.onload = (): void => {
  const decryptBox: HTMLTextAreaElement = document.querySelector(
    'textarea'
  ) as HTMLTextAreaElement;

  const copyButton: HTMLButtonElement = document.getElementById(
    'copy'
  ) as HTMLButtonElement;

  const quitButton: HTMLButtonElement = document.getElementById(
    'quit'
  ) as HTMLButtonElement;

  copyButton.addEventListener('click', (event: MouseEvent) => {
    decryptBox.select();
    document.execCommand('copy');
    const selection: Selection | null = document.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  });

  quitButton.addEventListener('click', (event: MouseEvent) => {
    chrome.runtime.sendMessage(
      {
        request: 'proxyDeletePickerIFrame',
        requestClass: 'decryptionPicker',
        data: null
      },
      (response: any): void => {}
    );
  });

  const aside: HTMLElement = document.querySelector('aside') as HTMLElement;
  chrome.runtime.onMessage.addListener(
    (
      request: Request,
      sender: chrome.runtime.MessageSender,
      sendResponse
    ): boolean => {
      switch (request.request) {
        case 'debabbleText':
          const cleanedData: string = request.data.trim();
          if (cleanedData !== '') {
            (async (): Promise<void> => {
              const debabbledText: string = await keystore.debabbleWithAllEntries(
                cleanedData
              );
              if (debabbledText !== '') {
                decryptBox.value = debabbledText;
                if (!aside.classList.contains('show')) {
                  aside.classList.add('show');
                }
                sendResponse({ success: false });
              } else {
                if (aside.classList.contains('show')) {
                  aside.classList.remove('show');
                }
                decryptBox.value = '';
                sendResponse({ success: true });
              }
            })();
            return true; // tell sender to wait on decryption
          } else {
            sendResponse({ success: false });
          }
          break;
        case 'hidePopup':
          if (aside.classList.contains('show')) {
            aside.classList.remove('show');
          }
          decryptBox.value = '';
          sendResponse({ success: true });
          break;
        case 'pickerSelect':
          copyButton.disabled = false;
          quitButton.disabled = false;
          sendResponse({ success: true });
          break;
        default:
          break;
      }
      return false;
    }
  );
};
