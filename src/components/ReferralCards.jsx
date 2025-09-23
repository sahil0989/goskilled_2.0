import { BadgeCheck, Info } from "lucide-react";

const packages = [
  {
    title: "Skill Builder",
    price: "₹1499",
    rules: [
      "1st course: ₹1499",
      "Additional courses: ₹749 each",
      "18% GST extra",
    ],
    levels: [
      { label: "Direct Referral", amount: "₹900" },
      { label: "2nd Level", amount: "₹150" },
      { label: "3rd Level", amount: "₹75" },
    ],
  },
  {
    title: "Career Booster",
    price: "₹2199",
    rules: [
      "1st course: ₹2199",
      "Additional courses: ₹1099 each",
      "18% GST extra",
    ],
    levels: [
      { label: "Direct Referral", amount: "₹1250" },
      { label: "2nd Level", amount: "₹250" },
      { label: "3rd Level", amount: "₹150" },
    ],
  },
];

export default function ReferralCards() {
  return (
    <div className="grid md:grid-cols-2 gap-6 p-6 
                    max-h-[80vh] overflow-y-auto">
      {packages.map((pkg, idx) => (
        <div
          key={idx}
          className="rounded-2xl shadow-xl border border-gray-200 p-6 bg-white hover:shadow-2xl transition"
        >
          {/* Title & Base Price */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-1">{pkg.title}</h2>
            <p className="text-lg text-gray-700 font-semibold">
              {pkg.price} <span className="text-sm text-gray-500">(+GST)</span>
            </p>
          </div>

          {/* Pricing Rules */}
          <div className="mt-4 bg-gray-50 rounded-lg p-3 text-sm">
            <div className="flex items-center gap-2 mb-2 text-gray-600 font-semibold">
              <Info className="w-4 h-4 text-blue-500" />
              Pricing Rules
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {pkg.rules.map((rule, i) => (
                <li key={i}>{rule}</li>
              ))}
            </ul>
          </div>

          {/* Referral Levels */}
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
