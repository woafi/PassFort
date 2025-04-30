import React from 'react'
import { SignedIn, SignedOut, SignUpButton, SignInButton, UserButton } from '@clerk/clerk-react'
function Navbar() {
    return (
        <nav className='bg-[#040a0e] flex justify-between items-center py-2'>
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
            <ul className='flex gap-2 px-5 justify-center items-center'>
                <SignedOut>
                    <SignInButton>
                        <button class="relative inline-flex items-center justify-center p-0.5  me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                            <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                Login
                            </span>
                        </button>
                    </SignInButton>
                    <SignUpButton>
                        <button className="relative inline-flex items-center justify-center p-0.5  me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                            <img className='w-5 invert' src="/add-user.png" alt="" />
                            </span>
                        </button>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                <UserButton appearance={{
                        elements: {
                            userButtonAvatarBox: {
                                width: '2.5rem',
                                height: '2.5rem'
                            }
                        }
                    }} />
                </SignedIn>
            </ul>
        </nav>
    )
}

export default Navbar
