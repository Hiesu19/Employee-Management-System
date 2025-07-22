import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authenticated, clearLocalStorage } from "../services/authService";

const ProtectedRoute = () => {
    const location = useLocation();
    const authStatus = authenticated();

    // 1: Chưa đăng nhập (0) → về /login
    if (authStatus === 0) {
        clearLocalStorage();
        return <Navigate to="/login" replace />;
    }

    // 2: Cần đổi mật khẩu (2) và không phải trang /change-password → về /change-password
    if (authStatus === 2 && location.pathname !== "/must-change-password") {
        return <Navigate to="/must-change-password" replace />;
    }

    // 3: Đã đổi mật khẩu (1) và đang ở /change-password → về /
    if (authStatus === 1 && location.pathname === "/must-change-password") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;