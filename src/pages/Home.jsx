import React, { useEffect, useState } from 'react'
import img1 from "../images/img1.png"
import img2 from "../images/img2.png"
import img3 from "../images/img3.png"
import img5 from "../images/img5.png"
import element1 from "../images/elements/1.png"
import element7 from "../images/elements/7.png"
import element2 from "../images/elements/2.png"
import { Button } from '../@/components/ui/button'
import CourseBlock from '../components/CourseBlock';
import element3 from "../images/elements/3.png"
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import course1 from "../images/courses/1.png"
import course2 from "../images/courses/2.png"
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion';
import { GiftIcon } from 'lucide-react'
import Footer from '../components/FooterSection'

export default function Home() {

    const { user } = useAuth();
    const navigate = useNavigate()

    const [currentTestimonial, setCurrentTestimonial] = useState(0);

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

    const testimonials = [
        {
            text: `A platform like GoSkilled was genuinely missing — it focuses on building skills with actual direction.`,
            name: '– Aayush, Graduate',
        },
        {
            text: `GoSkilled brings a very fresh approach. It doesn’t just teach — it opens real opportunities for growth.`,
            name: '– Sneha, Digital Learner',
        },
        {
            text: `Today, we don’t just need certificates. We need clarity, support, and action. GoSkilled checks those boxes.`,
            name: '– Tushar, MBA Aspirant',
        },
        {
            text: `The moment I saw the structure, I felt — finally, something that isn’t just about watching videos.`,
            name: '– Ishita, Self-Learner',
        },
        {
            text: `GoSkilled feels like it was built for learners like us — simple, clear, and genuinely helpful.`,
            name: '– Meenal, Intern',
        },
        {
            text: `In a market full of theory-heavy platforms, GoSkilled stands out with its practical mindset.`,
            name: '– Rajat, First-time Creator',
        },
    ];


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, []);

    const handlebutton = () => {
        if (user) {
            toast.success("Already Login!!")
        } else {
            navigate('/auth/register')
        }
    }

    console.log("React Backend: ", process.env.REACT_APP_BACKEND)

    return (
        <div>

            {/* hero section  */}
            <div className='bg-gradient-to-t from-[#1A6E0A]/50 via-[#1A6E0A]/20 to-white'>
                <div className='flex flex-col md:flex-row gap-5 w-full items-center'>
                    <div className='w-full px-10 relative'>
                        {/* heading  */}
                        <div className='pb-5 w-full mt-12 md:mt-2'>
                            <div className='relative'>
                                <h1 className='text-2xl md:text-6xl font-bold flex'>
                                    <span className='text-[#1A6E0A] flex flex-col relative pr-5'>
                                        Improve
                                        <img src={element1} className='absolute top-5' alt='' />
                                    </span>
                                    you'r Skill</h1>
                                <img src={element2} className='absolute w-14 -top-10 right-10 scale-75 md:scale-100 z-10' alt='' />
                            </div>
                            <br />
                            <h1 className='text-2xl md:text-6xl font-bold'>with Different Way</h1>
                        </div>
                        <p className='text-sm md:text-base'>GoSkilled is your gateway to mastering in-demand skills and unlocking new career opportunities. With expert-led courses, you can learn, grow, and even earn through our unique rewards system.Take the first step today and improve your skills in a smarter way!</p>

                        <Button onClick={() => handlebutton()} className="bg-[#1A6E0A] hover:bg-[#204718] cursor-pointer my-4" >Get Started</Button>
                    </div>
                    <div className='w-full flex justify-center'>
                        <img src={img1} className='w-3/5' alt='' />
                    </div>
                </div>


                {/* Number section  */}
                <div className='p-12 rounded-lg'>
                    <div className='bg-[#fcfcfc] w-full py-5 flex justify-around rounded-lg shadow-md border border-green-600'>
                        <div className='flex flex-col items-center'>
                            <h1 className='text-4xl font-bold text-[#F7AD05]'>100+</h1>
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
            </div>


            {/* courses section  */}
            <div className='bg-[#1A6E0A]/50 w-full py-16 px-12'>
                <div className='flex flex-col md:flex-row items-center justify-around gap-10'>
                    <div className='relative text-2xl md:text-5xl font-bold max-w-[300px]'>Most Popular Courses
                        <div className='absolute -top-10 right-0'>
                            <img src={element3} className='w-20 md:w-32' alt='' />
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
            <div className='flex flex-col md:flex-row items-center gap-5 py-16 bg-gradient-to-b from-[#1A6E0A]/50 to-white'>
                <div className='flex justify-center'>
                    <img src={img2} className='w-3/5' alt='' />
                </div>
                <div className='font-semibold px-4'>
                    <h1 className='text-2xl md:text-4xl font-bold relative pb-8'>Why Choose this course ?
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


            {/* Earning Section  */}

            <div className="w-full px-4 py-8 md:py-12 bg-gradient-to-t from-[#1A6E0A]/50 via-[#1A6E0A]/20 to-white">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between bg-white shadow-lg rounded-2xl p-6 md:p-10 border border-green-200">
                    {/* Left Section */}
                    <div className="flex flex-col items-start gap-4 text-center md:text-left">
                        <div className="flex items-center text-green-700 text-lg font-semibold">
                            <GiftIcon className="mr-2" />
                            Exclusive Rewards
                        </div>
                        <h2 className="text-xl md:text-4xl font-bold text-gray-800 leading-snug">
                            Earn Rewards up to <span className="text-green-600">₹27,000+</span> Every Month 💸
                        </h2>
                        <p className="text-sm md:text-base text-gray-600 max-w-md">
                            Refer friends, complete tasks, and grow your earnings with ease. Start earning today and unlock special bonuses!
                        </p>
                        <div className='flex w-full justify-center'>
                            <Button className="bg-green-700 hover:bg-green-800 text-white mt-2">
                                Start Earning
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6 md:mt-0 md:ml-8 hidden md:block">
                        <img
                            src={img5}
                            alt="Earning Rewards"
                            className="w-64 h-auto"
                        />
                    </div>
                </div>
            </div>

            {/* testimonial section  */}
            <div>
                <div className='flex flex-col md:flex-row gap-5 items-center justify-around bg-[#1A6E0A]/50 py-8'>
                    <div className='w-full px-6 md:max-w-[550px]'>
                        <h2 className='text-2xl md:text-4xl font-bold'><span className='relative'>Feedbacks
                            <img src={element7} alt='' className='absolute top-7 skew-y-6' />
                        </span></h2>

                        {/* testimonial data  */}
                        <br /><br />
                        <div className="h-36">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={testimonials[currentTestimonial].name}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <p className="italic line-clamp-4">
                                        "{testimonials[currentTestimonial].text}"
                                    </p>
                                    <p className="flex w-full justify-end pt-5 font-bold">
                                        {testimonials[currentTestimonial].name}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Slider Dots */}
                        <div className="flex justify-center gap-2 mt-4">
                            {testimonials.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonial
                                        ? 'bg-[#1A6E0A] scale-110'
                                        : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>

                    </div>
                    <div className='flex justify-center'>
                        <img src={img3} className='w-3/5' alt='' />
                    </div>
                </div>
            </div>

            {/* subscribe section  */}
            <div className='p-4 md:py-10 md:px-24 bg-gradient-to-b from-[#1A6E0A]/50 via-[#1A6E0A]/20 to-white'>
                <div className='flex justify-center'>
                    <div className='flex flex-col items-center gap-8 bg-[#F7AD05] md:w-3/5 rounded-lg w-full py-8'>
                        <h2 className=' md:text-2xl font-bold'>Register Yourself for Pre-Launching!</h2>
                        <div className='flex flex-col w-full px-6 md:flex-row items-center md:justify-center gap-6'>
                            <input type='email' className='rounded-full px-6 py-2 md:text-lg w-full md:w-[350px]' placeholder='Enter your email' />
                            <Link to={"/auth/register"}>
                                <Button className="rounded-full bg-[#1A6E0A] hover:bg-[#204718] cursor-pointer">Register Now !!</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

        </div>
    )
}
