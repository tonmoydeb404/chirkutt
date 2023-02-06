export const objectToArray = <T>(data: { [key: string]: T }): T[] => {
  return Object.keys(data).map((key) => data[key]);
};
