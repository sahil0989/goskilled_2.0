import { createContext, useContext, useState, useEffect } from "react";
import { fetchLeaderboardData, fetchReferredUser, getUserDetails } from "../api/ApiCall";
import { toast } from "sonner";

export const logoutHelper = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDashboardSidebar, setUserDashboardSidebar] = useState(false);
  const [referrals, setReferrals] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        try {
          const isTokenValid = isJWTValid(token);
          if (!isTokenValid) {
            logout();
            return;
          }

          getUserData();
          getReferredUserDetails();
        } catch (err) {
          logout();
        }
      }
    };

    checkAuth();
  }, []);

  const getUserData = async () => {
    setAuthLoading(true);
    const response = await getUserDetails();

    if (response && response.success) {
      setUser(response.data.user);
    }
    setAuthLoading(false);
    const data = await fetchLeaderboardData();

    setLeaderboard(data);
  }

  const getReferredUserDetails = async () => {
    try {
      const response = await fetchReferredUser();
      setReferrals(response);
    } catch (err) {
      toast.error(err.message);
    }
  }

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    logoutHelper();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, setAuthLoading, authLoading, referrals, setReferrals, leaderboard, userDashboardSidebar, setUserDashboardSidebar, getUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

function isJWTValid(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (e) {
    return false;
  }
}