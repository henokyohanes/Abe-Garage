import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import loginService from "../../services/login.service";
import logo from "../../assets/images/logo.png";
import Style from "./Header.module.css";

const Header = (props) => {

    // Access the authentication context
    const { isLogged, setIsLogged, employee } = useAuth();

    // Log out event handler function
    const logOut = () => {
        // Call the logout function from the login service
        loginService.logOut();
        // Set the isLogged state to false
        setIsLogged(false);
    };

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
                <div className="right-column">
                    {isLogged ? (
                        <div className="link-btn">
                            <div className="phone-number"><strong>Welcome {employee?.employee_first_name}</strong></div>
                        </div>
                    ) : (
                        <p className={Style.contactInfo}>Call Abe:<span className={Style.phone}> 1800 456 7890</span></p>
                    )}
                </div>

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
                    <div>{isLogged ? (
                        <Link to="/" className={Style.signInButton} onClick={logOut} >Log out</Link>
                    ) : (
                        <Link to="/login" className={Style.signInButton}>Sign In</Link>
                    )}</div>

                </nav>
            </div>
        </header>
    );
}

export default Header;
