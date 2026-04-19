import { useState, useEffect } from 'react';
import Catalog from "../Catalog";
import './Shop.css'

export default function Home() {
    const [shopItems, setShopItems] = useState();
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        setShopItems(<Catalog itemCount={null} selectedCategory={selectedCategory}></Catalog>)
    }, [selectedCategory]);

    function selectCategory(categoryId) {
        setSelectedCategory(categoryId);
    }

    return (
        <div className="shop">
            <div className="filter-panel">
                <button id="filter-panel-header" onClick={() => selectCategory("")}>Products</button>
                <ul>
                    <li>
                        <button onClick={() => selectCategory("ZZNPNZ6N7AWD3RG5LVTUKTGW")}>Prints</button>
                    </li>
                    <li>
                        <button onClick={() => selectCategory("Q65CUOGNBY7YMRJT42NGYZLK")}>Stickers</button>
                    </li>
                    <li>
                        <button onClick={() => selectCategory("PLACEHOLDER FOR COMIC ID")}>Comics</button>
                    </li>
                </ul>
            </div>
            <div className="shop-grid">
                {shopItems}
            </div>
        </div>


    )
}