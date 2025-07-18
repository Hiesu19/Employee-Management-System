import { Navigate } from "react-router-dom";

function RequireAuth({ children, allowedRoles = [] }) {
    const token = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || !user) return <Navigate to="/login" replace />;

    return children;
}

export default RequireAuth;