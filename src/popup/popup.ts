'use strict';

import { sendMessageActiveTab, Request } from '../utils/message';
import * as keystore from '../utils/keystore';

window.addEventListener('DOMContentLoaded', (event: Event) => {
  const plaintext: HTMLTextAreaElement | null = document.getElementById(
    'plaintext'
  ) as HTMLTextAreaElement;

  const displaytext: HTMLTextAreaElement | null = document.getElementById(
    'display-text'
  ) as HTMLTextAreaElement;

  const debabbleIcon: HTMLElement | null = document.getElementById(
    'debabble-icon'
  ) as HTMLElement;

  const keystoreIcon: HTMLElement | null = document.getElementById(
    'keystore-icon'
  ) as HTMLElement;

  const copyIcon: HTMLElement | null = document.getElementById(
    'copy-icon'
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
    (async (): Promise<void> => {
      const numKeys: number = await keystore.getKeystoreSize();
      if (numKeys === 0) {
        plaintext.placeholder = 'Create key to encrypt messages...';
        plaintext.readOnly = true;
        plaintext.disabled = true;
        return;
      }
    })();

    plaintext.addEventListener(
      'input',
      async (kevent: Event): Promise<void> => {
        const cleanedData: string = plaintext.value.trim();
        if (cleanedData === '') {
          sendMessageActiveTab(
            { request: 'clearInputBox', requestClass: 'injectInput' },
            (response: any): void => {}
          );
          displaytext.value = '';
          return;
        }
        const babbledText: string = await keystore.babbleWithSelectedEntry(
          cleanedData
        );
        displaytext.value = babbledText;
        sendMessageActiveTab(
          {
            request: 'tunnelCipherText',
            requestClass: 'injectInput',
            data: babbledText
          },
          (response: any): void => {}
        );
      }
    );

    const isEnter = (event: KeyboardEvent) => {
      return event.ctrlKey && (event.keyCode == 10 || event.keyCode == 13);
    };

    plaintext.addEventListener('keydown', (kevent: KeyboardEvent) => {
      if (isEnter(kevent)) {
        sendMessageActiveTab(
          { request: 'submitCipherText', requestClass: 'injectInput' },
          (response: any): void => {
            if (response.success) {
              plaintext.value = '';
              displaytext.value = '';
            }
          }
        );
      }
    });
  }

  if (displaytext && copyIcon) {
    copyIcon.addEventListener('click', (event: MouseEvent) => {
      displaytext.select();
      document.execCommand('copy');
      const selection:Selection | null = document.getSelection();
      if (selection) {
        selection.removeAllRanges();
      }
    });
  }

  chrome.runtime.onMessage.addListener(
    async (
      request: Request,
      sender: chrome.runtime.MessageSender,
      sendResponse
    ): Promise<void> => {
      const cleanedData: string = request.data.trim();
      if (!displaytext || cleanedData === '') {
        return;
      }
      switch (request.request) {
        case 'debabbleText':
          const debabbledText: string = await keystore.debabbleWithAllEntries(
            cleanedData
          );
          if (debabbledText !== '') {
            displaytext.value = debabbledText;
          }
          break;
        default:
          break;
      }
    }
  );
});
