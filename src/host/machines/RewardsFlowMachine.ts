import { createMachine, assign, fromPromise } from 'xstate';
import { UIStateType } from '../types/context';
import type { RewardsTypes } from '../types/modules';
import { TokenService } from '../services/TokenService';
import type { Country } from '../constants';

interface AppContext {
  authToken: string | null;
  rewardsToken: string | null;
  uiState: UIStateType;
  config: RewardsTypes['keys'] & {
    customComponents?: {
      CustomInitialScreen?: React.ComponentType<any>;
    };
  };
}

type AppEvent =
  | {
      type: 'LOAD_TOKENS_DONE';
      authToken: string | null;
      rewardsToken: string | null;
    }
  | { type: 'SELECT_COUNTRY'; token: string; country: Country }
  | { type: 'PROCEED_TO_WEBVIEW' }
  | { type: 'NEEDS_TEAM_CREATION' }
  | { type: 'TEAM_CREATED' }
  | { type: 'LOGOUT' }
  | { type: 'SHOW_AUTH' }
  | { type: 'SHOW_LOGOUT' }
  | { type: 'LOGIN_SUCCESS'; token: string }
  | { type: 'SIGNUP_SUCCESS'; token: string }
  | { type: 'SET_REWARDS_TOKEN'; token: string }
  | { type: 'SET_AUTH_TOKEN'; token: string }
  | { type: 'RESET_TOKEN'; tokenType: 'auth' | 'rewards' }
  | { type: 'SET_UI_STATE'; uiState: UIStateType };

export const createRewardsFlowMachine = (config: RewardsTypes['keys']) => {
  return createMachine(
    {
      /** @xstate-layout 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-WHADWELMwb7W-gNjI6FkcpJwk8REIAA */
      id: 'rewardsFlow',
      initial: 'initializing',
      context: {
        authToken: null,
        rewardsToken: null,
        uiState: UIStateType.ShowCountryPicker,
        config: config as AppContext['config'],
      } satisfies AppContext,
      types: {} as { events: AppEvent; context: AppContext },
      states: {
        initializing: {
          invoke: {
            src: 'loadTokens',
            onDone: {
              target: 'decidingNextState',
              actions: assign({
                authToken: ({ event }) => event.output.authToken,
                rewardsToken: ({ event }) => event.output.rewardsToken,
              }),
            },
            onError: 'selectingToken',
          },
        },
        decidingNextState: {
          always: [
            {
              target: 'authenticated',
              guard: ({ context }) => !!context.authToken,
            },
            { target: 'selectingToken' },
          ],
        },
        selectingToken: {
          always: [
            {
              target: 'showingCountryPicker',
              guard: ({ context }) =>
                !!context.config.REWARDS_PROPS_US_DEFAULT_REWARDS_TOKEN &&
                !!context.config.REWARDS_PROPS_CA_DEFAULT_REWARDS_TOKEN,
            },
            { target: 'usingDefaultToken' },
          ],
        },
        showingCountryPicker: {
          on: {
            SELECT_COUNTRY: {
              target: 'usingDefaultToken',
              actions: 'handleSelectCountry',
            },
          },
        },
        usingDefaultToken: {
          always: [
            {
              target: 'showingInitialScreen',
              guard: ({ context }) =>
                !!context.config.customComponents?.CustomInitialScreen,
            },
            { target: 'showingWebView' },
          ],
        },
        showingInitialScreen: {
          on: {
            PROCEED_TO_WEBVIEW: 'showingWebView',
          },
        },
        authenticated: {
          invoke: {
            src: 'checkTeamCreationNeeded',
            onDone: [
              {
                target: 'creatingTeam',
                guard: ({ event }) => event.output === true,
              },
              { target: 'showingWebView' },
            ],
          },
        },
        creatingTeam: {
          on: {
            TEAM_CREATED: 'showingWebView',
          },
        },
        showingWebView: {
          on: {
            LOGOUT: {
              target: 'loggingOut',
            },
            SHOW_AUTH: 'showingAuthForm',
            SHOW_LOGOUT: 'showingLogout',
          },
        },
        loggingOut: {
          invoke: {
            src: 'clearTokens',
            onDone: {
              target: 'selectingToken',
              actions: assign({
                authToken: null,
                rewardsToken: null,
              }),
            },
          },
        },
        showingAuthForm: {
          on: {
            LOGIN_SUCCESS: {
              target: 'authenticated',
              actions: assign({
                authToken: ({ event }) => event.token,
              }),
            },
            SIGNUP_SUCCESS: {
              target: 'creatingTeam',
              actions: assign({
                authToken: ({ event }) => event.token,
              }),
            },
          },
        },
        showingLogout: {
          type: 'final',
          entry: assign({
            uiState: () => UIStateType.ShowLogout,
          }),
        },
      },
      on: {
        SET_REWARDS_TOKEN: {
          actions: [
            assign({
              rewardsToken: ({ event }) => event.token,
            }),
            'saveRewardsToken',
          ],
        },
        SET_AUTH_TOKEN: {
          actions: [
            assign({
              authToken: ({ event }) => event.token,
            }),
            'saveAuthToken',
          ],
        },
        RESET_TOKEN: {
          actions: assign(({ context, event }) => {
            if (event.tokenType === 'auth') {
              return { ...context, authToken: null };
            } else if (event.tokenType === 'rewards') {
              return { ...context, rewardsToken: null };
            }
            return context;
          }),
        },
        SET_UI_STATE: {
          actions: assign({
            uiState: ({ event }) => event.uiState,
          }),
        },
      },
    },
    {
      actions: {
        saveRewardsToken: ({ event }) => {
          if (event.type === 'SET_REWARDS_TOKEN') {
            TokenService.setRewardsToken(event.token);
          }
        },
        saveAuthToken: ({ event }) => {
          if (event.type === 'SET_AUTH_TOKEN') {
            TokenService.setAuthToken(event.token);
          }
        },
        handleSelectCountry: assign(({ context, event }) => {
          console.info('handleSelectCountry');
          if (event.type === 'SELECT_COUNTRY') {
            const { token } = event;
            TokenService.setRewardsToken(token);
            return {
              ...context,
              rewardsToken: token,
            };
          }
          return context;
        }),
      },
      actors: {
        loadTokens: fromPromise(async () => {
          const { authToken, rewardsToken } = await TokenService.loadTokens();
          return { authToken, rewardsToken };
        }),
        clearTokens: fromPromise(async () => {
          await TokenService.clearTokens();
          return undefined;
        }),
        checkTeamCreationNeeded: fromPromise(async () => {
          return TokenService.isTeamCreationNeeded();
        }),
      },
    }
  );
};
