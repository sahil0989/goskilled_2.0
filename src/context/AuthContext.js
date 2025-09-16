import { createContext, useContext, useState, useEffect } from "react";
import { fetchLeaderboardData, getUserDetails, getUserPayments } from "../api/ApiCall";
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
  const [userPayments, setUserPayments] = useState([]);
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
            logout("Session timeout. Please login again!");
            return;
          }

          await getUserData();
        } catch (err) {
          logout("Session error. Please login again!");
        }
      }
    };

    checkAuth();
    // eslint-disable-next-line
  }, []);


  const getUserData = async () => {
    setAuthLoading(true);

    const response = await getUserDetails();

    if (response?.success) {
      setUser(response.data.user);
      await getLeaderboard();
      await fetchUserPayments(response.data.user._id);
    } else {
      const wasManual = sessionStorage.getItem("manualLogout") === "true";
      if (!wasManual) {
        logout("Session expired. Please login again.");
      }
    }

    setAuthLoading(false);
  };

  const fetchUserPayments = async (id) => {
    try {
      const data = await getUserPayments(id);

      if (data.success) {
        setUserPayments(data.payments);
        console.log(data.payments);
      }
    } catch (err) {

    }
  }

  const getLeaderboard = async () => {
    const data = await fetchLeaderboardData();
    if (data?.success) {
      setLeaderboard(data?.data);
    }
  }

  const login = async (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = (message = null) => {
    const wasManual = sessionStorage.getItem("manualLogout") === "true";

    // Clear user data
    setUser(null);
    setReferrals(null);
    setLeaderboard([]);
    logoutHelper();

    // Show appropriate toast
    if (wasManual) {
      toast.success("Logout Successfully!!");
    } else if (message) {
      toast.error(message);
    }

    // Delay clearing to avoid race conditions
    setTimeout(() => {
      sessionStorage.removeItem("manualLogout");
    }, 100); // Enough time for other checks to complete
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, setAuthLoading, authLoading, referrals, setReferrals, leaderboard, userDashboardSidebar, setUserDashboardSidebar, getUserData, getLeaderboard, fetchUserPayments, userPayments }}>
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