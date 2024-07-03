import { Button, Text, View } from 'react-native';
import { useCountrySelect } from '@flipgive/react-native-rewards/hooks';
import { Country } from '@flipgive/react-native-rewards/types';

export function CustomCountryPicker() {
  const { onSelectCountry } = useCountrySelect();

  return (
    <View>
      <Text>Select Country</Text>
      <Button title="US" onPress={() => onSelectCountry(Country.USA)} />
      <Button title="Can" onPress={() => onSelectCountry(Country.CAN)} />
    </View>
  );
}
