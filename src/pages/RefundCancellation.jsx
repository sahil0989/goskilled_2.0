import React from 'react';
import Footer from '../components/FooterSection';

export default function RefundCancellation() {
  return (
    <>
      <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <h1 className="text-4xl font-extrabold text-center text-[#1A6E0A] mb-6 tracking-tight">
            Refund & Cancellation Policy
          </h1>

          {/* Section Component */}
          {[
            {
              title: '1. General Information',
              list: [
                'Refunds for any eligible transactions may take 7–10 working days to reflect in your account.',
                'The timeline depends on bank processing and payment gateway coordination (Razorpay).',
                'We appreciate your patience and will provide full support in case of delays.',
              ]
            },
            {
              title: '2. Refund Eligibility',
              list: [
                'You may request a refund within <strong class="text-gray-800">24 hours</strong> of your purchase if you have not accessed the course.',
                'No refund will be entertained under any circumstances after the <strong class="text-gray-800">24-hour window</strong>.',
                'All refunds are subject to deduction of:',
                [
                  '<strong class="text-gray-800">2% Payment Gateway Fee</strong>',
                  '<strong class="text-gray-800">5% Processing Fee</strong>'
                ]
              ]
            },
            {
              title: '3. Ineligible Refunds',
              list: [
                'No refunds will be provided after <strong class="text-gray-800">24 hours</strong> from the time of purchase.',
                'No refunds will be provided if <strong class="text-gray-800">course access</strong> has been granted or <strong class="text-[#1A6E0A]">affiliate dashboard</strong> activated.',
                'Live sessions, webinars, and <strong class="text-gray-800">add-on services</strong> are non-refundable.'
              ]
            },
            {
              title: '4. Process to Request Refund',
              list: [
                'Send an email to <strong class="text-gray-800">support@goskilled.in</strong> with the subject: <em>"Refund Request – [Order ID]"</em>.',
                'Include the following:',
                [
                  'Reason for refund',
                  'Registered email/phone number',
                  'Screenshot of payment invoice or transaction confirmation'
                ],
                'Refund approval is at the <strong class="text-gray-800">sole discretion of GoSkilled</strong> based on the information provided.'
              ]
            },
            {
              title: '5. International Users',
              list: [
                'Refunds to international users are also subject to deductions:',
                [
                  '<strong class="text-gray-800">4.5% Payment Gateway Fee</strong>',
                  '<strong class="text-gray-800">5% Processing Fee</strong>'
                ],
                'Final refund amount will be adjusted accordingly.'
              ]
            },
            {
              title: '6. Refund Cancellation Policy',
              list: [
                'If you cancel your refund request after initiating, it will be treated as <strong class="text-gray-800">permanently closed</strong>.',
                'You <strong class="text-gray-800">cannot reapply</strong> for a refund for the same order after cancellation.'
              ]
            },
            {
              title: '7. Contact for Refund Support',
              list: [
                'Email: <strong class="text-gray-800">support@goskilled.in</strong>',
                'Resolution Time: <strong class="text-gray-800">Within 3–5 working days</strong>',
                'Please ensure <strong class="text-gray-800">accurate details</strong> to avoid processing delays.'
              ]
            }
          ].map((section, idx) => (
            <section key={idx} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-[#1A6E0A] pl-3 mb-2">
                {section.title}
              </h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {section.list.map((item, i) => {
                  if (Array.isArray(item)) {
                    return (
                      <ul key={i} className="ml-6 list-disc space-y-1">
                        {item.map((subItem, j) => (
                          <li key={j} dangerouslySetInnerHTML={{ __html: subItem }} />
                        ))}
                      </ul>
                    );
                  }
                  return <li key={i} dangerouslySetInnerHTML={{ __html: item }} />;
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
