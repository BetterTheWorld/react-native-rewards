import { GOOGLE_API_PLACE_DETAILS_URL } from '../constants/network';

export const fetchInfoByPlaceId = async ({
  placeId,
  googleApiKey,
}: {
  placeId: string;
  googleApiKey: string;
}) => {
  const apiKey = googleApiKey || '';
  try {
    const response = await fetch(
      `${GOOGLE_API_PLACE_DETAILS_URL}/json?place_id=${placeId}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Error fetching place details');
    }

    const detailsData = await response.json();
    const location = detailsData.result.geometry.location;

    let state = '';
    let postalCode = '';

    detailsData.result.address_components.forEach((component: any) => {
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
