import { writable } from 'svelte/store';

// Initialize with 0, this will be updated from the backend
export const searchCount = writable(0); 