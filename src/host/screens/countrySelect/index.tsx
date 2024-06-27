import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useCountrySelect } from '../../hooks/token/useCountrySelect';
import { FadeWrapper } from '../../components/animation/FadeWrapper';
import { Country } from '../../constants';
import { USA_FLAG_IMAGE, CANADA_FLAG_IMAGE } from '../../constants/images';
import { hostColors } from '../../styles/colors';

export const CountrySelector: React.FC = () => {
  const { onSelectCountry } = useCountrySelect();

  return (
    <FadeWrapper style={styles.container}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Select a country</Text>
          <Text style={styles.subtitle}>Where are you located?</Text>
          <View style={styles.flagContainer}>
            <TouchableOpacity
              style={styles.flagButton}
              onPress={onSelectCountry(Country.USA)}
            >
              <Image
                source={{ uri: USA_FLAG_IMAGE }}
                style={styles.flagImage}
              />
              <Text style={styles.flagText}>USA</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.flagButton}
              onPress={onSelectCountry(Country.CAN)}
            >
              <Image
                source={{ uri: CANADA_FLAG_IMAGE }}
                style={styles.flagImage}
              />
              <Text style={styles.flagText}>Canada</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </FadeWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 22,
    alignItems: 'center',
    shadowColor: hostColors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: hostColors.black,
  },
  subtitle: {
    fontSize: 16,
    color: hostColors.gray,
    marginBottom: 20,
  },
  flagContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 10,
  },
  flagButton: {
    marginVertical: 10,
    alignItems: 'center',
  },
  flagImage: {
    width: 100,
    height: 60,
    marginBottom: 10,
  },
  flagText: {
    fontSize: 18,
    color: hostColors.darkGray,
  },
});
