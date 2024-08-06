import { setup, assign } from 'xstate';
import { TokenService } from '../services/TokenService';

export const rewardsMachine = setup({
  types: {
    context: {} as {
      authToken: string | null;
      rewardsToken: string | null;
      needsTeamCreation: boolean;
      selectedCountry: 'USA' | 'CAN' | null;
    },
    events: {} as
      | { type: 'INITIALIZE' }
      | { type: 'AUTH_TOKEN_FOUND'; token: string }
      | { type: 'NO_AUTH_TOKEN' }
      | { type: 'SELECT_COUNTRY'; country: 'USA' | 'CAN' }
      | { type: 'LOGIN' }
      | { type: 'SIGNUP' }
      | { type: 'FORGOT_PASSWORD' }
      | { type: 'SUBMIT_LOGIN' }
      | { type: 'SUBMIT_SIGNUP' }
      | { type: 'SUBMIT_RESET_PASSWORD' }
      | { type: 'LOGIN_SUCCESS' }
      | { type: 'SIGNUP_SUCCESS' }
      | { type: 'RESET_PASSWORD_SUCCESS' }
      | { type: 'ERROR' }
      | { type: 'CREATE_TEAM' }
      | { type: 'TEAM_CREATED' }
      | { type: 'LOGOUT' }
      | { type: 'NEXT' }
      | { type: 'CHECK_INITIAL_SCREEN' },
  },
  actions: {
    loadTokensFromStorage: async ({ context }) => {
      const { authToken, rewardsToken } = await TokenService.loadTokens();
      const needsTeamCreation = await TokenService.isTeamCreationNeeded();
      context.authToken = authToken;
      context.rewardsToken = rewardsToken;
      context.needsTeamCreation = needsTeamCreation;
    },
    setDefaultToken: async ({ context }) => {
      const defaultToken = 'DEFAULT_TOKEN';
      await TokenService.setRewardsToken(defaultToken);
      context.rewardsToken = defaultToken;
    },
    saveSelectedToken: async ({ context }) => {
      if (context.selectedCountry && context.rewardsToken) {
        await TokenService.setRewardsToken(context.rewardsToken);
      }
    },
    clearTokens: async () => {
      await TokenService.clearTokens();
    },
  },
  guards: {
    hasAuthToken: ({ context }) => !!context.authToken,
    needsTeamCreation: ({ context }) => context.needsTeamCreation,
    hasTwoTokens: () => {
      return true; // Replace with actual logic
    },
    hasCustomInitialScreen: () => {
      return false; // Replace with actual logic
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCcwHcCGyKwHQEsA7fAF3wwBt8AvIqAYgEkA5RgFUYEEAZRgLQCiAbQAMAXUSgADgHtYpfDMKSQAD0QBmLbgCMGgGz6ArAHYNAJgAs5g0YA0IAJ6b9G3CP06AnEaOX9XloAHEYAvqEOqJjYeEQKlDR0TKwcPPzCOhJIILLyZEoq6ghabnqGphbWtg7OCFZuQToBITomJiIareGR6Fg4uADGABZgAwDWdJwAriRDbDJjYIT0zAIAGmyiWdJyCgXZRea+uCam+paWGkEiJjpnNYg2Ipa4QT46Il7mNxpeJt0gKJ9PDDUYTQhQaazeaLZarDZCTIqXJ7ZQHR7HU4mc6Xa63e5OR4aY42azmRoeSxhCKA3oxXCwMAUUZkCEAETAADMMFMKCQYUsVutNuJkbt8mjQEVruZcOYPkZfmZLE1DA8EK0TLpAiI-CIdHpLF4vACgfTGcyBqyoBzubz+QtBfDNkjsiiJYVEDK5QqlRoVYZ9OrzOYtYr5SZzF4PpYREdqT1ov0LSy6ABhGRTQgkZCOegAZQE3AEabYAH00wB5ACqzDYACUAJpbMV5RSStSIHRHESvIK-KxeILmfT99XeaMnO7EiwfIL-Glm5NDGRoOiMYhkSj5gaoJ3Cltu8Xtz0akJGXDWEzGu6mLyXSzBvRuXUaT6nI6WEKmunL1frzdyAoHc9zhA9XR2Nt9ilLtz0vUMb18a8HyfftcAHeVzisRUzB-JM8FgFc1whAB1MAACMADV8HQehuErABxFhD0g1FT2HdVjC1WMPhMS5R1+HRLDw4EGSIugyKomi0ALRgGOYasAAUWJyY9oM7BAvnVdoL0aA1rj+HRriMkTzXE0iKOo2j6IYmsRW2VSoI7IojHMYNbjDMx-XaXUjDjBNaXw3AeVmJYyAGDAJVwCgZCgIhZPkpSVPdE90QQNpexEOMzF1GM7iDQkNXOLVR0CIymiMZ8AqXPAQpGbN8AiqKYri5YADFK3rWzy0Uzh83zEjOrZZK1OcxAMvcbK30q558vHVoXipER+2vN4h11Uz+jqsLGsi9toti+L82rAAhABZdgyxs5jRSPJzT0uLxdCEwxAjab5PHHYl9HcA1lo6fR2nJYTF1-WqZnq8K9qUA6oFaqANzoxiWDLY60zTAR+pG+60u7fReyCfsviNYcBPHe8dHQ7FSU6cq+M28HQoapr9pa+HEYEet6067G2LSrRZVcr5dQ8ENPg0Exx1jH7iX1Y0R3x64ggZ4KIZ2lmYfkKBCCmKQkaY5heY9NKvi1KMjkCEIAlOcdmncYGJcpIz9BV7bmehwgGXwbXdYLU6LvLfM5IU5TbtY42YIQEJZXlIz5VMO52gK2oFqCdDAd8IwvFcGwghd0GgrdqGoq14gIWrPWg8SxTUerdHMfzI3UsjvGCaJwdSbHQqjMnDpbjuFVQ2K121fdkvvbLqAK4SkPa-rrGIMcvmW57PsBxJkcu5T7Efs8IwQmzoJLDMZWC9EovdvH7W6GnznufrJv1KKCastDaa8qMZOu1Wk4PEBr99AhmjCPJmxd9qchkMgKAMgSCKQwLAWAaBIEQH1jdByKUn6IFNnKL4Wcrifz+PYbuIYXgmDWp-QmXgOgWBAZDS+4DIHQNgfAxByC-bnUuvWTGAgep9QGkNR+Y10rtEmm-XKs1P7qjeG4P4upzhcQziDRM59R5gJhqgRkJBrRwIQUg7A9AuGFl4f1Qa9Y2RzwxljMOS8I4aQFrgIW3w-KAO+G9cclJcB-GJm+UWfgdC0PVh7XAGiwBaLoDo1h+i7482sRgoR9jHEixceLSW3d9QvHOPqKwvFvh3BVruMAe0IRsEKQAW3oGwAQnAzoVi4ZwSpw1YmjVPK0L4uAAgKKPv6AwX8zxDjlCEFU0Z-QjguCrNmdBKwzCFAiJpOMV7jnMOEGkhAZAQDgCoGqrZl4aQALQGHVLs04l4-BaA6EfJow4TRn3pHELcVBaAQm2bYoo1h1SdG4q-U5xJLhZ3ySMcYkwIYCg7HE08phgz+ievUKh+NqEfA0CrFMVo6C2h5HyEFzzm4aX3hePyvxyjH0aEQ2oVgXjZNMJcEZflT7KPNEyVMEIMxZhzLUcO2Ln6pNJXGNOHgOjfGeP4f0SjAqiUIv+CEG54jAQKUsLFmCipGk8QDAIWg-pCSfG0S8+o3iXHlL8YcSLzJQEklZNA8qhERkpv4BaxI85xn8OTLKJwrgqlFhYAwASx7YrBWla8UiPAOKaKSN+fkFx0q2qo+hMN8AQGZBalpaEPhND4u8YcQMvqBs6P2TwVDFR-y9Woz2LUiAJrSq4J6ot9QxhuD4eahN4L1CjGYdotxC3RuLbFdmoLmm42zu4QGo5-LEn3hxbuBgXhKyMlUS4G0bmRtAR2r2PspBlpbs8GWvgzlWCygi22PhPH5pCFC+UUZ20a09qXG+q67o7KKJ4MM+9vCuEjDNHQ45ThpyJncT4-hs6uXPUEiBUCYERL0RANdGkYybsVG+Hd+oOjuO+JePQpx-BHG7EfQDUUQlhIhGB5BkGijdi5VguMJxB2jlckaSq1yI0glQEUqAJSMClKI12CtyqemBFpuk8cbw063Cyv-bwUYhLjK7ZMmY7GNTYhQ-ePOR8yF-GPsGIduhnF6G7N4CW+dwhAA */
  id: 'rewards',
  initial: 'initializing',
  context: {
    authToken: null,
    rewardsToken: null,
    needsTeamCreation: false,
    selectedCountry: null,
  },
  states: {
    initializing: {
      entry: 'loadTokensFromStorage',
      on: {
        INITIALIZE: [
          {
            target: 'checkingAuthToken',
            guard: 'hasAuthToken',
          },
          { target: 'selectingDefaultToken' },
        ],
      },
    },
    checkingAuthToken: {
      on: {
        NEXT: [
          { target: 'creatingTeam', guard: 'needsTeamCreation' },
          { target: 'showingWebView' },
        ],
      },
    },
    selectingDefaultToken: {
      on: {
        NEXT: [
          { target: 'selectingCountry', guard: 'hasTwoTokens' },
          { target: 'checkingInitialScreen', actions: 'setDefaultToken' },
        ],
      },
    },
    selectingCountry: {
      on: {
        SELECT_COUNTRY: {
          target: 'checkingInitialScreen',
          actions: [
            assign({
              selectedCountry: ({ event }) => event.country,
            }),
            'saveSelectedToken',
          ],
        },
      },
    },
    checkingInitialScreen: {
      on: {
        CHECK_INITIAL_SCREEN: [
          { target: 'initialScreen', guard: 'hasCustomInitialScreen' },
          { target: 'showingWebView' },
        ],
      },
    },
    initialScreen: {
      on: {
        NEXT: [{ target: 'authentication.login' }],
      },
    },
    showingWebView: {
      on: {
        LOGIN: 'authentication.login',
        SIGNUP: 'authentication.signup',
        FORGOT_PASSWORD: 'authentication.forgotPassword',
        LOGOUT: 'loggingOut',
      },
    },
    authentication: {
      initial: 'idle',
      states: {
        idle: {},
        login: {
          on: {
            SIGNUP: 'signup',
            FORGOT_PASSWORD: 'forgotPassword',
            SUBMIT_LOGIN: 'loggingIn',
          },
        },
        loggingIn: {
          on: {
            LOGIN_SUCCESS: '#rewards.showingWebView',
            ERROR: 'login',
          },
        },
        signup: {
          on: {
            LOGIN: 'login',
            SUBMIT_SIGNUP: 'signingUp',
          },
        },
        signingUp: {
          on: {
            SIGNUP_SUCCESS: [
              { target: '#rewards.creatingTeam', guard: 'needsTeamCreation' },
              { target: '#rewards.showingWebView' },
            ],
            ERROR: 'signup',
          },
        },
        forgotPassword: {
          on: {
            LOGIN: 'login',
            SUBMIT_RESET_PASSWORD: 'resettingPassword',
          },
        },
        resettingPassword: {
          on: {
            RESET_PASSWORD_SUCCESS: 'login',
            ERROR: 'forgotPassword',
          },
        },
      },
    },
    creatingTeam: {
      on: {
        TEAM_CREATED: 'showingWebView',
      },
    },
    loggingOut: {
      entry: ['clearTokens'],
      on: {
        NEXT: {
          target: 'initializing',
          actions: assign({
            authToken: null,
            rewardsToken: null,
            needsTeamCreation: false,
            selectedCountry: null,
          }),
        },
      },
    },
  },
});
