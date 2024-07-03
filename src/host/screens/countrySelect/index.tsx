import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useCountrySelect } from '../../hooks/token/useCountrySelect';
import { FadeWrapper } from '../../components/animation/FadeWrapper';
import { Country } from '../../constants';
import { USA_FLAG_IMAGE, CANADA_FLAG_IMAGE } from '../../constants/images';
import { useTheme } from '../../hooks/theme/useTheme';

export const CountrySelector: React.FC = () => {
  const { onSelectCountry } = useCountrySelect();
  const { colors } = useTheme();
  const flagTextStyles = [styles.flagText, { color: colors.darkGray }];
  return (
    <FadeWrapper style={styles.container}>
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { shadowColor: colors.black }]}>
          <Text style={[styles.title, { color: colors.black }]}>
            Select a country
          </Text>
          <Text style={[styles.subtitle, { color: colors.gray }]}>
            Where are you located?
          </Text>
          <View style={styles.flagContainer}>
            <TouchableOpacity
              style={styles.flagButton}
              onPress={() => onSelectCountry(Country.USA)}
            >
              <Image
                source={{ uri: USA_FLAG_IMAGE }}
                style={styles.flagImage}
              />
              <Text style={flagTextStyles}>USA</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.flagButton}
              onPress={() => onSelectCountry(Country.CAN)}
            >
              <Image
                source={{ uri: CANADA_FLAG_IMAGE }}
                style={styles.flagImage}
              />
              <Text style={flagTextStyles}>Canada</Text>
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
  },
  subtitle: {
    fontSize: 16,
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
  },
});
