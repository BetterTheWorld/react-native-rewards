import React, { useMemo } from 'react';
import { Text } from 'react-native';
import { HostCommander } from '../../host/components/hostCommander';
import { HostProvider } from '../../host/context/HostContext';
import { useLoadKeysToEnv } from '../../host/hooks/config/useLoadEnvKeys';
import type { RewardsTypes } from '../../host/types/modules';

export function ShopRewards({
  keys,
  theme,
  customComponents,
  utmParameters,
}: RewardsTypes) {
  const memoizedKeys = useMemo(() => keys, [keys]);
  const { loadedKeys } = useLoadKeysToEnv(memoizedKeys);

  if (!keys) {
    return <Text>Error: Please add keys props</Text>;
  }

  if (!loadedKeys) {
    return customComponents?.CustomModalLoader || null;
  }

  return (
    <HostProvider
      envKeys={loadedKeys}
      customTheme={theme}
      customComponents={customComponents}
      utmParameters={utmParameters}
    >
      <HostCommander />
    </HostProvider>
  );
}
