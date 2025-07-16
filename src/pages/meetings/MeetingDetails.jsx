import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { CrossIcon } from 'lucide-react';

export default function MeetingDetails({ id, setActiveTab }) {

  const [meeting, setMeeting] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
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

        if (!res.data.registered) setShowModal(true);
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
    const interval = setInterval(() => setTimeLeft(getRemainingTime()), 1000);
    return () => clearInterval(interval);
  }, [meeting]);

  if (!meeting || checkingRegistration) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-xl">
        Loading meeting details...
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 md:px-10 bg-gradient-to-tr from-[#173C06] to-[#1A6E0A] min-h-screen flex justify-center items-start rounded-lg">
      <div className="relative w-full max-w-3xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 text-white space-y-6">
        <div onClick={() => setActiveTab("Our Meetings")} className='absolute right-4 rotate-45 top-4 text-white bg-red-700 p-2 rounded-lg cursor-pointer'><CrossIcon /> </div>
        {/* Image */}
        {meeting.image && (
          <img
            src={meeting.image}
            alt="Meeting"
            className="w-full h-56 sm:h-64 md:h-72 object-cover rounded-xl shadow-lg"
          />
        )}

        {/* Title & Host */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{meeting.title}</h1>
          {meeting.host && (
            <p className="text-sm sm:text-base text-gray-300 italic">Hosted by {meeting.host}</p>
          )}
        </div>

        {/* Description */}
        <p className="text-white/80 text-base sm:text-lg text-center">{meeting.description}</p>

        {/* Date & Time */}
        <div className="text-center text-white/70 space-y-1">
          <p><strong>Date:</strong> {new Date(meeting.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {new Date(`1970-01-01T${meeting.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>

        {/* Countdown */}
        {timeLeft ? (
          <div className="text-center bg-white/30 text-base sm:text-lg font-medium text-white rounded-lg py-2 px-4">
            Starts in: {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
          </div>
        ) : (
          <div className="text-red-400 font-semibold text-center">
            Meeting started or expired
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <button
            className="bg-white text-[#1A6E0A] hover:bg-gray-100 px-6 py-3 rounded-full font-semibold text-base shadow transition"
            onClick={() => {
              const storedEmail = localStorage.getItem("meeting_email");
              if (!storedEmail) {
                toast.info("Please register first.");
                setShowModal(true);
                return;
              }
              const meetingUrl = meeting.joinLink || window.location.href;
              window.open(meetingUrl, '_blank');
            }}
          >
            Join Now
          </button>
          <button
            className="bg-white text-[#1A6E0A] hover:bg-gray-100 px-6 py-3 rounded-full font-semibold text-base shadow transition"
            onClick={() => {
              const storedEmail = localStorage.getItem("meeting_email");
              if (!storedEmail) {
                toast.info("Please register first.");
                setShowModal(true);
                return;
              }
              const meetingUrl = meeting.joinLink || window.location.href;
              navigator.clipboard.writeText(meetingUrl)
                .then(() => toast.success("Meeting link copied to clipboard!"))
                .catch(() => toast.error("Failed to copy the meeting link."));
            }}
          >
            Copy Link
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white w-full max-w-md mx-4 my-8 p-6 rounded-xl shadow-2xl space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Register to Join</h2>

            <input
              type="text"
              placeholder="Your Name"
              value={userDetails.name}
              onChange={e => setUserDetails({ ...userDetails, name: e.target.value })}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-[#1A6E0A]"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={userDetails.email}
              onChange={e => setUserDetails({ ...userDetails, email: e.target.value })}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-[#1A6E0A]"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={userDetails.phone}
              onChange={e => setUserDetails({ ...userDetails, phone: e.target.value })}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-[#1A6E0A]"
            />

            <div className="flex justify-between pt-2">
              <button
                className="bg-gray-100 text-gray-600 px-4 py-2 rounded hover:bg-gray-200"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#1A6E0A] text-white px-6 py-2 rounded hover:bg-[#165707]"
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
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
