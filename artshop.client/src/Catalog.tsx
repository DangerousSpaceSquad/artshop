import { useState, useEffect } from 'react';
import ShopItem from "./ShopItem";

interface CatalogProps {
    itemCount: number | null,
    selectedCategory: string
}

export default function Catalog({itemCount, selectedCategory}: Readonly<CatalogProps>) {

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
                if (itemCount != null && catalogItems.length >= itemCount) break;
                if (selectedCategory != "" && !element.categories.includes(selectedCategory)) {
                    continue;
                }
                if (stockDict[element.variationId] <= 0) {
                    continue;
                }
                let shopItem = <ShopItem imgSrc={element.imageURL} title={element.itemName} priceCents={element.price.amount} itemId={element.itemId}/>
                catalogItems.push(shopItem);
            }
            if (catalogItems.length == 0) {
                catalogItems.push(<p>Sorry, there aren't any items of this category right now.</p>)
            }
            setShopItems(catalogItems);
            setLoading(false);
        }

        setLoading(true);
        fetchCatalogItems();
    }, [selectedCategory]);

    if (loading) {
        return(
            <div className="shop-grid">Loading...</div>
        )
    }

    return <div className="shop-grid">
                {shopItems}
            </div>
}