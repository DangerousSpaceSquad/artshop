import testImg from "./assets/bigfoot.jpg"
import './ShopItem.css'

export default function ShopItem() {
    return (
        <a href="/itempage" >
            <div className = "item-container">
                <img className = "item-img" src= {testImg}/>
                <div className = "name-bar">
                    <h1>Test Item</h1>
                <p> $10.00 </p>
            </div>
            </div>
        </a>

    )
}