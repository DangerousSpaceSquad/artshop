import { useState } from "react"
import './ItemPage.css'
import testImg from "../assets/bigfoot.jpg"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ItemPage() {
    const [quantity, setQuantity] = useState(1)
    // eslint-disable-next-line
    const [curSKU, setSKU] = useState(1)
    const skuBtnList = document.querySelectorAll('.sku-btn');

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

    skuBtnList.forEach(btnEl => {
        btnEl.addEventListener('click', () => {
            document.querySelector('.selected-sku')?.classList.remove('selected-sku');
            btnEl.classList.add('selected-sku');
        });
    });


    return (
        <div className="item">
            <img src={testImg} className="product-image" />
            <div className = "product-info">
                <h1>Product Name</h1>
                <h2>$10.00</h2>
                <h3>Size: </h3>
                <div className="sku-selector">
                    <button onClick={() => setSKU(0)} className = "sku-btn">8x12 inch</button>
                    <button onClick={() => setSKU(1)} className = "sku-btn selected-sku">12x18 inch</button>
                </div>
                <h3>Quantity: </h3>
                <div className="quantity-selector">
                    <button onClick={DecrementQ} className = "qty-btn" style={{left: 0}}><ChevronLeft /></button>
                    <p>{quantity}</p>
                    <button onClick={IncrementQ} className = "qty-btn" style={{right: 0}}><ChevronRight /></button>
                </div>
                <button className = "cart-add-btn" >Add to cart</button>
                <div>
                    <h2>Description:</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut porta, nulla eu tincidunt tempus, 
                        massa orci gravida nibh, quis posuere diam quam eget leo. Vestibulum eget placerat diam. 
                        Etiam in condimentum quam, eget blandit neque. Aliquam egestas nulla commodo, pretium massa 
                        vel, feugiat massa. Cras tincidunt, lectus ac ultricies suscipit, metus augue vestibulum eros, 
                        eget molestie mauris sem id magna. Nunc fringilla eros in pulvinar lobortis. Nullam et molestie 
                        lorem. Nulla eu felis et tortor venenatis tempor porta non nisl. Fusce mollis quam et arcu aliquam 
                        ultricies. Aenean non pretium erat. Quisque at augue et lorem convallis bibendum. Phasellus 
                        faucibus vitae augue vel volutpat. Vestibulum neque elit, rutrum ut facilisis eu, dapibus nec augue. 
                        Aenean gravida, elit vel aliquam lacinia, elit sem efficitur lacus, placerat mattis sem sem eu arcu. 
                        Praesent sit amet quam vel quam tincidunt volutpat. Phasellus porttitor, lacus vitae semper 
                        condimentum, neque enim imperdiet libero, consectetur semper nisl urna at tortor. </p>
                </div>
            </div>
        </div>
    )
}