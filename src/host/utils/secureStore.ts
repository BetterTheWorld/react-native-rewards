import * as SecureStore from 'expo-secure-store';

/**
 * Saves a value securely on the device.
 * @param key - The key under which to store the value.
 * @param value - The value to store.
 */
export const saveItemSecurely = async (
  key: string,
  value: string
): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value);
    console.log(`Successfully stored ${key}`);
  } catch (error) {
    console.error('Failed to save the item:', error);
  }
};

/**
 * Retrieves a stored value securely from the device.
 * @param key - The key corresponding to the stored value.
 * @returns The value if found, otherwise null.
 */
export const getItemSecurely = async <T>(
  key: string
): Promise<T | string | null> => {
  try {
    const value = await SecureStore.getItemAsync(key);
    console.log(`Successfully retrieved ${key}: ${value}`);
    try {
      return value !== null ? (JSON.parse(value) as T) : null;
    } catch {
      return value; // Return the raw string if parsing fails
    }
  } catch (error) {
    console.error('Failed to retrieve the item:', error);
    return null;
  }
};

/**
 * Deletes a stored value securely from the device.
 * @param key - The key corresponding to the value to delete.
 */
export const deleteItemSecurely = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
    console.log(`Successfully deleted ${key}`);
  } catch (error) {
    console.error('Failed to delete the item:', error);
  }
};
