import * as React from 'react';

import { SafeAreaView, StyleSheet } from 'react-native';
import { ShopRewards } from '@flipgive/react-native-rewards';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ShopRewards />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
