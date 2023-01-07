import {
  BiBookmarks,
  BiCog,
  BiComment,
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
  bookmark: <BiBookmarks />,
  settings: <BiCog />,
  signout: <BiLogOut />,
  signin: <BiLogIn />,
  comment: <BiComment />,
  like: <BiLike />,
  share: <BiShare />,
  more: <BiMenu />,
  add: <BiMessageAdd />,
};

export default iconList;
