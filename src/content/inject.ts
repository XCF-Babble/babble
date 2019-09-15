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

import { ElementPicker } from './element-picker';
import { Walk, walkDOM } from './walkdom';
import { Website } from './website';
import { Request, Response, sendMessage } from '../utils/message';
import { load } from './loader';

window.onload = (): void => {
  var cryptFrame: HTMLIFrameElement | null;

  const activatePicker = (): void => {
    deletePickerIFrame();
    cryptFrame = document.createElement('iframe');
    cryptFrame.src = chrome.runtime.getURL('dist/html/decrypt.html');
    const pickerCSSStyle: string = [
      'background: transparent',
      'border: 0',
      'border-radius: 0',
      'box-shadow: none',
      'display: block',
      'height: 100%',
      'left: 0',
      'margin: 0',
      'max-height: none',
      'max-width: none',
      'opacity: 1',
      'outline: 0',
      'padding: 0',
      'position: fixed',
      'top: 0',
      'visibility: visible',
      'width: 100%',
      'pointer-events: none', // this lets us be the top layer and still highlight DOM nodes
      'z-index: 2147483647',
      ''
    ].join(' !important;');
    cryptFrame.style.cssText = pickerCSSStyle;
    // We don't append to the body because we are setting the frame's
    // width and height to be 100%. Prevents the picker from only being
    // able to hover the iframe.
    document.documentElement.appendChild(cryptFrame);
    picker.activate();
  };

  const deletePickerIFrame = (): void => {
    if (picker) {
      picker.deactivate();
    }
    if (cryptFrame) {
      document.documentElement.removeChild(cryptFrame);
      cryptFrame = null; // ensure we don't keep the node in mem
    }
  };

  const picker = new ElementPicker(
    (selected: Element) => {
      walkDOM(
        selected,
        async (childNode: Node): Promise<Walk> => {
          if (childNode.textContent) {
            const r: Response = await sendMessage({
              request: 'proxyDebabbleText',
              data: childNode.textContent
            });
            if (r.success) {
              return Walk.STOP;
            }
          }
          return Walk.CONTINUE;
        }
      );
    },
    async (_: EventTarget) => {
      picker.deactivate(false);

      const r: Response = await sendMessage({ request: 'proxyPickerSelect' });
      if (!cryptFrame) {
        return;
      }

      if (r.success) {
        cryptFrame.style.pointerEvents = 'all';
      } else {
        document.documentElement.removeChild(cryptFrame);
        cryptFrame = null; // ensure we don't keep the node in mem
      }
    },
    () => {
      if (cryptFrame) {
        document.documentElement.removeChild(cryptFrame);
        cryptFrame = null; // ensure we don't keep the node in mem
      }
    }
  );

  const website: Website | null = load(window.location);
  if (website) {
    website.register();
  }

  chrome.runtime.onMessage.addListener(
    (
      request: Request,
      sender: chrome.runtime.MessageSender,
      sendResponse
    ): void => {
      switch (request.requestClass) {
        case 'injectInput':
          if (!website) {
            sendResponse({ success: false });
            return;
          }
          switch (request.request) {
            case 'tunnelCipherText':
              if (request.data) {
                website.tunnelInput(request.data);
              }
              break;
            case 'submitCipherText':
              website.submitInput();
              break;
            case 'clearInputBox':
              website.clearInput();
              break;
            default:
              break;
          }
          sendResponse({ success: true });
          break;
        case 'decryptionPicker':
          switch (request.request) {
            case 'activateElementPicker':
              activatePicker();
              sendResponse({ success: true });
              break;
            case 'toggleElementPicker':
              picker.isActive() ? deletePickerIFrame() : activatePicker();
              sendResponse({ success: true });
              break;
            case 'deletePickerIFrame':
              deletePickerIFrame();
              sendResponse({ success: true });
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
    }
  );
};
