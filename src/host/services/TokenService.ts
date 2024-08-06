import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'AUTH_TOKEN';
const REWARDS_TOKEN_KEY = 'REWARDS_TOKEN';
const TEAM_CREATION_NEEDED_KEY = 'TEAM_CREATION_NEEDED';

export class TokenService {
  static async getAuthToken(): Promise<string | null> {
    return SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  }

  static async setAuthToken(token: string): Promise<void> {
    return SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  }

  static async getRewardsToken(): Promise<string | null> {
    return SecureStore.getItemAsync(REWARDS_TOKEN_KEY);
  }

  static async setRewardsToken(token: string): Promise<void> {
    return SecureStore.setItemAsync(REWARDS_TOKEN_KEY, token);
  }

  static async isTeamCreationNeeded(): Promise<boolean> {
    const value = await SecureStore.getItemAsync(TEAM_CREATION_NEEDED_KEY);
    return value === 'true';
  }

  static async setTeamCreationNeeded(needed: boolean): Promise<void> {
    return SecureStore.setItemAsync(
      TEAM_CREATION_NEEDED_KEY,
      needed.toString()
    );
  }

  static async clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REWARDS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(TEAM_CREATION_NEEDED_KEY);
  }

  static async loadTokens(): Promise<{
    authToken: string | null;
    rewardsToken: string | null;
  }> {
    const [authToken, rewardsToken] = await Promise.all([
      this.getAuthToken(),
      this.getRewardsToken(),
    ]);
    return { authToken, rewardsToken };
  }
}
