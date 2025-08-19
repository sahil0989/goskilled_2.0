import React, { useRef } from 'react';
import { RiBankLine } from 'react-icons/ri';
import {
    mediaPhotoDeleteService,
    mediaUploadService,
    paymentSubmitService,
} from '../api/ApiCall';
import { useMedia } from '../context/media-context/mediaContext';
import { Button } from '../@/components/ui/button';
import MediaProgressbar from './videoPlayer/MediaProgressBar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Label } from '../@/components/ui/label';
import { Input } from '../@/components/ui/input';
import { toast } from 'sonner';

export default function PaymentModel({ data, setOpenModel, courseType, price }) {
    const {
        setMediaUploadProgress,
        setMediaUploadProgressPercentage,
        setPaymentData,
        paymentData,
        mediaUploadProgress,
        mediaUploadProgressPercentage,
    } = useMedia();

    const { user } = useAuth();
    const navigate = useNavigate();

    const fileInputRef = useRef(null);

    // Handle image upload and upload progress
    async function handleImageUploadChange(event) {
        const selectedImage = event.target.files[0];
        if (!selectedImage) return;

        const imageFormData = new FormData();
        imageFormData.append('file', selectedImage);

        try {
            setMediaUploadProgress(true);
            const response = await mediaUploadService(imageFormData, setMediaUploadProgressPercentage);
            if (response.success) {
                setPaymentData({
                    ...paymentData,
                    screenShot: response.data.url,
                    imagePublicId: response.data.public_id,
                });
            }
        } catch (error) {
            console.error('Image upload error:', error);
            // Optionally show user feedback here
        } finally {
            setMediaUploadProgress(false);
        }
    }

    // Replace existing uploaded image
    async function handleReplaceImage() {
        if (paymentData?.imagePublicId) {
            const deleteResponse = await mediaPhotoDeleteService(paymentData.imagePublicId);
            if (deleteResponse?.success) {
                setPaymentData({ screenShot: '', imagePublicId: '' });
                fileInputRef.current?.click();
            } else {
                console.error('Failed to delete previous image');
            }
        } else {
            fileInputRef.current?.click();
        }
    }

    // Submit payment with screenshot
    const handlePaymentForm = async () => {
        if (!user?._id) {
            return;
        }

        const courseArray = Array.isArray(data) ? data : [data];
        const payload = {
            userId: user._id,
            courseType,
            courseIds: courseArray.map((course) => course._id),
            screenshot: paymentData?.screenShot,
            imagePublicId: paymentData?.imagePublicId,
            amountPaid: price,
        };

        try {
            const response = await paymentSubmitService(payload);

            if (response.success) {
                setPaymentData({ screenShot: '', imagePublicId: '' });
                setOpenModel(false);
                navigate('/courses');
            } else {
                toast.error('Payment submission failed:', response.message || 'Unknown error');
            }

        } catch (error) {
            toast.error('Payment submission error:', error.message || error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-40 pt-36 md:pt-16 flex items-center justify-center px-4 py-8 overflow-auto">
            <div className="bg-white shadow-lg w-full max-w-md md:max-w-[650px] rounded-lg overflow-hidden max-h-[95vh] overflow-y-auto">
                {/* Close Button */}
                <div className="flex justify-end p-4">
                    <Button
                        onClick={() => setOpenModel(false)}
                        className="bg-red-700 hover:bg-red-800"
                    >
                        X
                    </Button>
                </div>

                {/* Payment Methods */}
                <div className="flex flex-col md:flex-row gap-6 px-6 pb-6">
                    {/* QR Code Section */}
                    <div className="w-full md:w-1/2 bg-[#1A6E0A] rounded-lg shadow p-6 flex flex-col items-center text-white font-semibold">
                        <img
                            src="https://res.cloudinary.com/dsy6lfi4p/image/upload/v1745167381/Screenshot_2025-04-20_221046_y6ka7w.png"
                            alt="UPI QR Code"
                            className="w-36 h-36 rounded mb-4 object-contain"
                        />
                        <p className="text-center text-sm">Scan Here to Pay Instantly</p>
                        <p className="text-center text-sm mt-1">UPI ID: 7404040806@PTSBI</p>
                    </div>

                    {/* Bank Details */}
                    <div className="w-full md:w-1/2 border-2 border-[#1A6E0A] rounded-lg shadow p-6 flex flex-col items-center text-[#1A6E0A] font-semibold">
                        <RiBankLine size={64} />
                        <p className="mt-4 text-center text-sm">Name: Ashish</p>
                        <p className="text-center text-sm mt-1">Account No.: 309024261036</p>
                        <p className="text-center text-sm mt-1">IFSC Code: RATN0000014</p>
                    </div>
                </div>

                {/* Amount */}
                <h2 className="px-6 font-bold text-lg md:text-xl mb-2">
                    Total Amount:
                </h2>
                <div className="px-6 text-sm md:text-base font-medium mb-4">
                    <p className="text-green-700">Pricing – Rs. {data?.pricing?.standard || price}</p>
                </div>

                {/* Upload progress bar */}
                {mediaUploadProgress && (
                    <div className="px-6 mb-6">
                        <MediaProgressbar
                            isMediaUploading={mediaUploadProgress}
                            progress={mediaUploadProgressPercentage}
                        />
                    </div>
                )}

                {/* Upload/Replace Screenshot */}
                <div className="px-6 mb-8">
                    {!paymentData?.screenShot ? (
                        <>
                            <Label htmlFor="payment-screenshot">Upload Payment Screenshot</Label>
                            <Input
                                id="payment-screenshot"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUploadChange}
                                ref={fileInputRef}
                            />
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <p className="text-[#1A6E0A] font-semibold text-sm text-center">
                                Screenshot Uploaded Successfully!
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    onClick={() => window.open(paymentData?.screenShot, '_blank')}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    View
                                </Button>
                                <Button
                                    onClick={handleReplaceImage}
                                    className="bg-yellow-600 hover:bg-yellow-700"
                                >
                                    Replace
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="px-6 pb-6">
                    <Button
                        className="w-full"
                        onClick={handlePaymentForm}
                        disabled={!paymentData?.screenShot}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    );
}
