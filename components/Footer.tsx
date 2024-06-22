import React from 'react'
import MagicButton from './ui/MagicButton'
import { FaLocationArrow } from 'react-icons/fa6'
import { socialMedia } from '@/data'

const Footer = () => {
  return (
    <footer id='contact' className='w-full  mb-[100px] md:mb-5 text-white'>
        
        <div className='flex flex-col items-center pb-10'>
            <h1 className='heading lg:max-w-[45vw]'>
                Ready to take <span className='text-purple'>your</span> digital presence to next level?
            </h1>
            <p className='text-white-200 md:mt-10 my-5 text-center'>Reach out to me today and let&apos;s discuss how I can help you achieve your goals.</p>
<a href="mailto:rahulpawar2001.rp@gmail.com">
    <MagicButton
    title="Let's get in touch "
    icon={<FaLocationArrow/>}
    position='right'
    />
</a>
        </div>
         <div className='flex justify-center items-center md:gap-3 gap-6'>
            {socialMedia.map((profile)=>(
                <div key={profile.id} className='w-10 h-10 cursor-pointer flex justify-center items-center backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300'>
                   <a href={profile.link}>
                   <img src={profile.img} alt={profile.id} />
                    </a> 

                </div>
            ))}
        </div>
        <div className='flex mt-3 md:flex-row flex-col justify-center items-center'>
           <p className='md:text-base text-sm md:font-normal font-light'> Copyright ©2024 Rahul</p>
        </div>
       
    </footer>
  )
}

export default Footer