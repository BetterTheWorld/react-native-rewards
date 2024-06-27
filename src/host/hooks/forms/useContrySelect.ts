import { useGetCurrentCountry } from '../token/useGetCurrentContry';

export const useCountryField = () => {
  const { countryList } = useGetCurrentCountry();
  const defaultCountry = countryList[0];

  return {
    countryList,
    defaultCountry,
  };
};
