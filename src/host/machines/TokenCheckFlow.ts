import { assign, setup } from 'xstate';
import { TokenService } from '../services/TokenService';

interface TokenContext {
  authToken: string | null;
  defaultTokens: string[];
  selectedDefaultToken: string | null;
  needsTeamCreation: boolean;
}

type TokenEvent =
  | { type: 'AUTH_TOKEN_FOUND'; token: string }
  | { type: 'AUTH_TOKEN_NOT_FOUND' }
  | { type: 'NEEDS_TEAM_CREATION' }
  | { type: 'TEAM_CREATION_NOT_NEEDED' }
  | { type: 'SELECT_DEFAULT_TOKEN'; token: string }
  | { type: 'TEAM_CREATED' }
  | { type: 'TEAM_CREATION_FAILED' }
  | { type: 'INITIAL_SCREEN' }
  | { type: 'RETRY' };

export const tokenCheckMachine = setup({
  types: {
    context: {} as TokenContext,
    events: {} as TokenEvent,
  },
  actions: {
    saveAuthToken: async ({ context }) => {
      if (context.authToken) {
        await TokenService.setAuthToken(context.authToken);
      }
    },
    saveSelectedToken: async ({ context }) => {
      if (context.selectedDefaultToken) {
        await TokenService.setRewardsToken(context.selectedDefaultToken);
      }
    },
    clearTokens: async () => {
      await TokenService.clearTokens();
    },
  },
  guards: {
    hasAuthToken: ({ context }) => !!context.authToken,
    needsTeamCreation: ({ context }) => context.needsTeamCreation,
    hasTwoTokens: ({ context }) => context.defaultTokens.length > 1,
    hasOneToken: ({ context }) => context.defaultTokens.length === 1,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGMAWZkGsCCBXALqgCoD2mYAdgHRoaYCWFUehp5FAxNgKpEASAfSIB5ANIBRAHICAYsO6SAIgG0ADAF1EoAA4lY9fPRIUtIAB6IATABZVVAOwBWewDZHARnv2AHPZuX7ABoQAE9Ed29vKkdrV1UXAE5rJIBmVVVHAF9M4NosFmIyShp0LEZmAkL2Ll5BEQlpSWEiWXklNU0kEF19Q2NTCwQbOydXDy9ffyDQxFsohO9HSMt3AJSbaxTs3NKcSrZivIYmIjAAQwBbAGEAJ3O+zklxcUUAZSFxbABZASuAJU+RAAksJJB1TD0DEYTF1BvYUlFrJsUu5UQlLKpvJYEsEwggIpYqO51o4XN4EqpLCkXO4ElkciAjgUDtQjuVTpdbvdoRwiJ8fv9ASDGs0BE8Xi9wV1IQ8Boh4YjkajaRisTiZkMvFRfO5bHSXEiPN5tozdsyiqzduVFGAAGZnXAAG3wLNgHClOj0UP6sPlCKoSJSKLRquxuNmNKoKWSjlUPms3hJ1hNTP2FpKdGtdodztd7vcnU9vWhcoQCoDSpDmLDGqWhNUtPcmO8mPRLi2DNTrHTbKYNvtTpdFrdykshe6XtlvrL-sDwZV1fVeNs7ioNMsbmJZOsupcKbNafYVFgYEdGEMfezg5ZHFe4gAMuIri1FOIZDx7y16lIPRPiz7QEGVZYwcKkKSDdZowbcMEE2FwA3SawXAbaM3Gxfc6HNI9cH0S8B1zC13Q0CFJxLadPATbUnEWPwXEsSJ4hgpD7G1cYEkSexYmSPdOwPbsj2QO4zgvKAOQuXl+V+AFsD5FRiOlUiAPMcJLBAvwUnAoMqRXGDiWsKhsRSDwAiSMkvA7HZMMPQ4hJEsSJO+KShVBWRsCBR85PHGUyMA+VvHg5sNPcMlURiaY8W8VdrBiFEYobJZEgw-JrOofBzmuWzoXEG4bhIG4OABIg-gATV-bylLhWdKwXNVdJRBwEiM1Z7FM3xXGyBkKBICA4FMLsqkoEj-xhXyEAAWhcGCxscKgEjm+aFoWizTSs-jDitJgsMGhThtLaxLBglYokxex4g8VRYr8ZNeNWgbLUzE50q5YSfL-b0RuUhBYxSbUNPRdIMQyVxJo1FZVxcPxVGSRMkkcejLCSvY1vuso8JzId2HgHb3tLb7frmwHAecFwQeXVQEgDJtYybCkqSh+xEa26gTzPZARP7dGWSGnHyIu-SG046tIoyTEmMcCm4eSC7KWY5xGZSqgcKzfCMe2osedG9wjSJCH13WBJiS8JiSYceEMWQmIFhpeXkZoTLHsubmp01qGok4pY43o1CnDq-T7AiYlPGccWUi8G27qoCgzgAN3oKAXpOEgAHUwAAI1jsAAHcndeoDYzsDEPB3BEyUSXSdyJIy43FyxVIRa7LOS22o9j+O7JIIEKChM5HVeQSwDVt7nc+iJNgcXxos8DE0SXCMZrhmkIacRJQ4blam4jsAcrynOKvCPmqAFuZ6Kp0WNQ0qIYibatmOC5b+pZKg0s5TLjGy3Kbl3j7BkcIzD5Q+ijhSS-yRDBXwAZkIGmJIsYkSwOzZCAA */
  id: 'checkAuthToken',
  initial: 'checkingAuthToken',
  context: {
    authToken: null,
    defaultTokens: [],
    selectedDefaultToken: null,
    needsTeamCreation: false,
  } as TokenContext,
  states: {
    checkingAuthToken: {
      on: {
        AUTH_TOKEN_FOUND: {
          target: 'checkingTeamCreation',
          actions: assign({
            authToken: ({ event }) => event.token,
          }),
        },
        AUTH_TOKEN_NOT_FOUND: 'checkingDefaultTokens',
      },
    },
    checkingTeamCreation: {
      on: {
        NEEDS_TEAM_CREATION: {
          target: 'creatingTeam',
          actions: assign({ needsTeamCreation: true }),
        },
        TEAM_CREATION_NOT_NEEDED: 'navigatingToWebview',
      },
    },
    checkingDefaultTokens: {
      always: [
        {
          guard: 'hasTwoTokens',
          target: 'selectingDefaultToken',
        },
        {
          guard: 'hasOneToken',
          target: 'usingDefaultToken',
          actions: assign({
            selectedDefaultToken: ({ context }) =>
              context.defaultTokens[0] ?? null,
          }),
        },
        { target: 'error' },
      ],
    },
    selectingDefaultToken: {
      on: {
        SELECT_DEFAULT_TOKEN: {
          target: 'usingDefaultToken',
          actions: assign({
            selectedDefaultToken: ({ event }) => event.token,
          }),
        },
      },
    },
    usingDefaultToken: {
      always: 'navigatingToInitialScreen',
    },
    creatingTeam: {
      on: {
        TEAM_CREATED: 'navigatingToWebview',
        TEAM_CREATION_FAILED: 'teamCreationError',
      },
    },
    navigatingToWebview: {
      type: 'final',
    },
    navigatingToInitialScreen: {
      type: 'final',
    },
    error: {
      type: 'final',
    },
    teamCreationError: {
      on: {
        RETRY: 'creatingTeam',
      },
    },
  },
});
