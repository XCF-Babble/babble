'use strict';

import * as keystore from './keystore';
import { Request, sendMessageActiveTab } from './message';

chrome.runtime.onInstalled.addListener((): void => {
  // TODO: add locales
  chrome.contextMenus.create({
    id: 'babble',
    title: 'Encrypt Element...',
    type: 'normal',
    contexts: ['all']
  });
});

chrome.runtime.onMessage.addListener(
  (
    request: Request,
    sender: chrome.runtime.MessageSender,
    sendResponse
  ): void => {
    switch (request.request) {
      case 'babbleText':
        // TODO: babble some text with selected key
        const cleanedData: string = request.data.trim();
        if (cleanedData !== '') {
          keystore
            .babbleWithEntry(cleanedData, 0)
            .then((cipherText: string) => {
              sendMessageActiveTab(
                { request: 'tunnelCipherText', data: cipherText },
                (response: any): void => {}
              );
            });
        } else {
          sendMessageActiveTab(
            { request: 'clearInputBox' },
            (response: any): void => {}
          );
        }
        break;
      default:
        console.error('Unknnown message request: ', request.request);
        break;
    }
  }
);

chrome.contextMenus.onClicked.addListener(
  (
    info: chrome.contextMenus.OnClickData,
    tab: chrome.tabs.Tab | undefined
  ): void => {
    // send this message to the current tab
    if (tab && tab.id) {
      chrome.tabs.sendMessage(
        tab.id,
        'getContextElement',
        (response): void => {}
      );
    }
  }
);
