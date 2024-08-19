import { SafeAreaView, StyleSheet } from 'react-native';
import { ShopRewards } from '@flipgive/react-native-rewards/components';
import { useFirstRun } from './useFirstRun';
// import { CustomForgotPasswordScreen } from './custom/CustomForgotPasswordScreen';
// import { CustomInitialScreen } from './custom/CustomInitialScreen';
// import { CustomCountryPicker } from './custom/CustomCountryPicker';
// import { CustomSignInScreen } from './custom/CustomSignInScreen';
// import { CustomSignUpScreen } from './custom/CustomSignUpScreen';
// import { CustomCreateTeamScreen } from './custom/CustomCreateTeamScreen';
// import { CustomModalLoader } from './custom/CustomModalLoader';

export default function App() {
  const { isFirstRun, isLoading } = useFirstRun();

  if (isLoading) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ShopRewards
        keys={{
          REWARDS_PROPS_US_DEFAULT_REWARDS_TOKEN:
            process.env.EXPO_PUBLIC_US_DEFAULT_REWARDS_TOKEN || '',
          // REWARDS_PROPS_CA_DEFAULT_REWARDS_TOKEN:
          //   process.env.EXPO_PUBLIC_CA_DEFAULT_REWARDS_TOKEN || '',
          REWARDS_PROPS_BASE_URL: process.env.EXPO_PUBLIC_BASE_URL || '',
          REWARDS_PROPS_GOOGLE_API_KEY:
            process.env.EXPO_PUBLIC_GOOGLE_API_KEY || '',
          REWARDS_PROPS_API_URL: process.env.EXPO_PUBLIC_API_URL || '',
          REWARDS_PROPS_X_REWARDS_PARTNER_ID:
            process.env.EXPO_PUBLIC_X_REWARDS_PARTNER_ID || '',
        }}
        // theme={{
        //   colors: {
        //     primaryColor: 'peru',
        //   },
        // }}
        // customComponents={{
        //   // CustomCountryPicker,
        //   // CustomSignInScreen,
        //   // CustomSignUpScreen,
        //   // CustomCreateTeamScreen,
        //   // CustomModalLoader,
        //   // CustomInitialScreen,
        //   // CustomForgotPasswordScreen,
        // }}
        options={{
          shouldResetKeychain: isFirstRun,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
