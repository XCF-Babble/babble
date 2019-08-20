'use strict';

const _sodium = require('libsodium-wrappers');
const babbleSalt = 'BabbleBabbleBabb';

export const libsodium = async () => {
  const sodium = _sodium;
  await sodium.ready;

  return sodium;
};

export const deriveKey = async (
  babblePassphrase: string
): Promise<Uint8Array> => {
  const sodium = await libsodium();
  return sodium.crypto_pwhash(
    sodium.crypto_aead_chacha20poly1305_ietf_KEYBYTES,
    sodium.from_string(babblePassphrase),
    sodium.from_string(babbleSalt),
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_ALG_DEFAULT
  );
};
