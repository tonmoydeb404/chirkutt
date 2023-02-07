type CommonTypes = {
  title: string;
  icon: string;
  badge?: "INITIAL" | "WARNING" | "DANGER";
};
type Link = { path: string } & CommonTypes;
type Button = { action: () => void } & CommonTypes;

export type ListItemType = Link | Button;

export type ListPropsType = {
  items: ListItemType[];
};
