import React, { useEffect } from 'react'
import { useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';


function Manager() {

  const [maskedStates, setMaskedStates] = useState({});
  const eyeDom = useRef()

  const [form, setForm] = useState({ site: "", username: "", password: "" })
  const [isShown, setIsShown] = useState(true)
  const [passwordArray, setPasswordArray] = useState([])
  const [editIndex, setEditIndex] = useState(null); // Track which item is being edited
  const [editForm, setEditForm] = useState({ site: "", username: "", password: "" }); // Store edits

  useEffect(() => {
    let passwords = localStorage.getItem("passwords");
    if (passwords) {
      setPasswordArray(JSON.parse(passwords))
    }
  }, [])

  //handing Show or Hide password
  const handleEye = () => {
    // eyeDom.current.type = "text"
    // console.log(eyeDom.current)
    setIsShown(!isShown)
    if (isShown) {
      eyeDom.current.src = "/eye.png"
    } else {
      eyeDom.current.src = "/eyecross.png"
    }
  }

  //handing Show or Hide password
  const togglePassword = (index) => {
    setMaskedStates((prev) => ({
      ...prev,
      [index]: !prev[index] // Toggle specific password visibility
    }));
  };


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAdd = () => {
    if (form.site.trim() === "") return;
    const updatePasswordArray = [...passwordArray, form];
    setPasswordArray(updatePasswordArray)
    console.log(passwordArray)
    savePassword(updatePasswordArray)
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
    setForm({ site: "", username: "", password: "" });
  }

  //For pressing Enterkey
  const handleKeyDownAdd = (e) => {
    if (e.key === "Enter") {
      handleAdd()
    }
  }


  const handleDelete = (index) => {
    let c = confirm("Are you confirmed?")
    if (c) {
      const updatePasswordArray = passwordArray.filter((_, i) => i !== index)
      setPasswordArray(updatePasswordArray)
      // console.log(passwordArray)
      savePassword(updatePasswordArray)
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

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditForm(passwordArray[index]); // Load the current values into editForm
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = (index) => {
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
    const updatedArray = [...passwordArray];
    updatedArray[index] = editForm;
    setPasswordArray(updatedArray);
    savePassword(updatedArray);
    setEditIndex(null); // Exit edit mode
  };


  const savePassword = (PasswordToSave) => {
    localStorage.setItem("passwords", JSON.stringify(PasswordToSave))
  }

  const handleCopy = (text) => {
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
    navigator.clipboard.writeText(text);
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
        <div className='container mx-auto'>
          <div className='logo-box font-bold text-3xl text-center my-10'>
            <span>Pass</span>
            <span className='text-green-500'>Fort</span>
            <p className='text-center text-base font-normal'>Your Own Password Manager</p>
          </div>

          <div className="input-box w-4/5 mx-auto ">

            <input
              value={form.site} onChange={handleChange} name="site"
              className="border-2 border-gray-300/50 focus:placeholder-transparent  hover:border-green-500 focus:border-green-500 focus:opacity-100 focus:outline-none rounded-xl w-full my-4 px-5 py-2 placeholder-white/75"
              type="text"
              onKeyDown={handleKeyDownAdd}
              placeholder="Enter website Url..."
            />


            <div className="flex">

              <input
                value={form.username} onChange={handleChange} name="username"
                className="border-2 border-gray-300/50 focus:placeholder-transparent  hover:border-green-500 focus:border-green-500 focus:opacity-100 focus:outline-none rounded-xl w-1/2 mr-2 mt-4 px-5 py-2 placeholder-white/75"
                type="text"
                onKeyDown={handleKeyDownAdd}
                placeholder="Username or Email"
              />

              <div className="password-eye border-2 border-gray-300/50 focus:placeholder-transparent hover:border-green-500 focus:opacity-100 focus:outline-none rounded-xl w-1/2 mt-4 pl-5 py-2 placeholder-white/75 flex gap-1">
                <input
                  value={form.password} onChange={handleChange} name="password"
                  className=" w-5/6 border-gray-300/50 focus:placeholder-transparent focus:opacity-100 focus:outline-none placeholder-white/75"
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

          {passwordArray.length != 0 && <div className="passwordContainer rounded-xl  border border-gray-600 bg-[#1e2939]  w-full min-h-[20vh] mb-10">
            <div className='rounded-t-xl header-box flex bg-[#0f141e] py-2'>
              <div className=" website-head font-bold pl-10 w-1/2 h-7">Website Url</div>
              <div className=" font-bold  w-2/5 h-7 none ">Username or Email</div>
              <div className=" font-bold  w-2/5 h-7 none">Password</div>
              <div className=" font-bold  text-center none w-1/5 h-7">Actions</div>
            </div>
            {passwordArray.map((item, index) => (
              <div key={index} className='password-list flex hover:bg-gray-700 py-2 border border-gray-600'>

                {/* Editable Website URL */}
                <div className="pl-10 website w-1/2 h-6 flex items-center">
                  {editIndex === index ? (
                    <input
                      name="site"
                      value={editForm.site}
                      onChange={handleEditChange}
                      className="border border-gray-500 px-2 py-1 w-full"
                    />
                  ) : (
                    <>
                      <div className='flex item center'>
                        {item.site}
                        <lord-icon className="invert cursor-pointer" onClick={() => handleCopy(item.site)}
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
                <div className='username w-2/5 h-6 flex items-center none '>
                  {editIndex === index ? (
                    <input
                      name="username"
                      value={editForm.username}
                      onChange={handleEditChange}
                      className="border border-gray-500 px-2 py-1 w-full"
                    />
                  ) : (
                    <>
                      {item.username}
                      <lord-icon className="invert cursor-pointer" onClick={() => handleCopy(item.username)}
                        style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }}
                        src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover">
                      </lord-icon>
                    </>
                  )}
                </div>

                {/* Editable Password */}
                <div className='password w-2/5 h-6 flex justify-between none'>
                  <div className='flex items-center'>
                    {editIndex === index ? (
                      <input
                        name="password"
                        value={editForm.password}
                        onChange={handleEditChange}
                        className="border border-gray-500 px-2 py-1 w-full"
                      />
                    ) : (
                      <>
                        {maskedStates[index] ? item.password : item.password.replace(/./g, '•')}
                        <lord-icon className="invert cursor-pointer" onClick={() => handleCopy(item.password)}
                          style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }}
                          src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover">
                        </lord-icon>
                      </>
                    )}
                  </div>
                  <img onClick={() => togglePassword(index)} className='w-6 invert cursor-pointer'
                    src={maskedStates[index] ? "/eye.png" : "/eyecross.png"} alt="toggle password"
                  />
                </div>

                {/* Actions */}
                <div className='action text-center none action w-1/5 h-6 flex gap-2 invert justify-center items-center'>
                  {editIndex === index ? (
                    <>
                      <button onClick={() => handleSaveEdit(index)}>
                        <img className='w-5' src="/save.svg" alt="" />
                      </button>
                      <button onClick={() => setEditIndex(null)} className='mt-2'>
                        <lord-icon
                          src="https://cdn.lordicon.com/nqtddedc.json"
                          trigger="hover"
                        >
                        </lord-icon>
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(index)}>
                        <lord-icon src="https://cdn.lordicon.com/gwlusjdu.json" trigger="hover"
                          style={{ width: "25px", height: "25px" }}>
                        </lord-icon>
                      </button>
                      <button onClick={() => handleDelete(index)}>
                        <lord-icon src="https://cdn.lordicon.com/skkahier.json" trigger="hover"
                          style={{ width: "25px", height: "25px" }}>
                        </lord-icon>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          }
        </div>
      </div>
    </>
  )
}

export default Manager
