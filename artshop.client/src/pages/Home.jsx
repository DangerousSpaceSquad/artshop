import carousel1 from "../assets/LaunchCarouselItem.png"
import carousel2 from "../assets/StickersCarouselItem.png"
import carousel3 from "../assets/PrintsCarouselItem.png"

import { useState, useEffect } from 'react';
import { ImageSlider } from "../ImageSlider";
import Catalog from "../Catalog";
import './Home.css'

const CAROUSEL_IMAGES = [carousel1, carousel2, carousel3]

export default function Home() {

    const [shopItems, setShopItems] = useState();
    const ITEM_COUNT = 9;

    // An Effect is a function that's run occasionally to update the State if something might have changed it.
    // In this case, we only run it once, to set the state initially
        // (In case you're curious, we don't technically need an Effect for a one-time change, but it's the easiest way in this use case)
    useEffect(() => {
        setShopItems(<Catalog itemCount={ITEM_COUNT} selectedCategory={""}></Catalog>)
    }, []);

    return (
        <div>
            <div className="image-carousel">
                <ImageSlider imageUrls={CAROUSEL_IMAGES} />

            </div>
            <div className="header">
                Featured Items
            </div>
            <div className="shop-grid">
                {shopItems}
            </div>
        </div>
    )
}