'use strict';

import { Request } from '../utils/message';
import * as keystore from '../utils/keystore';

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
        default:
          break;
      }
      return false;
    }
  );
};
