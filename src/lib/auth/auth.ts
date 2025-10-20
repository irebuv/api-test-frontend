import {jwtDecode} from "jwt-decode";

interface JwtPayload {
    exp: number;
}

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const { exp } = jwtDecode<JwtPayload>(token);
        if (Date.now() >= exp * 1000) {
            localStorage.removeItem("token");
            return false;
        }
        return true;
    } catch {
        localStorage.removeItem("token");
        return false;
    }
};
