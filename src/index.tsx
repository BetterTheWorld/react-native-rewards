import React from 'react';
import { HostCommander } from './host/components/hostCommander';
import { HostProvider } from './host/context/HostContext';

export function ShopRewards() {
  return (
    <HostProvider>
      <HostCommander />
    </HostProvider>
  );
}
