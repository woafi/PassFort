import { useEffect, useRef, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { ToastContainer, toast } from 'react-toastify';


function Display() {
    const { isSignedIn, user } = useUser();
    const [passwordArray, setPasswordArray] = useState([]);

    const eyeDom = useRef();
    const popupUsernames = useRef([]);
    const popupPasswords = useRef([]);
    const popupActions = useRef([]);
    const close = useRef();
    const contentRef = useRef(null)


    const [form, setForm] = useState({
        name: '',
        passwordList: [{ site: '', username: '', password: '' }],
    });

    const [maskedStates, setMaskedStates] = useState({});
    const [isShown, setIsShown] = useState(true);
    const [deleteState, setDeleteState] = useState(true);
    const [editIndex, setEditIndex] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        passwordList: [{ site: '', username: '', password: '' }],
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
            const email = user.primaryEmailAddress.emailAddress;
            getPasswords(email);
            setForm({
                name: email,
                passwordList: [{ site: '', username: '', password: '' }],
            });
            setEditForm({
                name: email,
                passwordList: [{ site: '', username: '', password: '' }],
            });
        }
    }, [isSignedIn, user, deleteState]);

    const getPasswords = async (email) => {
        try {
            const res = await fetch(`https://pass-fort-v5k8.vercel.app/?email=${encodeURIComponent(email)}`);
            const data = await res.json();
            setPasswordArray(data);
        } catch (err) {
            toast.error("Error fetching passwords");
        }
    };

    const handleAdd = async () => {
        const entry = form.passwordList[0];
        if (!entry.site || !entry.username || !entry.password) return;

        await fetch("https://pass-fort-v5k8.vercel.app/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        toast.success("Password Saved!");
        setForm((prev) => ({
            ...prev,
            passwordList: [{ site: '', username: '', password: '' }],
        }));

        setDeleteState((prev) => !prev); // Triggers refresh
        
        setTimeout(() => {
            contentRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100) // slight delay to allow tab switch
    };

    const handleKeyDownAdd = (e) => {
        if (e.key === 'Enter') handleAdd();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            passwordList: [{ ...prev.passwordList[0], [name]: value }],
        }));
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

    const handlePop = (index) => {
        if (popupUsernames.current[index]) popupUsernames.current[index].style.display = 'flex';
        if (popupPasswords.current[index]) popupPasswords.current[index].style.display = 'flex';
        if (popupActions.current[index]) popupActions.current[index].style.display = 'flex';
        if (close.current) close.current.style.display = 'flex';
    };

    const handleClose = () => {
        popupUsernames.current.forEach((el) => el && (el.style.display = 'none'));
        popupPasswords.current.forEach((el) => el && (el.style.display = 'none'));
        popupActions.current.forEach((el) => el && (el.style.display = 'none'));
        if (close.current) close.current.style.display = 'none';
    };

    const togglePassword = (index) => {
        setMaskedStates((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const handleDelete = async (item) => {
        if (confirm("Are you sure you want to delete?")) {
            await fetch("https://pass-fort-v5k8.vercel.app/", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });
            toast.success("Password Deleted!");
            setDeleteState((prev) => !prev);
            handleClose();
        }
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setEditForm(passwordArray[index]);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({
            ...prev,
            passwordList: [{ ...prev.passwordList[0], [name]: value }],
        }));
    };

    const handleSaveEdit = async () => {
        await fetch("https://pass-fort-v5k8.vercel.app/", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editForm),
        });
        toast.success("Password Edited!");
        setEditIndex(null);
        setDeleteState((prev) => !prev);
    };

    const handleCopy = async (text, e) => {
        e.stopPropagation();
        await navigator.clipboard.writeText(text);
        toast.info("Copied to clipboard!");
    };


    //For searching website Url
    const filteredPasswords = passwordArray.filter((item) =>
        item.passwordList[0].site.toLowerCase().includes(searchQuery)
    );


    return (
        <><ToastContainer
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
            <div className='container mx-auto relative'>
                <div className='font-bold text-lg mb-2 mx-3'>My Passwords</div>
                {passwordArray.length == 0 && <div className='my-2'> Password is not added yet </div>}
                {passwordArray.length != 0 && <div className=" rounded-t-xl  border border-gray-600 bg-[#1e2939] w-full h-[37.3vh] mb-10 ">
                    <div className='rounded-t-xl header-box flex items-center bg-[#0f141e] py-2'>
                        <div className='website-head font-bold pl-10 w-full lg:w-1/2 h-7 flex items-center  Url whitespace-nowrap '>
                            <div>Website Url</div>
                            <input
                                className='border rounded-lg px-2 ml-4 border-white/50 font-normal w-1/2 lg:w-1/2'
                                type="text"
                                placeholder='Search'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                            />
                        </div>
                        <div className=" font-bold  w-2/5 h-7 none ">Username or Email</div>
                        <div className=" font-bold  w-2/5 h-7 none">Password</div>
                        <div className=" font-bold  text-center none w-1/5 h-7">Actions</div>
                    </div>
                    <div className='h-[86%] overflow-y-auto passwordContainer'>
                        {filteredPasswords.map((item, index) => (
                            <div key={index} ref={contentRef} className='password-list flex hover:bg-gray-700 py-2 border border-gray-600'>

                                {/* Editable Website URL */}
                                <div onClick={() => handlePop(index)} className="pl-10 website w-1/2 h-6 flex items-center">
                                    {editIndex === index ? (
                                        <input
                                            name="site"
                                            value={editForm.passwordList[0].site}
                                            onChange={handleEditChange}
                                            className="border border-gray-500 px-2 py-1 w-full rounded mx-1 bg-gray-400 text-black"
                                        />
                                    ) : (
                                        <>
                                            <div className='flex item center'>
                                                {item.passwordList[0].site}
                                                <lord-icon className="invert cursor-pointer" onClick={(e) => handleCopy(item.passwordList[0].site, e)}
                                                    style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover">
                                                </lord-icon>
                                            </div>
                                            <div className='popUp hidden invert'>
                                                <lord-icon className="w-6 pt-1"
                                                    src="https://cdn.lordicon.com/hmqxevgf.json"
                                                    trigger="hover">
                                                </lord-icon>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Editable Username */}
                                <div ref={(el) => (popupUsernames.current[index] = el)} className='username w-2/5 h-6 flex items-center none'>
                                    {editIndex === index ? (
                                        <input
                                            name="username"
                                            value={editForm.passwordList[0].username}
                                            onChange={handleEditChange}
                                            className="border border-gray-500 px-2 py-1 w-2/3 rounded mx-1 bg-gray-400 text-black"
                                        />
                                    ) : (
                                        <>
                                            <span>{item.passwordList[0].username}</span>
                                            <lord-icon className="invert cursor-pointer" onClick={(e) => handleCopy(item.passwordList[0].username, e)}
                                                style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }}
                                                src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover">
                                            </lord-icon>
                                        </>
                                    )}
                                </div>

                                {/* Editable Password */}
                                <div ref={(el) => (popupPasswords.current[index] = el)} className='password w-2/5 h-6 flex justify-between none'>
                                    <div className='flex items-center'>
                                        {editIndex === index ? (
                                            <input
                                                name="password"
                                                value={editForm.passwordList[0].password}
                                                onChange={handleEditChange}
                                                className="border border-gray-500 px-2 py-1 w-full rounded mx-1 bg-gray-400 text-black"
                                            />
                                        ) : (
                                            <>
                                                {maskedStates[index] ? item.passwordList[0].password : item.passwordList[0].password.replace(/./g, '•')}
                                                <lord-icon className="invert cursor-pointer" onClick={(e) => handleCopy(item.passwordList[0].password, e)}
                                                    style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover">
                                                </lord-icon>
                                            </>
                                        )}
                                    </div>
                                    <img onClick={() => togglePassword(index)} className='eyepass w-6 invert cursor-pointer'
                                        src={maskedStates[index] ? "/eye.png" : "/eyecross.png"} alt="toggle password"
                                    />
                                </div>

                                {/* Actions */}
                                <div ref={(el) => (popupActions.current[index] = el)} className='action text-center none action w-1/5 h-6 flex gap-2 justify-center items-center '>
                                    {editIndex === index ? (
                                        <>
                                            <button onClick={() => handleSaveEdit(index)}>
                                                <img className='w-5 invert' src="/save.svg" alt="" />
                                            </button>
                                            <button onClick={() => setEditIndex(null)} className='mt-2'>
                                                <lord-icon className="invert"
                                                    src="https://cdn.lordicon.com/nqtddedc.json"
                                                    trigger="hover"
                                                >
                                                </lord-icon>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEdit(index)}>
                                                <lord-icon className="invert" src="https://cdn.lordicon.com/gwlusjdu.json" trigger="hover"
                                                    style={{ width: "25px", height: "25px" }}>
                                                </lord-icon>
                                            </button>
                                            <button onClick={() => handleDelete(item)}>
                                                <lord-icon className="invert" src="https://cdn.lordicon.com/skkahier.json" trigger="hover"
                                                    style={{ width: "25px", height: "25px" }}>
                                                </lord-icon>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                }
            </div>
            <span ref={close} onClick={handleClose} className='hidden close'><img className='invert' src="/close.svg" alt="" /></span>
        </>
    )
}

export default Display
