import axios from "axios";
import {toast} from '@/components/ui/custom/sonner';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
api.interceptors.response.use(
    (response) => {
        if (response.data?.message) {
            toast.success(response.data.message);
        }
        return response;
    },
    (error) => {
        const status = error.response?.status;
        const message =
            error.response?.data?.message || "There\'s some mistakes to receive a respond!";

        if (status === 401) {
            toast.error("Your session is over!");
            localStorage.removeItem("token");
        } else {
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

export default api;
