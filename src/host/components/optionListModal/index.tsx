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
import { useTheme } from '../../hooks/theme/useTheme';

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
  renderItem,
  isLoading,
}: OptionListProps<T>) => {
  const { colors } = useTheme();
  if (isLoading) {
    return <ActivityIndicator size="large" color={colors.primaryColor} />;
  }

  const defaultRenderIntem = ({ item }: { item: T }) => (
    <TouchableOpacity
      style={[styles.optionItem, { borderBottomColor: colors.tertiaryColor }]}
      onPress={() => onSelect(item)}
    >
      <Text>{typeof item === 'string' ? item : item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <BottomSheet isVisible={isVisible} setModalVisible={setModalVisible}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>

        <TouchableOpacity
          style={[
            styles.closeButton,
            { backgroundColor: colors.tertiaryColor },
          ]}
          onPress={() => setModalVisible(false)}
        >
          <Text style={[styles.closeButtonText, { color: colors.white }]}>
            {' '}
            X{' '}
          </Text>
        </TouchableOpacity>
      </View>
      {renderComponent || (
        <FlatList
          style={styles.flatlist}
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem || defaultRenderIntem}
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
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  closeButtonText: {
    fontSize: 16,
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
