import { useState } from 'react';
import type {
  CreateUserResponse,
  UserCreateStatus,
  UserInput,
} from '../../types/forms';

export const useCreateUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<CreateUserResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<UserCreateStatus | null>(null);

  const createUser = async (
    userData: UserInput
  ): Promise<CreateUserResponse | void> => {
    setIsLoading(true);

    const url = process.env.EXPO_PUBLIC_API_URL + '/users';
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-REWARDS-PARTNER-ID':
        process.env.EXPO_PUBLIC_X_REWARDS_PARTNER_ID || '',
    };

    const body = JSON.stringify({ user: userData });

    try {
      const fetchResponse = await fetch(url, {
        method: 'POST',
        headers,
        body: body,
      });

      console.info('Create user response:', fetchResponse);
      console.info('Create user response headers:', fetchResponse.headers);

      const authHeader = (
        fetchResponse.headers.get('Authorization') || ''
      ).replace('Bearer ', '');

      console.info('Create user response auth header:', authHeader);

      const data: CreateUserResponse = await fetchResponse.json();

      if (fetchResponse.status !== 200) {
        setError(`HTTP error! status: ${fetchResponse.status}`);
        setStatus({
          message: `HTTP error! status: ${fetchResponse.statusText}`,
          code: fetchResponse.status,
        });
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
