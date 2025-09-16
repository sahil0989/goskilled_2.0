import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function UserPaymentHistory() {
    const [payments, setPayments] = useState([]);
    const [searchMobile, setSearchMobile] = useState("");
    const [filteredPayments, setFilteredPayments] = useState([]);

    const { userPayments } = useAuth();

    // Load payments from AuthContext
    useEffect(() => {
        console.log("userPayments in PaymentHistory:", userPayments);
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
                                    <td className="px-4 py-2 border">{p.orderId || "N/A"}</td>
                                    <td className="px-4 py-2 border">{p.mobileNumber || "N/A"}</td>
                                    <td className="px-4 py-2 border">{p.packageType || "N/A"}</td>
                                    <td className="px-4 py-2 border">
                                        {Array.isArray(p.courses) && p.courses.length > 0
                                            ? p.courses.map((c) => c.name || "N/A").join(", ")
                                            : "N/A"}
                                    </td>
                                    <td className="px-4 py-2 border">₹{p.amount ?? "N/A"}</td>
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
                                    <td className="px-4 py-2 border">
                                        {p.paymentMethod
                                            ? `${p.paymentMethod.type || ""} | ${p.paymentMethod.network || ""} | ${p.paymentMethod.bank || ""} | ${p.paymentMethod.number || ""}`
                                            : "N/A"}
                                    </td>
                                    <td className="px-4 py-2 border">{p.transactionId || "N/A"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
