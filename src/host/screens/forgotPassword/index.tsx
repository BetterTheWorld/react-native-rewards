import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useTheme } from '../../hooks/theme/useTheme';
import { useResetPassword } from '../../hooks/network/useResetPassword';
import { FadeWrapper } from '../../components/animation/FadeWrapper';
import { CloseButton } from '../../components/closeButton';
import { useHost } from '../../context/HostContext';
import { UIStateType } from '../../types/context';

type ForgotPasswordFormData = {
  email: string;
};

export const ForgotPasswordScreen: React.FC = () => {
  const { setUIState } = useHost();
  const { colors } = useTheme();
  const { control, handleSubmit, formState } =
    useForm<ForgotPasswordFormData>();
  const { isLoading, error, status, sendResetPasswordInstructions, response } =
    useResetPassword();

  console.info('ForgotPasswordScreen: isLoading', response);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await sendResetPasswordInstructions(data);
  };

  const onClosePress = () => {
    setUIState(UIStateType.ShowLoginForm);
  };

  const inputStyles = [styles.input, { borderColor: colors.lightGray }];

  return (
    <FadeWrapper style={styles.container}>
      <CloseButton
        onPress={onClosePress}
        viewContainerStyle={styles.closeButton}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsHorizontalScrollIndicator={false}
        >
          <View style={[styles.card, { shadowColor: colors.black }]}>
            <Text style={styles.title}>Forgot Password</Text>

            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email format',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    style={inputStyles}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {formState.errors.email?.message ? (
                    <Text style={styles.errorText}>
                      {formState.errors.email?.message}
                    </Text>
                  ) : null}
                </>
              )}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}
            {status && status.code === 200 && (
              <Text style={styles.successText}>
                {response?.data?.message || status.message}
              </Text>
            )}

            <TouchableOpacity
              style={[
                styles.resetButton,
                { backgroundColor: colors.primaryColor },
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              <Text style={styles.resetButtonText}>
                {isLoading ? 'Sending...' : 'Send Reset Instructions'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </FadeWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderRadius: 7,
    marginBottom: 10,
  },
  resetButton: {
    width: '100%',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    alignSelf: 'flex-start',
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  successText: {
    color: 'green',
    fontSize: 12,
    marginBottom: 10,
  },
  scrollContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 14,
    alignSelf: 'flex-start',
  },
});
