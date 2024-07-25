import type { ActiveCampaign, RewardsPartner } from './forms';

export interface DeviceUpdateProps {
  device: {
    fcm_token: string;
    device_id?: string;
  };
}

export interface DeviceUpdateInputPayload {
  device: {
    fcm_token: string;
    device_id: string;
  };
}

export interface UpdateDeviceInfoResponseData {
  data: {
    active_campaign: ActiveCampaign;
    city: string;
    country: string;
    email: string;
    first_name: string | null;
    full_name: string;
    id: number;
    last_name: string;
    postal_code: string;
    rewards_partner: RewardsPartner;
    rewards_partner_id: string;
    rewards_token: string;
    state: string | null;
  };
}
