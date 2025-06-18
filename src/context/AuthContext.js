import { createContext, useContext, useState, useEffect } from "react";
import { fetchLeaderboardData, getUserDetails } from "../api/ApiCall";
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
          await getUserData();

        } catch (err) {
          logout();
        }
      }
    };

    checkAuth();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log("Referrals updated:", referrals);
  }, [referrals]);


  const getUserData = async () => {
    setAuthLoading(true);
    const response = await getUserDetails();

    if (response && response.success) {
      console.log('User....')
      setUser(response.data.user);
    }
    setAuthLoading(false);
    await getLeaderboard();
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

  const logout = () => {
    sessionStorage.setItem("manualLogout", "true");

    setUser(null);
    setReferrals(null);
    setLeaderboard([]);
    logoutHelper();

    toast.success("Logout Successfully");
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, setAuthLoading, authLoading, referrals, setReferrals, leaderboard, userDashboardSidebar, setUserDashboardSidebar, getUserData, getLeaderboard }}>
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