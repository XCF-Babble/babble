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

import { sendMessageActiveTab, Response } from '../utils/message';
import * as keystore from '../utils/keystore';

window.addEventListener( 'DOMContentLoaded', ( event: Event ) => {
  const plaintext: HTMLTextAreaElement | null = document.getElementById(
    'plaintext'
  ) as HTMLTextAreaElement;

  const displaytext: HTMLTextAreaElement | null = document.getElementById(
    'display-text'
  ) as HTMLTextAreaElement;

  const debabbleIcon: HTMLElement | null = document.getElementById(
    'debabble-icon'
  ) as HTMLElement;

  const keystoreIcon: HTMLElement | null = document.getElementById(
    'keystore-icon'
  ) as HTMLElement;

  const copyIcon: HTMLElement | null = document.getElementById(
    'copy-icon'
  ) as HTMLElement;

  const encryptionKeyName: HTMLElement | null = document.getElementById(
    'encryption-key-name'
  ) as HTMLElement;

  const displayLength: HTMLElement | null = document.getElementById(
    'display-length'
  ) as HTMLElement;

  if ( debabbleIcon ) {
    debabbleIcon.addEventListener( 'click', async ( event: MouseEvent ) => {
      const r: Response = await sendMessageActiveTab( {
        request: 'activateElementPicker',
        requestClass: 'decryptionPicker'
      } );
      if ( r.success ) {
        window.close();
      }
    } );
  }

  if ( keystoreIcon ) {
    keystoreIcon.addEventListener( 'click', ( event: MouseEvent ) => {
      if ( chrome.runtime.openOptionsPage ) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open( chrome.runtime.getURL( '../html/options.html' ) );
      }
      window.close();
    } );
  }

  if ( plaintext ) {
    void ( async (): Promise<void> => {
      const numKeys: number = await keystore.getKeystoreSize();
      if ( numKeys === 0 ) {
        plaintext.placeholder = 'Create key to encrypt messages...';
        plaintext.readOnly = true;
        plaintext.disabled = true;
        return;
      } else {
        const curEntry = await keystore.getEntry(
          await keystore.getSelectedEntry()
        );
        encryptionKeyName.innerText = curEntry.name;
      }
    } )();

    plaintext.addEventListener(
      'input',
      async ( kevent: Event ): Promise<void> => {
        const cleanedData: string = plaintext.value.trim();
        if ( cleanedData === '' ) {
          await sendMessageActiveTab( {
            request: 'clearInputBox',
            requestClass: 'injectInput'
          } );
          displaytext.value = '';
          displayLength.innerText = displaytext.value.length.toString();
          return;
        }
        const babbledText: string = await keystore.babbleWithSelectedEntry(
          cleanedData
        );
        displaytext.value = babbledText;
        displayLength.innerText = displaytext.value.length.toString();
        await sendMessageActiveTab( {
          request: 'tunnelCipherText',
          requestClass: 'injectInput',
          data: babbledText
        } );
      }
    );

    const isEnter = ( event: KeyboardEvent ) => {
      return event.ctrlKey && ( event.keyCode === 10 || event.keyCode === 13 );
    };

    plaintext.addEventListener( 'keydown', async ( kevent: KeyboardEvent ) => {
      if ( isEnter( kevent ) ) {
        const r: Response = await sendMessageActiveTab( {
          request: 'submitCipherText',
          requestClass: 'injectInput'
        } );
        if ( r.success ) {
          plaintext.value = '';
          displaytext.value = '';
          displayLength.innerText = displaytext.value.length.toString();
        }
      }
    } );
  }

  if ( displaytext && copyIcon ) {
    copyIcon.addEventListener( 'click', ( event: MouseEvent ) => {
      displaytext.select();
      document.execCommand( 'copy' );
      const selection: Selection | null = document.getSelection();
      if ( selection ) {
        selection.removeAllRanges();
      }
    } );
  }
} );
