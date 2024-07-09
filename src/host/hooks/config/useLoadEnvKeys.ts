import { useEffect, useState, useCallback } from 'react';
import type { RewardsTypes } from '../../types/modules';
import { saveItemSecurely } from '../../utils/secureStore';
import ConfigManager from '../../utils/config/ConfigManager';

type RewardsKeys = RewardsTypes['keys'];
type RewardsK = keyof RewardsKeys;

export function useLoadKeysToEnv(keys: RewardsKeys | undefined) {
  const [loadedKeys, setLoadedKeys] = useState<RewardsKeys | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const loadKeys = async () => {
      if (!keys) {
        return;
      }
      setIsLoading(true);
      // Initialize ConfigManager with the keys
      ConfigManager.getInstance(keys);
      await saveKeysToStorage(keys);
      setLoadedKeys(keys);
    };
    loadKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys]);

  return { loadedKeys, isLoadingKeys: isLoading };
}
