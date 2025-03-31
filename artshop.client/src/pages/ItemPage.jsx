import React from "react"
import './ItemPage.css'
import testImg from "./assets/bigfoot.jpg"

export default function ItemPage() {
    return (
        <div className = "item">
            <img src= {testImg} />
            <h1>Product Name</h1>
            <h2>$10.00</h2>
        </div>
    )
}