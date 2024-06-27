import type { Category } from './fields';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type TeamCreateInput = {
  campaign: {
    name: string;
    sport_category: string;
    country: string;
    state: string;
    postal_code: string;
    city: string;
  };
};

export type MutationError = {
  input: string;
  inputErrors: string[];
};

export type Campaign = {
  id: string;
  category: Category;
};

export type TeamCreatePayload = {
  campaign: Campaign;
};

export type TeamCreateResponse = {
  errors?: MutationError[];
  payload?: TeamCreatePayload;
};

export interface SignUpFormValues {
  fullName: string;
  email: string;
  password: string;
}

export interface UserInput {
  email: string;
  password: string;
  full_name: string;
  country: string;
  postal_code: string;
  city: string;
  state: string | null;
}

interface ActiveCampaign {
  id: number;
  name: string;
  sport_category: string;
  country: string;
  state: string | null;
  city: string;
  postal_code: string;
  data: Record<string, unknown>;
  join_code: string;
  rewards_partner_id: string;
}

interface UserCreateData {
  id: number;
  email: string;
  full_name: string;
  first_name: string;
  last_name: string;
  rewards_partner_id: string;
  city: string;
  state: string | null;
  country: string;
  postal_code: string;
  rewards_token: string;
  active_campaign: ActiveCampaign;
}

export interface CreateUserResponse {
  data: UserCreateData;
  authHeader: string;
}

export interface UserCreateStatus {
  message: string;
  code: number;
}

export interface RewardsPartner {
  id: string;
  name: string;
  single_member_teams: boolean;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  first_name: string;
  last_name: string;
  rewards_partner_id: string;
  city: string;
  state: string | null;
  country: string;
  postal_code: string;
  rewards_token: string;
  active_campaign?: ActiveCampaign;
  rewards_partner: RewardsPartner;
}

interface Data {
  user: User;
}

export interface UserResponse {
  data: Data;
}
