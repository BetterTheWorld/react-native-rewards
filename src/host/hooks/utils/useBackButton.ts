import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export function useBackButton({ handler }: { handler: () => boolean }) {
  useEffect(() => {
    const backAction = () => {
      const shouldHandleBackButton = handler();
      return shouldHandleBackButton;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => {
      backHandler.remove();
    };
  }, [handler]);
  return null;
}
