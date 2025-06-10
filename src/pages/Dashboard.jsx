import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { IoLogoWhatsapp } from "react-icons/io";
import { AiFillInstagram } from "react-icons/ai";

const Dashboard = () => {

  const { user } = useAuth()
  const [currentUser] = useState(null)
  const navigate = useNavigate()

  console.log("User: ", user);

  useEffect(() => {
    const handleLogin = () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        navigate("/auth/login")
      }
    }
    handleLogin()
  }, [user, navigate, currentUser]);

  return (
    <div
      className="flex items-center justify-center"
      style={{ height: "calc(100vh - 80.8px)" }}
    >
      <div className="w-full max-w-[450px] bg-[#1A6E0A]/80 shadow-lg rounded-lg mx-5 pb-8">
        <div className="bg-white w-full p-8">
          <div className="flex justify-center">
            <h2 className="text-xl font-bold pb-8">Welcome!! {user?.name} in the GoSkilled Family </h2>
          </div>
          <p>We are launching soon! Stay tuned for exciting updates.</p>
          <br />
          <p>Your Referral Code :- [<span className="font-bold">{user?.referralCode}]</span></p>
          <p>Share with friends and earn rewards when they join!</p>
          <br />
          <p className="font-bold">Stay Excited & Stay Connected!</p>
          <br />
          <p>Have questions? Reach out to us at <span className="font-semibold">Goskilled.in@gmail.com</span></p>
        </div>

        <div className="flex flex-col items-center gap-5 w-full text-white py-4">
          <div className="flex justify-center w-full">
            Join our Community for Regular Updates
          </div>
          <div className="flex gap-4 px-4">
            <Link to={"https://chat.whatsapp.com/Fhcg5aqLfvVAOHhcwoEJaY"} className="px-4 w-1/2 bg-[#1A6E0A] flex justify-center items-center rounded-lg py-3 shadow-lg hover:bg-[#22401c]"><span className="pr-4"><IoLogoWhatsapp size={24} /></span>WhatsApp</Link>
            <Link to={"https://instagram.com/goskilled.in"} className="px-4 w-1/2 bg-[#405DE6] flex justify-center items-center rounded-lg py-3 shadow-lg hover:bg-[#22401c]"><span className="pr-4"><AiFillInstagram size={24} /></span>Instagram</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
