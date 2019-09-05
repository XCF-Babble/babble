# Babble

说都不会话了

<b>Babble</b> is a platform agnostic browser extension that allows for easy
encryption and decryption of text data across the web. With Babble, users can
create encryption keys from passwords, encrypt text with any of these keys, and
decrypt any ciphertext they have a key for. Babble is meant to be _dead simple_
to use, so people of all backgrounds have the ability to encrypt sensitive data
on any service.

## Usage

### Encryption

<img src="https://i.fluffy.cc/1gsjrtgs30Kw6ZnmsdX74V8MBpZ1QztB.gif">

### Decryption

<img src="https://i.fluffy.cc/FtVXtVZCPLtTWxdr8cfgRTRWGwXPDgrp.gif">

## How it works

### Encryption and Encoding

### Decryption

Decryption can begin when the _unlock_ icon inside of the Babble popup is
clicked. This action launches the element picker, highlighting the DOM element
under the cursor purple. The extension will walk the DOM starting at that
element looking for data to decrypt.

<b>Babble operates under the assumption that every website is running hostile
Javascript</b>. To that end, all ciphertext is first passed into the
extension's background script (completely isolated from the page DOM), and
decryption is performed in the background. If a piece of text can be decrypted,
the background script forwards the plaintext to a listener back on the page.
This listener is special because it is inside of an iframe whose source links
to [web accessible
resource](https://developer.chrome.com/extensions/manifest/web_accessible_resources).

Web accessible resources are benefical because they have unique protocols
(`chrome-extension://` on Chromium or `moz-extension://` on Firefox) and
protect our plaintext from being exfiltrated by malicious Javascript the on
page by the [same-origin
policy]([https://en.wikipedia.org/wiki/Same-origin_policy](https://en.wikipedia.org/wiki/Same-origin_policy)).
