import React from 'react';
import { ModalLoader } from '../../components/ModalLoader';
import { View } from 'react-native';

export function NoInternetScreen() {
  return (
    <View>
      <ModalLoader visible={true} text="No Internet" />
    </View>
  );
}
