import { useEffect } from 'react';
import Navbar from './components/Navbar';
import { useNavigate } from "react-router-dom";
import HeadText from './components/HeadText';
import Home from './components/Home';
import { useUser } from '@clerk/clerk-react';
import Body from './components/Body';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function AuthWrapper({ children }) {

  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {

    if (isSignedIn) {
      if (window.location.pathname !== '/home') {
        navigate('/home');
      }
    } else {
      if (window.location.pathname !== '/') {
        navigate('/');
      }
    }
  }, [isSignedIn, isLoaded, navigate]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter >
      <Routes>
        <Route path='/' element={<><AuthWrapper><div className="absolute h-100dvh top-0 z-[-2] min-h-[100dvh] w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] overflow-y-auto">
          <Navbar /> <HeadText /> <Home />
        </div></AuthWrapper></>} />
        <Route path='/home' element={<><AuthWrapper><div className="absolute h-100dvh top-0 z-[-2] min-h-[100dvh] w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] overflow-y-auto">
          <Navbar /> <Body />
        </div></AuthWrapper></>} />
      </Routes>
    </BrowserRouter >
  );
}

export default App;