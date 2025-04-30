import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Manager from './components/Manager';
import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom";
import HeadText from './components/HeadText';
import Home from './components/Home';
import { useUser } from '@clerk/clerk-react';
import Body from './components/Body';

function AuthWrapper({ children }) {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded) return;

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
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AuthWrapper>
          <div>
            <div className="absolute h-screen top-0 z-[-2] min-h-[100vh] w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] overflow-y-auto">
              <Navbar /> <HeadText /> <Home />
            </div>
          </div>
        </AuthWrapper>
      )
    },
    {
      path: "/home",
      element: (
        <AuthWrapper>
          <div>
            <div className="absolute h-screen top-0 z-[-2] min-h-[100vh] w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] overflow-y-auto">
              <Navbar /> <Body />
            </div>
          </div>
        </AuthWrapper>
      )
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;