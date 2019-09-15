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

export class ElementPicker {
  private hoverColor: string;
  private borderStyle: string;
  private callbackHover: ( event: Element ) => void;
  private callbackClick: ( event: EventTarget ) => void;
  private callbackOnDeactivate: () => void;
  private lastElem: HTMLElement | null;
  private lastBackgroundColor: string | null;
  private lastBorder: string | null;
  private _isActive: boolean;
  constructor(
    callbackHover: (elem: Element) => void,
    callbackClick: (elem: EventTarget) => void,
    callbackOnDeactivate: () => void,
    hoverColor: string = 'rgba(195, 63, 182, 0.3)',
    borderStyle: string = 'thin solid rgba(222, 18, 99, 0.8)'
  ) {
    this.hoverColor = hoverColor;
    this.borderStyle = borderStyle;
    this.callbackHover = callbackHover;
    this.callbackClick = callbackClick;
    this.callbackOnDeactivate = callbackOnDeactivate;
    this._isActive = false;
    this.lastElem = null;
    this.lastBackgroundColor = null;
    this.lastBorder = null;
  }

  resetElement = (): void => {
    if ( this.lastElem ) {
      this.lastElem.style.backgroundColor = this.lastBackgroundColor;
      this.lastElem.style.border = this.lastBorder;
    }
  }

  onKeydownEvent = ( event: KeyboardEvent ): void => {
    if ( event.key === 'Escape' || event.which === 27 ) {
      event.stopPropagation();
      event.preventDefault();
      this.deactivate();
    }
  }

  onMouseClickEvent = ( event: Event ): void => {
    event.stopPropagation();
    event.preventDefault();
    this.callbackClick( event.target as EventTarget );
  }

  onMouseMoveEvent = ( event: Event ): void => {
    const e: Event = event || window.event;
    const target: EventTarget | null = e.target || e.srcElement;
    if ( target && target instanceof HTMLElement ) {
      if ( target === this.lastElem ) {
        return;
      }
      this.resetElement();
      this.callbackHover( target );
      this.lastElem = target;
      this.lastBackgroundColor = target.style.backgroundColor;
      this.lastBorder = target.style.border;
      target.style.backgroundColor = this.hoverColor;
      target.style.border = this.borderStyle;
    }
  }

  isActive = (): boolean => {
    return this._isActive;
  };

  activate = (): void => {
    document.addEventListener( 'click', this.onMouseClickEvent, true );
    document.addEventListener( 'keydown', this.onKeydownEvent, true );
    document.addEventListener( 'mousemove', this.onMouseMoveEvent, false );
    document.body.style.cursor = 'crosshair';
    this._isActive = true;
  };

  deactivate = ( triggerCallback: boolean = true ): void => {
    document.removeEventListener( 'click', this.onMouseClickEvent, true );
    document.removeEventListener( 'keydown', this.onKeydownEvent, true );
    document.removeEventListener( 'mousemove', this.onMouseMoveEvent, false );
    this.resetElement();
    document.body.style.cursor = 'auto';
    this.lastElem = null;
    this.lastBackgroundColor = null;
    if ( triggerCallback ) {
      this.callbackOnDeactivate();
    }
    this._isActive = false;
  };
}
