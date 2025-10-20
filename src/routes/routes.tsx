import {adminRoutes} from "./adminRoutes";
import Login from "@/pages/user/login";
import Home from "@/pages/public/home";
import Businesses from "@/pages/public/business/businesses";
import Dashboard from "@/pages/user/dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

export const appRoutes = [
    {
        path: "/login",
        element: <Login/>,
    },
    {
        path: "/*",
        element: <Home/>,
    },
    {
        path: "/business/*",
        element: <Businesses/>,
    },
    {
        path: "/dashboard/*",
        element: <ProtectedRoute>
            <Dashboard/>
        </ProtectedRoute>,
    },
    ...adminRoutes,
];
