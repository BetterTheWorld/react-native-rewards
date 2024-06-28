// useThemeChange.ts
import { useEffect, useState } from 'react';
import { hostColors } from '../../styles/colors';

type Theme = {
  colors?: Partial<typeof hostColors>;
};

export function useThemeChange(initialTheme?: Theme) {
  const [theme, setTheme] = useState({
    colors: { ...hostColors, ...initialTheme?.colors },
  });

  const updateColors = (newColors?: Partial<typeof hostColors>) => {
    setTheme({
      colors: { ...hostColors, ...newColors },
    });
  };

  useEffect(() => {
    if (initialTheme?.colors) {
      updateColors(initialTheme.colors);
    }
  }, [initialTheme]);

  return { theme, updateColors };
}
