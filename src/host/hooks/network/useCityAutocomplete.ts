import { useState, useEffect } from 'react';
import { GOOGLE_API_AUTOCOMPLETE_URL } from '../../constants/network';
import type { GoogleCityPrediction, CityPrediction } from '../../types/fields';

export interface UseCityAutocompleteProps {
  apiKey: string;
  country: string;
  triggerLength: number;
}

export const useCityAutocomplete = ({
  apiKey,
  country,
  triggerLength,
}: UseCityAutocompleteProps) => {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<GoogleCityPrediction[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.length < triggerLength) {
      setPredictions([]);
      return;
    }

    const fetchCities = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${GOOGLE_API_AUTOCOMPLETE_URL}/json?input=${query}&types=(cities)&components=country:${country}&key=${apiKey}`
        );

        if (!response.ok) {
          throw new Error('Error fetching city predictions');
        }

        const data = await response.json();
        console.log(data);
        setPredictions(
          data.predictions.map((prediction: any) => ({
            description: prediction.description,
            place_id: prediction.place_id,
          }))
        );
      } catch (error) {
        console.error('Error fetching city predictions:', error);
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchCities();
    }, 300);

    return () => {
      clearTimeout(delayDebounceFn);
      setIsLoading(false);
    };
  }, [query, apiKey, country, triggerLength]);

  const selectCity = (city: CityPrediction) => {
    setSelectedCity(city);
    setPredictions([]);
  };

  return {
    query,
    setQuery,
    predictions,
    selectedCity,
    selectCity,
    isLoading,
  };
};
