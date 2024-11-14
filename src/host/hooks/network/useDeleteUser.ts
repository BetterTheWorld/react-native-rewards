import { useState } from 'react';
import { useHost } from '../../context/HostContext';
import type { DeleteUserResponse, DeleteUserStatus } from '../../types/misc';
import axios, { AxiosError } from 'axios';

interface ErrorResponse {
  error: string;
}

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
    const config = {
      method: 'DELETE',
      url,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localToken || authToken}`,
        'X-REWARDS-PARTNER-ID': envKeys.REWARDS_PROPS_X_REWARDS_PARTNER_ID,
      },
    };

    try {
      const axiosResponse = await axios(config);
      const data: DeleteUserResponse = axiosResponse.data;

      setResponse(data);
      setStatus({
        error: '',
        message: data.data.message,
      });
      setError(null);
      return data;
    } catch (err) {
      console.error('Failed to delete user:', err);
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        const errorMessage =
          axiosError.response?.data?.error || 'Failed to delete user';
        setError(errorMessage);
        setStatus({ error: errorMessage });
      } else {
        setError((err as Error).message);
        setStatus({ error: (err as Error).message });
      }
      setResponse(null);
    } finally {
      setIsLoading(false);
    }

    return null;
  };

  return { isLoading, response, error, status, deleteUser };
};
