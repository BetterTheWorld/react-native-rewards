import { useEffect, useState, useCallback, useRef } from 'react';
import type { RewardsTypes } from '../../types/modules';
import { saveItemSecurely } from '../../utils/secureStore';
import ConfigManager from '../../utils/config/ConfigManager';
import { deepEqual } from '../../utils/validations';

type RewardsKeys = RewardsTypes['keys'];
type RewardsK = keyof RewardsKeys;

export function useLoadKeysToEnv(keys: RewardsKeys | undefined) {
  const [loadedKeys, setLoadedKeys] = useState<RewardsKeys | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const prevKeysRef = useRef<RewardsKeys | undefined>();

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
      if (!keys || deepEqual(keys, prevKeysRef.current)) {
        return;
      }
      setIsLoading(true);
      // Initialize ConfigManager with the keys
      ConfigManager.getInstance(keys);
      await saveKeysToStorage(keys);
      setLoadedKeys(keys);
      prevKeysRef.current = keys;
    };
    loadKeys();
  }, [keys, saveKeysToStorage]);

  return { loadedKeys, isLoadingKeys: isLoading };
}
