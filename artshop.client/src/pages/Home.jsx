import carousel1 from "../assets/LaunchCarouselItem.png"
import carousel2 from "../assets/StickersCarouselItem.png"
import carousel3 from "../assets/PrintsCarouselItem.png"


import { ImageSlider } from "../ImageSlider";
import ShopItem from "../ShopItem";
import './Home.css'

const CAROUSEL_IMAGES = [carousel1, carousel2, carousel3]

export default function Home() {
    return (
        <div>
            <div className="image-carousel">
                <ImageSlider imageUrls={CAROUSEL_IMAGES} />

            </div>
            <div className="header">
                Featured Items
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