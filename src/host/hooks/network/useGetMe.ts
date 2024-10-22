import { useState, useEffect, useCallback } from 'react';
import { useHost } from '../../context/HostContext';
import type { User, UserResponse } from '../../types/forms';
import { NetworkError } from '../../utils/networkErrors';

export const useGetMe = () => {
  const { authToken, envKeys, setUser } = useHost();
  const [userData, setUserData] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(
    async ({ localToken }: { localToken: string }) => {
      const url = envKeys.REWARDS_PROPS_API_URL + '/users/me';
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localToken || authToken}`,
          'X-REWARDS-PARTNER-ID': envKeys.REWARDS_PROPS_X_REWARDS_PARTNER_ID,
        },
      };

      try {
        const response = await fetch(url || '', options);

        if (!response || !response.ok) {
          console.error(
            'Failed to fetch user:',
            response.statusText || response.status
          );
          return;
        }

        const { data }: UserResponse = await response.json();
        console.info('[useGetMe]', data);
        setUserData(data.user);
        setUser(data.user);
        return data;
      } catch (error: any) {
        if (
          error instanceof TypeError &&
          error.message === 'Network request failed'
        ) {
          throw new NetworkError('No internet connection');
        }
        console.error('Failed to fetch user:', error);
        throw error;
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
      const fetchData = async () => {
        try {
          await fetchUser({ localToken: authToken });
        } catch (error) {
          console.error('Error fetching user data in useEffect:', error);
        }
      };
      fetchData();
    }
  }, [authToken, fetchUser]);

  return { isLoading, userData, fetchUser };
};
