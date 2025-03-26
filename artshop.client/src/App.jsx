import { useEffect, useState } from 'react';
import './App.css';
import { ImageSlider } from "./ImageSlider";
import Navbar from "./Navbar";
import carousel1 from "./assets/Demo1.jpg"
import carousel2 from "./assets/Demo2.jpg"
import carousel3 from "./assets/Demo3.jpg"
import carousel4 from "./assets/Demo4.jpg"
import carousel5 from "./assets/Demo5.jpg"
import footerLogo from "./assets/Logo2023Transparent.png"

const CAROUSEL_IMAGES = [carousel1, carousel2, carousel3, carousel4, carousel5]

function App() {
   
   
    return(
    
    <div>
        

        <div className = "banner-image"></div>
        <Navbar/>
        <div className = "image-carousel">
            <ImageSlider imageUrls={CAROUSEL_IMAGES}/>
        </div>
        <div className = "footer">
            <img 
            style={{width: "20%", height: "auto"}}
            src = {footerLogo} classname = "footer-logo"/>
            <p>Copyright 2025 Telrem. All rights reserved.</p>
        </div>
    </div>
   )

}

export default App;