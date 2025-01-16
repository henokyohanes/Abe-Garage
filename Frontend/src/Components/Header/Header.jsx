import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { NavDropdown } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import loginService from "../../services/login.service";
import logo from "../../assets/images/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import Style from "./Header.module.css";

const Header = (props) => {

    // Access the authentication context
    const { isLogged, setIsLogged, employee } = useAuth();

    // Log out event handler function
    const logOut = async () => {
        // Call the logout function from the login service
        await loginService.logOut();
        // Set the isLogged state to false
        setIsLogged(false);
    };

    return (
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
                    title={<FaBars size={30} />}
                    className="d-md-none"
                >
                    <NavDropdown.Item as={Link} to="/">Home</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/about-us">About Us</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/services">Services</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/contact-us">Contact Us</NavDropdown.Item>
                    {isLogged && (<NavDropdown.Item as={Link} to="/admin/dashboard">Admin</NavDropdown.Item>)}
                </NavDropdown>
                <img src={logo} alt="ABE Garage Logo"/>
                <div className={Style.navMenu}>
                    <ul className="d-none d-md-flex">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about-us">About Us</Link></li>
                        <li><Link to="/services">Services</Link></li>
                        <li><Link to="/contact-us">Contact Us</Link></li>
                        {isLogged && (<li><Link to="/admin/dashboard">Admin</Link></li>)}
                    </ul>
                    <div>
                        {isLogged ? (
                            <Link to="/" className={Style.signInButton} onClick={logOut}>Log out</Link>
                        ) : (
                            <Link to="/login" className={Style.signInButton}>Sign In</Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
