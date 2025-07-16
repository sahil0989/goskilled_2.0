import React, { useState } from 'react';

export default function UserReferrals({ referrals, username }) {
    const tabs = ['Level 1', 'Level 2', 'Level 3'];
    const [activeTab, setActiveTab] = useState('Level 1');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortAsc, setSortAsc] = useState(true);
    const itemsPerPage = 10;

    const getLevelData = () => {
        if (activeTab === 'Level 1') return referrals?.level1 || [];
        if (activeTab === 'Level 2') return referrals?.level2 || [];
        if (activeTab === 'Level 3') return referrals?.level3 || [];
        return [];
    };

    const sortedData = getLevelData().sort((a, b) => {
        const dateA = new Date(parseInt(a?._id.substring(0, 8), 16) * 1000);
        const dateB = new Date(parseInt(b?._id.substring(0, 8), 16) * 1000);
        return sortAsc ? dateA - dateB : dateB - dateA;
    });

    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(sortedData?.length / itemsPerPage);

    const convertToCSV = (data) => {
        let headers = [];
        let rows = [];

        if (activeTab === 'Level 1') {
            headers = ['Name', 'Email', 'Phone', 'Unique Code', 'Direct Referrals'];
            rows = data?.map(item => [
                item?.name,
                item?.email,
                item?.mobileNumber,
                item?.referralCode,
                item?.referralLevels?.level1?.length,
                item?.wallet?.totalEarned,
            ]);
        } else {
            headers = ['Name', 'Email', 'Referred By'];
            rows = data?.map(item => [
                item?.name,
                item?.email,
                item?.referredBy?.name || '-',
            ]);
        }

        const csvContent =
            [headers, ...rows]
                ?.map(row =>
                    row
                        ?.map(field => `"${String(field)?.replace(/"/g, '""')}"`)
                        ?.join(',')
                )
                .join('\r\n');

        return csvContent;
    };

    const downloadCSV = () => {
        const csv = convertToCSV(sortedData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL?.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;

        // Safe check before replace
        const safeUsername =
            typeof username === 'string' && username.trim() !== ''
                ? username.replace(/\s+/g, '_')
                : 'user';

        const safeTab = activeTab.replace(/\s+/g, '');
        link.download = `${safeUsername}_${safeTab}_referrals.csv`;

        link.click();

        URL.revokeObjectURL(url);
    };

    const renderTableHeader = () => {
        if (activeTab === 'Level 1') {
            return (
                <tr className="bg-gray-100">
                    <th className="p-2 text-sm">S. No.</th>
                    <th className="p-2 text-sm">Name</th>
                    <th className="p-2 text-sm">Email</th>
                    <th className="p-2 text-sm">Phone</th>
                    <th className="p-2 text-sm">Unique Code</th>
                    <th className="p-2 text-sm">Direct Referrals</th>
                    <th className="p-2 text-sm">Total Earning</th>
                </tr>
            );
        }
        return (
            <tr className="bg-gray-100">
                <th className="p-2 text-sm">S.No.</th>
                <th className="p-2 text-sm">Name</th>
                <th className="p-2 text-sm">Email</th>
                <th className="p-2 text-sm">Referred By</th>
            </tr>
        );
    };

    const renderTableBody = () => {
        return paginatedData?.map((item, index) => (
            <tr key={item?._id} className="border-t">
                <td className="p-2 text-sm font-medium text-gray-700">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="p-2 text-sm">{item?.name}</td>
                <td className="p-2 text-sm">{item?.email}</td>
                {activeTab === 'Level 1' ? (
                    <>
                        <td className="p-2 text-sm">{item?.mobileNumber}</td>
                        <td className="p-2 text-sm">{item?.referralCode}</td>
                        <td className="p-2 text-sm">{item?.referralLevels?.level1?.length}</td>
                        <td className="p-2 text-sm">{item?.wallet?.totalEarned}</td>
                    </>
                ) : (
                    <td className="p-2 text-sm">{item?.referredBy?.name || '-'}</td>
                )}
            </tr>
        ));
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
            <h2 className="text-gray-700 text-base sm:text-lg mb-4 font-semibold">
                User Referrals
            </h2>

            <div className='flex flex-col md:flex-row w-full py-4 gap-2 text-white'>
                <div className=' w-full px-6 py-6 border-2 border-orange-600 bg-orange-500 rounded-lg flex justify-center text-xl font-semibold'>Level 1 : {referrals?.level1?.length}</div>
                <div className=' w-full px-6 py-6 border-2 border-purple-800 bg-purple-700 rounded-lg flex justify-center text-xl font-semibold'>Level 2 : {referrals?.level2?.length}</div>
                <div className=' w-full px-6 py-6 border-2 border-blue-600 bg-blue-500 rounded-lg flex justify-center text-xl font-semibold'>Level 3 : {referrals?.level3?.length}</div>
            </div>

            {/* Tabs and controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4">
                <div className="flex flex-wrap gap-2">
                    {tabs?.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                setCurrentPage(1);
                            }}
                            className={`px-3 py-1 text-sm rounded ${activeTab === tab
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setSortAsc(!sortAsc)}
                        className="px-4 py-1.5 text-sm bg-[#1A6E0A] text-white rounded"
                    >
                        Sort by Date {sortAsc ? '↑' : '↓'}
                    </button>
                    <button
                        onClick={downloadCSV}
                        className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded"
                        title={`Download ${activeTab} data as CSV`}
                    >
                        Download CSV
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>{renderTableHeader()}</thead>
                    <tbody>{renderTableBody()}</tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex sm:flex-row justify-center items-center gap-2 text-sm">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Prev
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
