import {
  BiBookmarkPlus,
  BiBookmarks,
  BiCog,
  BiComment,
  BiDotsHorizontalRounded,
  BiError,
  BiHome,
  BiLike,
  BiLock,
  BiLockOpen,
  BiLogIn,
  BiLogOut,
  BiMenu,
  BiMessageAdd,
  BiMoon,
  BiShare,
  BiSun,
  BiUser,
  BiUserPlus,
} from "react-icons/bi";

import { BsEye, BsEyeSlash } from "react-icons/bs";

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
  signup: <BiUserPlus />,
  comment: <BiComment />,
  like: <BiLike />,
  share: <BiShare />,
  menu: <BiMenu />,
  add: <BiMessageAdd />,
  more: <BiDotsHorizontalRounded />,
  error: <BiError />,
  password: <BiLock />,
  password_reset: <BiLockOpen />,
  eye: <BsEye />,
  eye_slash: <BsEyeSlash />,
};

export default iconList;
