import React from 'react';
import { Button, View, StyleSheet } from 'react-native';
import { useHost } from '../../context/HostContext';

export const WebViewDebugBtns: React.FC = () => {
  const { webViewRef } = useHost();

  const injectJavaScript = (code: string) => {
    console.info('Injecting JavaScript:', code);
    const wrappedCode = `
      (function() {
        ${code}
      })();
    `;
    webViewRef.current?.injectJavaScript(wrappedCode);
  };

  const handleLogin = () => {
    injectJavaScript(`
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'AUTH_FORM_REQUESTED'
      }));
    `);
  };

  const handleLogout = () => {
    injectJavaScript(`
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'LOGOUT_REQUESTED'
      }));
    `);
  };

  const handleOptIn = () => {
    injectJavaScript(`
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'USER_DATA_REQUIRED'
      }));
    `);
  };

  return (
    <View style={styles.container}>
      <Button title="Login" onPress={handleLogin} />
      <Button title="Logout" onPress={handleLogout} />
      <Button title="Opt In" onPress={handleOptIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
