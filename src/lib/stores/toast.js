import { writable } from 'svelte/store';

export const toast = writable({
    message: '',
    visible: false
});

export const showToast = (message, duration = 3000) => {
    toast.set({ message, visible: true });
    setTimeout(() => {
        toast.set({ message: '', visible: false });
    }, duration);
}; 