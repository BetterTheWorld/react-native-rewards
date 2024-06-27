import { Country, STORAGE_SELECTED_COUNTRY_KEY } from '../../constants';
import { useHost } from '../../context/HostContext';
import { UIStateType } from '../../types/context';
import { saveItemSecurely } from '../../utils/secureStore';

export const useCountrySelect = () => {
  const { selectCountryToken, setUIState } = useHost();

  const onSelectCountry = (country: Country) => () => {
    const token =
      country === Country.USA
        ? process.env.EXPO_PUBLIC_US_DEFAULT_REWARDS_TOKEN
        : process.env.EXPO_PUBLIC_CA_DEFAULT_REWARDS_TOKEN;
    if (token) {
      selectCountryToken(token);
      setUIState(UIStateType.ShowStore);
    }
    saveItemSecurely(STORAGE_SELECTED_COUNTRY_KEY, country);
  };

  return {
    onSelectCountry,
  };
};
