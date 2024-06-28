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
