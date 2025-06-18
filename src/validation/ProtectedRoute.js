import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
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
  // eslint-disable-next-line
  const [shouldRedirect, setShouldRedirect] = useState(isExpired);

  useEffect(() => {
    if (isExpired) {
      const manualLogout = sessionStorage.getItem("manualLogout");

      logout(); 
      
      if (!manualLogout && !sessionStorage.getItem("shownTokenExpiredToast")) {
        toast.error("Session expired. Please log in again.");
        sessionStorage.setItem("shownTokenExpiredToast", "true");

        setTimeout(() => {
          sessionStorage.removeItem("shownTokenExpiredToast");
        }, 5000);
      }

      sessionStorage.removeItem("manualLogout");
    }
  }, [isExpired, logout]);

  if (shouldRedirect) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
