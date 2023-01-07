import {
  BiBookmarkPlus,
  BiBookmarks,
  BiCog,
  BiComment,
  BiDotsHorizontalRounded,
  BiHome,
  BiLike,
  BiLogIn,
  BiLogOut,
  BiMenu,
  BiMessageAdd,
  BiMoon,
  BiShare,
  BiSun,
  BiUser,
} from "react-icons/bi";

const iconList: { [key: string]: JSX.Element } = {
  dark: <BiMoon />,
  light: <BiSun />,
  home: <BiHome />,
  person: <BiUser />,
  bookmarks: <BiBookmarks />,
  add_bookmark: <BiBookmarkPlus />,
  settings: <BiCog />,
  signout: <BiLogOut />,
  signin: <BiLogIn />,
  comment: <BiComment />,
  like: <BiLike />,
  share: <BiShare />,
  menu: <BiMenu />,
  add: <BiMessageAdd />,
  more: <BiDotsHorizontalRounded />,
};

export default iconList;
