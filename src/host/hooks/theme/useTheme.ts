import { useMemo } from 'react';
import { useHost } from '../../context/HostContext';
import { hostColors } from '../../styles/colors';

export function useTheme() {
  const { theme } = useHost();

  const memoizedTheme = useMemo(() => {
    return {
      colors: {
        ...hostColors,
        ...theme?.colors,
      },
    };
  }, [theme]);

  return memoizedTheme;
}
