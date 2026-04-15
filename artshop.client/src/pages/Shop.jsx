import { useState, useEffect } from 'react';
import ShopItem from "../ShopItem";
import './Shop.css'

// Detailed comments are included for this file for future reference.
export default function Home() {
    // Set up the state variables we'll be using.
    // In React, State is used to store any information; in this case, mainly the list of catalog items we want to display.
    const [shopItems, setShopItems] = useState();
    const [loading, setLoading] = useState(true);

    // An Effect is a function that's run occasionally to update the State if something might have changed it.
    // In this case, we only run it once, to set the state initially
        // (In case you're curious, we don't technically need an Effect for a one-time change, but it's the easiest way in this use case)
    useEffect(() => {
        // Before we've done anything, set Loading to true.
        // We check for this at the end of the Effect to determine whether to send a temporary loading page or not.
        setLoading(true);
        setShopItems(null);

        // Here, we use the fetch() function to call the API, parsing the response into JSON.
        fetch(`/api/square/ListCatalogVariationsForDisplay`)
            // Because this returns a Promise, we use `.then()` to run code that uses the output of fetch -- if we don't, we'll get an unusable object of type Promise.
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error("HTTP error");
                }
                return resp.json();
            })
            // We can use .then() on the output of the prior .then() to handle the output after parsing succeeds
            .then((data) => {
                let catalogItems = []
                for (const element of data) {
                    let shopItem = <ShopItem imgSrc={element.imageURL} title={element.itemName} priceCents={element.price.amount} itemId={element.itemId}/>
                    catalogItems.push(shopItem);
                }
                setShopItems(catalogItems);
                setLoading(false);
            })
    }, []);

    // If the internal state is still loading, show a temporary loading message to make the page feel more responsive
    if (loading) {
        return(
            <div>Loading...</div>
        )
    }

    // (otherwise,) return the page, now that we have access to the data we need.
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