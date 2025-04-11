import React from 'react';
import './Portfolio.css'
import { ImageGallery } from "../ImageGallery";

import gal1 from "../assets/bigfoot.jpg"
import gal2 from "../assets/Demo3.jpg"
import gal3 from "../assets/Demo4.jpg"
import gal4 from "../assets/Demo1.jpg"
import gal5 from "../assets/Demo2.jpg"


const GALLERY_IMAGES = [gal1, gal2, gal3, gal4, gal5, gal1, gal2, gal3, gal4, gal5]

export default function Home() {
    return (
        <div>
            <h1 className= 'gallery-name'>Gallery</h1>
            <ImageGallery imageUrls={GALLERY_IMAGES} />
        </div>
    )
}