import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Get initial theme from localStorage or default to light
const initialTheme = browser ? localStorage.getItem('theme') || 'light' : 'light';

export const theme = writable(initialTheme);

// Subscribe to changes and update localStorage
if (browser) {
  theme.subscribe(value => {
    localStorage.setItem('theme', value);
    if (value === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });
} 