import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Controller } from 'react-hook-form';
import { CitySelectorModal } from '../../components/citySelectorModal/CitySelectorModal';
import { OptionList } from '../../components/optionListModal';
import { useCreateTeamForm } from '../../hooks/forms/useCreateTeamForm';
import type { CountryField } from '../../types/fields';
import { FormCategories } from './FormCategories';
import { styles } from './styles';

export const CreateTeamScreen: React.FC = () => {
  const {
    control,
    handleSubmit,
    errors,
    isCountryModalVisible,
    setCountryModalVisible,
    isCityModalVisible,
    setCityModalVisible,
    isSportModalVisible,
    setSportModalVisible,
    handleSelectCountry,
    handleSelectSport,
    onSubmit,
    countryList,
    getValues,
    isLoadingForm,
    teamCreateError,
  } = useCreateTeamForm();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.card}>
            <Text style={styles.title}>Create Team</Text>

            <Text style={styles.label}>Team Name</Text>
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="teamName"
            />
            {errors.teamName && (
              <Text style={styles.errorText}>This is required.</Text>
            )}

            <Text style={styles.label}>Country</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setCountryModalVisible(true)}
            >
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { value } }) => (
                  <Text>{value?.label || 'Select Country'}</Text>
                )}
                name="country"
              />
            </TouchableOpacity>
            {errors.country && (
              <Text style={styles.errorText}>This is required.</Text>
            )}

            <Text style={styles.label}>City</Text>
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <CitySelectorModal
                  country={getValues('country')}
                  city={value?.value || ''}
                  onSelectCity={onChange}
                  setModalVisible={setCityModalVisible}
                  isVisible={isCityModalVisible}
                  title="Select City"
                />
              )}
              name="city"
            />
            {errors.city && (
              <Text style={styles.errorText}>This is required.</Text>
            )}

            <Text style={styles.label}>Sport</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setSportModalVisible(true)}
            >
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { value } }) => (
                  <Text>{value?.name || 'Select Sport'}</Text>
                )}
                name="sport"
              />
            </TouchableOpacity>
            {errors.sport && (
              <Text style={styles.errorText}>This is required.</Text>
            )}

            <TouchableOpacity
              style={[
                styles.submitButton,
                isLoadingForm && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoadingForm}
            >
              <Text style={styles.submitButtonText}>
                {isLoadingForm ? 'Loading...' : 'Create Team'}
              </Text>
            </TouchableOpacity>
          </View>
          {teamCreateError && (
            <Text style={styles.errorText}>{teamCreateError}</Text>
          )}
        </ScrollView>
        <OptionList<CountryField>
          title="Country"
          data={countryList}
          isVisible={isCountryModalVisible}
          setModalVisible={setCountryModalVisible}
          onSelect={handleSelectCountry}
        />
        <OptionList
          renderComponent={
            <FormCategories handleSelectSport={handleSelectSport} />
          }
          title="Sport"
          isVisible={isSportModalVisible}
          setModalVisible={setSportModalVisible}
          onSelect={() => null}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
