import React from 'react'
import Ban from './video/banner.mp4';
import './css/banner.css';

function Banner() {
    
  return (
    <>
        <div className="banner" >
      <video autoPlay loop muted >
        <source src={Ban} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
    </>
  )
}

export default Banner
