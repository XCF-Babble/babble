/*
 * This file is part of the Babble project.
 * Babble is a platform agnostic browser extension that allows for easy
 * encryption and decryption of text data across the web.
 * Copyright (C) 2019  keur, yvbbrjdr
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

'use strict';

import { Request, Response, sendMessageActiveTab } from '../utils/message';

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
      (async (): Promise<void> => {
        const r: Response = await sendMessageActiveTab({
          request: proxyTransformer(request.request),
          requestClass: request.requestClass,
          data: request.data
        });
        sendResponse(r);
      })();
      return true;
    } else {
      sendResponse({ success: false });
      return false;
    }
  }
);
