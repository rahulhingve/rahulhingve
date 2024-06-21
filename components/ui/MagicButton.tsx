import React from 'react'

const MagicButton = ({
    title, icon, position, handleClick, otherClasses
}: {
    title: string; icon: React.ReactNode, position: string; handleClick?: () => void; otherClasses?: string;
}) => {
    return (

        <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50" onClick={handleClick}>
    
            <span className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg  px-7 py-1 text-sm font-medium text-white  gap-2 ${otherClasses}`}>
                {position === 'left' && icon}

                {title}
                {position === 'right' && icon}
            </span>
        </button>




    )
}

export default MagicButton


        // Button code
        
  
        // tailwind.config.js code
        // {
        //   "animation": {
        //     shimmer: "shimmer 2s linear infinite"
        //   },
        //   "keyframes": {
        //     shimmer: {
        //       from: {
        //         "backgroundPosition": "0 0"
        //       },
        //       to: {
        //         "backgroundPosition": "-200% 0"
        //       }
        //     }
        //   }
        // }
      