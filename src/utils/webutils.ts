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
