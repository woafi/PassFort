import React from 'react';
import HeadText from './HeadText';
import Display from './Display';
import { useState } from 'react';
import InputSection from './InputSection';
import { updateState } from '../context/store';


function Body() {
  const [state, setState] = useState(true);
  
  return (
    <updateState.Provider value={{state, setState}}>
    <div className='container mx-auto relative'>
      <HeadText />
      <InputSection />
      <Display />
    </div>
    </updateState.Provider>
  )
}

export default Body
