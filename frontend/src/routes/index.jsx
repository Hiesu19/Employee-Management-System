import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import MustChangePassword from "../pages/auth/MustChangePassword";
import NotFound from "../pages/error/NotFound";
import Unauthorized from "../pages/error/Unauthorized";
import Home from "../pages/Home";

import ProtectedRoute from "../components/ProtectedRoute";
import RequireRole from "../components/RequireRole";
import MainLayout from "../layouts/MainLayout";

import Employees from "../pages/root/employees";
import AddEmployee from "../pages/root/employees/AddEmployee";
import EditEmployee from "../pages/root/employees/EditEmployee";
import Department from "../pages/root/department";
import DepartmentDetail from "../pages/root/department/DepartmentDetail";
import Request from "../pages/root/request";
import Report from "../pages/root/report";

import CheckInOut from "../pages/employee/checkInOut";
import MyRequests from "../pages/employee/request";
import AddRequest from "../pages/employee/request/addRequest";

import DepartmentManager from "../pages/manager/department";
import RequestManager from "../pages/manager/request";

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

            <Route path="/root/department" element={<Department />} />
            <Route path="/root/department/:departmentID" element={<DepartmentDetail />} />

            <Route path="/root/request" element={<Request />} />
            <Route path="/root/report" element={<Report />} />
          </Route>

          <Route element={<RequireRole allowedRoles={["employee", "manager"]} />}>
            <Route path="/me/checkinout" element={<CheckInOut />} />
            <Route path="/me/request" element={<MyRequests />} />
            <Route path="/me/request/add" element={<AddRequest />} />

          </Route>

          <Route element={<RequireRole allowedRoles={["manager"]} />}>
            <Route path="/manager/department" element={<DepartmentManager />} />
            <Route path="/manager/request" element={<RequestManager />} />
          </Route>

        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
