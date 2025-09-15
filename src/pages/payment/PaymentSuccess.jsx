import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { verifyPaymentApi } from '../../api/ApiCall';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const orderId = searchParams.get('order_id');

    useEffect(() => {
        if (orderId) {
            verifyPayment();
        } else {
            setError('No order ID found');
            setLoading(false);
        }
    }, [orderId]);

    const getPaymentMethodDetails = (payment) => {
        if (!payment?.responseData?.payments?.[0]?.payment_method) return null;

        const method = payment.responseData.payments[0].payment_method;

        if (method.card) {
            return {
                type: "Card",
                details: `${method.card.card_network.toUpperCase()} (${method.card.card_bank_name}) • ${method.card.card_number}`
            };
        }

        if (method.netbanking) {
            return {
                type: "NetBanking",
                details: `${method.netbanking.netbanking_bank_name} (Code: ${method.netbanking.netbanking_bank_code})`
            };
        }

        if (method.upi) {
            return {
                type: "UPI",
                details: method.upi.upi_id || "UPI Payment"
            };
        }

        return { type: "Unknown", details: "N/A" };
    };

    const verifyPayment = async () => {
        try {
            const response = await verifyPaymentApi(orderId);

            console.log("Verifying Data : ", response);

            if (response.success && (response.status === "SUCCESS" || response.status === "PAID")) {
                setBooking(response.payment);
            } else if (response.status === "FAILED" || response.status === "CANCELLED") {
                setBooking(response.payment);
                setError("FAILED");
            } else {
                setError("PENDING");
            }
        } catch {
            setError("ERROR");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[calc(100vh-80px)] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying payment...</p>
                </div>
            </div>
        );
    }

    // === Failed or Cancelled UI ===
    if (error === "FAILED") {
        const method = getPaymentMethodDetails(booking);
        const failureReason = booking?.failureReason ||
            booking?.responseData?.payments?.[0]?.error_details?.error_description ||
            "Your payment failed. Please try again.";

        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Payment Failed</h2>
                        <p className="text-gray-600 mb-6">{failureReason}</p>

                        {booking && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                                <h3 className="font-semibold text-gray-800 mb-3">Order Details</h3>
                                <div className="space-y-2 text-sm">
                                    <div><span className="font-bold">Package:</span> {booking.packageType}</div>
                                    <div><span className="font-bold">Course:</span> {booking.courses?.[0]?.courseTitle || "N/A"}</div>
                                    <div><span className="font-bold">Order ID:</span> {booking.orderId}</div>
                                    <div><span className="font-bold">Transaction ID:</span> {booking.transactionId}</div>
                                    <div><span className="font-bold">Amount:</span> ₹{booking.amount} {booking.currency}</div>
                                    {method && (
                                        <div>
                                            <span className="font-bold">Payment Method:</span>{" "}
                                            {method.type} – {method.details}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => window.location.href = '/'}
                            className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // === Pending UI ===
    if (error === "PENDING") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-yellow-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Payment Pending</h2>
                    <p className="text-gray-600 mb-6">Your payment is still being processed. Please check again later.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                    >
                        Refresh
                    </button>
                </div>
            </div>
        );
    }

    if (error === "ERROR") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Verification Failed</h2>
                    <p className="text-gray-600 mb-6">Unable to verify payment at the moment. Please try again later.</p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // === Success UI ===
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Payment Successful!</h2>
                    <p className="text-gray-600 mb-6 text-xs">Your Course added to your Dashboard Successfully.</p>

                    {booking && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                            <h3 className="font-semibold text-gray-800 mb-3">Order Details</h3>
                            <div className="space-y-2 text-sm">
                                <div><span className="font-bold">Package:</span> {booking.packageType}</div>
                                <div>
                                    <span className="font-bold">Courses:</span>{" "}
                                    {booking.courses?.map((course, index) => (
                                        <span key={index}>
                                            {course.courseTitle}
                                            {index < booking.courses.length - 1 ? ", " : ""}
                                        </span>
                                    ))}
                                </div>
                                <div><span className="font-bold">Order ID:</span> {booking.orderId}</div>
                                <div><span className="font-bold">Transaction ID:</span> {booking.transactionId}</div>
                                <div><span className="font-bold">Amount:</span> ₹{booking.amount} {booking.currency}</div>
                                {(() => {
                                    const method = getPaymentMethodDetails(booking);
                                    return method ? (
                                        <div>
                                            <span className="font-bold">Payment Method:</span>{" "}
                                            {method.type} – {method.details}
                                        </div>
                                    ) : null;
                                })()}
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                        >
                            Explore your Course
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;