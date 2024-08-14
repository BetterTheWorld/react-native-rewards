import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { HostCommander } from '../../host/components/hostCommander';
import { HostProvider } from '../../host/context/HostContext';
import { useLoadKeysToEnv } from '../../host/hooks/config/useLoadEnvKeys';
import type { RewardsTypes } from '../../host/types/modules';
import { useKeychainCleanup } from '../../host/hooks/config/useCleanKeyChain';

export function ShopRewards({ ...props }: RewardsTypes) {
  const { customComponents, options } = props;
  const { isLoading: isCleaningStorage } = useKeychainCleanup({
    shouldResetKeychain: options?.shouldResetKeychain ?? false,
    keys: props.keys,
  });

  if (isCleaningStorage) {
    return customComponents?.CustomModalLoader ? (
      <customComponents.CustomModalLoader />
    ) : (
      <View />
    );
  }

  return <ShopRewardsRender {...props} />;
}

function ShopRewardsRender({
  keys,
  theme,
  customComponents,
  utmParameters,
  children,
}: RewardsTypes) {
  const memoizedKeys = useMemo(() => keys, [keys]);
  const { loadedKeys } = useLoadKeysToEnv(memoizedKeys);

  if (!keys) {
    return <Text>Error: Please add keys props</Text>;
  }

  if (!loadedKeys) {
    return customComponents?.CustomModalLoader ? (
      <customComponents.CustomModalLoader />
    ) : (
      <View />
    );
  }

  return (
    <HostProvider
      envKeys={loadedKeys}
      customTheme={theme}
      customComponents={customComponents}
      utmParameters={utmParameters}
    >
      <HostCommander />
      {children}
    </HostProvider>
  );
}
