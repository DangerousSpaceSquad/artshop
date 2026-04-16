import './Cart.css'
import itemImg from "../assets/bigfoot.jpg"
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
    const [cookies, setCookie] = useCookies(['cart']);

    function IncrementQ(variationId) {
        let cartList = cookies.cart;
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

    useEffect(() => {
        async function fetchItemDetails(cartDict) {
            let httpResults = []
            for (let [cartItemId] of Object.entries(cartDict)){
                httpResults.push(fetch(`/api/square/GetCatalogItem/` + cartItemId));
            }

            await Promise.all(httpResults).then(async (httpResponse) => {
                let itemsInCart = [];
                for (const result of httpResponse) {
                    if (!result.ok) {
                        console.log("Unexpected HTTP error in response from API");
                        continue;
                    }
                    if (result.errors) {
                        console.log("Unexpected Square error in response from API");
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
        let itemName = "ERROR: Item name not found."
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
        grandTotal += priceCents * cartItem.quantity;
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
                    <button onClick={() => IncrementQ(cartItem.object.id)} className="cart-qty-btn"><ChevronRight /></button>
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
            <button className='checkout-button'>Check out</button>
        </div>

    </div>
}