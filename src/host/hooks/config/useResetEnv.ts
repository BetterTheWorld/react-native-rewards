import { useEffect, useState, useRef } from 'react';
import type { RewardsTypes } from '../../types/modules';
import { useHost } from '../../context/HostContext';
import { UIStateType } from '../../types/context';
import { getChangedKeys } from '../../utils/validations';

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
    const previousKeys = previousKeysRef.current;
    let keysChanged = false;
    let keysThatChanged: ChangedKeys = {};

    if (previousKeys) {
      keysThatChanged = getChangedKeys(keys, previousKeys);
      keysChanged = Object.keys(keysThatChanged).length > 0;
    }

    if (keysChanged && previousKeys) {
      setIsLoading(true);
      reset(keysThatChanged);
      setChangedKeys(keysThatChanged);
      setIsLoading(false);
    }

    previousKeysRef.current = keys;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys]);

  return { changedKeys };
}
