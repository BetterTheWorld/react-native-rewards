import React from 'react';
import {
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { BottomSheet } from '../bottomSheet';
import { hostColors } from '../../styles/colors';

interface OptionListProps<T> {
  isVisible: boolean;
  isLoading?: boolean;
  setModalVisible: (isVisible: boolean) => void;
  onSelect: (item: T) => void;
  title?: string;
  renderComponent?: React.ReactNode;
  data?: T[];
  keyExtractor?: (item: T) => string;
  renderItem?: ({ item }: { item: T }) => React.ReactElement | null;
}

type ItemType = string | { id: string; [key: string]: any };

const defaultData: ItemType[] = [];

export const OptionList = <T extends ItemType>({
  onSelect,
  isVisible,
  setModalVisible,
  title = '',
  renderComponent,
  data = defaultData as T[],
  keyExtractor = (item: T) => (typeof item === 'string' ? item : item.id),
  renderItem = ({ item }: { item: T }) => (
    <TouchableOpacity style={styles.optionItem} onPress={() => onSelect(item)}>
      <Text>{typeof item === 'string' ? item : item.label}</Text>
    </TouchableOpacity>
  ),
  isLoading,
}: OptionListProps<T>) => {
  if (isLoading) {
    return <ActivityIndicator size="large" color={hostColors.primaryColor} />;
  }

  return (
    <BottomSheet isVisible={isVisible} setModalVisible={setModalVisible}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.closeButtonText}> X </Text>
        </TouchableOpacity>
      </View>
      {renderComponent || (
        <FlatList
          style={styles.flatlist}
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      )}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  flatlist: {
    marginVertical: 30,
  },
  optionItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: hostColors.tertiaryColor,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
    backgroundColor: hostColors.tertiaryColor,
    borderRadius: 5,
    margin: 10,
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
    marginHorizontal: 15,
  },
});
