import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Layout from "../common/layout";
import Home from "../pages/Home";
import Post from "../pages/Post";
import Profile from "../pages/Profile";
import Saved from "../pages/Saved";
import Settings from "../pages/Settings";
import User from "../pages/User";
import Reset from "../pages/auth/Reset";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import NotFound from "../pages/error/NotFound";
import { store } from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <Routes>
        <Route element={<Layout sidebar={true} />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/saved" element={<Saved />} />
          {/* dynamic */}
          <Route path="/post/:id" element={<Post />} />
          <Route path="/user/:username" element={<User />} />
        </Route>
        <Route element={<Layout sidebar={false} />}>
          {/* auth */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset" element={<Reset />} />
        </Route>
        {/* error */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Provider>
  );
};

export default App;
