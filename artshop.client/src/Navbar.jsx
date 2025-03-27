import React from 'react';
import './Navbar.css';
import { Instagram, Twitter, ShoppingCart} from "lucide-react"
export default function Navbar() {
  return <nav className="nav">
    <div className="navbar-left">
      <ul>
        <li>
          <a href = ""> <Instagram /></a>
        </li>
        <li>
          <a href = ""> <Twitter /></a>
        </li>
        <li>
          <a href = "">DA</a>
        </li>
      </ul>
    </div>
    <div className="navbar-center">
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/shop">Shop</a>
        </li>
        <li>
          <a href="/about">About/FAQ</a>
        </li>
        <li>
          <a href="/portfolio">Portfolio</a>
        </li>
      </ul>
    </div>
    <div className="navbar-right">
      <ul>
        <li>
          <a href = "/cart"><ShoppingCart /></a>
        </li>
      </ul>
    </div>
  </nav>
}