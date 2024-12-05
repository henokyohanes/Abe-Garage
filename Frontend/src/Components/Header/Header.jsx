import React from "react";
import logo from "../../assets/images/logo.png";
import Style from "./Header.module.css";

const Header = () => {

    return (
        <header className={Style.header}>
            <div className={Style.topBar}>
                <p>
                    <span className={Style.tagline}>
                        Enjoy the Beso while we fix your car
                    </span>
                    <span className={Style.workingHours}>
                        Monday - Saturday 7:00AM - 6:00PM
                    </span>
                </p>

                <p className={Style.contactInfo}>Call Abe:<span className={Style.phone}> 1800 456 7890</span></p>
            </div>
            <div className={Style.mainHeader}>
                <div className={Style.logo}>
                    <img src={logo} alt="ABE Garage Logo" />
                </div>
                <nav className={Style.navMenu}>
                    <ul>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>
                            <a href="/about-us">About Us</a>
                        </li>
                        <li>
                            <a href="/services">Services</a>
                        </li>
                        <li>
                            <a href="/contact-us">Contact Us</a>
                        </li>
                    </ul>
                <button className={Style.signInButton}>Sign In</button>
                </nav>
            </div>
        </header>
    );
}

export default Header;
