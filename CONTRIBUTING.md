### Get a development build:

```
npm install
npm run dev
```

### manifest.json

* Chromium based browser
	```
	npm run chromium
	```

* Firefox
	```
	npm run firefox
	```

### Before committing run:

```
npm run lint
```

### Adding Dependencies

Due to the nature of `npm` micropackging and the security concerns surrounding
the ecosystem, we are very hesitant to add any dependencies outside of
`webpack`, `typescript`, and `libsodium`. We will need a _really good reason_
to add a new dependency, and it is unlikely we will do so.
