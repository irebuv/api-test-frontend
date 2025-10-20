import './App.css';
import {useRoutes} from "react-router-dom";
import {appRoutes} from "@/routes/routes";
function App() {
    return useRoutes(appRoutes);
}

export default App;