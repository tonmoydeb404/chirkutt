export const arrayToObject = <T>(
  data: T[],
  key: keyof T
): { [k: string]: T } => {
  return data.reduce((obj: { [k: string]: any }, item: any) => {
    if (typeof item[key] === "string") {
      obj[item[key]] = item;
    }
    return obj;
  }, {});
};
