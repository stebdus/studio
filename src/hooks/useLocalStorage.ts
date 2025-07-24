import { useState, useEffect } from 'react';

// This is a custom hook to keep state in sync with localStorage.
// It's useful for persisting data across browser sessions.
export function useLocalStorage<T>(key: string, initialValue: T, reviver?: (parsed: any) => T): [T, (value: T | ((val: T) => T)) => void] {
  
  // This function gets the stored value from localStorage, or returns the initial value.
  // It's wrapped in a function to ensure it only runs on the client-side.
  const getStoredValue = () => {
    // Check if we're on the client, as localStorage doesn't exist on the server.
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      const parsed = JSON.parse(item);
      // The reviver function handles any special data transformations needed,
      // like converting date strings back into Date objects.
      return reviver ? reviver(parsed) : parsed;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  };

  // We use useState, but initialize it with the value from localStorage.
  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // This function updates the state and also saves the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        // We need to serialize the data to store it, as localStorage only supports strings.
        // We pass a replacer to handle things that don't serialize well, like React components for icons.
        window.localStorage.setItem(key, JSON.stringify(valueToStore, (k, v) => k === 'icon' ? undefined : v));
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  // This effect runs once on mount on the client to get the initial value.
  useEffect(() => {
    setStoredValue(getStoredValue());
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return [storedValue, setValue];
}
