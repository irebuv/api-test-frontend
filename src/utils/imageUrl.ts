const API_BASE_URL = "http://localhost:8000";

export const imageUrl = (path?: string) => {
    if (!path) return "";
    return `${API_BASE_URL}/storage/${path}`;
};
