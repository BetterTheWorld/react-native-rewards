import React from 'react';
import { useEffect, useState } from 'react';
import { ModalLoader } from '../../components/ModalLoader';
import { TokenTypes } from '../../constants';
import { useHost } from '../../context/HostContext';
import { UIStateType } from '../../types/context';

export function LogoutScreen() {
  const { resetToken, setUIState, customComponents } = useHost();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const resetAuth = () => {
      setLoading(true);
      resetToken(TokenTypes.AUTH);
      resetToken(TokenTypes.REWARDS);
      setTimeout(() => {
        setLoading(false);
        setUIState(UIStateType.ShowCountryPicker);
      }, 1500);
    };

    resetAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return customComponents?.CustomLogoutScreen ? (
    <customComponents.CustomLogoutScreen />
  ) : (
    <ModalLoader visible={loading} text="Logging out" />
  );
}
