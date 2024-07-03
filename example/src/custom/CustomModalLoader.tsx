import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';

export function CustomModalLoader() {
  return (
    <Modal style={styles.container}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="red" />
        <Text>Loading :D</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
