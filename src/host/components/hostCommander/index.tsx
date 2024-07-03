import React from 'react';
import { CountrySelector } from '../../screens/countrySelect';
import { useHost } from '../../context/HostContext';
import { useInitializers } from '../../hooks/context/useInitializers';
import { SignInScreen } from '../../screens/auth/signIn';
import { SignUpScreen } from '../../screens/auth/signUp';
import { LogoutScreen } from '../../screens/logout';
import { CreateTeamScreen } from '../../screens/teamForm';
import { WebViewShop } from '../../screens/webStore/WebStore';
import { UIStateType } from '../../types/context';

export function HostCommander() {
  const { rewardsToken, uiState, envKeys, customComponents } = useHost();
  useInitializers();

  const currentStep = () => {
    switch (uiState) {
      case UIStateType.ShowCountryPicker:
        return customComponents?.CustomCountryPicker ? (
          <customComponents.CustomCountryPicker />
        ) : (
          <CountrySelector />
        );
      case UIStateType.ShowSignUpForm:
        return customComponents?.CustomSignUpScreen ? (
          <customComponents.CustomSignUpScreen />
        ) : (
          <SignUpScreen />
        );
      case UIStateType.ShowLoginForm:
        return customComponents?.CustomSignInScreen ? (
          <customComponents.CustomSignInScreen />
        ) : (
          <SignInScreen />
        );
      case UIStateType.ShowTeamForm:
        return customComponents?.CustomCreateTeamScreen ? (
          <customComponents.CustomCreateTeamScreen />
        ) : (
          <CreateTeamScreen />
        );
      case UIStateType.ShowLogout:
        return <LogoutScreen />;
      case UIStateType.ShowStore:
      default:
        const WebViewComponent =
          customComponents?.CustomWebViewShop || WebViewShop;
        return (
          <WebViewComponent
            baseURL={`${envKeys.REWARDS_PROPS_BASE_URL}/?token=${rewardsToken}`}
          />
        );
    }
  };

  return currentStep();
}
