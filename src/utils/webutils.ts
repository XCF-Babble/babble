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

// Send <ENTER>
// TODO: keyCode is deprecated and thus not supported by typescript. Unwilling
// to spend more time trying to get this working with `key` and `code`.
// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent
export const sendEnterEvent = ( kevent: string, target: Node, isCtrl: boolean = false ): void => {
  target.dispatchEvent(
    new KeyboardEvent( kevent, {
      bubbles: true,
      cancelable: true,
      ctrlKey: isCtrl,
      // @ts-ignore
      keyCode: 13
    } )
  );
};

export const documentObserver = (
  callback: (
    mutationsList: MutationRecord[],
    observer: MutationObserver
  ) => void
) => {
  const observer: MutationObserver = new MutationObserver( callback );
  observer.observe( document, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  } );
};

// Taken from mustache.js templating library
// https://github.com/janl/mustache.js/blob/6c3608bfb9fa74684cd9e22f5bb4c097f87484ef/mustache.js#L73-L88
const entityMap: { [unsafeEntity: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

export const escapeHTML = ( unsafe: string ): string => {
  return unsafe.replace( /[&<>"'`=\/]/g, ( s: string ): string => {
    return entityMap[s];
  } );
};
