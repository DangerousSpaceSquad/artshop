import ShopItem from "../ShopItem";
import './Shop.css'

export default function Home() {
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
                <ShopItem />
                <ShopItem />
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