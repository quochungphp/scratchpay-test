export const toLowerCase = (value: any): any => {
  if (value && typeof value === 'string') return value.toLowerCase();
  return value;
};
