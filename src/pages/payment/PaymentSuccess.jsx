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

    const verifyPayment = async () => {
        try {
            const response = await verifyPaymentApi(orderId);

            console.log("Verifying Data : ", response);

            if (response.success && (response.status === "SUCCESS" || response.status === "PAID")) {
                setBooking(response.payment);
            } else if (response.status === "FAILED" || response.status === "CANCELLED") {
                setError("Your payment was cancelled or failed. Please try again.");
            } else {
                setError("Payment is still pending. Please check again later.");
            }
        } catch {
            setError("Failed to verify payment");
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

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Payment Error</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                        >
                            Back to Booking
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                    <p className="text-gray-600 mb-6">Your consultation has been booked successfully.</p>

                    {booking && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                            <h3 className="font-semibold text-gray-800 mb-3">Order Details</h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="font-medium text-gray-600">Package:</span> {booking.packageType}
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Course:</span>{" "}
                                    {booking.courses && booking.courses.length > 0
                                        ? booking.courses[0].courseTitle
                                        : "N/A"}
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Order ID:</span> {booking.orderId}
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Transaction ID:</span>{" "}
                                    {booking.transactionId}
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Amount:</span> ₹{booking.amount} {booking.currency}
                                </div>

                                {booking.responseData?.order?.customer_details && (
                                    <>
                                        <div>
                                            <span className="font-medium text-gray-600">Email:</span>{" "}
                                            {booking.responseData.order.customer_details.customer_email}
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Phone:</span>{" "}
                                            {booking.responseData.order.customer_details.customer_phone}
                                        </div>
                                    </>
                                )}

                                {booking.responseData?.payments?.[0]?.payment_method?.card && (
                                    <>
                                        <div>
                                            <span className="font-medium text-gray-600">Card:</span>{" "}
                                            {booking.responseData.payments[0].payment_method.card.card_network.toUpperCase()} •{" "}
                                            {booking.responseData.payments[0].payment_method.card.card_number}
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Bank:</span>{" "}
                                            {booking.responseData.payments[0].payment_method.card.card_bank_name}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                        >
                            Book Another Consultation
                        </button>
                        <p className="text-xs text-gray-400">
                            You will receive a confirmation email shortly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;