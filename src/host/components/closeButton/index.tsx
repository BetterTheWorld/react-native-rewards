import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { type ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/theme/useTheme';

export const CloseButton: React.FC<{
  onPress: () => void;
  viewContainerStyle?: ViewStyle;
}> = ({ onPress, viewContainerStyle }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, viewContainerStyle]}>
      <TouchableOpacity
        style={[styles.button, { shadowColor: colors.black }]}
        onPress={onPress}
      >
        <View style={styles.inner}>
          <Text style={styles.text}>×</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    zIndex: 10, // Ensure the container is on top
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: 'black',
  },
});
