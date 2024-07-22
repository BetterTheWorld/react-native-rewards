# @flipgive/react-native-rewards

A React Native module for rewards partners, providing seamless integration of reward systems into your mobile app.

![npm](https://img.shields.io/npm/v/@flipgive/react-native-rewards)
![license](https://img.shields.io/npm/l/@flipgive/react-native-rewards)
![downloads](https://img.shields.io/npm/dm/@flipgive/react-native-rewards)

## 🚀 Installation

```sh
npm install @flipgive/react-native-rewards
```

or

```sh
yarn add @flipgive/react-native-rewards
```

or

```sh
pnpm add @flipgive/react-native-rewards
```

### Requirements

To use this package, ensure you have the following components installed in your project:

#### Peer Dependencies

These dependencies need to be manually installed in your project:

- expo-secure-store
- react-native-webview

### Usage

Here's a quick example to get you started:

```ts
import { SafeAreaView, StyleSheet } from 'react-native';
import { ShopRewards } from '@flipgive/react-native-rewards';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ShopRewards
        keys={{
          REWARDS_PROPS_US_DEFAULT_REWARDS_TOKEN: process.env.EXPO_PUBLIC_US_DEFAULT_REWARDS_TOKEN || '',
          REWARDS_PROPS_CA_DEFAULT_REWARDS_TOKEN: process.env.EXPO_PUBLIC_CA_DEFAULT_REWARDS_TOKEN || '',
          REWARDS_PROPS_BASE_URL: process.env.EXPO_PUBLIC_BASE_URL || '',
          REWARDS_PROPS_GOOGLE_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_API_KEY || '',
          REWARDS_PROPS_API_URL: process.env.EXPO_PUBLIC_API_URL || '',
          REWARDS_PROPS_X_REWARDS_PARTNER_ID: process.env.EXPO_PUBLIC_X_REWARDS_PARTNER_ID || '',
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

```

for more information go to the examples folder.

For now it is necessary to use this entry point for all imports until the split imports task is completed.

```ts
import { ShopRewards..... } from '@flipgive/react-native-rewards'
```

This package is compatible with expo go - expo snacks

# Shop rewards - RewardsTypes

## Keys

| Property                               | Type   | Required |
| -------------------------------------- | ------ | -------- |
| REWARDS_PROPS_US_DEFAULT_REWARDS_TOKEN | string | No       |
| REWARDS_PROPS_CA_DEFAULT_REWARDS_TOKEN | string | No       |
| REWARDS_PROPS_BASE_URL                 | string | Yes      |
| REWARDS_PROPS_GOOGLE_API_KEY           | string | No       |
| REWARDS_PROPS_API_URL                  | string | Yes      |
| REWARDS_PROPS_X_REWARDS_PARTNER_ID     | string | Yes      |

## Theme

| Property | Type                       | Required |
| -------- | -------------------------- | -------- |
| colors   | Partial<typeof hostColors> | No       |

## Custom Components

| Component                  | Type                               | Required |
| -------------------------- | ---------------------------------- | -------- |
| CustomCountryPicker        | ComponentType                      | No       |
| CustomSignUpScreen         | ComponentType                      | No       |
| CustomSignInScreen         | ComponentType                      | No       |
| CustomCreateTeamScreen     | ComponentType                      | No       |
| CustomLogoutScreen         | ComponentType                      | No       |
| CustomWebViewShop          | ComponentType<{ baseURL: string }> | No       |
| CustomModalLoader          | ComponentType                      | No       |
| CustomInitialScreen        | ComponentType                      | No       |
| CustomForgotPasswordScreen | ComponentType                      | No       |

## Additional Properties

| Property      | Type   | Required |
| ------------- | ------ | -------- |
| utmParameters | string | No       |

# 📚 API Reference

## Components

| Component             | Description                        |
| --------------------- | ---------------------------------- |
| `ShopRewards`         | Main component to display rewards. |
| `ShopRewardsProvider` | Highly Customizable Store Provider |
| `FadeWrapper`         | fade animation wrapper for views   |

## Hooks

| Hook                  | Description                                                   |
| --------------------- | ------------------------------------------------------------- |
| `useSignUpForm`       | Hook for managing sign-up form.                               |
| `useSignInForm`       | Hook for managing sign-in form.                               |
| `useCountrySelect`    | Hook for selecting countries.                                 |
| `useCreateTeamForm`   | Hook for managing team creation form.                         |
| `useGetCategories`    | Hook for fetching categories.                                 |
| `useCityAutocomplete` | Hook for city autocomplete feature - google api.              |
| `useHost`             | Hook for context usage                                        |
| `useLoadKeysToEnv`    | Hook for Resetting Environment and Local Storage on New Props |
| `useResetPassword`    | Hook for resetting password                                   |

## Context

| Componet       | Description   |
| -------------- | ------------- |
| `HostProvider` | Bare provider |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

This library is distributed under the
[Apache License, version 2.0](http://www.apache.org/licenses/LICENSE-2.0.html)

```no-highlight
copyright 2023. FlipGive, inc. all rights reserved.

licensed under the apache license, version 2.0 (the "license");
you may not use this file except in compliance with the license.
you may obtain a copy of the license at

    http://www.apache.org/licenses/license-2.0

unless required by applicable law or agreed to in writing, software
distributed under the license is distributed on an "as is" basis,
without warranties or conditions of any kind, either express or implied.
see the license for the specific language governing permissions and
limitations under the license.

```

### TODO

- Test
- Split modules (working on example app, but not in npm package import)

Made with ❤️ by [create-react-native-library](https://github.com/callstack/react-native-builder-bob).
