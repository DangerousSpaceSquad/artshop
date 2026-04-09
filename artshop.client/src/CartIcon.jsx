import './CartIcon.css';
import {ShoppingCart} from "lucide-react"
import { useState } from "react"


export default function Cart() {

    const [itemCount] = useState(1)

    return(
        <div className="cart">
            <ShoppingCart className="cIcon">
              
            </ShoppingCart>
            <div className={itemCount == 0 ? "itemCountZero" : "itemCount"}>
                {itemCount}
              </div>
        </div>
        
    )
}