import React from 'react';
// import { useEffect } from 'react';

import { CountrySelector } from '../../screens/countrySelect';
import { useHost } from '../../context/HostContext';
import { useInitializers } from '../../hooks/context/useInitializers';
import { SignInScreen } from '../../screens/auth/signIn';
import { SignUpScreen } from '../../screens/auth/signUp';
import { LogoutScreen } from '../../screens/logout';
import { CreateTeamScreen } from '../../screens/teamForm';
import { WebViewShop } from '../../screens/webStore/WebStore';
import { UIStateType } from '../../types/context';
// import { deleteItemSecurely } from '@/host/utils/secureStore';
// import {
//   STORAGE_AUTH_TOKEN_KEY,
//   STORAGE_REWARDS_TOKEN_KEY,
//   UI_STATE_KEY,
// } from '@/host/constants';

export function HostCommander() {
  const { rewardsToken, uiState } = useHost();
  useInitializers();

  // useEffect(() => {
  //   deleteItemSecurely(STORAGE_REWARDS_TOKEN_KEY);
  //   deleteItemSecurely(STORAGE_AUTH_TOKEN_KEY);
  //   deleteItemSecurely(UI_STATE_KEY);
  // }, []);

  const currentStep = () => {
    switch (uiState) {
      case UIStateType.ShowCountryPicker:
        return <CountrySelector />;
      case UIStateType.ShowSignUpForm:
        return <SignUpScreen />;
      case UIStateType.ShowLoginForm:
        return <SignInScreen />;
      case UIStateType.ShowTeamForm:
        return <CreateTeamScreen />;
      case UIStateType.ShowLogout:
        return <LogoutScreen />;
      case UIStateType.ShowStore:
      default:
        return (
          <WebViewShop
            baseURL={`${process.env.EXPO_PUBLIC_BASE_URL}/?token=${rewardsToken}`}
          />
        );
    }
  };

  return currentStep();
}
