import { useEffect, useState } from 'react';

export default function ZoomMeetingCard({ meeting, setCourseId, setActiveTab }) {
    const dateTime = new Date(`${meeting.date}T${meeting.time}`);
    const [timeLeft, setTimeLeft] = useState(getRemainingTime());

    function getRemainingTime() {
        const now = new Date();
        const diff = dateTime - now;

        if (diff <= 0) return null;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        return { days, hours, minutes, seconds };
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const updatedTime = getRemainingTime();
            setTimeLeft(updatedTime);
        }, 1000);

        return () => clearInterval(interval);
        // eslint-disable-next-line  
    }, []);

    return (
        <div className="w-full mb-6">
            <div className="group border border-gray-300 rounded-2xl p-5 transition-all duration-300 hover:border-green-800 h-full shadow-sm bg-white">
                {/* Image */}
                {meeting.image && (
                    <div className="flex items-center mb-6">
                        <img
                            src={meeting.image}
                            alt="Meeting Visual"
                            className="rounded-lg w-full h-48 object-cover"
                        />
                    </div>
                )}

                {/* Title */}
                <h4 className="text-gray-900 font-semibold text-lg mb-2 line-clamp-2">
                    {meeting.title}
                </h4>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {meeting.description}
                </p>

                {/* Host */}
                {meeting.host && (
                    <p className="text-sm text-gray-500 mb-2 italic">
                        Hosted by {meeting.host}
                    </p>
                )}

                {/* Date & Time */}
                <div className="text-sm text-gray-500 mb-4">
                    <p><strong>Date:</strong> {new Date(meeting.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {new Date(`1970-01-01T${meeting.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>

                {/* Countdown */}
                {timeLeft ? (
                    <div className="text-center text-blue-600 font-semibold mb-4">
                        Starts in: {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
                    </div>
                ) : (
                    <div className="text-center text-red-600 font-semibold mb-4">
                        Meeting started or expired
                    </div>
                )}

                {/* Join Button */}
                <div
                    onClick={() => {
                        setCourseId(meeting._id);
                        setActiveTab('Meeting')
                    }}
                    className=" cursor-pointer block w-full text-center bg-green-800 text-white py-2 rounded-full hover:bg-green-900 transition"
                >
                    Join Meeting
                </div>
            </div>
        </div>
    );
}
