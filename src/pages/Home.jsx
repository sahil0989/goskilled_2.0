import React from 'react'
import img1 from "../images/img1.png"
import img2 from "../images/img2.png"
import img3 from "../images/img3.png"
import element1 from "../images/elements/1.png"
import element7 from "../images/elements/7.png"
import element2 from "../images/elements/2.png"
import { Button } from '../@/components/ui/button'
import CourseBlock from '../components/CourseBlock';
import element3 from "../images/elements/3.png"
import Footer from '../components/Footer'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import course1 from "../images/courses/1.png"
import course2 from "../images/courses/2.png"
import { useAuth } from '../context/AuthContext'

export default function Home() {

    const { user } = useAuth();
    const navigate = useNavigate()

    const courses = [
        {
            imgUrl: course1,
            title: "Digital Marketing Mastery – Master Online Growth & Sales",
            description: "Become a certified digital marketing expert & launch your career or business online.",
        }, {
            imgUrl: course2,
            title: "Content Creation Mastery: Master Strategies to Grow Your Brand",
            description: "Course designed to help you craft compelling content, build a strong online presence, and strategically grow your brand across digital platforms. Perfect for creators, entrepreneurs, and marketers ready to level up their influence."
        }
    ]

    const handlebutton = () => {
        if (user) {
            toast.success("Already Login!!")
        } else {
            navigate('/auth/register')
        }
    }

    return (
        <div>

            {/* hero section  */}
            <div className='flex flex-col md:flex-row gap-5 w-full items-center'>
                <div className='w-full px-10 relative'>
                    {/* heading  */}
                    <div className='pb-5 w-full'>
                        <div className='relative'>
                            <h1 className='text-3xl md:text-7xl font-bold flex'>
                                <span className='text-[#1A6E0A] flex flex-col relative pr-5'>
                                    Improve
                                    <img src={element1} className='absolute top-5' alt='' />
                                </span>
                                you'r Skill</h1>
                            <img src={element2} className='absolute w-14 -top-10 right-10 z-10' alt='' />
                        </div>
                        <br />
                        <h1 className='text-3xl md:text-7xl font-bold'>with Different Way</h1>
                    </div>
                    <p className='text-sm md:text-base'>GoSkilled is your gateway to mastering in-demand skills and unlocking new career opportunities. With expert-led courses, you can learn, grow, and even earn through our unique rewards system.Take the first step today and improve your skills in a smarter way!</p>

                    <Button onClick={() => handlebutton()} className="bg-[#1A6E0A] hover:bg-[#204718] cursor-pointer my-4" >Get Started</Button>
                </div>
                <div className='w-full flex justify-center'>
                    <img src={img1} className='w-3/5' alt='' />
                </div>
            </div>

            {/* Number section  */}
            <div className='m-12 shadow-sm rounded-lg'>
                <div className='bg-[#fcfcfc] w-full py-5 flex justify-around'>
                    <div className='flex flex-col items-center'>
                        <h1 className='text-4xl font-bold text-[#F7AD05]'>51+</h1>
                        <p>Students</p>
                    </div>
                    <div className='flex flex-col items-center'>
                        <h1 className='text-4xl font-bold text-[#F7AD05]'>5+</h1>
                        <p>Courses</p>
                    </div>
                    <div className='flex flex-col items-center'>
                        <h1 className='text-4xl font-bold text-[#F7AD05]'>15+</h1>
                        <p>mentors</p>
                    </div>
                </div>
            </div>

            {/* courses section  */}
            <div className='bg-[#1A6E0A]/50 w-full py-8 px-12'>
                <div className='flex flex-col md:flex-row items-center justify-around gap-10'>
                    <div className='relative text-3xl md:text-5xl font-bold max-w-[300px]'>Most Popular Courses
                        <div className='absolute -top-10 right-0'>
                            <img src={element3} className='w-28 md:w-32' alt='' />
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row gap-10 md:gap-24'>
                        {
                            courses.map((data, index) => {
                                return <CourseBlock key={index} data={data} />
                            })
                        }
                    </div>
                </div>
            </div>

            {/* why should you join us  */}
            <div className='flex flex-col md:flex-row items-center gap-5 py-16'>
                <div className='flex justify-center'>
                    <img src={img2} className='w-3/5' alt='' />
                </div>
                <div className='font-semibold px-4'>
                    <h1 className='text-3xl md:text-4xl font-bold relative pb-8'>Why Choose this course ?
                        <img src={element1} className='absolute right-16 top-4 md:right-32 md:top-5 w-[150px]' alt='' />
                    </h1>
                    <p className='text-lg pb-8'>At GoSkilled, you will get :</p>
                    <div className='flex flex-col gap-3'>
                        <div className='flex items-center gap-4'>
                            <div>
                                <div className='w-3 h-3 rounded-full bg-[#F7AD05]'></div>
                            </div>
                            <p>Learn from experienced digital marketers.</p>
                        </div>
                        <div className='flex items-center gap-4'>
                            <div>
                                <div className='w-3 h-3 rounded-full bg-[#F7AD05]'></div>
                            </div>
                            <p>Work on real-life projects & case studies.</p>
                        </div>
                        <div className='flex items-center gap-4'>
                            <div>
                                <div className='w-3 h-3 rounded-full bg-[#F7AD05]'></div>
                            </div>
                            <p>Monetize your skills – Freelancing, Affiliate Marketing, & Business Growth.</p>
                        </div>
                        <div className='flex items-center gap-4'>
                            <div>
                                <div className='w-3 h-3 rounded-full bg-[#F7AD05]'></div>
                            </div>
                            <p>Access lifetime updates & AI-powered tools.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* testimonial section  */}
            <div>
                <div className='flex flex-col md:flex-row gap-5 items-center justify-around bg-[#1A6E0A]/50 py-8'>
                    <div className='w-full px-6 md:max-w-[550px]'>
                        <h2 className='text-3xl md:text-4xl font-bold'><span className='relative'>Testimonials
                            <img src={element7} alt='' className='absolute top-6 skew-y-6' />
                        </span> What's Our</h2>
                        <br />
                        <h2 className='text-3xl md:text-4xl font-bold'>Students Say</h2>

                        {/* testimonial data  */}
                        <br /><br />
                        <div>
                            <p className=' italic'>"I joined GoSkilled to learn digital marketing, but I never expected I could also start earning while learning! Within my first month, I was able to generate ₹27,500 just by applying the skills I gained."</p>
                            <p className='flex w-full justify-end pt-5 font-bold'> – Rohan, Delhi</p>
                        </div>

                    </div>
                    <div className='flex justify-center'>
                        <img src={img3} className='w-3/5' alt='' />
                    </div>
                </div>
            </div>

            {/* subscribe section  */}
            <div className='m-8 md:my-10 md:mx-24'>
                <div className='flex flex-col items-center gap-8 bg-[#F7AD05] rounded-lg w-full py-8'>
                    <h2 className='text-xl md:text-2xl font-bold'>Register Yourself for Pre-Launching!</h2>
                    <div className='flex flex-col md:flex-row items-center md:justify-center max-w-3/5 gap-6'>
                        <input type='email' className='rounded-full px-6 py-2 md:text-lg w-full md:w-[350px]' placeholder='Enter your email' />
                        <Link to={"/auth/register"}>
                            <Button className="rounded-full bg-[#1A6E0A] hover:bg-[#204718] cursor-pointer">Register Now !!</Button>
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />

        </div>
    )
}
