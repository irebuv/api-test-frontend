// src/App.tsx
// Mount the Toaster here so all pages can show toasts (including 429 errors)
import "./App.css";
import { useRoutes } from "react-router-dom";
import { appRoutes } from "@/routes/routes";
import {toast, Toaster} from "@/components/ui/custom/sonner";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useRef} from "react";

export default function App() {
    // React Router renders matched route tree
    const element = useRoutes(appRoutes);
    const location = useLocation();
    const navigate = useNavigate();
    const toastShownRef = useRef(false);

    useEffect(() => {
        if (location.state?.toastMessage && !toastShownRef.current) {
            toastShownRef.current = true;
            toast.error(location.state.toastMessage);

            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    return (
        <>
            {element}
            {/* Must be mounted once near the root; without this you won't see any toasts */}
            <Toaster />
        </>
    );
}
