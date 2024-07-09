import React from 'react';
import { useEffect, useState } from 'react';
import { ModalLoader } from '../../components/ModalLoader';
import { TokenTypes } from '../../constants';
import { useHost } from '../../context/HostContext';
import { useTokenInit } from '../../hooks/token/useTokenInit';

export function LogoutScreen() {
  const { resetToken, customComponents } = useHost();
  const [loading, setLoading] = useState(false);
  const { initializeRewardsToken } = useTokenInit({ automatic: false });

  useEffect(() => {
    const resetAuth = async () => {
      setLoading(true);
      await resetToken(TokenTypes.AUTH);
      await resetToken(TokenTypes.REWARDS);
      setTimeout(async () => {
        await initializeRewardsToken();
        setLoading(false);
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
