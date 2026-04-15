import carousel1 from "../assets/LaunchCarouselItem.png"
import carousel2 from "../assets/StickersCarouselItem.png"
import carousel3 from "../assets/PrintsCarouselItem.png"

import { useState, useEffect } from 'react';
import { ImageSlider } from "../ImageSlider";
import ShopItem from "../ShopItem";
import './Home.css'

const CAROUSEL_IMAGES = [carousel1, carousel2, carousel3]

export default function Home() {

    const [shopItems, setShopItems] = useState();
    const [loading, setLoading] = useState(true);
    const ITEM_COUNT = 9;

    // An Effect is a function that's run occasionally to update the State if something might have changed it.
    // In this case, we only run it once, to set the state initially
        // (In case you're curious, we don't technically need an Effect for a one-time change, but it's the easiest way in this use case)
    useEffect(() => {
        setLoading(true);
        setShopItems(null);

        fetch(`/api/square/ListCatalogVariationsForDisplay`)
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error("HTTP error");
                }
                return resp.json();
            })
            .then((data) => {
                let catalogItems = []
                for (const element of data) {
                    let shopItem = <ShopItem imgSrc={element.imageURL} title={element.itemName} priceCents={element.price.amount} itemId={element.itemId}/>
                    catalogItems.push(shopItem);
                    if (catalogItems.length >= ITEM_COUNT) break;
                }
                setShopItems(catalogItems);
                setLoading(false);
            })
    }, []);

    if (loading) {
        return(
            <div>Loading...</div>
        )
    }

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