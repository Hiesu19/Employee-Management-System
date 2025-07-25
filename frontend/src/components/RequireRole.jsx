import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getUser } from "../services/authService";

const RequireRole = ({ allowedRoles }) => {
    const location = useLocation();
    const user = getUser();

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default RequireRole;
