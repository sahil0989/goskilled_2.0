import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    return exp < Date.now() / 1000;
  } catch {
    return true;
  }
};

const ProtectedRoute = ({ children }) => {
  const { logout } = useAuth();
  const token = localStorage.getItem("token");

  const isExpired = isTokenExpired(token);

  useEffect(() => {
    if (isExpired) {
      const manualLogout = sessionStorage.getItem("manualLogout") === "true";

      if (!manualLogout) {
        logout("Session expired. Please log in again.");
      } else {
        logout(); 
      }

    }
  }, [isExpired, logout]);

  if (isExpired) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
