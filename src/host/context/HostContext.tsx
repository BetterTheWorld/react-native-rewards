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

interface HostContextType {
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
  setEnvKeys: (keys: RewardsTypes['keys']) => void;
}

const HostContext = createContext<HostContextType | undefined>(undefined);

interface HostProviderProps {
  children: ReactNode;
  envKeys: RewardsTypes['keys'];
}

export const HostProvider = ({
  children,
  envKeys: initialEnvKeys,
}: HostProviderProps) => {
  const [rewardsToken, setRewardsToken] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [envKeys, setEnvKeys] = useState<RewardsTypes['keys']>(initialEnvKeys);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isDefaultToken =
    rewardsToken === process.env.EXPO_PUBLIC_US_DEFAULT_REWARDS_TOKEN ||
    rewardsToken === process.env.EXPO_PUBLIC_CA_DEFAULT_REWARDS_TOKEN;
  const webViewRef = useRef<WebView>(null);
  const [uiState, updateUIstate] = useState<UIStateType>(
    UIStateType.ShowCountryPicker
  );

  const setUIState = (newState: UIStateType) => {
    updateUIstate(newState);
    saveItemSecurely(UI_STATE_KEY, newState);
  };

  const selectCountryToken = async (countryToken: string) => {
    saveRewardsToken({
      token: countryToken,
      stage: TokenStage.defaultPartner,
    });
  };

  const saveAuthToken = async ({ token, stage }: TokenInput) => {
    setIsLoading(true);
    const tokenInfo = JSON.stringify({ token, stage });
    console.info('[saveAuthToken]', tokenInfo);
    setAuthToken(token);
    saveItemSecurely(STORAGE_AUTH_TOKEN_KEY, tokenInfo);
    setIsLoading(false);
  };

  const saveRewardsToken = async ({ token, stage }: TokenInput) => {
    setIsLoading(true);
    const tokenInfo = JSON.stringify({ token, stage });
    saveItemSecurely(STORAGE_REWARDS_TOKEN_KEY, tokenInfo);
    setRewardsToken(token);
    setIsLoading(false);
  };

  const resetToken = async (tokenType: TokenTypes) => {
    setIsLoading(true);
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

    setIsLoading(false);
  };

  const refreshWebView = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
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
        setEnvKeys,
      }}
    >
      {children}
      {isLoading && <ModalLoader visible={isLoading} />}
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
