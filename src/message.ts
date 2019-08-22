'use strict';

// TODO: move the interface out of this file and change request to an enum
export interface Request {
  request: string;
  data: string;
}

// TODO: in the future this should be made more generic to support other browsers.
export const sendMessageActiveTab = (
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
