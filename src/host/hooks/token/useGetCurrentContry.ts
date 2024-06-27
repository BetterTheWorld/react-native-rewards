import { useMemo } from 'react';
import { Country, STORAGE_SELECTED_COUNTRY_KEY } from '../../constants';
import { saveItemSecurely } from '../../utils/secureStore';

export const useGetCurrentCountry = () => {
  const numberOfCountries = useMemo(() => {
    if (
      process.env.EXPO_PUBLIC_US_DEFAULT_REWARDS_TOKEN &&
      process.env.EXPO_PUBLIC_CA_DEFAULT_REWARDS_TOKEN
    ) {
      return 2;
    }

    return 1;
  }, []);

  const countryList = useMemo(() => {
    if (numberOfCountries === 2) {
      return [
        {
          id: '1',
          label: 'Canada',
          value: 'CA',
          formInput: Country.CAN,
          token: process.env.EXPO_PUBLIC_CA_DEFAULT_REWARDS_TOKEN,
        },
        {
          id: '2',
          label: 'USA',
          value: Country.USA,
          formInput: 'CANADA',
          token: process.env.EXPO_PUBLIC_US_DEFAULT_REWARDS_TOKEN,
        },
      ];
    }

    saveItemSecurely(
      STORAGE_SELECTED_COUNTRY_KEY,
      process.env.EXPO_PUBLIC_US_DEFAULT_REWARDS_TOKEN ? 'us' : 'ca'
    );

    return [
      {
        id: '1',
        label: process.env.EXPO_PUBLIC_US_DEFAULT_REWARDS_TOKEN
          ? 'USA'
          : 'Canada',
        value: process.env.EXPO_PUBLIC_US_DEFAULT_REWARDS_TOKEN ? 'US' : 'CA',
        formInput: process.env.EXPO_PUBLIC_US_DEFAULT_REWARDS_TOKEN
          ? 'USA'
          : 'CANADA',
        token:
          process.env.EXPO_PUBLIC_US_DEFAULT_REWARDS_TOKEN ||
          process.env.EXPO_PUBLIC_CA_DEFAULT_REWARDS_TOKEN,
      },
    ];
  }, [numberOfCountries]);

  return { numberOfCountries, countryList };
};
