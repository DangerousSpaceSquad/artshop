import './Cart.css'
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Trash } from "lucide-react"
import { useCookies } from 'react-cookie'

/**
 * Convert a list of items in the cart to a dictionary of items.
 * @param {Array} cartList A list of item IDs in the cart, as stored in the cookie
 * @returns A dictionary of items and their quantities in the cart.
 */
function cartListToDict(cartList) {
    let cartDict = {};
    for (const item of cartList) {
        if (item in cartDict){
            cartDict[item] += 1;
        } else {
            cartDict[item] = 1;
        }
    }
    return cartDict;
}

export default function Cart() {
    const [cartItemDetails, setCartItemDetails] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['cart']);
    const [stockCounts, setStockCounts] = useState({});

    function IncrementQ(variationId) {
        let cartList = cookies.cart;
        let currentCount = 0;
        for (const cartItem of cartList) {
            if (cartItem === variationId) currentCount ++;
        }
        if (currentCount >= stockCounts[variationId]) return;
        cartList.push(variationId);
        setCookie('cart', cartList);
    }

    function DecrementQ(variationId) {
        let cartList = cookies.cart;
        let itemIndex = cartList.indexOf(variationId);
        cartList.splice(itemIndex, 1);
        setCookie('cart', cartList);
    }

    function removeFromCart(variationId) {
        let cartList = cookies.cart;
        let outList = cartList.filter(cartItem => cartItem != variationId);
        setCookie('cart', outList);
    }

    async function checkout() {
        let cartList = cookies.cart;
        let cartDict = cartListToDict(cartList);
        let requestPayload = [];
        for (let [cartItemId, cartItemQuantity] of Object.entries(cartDict)) {
            let itemDetails = {};
            itemDetails.id = cartItemId;
            itemDetails.quantity = cartItemQuantity;
            requestPayload.push(itemDetails);
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestPayload)
        }
        let paymentLinkCallResult = await fetch(`/api/square/CreatePaymentLink`, requestOptions);
        if (!paymentLinkCallResult.ok) {
            console.log("Unexpected HTTP error while fetching payment link");
        }
        let paymentLinkSrc = await paymentLinkCallResult.text();
        removeCookie('cart');
        globalThis.location.href = paymentLinkSrc;
    }

    async function fetchItemStockCounts() {
        let stockCountResponse = await fetch(`/api/square/GetInventoryCount`);
        if (!stockCountResponse.ok || stockCountResponse.errors) {
            console.log("Unexpected error while retrieving stock counts");
            return;
        }
        let stockData = await stockCountResponse.json();
        let stockDict = {};
        for (const stockItem of stockData) {
            let trackedStockCount = stockDict[stockItem.catalog_object_id] ?? 0;
            trackedStockCount += Number.parseInt(stockItem.quantity);
            stockDict[stockItem.catalog_object_id] = trackedStockCount;
        }
        setStockCounts(stockDict);
    }

    useEffect(() => {
        async function fetchItemDetails(cartDict) {
            let httpResults = []
            for (let [cartItemId] of Object.entries(cartDict)){
                httpResults.push(fetch(`/api/square/GetCatalogItem/` + cartItemId));
            }
            await fetchItemStockCounts();
            await Promise.all(httpResults).then(async (httpResponse) => {
                let itemsInCart = [];
                for (const result of httpResponse) {
                    if (!result.ok || result.errors) {
                        console.log("Unexpected error while retrieving item details");
                        continue;
                    }
                    let squareItemDetails = (await result.json());
                    squareItemDetails.quantity = cartDict[squareItemDetails.object.id];
                    itemsInCart.push(squareItemDetails);
                }
                setLoading(false);
                setCartItemDetails(itemsInCart);
            })
        }

        if (!cookies.cart) return;
        setLoading(true);
        let cartDict = cartListToDict(cookies.cart);
        fetchItemDetails(cartDict);
    }, [cookies.cart]);

    if (isLoading) {
        return <p> Loading... </p>
    }

    if (!cookies.cart || cookies.cart.length <= 0) {
        return <p>Your cart is empty!</p>
    }

    let cartContents = [];
    let grandTotal = 0;

    for (const cartItem of cartItemDetails) {
        let itemName = "ERROR: Item name not found.\n"
        let itemImageSrc = "";
        let priceCents = cartItem.object.item_variation_data.price_money.amount/100;

        for (const relatedObject of cartItem.related_objects) {
            if (relatedObject.type == "ITEM") {
                itemName = relatedObject.item_data.name;
            }
            if (relatedObject.type == "IMAGE") {
                itemImageSrc = relatedObject.image_data.url;
            }
        }
        itemName += ` (${cartItem.object.item_variation_data.name})`
        grandTotal += priceCents * cartItem.quantity;

        let incrementBtnClass = "cart-qty-btn";
        if (cartItem.quantity >= stockCounts[cartItem.object.id]) {
            incrementBtnClass = "cart-qty-btn disabled-qty-btn";
        }

        cartContents.push(
        <tr>
            <td className='no-indent'>
                <button onClick={() => removeFromCart(cartItem.object.id)}className='trash-btn'><Trash /></button>
            </td>
            <td className='no-indent'><img className='cart-item-img' src={itemImageSrc} /></td>
            <td className='no-indent'>{itemName}</td>
            <td data-label="Price">${priceCents.toFixed(2)}</td>
            <td data-label="Quantity">
                <div className="quantity-selector">
                    <button onClick={() => DecrementQ(cartItem.object.id)} className="cart-qty-btn"><ChevronLeft /></button>
                    <p>{cartItem.quantity}</p>
                    <button onClick={() => IncrementQ(cartItem.object.id)} className={incrementBtnClass}><ChevronRight /></button>
                </div>
            </td>
            <td data-label="Subtotal">${(priceCents * cartItem.quantity).toFixed(2)}</td>
        </tr>
        );
    }
    
    return <div className='cart-container'>
        <h1>Your cart:</h1>
        <table className='cart-table'>
            <thead>
                <tr>
                    <th className='trash-button'></th>
                    <th className='item-image'></th>
                    <th className='item-name'>Product</th>
                    <th className='item-price'>Price</th>
                    <th className='item-quantity'>Quantity</th>
                    <th className='item-subtotal'>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                {cartContents}
            </tbody>
            <tbody>
                <tr>
                    <td />
                    <td />
                    <td />
                    <td />
                    <td>Estimated total:</td>
                    <td>${grandTotal.toFixed(2)}</td>
                </tr>
            </tbody>
        </table>
        <div className='checkout-container'>
            <h3>Taxes, discounts, and shipping calculated at checkout</h3>
            <button onClick={checkout} className='checkout-button'>Check out</button>
        </div>

    </div>
}