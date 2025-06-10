import { useEffect, useState } from 'react';
import UserKYCDetails from './UserKYCDetails';
import UserDetails from './UserDetails';
import UserCourses from './userCourses';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { submitKYCDetails } from '../../api/ApiCall';
import UserLeaderboard from './UserLeaderboard';
import UserReferrals from './UserReferrals';
import UserWallet from './UserWallet';
import axios from 'axios';
import { toast } from 'sonner';

const UserDashboard = () => {

  const { user, getUserData, referrals, leaderboard, userDashboardSidebar, setUserDashboardSidebar } = useAuth()
  const [currentUser] = useState(null)
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [kycVerified, setKycVerified] = useState(false);
  const [wallet, setWallet] = useState({ balance: 0, totalEarned: 0 });
  const [redeemHistory, setRedeemHistory] = useState([]);
  const [walletLoading, setWalletLoading] = useState(true);
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line
  const [progressPercentage, setProgressPercentage] = useState(0);
  // eslint-disable-next-line
  const [walletBalance, setWalletBalance] = useState(0);
  // eslint-disable-next-line
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const handleLogin = () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        navigate("/auth/login")
      }
    }
    handleLogin()
  }, [user, navigate, currentUser]);

  //userWallet
  useEffect(() => {
    const fetchWalletData = async () => {
      setWalletLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/wallet/details/${user?._id}`);
        setWallet(res.data.wallet || { balance: 0, totalEarned: 0 });
        setRedeemHistory(Array.isArray(res.data.history) ? res.data.history : []);
      } catch (err) {
        toast.error('Failed to load wallet data.');
      } finally {
        setWalletLoading(false);
      }
    };

    if (user?._id) fetchWalletData();
  }, [user]);

  const handleVerifyKYC = async (data) => {
    setKycVerified(true);
    const response = await submitKYCDetails(data);
    if(response?.success) {
      await getUserData();
      setActiveTab('Dashboard');
      console.log("Got it");
    }
    console.log("response: ", response);
  };

  // userWallet
  const handleRedeem = async (amount, onSuccess, onError) => {
    if (amount < 500 || amount > 25000) {
      toast.warning('Amount must be between ₹500 and ₹25,000.');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/wallet/withdraw/${user?._id}`, { amount });
      const res = await axios.get(`http://localhost:5000/api/wallet/details/${user?._id}`);
      setWallet(res.data.wallet);
      setRedeemHistory(res.data.history);
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
    { name: 'Leaderboard', icon: `📊` },
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
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center justify-center md:justify-start gap-3 px-4 py-2 rounded-md ${activeTab === item.name ? 'bg-[#1a4d10]/90 text-white' : 'hover:bg-[#1a4d10] hover:text-white'
                    }`}
                >
                  <span>{item.icon}</span>
                  <span className='hidden md:block'>{item.name}</span>
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
            {menuItems.map((item) => (
              <li key={item.name} className='text-sm'>
                <button
                  onClick={() => {
                    setActiveTab(item.name);
                    setUserDashboardSidebar(false);
                  }}
                  className={`w-full flex items-center flex-nowrap md:justify-start gap-3 px-4 py-2 rounded-md ${activeTab === item.name
                    ? 'bg-[#1a4d10]/90 text-white'
                    : 'hover:bg-[#1a4d10] hover:text-white'
                    }`}
                >
                  <span>{item.icon}</span>
                  <span className="">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-[calc(100vh-80px)] overflow-scroll p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6 uppercase">{activeTab}</h1>

        {activeTab === 'Dashboard' && <UserDetails user={user} referrals={referrals?.referrals} walletBalance={walletBalance} kycVerified={kycVerified} setActiveTab={setActiveTab} />}

        {activeTab === 'Courses' && (<UserCourses />)}

        {activeTab === 'Wallet' && (
          <UserWallet
            user={user}
            wallet={wallet}
            redeemHistory={redeemHistory}
            loading={walletLoading}
            handleRedeem={handleRedeem}
          />
        )}

        {activeTab === 'Referrals' && (<UserReferrals referrals={referrals?.referrals} username={user?.name} />)}

        {activeTab === 'Leaderboard' && (<UserLeaderboard currentUser={user} users={leaderboard?.data} />)}

        {activeTab === 'KYC Verification' && (<UserKYCDetails user={user} kycVerified={kycVerified} handleVerifyKYC={handleVerifyKYC} />)}
      </main>
    </div>
  );
};

export default UserDashboard;
