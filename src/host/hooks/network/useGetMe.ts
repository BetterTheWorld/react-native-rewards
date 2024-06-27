import { useState, useEffect, useCallback } from 'react';
import { useHost } from '../../context/HostContext';
import type { User, UserResponse } from '../../types/forms';

export const useGetMe = () => {
  const { authToken } = useHost();
  const [userData, setUserData] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(
    async ({ localToken }: { localToken: string }) => {
      const url = process.env.EXPO_PUBLIC_API_URL + '/users/me';
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localToken || authToken}`,
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
        setUserData(data.user);
        return data;
      } catch (error) {
        console.error('Failed to fetch user:', error);
        return;
      } finally {
        setIsLoading(false);
      }
    },
    [authToken]
  );

  useEffect(() => {
    if (authToken) {
      fetchUser({ localToken: authToken });
    }
  }, [authToken, fetchUser]);

  return { isLoading, userData, fetchUser };
};
