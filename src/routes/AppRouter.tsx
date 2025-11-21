import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import LandingPage from "../pages/LandingPage";
import AlertsPage from "../services/alert-service/AlertsPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
