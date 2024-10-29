import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { generateNewMnemonic } from "@cashu/cashu-ts";

const defaultValue = generateNewMnemonic();
  /** @type {Uint8Array} */
const initialValue = browser ? window.localStorage.getItem('seed') ?? defaultValue : defaultValue;

const seed = writable(initialValue);

seed.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('seed', value);
	}
});

export default seed;
