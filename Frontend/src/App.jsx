import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./components/Auth/SignIn";
import Signup from "./components/Auth/SignUp";
import ForgotPassword from "./components/Auth/ForgotPassword";

import PostLoginSetup from "./components/pages/PostLoginSetup";
import Dashboard from "./components/Dashboard/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile-setup" element={<PostLoginSetup />} />
      </Routes>
    </BrowserRouter>
  );
}
