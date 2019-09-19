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

export class Website {
  protected domain: string;
  constructor () {
    if ( new.target === Website ) {
      throw new TypeError( 'Cannot construct Website (Abstract)' );
    }
    this.domain = 'babble.moe';
  }

  // Called on page initialization. This sets up monitoring for the target encryption elements.
  register (): void {
    // TODO: should we setup a MutationListener here?
  }

  // Called when the user wants to display text in the input element.
  // Helper methods may be needed to clear placeholders, set up divs, or perform other site specific actions.
  tunnelInput ( s: string ) {
    return false;
  }

  // Called when the user hits ctrl+enter in the babble popup window.
  // We want to replicate the event that occurs when pressing enter
  // with that element focused. This may mean doing nothing.
  submitInput () {
    return false;
  }

  getDomain (): string {
    return this.domain;
  }
}
