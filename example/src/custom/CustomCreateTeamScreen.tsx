import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  useCreateTeamForm,
  useGetCategories,
  useCityAutocomplete,
} from '@flipgive/react-native-rewards/hooks';
import type { Category } from '@flipgive/react-native-rewards/types';

export function CustomCreateTeamScreen() {
  const {
    handleSubmit,
    errors,
    isLoadingForm,
    isCountryModalVisible,
    setCountryModalVisible,
    handleSelectCountry,
    handleSelectCity,
    handleSelectSport,
    onSubmit,
    countryList,
    getValues,
    teamCreateError,
    setValue,
  } = useCreateTeamForm();

  const { sections, isLoading: isCategoriesLoading } = useGetCategories();
  const [selectedSport, setSelectedSport] = useState<Category | null>(null);

  const formValues = getValues();
  const { REWARDS_PROPS_GOOGLE_API_KEY } = {
    REWARDS_PROPS_GOOGLE_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_API_KEY || '',
  };

  const {
    query,
    setQuery,
    predictions,
    selectCity,
    selectedCity,
    isLoading: isCityLoading,
  } = useCityAutocomplete({
    apiKey: REWARDS_PROPS_GOOGLE_API_KEY,
    country: formValues.country?.value || '',
    triggerLength: 3,
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Team Name"
        value={formValues.teamName}
        onChangeText={(text) =>
          setValue('teamName', text, { shouldValidate: true })
        }
      />
      {errors.teamName && (
        <Text style={styles.errorText}>{errors.teamName.message}</Text>
      )}

      <TouchableOpacity onPress={() => setCountryModalVisible(true)}>
        <Text>
          Select Country: {formValues.country?.label || 'Not selected'}
        </Text>
      </TouchableOpacity>
      {isCountryModalVisible && (
        <FlatList
          data={countryList}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectCountry(item)}>
              <Text>{item.label}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.value}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Search City"
        value={query}
        onChangeText={setQuery}
      />
      {isCityLoading ? (
        <Text>Loading cities...</Text>
      ) : (
        <FlatList
          data={predictions}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                selectCity({ id: item.place_id, value: item.description });
                handleSelectCity({
                  id: item.place_id,
                  value: item.description,
                });
              }}
            >
              <Text>{item.description}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.place_id}
        />
      )}
      <Text>Selected City: {selectedCity?.value || 'Not selected'}</Text>

      <TouchableOpacity onPress={() => setSelectedSport(null)}>
        <Text>Select Sport: {selectedSport?.name || 'Not selected'}</Text>
      </TouchableOpacity>
      {!selectedSport && (
        <FlatList
          data={sections}
          renderItem={({ item: section }) => (
            <View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.data.map((sport) => (
                <TouchableOpacity
                  key={sport.slug}
                  onPress={() => {
                    setSelectedSport(sport);
                    handleSelectSport(sport);
                  }}
                >
                  <Text>{sport.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          keyExtractor={(item) => item.title}
        />
      )}

      <Button
        title={isLoadingForm ? 'Creating Team...' : 'Create Team'}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoadingForm || isCategoriesLoading}
      />

      {teamCreateError && (
        <Text style={styles.errorText}>{teamCreateError}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  roleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
});
