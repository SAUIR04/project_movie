import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login"; // Убедитесь, что регистр совпадает
import Tovar from "./components/Tovars"; // Убедитесь, что файл существует
import { AuthProvider } from "./contexts/AuthContext";
// import "./index.css";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/tovars" element={<Tovar />} /> {/* <-- добавь это */}
                <Route path="/tovar/:id" element={<Tovar />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;