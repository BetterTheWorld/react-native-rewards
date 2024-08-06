// HostContext.tsx
import React, { createContext, useContext, useState, useRef } from 'react';
import WebView from 'react-native-webview';
import { type ReactNode } from 'react';
import { ModalLoader } from '../components/ModalLoader';
import {
  TokenTypes,
  UI_STATE_KEY,
  STORAGE_AUTH_TOKEN_KEY,
  STORAGE_REWARDS_TOKEN_KEY,
} from '../constants';
import { UIStateType, type TokenInput, TokenStage } from '../types/context';
import { saveItemSecurely, deleteItemSecurely } from '../utils/secureStore';
import type { RewardsTypes } from '../types/modules';
import { useThemeChange } from '../hooks/config/useThemeChanged';

export interface HostContextType {
  authToken: string | null;
  rewardsToken: string | null;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  selectCountryToken: (countryToken: string) => Promise<void>;
  setRewardsToken: React.Dispatch<React.SetStateAction<string | null>>;
  setAuthToken: React.Dispatch<React.SetStateAction<string | null>>;
  resetToken: (tokenType: TokenTypes) => Promise<void>;
  setError: (errorMessage: string | null) => void;
  isDefaultToken: boolean;
  webViewRef: React.RefObject<WebView>;
  refreshWebView: () => void;
  uiState: UIStateType;
  setUIState: (newState: UIStateType) => void;
  saveRewardsToken: ({ token, stage }: TokenInput) => Promise<void>;
  saveAuthToken: ({ token, stage }: TokenInput) => Promise<void>;
  envKeys: RewardsTypes['keys'];
  theme: RewardsTypes['theme'];
  customComponents: RewardsTypes['customComponents'];
  utmParameters?: string;
}

const HostContext = createContext<HostContextType | undefined>(undefined);

interface HostProviderProps {
  children: ReactNode;
  envKeys: RewardsTypes['keys'];
  customTheme: RewardsTypes['theme'];
  customComponents: RewardsTypes['customComponents'];
  utmParameters?: string;
}

export const HostProvider = ({
  children,
  envKeys,
  customTheme,
  customComponents,
  utmParameters,
}: HostProviderProps) => {
  const [rewardsToken, setRewardsToken] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isDefaultToken =
    rewardsToken === envKeys.REWARDS_PROPS_US_DEFAULT_REWARDS_TOKEN ||
    rewardsToken === envKeys.REWARDS_PROPS_CA_DEFAULT_REWARDS_TOKEN;
  const webViewRef = useRef<WebView>(null);
  const [uiState, updateUIstate] = useState<UIStateType>(
    UIStateType.ShowCountryPicker
  );
  const { theme } = useThemeChange(customTheme);

  const setUIState = (newState: UIStateType) => {
    updateUIstate(newState);
    saveItemSecurely(UI_STATE_KEY, newState);
  };

  const selectCountryToken = async (countryToken: string) => {
    saveRewardsToken({ token: countryToken, stage: TokenStage.defaultPartner });
  };

  const saveAuthToken = async ({ token, stage }: TokenInput) => {
    const tokenInfo = JSON.stringify({ token, stage });
    setAuthToken(token);
    saveItemSecurely(STORAGE_AUTH_TOKEN_KEY, tokenInfo);
  };

  const saveRewardsToken = async ({ token, stage }: TokenInput) => {
    const tokenInfo = JSON.stringify({ token, stage });
    saveItemSecurely(STORAGE_REWARDS_TOKEN_KEY, tokenInfo);
    setRewardsToken(token);
  };

  const resetToken = async (tokenType: TokenTypes) => {
    deleteItemSecurely(
      tokenType === TokenTypes.REWARDS
        ? STORAGE_REWARDS_TOKEN_KEY
        : STORAGE_AUTH_TOKEN_KEY
    );

    if (tokenType === TokenTypes.REWARDS) {
      setRewardsToken(null);
    } else {
      setAuthToken(null);
    }
  };

  const refreshWebView = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const renderModalLoader = () => {
    if (!isLoading) return null;

    if (customComponents?.CustomModalLoader)
      return <customComponents.CustomModalLoader />;

    return <ModalLoader visible={isLoading} />;
  };

  return (
    <HostContext.Provider
      value={{
        authToken,
        rewardsToken,
        isLoading,
        saveRewardsToken,
        saveAuthToken,
        error,
        selectCountryToken,
        resetToken,
        setError,
        setIsLoading,
        setRewardsToken,
        setAuthToken,
        isDefaultToken,
        webViewRef,
        refreshWebView,
        setUIState,
        uiState,
        envKeys,
        theme,
        customComponents,
        utmParameters,
      }}
    >
      {children}
      {/* is loading needed for multiple modals issue */}
      {renderModalLoader()}
      {/* {error && <ModalLoader visible={true} />} */}
    </HostContext.Provider>
  );
};

export const useHost = () => {
  const context = useContext(HostContext);
  if (context === undefined) {
    throw new Error('useHost must be used within a HostProvider');
  }
  return context;
};
