import { useEffect, useState, useCallback } from 'react';
import type { RewardsTypes } from '../../types/modules';
import { saveItemSecurely } from '../../utils/secureStore';

type RewardsKeys = {
  [key: string]: string;
};

type RewardsK = keyof RewardsTypes['keys'];

export function useLoadKeysToEnv(keys: RewardsTypes['keys'] | undefined) {
  const [loadedKeys, setLoadedKeys] = useState<RewardsTypes['keys'] | null>(
    null
  );
  const [isLoading, setIsloading] = useState<boolean>(true);

  const saveKeysToStorage = useCallback(async (newKeys: RewardsKeys) => {
    const keysToBeSaved: RewardsK[] = [
      'REWARDS_PROPS_US_DEFAULT_REWARDS_TOKEN',
      'REWARDS_PROPS_CA_DEFAULT_REWARDS_TOKEN',
    ];
    for (const key of keysToBeSaved) {
      console.info(`Saving ${key} to secure storage`);
      if (newKeys[key]) {
        await saveItemSecurely(key, newKeys[key] || '');
      }
    }
    setIsloading(false);
  }, []);

  useEffect(() => {
    const loadKeys = async () => {
      if (!keys) {
        return;
      }
      setIsloading(true);
      await saveKeysToStorage(keys as RewardsKeys);
      setLoadedKeys(keys);
    };
    loadKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys]);

  return { loadedKeys, isLoadingKeys: isLoading };
}
