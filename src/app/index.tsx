import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Layout from "../common/layout";
import Reset from "../pages/auth/Reset";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import NotFound from "../pages/error/NotFound";
import Home from "../pages/Home";
import Post from "../pages/Post";
import Profile from "../pages/Profile";
import Saved from "../pages/Saved";
import Settings from "../pages/Settings";
import User from "../pages/User";
import { store } from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/saved" element={<Saved />} />
          {/* dynamic */}
          <Route path="/:id" element={<Post />} />
          <Route path="/:username" element={<User />} />
          {/* auth */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset" element={<Reset />} />
          {/* error */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Provider>
  );
};

export default App;
