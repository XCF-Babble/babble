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

export enum Walk {
  STOP,
  CONTINUE
}

export const walkDOM = async (
  root: Node,
  callback: ( elem: Node ) => Promise<Walk>
) => {
  if ( ( await callback( root ) ) === Walk.STOP ) {
    return;
  }
  for ( let i = 0; i < root.childNodes.length; i++ ) {
    const child: Node = root.childNodes[i];
    void walkDOM( child, callback );
  }
};
