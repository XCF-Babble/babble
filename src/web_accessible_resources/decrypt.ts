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

import * as keystore from '../utils/keystore';

import { Request, sendMessage } from '../utils/message';
import { escapeHTML } from '../utils/webutils';

window.onload = (): void => {
  const decryptBox = document.getElementById( 'decrypt-box' ) as HTMLDivElement;

  const copyBox = document.getElementById( 'copy-box' ) as HTMLTextAreaElement;

  const copyButton: HTMLButtonElement = document.getElementById(
    'copy'
  ) as HTMLButtonElement;

  const quitButton: HTMLButtonElement = document.getElementById(
    'quit'
  ) as HTMLButtonElement;

  const setKeyButton: HTMLButtonElement = document.getElementById(
    'setKey'
  ) as HTMLButtonElement;

  const keyName: HTMLSpanElement = document.getElementById(
    'key-name'
  ) as HTMLSpanElement;

  let debabbleResult: keystore.DebabbleResult | null;

  copyButton.addEventListener( 'click', ( event: MouseEvent ) => {
    copyBox.style.display = 'block';
    copyBox.select();
    document.execCommand( 'copy' );
    const selection: Selection | null = document.getSelection();
    if ( selection ) {
      selection.removeAllRanges();
    }
    copyBox.style.display = 'none';
  } );

  quitButton.addEventListener( 'click', async ( event: MouseEvent ) => {
    await sendMessage( {
      request: 'proxyDeletePickerIFrame',
      requestClass: 'decryptionPicker'
    } );
  } );

  setKeyButton.addEventListener( 'click', async ( event: MouseEvent ) => {
    if ( debabbleResult ) {
      await keystore.setSelectedEntry( debabbleResult.keyId );
    }
  } );

  const aside: HTMLElement = document.querySelector( 'aside' ) as HTMLElement;
  chrome.runtime.onMessage.addListener(
    (
      request: Request,
      sender: chrome.runtime.MessageSender,
      sendResponse
    ): boolean => {
      switch ( request.request ) {
        case 'debabbleText':
          if ( !request.data ) {
            sendResponse( { success: false } );
            break;
          }
          const cleanedData: string = request.data.trim();
          if ( cleanedData !== '' ) {
            void ( async (): Promise<void> => {
              debabbleResult = await keystore.debabbleWithAllEntries(
                cleanedData
              );
              if ( debabbleResult.clearText !== '' ) {
                decryptBox.innerHTML = urlify( escapeHTML( debabbleResult.clearText ) );
                copyBox.value = debabbleResult.clearText;
                keyName.innerText = debabbleResult.keyName;
                if ( !aside.classList.contains( 'show' ) ) {
                  aside.classList.add( 'show' );
                }
                sendResponse( { success: false } );
              } else {
                if ( aside.classList.contains( 'show' ) ) {
                  aside.classList.remove( 'show' );
                }
                decryptBox.innerHTML = '';
                copyBox.value = '';
                sendResponse( { success: true } );
              }
            } )();
            return true; // tell sender to wait on decryption
          } else {
            sendResponse( { success: false } );
          }
          break;
        case 'hidePopup':
          if ( aside.classList.contains( 'show' ) ) {
            aside.classList.remove( 'show' );
          }
          decryptBox.innerHTML = '';
          copyBox.value = '';
          sendResponse( { success: true } );
          break;
        case 'pickerSelect':
          if ( aside.classList.contains( 'show' ) ) {
            // We are hovering over a decrypted element
            copyButton.disabled = false;
            quitButton.disabled = false;
            setKeyButton.disabled = false;
            sendResponse( { success: true } );
          } else {
            // No decrypted element
            sendResponse( { success: false } );
          }
          break;
        default:
          break;
      }
      return false;
    }
  );
};

const urlify = ( text: string ): string => {
  // Taken from https://github.com/sindresorhus/linkify-urls/blob/62fd87c59d61eb8d15530e4d38dbc99abdef78b6/index.js#L5
  // and modified to include escaped characters.
  const urlRegex = /((?:https?(?:(?::\/\/)|(?::&#x2F;&#x2F;)))(?:www\.)?(?:[a-zA-Z\d-_.]+(?:(?:\.|@)[a-zA-Z\d]{2,})|localhost)(?:(?:[-a-zA-Z\d:%_+.~#!?&//=@]*)(?:[,](?![\s]))*)*)/g;
  return text.replace( urlRegex, ( url: string ) => {
    // Since we are in an iframe, set target=_blank to open in new tab
    return `<a href="${url}" target="_blank">${url}</a>`;
  } );
};
