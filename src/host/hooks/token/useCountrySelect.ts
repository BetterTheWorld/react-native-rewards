import { Country, STORAGE_SELECTED_COUNTRY_KEY } from '../../constants';
import { useHost } from '../../context/HostContext';
import { UIStateType } from '../../types/context';
import { saveItemSecurely } from '../../utils/secureStore';

export const useCountrySelect = () => {
  const { selectCountryToken, setUIState, envKeys, customComponents } =
    useHost();

  const onSelectCountry = (country: Country) => {
    const token =
      country === Country.USA
        ? envKeys.REWARDS_PROPS_US_DEFAULT_REWARDS_TOKEN
        : envKeys.REWARDS_PROPS_CA_DEFAULT_REWARDS_TOKEN;

    if (token) {
      selectCountryToken(token);
      // killswitch for custom initial screen
      if (customComponents?.CustomInitialScreen) {
        setUIState(UIStateType.ShowInitialScreen);
      } else {
        setUIState(UIStateType.ShowStore);
      }
    }

    saveItemSecurely(STORAGE_SELECTED_COUNTRY_KEY, country);
  };

  return {
    onSelectCountry,
  };
};
