export const hasChanged = (newObj: any, oldObj: any): boolean => {
  for (const key in newObj) {
    if (typeof newObj[key] === 'object' && typeof oldObj[key] === 'object') {
      if (hasChanged(newObj[key], oldObj[key])) {
        return true;
      }
    } else if (newObj[key] !== oldObj[key]) {
      return true;
    }
  }
  return false;
};

export const getChangedKeys = (
  newObj: any,
  oldObj: any
): { [key: string]: boolean } => {
  const changedKeys: { [key: string]: boolean } = {};
  for (const key in newObj) {
    if (typeof newObj[key] === 'object' && typeof oldObj[key] === 'object') {
      if (hasChanged(newObj[key], oldObj[key])) {
        changedKeys[key] = true;
      }
    } else if (newObj[key] !== oldObj[key]) {
      changedKeys[key] = true;
    }
  }
  return changedKeys;
};

// Deep comparison function
export function deepEqual(obj1: unknown, obj2: unknown): boolean {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== 'object' ||
    obj1 === null ||
    typeof obj2 !== 'object' ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1 as Record<string, unknown>);
  const keys2 = Object.keys(obj2 as Record<string, unknown>);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (
      !keys2.includes(key) ||
      !deepEqual(
        (obj1 as Record<string, unknown>)[key],
        (obj2 as Record<string, unknown>)[key]
      )
    ) {
      return false;
    }
  }

  return true;
}
