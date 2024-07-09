import { hostColors } from '../../styles/colors';
import type { RewardsTypes } from '../../types/modules';

class ConfigManager {
  private static instance: ConfigManager | null = null;
  private colors: typeof hostColors;
  private keys: RewardsTypes['keys'];
  private partnerId: string;

  private constructor(config: RewardsTypes['keys']) {
    this.colors = hostColors;
    this.keys = config;
    this.partnerId = config.REWARDS_PROPS_X_REWARDS_PARTNER_ID;
  }

  public static getInstance(config?: RewardsTypes['keys']): ConfigManager {
    if (!ConfigManager.instance && config) {
      ConfigManager.instance = new ConfigManager(config);
    }
    return ConfigManager.instance!;
  }

  public getColors() {
    return this.colors;
  }

  public updateColors(newColors?: Partial<typeof hostColors>) {
    if (newColors) {
      this.colors = { ...this.colors, ...newColors };
    } else {
      this.colors = hostColors;
    }
  }

  public getKeys() {
    return this.keys;
  }

  public getPartnerId() {
    return this.partnerId;
  }
}

export default ConfigManager;
