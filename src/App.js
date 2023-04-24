import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewPost from "./pages/NewPost";
import Description from "./pages/Description";
import Shares from "./pages/Shares";
import SharedPost from "./pages/SharedPost";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/shares/:id" element={<PrivateRoute />}>
          <Route path="/shares/:id" element={<Shares />} />
        </Route>
        <Route path="/profile/:id" element={<PrivateRoute />}>
          <Route path="/profile/:id" element={<Profile />} />
        </Route>
        <Route path="/shared-post" element={<PrivateRoute />}>
          <Route path="/shared-post" element={<SharedPost />} />
        </Route>
        <Route path="/post/:id" element={<PrivateRoute />}>
          <Route path="/post/:id" element={<Description />} />
        </Route>
        <Route path="/new-post" element={<PrivateRoute />}>
          <Route path="/new-post" element={<NewPost />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
