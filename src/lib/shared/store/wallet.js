// Yeah yeah I know this is secure
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

import getRandomValues from 'crypto'

const defaultValue = self.crypto.getRandomValues(new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]));
  /** @type {Uint8Array} */
const initialValue = browser ? window.localStorage.getItem('seed') ?? defaultValue : defaultValue;

const seed = writable(initialValue);

seed.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('seed', value);
	}
});

export default seed;
