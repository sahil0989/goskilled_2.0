import React, { useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import { CgMenuRightAlt } from "react-icons/cg";
import logo_full from "../images/logo_full.png"
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { User2Icon } from 'lucide-react';

const Navbar = () => {

    const [navOpen, setNavOpen] = useState(false);
    const url = useLocation();
    const { user, logout, userDashboardSidebar, setUserDashboardSidebar } = useAuth();

    const handleLogout = () => {
        sessionStorage.setItem("manualLogout", "true");
        logout();
        setNavOpen(false);
    };



    return (
        <>
            <div className={`z-50 fixed w-full px-10 flex flex-col justify-center bg-white`}>
                <div className='flex  w-full h-20 items-center justify-between'>

                    <Link to={"/"}>
                        <img src={logo_full} className='w-36 md:w-48' alt='' />
                    </Link>

                    <div className={`lg:flex gap-7 hidden`}>
                        <div className=' cursor-pointer font-semibold'>
                            <Link to="/">Home</Link>
                        </div>
                        <div className=' cursor-pointer font-semibold'>
                            <Link to="/courses">Courses</Link>
                        </div>
                        <div className=' cursor-pointer font-semibold'>
                            <Link to="/blogs">Blogs</Link>
                        </div>
                        <div className=' cursor-pointer font-semibold'>
                            <Link to="/about">About</Link>
                        </div>
                        <div className=' cursor-pointer font-semibold'>
                            <Link to="/questions">FAQ</Link>
                        </div>
                        <div className=' cursor-pointer font-semibold'>
                            <Link to="/contact">Contact Us</Link>
                        </div>
                    </div>

                    <div className='flex items-center gap-5'>
                        <div onClick={() => setUserDashboardSidebar(!userDashboardSidebar)} className={`md:hidden bg-[#1A6E0A] text-white p-2 rounded-full ${url.pathname !== '/dashboard' ? 'hidden' : ''}`}>
                            <User2Icon />
                        </div>
                        {
                            !navOpen && <CgMenuRightAlt onClick={() => setNavOpen(!navOpen)} className='lg:hidden text-black' size={26} />
                        }
                        {
                            navOpen && <RxCross2 onClick={() => setNavOpen(!navOpen)} className='lg:hidden text-black' size={26} />
                        }
                        {
                            user ? (<div>
                                <div className='flex gap-4'>
                                    <Link to={'/dashboard'}>
                                        <Button className="bg-[#1A6E0A] hover:bg-[#204718] hidden md:block">Dashboard</Button>
                                    </Link>
                                    <Button onClick={handleLogout} className="border-2 border-[#1A6E0A] bg-transparent text-[#1A6E0A] hover:bg-[#1A6E0A] hover:text-white hidden md:block">LogOut</Button>
                                </div>
                            </div>) : (
                                <div className='flex gap-3 items-center'>
                                    <Link to={"/auth/login"}>
                                        <Button className="bg-[#1A6E0A] hover:bg-[#204718] hidden md:block">Login</Button>
                                    </Link>
                                    <Link to={"/auth/register"}>
                                        <Button className="border-2 border-[#1A6E0A] bg-transparent text-[#1A6E0A] hover:bg-[#1A6E0A] hover:text-white hidden md:block">Sign Up</Button>
                                    </Link>
                                </div>
                            )
                        }
                    </div>
                </div>
                <hr className='block w-full' />
                {
                    navOpen && <div className='flex flex-col shadow-lg pb-2'>
                        <div className=' cursor-pointer font-semibold py-2 pl-6'>
                            <Link onClick={() => setNavOpen(false)} to="/">Home</Link>
                        </div>
                        <hr className='w-full' />
                        <div className=' cursor-pointer font-semibold py-2 pl-6'>
                            <Link onClick={() => setNavOpen(false)} to="/courses">Courses</Link>
                        </div>
                        <div className=' cursor-pointer font-semibold py-2 pl-6'>
                            <Link onClick={() => setNavOpen(false)} to="/blogs">Blogs</Link>
                        </div>
                        <div className=' cursor-pointer font-semibold py-2 pl-6'>
                            <Link onClick={() => setNavOpen(false)} to="/questions">FAQ</Link>
                        </div>
                        <hr className='w-full' />
                        <div className=' cursor-pointer font-semibold py-2 pl-6'>
                            <Link onClick={() => setNavOpen(false)} to="/about">About</Link>
                        </div>
                        <hr className='w-full' />
                        <div className=' cursor-pointer font-semibold py-2 pl-6'>
                            <Link onClick={() => setNavOpen(false)} to="/contact">Contact Us</Link>
                        </div>
                        <hr className='w-full' />
                        <div className='flex gap-4 mt-2'>
                            {
                                user ? (<div className='pl-6'>
                                    <div className='flex gap-4'>
                                        <Link to={'/dashboard'}>
                                            <Button onClick={() => setNavOpen(false)} className="bg-[#1A6E0A] hover:bg-[#204718] md:hidden">Dashboard</Button>
                                        </Link>
                                        <Button onClick={handleLogout} className="border-2 border-[#1A6E0A] bg-transparent text-[#1A6E0A] hover:bg-[#1A6E0A] hover:text-white">LogOut</Button>
                                    </div>
                                </div>) : (
                                    <div className='flex gap-3 items-center pl-6'>
                                        <Link to={"/auth/login"}>
                                            <Button onClick={() => setNavOpen(false)} className="bg-[#1A6E0A] hover:bg-[#204718]">Login</Button>
                                        </Link>
                                        <Link to={"/auth/register"}>
                                            <Button onClick={() => setNavOpen(false)} className="border-2 border-[#1A6E0A] bg-transparent text-[#1A6E0A] hover:bg-[#1A6E0A] hover:text-white">Sign Up</Button>
                                        </Link>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                }
            </div >
        </>
    );
};

export default Navbar;
