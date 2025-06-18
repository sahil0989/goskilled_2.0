import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

export default function MeetingDetails() {
  const { id } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  // Modal and user details state
  const [showModal, setShowModal] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: '', email: '', phone: '' });
  const [checkingRegistration, setCheckingRegistration] = useState(true);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND}/admin/meetings/${id}`);
        setMeeting(res.data);
      } catch (err) {
        console.error('Error fetching meeting:', err);
      }
    };

    fetchMeeting();
  }, [id]);

  // Check if user is registered when meeting loads
  useEffect(() => {
    if (!meeting) return;

    const checkRegistration = async () => {
      try {
        const storedEmail = localStorage.getItem("meeting_email");
        if (!storedEmail) {
          setShowModal(true);
          setCheckingRegistration(false);
          return;
        }

        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND}/admin/meetings/${id}/registered`,
          { params: { email: storedEmail } }
        );

        if (!res.data.registered) {
          setShowModal(true);
        }
      } catch (err) {
        setShowModal(true);
      } finally {
        setCheckingRegistration(false);
      }
    };

    checkRegistration();
  }, [meeting, id]);

  useEffect(() => {
    if (!meeting) return;

    const dateTime = new Date(`${meeting.date}T${meeting.time}`);

    const getRemainingTime = () => {
      const now = new Date();
      const diff = dateTime - now;

      if (diff <= 0) return null;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      return { days, hours, minutes, seconds };
    };

    setTimeLeft(getRemainingTime());

    const interval = setInterval(() => {
      setTimeLeft(getRemainingTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [meeting]);

  if (!meeting || checkingRegistration) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading meeting details...
      </div>
    );
  }

  return (
    <div className="py-8 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-[#1A6E0A] backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-10 space-y-6 animate-fadeIn">

        {/* Image */}
        <div>
          {meeting.image && (
            <img
              src={meeting.image}
              alt="Meeting"
              className="w-full h-60 sm:h-72 md:h-80 object-cover rounded-xl shadow-lg transition-transform hover:scale-105 mb-10"
            />
          )}

          <div>
            {/* Title & Host */}
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 line-clamp-2">{meeting.title}</h1>
              {meeting.host && (
                <p className="text-sm text-gray-600 italic">Hosted by {meeting.host}</p>
              )}
            </div>

            {/* Description */}
            <p className="text-white/70 text-base sm:text-lg text-center ">{meeting.description}</p>

            {/* Date & Time */}
            <div className="text-white/70 text-center space-y-1 mb-4">
              <p><strong>Date:</strong> {new Date(meeting.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {new Date(`1970-01-01T${meeting.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>

            {/* Countdown */}
            {timeLeft ? (
              <div className="text-black font-semibold text-xl text-center bg-white/40 px-4 py-2 rounded-lg">
                Starts in: {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
              </div>
            ) : (
              <div className="text-red-600 font-semibold text-lg text-center">
                Meeting started or expired
              </div>
            )}
          </div>
        </div>

        {/* Join Now Button */}
        <div className="text-center">
          <button
            className="bg-white hover:bg-gray-200 text-black px-8 py-3 rounded-full text-lg font-medium transition duration-300 shadow-md hover:shadow-lg"
            onClick={() => {
              const storedEmail = localStorage.getItem("meeting_email");
              if (!storedEmail) {
                toast.info("Please register first.");
                setShowModal(true);
                return;
              }
              const meetingUrl = meeting.joinLink || window.location.href;
              navigator.clipboard.writeText(meetingUrl)
                .then(() => {
                  toast.success("Meeting link copied to clipboard!");
                })
                .catch((err) => {
                  toast.error("Failed to copy the meeting link.");
                });
            }}
          >
            Join Now
          </button>
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold">Register to Join Meeting</h2>
            <input
              type="text"
              placeholder="Name"
              value={userDetails.name}
              onChange={e => setUserDetails({ ...userDetails, name: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={userDetails.email}
              onChange={e => setUserDetails({ ...userDetails, email: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={userDetails.phone}
              onChange={e => setUserDetails({ ...userDetails, phone: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <button
              className="bg-[#1A6E0A] hover:bg-[#214d18] text-white px-6 py-2 rounded-lg shadow-md"
              onClick={async () => {
                const { name, email, phone } = userDetails;
                if (!name || !email || !phone) {
                  toast.warning("All fields are required.");
                  return;
                }

                try {
                  await axios.post(`${process.env.REACT_APP_BACKEND}/admin/meetings/register`, {
                    meetingId: meeting._id,
                    name,
                    email,
                    phone,
                  });

                  localStorage.setItem("meeting_email", email);
                  toast.success("Registered successfully!");
                  setShowModal(false);
                } catch (err) {
                  toast.error("Registration failed.");
                }
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
