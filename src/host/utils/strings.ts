/**
 * Validates if a postal code is valid for the USA or Canada.
 * @param postalCode The postal code to validate.
 * @returns The postal code if valid, otherwise returns an empty string.
 */
export function validatePostalCode(postalCode: string): string {
  const usaRegex = /^[0-9]{5}(-[0-9]{4})?$/;
  const canadaRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

  const trimmedPostalCode = postalCode.replace(/\s+/g, '');

  if (usaRegex.test(postalCode)) {
    return postalCode; // Valid US postal code
  } else if (canadaRegex.test(trimmedPostalCode.toUpperCase())) {
    return postalCode; // Valid Canadian postal code
  }

  return ''; // Return an empty string if not valid
}
