import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import HandlePreloader from "../common/components/HandlePreloader";
import Layout from "../common/layout";
import PrivateOutlet from "../common/outlet/PrivateOutlet";
import PublicOutlet from "../common/outlet/PublicOutlet";
import AuthStateChanged from "../features/auth/AuthStateChanged";
import Share from "../features/share/Share";
import ThemeStateChanged from "../features/theme/ThemeStateChanged";
import Home from "../pages/Home";
import Notifications from "../pages/Notifications";
import Post from "../pages/Post";
import Profile from "../pages/Profile";
import Saved from "../pages/Saved";
import Search from "../pages/Search";
import User from "../pages/User";
import Reset from "../pages/auth/Reset";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import NotFound from "../pages/error/NotFound";
import Settings from "../pages/settings";
import ChangeAvatar from "../pages/settings/ChangeAvatar";
import ChangeBio from "../pages/settings/ChangeBio";
import ChangeName from "../pages/settings/ChangeName";
import ChangePassword from "../pages/settings/ChangePassword";
import DeleteAccount from "../pages/settings/DeleteAccount";
import { store } from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <AuthStateChanged>
        <ThemeStateChanged>
          <Routes>
            {/* only public can access */}
            <Route element={<PublicOutlet />}>
              <Route element={<Layout sidebar={false} />}>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
              </Route>
            </Route>
            {/* only authenticated user can access */}
            <Route element={<PrivateOutlet />}>
              <Route element={<Layout sidebar={true} />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings">
                  <Route index element={<Settings />} />
                  <Route path="change-name" element={<ChangeName />} />
                  <Route path="change-avatar" element={<ChangeAvatar />} />
                  <Route path="change-bio" element={<ChangeBio />} />
                  <Route path="change-password" element={<ChangePassword />} />
                  <Route path="delete-account" element={<DeleteAccount />} />
                </Route>
                <Route path="/saved" element={<Saved />} />
              </Route>
            </Route>
            {/* everyone can access */}
            <Route element={<Layout sidebar={true} />}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/post/:id" element={<Post />} />
              <Route path="/user/:uid" element={<User />} />
            </Route>
            <Route element={<Layout sidebar={false} />}>
              <Route path="/reset" element={<Reset />} />
            </Route>
            {/* error */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Share />
          <HandlePreloader />
        </ThemeStateChanged>
      </AuthStateChanged>
      <Toaster />
    </Provider>
  );
};

export default App;
