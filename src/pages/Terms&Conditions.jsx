import React from 'react';
import Footer from '../components/FooterSection';

export default function TermsConditions() {
  const sections = [
    {
      title: 'Introduction',
      content: `Welcome to GoSkilled (“Company”, “we”, “our”, “us”). These Terms of Service (“Terms”) govern your use of our website, purchase of digital products, and participation in our services.`
    },
    {
      title: 'Privacy & Data Usage',
      content: `We collect limited personal information such as your name, contact details, and payment information to provide and improve our services. We use secure methods to protect your data and only share it with trusted partners for payments and communication. You have the right to request access, correction, or deletion of your data by contacting us at `,
      highlight: 'support@goskilled.in'
    },
    {
      title: 'Communications',
      content: `By using our services, you consent to receive promotional, transactional, and important updates. You can unsubscribe anytime via provided links or by emailing `,
      highlight: 'support@goskilled.in'
    },
    {
      title: 'Purchases',
      content: `You must provide accurate and complete billing information. You authorize GoSkilled to share necessary data with payment processors to complete transactions. We reserve the right to cancel orders due to errors, unavailability, or suspected fraud. Offers and discounts are subject to change at any time.`
    },
    {
      title: 'Consumer Protection',
      content: `We provide previews of selected modules to help users make informed decisions. Purchasing any course is a voluntary action by the user.`
    },
    {
      title: 'Course Participation',
      content: `Users enroll at their own discretion. No user is forced or coerced into purchasing any course.`
    },
    {
      title: 'Course Materials',
      content: `Courses may include pre-recorded videos and digital content provided for personal use only. No content may be copied, shared, or redistributed.`
    },
    {
      title: 'Promotions',
      content: `All contests, giveaways, and promotions are governed by their specific terms. In case of conflict, promotion-specific rules will override these general terms.`
    },
    {
      title: 'Subscriptions',
      content: `Some services may be offered on a subscription basis and billed periodically. Subscriptions auto-renew unless cancelled before the next billing cycle. Users must maintain valid payment methods to avoid interruptions.`
    },
    {
      title: 'User Content',
      content: `Users may post reviews or comments that must comply with legal and ethical guidelines. We reserve the right to remove or modify content that violates our standards.`
    },
    {
      title: 'Prohibited Uses',
      content: `Users must not violate laws, impersonate others, distribute harmful content, spam, hack systems, or misuse platform features.`
    },
    {
      title: 'Accounts',
      content: `Users must be 18+ or have parental consent. You are responsible for maintaining confidentiality and activity on your account. Fake or offensive usernames are prohibited.`
    },
    {
      title: 'Intellectual Property',
      content: `All original content belongs to GoSkilled. Unauthorized reproduction, resale, or redistribution is strictly prohibited and may lead to legal action.`
    },
    {
      title: 'Copyright Policy',
      content: `We respond to valid DMCA takedown notices. Send requests to `,
      highlight: 'support@goskilled.in'
    },
    {
      title: 'Refund Policy',
      content: `All sales are final for digital products. For exceptions and failed transactions, please refer to our detailed Refund Policy document.`
    },
    {
      title: 'Feedback',
      content: `We welcome user feedback to improve our services. Suggestions sent to GoSkilled may be used without claim of ownership.`
    },
    {
      title: 'Third-Party Links',
      content: `Our website may contain external links. We are not responsible for their content or privacy practices.`
    },
    {
      title: 'Disclaimer of Warranty',
      content: `Services are provided 'as is' without warranties. We do not guarantee uninterrupted access or that content will be error-free.`
    },
    {
      title: 'Limitation of Liability',
      content: `We are not liable for indirect, incidental, or consequential damages. Our total liability is limited to the value of services paid by the user. GoSkilled is not responsible for any loss of data, revenue, or goodwill.`
    },
    {
      title: 'Termination',
      content: `We may suspend or terminate access for violations without notice. Relevant terms will survive such termination.`
    },
    {
      title: 'Fraud Awareness',
      content: `Only trust official emails (@goskilled.in). Never share OTPs or passwords. Do not make payments to personal accounts. Use only our official payment channels. We are not responsible for unauthorized transactions.`
    },
    {
      title: 'Governing Law',
      content: `These terms are governed under Indian law. Legal jurisdiction lies with courts in Rohtak, Haryana.`
    },
    {
      title: 'Amendments to Terms',
      content: `We may update these terms anytime. Continued use implies agreement with updated terms.`
    },
    {
      title: 'Waiver & Severability',
      content: `Failure to enforce a provision is not a waiver. If any clause is found invalid, the rest will still apply.`
    },
    {
      title: 'Acknowledgement',
      content: `By using GoSkilled, you confirm that you have read, understood, and agreed to these Terms and Conditions.`
    },
    {
      title: 'Version Control',
      content: `These Terms were last updated on `,
      highlight: '[DD/MM/YYYY]'
    },
  ];

  return (
    <>
      <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <h1 className="text-4xl font-extrabold text-center text-[#1A6E0A] mb-6 tracking-tight">
            GoSkilled – Terms and Conditions
          </h1>
          <p className="text-center text-sm text-gray-500 mb-8">
            Operated by: <strong className="text-gray-800">Edzera Inspiring Excellence LLP</strong>
          </p>

          {sections.map((sec, i) => (
            <section key={i} className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-[#1A6E0A] pl-3 mb-2">
                {sec.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {sec.content}
                {sec.highlight && (
                  <span className="text-gray-800 font-semibold ml-1">{sec.highlight}</span>
                )}
              </p>
            </section>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
