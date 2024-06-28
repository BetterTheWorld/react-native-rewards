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
  type ColorValue,
} from 'react-native';
import { useGetCategories } from '../../hooks/network/useGetCategories';
import type { Category } from '../../types/fields';
import { useTheme } from '../../hooks/theme/useTheme';

interface FormCategoriesProps {
  handleSelectSport: (selectedSport: Category) => void;
}

export function FormCategories({ handleSelectSport }: FormCategoriesProps) {
  const { sections, isLoading } = useGetCategories();
  const { colors } = useTheme();

  const renderItem = useCallback(
    ({ item }: { item: Category }) => (
      <TouchableOpacity onPress={() => handleSelectSport(item)}>
        <CategoryItem category={item} borderBottomColor={colors.lightGray} />
      </TouchableOpacity>
    ),
    [handleSelectSport, colors]
  );

  const keyExtractor = useCallback(
    (item: Category, index: number) => item.slug + index,
    []
  );

  if (isLoading) {
    return <ActivityIndicator size="large" color={colors.primaryColor} />;
  }

  return (
    <SafeAreaView>
      <SectionList
        sections={sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text
            style={[
              styles.header,
              {
                backgroundColor: colors.tertiaryColor,
                color: colors.white,
              },
            ]}
          >
            {title}
          </Text>
        )}
      />
    </SafeAreaView>
  );
}

const CategoryItem: React.FC<{
  category: Category;
  borderBottomColor: ColorValue | undefined;
}> = ({ category, borderBottomColor }) => {
  return (
    <View style={[styles.item, { borderBottomColor }]}>
      <Text>{category.name}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    textTransform: 'uppercase',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
  },
});
