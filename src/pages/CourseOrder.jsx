import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PaymentModel from "../components/PaymentModel";
import { checkEnrolledCourse, fetchStudentViewCourseListService } from "../api/ApiCall";

const GST_PERCENT = 0.18;

const OfferPurchase = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [offersList, setOffersList] = useState([]);
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [courseType, setCourseType] = useState("skill");
  const [openModel, setOpenModel] = useState(false);

  useEffect(() => {
    const handleLogin = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser && !user) {
        navigate("/auth/login");
        return;
      }
      await loadOffers(user);
    };

    handleLogin();
    // eslint-disable-next-line
  }, [user]);

  const loadOffers = async () => {
    try {
      const userId = user?._id;
      const enrolled = await checkEnrolledCourse(userId);
      if (enrolled?.enrolled) {
        navigate("/courses");
        return;
      }

      const response = await fetchStudentViewCourseListService();
      setOffersList(response?.data || []);
    } catch (err) {
      console.error("Failed to load offers:", err);
    } finally {
      setLoading(false);
    }
  };

  const isSelected = (id) => selectedOffers.some((item) => item._id === id);

  const handleSelect = (offer) => {
    isSelected(offer._id)
      ? handleRemove(offer._id)
      : setSelectedOffers([...selectedOffers, offer]);
  };

  const handleRemove = (id) =>
    setSelectedOffers(selectedOffers.filter((offer) => offer._id !== id));

  const calculateTotal = () => {
    let total = 0;

    if (courseType === "skill") {
      selectedOffers.forEach((_, idx) => {
        const base = idx === 0 ? 1499 : 749;
        total += base + base * GST_PERCENT;
      });
    } else {
      selectedOffers.forEach((_, idx) => {
        let base = 0;
        if (idx === 0) base = 2199;
        else if (idx > 1) base = 1099;
        total += base + base * GST_PERCENT;
      });
    }

    return total.toFixed(2);
  };

  const handlePayment = () => {
    if (!selectedOffers.length) {
      alert("Please select at least one course.");
      return;
    }
    console.log("Couse data: ", selectedOffers);
  };

  if (loading) return null;

  return (
    <>
      <div className="h-[calc(100vh-80px)] bg-gray-100 p-4">
        <div className="grid md:grid-cols-2 gap-4 h-full overflow-hidden">
          {/* Left - Offer Selection */}
          <div className="bg-white py-3 px-3 rounded-2xl shadow overflow-y-auto hide-scrollbar">
            <div className="mb-4">
              <label className="font-semibold">Choose Plan:</label>
              <select
                value={courseType}
                onChange={(e) => {
                  setSelectedOffers([]);
                  setCourseType(e.target.value);
                }}
                className="ml-2 p-1 border rounded"
              >
                <option value="skill">Skill Builder</option>
                <option value="career">Career Booster</option>
              </select>
            </div>

            <h2 className="text-lg font-semibold mb-2 md:mb-4">Available Courses</h2>
            <ul className="space-y-2">
              {offersList.map((offer) => (
                <li
                  key={offer._id}
                  className={`px-3 py-2 md:py-3 rounded-xl text-sm cursor-pointer flex justify-between items-center transition ${isSelected(offer._id)
                      ? "bg-green-100 border-2 border-green-400"
                      : "bg-gray-50 hover:bg-gray-200"
                    }`}
                  onClick={() => handleSelect(offer)}
                >
                  <span>{offer.title}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right - Cart & Checkout */}
          <div className="bg-white p-6 rounded-2xl shadow flex flex-col relative">
            <div className="overflow-y-auto pb-24 hide-scrollbar">
              <h2 className="text-lg font-semibold mb-2">Selected Courses</h2>
              <ul className="space-y-2">
                {selectedOffers.length === 0 ? (
                  <p className="text-gray-500">No Course selected</p>
                ) : (
                  selectedOffers.map((item) => (
                    <li
                      key={item._id}
                      className="bg-green-50 px-3 py-2  md:py-3 text-sm rounded-xl border border-green-300 flex justify-between items-center"
                    >
                      <span>{item.title}</span>
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="text-red-500 hover:underline text-xs"
                      >
                        Remove
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 w-full border-t bg-white pt-3 px-4 pb-4 shadow-md">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Total:</h3>
                <span className="text-xl font-bold text-green-700">
                  ₹{calculateTotal()}
                </span>
              </div>
              <div className="flex gap-4">
                <Link to="/courses" className="w-full">
                  <button className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-800 text-white">
                    Cancel
                  </button>
                </Link>
                <button
                  onClick={handlePayment}
                  className="w-full py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white"
                >
                  Confirm Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {openModel && (
        <PaymentModel
          data={selectedOffers}
          courseType={courseType}
          price={calculateTotal()}
          setOpenModel={setOpenModel}
        />
      )}
    </>
  );
};

export default OfferPurchase;