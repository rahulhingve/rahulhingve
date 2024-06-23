import React from 'react'
import { Spotlight } from './ui/Spotlight'
import { TextGenerateEffect } from './ui/TextGenerateEffect'
import MagicButton from './ui/MagicButton'
import { FaLocationArrow } from 'react-icons/fa6'


const Hero = () => {
    return (
        <div className='pb-20 pt-36 '>
            <div>
                <Spotlight
                    className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
                    fill="pink"
                />
                <Spotlight
                    className="h-[80vh] w-[50vw] top-10 left-full"
                    fill="purple"
                />
                <Spotlight className="left-80 top-28 h-[90vh] w-[50vw]" fill="blue" />
            </div>
            <div className="h-screen w-full bg-black-100   bg-grid-black-100/[0.2]
       absolute top-0 left-0 flex items-center justify-center">
                {/* Radial gradient for the container to give a faded look */}
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black-100
          [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            </div>

            <div className='flex justify-center relative my-20 z-10'>
                <div className='max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center '>
                    <h2 className="uppercase tracking-widest text-xs text-center  max-w-80 text-white">
                        Made with Next.js
                    </h2>
                    <TextGenerateEffect
                        className="text-center text-[40px] md:text-5xl lg:text-6xl"
                        words="Innovating User Journeys from Concept to Reality."
                    />
                    <p className='text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl text-white '>
                        Hi, I&apos;m Rahul , A full-stack Developer based in India
                    </p>
                    <a href="#about"><MagicButton
                        title="Show My Work"
                        icon={<FaLocationArrow />}
                        position='right'
                    /></a>
                </div>
            </div>
        </div>

    )
}

export default Hero