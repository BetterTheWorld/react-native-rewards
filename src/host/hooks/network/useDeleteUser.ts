import { useState } from 'react';
import { useHost } from '../../context/HostContext';

type DeleteUserResponse = {
  data: {
    message: string;
  };
};

type DeleteUserStatus = {
  error?: string;
  message?: string;
};

export const useDeleteUser = () => {
  const { envKeys, authToken } = useHost();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<DeleteUserResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<DeleteUserStatus | null>(null);

  const deleteUser = async ({
    localToken,
  }: {
    localToken?: string;
  }): Promise<DeleteUserResponse | null> => {
    setIsLoading(true);

    const url = envKeys.REWARDS_PROPS_API_URL + '/users/delete';
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localToken || authToken}`,
      'X-REWARDS-PARTNER-ID': envKeys.REWARDS_PROPS_X_REWARDS_PARTNER_ID,
    };

    try {
      const fetchResponse = await fetch(url, {
        method: 'DELETE',
        headers,
      });

      if (!fetchResponse.ok) {
        const errorData = await fetchResponse.json();
        setError(errorData.error || 'Failed to delete user');
        setStatus({ error: errorData.error || 'Failed to delete user' });
      } else {
        const data: DeleteUserResponse = await fetchResponse.json();
        setResponse(data);
        setStatus({
          error: '',
          message: data.data.message,
        });
        setError(null);
        return data;
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError((err as Error).message);
      setResponse(null);
      setStatus({ error: (err as Error).message });
    } finally {
      setIsLoading(false);
    }

    return null;
  };

  return { isLoading, response, error, status, deleteUser };
};
