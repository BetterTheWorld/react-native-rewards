import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSignUpForm } from '@flipgive/react-native-rewards/hooks';

export function CustomSignUpScreen() {
  const {
    isPasswordVisible,
    togglePasswordVisibility,
    onSubmit,
    isLoadingForm,
    validateEmail,
    validatePassword,
    onSignInPress,
    onClosePress,
  } = useSignUpForm();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleSubmit = () => {
    // Reset errors
    setErrors({ fullName: '', email: '', password: '' });

    // Validate fields
    let isValid = true;
    if (!fullName) {
      setErrors((prev) => ({ ...prev, fullName: 'Full name is required' }));
      isValid = false;
    }

    const emailValidation = validateEmail(email);
    if (emailValidation !== true) {
      setErrors((prev) => ({ ...prev, email: emailValidation }));
      isValid = false;
    }

    const passwordValidation = validatePassword(password);
    if (passwordValidation !== true) {
      setErrors((prev) => ({ ...prev, password: passwordValidation }));
      isValid = false;
    }

    if (isValid) {
      onSubmit({
        fullName,
        email,
        password,
        utmData: {
          source: 'test',
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setFullName}
        value={fullName}
        placeholder="Full Name"
      />
      {errors.fullName && (
        <Text style={styles.errorText}>{errors.fullName}</Text>
      )}

      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Text>{isPasswordVisible ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      <Button
        title={isLoadingForm ? 'Loading...' : 'Sign Up'}
        onPress={handleSubmit}
        disabled={isLoadingForm}
      />

      <Button title="Sign In" onPress={onSignInPress} />
      <Button title="Close" onPress={onClosePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
