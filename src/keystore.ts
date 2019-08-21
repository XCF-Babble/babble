'use strict';

const cryptoutils = require('./cryptoutils');

export interface KeystoreEntry {
  name: string;
  key: Array<number>;
  base: string;
  tags: [string];
}

export const getKeystore = (): Promise<[KeystoreEntry]> => {
  return new Promise<[KeystoreEntry]>(
    (resolve: (_: [KeystoreEntry]) => void) => {
      chrome.storage.local.get({ keystore: [] }, result => {
        resolve(result.keystore);
      });
    }
  );
};

const setKeystore = (keystore: [KeystoreEntry]): Promise<void> => {
  return new Promise<void>((resolve: () => void) => {
    chrome.storage.local.set({ keystore: keystore }, resolve);
  });
};

export const clearKeystore = (): Promise<void> => {
  return new Promise<void>((resolve: () => void) => {
    chrome.storage.local.set({ keystore: [] }, resolve);
  });
};

export const getKeystoreSize = async (): Promise<number> => {
  const keystore = await getKeystore();
  return keystore.length;
};

export const addEntry = async (
  name: string,
  passphrase: string,
  base: string,
  tags: [string]
): Promise<void> => {
  var keystore = await getKeystore();
  keystore.push({
    name: name,
    key: Array.from(await cryptoutils.deriveKey(passphrase)),
    base: base,
    tags: tags
  });
  return await setKeystore(keystore);
};

export const editEntry = async (
  id: number,
  name: string,
  passphrase: string,
  base: string,
  tags: [string]
): Promise<void> => {
  var keystore = await getKeystore();
  keystore[id] = {
    name: name,
    key: Array.from(await cryptoutils.deriveKey(passphrase)),
    base: base,
    tags: tags
  };
  return await setKeystore(keystore);
};

export const delEntry = async (id: number): Promise<void> => {
  var keystore = await getKeystore();
  keystore.splice(id, 1);
  return await setKeystore(keystore);
};

export const babbleWithEntry = async (
  s: string,
  id: number
): Promise<string> => {
  const keystore = await getKeystore();
  return await cryptoutils.babble(
    s,
    Uint8Array.from(keystore[id].key),
    keystore[id].base
  );
};

export const debabbleWithEntry = async (
  s: string,
  id: number
): Promise<string> => {
  const keystore = await getKeystore();
  return await cryptoutils.debabble(
    s,
    Uint8Array.from(keystore[id].key),
    keystore[id].base
  );
};
