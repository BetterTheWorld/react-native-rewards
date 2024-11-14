import { useState } from 'react';
import { useHost } from '../../context/HostContext';
import type {
  SignInError,
  SignInResponse,
  SignInStatus,
  UserLoginInput,
} from '../../types/forms';
import axios, { AxiosError } from 'axios';

export const useSignIn = () => {
  const { envKeys } = useHost();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<SignInResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<SignInStatus | null>(null);

  const signIn = async (
    userData: UserLoginInput
  ): Promise<SignInResponse | void> => {
    setIsLoading(true);

    const url = envKeys.REWARDS_PROPS_API_URL + '/users/sign_in';
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

      const data: SignInResponse = axiosResponse.data;
      setResponse({ ...data, authHeader });
      setStatus(data.status);
      setError(null);
      return { ...data, authHeader };
    } catch (err) {
      console.error('Failed to sign in:', err);
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<SignInError>;
        const errorMessage =
          axiosError.response?.data?.error || axiosError.message;
        setError(errorMessage);
        setStatus({
          code: axiosError.response?.status || 500,
          message: errorMessage,
        });
      } else {
        setError((err as Error).message);
        setStatus({ code: 500, message: (err as Error).message });
      }
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, response, error, status, signIn };
};
