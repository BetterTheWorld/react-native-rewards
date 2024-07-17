import { useState } from 'react';
import {
  Button,
  Text,
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  useResetPassword,
  useHost,
} from '@flipgive/react-native-rewards/hooks';
import { UIStateType } from '@flipgive/react-native-rewards/types';

export function CustomForgotPasswordScreen() {
  const { setUIState } = useHost();
  const { sendResetPasswordInstructions, isLoading, error, status } =
    useResetPassword();
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    sendResetPasswordInstructions({ email });
  };

  const onClosePress = () => {
    setUIState(UIStateType.ShowLoginForm);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          title="Send Reset Instructions"
          onPress={handleSubmit}
          disabled={!email}
        />
      )}

      <Button title="Close" onPress={onClosePress} />

      {error && <Text style={styles.errorText}>{error}</Text>}
      {status && status.code === 200 && (
        <Text style={styles.successText}>{status.message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  successText: {
    color: 'green',
    marginBottom: 10,
  },
});
