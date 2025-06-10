import { useState } from 'react';

export default function UserLeaderboard({ users, currentUser }) {
    const [activeTab, setActiveTab] = useState('Total Earnings');

    const getMedal = (index) => {
        const medals = ['🥇', '🥈', '🥉'];
        return medals[index] || null;
    };

    if (!users?.length) {
        return (
            <div className="p-6 w-full md:h-[calc(100vh-210px)] bg-white rounded-lg shadow-md">
                <h2 className="text-center text-gray-500 text-lg">Loading leaderboard...</h2>
                <div className="space-y-2 mt-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-8 bg-gray-300 rounded animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    // Sort users based on active tab
    const sortedUsers = [...users].sort((a, b) => {
        if (activeTab === 'Total Earnings') {
            return (b.wallet?.balance || 0) - (a.wallet?.balance || 0);
        } else if (activeTab === 'Total Referrals') {
            return (b.totalReferrals || 0) - (a.totalReferrals || 0);
        }
        return 0;
    });

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-full md:h-[calc(100vh-210px)]">

            <div className="flex w-full h-full md:items-center flex-col md:flex-row gap-6">
                {/* leaderboard */}
                <div className="w-full md:h-[calc(100vh-260px)]">
                    <div className="flex justify-center w-full font-semibold md:text-md text-sm bg-green-800 text-white rounded-lg shadow-md py-3">
                        {['Total Referrals', 'Total Earnings'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg transition duration-300 w-full mx-2 ${activeTab === tab
                                        ? 'bg-white text-green-800 font-bold'
                                        : 'text-white'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div>
                        <ul className="space-y-2 shadow-md rounded-lg border-[#1a4d10] md:px-4 w-full md:h-[calc(100vh-330px)] overflow-x-hidden py-3">
                            {sortedUsers.map((user, index) => (
                                <li
                                    key={user._id}
                                    className={`flex items-center justify-between px-4 py-2 border-b`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-md md:text-2xl">{getMedal(index)}</span>
                                        {getMedal(index) === null ? <div>{index + 1}</div> : null}
                                        <span className="text-sm md:text-md text-gray-800">{user.name}</span>
                                    </div>

                                    {activeTab === 'Total Earnings' ? (
                                        <span className="text-sm md:text-md font-bold text-indigo-700 border-l-[3px] pl-3">
                                            ₹ {user.wallet?.balance?.toFixed(2) || '0.00'}
                                        </span>
                                    ) : (
                                        <span className="text-sm md:text-md font-bold text-indigo-700 border-l-[3px] pl-3">
                                            {user?.level1Count || 0} referrals
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* current user data */}
                <div className="flex justify-center items-center w-full h-full">
                    <div className="border rounded-lg shadow-md w-full h-auto flex flex-col justify-center items-center text-black p-6 md:px-12">
                        <div className="hidden md:flex items-center gap-5 py-4">
                            <img
                                src="https://th.bing.com/th/id/OIP.YoTUWMoKovQT0gCYOYMwzwHaHa?rs=1&pid=ImgDetMain"
                                alt="pic"
                                className="w-16 h-16 md:w-24 md:h-24 border rounded-full"
                            />
                            <h2 className="capitalize font-semibold md:text-xl">
                                {currentUser?.name || 'User'}
                            </h2>
                        </div>

                        {activeTab === 'Total Earnings' ? (
                            <div className="bg-gray-600 w-full text-white font-semibold rounded-lg px-3 py-2 md:py-3">
                                <div className="flex items-center px-3 justify-between">
                                    <h2>Your Earnings :</h2>
                                    <h4>₹ {currentUser?.wallet?.balance?.toFixed(2) || '0.00'}</h4>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-600 w-full text-white font-semibold rounded-lg px-3 py-2 md:py-3">
                                <div className="flex items-center px-3 justify-between">
                                    <h2>Your Referrals :</h2>
                                    <h4>{currentUser?.totalReferrals || 0}</h4>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
