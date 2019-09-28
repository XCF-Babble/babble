# Babble Browser Extension

[![CircleCI](https://circleci.com/gh/XCF-Babble/babble.svg?style=svg)](https://circleci.com/gh/XCF-Babble/babble)
[![Language Grade: javascript](https://img.shields.io/lgtm/grade/javascript/github/XCF-Babble/babble)](https://lgtm.com/projects/g/XCF-Babble/babble/context:javascript)

说都不会话了。

**Babble** is a platform agnostic browser extension that allows for easy
encryption and decryption of text data across the web. With Babble, users can
create encryption keys from passwords, encrypt text with any of these keys, and
decrypt any ciphertext they have a key for. Babble is meant to be _dead simple_
to use, so people of all backgrounds have the ability to encrypt sensitive data
on any service.

A list of supported websites can be found [here](supported-websites.md).

## Installation

You can install Babble for Chrome from
[Chrome Web Store](https://chrome.google.com/webstore/detail/babble/jlennmkkaeaacimlocjokpiicngdmlpe),
or for Firefox from
[Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/babble/).
You can also download the extension from
[GitHub Releases](https://github.com/XCF-Babble/babble/releases/latest).

## Demo

### Encryption

<img src="https://i.fluffy.cc/1gsjrtgs30Kw6ZnmsdX74V8MBpZ1QztB.gif" height="500">

### Decryption

<img src="https://i.fluffy.cc/FtVXtVZCPLtTWxdr8cfgRTRWGwXPDgrp.gif" height="500">

## How it works

### Key Management

Click the _key_ icon inside of the Babble popup and you'll be brought to the
Babble Keystore. From there, you can add, search, select, edit, and delete
key-base pairs.

<a name="encryption-and-encoding"></a>
### Encryption and Encoding

Encryption can begin when you type into the textbox inside of the Babble popup.
For supported sites, the encrypted text will be automatically filled into the
webpage's textbox. Hitting `Ctrl+Enter` will trigger sending the message from
the webpage. For unsupported sites, you can click the _copy_ icon and paste the
encrypted text to the textbox you want. The popup can also be activated by
`Shift+Alt+Z`.

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
element looking for data to decrypt. Decryption can also be activated by
`Shift+Alt+D`.

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

### Key Exchange

In the options page, users can generate a keypair, share it with a
correspondent, and both parties derive the same passphrase (UUID) using
[Elliptic-curve Diffie-Hellman ephemeral
(ECDHE)](https://en.wikipedia.org/wiki/Elliptic-curve_Diffie%E2%80%93Hellman).
Point multiplication is done on
[Curve25519](https://en.wikipedia.org/wiki/Curve25519) and the shared UUID is
computed by `UUID(hash(secret || publicKey1 || publicKey2))`. It is not unheard
of for different keypairs produce the same point on the curve, thus the public
keys are hashed with the shared secret to produce a more secure output ([per
the libsodium
recommendation](https://libsodium.gitbook.io/doc/advanced/scalar_multiplication)).
The resulting UUID is to be used as a [source for key
derivation](#encryption-and-encoding).
