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

import { Website } from '../website';
import { documentObserver, sendEnterEvent } from '../../utils/webutils';

export class Discord extends Website {
  private targetElement: HTMLTextAreaElement | null;
  constructor () {
    super();
    this.domains = [ 'discordapp.com' ];
    this.targetElement = null;
  }

  register (): void {
    documentObserver( ( mutationsList: MutationRecord[], observer: MutationObserver ) => {
      const inputBoxes: HTMLCollectionOf<HTMLTextAreaElement> = document.getElementsByTagName( 'textarea' );
      if ( inputBoxes.length > 0 ) {
        this.targetElement = inputBoxes[0];
      }
    } );
  }

  tunnelInput ( s: string ): boolean {
    if ( !this.targetElement ) {
      return false;
    }
    this.targetElement.value = s;
    // React tracks DOMNode.value changes, so we also need to fire an 'input' event.
    // https://github.com/facebook/react/issues/10135#issuecomment-314441175
    this.targetElement.dispatchEvent( new KeyboardEvent( 'input', { bubbles: true } ) );
    return true;
  }

  submitInput (): boolean {
    if ( !this.targetElement ) {
      return false;
    }
    sendEnterEvent( 'keypress', this.targetElement );
    return true;
  }
}
