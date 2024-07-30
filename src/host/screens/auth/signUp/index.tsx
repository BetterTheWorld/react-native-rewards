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
import { Controller } from 'react-hook-form';
import { FadeWrapper } from '../../../components/animation/FadeWrapper';
import { CloseButton } from '../../../components/closeButton';
import { useSignUpForm } from '../../../hooks/forms/useSignUpForm';
import { useTheme } from '../../../hooks/theme/useTheme';

export const SignUpScreen: React.FC = () => {
  const {
    control,
    handleSubmit,
    errors,
    isPasswordVisible,
    togglePasswordVisibility,
    onSubmit,
    isLoadingForm,
    validateEmail,
    validatePassword,
    networkError,
    networkStatus,
    newtworkIsLoading,
    onSignInPress,
    onClosePress,
  } = useSignUpForm();
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
        keyboardVerticalOffset={100}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={[styles.card, { shadowColor: colors.darkGray }]}>
            <Text style={styles.title}>Sign up & start earning</Text>

            <Controller
              control={control}
              name="fullName"
              rules={{ required: 'Full name is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    style={inputStyles}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Full name"
                    autoCapitalize="words"
                  />
                  {errors.fullName && (
                    <Text style={styles.errorText}>
                      {errors.fullName.message}
                    </Text>
                  )}
                </>
              )}
            />

            <Controller
              control={control}
              name="email"
              rules={{ required: 'Email is required', validate: validateEmail }}
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
              rules={{
                required: 'Password is required',
                validate: validatePassword,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={inputStyles}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Password"
                      secureTextEntry={!isPasswordVisible}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={styles.visibilityToggle}
                      onPress={togglePasswordVisibility}
                    >
                      <Text>{isPasswordVisible ? '👁' : '👁‍🗨'}</Text>
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

            <Text style={[styles.termsText, { color: colors.textColor }]}>
              By signing up, you agree to our Terms & Conditions. Lorem ipsum
              dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </Text>

            {networkError && (
              <Text style={styles.errorText}>{networkStatus?.message}</Text>
            )}

            <TouchableOpacity
              style={[
                styles.signupButton,
                { backgroundColor: colors.primaryColor },
              ]}
              onPress={handleSubmit((data) => onSubmit(data))}
              disabled={isLoadingForm || newtworkIsLoading}
            >
              <Text style={styles.signupButtonText}>
                {isLoadingForm || newtworkIsLoading ? 'Loading...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            <View
              style={[styles.divider, { backgroundColor: colors.lightGray }]}
            />

            <View style={styles.signInContainer}>
              <Text>Already have an account?{'  '}</Text>
              <TouchableOpacity onPress={onSignInPress}>
                <Text style={{ color: colors.primaryColor }}>Log in</Text>
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
  scrollContainer: {
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
  termsText: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  signupButton: {
    width: '100%',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 20,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 14,
    alignSelf: 'flex-start',
  },
});
