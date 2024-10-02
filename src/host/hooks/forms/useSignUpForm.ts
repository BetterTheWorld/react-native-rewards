import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateUser } from '../network/useCreateUser';
import { STORAGE_SELECTED_COUNTRY_KEY } from '../../constants';
import { useHost } from '../../context/HostContext';
import { UIStateType, TokenStage } from '../../types/context';
import type { SignUpFormValues } from '../../types/forms';
import { getItemSecurely } from '../../utils/secureStore';

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) || 'Invalid email format';
};

const validatePassword = (password: string) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return 'Password must contain at least one special character';
  }
  return true;
};

export const useSignUpForm = () => {
  const { setUIState, saveRewardsToken, saveAuthToken } = useHost();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const {
    createUser,
    error,
    response,
    status,
    isLoading: newtworkIsLoading,
  } = useCreateUser();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isLoading },
  } = useForm<SignUpFormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      utmData: undefined,
    },
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const onSignInPress = () => {
    setUIState(UIStateType.ShowLoginForm);
  };

  const onClosePress = () => {
    setUIState(UIStateType.ShowStore);
  };

  const onSubmit = async (
    data: SignUpFormValues,
    onSuccess?: () => Promise<void>
  ) => {
    const selectedCountry =
      (await getItemSecurely<string>(STORAGE_SELECTED_COUNTRY_KEY)) || '';

    const success = await createUser({
      email: data.email,
      password: data.password,
      full_name: data.fullName,
      country: data?.country || selectedCountry,
      postal_code: '',
      city: '',
      state: null,
      utm_data: data.utmData ?? null,
    });

    if (success && success.authHeader) {
      saveAuthToken({
        token: success.authHeader,
        stage: TokenStage.loginAuth,
      });
    }

    if (success && onSuccess) {
      await onSuccess();
    }

    if (success && success.data.rewards_token) {
      await saveRewardsToken({
        token: success.data.rewards_token,
        stage: TokenStage.loginAuth,
      });

      if (!success?.data?.active_campaign?.id) {
        setUIState(UIStateType.ShowTeamForm);
        return;
      }

      setUIState(UIStateType.ShowStore);
    }
  };

  return {
    control,
    handleSubmit,
    setValue,
    getValues,
    errors,
    isPasswordVisible,
    togglePasswordVisibility,
    onSubmit,
    isLoadingForm: isSubmitting || isLoading,
    validateEmail,
    validatePassword,
    networkError: error,
    networkResponse: response,
    networkStatus: status,
    newtworkIsLoading,
    onSignInPress,
    onClosePress,
  };
};
