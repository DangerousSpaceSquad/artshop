import testImg from "./assets/bigfoot.jpg"
import './ShopItem.css'

export default function ShopItem() {
    return (
        <div className = "item-container">
            <img className = "item-img" src= {testImg}/>
            <div className = "name-bar">
                <a href="/itempage" ><h1>Test Item</h1></a>
                <p> $10.00 </p>
            </div>
        </div>

    )
}