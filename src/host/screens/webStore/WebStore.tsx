import React, { useCallback } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { WebView as RNWebView } from 'react-native-webview';
import { FadeWrapper } from '../../components/animation/FadeWrapper';
import { useWebView } from '../../hooks/webStore/useWebView';
import type { WebViewComponent } from '../../types/webView';
import { webViewStyles } from './styles';
import { useWebviewLink } from '../../hooks/webStore/useWebviewLink';
import { useWebViewBackButton } from '../../hooks/webStore/useWebViewBackButton';

export function WebViewShop({
  baseURL,
  loaderColor,
  ...webviewProps
}: WebViewComponent) {
  const {
    onTouchEvent,
    onNavigationStateChange,
    onLoadProgress,
    webViewRef,
    onWebViewScroll,
    getURL,
    handleMessage,
    siteConfig,
  } = useWebView();
  const webViewURL = getURL(baseURL);
  useWebviewLink({ getURL, siteConfig });
  useWebViewBackButton();

  const renderLoading = useCallback(
    () => (
      <View style={webViewStyles.activityIndicatorWrapper}>
        <ActivityIndicator
          style={webViewStyles.activityIndicator}
          size="large"
          color={loaderColor}
        />
      </View>
    ),
    [loaderColor]
  );

  return (
    <FadeWrapper style={styles.container}>
      <RNWebView
        ref={webViewRef}
        source={{
          uri: webViewURL.href,
        }}
        startInLoadingState={true}
        originWhitelist={['*']}
        renderLoading={renderLoading}
        onNavigationStateChange={onNavigationStateChange}
        onLoadProgress={onLoadProgress}
        onScroll={onWebViewScroll}
        onTouchStart={onTouchEvent('start')}
        onTouchEnd={onTouchEvent('end')}
        webviewDebuggingEnabled={__DEV__}
        onMessage={handleMessage}
        decelerationRate="normal"
        {...webviewProps}
      />
    </FadeWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
