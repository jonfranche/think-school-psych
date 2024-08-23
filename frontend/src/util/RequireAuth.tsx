import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../shared/context/auth-context";

type RequireAuthProps = {
    children: React.ReactNode
}

export function RequireAuth({children}: RequireAuthProps) {
    const {currentUser } = useAuth();
    let location = useLocation();

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    } else {
        return children;
    }
}