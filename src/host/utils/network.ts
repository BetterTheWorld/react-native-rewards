import { GOOGLE_API_PLACE_DETAILS_URL } from '../constants/network';
import axios from 'axios';

interface PlaceDetailsResponse {
  result: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    address_components: Array<{
      long_name: string;
      types: string[];
    }>;
  };
}

export const fetchInfoByPlaceId = async ({
  placeId,
  googleApiKey,
}: {
  placeId: string;
  googleApiKey: string;
}) => {
  const apiKey = googleApiKey || '';
  try {
    const response = await axios.get<PlaceDetailsResponse>(
      `${GOOGLE_API_PLACE_DETAILS_URL}/json?place_id=${placeId}&key=${apiKey}`
    );

    const location = response.data.result.geometry.location;

    let state = '';
    let postalCode = '';

    response.data.result.address_components.forEach((component) => {
      if (component.types.includes('administrative_area_level_1')) {
        state = component.long_name;
      }

      if (component.types.includes('postal_code')) {
        postalCode = component.long_name;
      }
    });

    return {
      latitude: location.lat,
      longitude: location.lng,
      state,
      postalCode,
    };
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    throw error;
  }
};
