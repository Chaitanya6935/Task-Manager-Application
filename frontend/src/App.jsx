
import AppRoutes from "./routes/AppRoutes";
import {useEffect} from "react";

function App() {
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "dark";

        document.body.classList.toggle(
            "light-theme",
            savedTheme === "light"
        );
    }, []);
    return <AppRoutes />;
}

export default App;
