import React from "react";
import api from "@/lib/axios";

const Dashboard = () => {
    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const testApi = async () => {
        const res = await api.get("/user");
        console.log(res.data);
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-semibold mb-6">Панель управления</h1>
            <button
                className="bg-green-500 text-white px-4 py-2 rounded mr-3"
                onClick={testApi}
            >
                Проверить API
            </button>
            <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={logout}
            >
                Выйти
            </button>
        </div>
    );
};

export default Dashboard;
