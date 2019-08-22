'use strict';

// TODO: in the future this should be made more generic to support other browsers.
const sendMessageActiveTab = (
  message: any,
  responseCallback?: (response: any) => void
): void => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const activeTab: chrome.tabs.Tab | null = tabs.length > 0 ? tabs[0] : null;
    if (activeTab && activeTab.id) {
      chrome.tabs.sendMessage(activeTab.id, message, responseCallback);
    }
  });
};

window.addEventListener('DOMContentLoaded', (event: Event) => {
  const plaintext: HTMLInputElement | null = document.getElementById(
    'plaintext'
  ) as HTMLInputElement;

  if (plaintext) {
    plaintext.addEventListener('input', (kevent: Event) => {
      sendMessageActiveTab(
        { request: 'tunnelCipherText', data: plaintext.value },
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
});
