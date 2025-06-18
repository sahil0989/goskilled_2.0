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
        <div className="fixed inset-0 bg-black/50 z-10 flex justify-center items-center px-10 py-10 overflow-auto">
            <div className="bg-white shadow-lg w-full max-w-[650px] rounded-lg md:h-auto">
                <div className="flex justify-end p-4">
                    <Button onClick={() => setOpenModel(false)} className="bg-red-700 hover:bg-red-800">
                        X
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-8 px-8 pb-8">
                    {/* QR Code Section */}
                    <div className="w-full md:w-1/2 bg-[#1A6E0A] rounded-lg shadow-lg p-8 flex flex-col items-center justify-center text-white font-semibold">
                        <img
                            src="https://res.cloudinary.com/dsy6lfi4p/image/upload/v1745167381/Screenshot_2025-04-20_221046_y6ka7w.png"
                            alt="UPI QR Code"
                            className="w-44 h-44 rounded-lg mb-6"
                            loading="lazy"
                        />
                        <h2 className="mb-2 text-lg">Scan Here to Pay Instantly</h2>
                        <h2 className="text-lg font-medium">UPI ID: 7404040806@PTSBI</h2>
                    </div>

                    {/* Bank Details Section */}
                    <div className="w-full md:w-1/2 border-2 border-[#1A6E0A] rounded-lg shadow-lg p-8 flex flex-col items-center text-[#1A6E0A] font-semibold justify-center">
                        <RiBankLine size={76} />
                        <h2 className="mt-4">Name: Ashish</h2>
                        <h2 className="mt-2">Account No.: 309024261036</h2>
                        <h2 className="mt-2">IFSC Code: RATN0000014</h2>
                    </div>
                </div>

                {/* Amount */}
                <h2 className="px-8 font-bold text-xl mb-4">
                    Total Amount: Rs.{data?.pricing || price}
                </h2>

                {/* Upload progress bar */}
                <div className="px-8 mb-6">
                    {mediaUploadProgress && (
                        <MediaProgressbar
                            isMediaUploading={mediaUploadProgress}
                            progress={mediaUploadProgressPercentage}
                        />
                    )}
                </div>

                {/* Upload or Replace Screenshot */}
                <div className="px-8 mb-8">
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
                            <p className="text-[#1A6E0A] font-semibold">Screenshot Uploaded Successfully!</p>

                            <div className="flex gap-4">
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
                <div className="px-8 pb-8">
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
