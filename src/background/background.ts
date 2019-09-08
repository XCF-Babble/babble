'use strict';

import { Request, sendMessageActiveTab } from '../utils/message';

const proxyTransformer = (proxyRequest: string): string => {
  return proxyRequest[5].toLowerCase() + proxyRequest.slice(6);
};

// Because Firefox does not support sending messages from content script to
// content script, we have the background proxy the request back to the content
// page for the iframe to receive the message.
//
// TODO: Consider using window.postMessage to communicate with the iframe
// (simpler, better performance). I am not sure I like this, because a hostile
// webpage could spam the iframe with requests and attempt some sort of
// side-channel attack. Need to look into this more.
chrome.runtime.onMessage.addListener(
  (
    request: Request,
    sender: chrome.runtime.MessageSender,
    sendResponse
  ): boolean => {
    if (request.request.startsWith('proxy') && request.request.length > 5) {
      sendMessageActiveTab(
        {
          request: proxyTransformer(request.request),
          requestClass: request.requestClass,
          data: request.data
        },
        (response: any): void => {
          sendResponse(response);
        }
      );
    } else {
      sendResponse({ success: false });
    }
    return true;
  }
);
