// utils/mergeContent.ts
export function mergeContent(defaultContent: any, dbContent: any): any {
  if (!dbContent) return defaultContent;

  const merged: any = {};

  for (const key of Object.keys(defaultContent)) {
    const defaultValue = defaultContent[key];
    const dbValue = dbContent[key];

    if (dbValue === undefined) {
      // missing in db → use default
      merged[key] = defaultValue;
    } else if (
      typeof defaultValue === 'object' &&
      defaultValue !== null &&
      !Array.isArray(defaultValue)
    ) {
      // nested object → recurse
      merged[key] = mergeContent(defaultValue, dbValue);
    } else {
      // primitive or array → keep db value
      merged[key] = dbValue;
    }

    // For objects with a 'value' field, preserve db value but override metadata
    if (
      typeof defaultValue === 'object' &&
      defaultValue !== null &&
      'value' in defaultValue
    ) {
      merged[key] = {
        ...defaultValue, // override type, maxValue, expectedFields, etc.
        value: dbValue?.value ?? defaultValue.value, // preserve existing value
      };
    }
  }

  return merged;
}
