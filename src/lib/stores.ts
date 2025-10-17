import { writable } from 'svelte/store';

// Мы создаем хранилище, которое будет содержать функцию.
// Изначально оно null, но как только наш инпут появится,
// мы поместим туда функцию фокусировки.
export const focusTerminal = writable<(() => void) | null>(null);