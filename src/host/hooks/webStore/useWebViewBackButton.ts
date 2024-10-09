import { useEffect, useCallback } from 'react';
import { BackHandler, Platform } from 'react-native';
import { UIStateType } from '../../types/context';
import { useHost } from '../../context/HostContext';

export function useWebViewBackButton() {
  const { webViewRef, navChangeRef, uiState, options } = useHost();

  const handleBackPress = useCallback(() => {
    const canGoBack = navChangeRef.current?.canGoBack;

    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
  }, [webViewRef, navChangeRef]);

  useEffect(() => {
    if (!options?.useAndroidHardwareBack) return;

    if (Platform.OS === 'ios') return;

    if (uiState !== UIStateType.ShowStore) return;

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    return () => {
      backHandler.remove();
    };
  }, [handleBackPress, options?.useAndroidHardwareBack, uiState]);
}
