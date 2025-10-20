import React, {ReactNode} from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth";

interface Props {
    children: ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};
