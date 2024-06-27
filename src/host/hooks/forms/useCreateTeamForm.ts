import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHost } from '../../context/HostContext';
import { UIStateType } from '../../types/context';
import type {
  CreateTeamFormValues,
  CountryField,
  CityPrediction,
  Category,
  TeamRole,
} from '../../types/fields';
import type { TeamCreateInput } from '../../types/forms';
import { fetchInfoByPlaceId } from '../../utils/network';
import { validatePostalCode } from '../../utils/strings';
import { useCreateTeam } from '../network/useCreateTeam';
import { useCountryField } from './useContrySelect';

export const useCreateTeamForm = () => {
  const { countryList, defaultCountry } = useCountryField();
  const [isCountryModalVisible, setCountryModalVisible] = useState(false);
  const [isCityModalVisible, setCityModalVisible] = useState(false);
  const [isSportModalVisible, setSportModalVisible] = useState(false);
  const [isRoleModalVisible, setRoleModalVisible] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isLoading },
  } = useForm<CreateTeamFormValues>({
    defaultValues: {
      teamName: '',
      city: undefined,
      sport: undefined,
      country: {
        label: defaultCountry?.label,
        value: defaultCountry?.value,
        formInput: defaultCountry?.formInput,
      },
      role: [],
    },
  });
  const { setUIState } = useHost();
  const { createTeam, error: teamCreateError } = useCreateTeam();

  const handleSelectCountry = (selectedCountry: CountryField) => {
    setValue('country', selectedCountry, { shouldValidate: true });
    setCountryModalVisible(false);
    setValue('city', { id: '1', value: '' }, { shouldValidate: true });
  };

  const handleSelectCity = (selectedCity: CityPrediction) => {
    setValue('city', selectedCity, { shouldValidate: true });
    setCityModalVisible(false);
  };

  const handleSelectSport = (selectedSport: Category) => {
    setValue('sport', selectedSport, { shouldValidate: true });
    setSportModalVisible(false);
  };

  const handleSelectRole = (selectedRole: TeamRole) => {
    const currentRoles = getValues('role');
    if (!currentRoles.find((role) => role.id === selectedRole.id)) {
      setValue('role', [...currentRoles, selectedRole], {
        shouldValidate: true,
      });
    }
    setRoleModalVisible(false);
  };

  const removeRole = (roleToRemove: TeamRole) => {
    const currentRoles = getValues('role');
    setValue(
      'role',
      currentRoles.filter((r) => r.id !== roleToRemove.id),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data: CreateTeamFormValues) => {
    try {
      const { state, postalCode } = await fetchInfoByPlaceId({
        placeId: data.city?.id || '',
      });

      const teamCreateInput: TeamCreateInput = {
        campaign: {
          name: data.teamName,
          sport_category: data.sport?.name || '',
          country: data?.country?.value || '',
          city: data.city?.value || '',
          state: state,
          postal_code: validatePostalCode(postalCode),
        },
      };

      const response = await createTeam(teamCreateInput);

      console.info('createTeam response', response);

      if (response?.ok) {
        setUIState(UIStateType.ShowStore);
      }
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    isLoadingForm: isSubmitting || isLoading,
    isCountryModalVisible,
    setCountryModalVisible,
    isCityModalVisible,
    setCityModalVisible,
    isSportModalVisible,
    setSportModalVisible,
    isRoleModalVisible,
    setRoleModalVisible,
    handleSelectCountry,
    handleSelectCity,
    handleSelectSport,
    handleSelectRole,
    removeRole,
    onSubmit,
    countryList,
    getValues,
    teamCreateError,
  };
};
