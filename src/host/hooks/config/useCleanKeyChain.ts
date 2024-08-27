import { useEffect, useState } from 'react';
import {
  STORAGE_AUTH_TOKEN_KEY,
  STORAGE_DEVICE_ID,
  STORAGE_REWARDS_TOKEN_KEY,
  STORAGE_SELECTED_COUNTRY_KEY,
  UI_STATE_KEY,
} from '../../constants';
import { deleteItemSecurely } from '../../utils/secureStore';
import ConfigManager from '../../utils/config/ConfigManager';
import type { RewardsTypes } from '../../types/modules';

type RewardsKeys = RewardsTypes['keys'];

export const useKeychainCleanup = ({
  shouldResetKeychain,
  keys,
}: {
  shouldResetKeychain: boolean;
  keys: RewardsKeys | undefined;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const cleanupSecureStore = async () => {
    try {
      ConfigManager.getInstance(keys);
      const allKeys = await getAllSecureStoreKeys();

      for (const key of allKeys) {
        console.log('Cleaning up SecureStore key:', key);
        await deleteItemSecurely(key);
      }

      console.log('SecureStore cleaned up successfully');
    } catch (error) {
      console.error('Error cleaning up SecureStore:', error);
    }
  };

  const getAllSecureStoreKeys = async () => {
    return [
      STORAGE_REWARDS_TOKEN_KEY,
      STORAGE_AUTH_TOKEN_KEY,
      UI_STATE_KEY,
      STORAGE_SELECTED_COUNTRY_KEY,
      STORAGE_DEVICE_ID,
    ];
  };

  useEffect(() => {
    const performCleanup = async () => {
      try {
        if (shouldResetKeychain) {
          setIsLoading(true);
          await cleanupSecureStore();
          setIsLoading(false);
        }
      } catch (error) {
        // error
      } finally {
        setIsLoading(false);
      }
    };

    performCleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldResetKeychain]);

  return { isLoading };
};
