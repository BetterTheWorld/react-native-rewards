import { useHost } from '@flipgive/react-native-rewards/hooks';
import { useEffect, useRef } from 'react';

export function useWebviewLink({
  getURL,
  siteConfig,
}: {
  getURL: (deeplinkUrl?: string) => URL;
  siteConfig: { base: string; defaultToken: string | null };
}) {
  const { webViewRef, deeplink, navChangeRef } = useHost();

  const prevDeeplinkRef = useRef<string | null>(null);
  const currentUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      deeplink &&
      (deeplink !== prevDeeplinkRef.current ||
        currentUrlRef.current !== siteConfig.base) &&
      deeplink.trim() !== ''
    ) {
      const newUrl = getURL(deeplink);

      webViewRef.current?.injectJavaScript(`
        (function() {
          window.location.href = "${newUrl.href}";
        })();
      `);
      prevDeeplinkRef.current = deeplink;
      currentUrlRef.current = newUrl.href;
    }
  }, [deeplink, getURL, webViewRef, siteConfig.base]);

  useEffect(() => {
    if (!deeplink) return;

    if (navChangeRef.current?.url !== currentUrlRef.current) {
      prevDeeplinkRef.current = null;
      currentUrlRef.current = navChangeRef.current?.url || '';
    }
  }, [deeplink, navChangeRef]);

  return {};
}
