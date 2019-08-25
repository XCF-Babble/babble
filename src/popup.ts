'use strict';

import { sendMessageActiveTab, Request } from './message';
import * as keystore from './keystore';

window.addEventListener('DOMContentLoaded', (event: Event) => {
  const plaintext: HTMLTextAreaElement | null = document.getElementById(
    'plaintext'
  ) as HTMLTextAreaElement;

  const decryptedText: HTMLTextAreaElement | null = document.getElementById(
    'decrypted-text'
  ) as HTMLTextAreaElement;

  const debabbleIcon: HTMLElement | null = document.getElementById(
    'debabble-icon'
  ) as HTMLElement;

  const keystoreIcon: HTMLElement | null = document.getElementById(
    'keystore-icon'
  ) as HTMLElement;

  const toggleIconColor = (icon: HTMLElement) => {
    icon.classList.toggle('fa-babble-active');
  };

  if (debabbleIcon) {
    debabbleIcon.addEventListener('click', (event: MouseEvent) => {
      sendMessageActiveTab(
        { request: 'toggleElementPicker', data: null },
        (response: any): void => {
          toggleIconColor(event.target as HTMLElement);
        }
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
    keystore.getKeystoreSize().then((size: number) => {
      if (size > 0) {
        plaintext.addEventListener('input', (kevent: Event) => {
          const cleanedData: string = plaintext.value.trim();
          if (cleanedData !== '') {
            keystore
              .babbleWithSelectedEntry(cleanedData)
              .then((cipherText: string) => {
                sendMessageActiveTab(
                  { request: 'tunnelCipherText', data: cipherText },
                  (response: any): void => {}
                );
              });
          } else {
            sendMessageActiveTab(
              { request: 'clearInputBox' },
              (response: any): void => {} // TODO: handle this
            );
          }
        });
      } else {
        plaintext.placeholder = 'Create key to encrypt messages...';
        plaintext.readOnly = true;
        plaintext.disabled = true;
      }
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
        case 'debabbleText':
          if (decryptedText && cleanedData !== '') {
            keystore
              .debabbleWithAllEntries(cleanedData)
              .then((debabbledText: string) => {
                decryptedText.value = debabbledText;
              });
          }
          break;
        default:
          break;
      }
    }
  );
});
