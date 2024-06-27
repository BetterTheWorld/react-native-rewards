import React from 'react';
import { useCallback } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useGetCategories } from '../../hooks/network/useGetCategories';
import { hostColors } from '../../styles/colors';
import type { Category } from '../../types/fields';

interface FormCategoriesProps {
  handleSelectSport: (selectedSport: Category) => void;
}

export function FormCategories({ handleSelectSport }: FormCategoriesProps) {
  const { sections, isLoading } = useGetCategories();

  const renderItem = useCallback(
    ({ item }: { item: Category }) => (
      <TouchableOpacity onPress={() => handleSelectSport(item)}>
        <CategoryItem category={item} />
      </TouchableOpacity>
    ),
    [handleSelectSport]
  );

  const keyExtractor = useCallback(
    (item: Category, index: number) => item.slug + index,
    []
  );

  if (isLoading) {
    return <ActivityIndicator size="large" color={hostColors.primaryColor} />;
  }

  return (
    <SafeAreaView>
      <SectionList
        sections={sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </SafeAreaView>
  );
}

const CategoryItem: React.FC<{ category: Category }> = ({ category }) => {
  return (
    <View style={styles.item}>
      <Text>{category.name}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    textTransform: 'uppercase',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: hostColors.tertiaryColor,
    color: hostColors.white,
    padding: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: hostColors.lightGray,
  },
});
