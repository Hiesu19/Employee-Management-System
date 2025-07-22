
import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Home from "../pages/main/Home";
import ChangePassword from "../pages/auth/MustChangePassword";
import NotFound from "../pages/error/NotFound";

import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes - không dùng layout */}
      <Route path="/login" element={<Login />} />

      <Route path="/change-password" element={<ProtectedRoute />}>
        <Route index element={<ChangePassword />} />
      </Route>

      {/* Main routes - sử dụng MainLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          <Route path="/settings" element={<div>Settings Page</div>} />
        </Route>
      </Route>

      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
