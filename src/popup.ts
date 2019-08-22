'use strict';

import * as message from './message';

window.addEventListener('DOMContentLoaded', (event: Event) => {
  const plaintext: HTMLInputElement | null = document.getElementById(
    'plaintext'
  ) as HTMLInputElement;

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
        message.sendMessageActiveTab(
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
});
