'use strict';

import * as _sodium from 'libsodium-wrappers';
const babbleSalt: string = 'BabbleBabbleBabb';

export const babbleDefaultBase: string =
  '的一是了人在有我他这为之来以个们到说和地也子时而要于就下得可你年生自会那后能对着事其里所去行过十用发如然方成者多都三二同么当起与好看学进将还分此心前面又定见只从现因开些长明样已月正想实把相两力等外它并间手应全门点身由何向至物被五及入先己或很最书美山什名曰合加世水果位度马给数次今表原各才几解则气再听提万更比百尔即白许系且光路接结题指感量取场电空边件住放风求形望传笑叫往区达设记字故品象花七服据云像飞远收石类程转千式流每该始术格运怎步让识拉若备造快集布尽称确呢节注存具甚容吃算坐早引似视尚轻况留照写足余星居技属找食';

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
    sodium.from_string(babblePassphrase),
    sodium.from_string(babbleSalt),
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
    sodium.from_string(s),
    null,
    null,
    nonce,
    babbleKey
  );
  const ret: Uint8Array = new Uint8Array(nonce.length + cipher.length);
  ret.set(nonce);
  ret.set(cipher, nonce.length);
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
  )
    return '';
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

const hanziEncode = (s: Uint8Array, babbleBase: string): string => {
  var ret = '';
  s.forEach(b => {
    ret += babbleBase[b];
  });
  return ret;
};

const hanziDecode = (s: string, babbleBase: string): Uint8Array => {
  var ret = new Uint8Array(s.length);
  var parsed = 0;
  for (const c of s) {
    const index = babbleBase.indexOf(c);
    if (index != -1) ret[parsed++] = index;
  }
  return ret.subarray(0, parsed);
};

export const babble = async (
  s: string,
  babbleKey: Uint8Array,
  babbleBase: string
): Promise<string> => {
  try {
    return hanziEncode(await encrypt(s, babbleKey), babbleBase);
  } catch (e) {
    return '';
  }
};

export const debabble = async (
  s: string,
  babbleKey: Uint8Array,
  babbleBase: string
): Promise<string> => {
  try {
    return await decrypt(hanziDecode(s, babbleBase), babbleKey);
  } catch (e) {
    return '';
  }
};

export const genUUID = async (): Promise<string> => {
  const sodium = await getSodium();
  const uuidLen: number = 16;
  const hyphenPos: Array<number> = [3, 5, 7, 9];
  const rand: Uint8Array = sodium.randombytes_buf(uuidLen);
  var ret: string = '';
  for (var i = 0; i < uuidLen; ++i) {
    const hex: string = rand[i].toString(16);
    ret += hex.length === 1 ? '0' + hex : hex;
    if (hyphenPos.includes(i)) {
      ret += '-';
    }
  }
  return ret;
};
