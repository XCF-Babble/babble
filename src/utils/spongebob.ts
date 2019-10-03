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

const isAlpha = ( c: string ): boolean => {
  return /^[A-Z]$/i.test( c );
};

const toUpperCase = ( c: string ): string => {
  return c.toUpperCase();
};

const toLowerCase = ( c: string ): string => {
  return c.toLowerCase();
};

const flipCoin = ( prob: number ): boolean => {
  return Math.random() < prob;
};

const switchFunc = ( func: ( c: string ) => string ): ( c: string ) => string => {
  return func === toUpperCase ? toLowerCase : toUpperCase;
};

export const spongebobify = ( text: string ): string => {
  if ( text.length < 2 ) {
    return text;
  }
  const alpha: number = text.length < 10 ? 0.25 : 0.45;
  let ret: string = '';
  let caseDup: number = 1;
  let transformFn: ( c: string ) => string = flipCoin( 0.5 ) ? toUpperCase : toLowerCase;
  for ( let i = 0; i < text.length; ++i ) {
    const c: string = text[i];
    ret += transformFn( c );
    if ( !isAlpha( c ) ) {
      continue;
    }
    if ( flipCoin( Math.pow( alpha, caseDup ) ) ) {
      ++caseDup;
    } else {
      transformFn = switchFunc( transformFn );
      caseDup = 1;
    }
  }
  return ret;
};
