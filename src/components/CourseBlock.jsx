import React from 'react'
import { FaStar } from "react-icons/fa";
import { Button } from '../@/components/ui/button'

export default function CourseBlock({ data }) {
    return (
        <div className='w-72 shadow-sm bg-white pb-3 rounded-lg border-2 border-green-600'>
            <div>
                <img src={data?.imgUrl} className='w-full h-40 object-cover rounded-t-lg shadow-md' alt='' />
            </div>
            <div className='pl-2 pt-4'>
                <h2 className='font-bold line-clamp-2'>{data.title}</h2>
                <p className='text-sm line-clamp-2'>{data.description}</p>

                {/* star block  */}
                <div className='flex gap-1 py-2 text-yellow-400'>
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                </div>

                {/* lower blocks  */}
                <div className='flex justify-between items-center pt-5 px-2'>
                    <div className='font-bold text-lg cursor-not-allowed'></div>
                    <Button className="bg-[#1A6E0A] hover:bg-[#204718] cursor-pointer">Get Started</Button>
                </div>
            </div>
        </div>
    )
}
