import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export function useBackButton({
  handler,
  disabled,
}: {
  handler: () => boolean;
  disabled?: boolean;
}) {
  useEffect(() => {
    const backAction = () => {
      const shouldHandleBackButton = handler();
      return shouldHandleBackButton;
    };

    if (disabled) {
      return;
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => {
      backHandler.remove();
    };
  }, [handler, disabled]);
  return null;
}
