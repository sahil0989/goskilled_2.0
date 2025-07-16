import Footer from '../components/FooterSection'
import img4 from '../images/img4.png'

export default function About() {
    return (
        <>
            {/* About Section */}
            <section className='py-16 bg-gradient-to-b from-[#1A6E0A]/50 via-[#1A6E0A]/20 to-white'>
                <div className='max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12'>
                    {/* Text Content */}
                    <div className='md:w-1/2'>
                        <h2 className='text-4xl md:text-5xl font-bold text-[#1A6E0A] mb-6 text-center md:text-left'>About Us</h2>
                        <p className='text-lg md:text-xl font-medium text-gray-800 mb-4'>
                            GoSkilled is on its way to becoming India’s best skill education platform, where you can learn new and in-demand skills to take your career to new heights. Established in 2025 by Ashish (Founder) and Neha (Co-founder), we are committed to your growth.
                        </p>
                        <p className='text-lg md:text-xl font-medium text-gray-800 mb-4'>
                            We believe every individual has the potential to learn something new and transform it into success. GoSkilled provides a space where you not only acquire skills but also start earning from them.
                        </p>
                        <p className='text-lg md:text-xl font-medium text-gray-800 mb-6'>
                            Our goal is to help you rediscover your career path and unleash your true potential. Join GoSkilled and turn your dreams into reality.
                        </p>
                        <p className='font-bold text-[#1A6E0A] text-xl'>Ashish & Neha</p>
                        <p className='font-bold text-gray-700'>(Founder & Co-founder, GoSkilled)</p>
                    </div>

                    {/* Image */}
                    <div className='md:w-1/2 flex justify-center'>
                        <img src={img4} alt='About GoSkilled' className='rounded-xl w-full max-w-md' />
                    </div>
                </div>
            </section>

            {/* Vision & Mission Section */}
            <section className='py-20 bg-white'>
                <div className='max-w-6xl mx-auto px-6'>
                    <h2 className='text-4xl md:text-5xl font-extrabold text-center mb-16'>
                        <span className='text-[#1A6E0A]'>Vision</span> & <span className='text-[#F7AD05]'>Mission</span>
                    </h2>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                        {/* Vision Card */}
                        <div className='relative border-2 border-[#F7AD05] rounded-2xl p-8 shadow-md'>
                            <div className='absolute -top-6 left-6 md:left-1/2 -translate-x-1/2 bg-[#1A6E0A] text-white px-8 py-2 rounded-xl font-semibold text-center'>
                                Our Vision
                            </div>
                            <p className='mt-10 text-gray-800 text-lg font-medium'>
                                GoSkilled’s vision is to make India a global leader in skill education by creating a transformative platform that empowers individuals to achieve their dreams and unlock their true potential.
                            </p>
                        </div>

                        {/* Mission Card */}
                        <div className='relative border-2 border-[#1A6E0A] bg-[#1A6E0A] text-white rounded-2xl p-8 shadow-md'>
                            <div className='absolute -top-6 left-6 md:left-1/2 -translate-x-1/2 bg-[#F7AD05] text-[#1A6E0A] px-8 py-2 rounded-xl font-semibold text-center'>
                                Our Mission
                            </div>
                            <p className='mt-10 text-lg font-medium'>
                                Our mission is to build a skilled workforce of 10 million people in India by 2030. We help individuals enhance their skills and grow professionally—driving personal success and national progress.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    )
}
