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
import { documentObserver } from '../../utils/webutils';

export class TheLounge extends Website {
  private targetElement: HTMLTextAreaElement | null;
  constructor () {
    super();
    this.domains = [ 'irc.ocf.berkeley.edu', 'demo.thelounge.chat' ];
    this.targetElement = null;
  }

  register (): void {
    documentObserver( ( mutationsList: MutationRecord[], observer: MutationObserver ) => {
      this.targetElement = document.querySelector( 'textarea.mousetrap' );
    } );
  }

  tunnelInput ( s: string ): boolean {
    if ( !this.targetElement ) {
      return false;
    }
    this.targetElement.value = s;
    this.targetElement.dispatchEvent( new KeyboardEvent( 'input', { bubbles: true } ) );
    return true;
  }

  submitInput (): boolean {
    if ( !this.targetElement ) {
      return false;
    }
    const submit = document.querySelector( '#submit' ) as HTMLButtonElement;
    submit.click();
    return true;
  }
}
