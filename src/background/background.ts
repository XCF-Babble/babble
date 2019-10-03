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

import { Request, sendMessageActiveTab } from '../utils/message';

const proxyTransformer = ( proxyRequest: string ): string => {
  return proxyRequest[5].toLowerCase() + proxyRequest.slice( 6 );
};

const historyMap: { [domain: string]: string } = {};

chrome.runtime.onMessage.addListener(
  (
    request: Request,
    sender: chrome.runtime.MessageSender,
    sendResponse
  ): boolean => {
    void ( async ( ): Promise<void> => {
      switch ( request.request ) {
        case 'tunnelCipherText':
          historyMap[request.data.hostname] = request.data.plaintext;
          sendResponse(
            await sendMessageActiveTab( {
              request: request.request,
              requestClass: request.requestClass,
              data: request.data.ciphertext
            } )
          );
          break;
        case 'clearInputBox':
        case 'submitCipherText':
          historyMap[request.data.hostname] = '';
          sendResponse(
            await sendMessageActiveTab( {
              request: request.request,
              requestClass: request.requestClass
            } )
          );
          break;
        case 'getPopupHistory':
          sendResponse( {
            success: true,
            data: historyMap[request.data.hostname] || ''
          } );
          break;
        default:
          // Because Firefox does not support sending messages from content script to
          // content script, we have the background proxy the request back to the content
          // page for the iframe to receive the message.
          //
          // TODO: Consider using window.postMessage to communicate with the iframe
          // (simpler, better performance). I am not sure I like this, because a hostile
          // webpage could spam the iframe with requests and attempt some sort of
          // side-channel attack. Need to look into this more.
          if ( request.request.startsWith( 'proxy' ) && request.request.length > 5 ) {
            sendResponse(
              await sendMessageActiveTab( {
                request: proxyTransformer( request.request ),
                requestClass: request.requestClass,
                data: request.data
              } )
            );
          } else {
            sendResponse( { success: false } );
          }
          break;
      }
    } )();
    return true;
  }
);

chrome.runtime.onConnect.addListener( ( port: chrome.runtime.Port ) => {
  console.assert( port.name === 'popup' );
  port.onDisconnect.addListener( async ( ) => {
    await sendMessageActiveTab( {
      request: 'clearInputBox',
      requestClass: 'injectInput'
    } );
  } );
} );

chrome.commands.onCommand.addListener( async ( command: string ) => {
  if ( command === 'toggle-decryption' ) {
    await sendMessageActiveTab( {
      request: 'toggleElementPicker',
      requestClass: 'decryptionPicker'
    } );
  }
} );
