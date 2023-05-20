import React from "react";

export const useLocalStorage = <T>(storageKey: string, fallbackState: T) => {
  const storedValue = localStorage.getItem(storageKey);

  const [value, setValue] = React.useState<T>(storedValue ? JSON.parse(storedValue) : fallbackState);

  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue] as const;
};
