import { useState } from 'react';
import { useHost } from '../../context/HostContext';
import axios, { AxiosError } from 'axios';

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
    const config = {
      method: 'PUT',
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
      const data: ResetPasswordResponse = axiosResponse.data;

      setResponse(data);
      setStatus({ message: 'Success', code: axiosResponse.status });
      setError(null);
      return data;
    } catch (err) {
      console.error('Failed to send reset password instructions:', err);
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        const errorMessage = `HTTP error! status: ${axiosError.response?.status || axiosError.response?.statusText}`;
        setError(errorMessage);
        setStatus({
          message: errorMessage,
          code: axiosError.response?.status || 500,
        });
      } else {
        setError((err as Error).message);
        setStatus({ message: (err as Error).message, code: 500 });
      }
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, response, error, status, sendResetPasswordInstructions };
};
