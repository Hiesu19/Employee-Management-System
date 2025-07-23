import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Home from "../pages/main/Home";
import MustChangePassword from "../pages/auth/MustChangePassword";
import NotFound from "../pages/error/NotFound";
import Unauthorized from "../pages/error/Unauthorized";

import ProtectedRoute from "../components/ProtectedRoute";
import RequireRole from "../components/RequireRole";
import MainLayout from "../layouts/MainLayout";

import Employees from "../pages/root/employees";
import AddEmployee from "../pages/root/employees/AddEmployee";
import EditEmployee from "../pages/root/employees/EditEmployee";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route path="/must-change-password" element={<ProtectedRoute />}>
        <Route index element={<MustChangePassword />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route element={<RequireRole allowedRoles={["root"]} />}>
            <Route path="/root/employees" element={<Employees />} />
            <Route path="/root/employees/add" element={<AddEmployee />} />
            <Route path="/root/employees/edit/:employeeID" element={<EditEmployee />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
