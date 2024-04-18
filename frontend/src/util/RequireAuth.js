import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../shared/context/auth-context";

export function RequireAuth({children}) {
    const {currentUser } = useAuth();
    let location = useLocation();

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    } else {
        return children;
    }
}