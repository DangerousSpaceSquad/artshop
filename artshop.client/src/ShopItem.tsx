import './ShopItem.css'

interface displayItem {
    imgSrc: string,
    title: string,
    priceCents: number
}

export default function ShopItem({imgSrc, title, priceCents}: Readonly<displayItem>) {
    return (
        <a href="/itempage" >
            <div className = "item-container">
                <img className = "item-img" src= {imgSrc}/>
                <div className = "name-bar">
                    <h1>{title}</h1>
                <p> ${(priceCents/100).toFixed(2)} </p>
            </div>
            </div>
        </a>

    )
}