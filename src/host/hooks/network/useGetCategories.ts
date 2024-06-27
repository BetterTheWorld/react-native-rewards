import { useState, useEffect } from 'react';
import { useHost } from '../../context/HostContext';
import type {
  Category,
  CategorySection,
  CategoryResponse,
} from '../../types/fields';

export const useGetCategories = () => {
  const { authToken } = useHost();
  const [categories, setCategories] = useState<Category[]>();
  const [sections, setSections] = useState<CategorySection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const url = process.env.EXPO_PUBLIC_API_URL + '/campaigns/categories';
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      };

      try {
        const response = await fetch(url || '', options);

        if (!response || !response.ok) {
          console.error(
            'Failed to fetch categories:',
            response.statusText || response.status
          );
          return;
        }

        const { data }: CategoryResponse = await response.json();
        setCategories(data.categories);
        const formattedSections = transformCategoriesToSections(
          data?.categories || []
        );
        setSections(formattedSections);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [authToken]);

  return { sections, isLoading, categories };
};

const transformCategoriesToSections = (
  categories: Category[]
): CategorySection[] => {
  const sectionMap: { [key: string]: Category[] } = {};
  const featuredCategories: Category[] = [];

  categories.forEach((category) => {
    if (category.featured) {
      featuredCategories.push(category);
    } else {
      const parentName =
        category.parent &&
        Object.keys(category.parent).length > 0 &&
        category.parent.name
          ? category.parent.name
          : 'Other';
      if (!sectionMap[parentName]) {
        sectionMap[parentName] = [];
      }
      sectionMap[parentName]?.push(category);
    }
  });

  const sections: CategorySection[] = [];

  if (featuredCategories.length > 0) {
    sections.push({
      title: 'FEATURED',
      data: featuredCategories,
    });
  }

  const sortedSections = Object.entries(sectionMap)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([title, data]) => ({ title, data }));

  return [...sections, ...sortedSections];
};
