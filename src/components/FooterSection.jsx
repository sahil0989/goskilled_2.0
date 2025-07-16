import { Link } from 'react-router-dom';
import logo_full from "../images/logo_full.png"
import { IoLogoWhatsapp } from "react-icons/io";
import { AiFillInstagram } from "react-icons/ai";
import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";

export default function Footer() {
    return (
        <div className="px-4 pt-6 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 border-t">
            <div className="grid gap-10 row-gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                <div className="sm:col-span-2">
                    <Link to={"/"}>
                        <img src={logo_full} className='w-48 bg-white p-3 rounded-lg cursor-pointer' alt='' />
                    </Link>
                    <div className="mt-2 lg:max-w-sm">
                        <p className="text-sm text-gray-800">
                            GoSkilled is on its way to becoming India’s best skill education platform, where you can learn new and in demand skills to take your career to new heights.
                        </p>
                    </div>
                </div>

                <div className="space-y-2 text-sm">
                    <p className="text-base font-bold tracking-wide text-gray-900">Contacts</p>
                    <div className="flex">
                        <p className="mr-1 text-gray-800 font-semibold">WhatsApp Us:</p>
                        <a href="tel:850-123-5021" aria-label="Our phone" title="Our phone" className="transition-colors duration-300 text-deep-purple-accent-400 hover:text-deep-purple-800">+91 8572887888</a>
                    </div>
                    <div className="flex">
                        <p className="mr-1 text-gray-800 font-semibold">Email:</p>
                        <a href="mailto:info@lorem.mail" aria-label="Our email" title="Our email" className="transition-colors duration-300 text-deep-purple-accent-400 hover:text-deep-purple-800">Goskilled.in@gmail.com</a>
                    </div>
                    <div className="flex">
                        <p className="mt-2 text-sm text-gray-500">
                            <p className="text-xs text-gray-500">
                                We’d love to hear from you! Whether you have questions, need support, or want to explore opportunities with GoSkilled, feel free to reach out
                            </p>
                        </p>
                    </div>
                </div>

                <div>
                    <span className="text-base font-bold tracking-wide text-gray-900">Social</span>
                    <div className="flex items-center mt-1 space-x-3 text-gray-500">
                        {/* Twitter */}
                        <Link to={'https://instagram.com/goskilled.in'}>
                            <AiFillInstagram className=' cursor-pointer' size={24} />
                        </Link>
                        <Link to={'https://www.facebook.com/profile.php?id=61565884031858'}>
                            <FaFacebookSquare className=' cursor-pointer' size={24} />
                        </Link>
                        <Link to={'https://x.com/Goskilled_in'}>
                            <FaSquareXTwitter className=' cursor-pointer' size={24} />
                        </Link>
                        <Link to={'https://www.youtube.com/@Goskilled'}>
                            <FaYoutube className=' cursor-pointer' size={24} />
                        </Link>
                        <Link to={"https://wa.link/eesg7m"}>
                            <IoLogoWhatsapp className='cursor-pointer' size={24} />
                        </Link>
                    </div>
                    <p className="mt-4 text-sm text-gray-500 font-semibold">
                        Follow Us for Updates
                    </p>
                </div>
            </div>

            <div className="flex flex-col-reverse justify-between pt-5 pb-10 border-t lg:flex-row">
                <p className="text-sm text-gray-600">
                    All rights reserved © Copyright 2025 || GOSKILLED
                </p>
                <ul className="flex flex-col mb-3 space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row">
                    <li>
                        <Link to="/RefundCancellation" className="text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">Refund Policy</Link>
                    </li>
                    <li>
                        <Link to="/PrivacyPolicy" className="text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">Privacy Policy</Link>
                    </li>
                    <li>
                        <Link to="/TermsAndConditions" className="text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">Terms &amp; Conditions</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
