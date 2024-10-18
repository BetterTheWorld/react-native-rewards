import React, { useCallback, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { WebView as RNWebView } from 'react-native-webview';
import { FadeWrapper } from '../../components/animation/FadeWrapper';
import { useWebView } from '../../hooks/webStore/useWebView';
import type { WebViewComponent } from '../../types/webView';
import { webViewStyles } from './styles';

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
    restorePreviousSesion,
  } = useWebView();
  const webViewURL = getURL(baseURL);
  // https://github.com/react-native-webview/react-native-webview/issues/3062
  // https://github.com/tiddly-gittly/TidGi-Mobile/commit/6de1fdf3cad6b8556ebb827345a3bdfacaca12ac
  // webview termination after x minutes
  const [autoIncrementingNumber, setAutoIncrementingNumber] = useState(0);

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
        key={autoIncrementingNumber}
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
        javaScriptEnabled
        domStorageEnabled
        decelerationRate="normal"
        onContentProcessDidTerminate={(_) => {
          // IOS
          setAutoIncrementingNumber(autoIncrementingNumber + 1);
          restorePreviousSesion();
        }}
        onRenderProcessGone={(_) => {
          // Android
          setAutoIncrementingNumber(autoIncrementingNumber + 1);
          restorePreviousSesion();
        }}
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
