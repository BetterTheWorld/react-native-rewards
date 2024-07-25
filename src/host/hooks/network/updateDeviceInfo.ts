import { useState } from 'react';
import { useHost } from '../../context/HostContext';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { STORAGE_DEVICE_ID } from '../../constants';
import { getItemSecurely, saveItemSecurely } from '../../utils/secureStore';
import type {
  DeviceUpdateInputPayload,
  DeviceUpdateProps,
  UpdateDeviceInfoResponseData,
} from '../../types/pushNotifications';

export interface DeviceUpdateSuccessResponse {
  data: {
    data: UpdateDeviceInfoResponseData;
  };
}

export interface DeviceUpdateErrorResponse {
  error: string;
  message: string;
}

export type DeviceUpdateResponse =
  | DeviceUpdateSuccessResponse
  | DeviceUpdateErrorResponse;

export const useUpdateDeviceInfo = () => {
  const { authToken, envKeys } = useHost();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DeviceUpdateSuccessResponse | null>(null);
  const [error, setError] = useState<DeviceUpdateErrorResponse | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  const fetchOrGenerateDeviceId = async () => {
    let fetchedUUID = (await getItemSecurely(STORAGE_DEVICE_ID)) as string;

    if (!fetchedUUID) {
      const newUUID = uuidv4();

      await saveItemSecurely(STORAGE_DEVICE_ID, newUUID);
      fetchedUUID = newUUID;
    }
    setDeviceId(fetchedUUID);

    return fetchedUUID;
  };

  const updateDeviceInfo = async (
    input: DeviceUpdateProps
  ): Promise<DeviceUpdateResponse | undefined> => {
    const storedDeviceId = await fetchOrGenerateDeviceId();

    setIsLoading(true);

    const url = envKeys.REWARDS_PROPS_API_URL + '/users';

    const fullInput: DeviceUpdateInputPayload = {
      ...input,
      device: {
        ...input.device,
        device_id: storedDeviceId,
      },
    };

    const options = {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-REWARDS-PARTNER-ID':
          envKeys.REWARDS_PROPS_X_REWARDS_PARTNER_ID || '',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(fullInput),
    };

    try {
      const response = await fetch(url, options);
      const result: DeviceUpdateResponse = await response.json();

      if (response.ok && 'data' in result) {
        setData(result);
        setError(null);
        return result;
      } else {
        const errorResponse: DeviceUpdateErrorResponse = {
          error: 'error' in result ? result.error : 'An unknown error occurred',
          message:
            'message' in result
              ? result.message
              : 'Failed to update device info',
        };
        setError(errorResponse);
        setData(null);
        return errorResponse;
      }
    } catch (err) {
      const errorResponse: DeviceUpdateErrorResponse = {
        error: (err as Error).message,
        message: 'An error occurred while updating device info',
      };
      setError(errorResponse);
      setData(null);
      return errorResponse;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateDeviceInfo,
    isLoading,
    data,
    error,
    deviceId,
    fetchOrGenerateDeviceId,
  };
};
