import { useState, useEffect, useCallback } from 'react';
import { useHost } from '../../context/HostContext';
import type { User, UserResponse } from '../../types/forms';
import axios, { AxiosError } from 'axios';

export const useGetMe = () => {
  const { authToken, envKeys, setUser } = useHost();
  const [userData, setUserData] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(
    async ({ localToken }: { localToken: string }) => {
      const url = envKeys.REWARDS_PROPS_API_URL + '/users/me';
      const config = {
        method: 'GET',
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localToken || authToken}`,
          'X-REWARDS-PARTNER-ID': envKeys.REWARDS_PROPS_X_REWARDS_PARTNER_ID,
        },
      };

      try {
        const response = await axios(config);
        const { data }: UserResponse = response.data;

        console.info('[useGetMe]', data);
        setUserData(data.user);
        setUser(data.user);
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          console.error(
            'Failed to fetch user:',
            axiosError.response?.statusText || axiosError.response?.status
          );
        } else {
          console.error('Failed to fetch user:', error);
        }
        return;
      } finally {
        setIsLoading(false);
      }
    },
    [
      authToken,
      envKeys.REWARDS_PROPS_API_URL,
      envKeys.REWARDS_PROPS_X_REWARDS_PARTNER_ID,
      setUser,
    ]
  );

  useEffect(() => {
    if (authToken) {
      fetchUser({ localToken: authToken });
    }
  }, [authToken, fetchUser]);

  return { isLoading, userData, fetchUser };
};
