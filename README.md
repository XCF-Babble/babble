# Babble Browser Extension

[![CircleCI](https://circleci.com/gh/XCF-Babble/babble.svg?style=svg)](https://circleci.com/gh/XCF-Babble/babble)

说都不会话了。

**Babble** is a platform agnostic browser extension that allows for easy
encryption and decryption of text data across the web. With Babble, users can
create encryption keys from passwords, encrypt text with any of these keys, and
decrypt any ciphertext they have a key for. Babble is meant to be _dead simple_
to use, so people of all backgrounds have the ability to encrypt sensitive data
on any service.

A list of supported websites can be found [here](supported-websites.md).

## Demo

### Encryption

<img src="https://i.fluffy.cc/1gsjrtgs30Kw6ZnmsdX74V8MBpZ1QztB.gif" height="500">

### Decryption

<img src="https://i.fluffy.cc/FtVXtVZCPLtTWxdr8cfgRTRWGwXPDgrp.gif" height="500">

## How it works

### Encryption and Encoding

Babble uses [Argon2i](https://en.wikipedia.org/wiki/Argon2) algorithm to
generate a 256-bit encryption key (with salt `BabbleBabbleBabb`). The key
derivation process is slow (takes about 0.5-2s in the browser) to prevent brute
force attack. The encryption algorithm is
[ChaCha20](https://en.wikipedia.org/wiki/Salsa20#ChaCha_variant)-IETF-[Poly1305](https://en.wikipedia.org/wiki/Poly1305).
The cipher text is then (byte-by-byte) encoded to UTF-8 characters using a
256-character base. The default base is 256 Chinese characters taken from a
frequency table. You can use whatever base you'd like, as long as it's 256 UTF-8
characters and only contains unique characters.

### Decryption

Decryption can begin when the _unlock_ icon inside of the Babble popup is
clicked. This action launches the element picker, highlighting the DOM element
under the cursor purple. The extension will walk the DOM starting at that
element looking for data to decrypt.

**Babble operates under the assumption that every website is running hostile
JavaScript**. To that end, when the element picker is started, an iframe is
created whose source is a [web accessible
resource](https://developer.chrome.com/extensions/manifest/web_accessible_resources).
All ciphertext targeted for decryption is transferred to the iframe, where it
is then decrypted and displayed to the user. Web accessible resources are
utilized because they have unique protocols (`chrome-extension://` on Chromium
or `moz-extension://` on Firefox), and protect our plaintext from being
exfiltrated by malicious Javascript the on page by the [same-origin
policy](https://en.wikipedia.org/wiki/Same-origin_policy).
