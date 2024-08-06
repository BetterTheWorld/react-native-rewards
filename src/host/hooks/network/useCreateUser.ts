import { useState } from 'react';
import type {
  CreateUserResponse,
  UserCreateStatus,
  UserCreateInput,
} from '../../types/forms';
import { useHost } from '../../context/HostContext';

export const useCreateUser = () => {
  const { envKeys } = useHost();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<CreateUserResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<UserCreateStatus | null>(null);

  const createUser = async (
    userData: UserCreateInput
  ): Promise<CreateUserResponse | void> => {
    setIsLoading(true);
    setError(null);

    const url = envKeys.REWARDS_PROPS_API_URL + '/users';
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-REWARDS-PARTNER-ID': envKeys.REWARDS_PROPS_X_REWARDS_PARTNER_ID || '',
    };

    const body = JSON.stringify({ user: userData });

    try {
      const fetchResponse = await fetch(url, {
        method: 'POST',
        headers,
        body: body,
      });

      const authHeader = (
        fetchResponse.headers.get('Authorization') || ''
      ).replace('Bearer ', '');

      const data: CreateUserResponse = await fetchResponse.json();

      if (fetchResponse.status !== 200) {
        setError(
          `HTTP error! status: ${fetchResponse.status || fetchResponse.statusText}`
        );
        setStatus({
          message: `HTTP error! status: ${fetchResponse.status || fetchResponse.statusText}`,
          code: fetchResponse.status,
        });
        setResponse(data);
      } else {
        setResponse({ ...data, authHeader });
        setStatus({ message: 'Success', code: 200 });
        setError(null);
        return { ...data, authHeader };
      }
    } catch (err) {
      console.error('Failed to create user:', err);
      setError((err as Error).message);
      setResponse(null);
      setStatus({ message: (err as Error).message, code: 500 });
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, response, error, status, createUser };
};
