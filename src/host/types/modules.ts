import type { hostColors } from '../styles/colors';

export interface RewardsTypes {
  keys: {
    REWARDS_PROPS_US_DEFAULT_REWARDS_TOKEN?: string;
    REWARDS_PROPS_CA_DEFAULT_REWARDS_TOKEN?: string;
    REWARDS_PROPS_BASE_URL: string;
    REWARDS_PROPS_GOOGLE_API_KEY?: string;
    REWARDS_PROPS_API_URL: string;
    REWARDS_PROPS_X_REWARDS_PARTNER_ID: string;
  };
  theme?: {
    colors?: Partial<typeof hostColors>;
  };
}
