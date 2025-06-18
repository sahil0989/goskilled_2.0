export default function FAQ() {
  const faqs = [
    {
      question: "What is a SAAS platform?",
      answer:
        "SAAS platform is a cloud-based software service that allows users to access and use a variety of tools and functionality.",
    },
    {
      question: "How does billing work?",
      answer:
        "We offer a variety of billing options, including monthly and annual subscription plans, as well as pay-as-you-go pricing. Payment is typically made through a credit card or other secure online method.",
    },
    {
      question: "Can I get a refund for my subscription?",
      answer:
        "We offer a 30-day money-back guarantee for most subscription plans. If you're not satisfied within the first 30 days, you can request a full refund. Refunds beyond that may be considered on a case-by-case basis.",
    },
    {
      question: "How do I cancel my subscription?",
      answer:
        "To cancel your subscription, log in to your account, go to the subscription management page, and cancel your plan there.",
    },
    {
      question: "Can I try this platform for free?",
      answer:
        "We offer a free trial of the platform for a limited time. You’ll have access to limited features during the trial without being charged.",
    },
    {
      question: "How do I access documentation?",
      answer:
        "Documentation is available on the company's website and can be accessed after logging in. It includes guides, code examples, and more.",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can contact our support team via the website or email us at support@We.com.",
    },
    {
      question: "Do you offer any discounts or promotions?",
      answer:
        "We may offer occasional discounts. Stay updated by subscribing to our newsletter or following us on social media.",
    },
    {
      question: "How do we compare to other similar services?",
      answer:
        "This platform is reliable and feature-rich, offering a wide range of tools at competitive prices and flexible billing options.",
    },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-5 bg-white min-h-screen">
      <div className="flex flex-col items-center">
        <h2 className="font-bold text-5xl mt-5 tracking-tight">FAQ</h2>
        <p className="text-neutral-500 text-xl mt-3">Frequently asked questions</p>
      </div>
      <div className="grid divide-y divide-neutral-200 max-w-xl mx-auto mt-8">
        {faqs.map((faq, index) => (
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
              <p className="text-neutral-600 mt-3 animate-fadeIn">{faq.answer}</p>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
