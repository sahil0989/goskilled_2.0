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

  if (!token || isTokenExpired(token)) {
    logout()

    if (!sessionStorage.getItem("shownTokenExpiredToast")) {
      toast.error("Session expired. Please log in again.");
      sessionStorage.setItem("shownTokenExpiredToast", "true");

      setTimeout(() => {
        sessionStorage.removeItem("shownTokenExpiredToast");
      }, 5000);
    }

    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
