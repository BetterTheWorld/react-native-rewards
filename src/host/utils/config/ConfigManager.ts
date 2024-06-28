import { hostColors } from '../../styles/colors';

const defaultHostColors = hostColors;

class ConfigManager {
  private colors: typeof defaultHostColors;

  constructor() {
    this.colors = defaultHostColors;
  }

  public getColors() {
    return this.colors;
  }

  public updateColors(newColors?: Partial<typeof defaultHostColors>) {
    if (newColors) {
      this.colors = { ...this.colors, ...newColors };
    } else {
      this.colors = defaultHostColors;
    }
  }
}

export default ConfigManager;
