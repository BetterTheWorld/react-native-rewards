import * as SecureStore from 'expo-secure-store';
import ConfigManager from './config/ConfigManager';

const getPartnerId = () => {
  const config = ConfigManager.getInstance();
  return config.getPartnerId();
};

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
    const partnerId = getPartnerId();
    const prefixedKey = `${partnerId}_${key}`;
    await SecureStore.setItemAsync(prefixedKey, value);
    console.log(`Successfully stored ${prefixedKey}`);
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
    const partnerId = getPartnerId();
    const prefixedKey = `${partnerId}_${key}`;
    const value = await SecureStore.getItemAsync(prefixedKey);
    console.log(`Successfully retrieved ${prefixedKey}: ${value}`);
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
    const partnerId = getPartnerId();
    const prefixedKey = `${partnerId}_${key}`;
    await SecureStore.deleteItemAsync(prefixedKey);
    console.log(`Successfully deleted ${prefixedKey}`);
  } catch (error) {
    console.error('Failed to delete the item:', error);
  }
};
