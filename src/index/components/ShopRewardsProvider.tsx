import React, { type PropsWithChildren } from 'react';
import { Text } from 'react-native';
import { ModalLoader } from '../../host/components/ModalLoader';
import { HostProvider } from '../../host/context/HostContext';
import { useLoadKeysToEnv } from '../../host/hooks/config/useLoadEnvKeys';
import type { RewardsTypes } from '../../host/types/modules';

type ShopProviderProps = PropsWithChildren<RewardsTypes>;

export function ShopRewardsProvider({
  keys,
  theme,
  customComponents,
  children,
}: ShopProviderProps) {
  const { loadedKeys } = useLoadKeysToEnv(keys);

  if (!keys) {
    return <Text>Error: Please add keys props</Text>;
  }

  if (!loadedKeys) {
    return <ModalLoader visible />;
  }

  return (
    <HostProvider
      envKeys={loadedKeys}
      customTheme={theme}
      customComponents={customComponents}
    >
      {children}
    </HostProvider>
  );
}
