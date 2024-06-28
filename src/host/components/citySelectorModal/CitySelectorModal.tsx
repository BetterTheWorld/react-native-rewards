import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import type { CityPrediction, CountryField } from '../../types/fields';
import { useCityAutocomplete } from '../../hooks/network/useCityAutocomplete';
import { hostColors } from '../../styles/colors';
import { useHost } from '../../context/HostContext';

interface CitySelectorProps {
  country?: CountryField;
  onSelectCity: (city: CityPrediction) => void;
  city: string;
  isVisible: boolean;
  setModalVisible: (isVisible: boolean) => void;
  title: string;
}

export const CitySelectorModal: React.FC<CitySelectorProps> = ({
  country,
  onSelectCity,
  city,
  isVisible,
  setModalVisible,
  title,
}) => {
  const { envKeys } = useHost();
  const { query, setQuery, predictions, selectCity, isLoading } =
    useCityAutocomplete({
      apiKey: envKeys.REWARDS_PROPS_GOOGLE_API_KEY || '',
      country: country?.value || '',
      triggerLength: 2,
    });

  const handleSelectCity = (selectedCity: CityPrediction) => {
    onSelectCity(selectedCity);
    selectCity(selectedCity);
    setModalVisible(false);
  };

  const filterPredictions = predictions.map((prediction) => ({
    id: prediction.place_id,
    value: prediction.description,
  }));

  return (
    <View style={styles.fullWidth}>
      <TouchableOpacity
        style={styles.input}
        onPress={() => {
          setModalVisible(true);
          setQuery('');
        }}
      >
        <Text>{city || 'Select City'}</Text>
      </TouchableOpacity>
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          setQuery('');
          setModalVisible(false);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.row}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              autoFocus
              style={styles.input}
              placeholder="Enter city name"
              value={query}
              onChangeText={setQuery}
            />
            <FlatList
              keyboardShouldPersistTaps="always"
              data={filterPredictions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelectCity(item)}>
                  <Text style={styles.item}>{item.value}</Text>
                </TouchableOpacity>
              )}
            />
            {isLoading ? (
              <ActivityIndicator size="large" color={hostColors.primaryColor} />
            ) : null}
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    margin: 20,
  },
  fullWidth: {
    flex: 1,
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: hostColors.lightGray,
    borderRadius: 7,
    marginBottom: 10,
    justifyContent: 'center',
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: hostColors.gray,
  },
  closeButton: {
    backgroundColor: hostColors.tertiaryColor,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: hostColors.white,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
