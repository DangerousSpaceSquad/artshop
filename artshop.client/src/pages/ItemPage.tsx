import { useState, useEffect } from "react"
import './ItemPage.css'
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCookies } from 'react-cookie'

export default function ItemPage() {
    const queryParams = new URLSearchParams(globalThis.location.search);
    const itemId = queryParams.get("itemId");

    const [cookies, setCookie] = useCookies(['cart']);

    const [quantity, setQuantity] = useState(1);
    const [stockCount, setStockCount] = useState(0);
    const [itemDetails, setItemDetails] = useState();
    const [itemVariationDetails, setItemVariationDetails] = useState();
    const [loading, setLoading] = useState(true);
    
    // Note: Due to issues with SKU being null in the Square API, we're using variation IDs instead.
        // SKU would be preferred, if it worked consistently.
    const [variationId, setVariationId] = useState("");
    const [skuButtons, setSkuButtons] = useState([]);

    useEffect(() => {
        setLoading(true);

        fetch(`/api/square/GetCatalogItem/` + itemId)
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error("HTTP error");
                }
                return resp.json();
            })
            .then((data) => {
                if (data.errors) {
                    throw new Error("Square API Error");
                }
                return data;
            })
            .then((data) => {
                setItemDetails(data);
                setVariationId(data.object.item_data.variations[0].id);
                setLoading(false);
            })
    }, [itemId]);

    useEffect(() => {
        if (!variationId) return;
        fetch(`/api/square/GetInventoryCount/` + variationId)
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error("HTTP error");
                }
                return resp.text();
            })
            .then((data) => {
                setStockCount(Number.parseInt(data));
            })
    }, [variationId]);

    useEffect(() => {
        if (itemDetails) {
            let variations = itemDetails.object.item_data.variations;
            let newSkuButtons = []
            for (const variationDetails of variations) {
                let btnClassName = "sku-btn"
                if (variationDetails.id == variationId) {
                    setItemVariationDetails(variationDetails.item_variation_data);
                    btnClassName += " selected-sku";
                }
                let button = <button onClick={() => setVariationId(variationDetails.id)} className = {btnClassName}>{variationDetails.item_variation_data.name}</button>
                newSkuButtons.push(button);
            }
            setSkuButtons(newSkuButtons);
        }
    }, [variationId, itemDetails]);


    function IncrementQ() {
        if (quantity >= stockCount) return;
        setQuantity(curQuantity => {
            return curQuantity + 1
        });
    }

    function DecrementQ() {
        setQuantity(curQuantity => {
            if (curQuantity > 1) return curQuantity - 1
            return curQuantity
        });
    }

    if (loading || !itemDetails || !itemVariationDetails) {
        return(
            <div>Loading...</div>
        )
    }

    let imageSrc = "";
    for (const element of itemDetails.related_objects) {
        if (element.image_data) {
            imageSrc = element.image_data.url;
            break;
        }
    }

    function addToCart(){
        let cartItems = [];
        if (cookies.cart) {
            cartItems = cookies.cart;
        }
        for (let i = 0; i < quantity; i++) {
            cartItems.push(variationId);
        }
        setCookie('cart', cartItems);
        globalThis.location.href = `/shop`;
    }

    let incrementButtonClass = "qty-btn";
    if (quantity >= stockCount) {
        incrementButtonClass = "qty-btn disabled-btn";
    }

    return (
        <div className="item">
            <img src={imageSrc} className="product-image" />
            <div className = "product-info">
                <h1>{itemDetails.object.item_data.name}</h1>
                <h2>${(itemVariationDetails.price_money.amount/100).toFixed(2)}</h2>
                <h3>Size: </h3>
                <div className="sku-selector">
                    {skuButtons}
                </div>
                <h3>Quantity: </h3>
                <div className="quantity-selector">
                    <button onClick={DecrementQ} className = "qty-btn" style={{left: 0}}><ChevronLeft /></button>
                    <p>{quantity}</p>
                    <button onClick={IncrementQ} className = {incrementButtonClass} style={{right: 0}}><ChevronRight /></button>
                </div>
                <button className = "cart-add-btn" onClick={addToCart}>Add to cart</button>
                <div>
                    <h2>Description:</h2>
                    {itemDetails.object.item_data.description_plaintext}
                </div>
            </div>
        </div>
    )
}