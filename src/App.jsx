import { useState } from 'react'
import Navbar from './components/Navbar'
import Manager from './components/Manager'
import { ToastContainer, toast } from 'react-toastify';

function App() {

  return (
    <>
      <div>
        <div class="absolute h-screen top-0 z-[-2] min-h-[100vh] w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] overflow-y-auto">
        <Navbar/>
        <Manager/>
        </div>
      </div>
    </>
  )
}

export default App
