import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

export const useAppState = ({
  executeAfterForeground = () => undefined,
}: {
  executeAfterForeground?: () => void;
}) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        executeAfterForeground?.();
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [executeAfterForeground]);

  return appStateVisible;
};
