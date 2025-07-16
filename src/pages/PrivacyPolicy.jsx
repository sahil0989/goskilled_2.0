import React from 'react';
import Footer from '../components/FooterSection';

export default function PrivacyPolicy() {
    return (
        <>
            <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                    <h1 className="text-4xl font-extrabold text-center text-[#1A6E0A] mb-4 tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="text-center text-sm text-gray-500 mb-8">
                        Effective Date: <span className="italic">[Insert Date]</span><br />
                        Operated by: <span className="text-gray-800 px-1.5 py-0.5 rounded">Edzera Inspiring Excellence LLP</span>
                    </p>

                    {/* Section Component */}
                    {[
                        {
                            title: '1. Introduction',
                            content: `At GoSkilled, your privacy is important to us. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website or use our services.`
                        },
                        {
                            title: '2. Information We Collect',
                            list: [
                                '<strong class="text-gray-800 px-1.5 py-0.5 rounded">Personal Information</strong>: Name, email, phone number, address, and payment details.',
                                '<strong class="text-gray-800 px-1.5 py-0.5 rounded">Technical Data</strong>: IP address, browser type, pages visited, time spent on pages, etc.',
                                '<strong class="text-gray-800 px-1.5 py-0.5 rounded">Usage Data</strong>: Course interactions, time spent on lessons, feedback, etc.'
                            ]
                        },
                        {
                            title: '3. How We Use Your Information',
                            list: [
                                'To provide and maintain our <strong class="text-gray-800 px-1.5 py-0.5 rounded">services</strong>.',
                                'To process <strong class="text-gray-800 px-1.5 py-0.5 rounded">transactions</strong> and send receipts.',
                                'To communicate <strong class="text-gray-800 px-1.5 py-0.5 rounded">updates</strong>, offers, or customer support.',
                                'To improve <strong class="text-gray-800 px-1.5 py-0.5 rounded">course content</strong> and user experience.'
                            ]
                        },
                        {
                            title: '4. Sharing Your Information',
                            content: `We do not <strong class="text-gray-800 px-1.5 py-0.5 rounded">sell</strong> your personal information. We may share your data only with <strong class="text-gray-800 px-1.5 py-0.5 rounded">trusted third-party services</strong> (e.g., payment gateways, analytics tools) to operate our platform efficiently.`
                        },
                        {
                            title: '5. Data Security',
                            content: `We use <strong class="text-gray-800 px-1.5 py-0.5 rounded">industry-standard encryption</strong> and security protocols to protect your information. However, no method of transmission over the Internet is 100% secure.`
                        },
                        {
                            title: '6. Your Rights',
                            list: [
                                '<strong class="text-gray-800 px-1.5 py-0.5 rounded">Access</strong>, update, or delete your personal information.',
                                'Request a <strong class="text-gray-800 px-1.5 py-0.5 rounded">copy</strong> of your data.',
                                '<strong class="text-gray-800 px-1.5 py-0.5 rounded">Withdraw consent</strong> at any time (may affect service access).'
                            ]
                        },
                        {
                            title: '7. Third-Party Links',
                            content: `Our site may contain links to <strong class="text-gray-800 px-1.5 py-0.5 rounded">external websites</strong>. We are not responsible for the privacy practices of such websites.`
                        },
                        {
                            title: '8. Changes to This Policy',
                            content: `We may update this policy from time to time. Any <strong class="text-gray-800 px-1.5 py-0.5 rounded">changes</strong> will be posted on this page with an updated date.`
                        },
                    ].map((section, idx) => (
                        <section key={idx} className="mb-8 animate-fadeInUp">
                            <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-[#1A6E0A] pl-3 mb-2">
                                {section.title}
                            </h2>
                            {section.content && (
                                <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: section.content }} />
                            )}
                            {section.list && (
                                <ul className="list-disc list-inside space-y-1 text-gray-700 mt-2">
                                    {section.list.map((item, i) => (
                                        <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                                    ))}
                                </ul>
                            )}
                        </section>
                    ))}

                    {/* Section 9: Contact Us */}
                    <section className="mb-4 animate-fadeInUp">
                        <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-[#1A6E0A] pl-3 mb-2">
                            9. Contact Us
                        </h2>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                            <li>
                                Email: <strong className="text-gray-800 px-1.5 py-0.5 rounded">support@goskilled.in</strong>
                            </li>
                            <li>
                                Phone: <strong className="text-gray-800 px-1.5 py-0.5 rounded">+91 8572-887-888</strong> (WhatsApp support available)
                            </li>
                        </ul>
                    </section>
                </div>
            </div>

            <Footer />
        </>
    );
}
