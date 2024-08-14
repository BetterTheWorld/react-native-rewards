import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UseFirstRunProps = {
  storageKey?: string;
};

type UseFirstRunResult = {
  isFirstRun: boolean;
  isLoading: boolean;
};

export const useFirstRun = ({
  storageKey = 'APP_FIRST_RUN_CHECK',
}: UseFirstRunProps = {}): UseFirstRunResult => {
  const [isFirstRun, setIsFirstRun] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkFirstRun = async () => {
      try {
        const value = await AsyncStorage.getItem(storageKey);
        if (value === null) {
          await AsyncStorage.setItem(storageKey, 'false');
          setIsFirstRun(true);
        } else {
          setIsFirstRun(false);
        }
      } catch (error) {
        setIsFirstRun(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstRun();
  }, [storageKey]);

  return { isFirstRun, isLoading };
};
