import carousel1 from "../assets/Demo1.jpg"
import carousel2 from "../assets/Demo2.jpg"
import carousel3 from "../assets/Demo3.jpg"
import carousel4 from "../assets/Demo4.jpg"
import carousel5 from "../assets/Demo5.jpg"

import { ImageSlider } from "../ImageSlider";
import ShopItem from "../ShopItem";
import './Home.css'

const CAROUSEL_IMAGES = [carousel1, carousel2, carousel3, carousel4, carousel5]

export default function Home() {
    return (
        <div>
            <div className="image-carousel">
                <ImageSlider imageUrls={CAROUSEL_IMAGES} />

            </div>
            <div className="shop-grid">
                <ShopItem />
                <ShopItem />
                <ShopItem />
                <ShopItem />
                <ShopItem />
                <ShopItem />
                <ShopItem />
                <ShopItem />
                <ShopItem />
            </div>
        </div>
    )
}