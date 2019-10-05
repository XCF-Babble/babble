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

export class Gmail extends Website {
  private targetElement: HTMLElement | null;
  constructor () {
    super();
    this.domains = [ 'mail.google.com' ];
    this.targetElement = null;
  }

  register (): void {
    documentObserver( ( mutationsList: MutationRecord[], observer: MutationObserver ) => {
      // @ts-ignore ... Let me use my ES6 in peace, Microsoft.
      this.targetElement = [ ...document.querySelectorAll( '[role=textbox]' ) ]
        .find( ( e: HTMLElement ) => e.offsetHeight > 0 ); // first email box such that display!=none

      if ( !this.targetElement ) {
        // try basic HTML Gmail interface
        this.targetElement = document.querySelector( 'textarea[name=body]' ) as HTMLTextAreaElement;
      }
    } );
  }

  tunnelInput ( s: string ): boolean {
    if ( !this.targetElement ) {
      return false;
    }
    if ( this.targetElement instanceof HTMLTextAreaElement ) {
      this.targetElement.value = s;
    } else {
      this.targetElement.innerText = s;
    }
    return true;
  }

  submitInput (): boolean {
    if ( !this.targetElement ) {
      return false;
    }
    sendEnterEvent( 'keydown', this.targetElement, true );

    // submission for basic HTML Gmail interface
    const submit: HTMLInputElement | null = document.querySelector( 'input[type=submit][value=Send]' );
    if ( submit ) { submit.click(); }
    return true;
  }
}
