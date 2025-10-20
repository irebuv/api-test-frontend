import React, {ReactNode} from "react";
import {Navigate} from "react-router-dom";
import {useAuth} from "@/context/AuthContext";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const {user, loading} = useAuth();

    if (loading) return null;

    if (!user) {
        return <Navigate to="/login" replace state={{ toastMessage: "You must be authorized to visit this page!" }}/>;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace state={{ toastMessage: "You don\'t have permission to visit this page!"}}/>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;