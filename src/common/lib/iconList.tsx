import {
  BiBookmarks,
  BiCog,
  BiHome,
  BiLogIn,
  BiLogOut,
  BiMoon,
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
};

export default iconList;
