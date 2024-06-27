import { useState } from 'react';
import type { User } from '../../types/forms';

interface UserInput {
  email: string;
  password: string;
}

interface SignInStatus {
  code: number;
  message: string;
  data?: {
    user: User;
  };
}

interface SignInResponse {
  status: SignInStatus;
  authHeader: string;
}

interface SignInError {
  error: string;
}

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<SignInResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<SignInStatus | null>(null);

  const signIn = async (
    userData: UserInput
  ): Promise<SignInResponse | void> => {
    setIsLoading(true);

    const url = process.env.EXPO_PUBLIC_API_URL + '/users/sign_in';
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
