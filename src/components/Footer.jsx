import React from 'react'
import { FaYoutube } from "react-icons/fa";
import logo_full from "../images/logo_full.png"
import { IoLogoWhatsapp } from "react-icons/io";
import { AiFillInstagram } from "react-icons/ai";
import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <div className='bg-[#1A6E0A]'>
            <div className='flex px-10 w-full py-8 text-white'>
                <div className='flex flex-col gap-8 md:flex-row w-full justify-between'>
                    <div className='flex flex-col gap-4 md:px-4 rounded-lg p-2'>
                        <Link to={"/"}>
                            <img src={logo_full} className='w-48 bg-white p-3 rounded-lg cursor-pointer' alt='' />
                        </Link>
                        <p className='text-sm font-medium max-w-[400px]'>GoSkilled is on its way to becoming India’s best skill
                            education platform, where you can learn new and in
                            demand skills to take your career to new heights.</p>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <h2 className='text-xl font-bold'>Useful Links</h2>
                        <p className=' cursor-pointer'>Blogs</p>
                        <p className=' cursor-pointer'>About Us</p>
                        <p className=' cursor-pointer'>Privacy & Policy</p>
                        <p className=' cursor-pointer'>Terms & Conditions</p>
                    </div>
                </div>


            </div>
            <hr className='text-white bg-white w-full' />
            <div className='w-full flex flex-col gap-4 md:flex-row justify-center md:justify-between items-center py-4'>
                <div className='md:w-full'></div>
                <div className='text-white/50 cursor-not-allowed md:w-full'>All Rights Reserved © 2025 || GOSKILLED</div>
                <div className='flex gap-6 px-8 text-white'>
                    <Link to={'https://instagram.com/goskilled.in'}>
                        <AiFillInstagram className=' cursor-pointer' size={28} />
                    </Link>
                    <Link to={'https://www.facebook.com/profile.php?id=61565884031858'}>
                        <FaFacebookSquare className=' cursor-pointer' size={28} />
                    </Link>
                    <Link to={'https://x.com/Goskilled_in'}>
                        <FaSquareXTwitter className=' cursor-pointer' size={28} />
                    </Link>
                    <Link to={'https://www.youtube.com/@Goskilled'}>
                        <FaYoutube className=' cursor-pointer' size={28} />
                    </Link>
                    <Link to={"https://wa.link/eesg7m"}>
                        <IoLogoWhatsapp className='cursor-pointer' size={28} />
                    </Link>
                </div>
            </div>
        </div>
    )
}