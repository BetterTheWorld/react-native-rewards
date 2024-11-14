import { useState } from 'react';
import type {
  CreateUserResponse,
  UserCreateStatus,
  UserCreateInput,
} from '../../types/forms';
import { useHost } from '../../context/HostContext';
import axios from 'axios';

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
    const config = {
      method: 'POST',
      url,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-REWARDS-PARTNER-ID':
          envKeys.REWARDS_PROPS_X_REWARDS_PARTNER_ID || '',
      },
      data: { user: userData },
    };

    try {
      const axiosResponse = await axios(config);

      const authHeader = (axiosResponse.headers.authorization || '').replace(
        'Bearer ',
        ''
      );

      const data: CreateUserResponse = axiosResponse.data;

      if (axiosResponse.status !== 200) {
        setError(
          `HTTP error! status: ${axiosResponse.status || axiosResponse.statusText}`
        );
        setStatus({
          message: `HTTP error! status: ${axiosResponse.status || axiosResponse.statusText}`,
          code: axiosResponse.status,
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
      setStatus({ message: (err as Error).message, code: 500 });

      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, response, error, status, createUser };
};
