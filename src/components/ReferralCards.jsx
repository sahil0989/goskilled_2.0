import { BadgeCheck } from "lucide-react";

const packages = [
  {
    title: "Skill Builder",
    price: "₹1499",
    levels: [
      { label: "Direct Referral", amount: "₹900" },
      { label: "2nd Level", amount: "₹150" },
      { label: "3rd Level", amount: "₹75" },
    ],
  },
  {
    title: "Career Booster",
    price: "₹2199",
    levels: [
      { label: "Direct Referral", amount: "₹1250" },
      { label: "2nd Level", amount: "₹250" },
      { label: "3rd Level", amount: "₹150" },
    ],
  },
];

export default function ReferralCards() {
  return (
    <div className="grid md:grid-cols-2 gap-6 p-6">
      {packages.map((pkg, idx) => (
        <div
          key={idx}
          className="rounded-2xl shadow-xl border border-gray-200 p-6 bg-white hover:shadow-2xl transition"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-1">{pkg.title}</h2>
            <p className="text-lg text-gray-700 font-semibold">{pkg.price}</p>
          </div>

          <div className="mt-6 space-y-3">
            {pkg.levels.map((level, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <BadgeCheck className="w-5 h-5 text-green-600" />
                  <span>{level.label}</span>
                </div>
                <span className="font-semibold text-black">{level.amount}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
