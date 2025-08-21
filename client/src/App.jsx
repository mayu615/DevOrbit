import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Messaging from "./pages/Messaging";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PageTransition from "./components/Shared/PageTransition"; 

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes with Layout */}
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="jobs"
          element={
            <PageTransition>
              <Jobs />
            </PageTransition>
          }
        />
        <Route
          path="messaging"
          element={
            <PageTransition>
              <Messaging />
            </PageTransition>
          }
        />
        <Route
          path="notifications"
          element={
            <PageTransition>
              <Notifications />
            </PageTransition>
          }
        />
        <Route
          path="profile/:id"
          element={
            <PageTransition>
              <Profile />
            </PageTransition>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
