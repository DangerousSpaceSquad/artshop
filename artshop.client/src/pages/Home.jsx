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
        async function fetchCatalogItems() {
            let catalogItemsResponse = await fetch(`/api/square/ListCatalogVariationsForDisplay`);
            if (!catalogItemsResponse.ok) {
                console.log("Unexpected HTTP error while retrieving catalog items");
                throw new Error("HTTP error");
            }
            let catalogStockResponse = await fetch(`/api/square/GetInventoryCount`);
            if (!catalogStockResponse.ok) {
                console.log("Unexpected HTTP error while retrieving stock counts");
                throw new Error("HTTP error");
            }

            let catalogData = await catalogItemsResponse.json();
            let stockData = await catalogStockResponse.json();
            let stockDict = {};
            
            for (const stockItem of stockData) {
                let trackedStockCount = stockDict[stockItem.catalog_object_id] ?? 0;
                trackedStockCount += stockItem.quantity;
                stockDict[stockItem.catalog_object_id] = trackedStockCount;
            }

            let catalogItems = []
            for (const element of catalogData) {
                if (catalogItems.length >= ITEM_COUNT) break;
                if (stockDict[element.variationId] <= 0) {
                    continue;
                }
                let shopItem = <ShopItem imgSrc={element.imageURL} title={element.itemName} priceCents={element.price.amount} itemId={element.itemId}/>
                catalogItems.push(shopItem);
            }
            setShopItems(catalogItems);
            setLoading(false);
        }

        setLoading(true);
        fetchCatalogItems();

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