import React from 'react';
import { Text } from 'react-native';
import { ModalLoader } from '../../host/components/ModalLoader';
import { HostCommander } from '../../host/components/hostCommander';
import { HostProvider } from '../../host/context/HostContext';
import { useLoadKeysToEnv } from '../../host/hooks/config/useLoadEnvKeys';
import type { RewardsTypes } from '../../host/types/modules';

export function ShopRewards({ keys }: RewardsTypes) {
  const { loadedKeys } = useLoadKeysToEnv(keys);

  if (!keys) {
    return <Text>Error: Please add keys props</Text>;
  }

  if (!loadedKeys) {
    return <ModalLoader visible />;
  }
  return (
    <HostProvider envKeys={loadedKeys}>
      <HostCommander />
    </HostProvider>
  );
}
