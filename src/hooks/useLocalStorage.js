import { useState, useEffect } from 'react';

/**
 * A custom hook to sync state with localStorage.
 * @param {string} key - The localStorage key.
 * @param {any} initialValue - The fallback value if key doesn't exist.
 * @returns {[any, Function]} - The state and setter function.
 */
export function useLocalStorage(key, initialValue) {
  // Read value from localStorage, fallback to initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when storedValue changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
