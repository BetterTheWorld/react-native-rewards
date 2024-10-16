import type { WebViewNavigation } from 'react-native-webview';
import type { hostColors } from '../styles/colors';
import type { ComponentType } from 'react';
import type { DeleteUserResponse } from './misc';

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
  customComponents?: {
    CustomCountryPicker?: ComponentType;
    CustomSignUpScreen?: ComponentType;
    CustomSignInScreen?: ComponentType;
    CustomCreateTeamScreen?: ComponentType;
    CustomLogoutScreen?: ComponentType;
    CustomWebViewShop?: ComponentType<{ baseURL: string }>;
    CustomModalLoader?: ComponentType;
    CustomInitialScreen?: ComponentType;
    CustomForgotPasswordScreen?: ComponentType;
  };
  children?: React.ReactNode;
  options?: {
    shouldResetKeychain?: boolean;
    showWebDebugOptions?: boolean;
  };
  deeplink?: string;
  customMethods?: {
    onNavigationStateChange?: (navState: WebViewNavigation) => void;
    onDeleteUserAccount?: ({
      error,
      response,
    }: {
      error?: unknown;
      response?: DeleteUserResponse | null;
    }) => void;
  };
}
