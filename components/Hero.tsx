import React from 'react'
import { Spotlight } from './ui/Spotlight'
import { TextGenerateEffect } from './ui/TextGenerateEffect'


const Hero = () => {
    return (
        <div className='pb-20 pt-36'>
            <div>
                <Spotlight className='-top-40 -left-10 md:-left-32 md:-top-20 h-screen' fill='white' />
                <Spotlight className='top-10 left-full h-[80vh] w-[50vw]' fill='red' />
                <Spotlight className='top-28 left-80 h-[80wh] w-[50vw]' fill='yellow' />
            </div>
            <div className="h-screen w-full dark:bg-black-100 bg-white  dark:bg-grid-white/[0.05] bg-grid-black/[0.2]  flex items-center justify-center absolute top-0">
                {/* Radial gradient for the container to give a faded look */}
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            </div>

            <div className='flex justify-center relative my-20 z-10'>
                <div className='max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center'>
                    <p className="uppercase tracking-widest text-xs text-center text-blue-100 max-w-80">
                        Dynamic Web Magic with Next.js
                    </p>
                    <TextGenerateEffect 
                    className=""
                    words="hi my name is rahul "
                    />
                </div>
            </div>
        </div>

    )
}

export default Hero