import React, { useState } from 'react'
import Footer from '../components/Footer'
import svga from '../images/elements/map.svg'
import contactImg from '../images/elements/contact.svg'

export default function ContactUs() {

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();

        try {
            setEmail("");
            setName("");
            setMessage("");
            alert("Thanks for contacting Us");
        } catch (err) {
            alert("Something Wrong!! Failed to Send Message")
        }
    }

    return (
        <>
            <div className='w-full overflow-y-hidden'>
                <div className='px-10  w-full h-56 flex flex-col items-center py-16 relative'>
                    <img src={svga} className='absolute w-full h-52 object-cover top-0 z-0' alt='' />
                    <h4 className=' text-[#1A6E0A] font-bold'>Contact Us</h4>
                    <h2 className=' font-bold text-[35px] md:text-[45px]'>We're here to help!</h2>
                </div>

                <div className='px-10 flex md:flex-row flex-col py-10'>
                    <img src={contactImg} className=' h-[400px] lg:w-[50%] flex justify-center items-center' alt='' />
                    <div className=' flex flex-col gap-4 md:w-[50%]'>
                        <h2 className='font-bold text-4xl'>Let's talk</h2>
                        <p className=' text-black/60'>To request a quote or want to meet up for coffee, contact us directly or fill out the form and we will get back to you promptly</p>

                        <form onSubmit={handleSubmit} className='flex flex-col'>
                            <label className='font-semibold text-black/60'>Your name *
                                <br />
                                <input
                                    type="text"
                                    className=' bg-black/10 my-2 w-full text-lg px-6 cursor-pointer rounded-md py-2 focus-within:border-none'
                                    value={name}
                                    required
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </label>
                            <label className='font-semibold text-black/60'>Email address*
                                <br />
                                <input
                                    type="email"
                                    className=' bg-black/10 my-2 w-full text-lg px-6 cursor-pointer rounded-md py-2 focus-within:border-none'
                                    value={email}
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </label>
                            <label className='font-semibold text-black/60'>Message *
                                <br />
                                <textarea
                                    type="text"
                                    className=' bg-black/10 my-2 w-full h-36 text-lg px-6 cursor-pointer rounded-md py-2 focus-within:border-none'
                                    value={message}
                                    required
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                            </label>

                            <button className='text-white font-bold bg-[#1A6E0A] hover:bg-[#204718] rounded-lg py-4'>Send Message</button>

                        </form>

                    </div>


                </div>
                <Footer />
            </div>
        </>
    )
}
