import { useCallback, useRef, useState } from 'react';
import { Linking, Platform } from 'react-native';
import { type WebViewNavigation } from 'react-native-webview';
import {
  type WebViewErrorEvent,
  type WebViewMessageEvent,
  type WebViewNativeProgressEvent,
  type WebViewProgressEvent,
} from 'react-native-webview/lib/WebViewTypes';
import { useBackButton } from '../utils/useBackButton';
import { useWebViewAnimate } from './useWebViewAnimate';
import { useAppState } from '../utils/useAppState';
import { useHost } from '../../context/HostContext';
import { UIStateType } from '../../types/context';
import { MessageTypes } from '../../types/messages';

export function useWebView() {
  const { rewardsToken, webViewRef, setUIState, envKeys, utmParameters } =
    useHost();
  const customToken = rewardsToken;
  const siteConfig = {
    base: envKeys.REWARDS_PROPS_BASE_URL,
    defaultToken: rewardsToken,
  };
  const eventRef = useRef<WebViewNativeProgressEvent>();
  const navChangeRef = useRef<WebViewNavigation>();
  const {
    offset,
    onWebViewScroll,
    onTouchEvent,
    animatedHeight,
    animatedOpacity,
    animatedTranslateY,
  } = useWebViewAnimate({ fixedValue: 0.1 });
  const [isModalVisible, setModalVisible] = useState(false);

  const goBackHandler = ({ onRootBack }: { onRootBack: () => void }) => {
    if (navChangeRef.current?.canGoBack) {
      webViewRef.current?.goBack();
    } else {
      onRootBack();
    }
  };

  useBackButton({
    handler: () => {
      // goBackHandler({ onRootBack: navigation.goBack });
      return true;
    },
  });
  // Fix bug coming back from browser, webview is not refreshed making the user stuck on shop intent brand page
  useAppState({
    executeAfterForeground: () => {
      if (Platform.OS === 'android') {
        return;
      }
      /*
        If the loaded url is a shop intent url, we don't want to go forward.
      */
      if (
        !eventRef.current?.url ||
        eventRef.current?.url.includes(siteConfig.base || '')
      ) {
        return;
      }
      // webViewRef.current?.stopLoading();
      // webViewRef.current?.goBack();
    },
  });

  const onNavigationStateChange = useCallback(
    async (event: WebViewNavigation) => {
      navChangeRef.current = event;

      return;
    },
    []
  );

  const dispatchNewWindow = (url: string) => {
    Linking.openURL(url);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handlePromptSubmit = (inputValue: string | null) => {
    if (!inputValue) {
      return;
    }

    webViewRef?.current?.injectJavaScript(
      `(function() { window?.updateToken?.("${inputValue}") })()`
    );
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    const message = event.nativeEvent.data;

    if (message.includes(MessageTypes.newWindow)) {
      dispatchNewWindow(message.replace(MessageTypes.newWindow, ''));
    }

    if (message.includes(MessageTypes.authForm)) {
      setUIState(UIStateType.ShowLoginForm);
    }

    if (message.includes(MessageTypes.logout)) {
      setUIState(UIStateType.ShowLogout);
    }
  };

  const onLoadProgress = (event: WebViewProgressEvent) => {
    eventRef.current = event.nativeEvent;
  };

  const getURL = useCallback(
    (deeplinkUrl?: string) => {
      const defaultURL = siteConfig.base;

      let url = new URL(deeplinkUrl || defaultURL || '');

      if (customToken || siteConfig.defaultToken) {
        url.searchParams.append(
          'token',
          customToken || siteConfig.defaultToken || ''
        );
      }

      if (utmParameters) {
        url = new URL(`${url.href}&${utmParameters}`);
      }

      return url;
    },
    [customToken, siteConfig.base, siteConfig.defaultToken, utmParameters]
  );

  const onError = useCallback(
    (syntheticEvent: WebViewErrorEvent) => {
      const { nativeEvent } = syntheticEvent;

      console.warn('WebView error:', nativeEvent);

      if (
        nativeEvent.code === -1 &&
        nativeEvent.description === 'ERR_CACHE_MISS'
      ) {
        console.warn(
          'WebView encountered ERR_CACHE_MISS. Attempting to clear cache and reload.'
        );

        if (webViewRef.current) {
          // Clear cache
          webViewRef?.current?.clearCache?.(true);

          // Reload the WebView
          webViewRef.current.reload();
        }
      } else {
        console.error('WebView error:', nativeEvent);
      }
    },
    [webViewRef]
  );

  return {
    onNavigationStateChange,
    onLoadProgress,
    webViewRef,
    customToken,
    offset,
    onWebViewScroll,
    onTouchEvent,
    navChangeRef,
    getURL,
    animatedHeight,
    animatedOpacity,
    animatedTranslateY,
    handleMessage,
    goBackHandler,
    handleCloseModal,
    isModalVisible,
    handlePromptSubmit,
    onError,
  };
}
