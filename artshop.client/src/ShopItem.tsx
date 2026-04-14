import './ShopItem.css'

interface DisplayItem {
    imgSrc: string,
    title: string,
    priceCents: number,
    itemId: string
}

export default function ShopItem({imgSrc, title, priceCents, itemId}: Readonly<DisplayItem>) {
    return (
        <a href={"/itempage?itemId=" + itemId} >
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