import { useEffect, useState, useRef } from 'react';
import type { RewardsTypes } from '../../types/modules';
import { useHost } from '../../context/HostContext';
import { UIStateType } from '../../types/context';

type ChangedKeys = {
  [K in keyof RewardsTypes['keys']]?: boolean;
};

export function useResetEnv() {
  const { setUIState, envKeys: keys, setIsLoading } = useHost();
  const previousKeysRef = useRef<RewardsTypes['keys'] | null>(null);
  const [changedKeys, setChangedKeys] = useState<ChangedKeys>({});

  const reset = (keysThatChanged: ChangedKeys) => {
    console.info('[useResetEnv] Reset!');
    if (
      keysThatChanged.REWARDS_PROPS_US_DEFAULT_REWARDS_TOKEN ||
      keysThatChanged.REWARDS_PROPS_CA_DEFAULT_REWARDS_TOKEN ||
      keysThatChanged.REWARDS_PROPS_X_REWARDS_PARTNER_ID
    ) {
      setUIState(UIStateType.ShowLogout);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const previousKeys = previousKeysRef.current;
    let keysChanged = false;
    const keysThatChanged: ChangedKeys = {};

    if (previousKeys) {
      for (const key in keys) {
        if (
          keys[key as keyof RewardsTypes['keys']] !==
          previousKeys[key as keyof RewardsTypes['keys']]
        ) {
          keysChanged = true;
          keysThatChanged[key as keyof RewardsTypes['keys']] = true;
        }
      }
    }

    if (keysChanged && previousKeys) {
      // Call your reset method here
      reset(keysThatChanged);
      setChangedKeys(keysThatChanged);
    }

    // Update the ref for the next comparison
    previousKeysRef.current = keys;
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys]);

  return { changedKeys };
}
