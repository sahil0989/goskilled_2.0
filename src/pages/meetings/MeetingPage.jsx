import React, { useEffect, useState } from 'react';
import ZoomMeetingCard from './MeetingsComp';
import { getMeetings } from './meetingServices';
import { toast } from 'sonner';

export default function MeetingPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await getMeetings();
      console.log(res.data);
      setMeetings(res.data);
    } catch (err) {
      toast.error("Failed to fetch meetings.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">Our Meetings</h1> */}

      {loading ? (
        <p className="text-center text-gray-500">Loading meetings...</p>
      ) : meetings.length === 0 ? (
        <p className="text-center text-gray-500">No upcoming meetings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <ZoomMeetingCard key={meeting._id} meeting={meeting} />
          ))}
        </div>
      )}
    </div>
  );
}
