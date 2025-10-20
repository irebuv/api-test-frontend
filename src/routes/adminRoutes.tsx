import React from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminPanel from "@/pages/admin/admin";

export const adminRoutes: RouteObject[] = [
    {
        path: "/admin/*",
        element: (
            <ProtectedRoute allowedRoles={["user","moderator"]}>
                <AdminPanel />
            </ProtectedRoute>
        ),
    },
];