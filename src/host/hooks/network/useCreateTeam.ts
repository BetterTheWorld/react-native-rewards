import { useState } from 'react';
import { useHost } from '../../context/HostContext';
import type { TeamCreatePayload, TeamCreateInput } from '../../types/forms';

export const useCreateTeam = () => {
  const { authToken } = useHost();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TeamCreatePayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createTeam = async (input: TeamCreateInput) => {
    setIsLoading(true);

    const body = {
      campaign: {
        name: input.campaign.name,
        sport_category: input.campaign.sport_category,
        country: input.campaign.country,
        state: input.campaign.state,
        postal_code: input.campaign.postal_code,
        city: input.campaign.city,
      },
    };

    const url = process.env.EXPO_PUBLIC_API_URL + '/campaigns';

    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-REWARDS-PARTNER-ID':
          process.env.EXPO_PUBLIC_X_REWARDS_PARTNER_ID || '',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(body),
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      if (response.ok) {
        setData(result);
        return response;
      } else {
        setError(result?.errors?.[0]?.message || 'An error occurred');
        return undefined;
      }
    } catch (err) {
      setError((err as Error).message);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  return { createTeam, isLoading, data, error };
};
