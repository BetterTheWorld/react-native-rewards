import { useState } from 'react';
import { useHost } from '../../context/HostContext';
import type {
  SignInError,
  SignInResponse,
  SignInStatus,
  UserLoginInput,
} from '../../types/forms';

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

      if (!fetchResponse.ok) {
        const errorData: SignInError = await fetchResponse.json();
        setError(errorData.error);
        setStatus({
          code: fetchResponse.status,
          message: errorData.error,
        });
      } else {
        const data: SignInResponse = await fetchResponse.json();
        setResponse({ ...data, authHeader });
        setStatus(data.status);
        setError(null);
        return { ...data, authHeader };
      }
    } catch (err) {
      console.error('Failed to sign in:', err);
      setError((err as Error).message);
      setResponse(null);
      setStatus({ code: 500, message: (err as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, response, error, status, signIn };
};
