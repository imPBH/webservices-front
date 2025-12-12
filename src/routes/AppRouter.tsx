import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import LandingPage from "../pages/LandingPage";
import GoogleCallbackPage from "../pages/auth/GoogleCallbackPage";
import ProfilePage from "../pages/ProfilePage";
import ParkingPage from "../pages/ParkingPage";
import AlertsPage from "../pages/AlertsPage";
import { ProtectedRoute } from "../components/routes/ProtectedRoute";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parking"
          element={
            <ProtectedRoute>
              <ParkingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <AlertsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
