import './Cart.css'
import itemImg from "../assets/bigfoot.jpg"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Trash } from "lucide-react"

export default function Cart() {
    const [quantity, setQuantity] = useState(2)

    function IncrementQ() {
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
                <tr>
                    <td className='no-indent'><button className='trash-btn'><Trash /></button></td>
                    <td className='no-indent'><img className='cart-item-img' src={itemImg} /></td>
                    <td className='no-indent'>Test Item</td>
                    <td data-label="Price">$10.00</td>
                    <td data-label="Quantity">
                        <div className="quantity-selector">
                            <button onClick={DecrementQ} className="cart-qty-btn"><ChevronLeft /></button>
                            <p>{quantity}</p>
                            <button onClick={IncrementQ} className="cart-qty-btn"><ChevronRight /></button>
                        </div>
                    </td>
                    <td data-label="Subtotal">$20.00</td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td />
                    <td />
                    <td />
                    <td />
                    <td>Estimated total:</td>
                    <td>$40.00</td>
                </tr>
            </tbody>
        </table>
        <div className='checkout-container'>
            <h3>Taxes, discounts, and shipping calculated at checkout</h3>
            <button className='checkout-button'>Check out</button>
        </div>

    </div>
}