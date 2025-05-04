import { useEffect, useRef, useState, useContext } from 'react'
import { useUser } from '@clerk/clerk-react'
import { ToastContainer, toast } from 'react-toastify';
import { updateState } from '../context/store';



function Display() {
    const { isSignedIn, user } = useUser();
    const state = useContext(updateState);

    const popupUsernames = useRef([]);
    const popupPasswords = useRef([]);
    const popupActions = useRef([]);
    const close = useRef();

    const [passwordArray, setPasswordArray] = useState([]);
    const [maskedStates, setMaskedStates] = useState({});
    const [deleteState, setDeleteState] = useState(true);
    const [editIndex, setEditIndex] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        passwordList: [{ site: '', username: '', password: '' }],
    });

    useEffect(() => {
        if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
            const email = user.primaryEmailAddress.emailAddress;
            getPasswords(email);
            setEditForm({
                name: email,
                passwordList: [{ site: '', username: '', password: '' }],
            });
        }
    }, [isSignedIn, user, deleteState, state.state]);

    const getPasswords = async (email) => {
        try {
            const res = await fetch(`https://passfort.onrender.com/?email=${encodeURIComponent(email)}`);
            const data = await res.json();
            setPasswordArray(data);
        } catch (err) {
            toast.error("Error fetching passwords");
        }
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
            await fetch("https://passfort.onrender.com/", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });
            state.setState((prev) => !prev);    // Triggers refresh
            toast.success("Password Deleted!");
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
        await fetch("https://passfort.onrender.com/", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editForm),
        });
        toast.success("Password Edited!", {
            autoClose: 1000  // Add this to ensure it closes after 1 second
        });
        
        setEditIndex(null);
        state.setState((prev) => !prev);    // Triggers refresh
    };

    const handleCopy = async (text, e) => {
        e.stopPropagation();
        await navigator.clipboard.writeText(text);
        toast.info("Copied to clipboard!");
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
            <div className='container mx-auto relative'>
                <div className='font-bold text-lg mb-2'>My Passwords</div>
                {passwordArray.length == 0 && <div className='my-2'> Password is not added yet </div>}
                {passwordArray.length != 0 && <div className=" rounded-t-xl  border border-gray-600 bg-[#1e2939] w-full h-[37.3vh] mb-10 ">
                    <div className='rounded-t-xl header-box flex bg-[#0f141e] py-2'>
                        <div className=" website-head font-bold pl-10 w-1/2 h-7">Website Url</div>
                        <div className=" font-bold  w-2/5 h-7 none ">Username or Email</div>
                        <div className=" font-bold  w-2/5 h-7 none">Password</div>
                        <div className=" font-bold  text-center none w-1/5 h-7">Actions</div>
                    </div>
                    <div className='h-[87%] overflow-y-auto passwordContainer'>
                        {passwordArray.map((item, index) => (
                            <div key={index} className='password-list flex hover:bg-gray-700 py-2 border border-gray-600'>

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
