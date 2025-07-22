import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Home from "../pages/main/Home";
import MustChangePassword from "../pages/auth/MustChangePassword";
import NotFound from "../pages/error/NotFound";

import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/must-change-password" element={<ProtectedRoute />}>
        <Route index element={<MustChangePassword />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
