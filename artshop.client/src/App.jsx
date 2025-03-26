import { useEffect, useState } from 'react';
import './App.css';
import { ImageSlider } from "./ImageSlider";
import Navbar from "./Navbar";
import carousel1 from "./assets/JaneDoeFinalNoText.jpg"
import carousel2 from "./assets/Day2RosalinaShaded.jpg"
import carousel3 from "./assets/Day3FeliciaSticker.jpg"
import carousel4 from "./assets/Day10MirkoFinal.jpg"
import carousel5 from "./assets/Day11MaiShiranuiInked.jpg"

const CAROUSEL_IMAGES = [carousel1, carousel2, carousel3, carousel4, carousel5]

function App() {
   
   
    return(
    <div>
        <div className = "banner-image"></div>
        <Navbar/>
        <ImageSlider imageUrls={CAROUSEL_IMAGES}/>
    </div>
   )

}

export default App;