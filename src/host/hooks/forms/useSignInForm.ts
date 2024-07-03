import { useForm } from 'react-hook-form';
import { useSignIn } from '../network/useLoginUser';
import { useHost } from '../../context/HostContext';
import { TokenStage, UIStateType } from '../../types/context';

export interface SignInFormValues {
  email: string;
  password: string;
}

export const useSignInForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>();
  const { isLoading, response, error, status, signIn } = useSignIn();
  const { setUIState, saveAuthToken, saveRewardsToken } = useHost();

  const onSubmit = async (data: SignInFormValues) => {
    const result = await signIn(data);
    if (result) {
      const user = result.status.data?.user;

      if (user?.rewards_token) {
        await saveRewardsToken({
          token: user.rewards_token,
          stage: TokenStage.loginAuth,
        });
      }

      if (result.authHeader) {
        await saveAuthToken({
          token: result.authHeader,
          stage: TokenStage.loginAuth,
        });
      }

      if (!user?.active_campaign?.id) {
        setUIState(UIStateType.ShowTeamForm);
      } else {
        setUIState(UIStateType.ShowStore);
      }

      console.log('Logged in successfully!', user);
    } else {
      console.log('Error logging in.');
    }
  };

  const onSignUpPress = () => {
    setUIState(UIStateType.ShowSignUpForm);
  };

  const onClosePress = () => {
    setUIState(UIStateType.ShowStore);
  };

  return {
    control,
    handleSubmit,
    errors,
    isLoading,
    response,
    error,
    status,
    onSubmit,
    onSignUpPress,
    onClosePress,
  };
};
