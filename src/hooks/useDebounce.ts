import { useEffect, useState } from "react";

/**
 * Returns a debounced version of `value` that only updates
 * after `delay` milliseconds have elapsed since the last change.
 *
 * @param value - The value to debounce.
 * @param delay - Debounce delay in milliseconds (default: 400ms).
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
