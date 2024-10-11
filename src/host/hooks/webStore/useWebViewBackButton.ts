import { useCallback } from 'react';
import { useHost } from '../../context/HostContext';
import { useBackButton } from '../utils/useBackButton';
import { Platform } from 'react-native';

export function useWebViewBackButton() {
  const { webViewRef, navChangeRef } = useHost();

  const handleBackPress = useCallback(() => {
    if (Platform.OS === 'ios') {
      return false;
    }

    const canGoBack = navChangeRef.current?.canGoBack;

    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
  }, [webViewRef, navChangeRef]);

  useBackButton({
    handler: handleBackPress,
  });
}
