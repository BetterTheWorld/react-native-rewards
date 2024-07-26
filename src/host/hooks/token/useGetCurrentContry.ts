import { useMemo } from 'react';
import { Country, STORAGE_SELECTED_COUNTRY_KEY } from '../../constants';
import { saveItemSecurely } from '../../utils/secureStore';
import { useHost } from '../../context/HostContext';

export const useGetCurrentCountry = () => {
  const { envKeys } = useHost();

  const { REWARDS_PROPS_US_DEFAULT_REWARDS_TOKEN } = envKeys;
  const { REWARDS_PROPS_CA_DEFAULT_REWARDS_TOKEN } = envKeys;

  const numberOfCountries = useMemo(() => {
    if (
      REWARDS_PROPS_US_DEFAULT_REWARDS_TOKEN &&
      REWARDS_PROPS_CA_DEFAULT_REWARDS_TOKEN
    ) {
      return 2;
    }

    return 1;
  }, [
    REWARDS_PROPS_CA_DEFAULT_REWARDS_TOKEN,
    REWARDS_PROPS_US_DEFAULT_REWARDS_TOKEN,
  ]);

  const countryList = useMemo(() => {
    if (numberOfCountries === 2) {
      return [
        {
          id: '1',
          label: 'Canada',
          value: 'CA',
          formInput: Country.CAN,
          token: REWARDS_PROPS_CA_DEFAULT_REWARDS_TOKEN,
        },
        {
          id: '2',
          label: 'USA',
          value: 'US',
          formInput: Country.USA,
          token: REWARDS_PROPS_US_DEFAULT_REWARDS_TOKEN,
        },
      ];
    }

    saveItemSecurely(
      STORAGE_SELECTED_COUNTRY_KEY,
      REWARDS_PROPS_US_DEFAULT_REWARDS_TOKEN ? Country.USA : Country.CAN
    );

    return [
      {
        id: '1',
        label: REWARDS_PROPS_US_DEFAULT_REWARDS_TOKEN ? 'USA' : 'Canada',
        value: REWARDS_PROPS_US_DEFAULT_REWARDS_TOKEN ? 'US' : 'CA',
        formInput: REWARDS_PROPS_US_DEFAULT_REWARDS_TOKEN ? 'USA' : 'CANADA',
        token:
          REWARDS_PROPS_US_DEFAULT_REWARDS_TOKEN ||
          REWARDS_PROPS_CA_DEFAULT_REWARDS_TOKEN,
      },
    ];
  }, [
    REWARDS_PROPS_CA_DEFAULT_REWARDS_TOKEN,
    REWARDS_PROPS_US_DEFAULT_REWARDS_TOKEN,
    numberOfCountries,
  ]);

  return { numberOfCountries, countryList };
};
