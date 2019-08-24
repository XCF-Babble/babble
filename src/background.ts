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
    const cleanedData: string = request.data.trim();
    switch (request.request) {
      case 'babbleText':
        // TODO: babble some text with selected key
        if (cleanedData !== '') {
          keystore
            .babbleWithSelectedEntry(cleanedData)
            .then((cipherText: string) => {
              sendMessageActiveTab(
                { request: 'tunnelCipherText', data: cipherText },
                (response: any): void => {}
              );
              sendResponse({ success: true });
            });
        } else {
          sendMessageActiveTab(
            { request: 'clearInputBox' },
            (response: any): void => {} // TODO: handle this
          );
        }
        break;
      case 'debabbleText':
        if (cleanedData !== '') {
          keystore
            .debabbleWithAllEntries(cleanedData)
            .then((plainText: string) => {
              chrome.runtime.sendMessage(
                { request: 'displayDebabbled', data: plainText },
                (response: any): void => {} // TODO: handle this
              );
              sendResponse({ success: true });
            });
        }
        break;
      default:
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
