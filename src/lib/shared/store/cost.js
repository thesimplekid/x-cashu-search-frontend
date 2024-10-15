
import { browser } from '$app/environment';
import { writable } from 'svelte/store';


const defaultValue = undefined;
  /** @type {number | undefined} */
const initialValue = browser ? window.localStorage.getItem('cost_per_search') ?? defaultValue : defaultValue;

const cost_per_search = writable(initialValue);

cost_per_search.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('cost_per_search', value);
	}
});

export default cost_per_search;

