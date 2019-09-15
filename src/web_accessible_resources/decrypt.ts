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

import { Request, sendMessage } from '../utils/message';
import * as keystore from '../utils/keystore';

window.onload = (): void => {
  const decryptBox: HTMLTextAreaElement = document.querySelector(
    'textarea'
  ) as HTMLTextAreaElement;

  const copyButton: HTMLButtonElement = document.getElementById(
    'copy'
  ) as HTMLButtonElement;

  const quitButton: HTMLButtonElement = document.getElementById(
    'quit'
  ) as HTMLButtonElement;

  const keyName: HTMLSpanElement = document.getElementById(
    'key-name'
  ) as HTMLSpanElement;

  copyButton.addEventListener('click', (event: MouseEvent) => {
    decryptBox.select();
    document.execCommand('copy');
    const selection: Selection | null = document.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  });

  quitButton.addEventListener('click', async (event: MouseEvent) => {
    await sendMessage({
      request: 'proxyDeletePickerIFrame',
      requestClass: 'decryptionPicker'
    });
  });

  const aside: HTMLElement = document.querySelector('aside') as HTMLElement;
  chrome.runtime.onMessage.addListener(
    (
      request: Request,
      sender: chrome.runtime.MessageSender,
      sendResponse
    ): boolean => {
      switch (request.request) {
        case 'debabbleText':
          if (!request.data) {
            sendResponse({ success: false });
            break;
          }
          const cleanedData: string = request.data.trim();
          if (cleanedData !== '') {
            (async (): Promise<void> => {
              const debabbleResult: keystore.DebabbleResult = await keystore.debabbleWithAllEntries(
                cleanedData
              );
              if (debabbleResult.clearText !== '') {
                decryptBox.value = debabbleResult.clearText;
                keyName.innerText = debabbleResult.keyName;
                if (!aside.classList.contains('show')) {
                  aside.classList.add('show');
                }
                sendResponse({ success: false });
              } else {
                if (aside.classList.contains('show')) {
                  aside.classList.remove('show');
                }
                decryptBox.value = '';
                sendResponse({ success: true });
              }
            })();
            return true; // tell sender to wait on decryption
          } else {
            sendResponse({ success: false });
          }
          break;
        case 'hidePopup':
          if (aside.classList.contains('show')) {
            aside.classList.remove('show');
          }
          decryptBox.value = '';
          sendResponse({ success: true });
          break;
        case 'pickerSelect':
          if (aside.classList.contains('show')) {
            // We are hovering over a decrypted element
            copyButton.disabled = false;
            quitButton.disabled = false;
            sendResponse({ success: true });
          } else {
            // No decrypted element
            sendResponse({ success: false });
          }
          break;
        default:
          break;
      }
      return false;
    }
  );
};
