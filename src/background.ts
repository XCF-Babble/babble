'use strict';

chrome.runtime.onInstalled.addListener((): void => {
  // TODO: add locales
  chrome.contextMenus.create({
    id: 'babble',
    title: 'Encrypt Element...',
    type: 'normal',
    contexts: ['all']
  });
});

chrome.contextMenus.onClicked.addListener(
  (
    info: chrome.contextMenus.OnClickData,
    tab: chrome.tabs.Tab | undefined
  ): void => {
    // send this message to the current tab
    if (tab && tab.id) {
      chrome.tabs.sendMessage(tab.id, 'getContextElement', (response): void => {
        // TODO: do we actually need to do anything here?
      });
    }
  }
);
