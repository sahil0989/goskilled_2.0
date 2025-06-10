import React from 'react'
import img4 from '../images/img4.png'
import Footer from '../components/Footer'

export default function About() {
    return (
        <>
            <div>
                <div className='flex flex-col md:flex-row py-10 bg-[#1A6E0A]/50'>
                    <div className='flex flex-col w-full px-8 md:px-24'>
                        <h2 className='text-3xl md:text-5xl font-bold text-[#1A6E0A] mx-auto pb-6'>About Us</h2>
                        <p className=' font-semibold md:text-xl'> GoSkilled is on its way to becoming India’s best skill education platform, where you can learn new and in demand skills to take your career to new heights. This platform was established in 2025, and its founders are Ashish (Founder) and Neha (Co-founder).</p>
                        <br />
                        <p className='font-semibold md:text-xl'> We believe that every individual has the ability to learn something new and turn it into success. That’s why GoSkilled has created a platform where you can not only learn essential skills but also start earning immediately by using those skills</p>
                        <br />
                        <p className='font-semibold md:text-xl'> Our goal is to help you give your career a new direction and recognize your true potential. Join GoSkilled and turn your dreams into reality.</p>
                        <br />
                        <p className='font-bold md:text-xl'>Ashish, Neha</p>
                        <p className='font-bold'>(Founder, Co-founder GoSkilled)</p>
                    </div>
                    <div className='mx-8 flex justify-center'>
                        <img src={img4} className='md:w-3/5' alt='img' />
                    </div>
                </div>


                <div className='w-full py-16'>
                    <div className='flex  justify-center mb-8'>
                        <h2 className='text-5xl font-bold'><span className='text-[#1A6E0A]'>Vision</span> & <span className='text-[#F7AD05]'>Mission</span></h2>
                    </div>

                    <div className='flex flex-col md:flex-row gap-16 p-8'>
                        {/* vision */}
                        <div className='relative border-2 w-full rounded-lg border-[#F7AD05]'>
                            <div className='absolute -top-6 left-16 md:left-1/2'>
                                <div className='rounded-lg bg-[#1A6E0A] px-12 py-2 font-semibold text-white'>Our Vision</div>
                            </div>
                            <div className='p-8 md:px-16'> GoSkilled’s vision is to make India a global leader in
                                skill education by creating a transformative platform
                                that empowers individuals to achieve their dreams
                                and unlock their true potential.</div>
                        </div>

                        {/* mission  */}
                        <div className='border-2 w-full rounded-lg border-[#1A6E0A] bg-[#1A6E0A] relative'>
                            <div className='absolute -top-6 left-16 md:left-1/2'>
                                <div className='rounded-lg bg-[#F7AD05] px-12 py-2 font-semibold text-lg'>Our Mission</div>
                            </div>
                            <div className='p-8 text-white md:px-16'>Our mission is to build a skilled workforce of 10 million
                                people in India by 2030, helping individuals enhance their
                                skills and achieve career growth. We aim to create a
                                strong, empowered workforce that drives both personal
                                success and national progress.
                            </div>
                        </div>
                    </div>
                </div>

            </div>


            <Footer />

        </>
    )
}
