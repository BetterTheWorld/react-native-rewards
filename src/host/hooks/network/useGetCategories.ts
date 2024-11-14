import { useState, useEffect } from 'react';
import { useHost } from '../../context/HostContext';
import type {
  Category,
  CategorySection,
  CategoryResponse,
} from '../../types/fields';
import axios, { AxiosError } from 'axios';

export const useGetCategories = () => {
  const { authToken, envKeys } = useHost();
  const [categories, setCategories] = useState<Category[]>();
  const [sections, setSections] = useState<CategorySection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const url = envKeys.REWARDS_PROPS_API_URL + '/campaigns/categories';
      const config = {
        method: 'GET',
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'X-REWARDS-PARTNER-ID': envKeys.REWARDS_PROPS_X_REWARDS_PARTNER_ID,
        },
      };

      try {
        const response = await axios(config);

        const { data }: CategoryResponse = response.data;
        setCategories(data.categories);
        const formattedSections = transformCategoriesToSections(
          data?.categories || []
        );
        setSections(formattedSections);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          console.error(
            'Failed to fetch categories:',
            axiosError.response?.statusText || axiosError.response?.status
          );
        } else {
          console.error('Failed to fetch categories:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [
    authToken,
    envKeys.REWARDS_PROPS_API_URL,
    envKeys.REWARDS_PROPS_X_REWARDS_PARTNER_ID,
  ]);

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
