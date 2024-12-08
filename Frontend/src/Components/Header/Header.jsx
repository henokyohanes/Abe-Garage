import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import loginService from "../../services/login.service";
import logo from "../../assets/images/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import Style from "./Header.module.css";
import { FaBars } from "react-icons/fa";

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
        // <header className={Style.header}>
        //     <div className={Style.topBar}>
        //         <p>
        //             <span className={Style.tagline}>
        //                 Enjoy the Beso while we fix your car
        //             </span>
        //             <span className={Style.workingHours}>
        //                 Monday - Saturday | 7:00AM - 6:00PM
        //             </span>
        //         </p>
        //         <div>
        //             {isLogged ? (
        //                 <p className={Style.contactInfo}>Welcome: <strong>{employee?.employee_first_name}</strong></p>
        //             ) : (
        //                 <p className={Style.contactInfo}>Call Abe: <strong>1800 456 7890</strong></p>
        //             )}

        //         </div>

        //     </div>
        //     <div className={Style.mainHeader}>
        //         <div className={Style.logo}>
        //             <img src={logo} alt="ABE Garage Logo" />
        //         </div>
        //         <NavDropdown
        //             title="Browse"
        //             id="navbar-dropdown"
        //             className="custom-toggle"
        //         >
        //             <NavDropdown.Item>Home</NavDropdown.Item>
        //             <NavDropdown.Item>About Us</NavDropdown.Item>
        //             <NavDropdown.Item>Services</NavDropdown.Item>
        //             <NavDropdown.Item>Contact Us</NavDropdown.Item>
        //         </NavDropdown>
        //         <nav className={Style.navMenu}>
        //             <ul>
        //                 <li>
        //                     <a href="/">Home</a>
        //                 </li>
        //                 <li>
        //                     <a href="/about-us">About Us</a>
        //                 </li>
        //                 <li>
        //                     <a href="/services">Services</a>
        //                 </li>
        //                 <li>
        //                     <a href="/contact-us">Contact Us</a>
        //                 </li>
        //             </ul>
        //             <div>
        //                 {isLogged ? (
        //                     <Link to="/" className={Style.signInButton} onClick={logOut} >Log out</Link>
        //                 ) : (
        //                     <Link to="/login" className={Style.signInButton}>Sign In</Link>
        //                 )}

        //             </div>

        //         </nav>
        //     </div>
        // </header>








        <header className={Style.header}>
            <div className={Style.topBar}>
                <div className={Style.leftTopBar}>
                    <div className={`${Style.tagline} d-none d-md-block`}>
                        Enjoy the Beso while we fix your car
                    </div>
                    <div className={Style.workingHours}>
                        Monday - Saturday | 7:00AM - 6:00PM
                    </div>
                </div>
                <div>
                    {isLogged ? (
                        <div className={Style.contactInfo}>Welcome: <strong>{employee?.employee_first_name}</strong></div>
                    ) : (
                        <div className={Style.contactInfo}>Call Abe: <strong>1800 456 7890</strong></div>
                    )}

                </div>

            </div>
            <div className={Style.mainHeader}>
                <NavDropdown
                    title={<FaBars size={30}/>}
                    id="navbar-dropdown"
                    className={`${Style.browseButton} d-md-none`}
                    >
                    <NavDropdown.Item>Home</NavDropdown.Item>
                    <NavDropdown.Item>About Us</NavDropdown.Item>
                    <NavDropdown.Item>Services</NavDropdown.Item>
                    <NavDropdown.Item>Contact Us</NavDropdown.Item>
                </NavDropdown>
                    <img src={logo} alt="ABE Garage Logo" />
                <dir className={Style.navMenu}>
                    <ul className="d-none d-md-flex">
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
                    <div className={Style.signInButton}>
                        {isLogged ? (
                            <Link to="/" className={Style.signInButto} onClick={logOut} >Log out</Link>
                        ) : (
                            <Link to="/login" className={Style.signInButto}>Sign In</Link>
                        )}

                    </div>

                </dir>
            </div>
        </header>
    );
}

export default Header;
