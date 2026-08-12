import './Cart.css'
import { useState, useEffect } from "react"
import { useCookies } from 'react-cookie'
import CartItem from "../CartItem";

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
    const [cookies, , removeCookie] = useCookies(['cart']);
    const [stockCounts, setStockCounts] = useState({});
    const [totalPriceCents, setTotalPriceCents] = useState(0);

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
            let grandTotal = 0;
            await fetchItemStockCounts();
            await Promise.all(httpResults).then(async (httpResponse) => {
                let itemsInCart = [];
                for (const result of httpResponse) {
                    if (!result.ok) {
                        console.log("Unexpected error while retrieving item details");
                        continue;
                    }
                    let squareItemDetails = (await result.json());
                    squareItemDetails.quantity = cartDict[squareItemDetails.object.id];
                    grandTotal += (squareItemDetails.object.item_variation_data.price_money.amount/100) * squareItemDetails.quantity
                    itemsInCart.push(squareItemDetails);
                }
                setCartItemDetails(itemsInCart);
                setTotalPriceCents(grandTotal);
            })
        }
        if (!cookies.cart) return;
        let cartDict = cartListToDict(cookies.cart);
        fetchItemDetails(cartDict);
    }, [cookies.cart])

    if (!cookies.cart || cookies.cart.length <= 0) {
        return <p>Your cart is empty!</p>
    }

    let cartContents = [];

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

        cartContents.push(
        <CartItem itemId={cartItem.object.id} priceCents={priceCents} initialQuantity = {cartItem.quantity}
            itemName = {itemName} imageSrc = {itemImageSrc} maxQuantity = {stockCounts[cartItem.object.id]}></CartItem>
        );
    }

    if (cartContents.length > 0){
        console.log(cartContents[0].props);
    }
    cartContents.sort((a, b) => {
        if (a.props.itemName < b.props.itemName) {
            return -1;
        }
        if (a.props.itemName > b.props.itemName) {
            return 1;
        }
        return 0;
        
    });
    
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
                    <td>${totalPriceCents.toFixed(2)}</td>
                </tr>
            </tbody>
        </table>
        <div className='checkout-container'>
            <h3>Taxes, discounts, and shipping calculated at checkout</h3>
            <button onClick={checkout} className='checkout-button'>Check out</button>
        </div>

    </div>
}