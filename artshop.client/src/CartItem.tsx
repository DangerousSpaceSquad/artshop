import { ChevronLeft, ChevronRight, Trash } from "lucide-react"
import { useCookies} from 'react-cookie'
import { useState, useEffect } from "react"

interface CartItem {
    itemId: string,
    priceCents: number,
    initialQuantity: number,
    itemName: string,
    imageSrc: string,
    maxQuantity: number
}

/**
 * Convert a list of items in the cart to a dictionary of items.
 * @param {Array} cartList A list of item IDs in the cart, as stored in the cookie
 * @returns A dictionary of items and their quantities in the cart.
 */
function cartListToDict(cartList: Array<string>) {
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

export default function CartItem({itemId, priceCents, initialQuantity, itemName, imageSrc, maxQuantity}: Readonly<CartItem>) {
    const [cookies, setCookie] = useCookies(['cart']);
    const [quantity, setQuantity] = useState(initialQuantity);

    function IncrementQ() {
        if (getItemCountInCart() >= maxQuantity) return;
        let cartList = cookies.cart;
        cartList.push(itemId);
        setCookie('cart', cartList);
    }

    function DecrementQ() {
        if (getItemCountInCart() <= 1) return;
        let cartList = cookies.cart;
        let itemIdx = cartList.indexOf(itemId);
        cartList.splice(itemIdx, 1);
        setCookie('cart', cartList);
    }

    function removeFromCart() {
        let cartList = cookies.cart;
        let outList = cartList.filter(cartItem => cartItem != itemId);
        setCookie('cart', outList);
    }

    function getItemCountInCart() {
        let cartList = cookies.cart;
        let itemCount = 0;
        for (const item of cartList) {
            if (item === itemId) itemCount++;
        }
        return itemCount;
    }

    useEffect(() => {
        setQuantity(getItemCountInCart());
    }, [cookies.cart])

    let incrementBtnClass = "cart-qty-btn";
    if (quantity >= maxQuantity) {
        incrementBtnClass = "cart-qty-btn disabled-qty-btn";
    }

    return <tr>
        <td className='no-indent'>
            <button onClick={removeFromCart}className='trash-btn'><Trash /></button>
        </td>
        <td className='no-indent'><img className='cart-item-img' src={imageSrc} /></td>
        <td className='no-indent'>{itemName}</td>
        <td data-label="Price">${priceCents.toFixed(2)}</td>
        <td data-label="Quantity">
            <div className="quantity-selector">
                <button onClick={DecrementQ} className="cart-qty-btn"><ChevronLeft /></button>
                <p>{quantity}</p>
                <button onClick={IncrementQ} className={incrementBtnClass}><ChevronRight /></button>
            </div>
        </td>
        <td data-label="Subtotal">${(priceCents * quantity).toFixed(2)}</td>
    </tr>
}