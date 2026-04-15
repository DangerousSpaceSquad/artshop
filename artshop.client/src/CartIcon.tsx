import './CartIcon.css';
import {ShoppingCart} from "lucide-react"
import { useCookies } from 'react-cookie'

export default function Cart() {
    
    const [cookies] = useCookies(['cart']);
    let itemCount = 0;
    if (cookies.cart){
        itemCount = cookies.cart.length;
    }

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