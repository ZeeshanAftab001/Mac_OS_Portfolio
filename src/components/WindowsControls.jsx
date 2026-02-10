import useWindowStore from '#store/windows'
import React from 'react'

function WindowsControls({target}) {
    const {closeWindow}=useWindowStore();
  return (
    <div id='window-controls'>
        <div className='close' onClick={()=>closeWindow(target)}></div>
        <div className='minimize' onClick={()=>closeWindow()}></div>
        <div className='maximize' onClick={()=>closeWindow()}></div>
    </div>
  )
}

export default WindowsControls