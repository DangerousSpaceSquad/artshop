import { useState, useEffect } from 'react';
import ShopItem from "../ShopItem";
import './Shop.css'

export default function Home() {
    const [shopItems, setShopItems] = useState();
    const [loading, setLoading] = useState(true);

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
        <div className="shop">
            <div className="filter-panel">
                <h1>Products</h1>
                <ul>
                    <li>
                        <h2>Prints</h2>
                    </li>
                    <li>
                        <h2>Stickers</h2>
                    </li>
                    <li>
                        <h2>Comics</h2>
                    </li>
                </ul>
            </div>
            <div className="shop-grid">
                {shopItems}
            </div>
        </div>


    )
}