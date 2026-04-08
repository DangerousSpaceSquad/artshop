// import { useEffect, useState } from 'react';
import './App.css';
import Navbar from "./Navbar";
import Hamburger from "./Hamburger";

import footerLogo from "./assets/Logo2026Transparent.png"

import Home from "./pages/Home"
import Shop from "./pages/Shop"
import About from "./pages/About"
import Portfolio from "./pages/Portfolio"
import ItemPage from "./pages/ItemPage"



function App() {
    let component
    switch (window.location.pathname) {
        case "/":
            component = <Home />
            break
        case "/shop":
            component = <Shop />
            break
        case "/about":
            component = <About />
            break
        case "/portfolio":
            component = <Portfolio />
            break
        case "/itempage":
            component = <ItemPage />
            break
    }
    return (

        <div className="comp">
            <div className="banner-image"></div>
            <Navbar />
            <Hamburger />
            <div >{component}</div>
            <div className="footer">
                <img
                    src={footerLogo} className="footer-logo" />
                <p>Copyright 2025. All rights reserved.</p>
            </div>
        </div>
    )

}

export default App;