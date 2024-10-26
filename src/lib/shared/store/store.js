import { browser } from '$app/environment';
import { writable } from 'svelte/store';


const defaultValue = undefined;
  /** @type {string | undefined} */
const initialValue = browser ? window.localStorage.getItem('lock_key') ?? defaultValue : defaultValue;

const lock_key = writable(initialValue);

lock_key.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('lock_key', value);
	}
});

export default lock_key;
