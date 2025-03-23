import { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';


function Manager() {

  const eyeDom = useRef()
  const popupUsernames = useRef([]);
  const popupPasswords = useRef([]);
  const popupActions = useRef([]);
  const close = useRef();


  const [maskedStates, setMaskedStates] = useState({});
  const [deleteState, setDeleteState] = useState(true)
  const [form, setForm] = useState({ site: "", username: "", password: "" })
  const [isShown, setIsShown] = useState(true)
  const [passwordArray, setPasswordArray] = useState([])
  const [editIndex, setEditIndex] = useState(null); // Track which item is being edited
  const [editForm, setEditForm] = useState({ site: "", username: "", password: "" }); // Store edits



  useEffect(() => {
    getPasswords()
  }, [form, deleteState])


  //For closing the popUp
  const handleClose = () => {
    //For username
    if (close.current.style.display == 'flex') {
      popupUsernames.current.forEach((el) => {
        el.style.display = 'none';
      });
    }
    //For password
    if (close.current.style.display == 'flex') {
      popupPasswords.current.forEach((el) => {
        el.style.display = 'none';
      });
    }
    //For Actions
    if (close.current.style.display == 'flex') {
      popupActions.current.forEach((el) => {
        el.style.display = 'none';
      });
    }
    if (close.current.style.display == 'flex') {
      close.current.style.display = 'none';
    }
  }

  //For showing the popUp
  const handlePop = (index) => {
    // console.log(popupUsernames.current[index])
    //For username
    if (popupUsernames.current[index]) {
      popupUsernames.current[index].style.display = 'flex';
      popupUsernames.current[index].focus();
    }
    //For password
    if (popupPasswords.current[index]) {
      popupPasswords.current[index].style.display = 'flex';
    }
    //For Actions
    if (popupActions.current[index]) {
      popupActions.current[index].style.display = 'flex';
    }
    //For close
    if (close.current) {
      close.current.style.display = 'flex';
    }
  };


  //Get all passwords
  const getPasswords = async () => {
    let req = await fetch("https://passfort.onrender.com/")
    let passwords = await req.json()
    setPasswordArray(passwords)
    // console.log(passwords)
  }

  //Handing Show or Hide password (single)
  const handleEye = () => {

    setIsShown(!isShown)
    if (isShown) {
      eyeDom.current.src = "/eye.png"
    } else {
      eyeDom.current.src = "/eyecross.png"
    }
  }

  //Handing Show or Hide password
  const togglePassword = (index) => {
    setMaskedStates((prev) => ({
      ...prev,
      [index]: !prev[index] // Toggle specific password visibility
    }));
  };


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  //Post Request Handling
  const postHandling = async (data) => {
    let url = await fetch("https://passfort.onrender.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    // let res = await url.text()
    // console.log(data, res)
  }

  const handleAdd = async () => {
    if (form.site.trim() === "") return;
    if (form.username.trim() === "") return;
    if (form.password.trim() === "") return;
    await postHandling(form) //post 
    toast('Password Saved!', {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

    //For clearing the input
    setForm({ site: "", username: "", password: "" });
  }

  //For pressing Enterkey
  const handleKeyDownAdd = (e) => {
    if (e.key === "Enter") {
      handleAdd()
    }
  }

  //Delete Request Handling
  const deleteHandling = async (data) => {
    let url = await fetch("https://passfort.onrender.com/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

  }

  //For deleting the password
  const handleDelete = async (item) => {
    let c = confirm("Are you confirmed?")
    if (c) {
      await deleteHandling(item)
      setDeleteState(!deleteState)

      if (close.current.style.display == 'flex') {
        handleClose()
      }

      toast('Password Deleted!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }

  //For editing the password
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditForm(passwordArray[index]); // Load the current values into editForm
  };



  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  //Put Request Handling
  const updateHandling = async (data) => {
    let url = await fetch("https://passfort.onrender.com/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  }


  //For saving the edited password
  const handleSaveEdit = async (index) => {
    await updateHandling(editForm)
    setDeleteState(!deleteState)
    setEditIndex(null); // Exit edit mode

    toast('Password Edited!', {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  //Copy to clipboard
  const handleCopy = async (text, e) => {
    e.stopPropagation(); // Prevents event bubbling to parent
    await navigator.clipboard.writeText(text);
    toast('Copied to clipboard!', {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }


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
      <div>
        <div className='container mx-auto relative'>
          <div className='logo-box font-bold text-3xl text-center my-10'>
            <span>Pass</span>
            <span className='text-green-500'>Fort</span>
            <p className='text-center text-base font-normal'>Your Own Password Manager</p>
          </div>

          <div className="input-box w-4/5 mx-auto inputbox">

            <input
              value={form.site} onChange={handleChange} name="site"
              className="border-2 border-gray-300/50 focus:placeholder-transparent  hover:border-green-500 focus:border-green-500 focus:opacity-100 focus:outline-none rounded-xl w-full my-4 px-5 py-2 placeholder-white/75"
              type="text"
              onKeyDown={handleKeyDownAdd}
              placeholder="Enter website Url..."
            />

 
            <div className="flex  inputbox full">

              <input
                value={form.username} onChange={handleChange} name="username"
                className="border-2 border-gray-300/50 focus:placeholder-transparent full  hover:border-green-500 focus:border-green-500 focus:opacity-100 focus:outline-none rounded-xl w-1/2 mr-2 mt-4 px-5 py-2 placeholder-white/75"
                type="text"
                onKeyDown={handleKeyDownAdd}
                placeholder="Username or Email"
              />

              <div className="password-eye border-2 border-gray-300/50 focus:placeholder-transparent hover:border-green-500 focus:opacity-100 focus:outline-none rounded-xl w-1/2 mt-4 pl-5 py-2 placeholder-white/75 flex gap-1 full pr-4">
                <input
                  value={form.password} onChange={handleChange} name="password"
                  className=" border-gray-300/50 focus:placeholder-transparent full focus:opacity-100 focus:outline-none placeholder-white/75 w-full"
                  type={isShown ? "password" : "text"}
                  onKeyDown={handleKeyDownAdd}
                  placeholder="Password"
                />

                <img ref={eyeDom} onClick={handleEye} className='w-6 invert cursor-pointer' src="/eyecross.png" alt="" />
              </div>
            </div>
          </div>

          <div className="save-button flex justify-center my-5">

            <button onClick={handleAdd} className='font-bold text-black cursor-pointer flex bg-green-600 rounded-full px-5 py-1 items-center justify-center hover:bg-green-400 '>
              <lord-icon
                src="https://cdn.lordicon.com/hqymfzvj.json"
                trigger="hover"
              >
              </lord-icon>
              Add
            </button>
          </div>


          <div className='font-bold text-lg mb-2'>My Passwords</div>
          {/* For Showing array list */}
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
                      value={editForm.site}
                      onChange={handleEditChange}
                      className="border border-gray-500 px-2 py-1 w-full rounded mx-1 bg-gray-400 text-black"
                    />
                  ) : (
                    <>
                      <div className='flex item center'>
                        {item.site}
                        <lord-icon className="invert cursor-pointer" onClick={(e) => handleCopy(item.site, e)}
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
                      value={editForm.username}
                      onChange={handleEditChange}
                      className="border border-gray-500 px-2 py-1 w-2/3 rounded mx-1 bg-gray-400 text-black"
                    />
                  ) : (
                    <>
                      <span>{item.username}</span>
                      <lord-icon className="invert cursor-pointer" onClick={(e) => handleCopy(item.username, e)}
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
                        value={editForm.password}
                        onChange={handleEditChange}
                        className="border border-gray-500 px-2 py-1 w-full rounded mx-1 bg-gray-400 text-black"
                      />
                    ) : (
                      <>
                        {maskedStates[index] ? item.password : item.password.replace(/./g, '•')}
                        <lord-icon className="invert cursor-pointer" onClick={(e) => handleCopy(item.password, e)}
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
          <span ref={close} onClick={handleClose} className='hidden close'><img className='invert' src="/close.svg" alt="" /></span>
        </div>
      </div>
    </>
  )
}

export default Manager
