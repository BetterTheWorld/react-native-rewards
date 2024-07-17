import { useState } from 'react';
import { useHost } from '../../context/HostContext';

type ResetPasswordInput = {
  email: string;
};

type ResetPasswordResponse = {
  data: {
    message: string;
  };
};

type ResetPasswordStatus = {
  message: string;
  code: number;
};

export const useResetPassword = () => {
  const { envKeys } = useHost();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ResetPasswordResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ResetPasswordStatus | null>(null);

  const sendResetPasswordInstructions = async (
    userData: ResetPasswordInput
  ): Promise<ResetPasswordResponse | void> => {
    if (!userData || !userData.email) return;

    setIsLoading(true);

    const url = `${envKeys.REWARDS_PROPS_API_URL}/users/send_reset_password_instructions`;
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-REWARDS-PARTNER-ID': envKeys.REWARDS_PROPS_X_REWARDS_PARTNER_ID || '',
    };

    const body = JSON.stringify({ user: userData });

    try {
      const fetchResponse = await fetch(url, {
        method: 'PUT',
        headers,
        body,
      });

      const data: ResetPasswordResponse = await fetchResponse.json();

      if (!fetchResponse.ok) {
        setError(
          `HTTP error! status: ${fetchResponse.status || fetchResponse.statusText}`
        );
        setStatus({
          message: `HTTP error! status: ${fetchResponse.status || fetchResponse.statusText}`,
          code: fetchResponse.status,
        });
      } else {
        setResponse(data);
        setStatus({ message: 'Success', code: fetchResponse.status });
        setError(null);
        return data;
      }
    } catch (err) {
      console.error('Failed to send reset password instructions:', err);
      setError((err as Error).message);
      setResponse(null);
      setStatus({ message: (err as Error).message, code: 500 });
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, response, error, status, sendResetPasswordInstructions };
};
