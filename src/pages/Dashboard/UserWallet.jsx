import React, { useState } from 'react';

function UserWallet({ user, wallet, redeemHistory, handleRedeem, earningDetails, earningHistory }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [activeTab, setActiveTab] = useState('redeem')

    const onSubmitRedeem = () => {
        const amt = Number(amount);
        if (isNaN(amt) || amt <= 0) {
            alert('Please enter a valid redeem amount.');
            return;
        }
        handleRedeem(
            amt,
            () => {
                setIsFormOpen(false);
                setAmount('');
            },
            () => { }
        );
    };


    const handleCancelBtn = () => {
        setIsFormOpen(false);
        setAmount('');
    };

    const SkeletonBox = ({ height = 'h-6', width = 'w-full' }) => (
        <div className={`bg-gray-200 animate-pulse rounded ${height} ${width}`}></div>
    );

    const formatCurrency = (value) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2,
        })?.format(value);

    return (
        <div className="max-w-4xl mx-auto p-4">

            {/* Wallet Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {false ? (
                    <>
                        <div className="bg-blue-100 p-4 rounded-xl shadow flex flex-col gap-4">
                            <SkeletonBox height="h-4" width="w-1/2" />
                            <SkeletonBox height="h-6" width="w-3/4" />
                            <SkeletonBox height="h-8" width="w-full" />
                        </div>
                        <div className="bg-green-100 p-4 rounded-xl shadow flex flex-col gap-4">
                            <SkeletonBox height="h-4" width="w-1/2" />
                            <SkeletonBox height="h-6" width="w-3/4" />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-orange-100 p-4 rounded-xl shadow flex items-center justify-between px-8">
                            <p className="text-gray-700 font-semibold">Today's Earning</p>
                            <p className="text-xl font-bold text-orange-600 break-words">{formatCurrency(earningDetails?.today || 0)}</p>
                        </div>
                        <div className="bg-violet-100 p-4 rounded-xl shadow flex items-center justify-between px-8">
                            <p className="text-gray-700 font-semibold">Last 30 Days Earning</p>
                            <p className="text-xl font-bold text-violet-700 break-words">{formatCurrency(earningDetails?.last30Days || 0)}</p>
                        </div>
                        <div className="bg-blue-100 p-4 rounded-xl shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-8">
                            <div className='flex justify-between w-full md:flex-col'>
                                <p className="text-gray-700 font-semibold">Wallet Balance</p>
                                <p className="text-xl font-bold text-blue-700 break-words">{formatCurrency(wallet?.balance || 0)}</p>
                            </div>
                            <button
                                disabled={user?.kycStatus !== 'approved'}
                                onClick={() => setIsFormOpen(true)}
                                className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto ${user?.kycStatus !== 'approved' ? 'cursor-not-allowed' : 'cursor-pointer'}`} >
                                Redeem
                            </button>
                        </div>
                        <div className="bg-green-100 p-4 rounded-xl shadow flex items-center justify-between px-8">
                            <p className="text-gray-700 font-semibold">Total Earned</p>
                            <p className="text-xl font-bold text-green-700 break-words">{formatCurrency(earningDetails?.totalEarned || 0)}</p>
                        </div>
                    </>
                )}
            </div>

            {/* Redeem Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
                        <h2 className="text-lg font-bold mb-2">Redeem Amount</h2>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full border p-2 rounded mb-4"
                        />
                        <div className="flex flex-col sm:flex-row justify-between gap-3">
                            <button
                                onClick={onSubmitRedeem}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Submit
                            </button>
                            <button
                                onClick={handleCancelBtn}
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className='my-6 w-full flex justify-center gap-6'>
                <div className='border bg-gray-100 flex items-center justify-center rounded-full p-2 gap-5 shadow-inner font-semibold'>
                    <div onClick={() => setActiveTab('redeem')} className={`px-6 py-2 rounded-full cursor-pointer ${activeTab === 'redeem' ? "bg-white shadow" : ""}`}>Reedem History</div>
                    <div onClick={() => setActiveTab('wallet')} className={`px-6 py-2 rounded-full cursor-pointer ${activeTab !== 'redeem' ? "bg-white shadow" : ""}`}>Wallet History</div>
                </div>
            </div>

            {/* Reedem History  */}
            {activeTab === 'redeem' &&
                <div div className="mt-8">
                    <h3 className="text-lg font-bold mb-2 text-center sm:text-left">Redeem History</h3>
                    <div className="overflow-x-auto rounded-md shadow">
                        <table className="min-w-full bg-white text-sm sm:text-base">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 text-left">
                                    <th className="p-3 border-b">S.No.</th>
                                    <th className="p-3 border-b">Amount</th>
                                    <th className="p-3 border-b">Status</th>
                                    <th className="p-3 border-b">Requested At</th>
                                    <th className="p-3 border-b">Approved/Processed At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {false ? (
                                    Array(3)?.fill(0)?.map((_, i) => (
                                        <tr key={i} className="border-t">
                                            <td className="p-3"><SkeletonBox height="h-4" width="w-16" /></td>
                                            <td className="p-3"><SkeletonBox height="h-4" width="w-16" /></td>
                                            <td className="p-3"><SkeletonBox height="h-4" width="w-20" /></td>
                                            <td className="p-3"><SkeletonBox height="h-4" width="w-32" /></td>
                                            <td className="p-3"><SkeletonBox height="h-4" width="w-32" /></td>
                                        </tr>
                                    ))
                                ) : redeemHistory?.length === 0 ? (
                                    <tr>
                                        <td className="p-3 text-gray-500" colSpan="4">
                                            No history found.
                                        </td>
                                    </tr>
                                ) : (
                                    redeemHistory?.map((entry, index) => (
                                        <tr key={index} className="border-t hover:bg-gray-50">
                                            <td className="p-3 whitespace-nowrap">{index + 1}</td>
                                            <td className="p-3 whitespace-nowrap">₹ {entry?.amount}</td>
                                            <td className="p-3 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-semibold ${entry?.status === 'Applied'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : entry.status === 'Paid'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-200 text-gray-600'
                                                        }`}
                                                >
                                                    {entry?.status}
                                                </span>
                                            </td>
                                            <td className="p-3 whitespace-nowrap">
                                                {new Date(entry.requestedAt).toLocaleString()}
                                            </td>
                                            <td className="p-3 whitespace-nowrap">
                                                {entry?.processedAt ? new Date(entry?.processedAt)?.toLocaleString() : '—'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            }

            {/* Wallet History  */}
            {activeTab === 'wallet' &&
                <div div className="mt-8">
                    <h3 className="text-lg font-bold mb-2 text-center sm:text-left">Wallet History</h3>
                    <div className="overflow-x-auto rounded-md shadow">
                        <table className="min-w-full bg-white text-sm sm:text-base">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 text-left">
                                    <th className="p-3 border-b">S.No.</th>
                                    <th className="p-3 border-b">Amount</th>
                                    <th className="p-3 border-b">Course Type</th>
                                    <th className="p-3 border-b">Purchase Date</th>
                                    <th className="p-3 border-b">Purchased By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {false ? (
                                    Array(3)?.fill(0)?.map((_, i) => (
                                        <tr key={i} className="border-t">
                                            <td className="p-3"><SkeletonBox height="h-4" width="w-16" /></td>
                                            <td className="p-3"><SkeletonBox height="h-4" width="w-16" /></td>
                                            <td className="p-3"><SkeletonBox height="h-4" width="w-20" /></td>
                                            <td className="p-3"><SkeletonBox height="h-4" width="w-32" /></td>
                                            <td className="p-3"><SkeletonBox height="h-4" width="w-32" /></td>
                                        </tr>
                                    ))
                                ) : earningHistory?.length === 0 ? (
                                    <tr>
                                        <td className="p-3 text-gray-500" colSpan="4">
                                            No history found.
                                        </td>
                                    </tr>
                                ) : (
                                    earningHistory?.map((entry, index) => (
                                        <tr key={index} className="border-t hover:bg-gray-50">
                                            <td className="p-3 whitespace-nowrap">{index + 1}</td>
                                            <td className="p-3 whitespace-nowrap">₹ {entry?.amount}</td>
                                            <td className="p-3 whitespace-nowrap">
                                                {entry?.courseType}
                                            </td>
                                            <td className="p-3 whitespace-nowrap">
                                                {new Date(entry.purchasedDate).toLocaleString()}
                                            </td>
                                            <td className="p-3 whitespace-nowrap">
                                                {entry?.referredUser?.name}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            }

        </div >
    );
}

export default UserWallet;
