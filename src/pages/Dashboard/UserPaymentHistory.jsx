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
            const filtered = payments.filter(
                (p) =>
                    p.mobileNumber &&
                    p.mobileNumber.toString().includes(searchMobile.trim())
            );
            setFilteredPayments(filtered);
        }
    }, [searchMobile, payments]);

    // Helper to get readable payment method
    const getPaymentMethod = (p) => {
        // If already structured
        if (p.paymentMethod && typeof p.paymentMethod === "object") {
            const { type, network, bank, number } = p.paymentMethod;
            return `${type || ""} | ${network || ""} | ${bank || ""} | ${number || ""}`;
        }

        // If UNKNOWN, try fetching from responseData
        if (p.responseData?.payments?.length > 0) {
            const method = p.responseData.payments[0].payment_method;
            if (method.card) {
                const c = method.card;
                return `${c.card_type || ""} | ${c.card_network || ""} | ${c.card_bank_name || ""} | ${c.card_number || ""}`;
            } else if (method.netbanking) {
                const n = method.netbanking;
                return `NETBANKING | ${n.netbanking_bank_name || ""} | ${n.netbanking_account_number || ""}`;
            } else if (method.upi) {
                const u = method.upi;
                return `UPI | ${u.upi_id || ""}`;
            }
        }

        return "N/A";
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Payment History</h2>

            {/* Filter Section */}
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={searchMobile}
                    onChange={(e) => setSearchMobile(e.target.value)}
                    placeholder="Enter Mobile Number"
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
                            <th className="px-4 py-2 border">Mobile</th>
                            <th className="px-4 py-2 border">Package</th>
                            <th className="px-4 py-2 border">Courses</th>
                            <th className="px-4 py-2 border">Amount</th>
                            <th className="px-4 py-2 border">Status</th>
                            <th className="px-4 py-2 border">Payment Method</th>
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
                                    <td className="px-4 py-2 border text-xs">{p.orderId || "N/A"}</td>
                                    <td className="px-4 py-2 border text-xs">{p.mobileNumber || "N/A"}</td>
                                    <td className="px-4 py-2 border text-xs">{p.packageType || "N/A"}</td>
                                    <td className="px-4 py-2 border text-xs">
                                        <ul className="list-disc list-inside mt-1">
                                            {p.courses?.map((course, index) => (
                                                <li key={index}>{course.courseTitle}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-4 py-2 border text-xs">₹{p.amount ?? "N/A"}</td>
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
                                    <td className="px-4 py-2 border text-xs">{getPaymentMethod(p)}</td>
                                    <td className="px-4 py-2 border text-xs">{p.transactionId || "N/A"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
