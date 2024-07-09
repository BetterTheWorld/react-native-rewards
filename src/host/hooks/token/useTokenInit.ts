import { useCallback, useEffect } from 'react';
import { useGetMe } from '../network/useGetMe';
import {
  STORAGE_REWARDS_TOKEN_KEY,
  TokenTypes,
  STORAGE_AUTH_TOKEN_KEY,
} from '../../constants';
import { useHost } from '../../context/HostContext';
import { type TokenInput, UIStateType, TokenStage } from '../../types/context';
import { getItemSecurely } from '../../utils/secureStore';

export const useTokenInit = ({ automatic = true }: { automatic: boolean }) => {
  const {
    setIsLoading,
    setUIState,
    saveRewardsToken,
    resetToken,
    setRewardsToken,
    setAuthToken,
    envKeys,
  } = useHost();
  const { fetchUser } = useGetMe();

  const initializeRewardsToken = async () => {
    const storedRewardsToken = (await getItemSecurely(
      STORAGE_REWARDS_TOKEN_KEY
    )) as TokenInput | null;

    if (!storedRewardsToken?.token) {
      const usToken = envKeys.REWARDS_PROPS_US_DEFAULT_REWARDS_TOKEN;
      const cadToken = envKeys.REWARDS_PROPS_CA_DEFAULT_REWARDS_TOKEN;
      if (usToken && cadToken) {
        setUIState(UIStateType.ShowCountryPicker);
      } else if (usToken || cadToken) {
        const token = usToken || cadToken || '';
        saveRewardsToken({
          token,
          stage: TokenStage.defaultPartner,
        });
        setUIState(UIStateType.ShowStore);
      } else {
        resetToken(TokenTypes.REWARDS);
        console.error(
          'No default reward token available. The application cannot continue.'
        );
        throw new Error(
          'No default reward token are available. The application cannot continue.'
        );
      }

      return;
    }

    // loads the token from storage
    setRewardsToken(storedRewardsToken.token);
    setUIState(UIStateType.ShowStore);
  };

  const initializeAuthToken = async () => {
    const storedToken = (await getItemSecurely(
      STORAGE_AUTH_TOKEN_KEY
    )) as TokenInput | null;

    if (!storedToken?.token) {
      resetToken(TokenTypes.AUTH);
      console.info('No auth token available.');
      return;
    }

    setAuthToken(storedToken.token);

    return storedToken.token;
  };

  const initCall = useCallback(async () => {
    setIsLoading(true);

    try {
      initializeRewardsToken();
      const storedAuthToken = await initializeAuthToken();

      if (storedAuthToken) {
        const result = await fetchUser({ localToken: storedAuthToken });
        const campaignId = result?.user?.active_campaign?.id;
        if (!campaignId) {
          setUIState(UIStateType.ShowTeamForm);
        } else {
          setUIState(UIStateType.ShowStore);
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [envKeys]);

  useEffect(() => {
    if (!automatic) return;
    initCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [envKeys]);

  return { initializeRewardsToken };
};
