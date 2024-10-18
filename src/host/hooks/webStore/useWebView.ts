import { useCallback, useRef, useState } from 'react';
import { Linking } from 'react-native';
import { type WebViewNavigation } from 'react-native-webview';
import {
  type WebViewMessageEvent,
  type WebViewNativeProgressEvent,
  type WebViewProgressEvent,
} from 'react-native-webview/lib/WebViewTypes';
import { useWebViewAnimate } from './useWebViewAnimate';
import { useHost } from '../../context/HostContext';
import { UIStateType } from '../../types/context';
import { MessageTypes } from '../../types/messages';
import { useDeleteUser } from '../network/useDeleteUser';
import { TokenTypes } from '../../constants';

export function useWebView() {
  const {
    rewardsToken,
    webViewRef,
    setUIState,
    envKeys,
    customMethods,
    navChangeRef,
    setIsLoading,
    resetToken,
  } = useHost();
  const customToken = rewardsToken;
  const siteConfig = {
    base: envKeys.REWARDS_PROPS_BASE_URL,
    defaultToken: rewardsToken,
  };
  const eventRef = useRef<WebViewNativeProgressEvent>();
  const { deleteUser } = useDeleteUser();
  const {
    offset,
    onWebViewScroll,
    onTouchEvent,
    animatedHeight,
    animatedOpacity,
    animatedTranslateY,
  } = useWebViewAnimate({ fixedValue: 0.1 });
  const [isModalVisible, setModalVisible] = useState(false);

  const onNavigationStateChange = useCallback(
    async (event: WebViewNavigation) => {
      navChangeRef.current = event;

      customMethods?.onNavigationStateChange?.(event);

      return;
    },
    [customMethods, navChangeRef]
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

  const onDeleteMessage = async () => {
    setIsLoading(true);
    try {
      const response = await deleteUser({});
      if (response) {
        customMethods?.onDeleteUserAccount?.({ response });
        await resetToken(TokenTypes.AUTH);
        await resetToken(TokenTypes.REWARDS);
        setUIState(UIStateType.ShowLogout);
      } else {
        customMethods?.onDeleteUserAccount?.({
          error: Error('Failed to delete user'),
        });
      }
    } catch (error) {
      customMethods?.onDeleteUserAccount?.({ error });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessage = async (event: WebViewMessageEvent) => {
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

    if (message.includes(MessageTypes.delete)) {
      onDeleteMessage();
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

      return url;
    },
    [customToken, siteConfig.base, siteConfig.defaultToken]
  );

  //  https://github.com/react-native-webview/react-native-webview/issues/3062
  const restorePreviousSesion = () => {
    const currentUrl = navChangeRef.current?.url;

    if (currentUrl) {
      setTimeout(() => {
        webViewRef.current?.injectJavaScript(
          `
          (function() {
            window.location.href = "${getURL(currentUrl).href}";
          })();
          `
        );
      }, 1500);
    }
  };

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
    handleCloseModal,
    isModalVisible,
    handlePromptSubmit,
    siteConfig,
    restorePreviousSesion,
  };
}
