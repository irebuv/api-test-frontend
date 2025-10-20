import {PropsWithChildren, useRef} from 'react';
import {toast, Toaster} from "@/components/ui/custom/sonner";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";

export default function MainContent({children} : PropsWithChildren){
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
            <Toaster />
            {children}
        </>
    );
}
