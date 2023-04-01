type CommonTypes = {
  title: string;
  icon: string;
  badge?: "PRIMARY" | "WARNING" | "ERROR";
};
type Link = { path: string } & CommonTypes;
type Button = { action: () => void } & CommonTypes;

export type ListItemType = Link | Button;

export type ListPropsType = {
  items: ListItemType[];
};
