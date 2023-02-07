import {
  BiBell,
  BiBookmarkMinus,
  BiBookmarkPlus,
  BiBookmarks,
  BiCheck,
  BiCheckDouble,
  BiCog,
  BiComment,
  BiDetail,
  BiDotsHorizontalRounded,
  BiEnvelope,
  BiError,
  BiHome,
  BiLock,
  BiLockOpen,
  BiLogIn,
  BiLogOut,
  BiMenu,
  BiMessageAdd,
  BiMoon,
  BiPencil,
  BiSend,
  BiShare,
  BiSun,
  BiTrash,
  BiUser,
  BiUserPlus,
  BiX,
} from "react-icons/bi";

import { BsEye, BsEyeSlash } from "react-icons/bs";

import { MdOutlineThumbUp, MdThumbUp } from "react-icons/md";

const iconList: { [key: string]: JSX.Element } = {
  dark: <BiMoon />,
  light: <BiSun />,
  home: <BiHome />,
  person: <BiUser />,
  bookmarks: <BiBookmarks />,
  add_bookmark: <BiBookmarkPlus />,
  remove_bookmark: <BiBookmarkMinus />,
  settings: <BiCog />,
  signout: <BiLogOut />,
  signin: <BiLogIn />,
  signup: <BiUserPlus />,
  comment: <BiComment />,
  like: <MdOutlineThumbUp />,
  liked: <MdThumbUp />,
  share: <BiShare />,
  menu: <BiMenu />,
  add: <BiMessageAdd />,
  remove: <BiTrash />,
  post: <BiDetail />,
  more: <BiDotsHorizontalRounded />,
  error: <BiError />,
  password: <BiLock />,
  password_reset: <BiLockOpen />,
  eye: <BsEye />,
  eye_slash: <BsEyeSlash />,
  email: <BiEnvelope />,
  check: <BiCheck />,
  doublecheck: <BiCheckDouble />,
  close: <BiX />,
  send: <BiSend />,
  pencil: <BiPencil />,
  notification: <BiBell />,
};

export default iconList;
