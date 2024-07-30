import React, { useState } from 'react';
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
import { Controller } from 'react-hook-form';
import { useSignInForm } from '../../../hooks/forms/useSignInForm';
import { FadeWrapper } from '../../../components/animation/FadeWrapper';
import { CloseButton } from '../../../components/closeButton';
import { useTheme } from '../../../hooks/theme/useTheme';

export const SignInScreen: React.FC = () => {
  const {
    control,
    handleSubmit,
    errors,
    isLoading,
    error,
    onSubmit,
    onSignUpPress,
    onClosePress,
    onResetPasswordPress,
  } = useSignInForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { colors } = useTheme();
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
            <Text style={styles.title}>Log in & start earning</Text>

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
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                  )}
                </>
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{ required: 'Password is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={inputStyles}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Password"
                      secureTextEntry={!passwordVisible}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={styles.visibilityToggle}
                      onPress={() => setPasswordVisible(!passwordVisible)}
                    >
                      <Text>{passwordVisible ? '👁' : '👁‍🗨'}</Text>
                    </TouchableOpacity>
                  </View>
                  {errors.password && (
                    <Text style={styles.errorText}>
                      {errors.password.message}
                    </Text>
                  )}
                </>
              )}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: colors.primaryColor },
              ]}
              onPress={handleSubmit((data) => onSubmit(data))}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Loading...' : 'Log in'}
              </Text>
            </TouchableOpacity>

            <View
              style={[styles.divider, { backgroundColor: colors.lightGray }]}
            />

            <View style={styles.signUpContainer}>
              <Text>Don't have an account?{'  '}</Text>
              <TouchableOpacity onPress={onSignUpPress}>
                <Text style={{ color: colors.primaryColor }}>Sign up</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.signUpContainer}>
              <Text>Forgot password?{'  '}</Text>
              <TouchableOpacity onPress={onResetPasswordPress}>
                <Text style={{ color: colors.primaryColor }}>Reset it</Text>
              </TouchableOpacity>
            </View>
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
    justifyContent: 'center',
    alignItems: 'center',
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
    maxWidth: 400,
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
  passwordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  visibilityToggle: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  loginButton: {
    width: '100%',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  loginButtonText: {
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 20,
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
