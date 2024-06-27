import { useEffect, useState } from 'react';
import type { RewardsTypes } from '../../types/modules';

export function useLoadKeysToEnv(keys: RewardsTypes['keys'] | undefined) {
  const [loadedKeys, setLoadedKeys] = useState<RewardsTypes['keys'] | null>(
    null
  );
  const [isLoading, setIsloading] = useState<boolean>(true);

  useEffect(() => {
    if (!keys) {
      return;
    }
    setIsloading(true);
    Object.entries(keys).forEach(([key, value]) => {
      process.env[key] = value;
    });
    setLoadedKeys(keys);
    setIsloading(false);
  }, [keys, setLoadedKeys]);

  return { loadedKeys, isLoadingKeys: isLoading };
}
