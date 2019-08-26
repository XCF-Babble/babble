'use strict';

// TODO: Maybe change request and requestClass to enum
export interface Request {
  request: string;
  data: string;
  requestClass: string;
}

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
