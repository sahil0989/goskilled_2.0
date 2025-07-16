import { useState } from "react";

export default function FAQ() {

  const [searchTerm, setSearchTerm] = useState("");


  const faqs = {
    general: [
      {
        question: "What is GoSkilled?",
        answer: "GoSkilled is an online skill education platform that teaches you new and in-demand skills aligned with the digital era. Along with that, our Affiliate Model gives you the opportunity to earn ₹27,000 to ₹1,00,000 per month.",
      },
      {
        question: "Who started GoSkilled?",
        answer: "GoSkilled was launched in 2025 by Ashish (Founder) and Neha (Co-founder).",
      },
      {
        question: "What is the main mission of GoSkilled?",
        answer: "Our mission is to build a skilled workforce of over 1 crore people by 2030, enabling individuals to take their careers to new heights.",
      },
      {
        question: "How is GoSkilled different from others?",
        answer: "GoSkilled is not just about learning skills; it also offers a new way to earn. Along with learning from our courses, you can earn through our affiliate model by referring others.",
      },
      {
        question: "Can the skills taught by GoSkilled help me get a job?",
        answer: "Our courses are designed to build in-demand skills that can improve your chances in freelancing, job applications, or starting your own projects — but your success depends on how consistently you learn and apply them.",
      },
    ],
    courses: [
      {
        question: "What skills does GoSkilled offer courses on?",
        answer: "We offer courses in trending skills such as: AI & Prompt Engineering, Stock Trading, Instagram Mastery, Website Development (WordPress & Shopify), Digital Marketing Mastery, Content Creation & Monetization",
      },
      {
        question: "Are the courses live or recorded?",
        answer: "All our courses are recorded so that you can learn at your own convenience.",
      },
      {
        question: "Do I get a certificate after completing a course?",
        answer: "Yes, GoSkilled provides an industry-standard certificate after each course.",
      },
      {
        question: "What is the learning format at GoSkilled?",
        answer: "✔ Video Tutorials\n✔ PDF Notes\n✔ Assignments\n✔ Live Webinars (in selected courses)\n✔ Customer Support",
      },
      {
        question: "Are the courses available in Hindi or English?",
        answer: "Our courses are taught in a mix of Hindi and English to make them easy to understand for most learners.",
      },
    ],
    pricing: [
      {
        question: "What is the cost of GoSkilled courses?",
        answer: "We have two packages:\n👉 Skill Builder Package – ₹1499 [1 course]\n👉 Career Booster Package – ₹2199 [2 courses with premium features]\n💡 Currently, all prices are GST-free! Once we cross the ₹20 Lakh government limit, an 18% GST will be added.",
      },
      {
        question: "Is EMI available for GoSkilled courses?",
        answer: "No, EMI options are currently not available.",
      },
      {
        question: "Can I purchase more than one course?",
        answer: "Yes! You can buy a base package and later add more courses at ₹749 (Skill Builder) or ₹1099 (Career Booster).",
      },
      {
        question: "Is the course fee refundable?",
        answer: "Refunds are not generally offered. Please refer to our official Refund Policy for complete details.",
      },
      {
        question: "What payment methods are available?",
        answer: "✔ UPI\n✔ Debit/Credit Card\n✔ Net Banking",
      },
    ],
    affiliate: [
      {
        question: "What is GoSkilled’s Affiliate Model?",
        answer: "It’s a referral-based income system where you can earn by selling GoSkilled’s courses.",
      },
      {
        question: "How much can I earn?",
        answer: "You can earn between ₹27,000 to ₹1,37,500 per month. or more",
      },
      {
        question: "What is the referral commission structure?",
        answer: "✔ Skill Builder – ₹900 per direct referral\n✔ Career Booster – ₹1250 per direct referral\n✔ 2nd Level – ₹150 / ₹250 per referral\n✔ 3rd Level – ₹75 / ₹150 per referral",
      },
      {
        question: "How and when will I get paid?",
        answer: "✔ Payouts are processed every Monday.\n✔ Amount is credited to your bank within 24-48 hours.\n✔ Minimum withdrawal is ₹500.",
      },
      {
        question: "Why is KYC required?",
        answer: "KYC verification is mandatory to secure your payments.",
      },
    ],
    selling: [
      {
        question: "How can I explain the value of GoSkilled to others?",
        answer: "✔ There’s growing demand for skill-based learning in the market.\n✔ GoSkilled offers opportunities to both learn and earn.",
      },
      {
        question: "What if someone says they don’t have money?",
        answer: "\"This ₹1499 is an investment that boosts both your skills and income. You’ll learn it once and benefit for a lifetime.\"",
      },
      {
        question: "What if someone says they don’t need the course?",
        answer: "\"Today, 90% of companies prefer skill-based hiring. A degree alone isn't enough — you need the right skills.\"",
      },
      {
        question: "What if someone asks for proof of GoSkilled’s credibility?",
        answer: "Our official website, Instagram page, our legal documents and the success stories of many students serve as proof.",
      },
      {
        question: "Can they try GoSkilled for free before buying?",
        answer: "Our content is so valuable that we don’t offer free trials, but we will guide you thoroughly on what you’ll gain from the course.",
      },
    ],
    misc: [
      {
        question: "What is GoSkilled’s website?",
        answer: "👉 www.GoSkilled.in",
      },
      {
        question: "How to contact support?",
        answer: "📞 +91 8572-887-888 (WhatsApp Support Available)",
      },
      {
        question: "Is GoSkilled a fraud or scam?",
        answer: "No! It is a Government-registered and legal platform.",
      },
      {
        question: "Can I recommend GoSkilled to friends?",
        answer: "Yes, and you can earn ₹900 - ₹1250 per referral.",
      },
      {
        question: "Is GoSkilled available for international students?",
        answer: "Currently available only in India, but we are expanding to international markets soon.",
      },
    ],
  };

  const filterFAQs = (faqList) =>
    faqList.filter(
      ({ question, answer }) =>
        question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        answer.toLowerCase().includes(searchTerm.toLowerCase())
    );


  return (
    <>
      <div className="max-w-screen-xl mx-auto px-5 bg-white min-h-screen">
        <div className="flex flex-col items-center">
          <h2 className="font-bold text-5xl mt-5 tracking-tight">FAQ</h2>
          <p className="text-neutral-500 text-xl my-3">Frequently asked questions</p>

          {/* 🔍 Search Bar */}
          <input
            type="text"
            placeholder="Search FAQs..."
            className="w-full max-w-xl p-3 border rounded-md mt-4 focus:outline-none focus:ring-2 focus:ring-green-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Reusable section */}
        {Object.entries(faqs).map(([category, items]) => {
          const filtered = filterFAQs(items);
          if (filtered.length === 0) return null;

          const categoryTitleMap = {
            general: "GENERAL QUESTIONS ABOUT GOSKILLED",
            courses: "COURSES & LEARNING AT GOSKILLED",
            pricing: "PRICING & PAYMENT",
            affiliate: "EARNING OPPORTUNITY – AFFILIATE MODEL",
            selling: "HOW TO SELL & HANDLE OBJECTIONS",
            misc: "MISCELLANEOUS QUERIES",
          };

          return (
            <div key={category}>
              <h2 className="flex flex-col items-center mt-8 text-xl font-bold">
                {categoryTitleMap[category] || category}
              </h2>
              <div className="grid divide-y divide-neutral-200 max-w-xl mx-auto mt-4">
                {filtered.map((faq, index) => (
                  <div key={index} className="py-5">
                    <details className="group">
                      <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                        <span>{faq.question}</span>
                        <span className="transition group-open:rotate-180">
                          <svg
                            fill="none"
                            height="24"
                            width="24"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </span>
                      </summary>
                      <p className="text-neutral-600 mt-3 whitespace-pre-line">{faq.answer}</p>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </>
  );
}