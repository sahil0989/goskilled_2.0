import { useEffect, useState } from 'react';
import UserKYCDetails from './UserKYCDetails';
import UserDetails from './UserDetails';
import UserCourses from './userCourses';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchLeaderboardData, fetchReferredUser, submitKYCDetails } from '../../api/ApiCall';
import UserLeaderboard from './UserLeaderboard';
import UserReferrals from './UserReferrals';
import UserWallet from './UserWallet';
import axios from 'axios';
import { toast } from 'sonner';
import MeetingPage from '../meetings/MeetingPage';

const UserDashboard = () => {

  const { user, getUserData, userDashboardSidebar, setUserDashboardSidebar, getLeaderboard } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [kycVerified, setKycVerified] = useState(false);
  const [redeemHistory, setRedeemHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState(null);
  const [referredUser, setReferredUser] = useState(null);

  useEffect(() => {
    const handleLogin = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        navigate("/auth/login")
      } else {
        const id = JSON.parse(storedUser);
        const data = await fetchReferredUser(id);
        const leaderData = await fetchLeaderboardData();
        setReferredUser(data)
        setLeaderboard(leaderData);
      }
    }
    handleLogin()
    // eslint-disable-next-line
  }, [user, navigate]);

  //userWallet
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        await getLeaderboard();
        const res = await axios.get(`${process.env.REACT_APP_BACKEND}/api/wallet/details/${user?._id}`);
        setRedeemHistory(Array?.isArray(res?.data?.history) ? res?.data?.history : []);
      } catch (err) {
        toast.error('Failed to load wallet data.');
      }
    };

    if (user?._id) fetchWalletData();
    // eslint-disable-next-line
  }, [user]);

  const handleVerifyKYC = async (data) => {
    setKycVerified(true);
    const response = await submitKYCDetails(data);
    if (response?.success) {
      await getUserData();
      setActiveTab('Dashboard');
    }
  };

  // userWallet
  const handleRedeem = async (amount, onSuccess, onError) => {
    if (amount < 500 || amount > 25000) {
      toast.warning('Amount must be between ₹500 and ₹25,000.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND}/api/wallet/withdraw/${user?._id}`, { amount });
      const res = await axios.get(`${process.env.REACT_APP_BACKEND}/api/wallet/details/${user?._id}`);
      setRedeemHistory(res?.data?.history);
      if (onSuccess) onSuccess();
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Redeem Failed";
      toast.error(errorMessage);
      if (onError) onError(errorMessage);
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: '🏠' },
    { name: 'Referrals', icon: '👥' },
    { name: 'Wallet', icon: '🪙' },
    { name: 'Our Meetings', icon: '📅' },
    { name: 'Leaderboard', icon: '📊' },
    { name: 'Courses', icon: '📚' },
    { name: 'KYC Verification', icon: '🆔' },
  ];

  return (
    <div className="relative h-[calc(100vh-80px)] flex md:flex-row bg-gray-50">
      {/* Sidebar */}
      <aside className="w-16 hidden md:flex md:w-64 flex-col shadow-xl">
        <div className="px-6 py-4 text-2xl font-semibold hidden md:block">
          Dashboard
        </div>
        <nav className="flex-1 px-4 py-2 mt-8 md:mt-0">
          <ul className="space-y-2">
            {menuItems?.map((item) => (
              <li key={item?.name}>
                <button
                  onClick={() => setActiveTab(item?.name)}
                  className={`w-full flex items-center justify-center md:justify-start gap-3 px-4 py-2 rounded-md ${activeTab === item?.name ? 'bg-[#1a4d10]/90 text-white' : 'hover:bg-[#1a4d10] hover:text-white'
                    }`}
                >
                  <span>{item?.icon}</span>
                  <span className='hidden md:block'>{item?.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <aside
        className={`absolute top-0 left-0 bg-gray-100 w-[220px] h-[calc(100vh-80px)] z-10 shadow-lg transition-transform duration-300 md:translate-x-0 ${userDashboardSidebar ? 'translate-x-0' : '-translate-x-full'
          } md:hidden`}
      >
        <div className="px-6 py-4 text-2xl font-semibold hidden md:block">
          Dashboard
        </div>
        <nav className="flex-1 px-4 py-2 mt-8 md:mt-0">
          <ul className="space-y-2">
            {menuItems?.map((item) => (
              <li key={item?.name} className='text-sm'>
                <button
                  onClick={() => {
                    setActiveTab(item?.name);
                    setUserDashboardSidebar(false);
                  }}
                  className={`w-full flex items-center flex-nowrap md:justify-start gap-3 px-4 py-2 rounded-md ${activeTab === item?.name
                    ? 'bg-[#1a4d10]/90 text-white'
                    : 'hover:bg-[#1a4d10] hover:text-white'
                    }`}
                >
                  <span>{item?.icon}</span>
                  <span>{item?.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-[calc(100vh-80px)] overflow-scroll p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6 capitalize">{activeTab}</h1>

        {activeTab === 'Dashboard' && <UserDetails user={user} kycVerified={kycVerified} setActiveTab={setActiveTab} />}

        {activeTab === 'Courses' && (<UserCourses />)}

        {activeTab === 'Wallet' && (
          <UserWallet
            user={user}
            wallet={user?.wallet}
            redeemHistory={redeemHistory}
            handleRedeem={handleRedeem}
          />
        )}

        {activeTab === 'Referrals' && (<UserReferrals referrals={referredUser?.referrals} username={user?.name} />)}

        {activeTab === 'Our Meetings' && <MeetingPage userId={user?._id} />}

        {activeTab === 'Leaderboard' && (<UserLeaderboard currentUser={user} users={leaderboard?.data} />)}

        {activeTab === 'KYC Verification' && (<UserKYCDetails user={user} kycVerified={kycVerified} handleVerifyKYC={handleVerifyKYC} />)}
      </main>
    </div>
  );
};

export default UserDashboard;
