import React from 'react'

function Navbar() {
    return (
        <nav className='bg-[#040a0e] flex justify-between items-center'>
            <div className='flex items-center px-5'>
                <div className='w-18'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 200">
                        <rect x="40" y="110" width="170" height="60" rx="10" ry="10" fill="white" stroke="#1a2340" stroke-width="6" />

                        <circle cx="65" cy="140" r="4" fill="#11a683" />
                        <circle cx="85" cy="140" r="4" fill="#11a683" />
                        <circle cx="105" cy="140" r="4" fill="#11a683" />
                        <circle cx="125" cy="140" r="4" fill="#11a683" />
                        <circle cx="145" cy="140" r="4" fill="#11a683" />
                        <circle cx="165" cy="140" r="4" fill="#11a683" />
                        <circle cx="185" cy="140" r="4" fill="#11a683" />

                        <path d="M125 50 C145 50, 170 60, 170 75 C170 90, 145 100, 125 100 C105 100, 80 90, 80 75 C80 60, 105 50, 125 50 Z" fill="none" stroke="#11a683" stroke-width="5" />

                        <circle cx="125" cy="75" r="15" fill="white" stroke="#1a2340" stroke-width="5" />
                    </svg>
                </div>
                <div className='logo-box font-bold text-3xl'>Pass<span className='text-green-500'>Fort</span></div>
            </div>
            <ul className='flex gap-2 px-5'>
                <li className='w-16 h-6.5 text-center hover:font-bold cursor-pointer noneMob'>Home</li>
                <li className='w-16 h-6.5 text-center hover:font-bold cursor-pointer '>About</li>
                <li className='w-16 h-6.5 text-center hover:font-bold cursor-pointer noneMob '>Contact</li>
            </ul>
        </nav>
    )
}

export default Navbar
