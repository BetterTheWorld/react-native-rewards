import { useCallback } from 'react';
import { useHost } from '../../context/HostContext';

export function useResetWebview() {
  const { webViewRef } = useHost();

  const resetWebViewHistory = useCallback(() => {
    // reset props if deeplinkUrl is present

    webViewRef.current?.clearCache?.(true);
    webViewRef.current?.clearHistory?.();
    setTimeout(() => {
      webViewRef.current?.reload?.();
    }, 200);
  }, [webViewRef]);

  return { resetWebViewHistory };
}
