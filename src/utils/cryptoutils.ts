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

import * as _sodium from 'libsodium-wrappers';
const babbleSalt: string = 'BabbleBabbleBabb';

export interface PresetBase {
  name: string;
  base: string;
}

export interface Keypair {
  encodedPublicKey: string;
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}

export const babblePresetBases: PresetBase[] = [
  {
    name: 'Chinese',
    base: '的一是了人在有我他这为之来以个们到说和地也子时而要于就下得可你年生自会那后能对着事其里所去行过十用发如然方成者多都三二同么当起与好看学进将还分此心前面又定见只从现因开些长明样已月正想实把相两力等外它并间手应全门点身由何向至物被五及入先己或很最书美山什名曰合加世水果位度马给数次今表原各才几解则气再听提万更比百尔即白许系且光路接结题指感量取场电空边件住放风求形望传笑叫往区达设记字故品象花七服据云像飞远收石类程转千式流每该始术格运怎步让识拉若备造快集布尽称确呢节注存具甚容吃算坐早引似视尚轻况留照写足余星居技属找食'
  },
  {
    name: 'Japanese',
    base: 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ日一国会人年大十二本中長出三同時政事自行社見月分議後前民生連五発間対上部東者党地合市業内相方四定今回新場金員九入選立開手米力学問高代明実円関決子動京全目表戦経通外最言氏現理調体化田当八六約主題下首意法不来作性的要用制治度務強気小'
  },
  {
    name: 'Korean',
    base: '이다의는에을하한고가로기지사서은도를대정리자수시으있어구인나제국과그해전부것일적아연라성들상원여보장화주소동공조스경계용위우게학만개면되관문유선중산치신회발비분생내방무와세니물등할실통었미모러업교체진재안야명민간며단당요년거마금된오본했법합식없각였결영행때데력반설터려속운양현차종말형음술석바입역임않작히및건질표외강두까백권트르직불호심따처타태출파천남람던점감저난후포또특최크달예같능변북드프래책김노함박배추환열평증매울품약집군향근알초온급목더료른론확준토록활련격월광판키청습험번절류규루복량많피새레응받령란날편'
  }
];

const getSodium = async () => {
  await _sodium.ready;
  return _sodium;
};

export const deriveKey = async (
  babblePassphrase: string
): Promise<Uint8Array> => {
  const sodium = await getSodium();
  return sodium.crypto_pwhash(
    sodium.crypto_aead_chacha20poly1305_ietf_KEYBYTES,
    sodium.from_string( babblePassphrase ),
    sodium.from_string( babbleSalt ),
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_ALG_DEFAULT
  );
};

const encrypt = async (
  s: string,
  babbleKey: Uint8Array
): Promise<Uint8Array> => {
  const sodium = await getSodium();
  const nonce: Uint8Array = sodium.randombytes_buf(
    sodium.crypto_aead_chacha20poly1305_ietf_NPUBBYTES
  );
  const cipher: Uint8Array = sodium.crypto_aead_chacha20poly1305_ietf_encrypt(
    sodium.from_string( s ),
    null,
    null,
    nonce,
    babbleKey
  );
  const ret: Uint8Array = new Uint8Array( nonce.length + cipher.length );
  ret.set( nonce );
  ret.set( cipher, nonce.length );
  return ret;
};

const decrypt = async (
  s: Uint8Array,
  babbleKey: Uint8Array
): Promise<string> => {
  const sodium = await getSodium();
  if (
    s.length <
    sodium.crypto_aead_chacha20poly1305_ietf_NPUBBYTES +
      sodium.crypto_aead_chacha20poly1305_ietf_ABYTES
  ) {
    return '';
  }
  const nonce: Uint8Array = s.subarray(
    0,
    sodium.crypto_aead_chacha20poly1305_ietf_NPUBBYTES
  );
  const cipher: Uint8Array = s.subarray(
    sodium.crypto_aead_chacha20poly1305_ietf_NPUBBYTES
  );
  return sodium.to_string(
    sodium.crypto_aead_chacha20poly1305_ietf_decrypt(
      null,
      cipher,
      null,
      nonce,
      babbleKey
    )
  );
};

const hanziEncode = ( s: Uint8Array, babbleBase: string ): string => {
  let ret = '';
  s.forEach( b => {
    ret += babbleBase[b];
  } );
  return ret;
};

const hanziDecode = ( s: string, babbleBase: string ): Uint8Array => {
  let ret = new Uint8Array( s.length );
  let parsed = 0;
  for ( const c of s ) {
    const index = babbleBase.indexOf( c );
    if ( index !== -1 ) ret[parsed++] = index;
  }
  return ret.subarray( 0, parsed );
};

export const babble = async (
  s: string,
  babbleKey: Uint8Array,
  babbleBase: string
): Promise<string> => {
  try {
    return hanziEncode( await encrypt( s, babbleKey ), babbleBase );
  } catch ( e ) {
    return '';
  }
};

export const debabble = async (
  s: string,
  babbleKey: Uint8Array,
  babbleBase: string
): Promise<string> => {
  try {
    return await decrypt( hanziDecode( s, babbleBase ), babbleKey );
  } catch ( e ) {
    return '';
  }
};

export const genUUID = async ( data?: Uint8Array | undefined ): Promise<string> => {
  const sodium = await getSodium();
  const uuidLen: number = 16;
  const hyphenPos: Array<number> = [ 3, 5, 7, 9 ];
  const rand: Uint8Array = data === undefined ? sodium.randombytes_buf( uuidLen ) : data;
  let ret: string = '';
  for ( let i = 0; i < uuidLen; ++i ) {
    const hex: string = rand[i].toString( 16 );
    ret += hex.length === 1 ? '0' + hex : hex;
    if ( hyphenPos.includes( i ) ) {
      ret += '-';
    }
  }
  return ret;
};

export const genKeypair = async (): Promise<Keypair> => {
  const sodium = await getSodium();
  const privateKey: Uint8Array = sodium.randombytes_buf( sodium.crypto_scalarmult_SCALARBYTES );
  const publicKey: Uint8Array = sodium.crypto_scalarmult_base( privateKey );
  const encodedPublicKey: string = hanziEncode( publicKey, babblePresetBases[0].base );
  return { encodedPublicKey, publicKey, privateKey };
};

export const dh = async ( keypair: Keypair, encodedPublicKey: string ): Promise<string> => {
  const sodium = await getSodium();
  let publicKey1: Uint8Array = hanziDecode( encodedPublicKey, babblePresetBases[0].base );
  let publicKey2: Uint8Array = keypair.publicKey;
  const sharedSecret: Uint8Array = sodium.crypto_scalarmult( keypair.privateKey, publicKey1 );
  let sharedSecretWithPublicKeys: Uint8Array = new Uint8Array( sodium.crypto_scalarmult_BYTES * 3 );
  if ( sodium.compare( publicKey1, publicKey2 ) === 1 ) {
    const tmp: Uint8Array = publicKey1;
    publicKey1 = publicKey2;
    publicKey2 = tmp;
  }
  sharedSecretWithPublicKeys.set( sharedSecret );
  sharedSecretWithPublicKeys.set( publicKey1, sodium.crypto_scalarmult_BYTES );
  sharedSecretWithPublicKeys.set( publicKey2, sodium.crypto_scalarmult_BYTES * 2 );
  return genUUID( sodium.crypto_generichash( 16, sharedSecretWithPublicKeys ) );
};
