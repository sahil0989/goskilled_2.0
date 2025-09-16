import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function UserPaymentHistory() {
    const [payments, setPayments] = useState([]);
    const [searchMobile, setSearchMobile] = useState("");
    const [filteredPayments, setFilteredPayments] = useState([]);

    const { userPayments } = useAuth();

    // Load payments from AuthContext
    useEffect(() => {
        setPayments(userPayments || []);
        setFilteredPayments(userPayments || []);
    }, [userPayments]);

    // Live filter when typing
    useEffect(() => {
        if (!searchMobile.trim()) {
            setFilteredPayments(payments);
        } else {
            const search = searchMobile.trim().toLowerCase();

            const filtered = payments.filter((p) => {
                const orderIdMatch =
                    p.orderId &&
                    p.orderId.toString().toLowerCase().includes(search);

                const transactionMatch =
                    p.transactionId &&
                    p.transactionId.toString().toLowerCase().includes(search);

                const courseMatch =
                    Array.isArray(p.courses) &&
                    p.courses.some(
                        (c) =>
                            (c.courseTitle && c.courseTitle.toLowerCase().includes(search)) ||
                            (c.name && c.name.toLowerCase().includes(search))
                    );

                return orderIdMatch || transactionMatch || courseMatch;
            });

            setFilteredPayments(filtered);
        }
    }, [searchMobile, payments]);

    // Helper to get readable payment method in column format
    const getPaymentMethod = (p) => {
        if (p.paymentMethod && typeof p.paymentMethod === "object") {
            const { type, network, bank, number } = p.paymentMethod;
            return (
                <div className="flex flex-col text-xs">
                    {type && <span>Type: {type}</span>}
                    {network && <span>Network: {network}</span>}
                    {bank && <span>Bank: {bank}</span>}
                    {number && <span>Card No: {number}</span>}
                </div>
            );
        }

        if (p.responseData?.payments?.length > 0) {
            const method = p.responseData.payments[0].payment_method;

            if (method.card) {
                const c = method.card;
                return (
                    <div className="flex flex-col text-xs">
                        {c.card_type && <span>Type: {c.card_type}</span>}
                        {c.card_network && <span>Network: {c.card_network}</span>}
                        {c.card_bank_name && <span>Bank: {c.card_bank_name}</span>}
                        {c.card_number && <span>Card No: {c.card_number}</span>}
                    </div>
                );
            } else if (method.netbanking) {
                const n = method.netbanking;
                return (
                    <div className="flex flex-col text-xs">
                        <span>Type: Netbanking</span>
                        {n.netbanking_bank_name && <span>Bank: {n.netbanking_bank_name}</span>}
                        {n.netbanking_account_number && <span>Acc No: {n.netbanking_account_number}</span>}
                    </div>
                );
            } else if (method.upi) {
                const u = method.upi;
                return (
                    <div className="flex flex-col text-xs">
                        <span>Type: UPI</span>
                        {u.upi_id && <span>UPI ID: {u.upi_id}</span>}
                    </div>
                );
            }
        }

        return <span className="text-gray-400">N/A</span>;
    };

    return (
        <div className="p-6">

            {/* Filter Section */}
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={searchMobile}
                    onChange={(e) => setSearchMobile(e.target.value)}
                    placeholder="Enter orderId, TransactionId or Course Name"
                    className="border rounded-lg px-3 py-2 w-64"
                />
                <button
                    onClick={() => setSearchMobile("")}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                    Reset
                </button>
            </div>

            {/* Payment Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 border">Order ID</th>
                            <th className="px-4 py-2 border">Date & Time</th>
                            <th className="px-4 py-2 border">Package</th>
                            <th className="px-4 py-2 border w-64">Courses</th>
                            <th className="px-4 py-2 border">Amount</th>
                            <th className="px-4 py-2 border">Status</th>
                            <th className="px-4 py-2 border w-64">Payment Method</th>
                            <th className="px-4 py-2 border">Transaction ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center py-4 text-gray-500">
                                    No records found
                                </td>
                            </tr>
                        ) : (
                            filteredPayments.map((p) => (
                                <tr key={p.orderId} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border text-sm">{p.orderId || "N/A"}</td>
                                    <td className="px-4 py-2 border text-sm">
                                        {p.responseData?.payments?.[0]?.payment_time
                                            ? new Date(p.responseData.payments[0].payment_time).toLocaleString()
                                            : new Date(p.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2 border text-sm">{p.packageType || "N/A"}</td>
                                    <td className="px-4 py-2 border text-sm w-64">
                                        <ul className="list-disc list-inside mt-1">
                                            {p.courses?.map((course, index) => (
                                                <li key={index}>{course.courseTitle}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-4 py-2 border text-sm">₹{p.amount ?? "N/A"}</td>
                                    <td
                                        className={`px-4 py-2 border font-semibold ${p.status === "success"
                                            ? "text-green-600"
                                            : p.status === "failed"
                                                ? "text-red-600"
                                                : "text-yellow-600"
                                            }`}
                                    >
                                        {p.status || "N/A"}
                                    </td>
                                    <td className="px-4 py-2 border text-sm w-64">{getPaymentMethod(p)}</td>
                                    <td className="px-4 py-2 border text-sm">{p.transactionId || "N/A"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
