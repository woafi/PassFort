import React from 'react'
import { useEffect, useRef, useState, useContext } from 'react'
import { useUser } from '@clerk/clerk-react'
import { ToastContainer, toast } from 'react-toastify';
import { updateState } from '../context/store';


function InputSection() {
    const { isSignedIn, user } = useUser();
    const state = useContext(updateState);

    const eyeDom = useRef();

    const [form, setForm] = useState({
        name: '',
        passwordList: [{ site: '', username: '', password: '' }],
    });
    const [isShown, setIsShown] = useState(true);


    useEffect(() => {
        if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
            const email = user.primaryEmailAddress.emailAddress;
            setForm({
                name: email,
                passwordList: [{ site: '', username: '', password: '' }],
            });
        }
    }, [isSignedIn, user]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            passwordList: [{ ...prev.passwordList[0], [name]: value }],
        }));
    };

    const handleAdd = async () => {
        const entry = form.passwordList[0];
        if (!entry.site || !entry.username || !entry.password) return;

        await fetch("https://passfort.onrender.com/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        toast.success("Password Saved!", {
            autoClose: 1000  // Add this to ensure it closes after 1 second
        });
        setForm((prev) => ({
            ...prev,
            passwordList: [{ site: '', username: '', password: '' }],
        }));
        state.setState((prev) => !prev);    // Triggers refresh
    };

    const handleKeyDownAdd = (e) => {
        if (e.key === 'Enter') handleAdd();
    };

    const handleEye = () => {
        setIsShown((prev) => {
            const newState = !prev;
            if (eyeDom.current) {
                eyeDom.current.src = newState ? "/eyecross.png" : "/eye.png";
            }
            return newState;
        });
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <div className="input-box w-4/5 mx-auto inputbox">
                <input
                    value={form.passwordList[0].site}
                    onChange={handleChange}
                    name="site"
                    className="border-2 border-gray-300/50 focus:placeholder-transparent  hover:border-green-500 focus:border-green-500 focus:opacity-100 focus:outline-none rounded-xl w-full my-4 px-5 py-2 placeholder-white/75"
                    type="text"
                    onKeyDown={handleKeyDownAdd}
                    placeholder="Enter website Url..."
                />

                <div className="flex  inputbox full">

                    <input
                        value={form.passwordList[0].username}
                        onChange={handleChange} name="username"
                        className="border-2 border-gray-300/50 focus:placeholder-transparent full  hover:border-green-500 focus:border-green-500 focus:opacity-100 focus:outline-none rounded-xl w-1/2 mr-2 mt-4 px-5 py-2 placeholder-white/75"
                        type="text"
                        onKeyDown={handleKeyDownAdd}
                        placeholder="Username or Email"
                    />

                    <div className="password-eye border-2 border-gray-300/50 focus:placeholder-transparent hover:border-green-500 focus:opacity-100 focus:outline-none rounded-xl w-1/2 mt-4 pl-5 py-2 placeholder-white/75 flex gap-1 full pr-4">
                        <input
                            value={form.passwordList[0].password} onChange={handleChange} name="password"
                            className=" border-gray-300/50 focus:placeholder-transparent full focus:opacity-100 focus:outline-none placeholder-white/75 w-full"
                            type={isShown ? "password" : "text"}
                            onKeyDown={handleKeyDownAdd}
                            placeholder="Password"
                        />

                        <img ref={eyeDom} onClick={handleEye} className='w-6 invert cursor-pointer' src="/eyecross.png" alt="" />
                    </div>
                </div>
                <div className="save-button flex justify-center my-5">

                    <button
                        onClick={handleAdd}
                        className='font-bold text-black cursor-pointer flex bg-green-600 rounded-full px-5 py-1 items-center justify-center hover:bg-green-400 '>
                        <lord-icon
                            src="https://cdn.lordicon.com/hqymfzvj.json"
                            trigger="hover"
                        >
                        </lord-icon>
                        Add
                    </button>
                </div>
            </div>
        </>
    )
}

export default InputSection
