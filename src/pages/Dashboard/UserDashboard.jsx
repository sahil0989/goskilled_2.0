import { useEffect, useState } from 'react';
import { X } from "lucide-react";
import UserKYCDetails from './UserKYCDetails';
import UserDetails from './UserDetails';
import UserCourses from './userCourses';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchLeaderboardData, fetchReferredUser, getWalletEarningDetails, getWalletEarningHistory, submitKYCDetails } from '../../api/ApiCall';
import UserLeaderboard from './UserLeaderboard';
import UserReferrals from './UserReferrals';
import UserWallet from './UserWallet';
import axios from 'axios';
import { toast } from 'sonner';
import MeetingPage from '../meetings/MeetingPage';
import MeetingDetails from '../meetings/MeetingDetails';
import { useStudent } from '../../context/student-context/StudentContext';
import FAQ from '../Faq';
import ReferralCards from '../../components/ReferralCards';
import {
  LayoutDashboard,
  BadgeCheck,
  BookOpen,
  Users,
  Wallet,
  BarChart,
  CalendarDays,
  HelpCircle,
  CreditCard,
  HistoryIcon,
} from 'lucide-react';
import UserPaymentHistory from './UserPaymentHistory';

const UserDashboard = () => {

  const { user, getUserData, userDashboardSidebar, setUserDashboardSidebar, getLeaderboard } = useAuth()
  const { studentViewCoursesList } = useStudent()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [kycVerified, setKycVerified] = useState(false);
  const [earningDetails, setEarningDetails] = useState(null);
  const [earningHistory, setEarningHistory] = useState([]);
  const [redeemHistory, setRedeemHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState(null);
  const [referredUser, setReferredUser] = useState(null);
  const [courseId, setCourseId] = useState(null)
  const [purchasedCoursesData, setPurchasedCoursesData] = useState([]);
  const [notPurchasedCoursesData, setNotPurchasedCoursesData] = useState([]);

  const [showPopup, setShowPopup] = useState(false)

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

    // 👉 open popup on first mount
    setShowPopup(true);

    // eslint-disable-next-line
  }, [user, navigate]);

  //userWallet
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        await getLeaderboard();

        const res = await axios.get(`${process.env.REACT_APP_BACKEND}/api/wallet/details/${user?._id}`);

        const wallet = await getWalletEarningDetails(user?._id);
        const his = await getWalletEarningHistory(user?._id);

        if (wallet?.data?.success) {
          setEarningDetails(wallet?.data?.earnings)
        }
        if (his?.data?.success) {
          setEarningHistory(his?.data?.history);
        }
        setRedeemHistory(Array?.isArray(res?.data?.history) ? res?.data?.history : []);
      } catch (err) {
        toast.error('Failed to load wallet data.');
      }
    };

    if (user?._id) fetchWalletData();
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    const sortPurchasedCourse = () => {
      const purchasedCourseIds = user?.purchasedCourses || [];

      const purchasedCourses = studentViewCoursesList.filter(course =>
        purchasedCourseIds.includes(course._id)
      );

      const notPurchasedCourses = studentViewCoursesList.filter(course =>
        !purchasedCourseIds.includes(course._id)
      );

      setPurchasedCoursesData(purchasedCourses);
      setNotPurchasedCoursesData(notPurchasedCourses);
    }

    if (studentViewCoursesList) sortPurchasedCourse();
  }, [studentViewCoursesList])

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
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'KYC Verification', icon: BadgeCheck },
    { name: 'Courses', icon: BookOpen },
    { name: 'Referrals', icon: Users },
    { name: 'Wallet', icon: Wallet },
    { name: 'Leaderboard', icon: BarChart },
    { name: 'Payment History', icon: HistoryIcon },
    { name: 'Our Meetings', icon: CalendarDays },
    { name: 'FAQ', icon: HelpCircle },
    { name: 'Commision Structure', icon: CreditCard },
  ];

  const Popup = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md relative">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={() => setShowPopup(false)}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">🎉 Welcome!</h2>
        <p className="text-gray-600">
          Glad to see you here. Explore your dashboard and check out the latest updates.
        </p>

        <button
          className="mt-6 w-full bg-[#1a4d10] text-white py-2 rounded-lg hover:bg-[#14500d]"
          onClick={() => setShowPopup(false)}
        >
          Got it!
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative h-[calc(100vh-80px)] flex md:flex-row bg-gray-50">

      {showPopup && <Popup />}

      {/* Sidebar */}
      <aside className="w-16 hidden md:flex md:w-64 flex-col shadow-xl">
        <div className="px-6 py-4 text-2xl font-semibold hidden md:block">
          Dashboard
        </div>
        <nav className="flex-1 px-4 py-2 mt-8 md:mt-0">
          <ul className="space-y-2">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name} className="text-sm">
                    <button
                      onClick={() => setActiveTab(item.name)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-md ${activeTab === item.name
                        ? 'bg-[#1a4d10]/90 text-white'
                        : 'hover:bg-[#1a4d10] hover:text-white'
                        }`}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
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
            {menuItems?.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item?.name} className="text-sm">
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
                    <Icon size={18} />
                    <span>{item?.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-[calc(100vh-80px)] overflow-scroll p-4 md:p-6">
        {activeTab !== 'FAQ' && (
          <h1 className="text-3xl font-bold mb-6 capitalize">{activeTab}</h1>
        )}

        {activeTab === 'Dashboard' && <UserDetails earningDetails={earningDetails} user={user} kycVerified={kycVerified} setActiveTab={setActiveTab} />}

        {activeTab === 'Courses' && (<UserCourses purchasedCoursesData={purchasedCoursesData} notPurchasedCoursesData={notPurchasedCoursesData} />)}

        {activeTab === 'Wallet' && (
          <UserWallet
            earningDetails={earningDetails}
            user={user}
            wallet={user?.wallet}
            redeemHistory={redeemHistory}
            handleRedeem={handleRedeem}
            earningHistory={earningHistory}
          />
        )}

        {activeTab === "Payment History" && (<UserPaymentHistory />)}

        {activeTab === 'Referrals' && (<UserReferrals referrals={referredUser?.referrals} username={user?.name} />)}

        {activeTab === 'Our Meetings' && <MeetingPage userId={user?._id} setCourseId={setCourseId} setActiveTab={setActiveTab} />}

        {activeTab === 'Leaderboard' && (<UserLeaderboard currentUser={user} users={leaderboard?.data} />)}

        {activeTab === 'KYC Verification' && (<UserKYCDetails user={user} kycVerified={kycVerified} handleVerifyKYC={handleVerifyKYC} />)}

        {activeTab === 'Meeting' && (<MeetingDetails id={courseId} setActiveTab={setActiveTab} />)}

        {activeTab === 'FAQ' && (<FAQ />)}

        {activeTab === 'Commision Structure' && (<ReferralCards />)}

      </main>
    </div>
  );
};

export default UserDashboard;
