import { useState } from 'react';
import { useHost } from '../../context/HostContext';
import type { TeamCreatePayload, TeamCreateInput } from '../../types/forms';
import axios, { AxiosError } from 'axios';

interface ErrorResponse {
  errors?: Array<{
    message: string;
  }>;
}

export const useCreateTeam = () => {
  const { authToken, envKeys } = useHost();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TeamCreatePayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createTeam = async (input: TeamCreateInput) => {
    setIsLoading(true);

    const url = envKeys.REWARDS_PROPS_API_URL + '/campaigns';
    const config = {
      method: 'POST',
      url,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-REWARDS-PARTNER-ID':
          envKeys.REWARDS_PROPS_X_REWARDS_PARTNER_ID || '',
        'Authorization': `Bearer ${authToken}`,
      },
      data: {
        campaign: {
          name: input.campaign.name,
          sport_category: input.campaign.sport_category,
          country: input.campaign.country,
          state: input.campaign.state,
          postal_code: input.campaign.postal_code,
          city: input.campaign.city,
        },
      },
    };

    try {
      const response = await axios(config);
      const result = response.data;

      if ('data' in result) {
        setData(result);
        return response;
      } else {
        setError(result?.errors?.[0]?.message || 'An error occurred');
        return undefined;
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        setError(
          axiosError.response?.data?.errors?.[0]?.message || axiosError.message
        );
      } else {
        setError((err as Error).message);
      }
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  return { createTeam, isLoading, data, error };
};
