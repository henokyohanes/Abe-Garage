import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { NavDropdown } from "react-bootstrap";
import { FaBars, FaChevronDown, FaUser, FaSignOutAlt, FaUserShield } from "react-icons/fa";
import { RiAccountCircleFill } from "react-icons/ri";
import loginservice, { axiosImageURL } from "../../services/login.service";
import logo from "../../assets/images/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import Style from "./Header.module.css";

const Header = () => {

    // Access the authentication context
    const { isLogged, setIsLogged, user, isAdmin, isManager, isEmployee } = useAuth();

    // Log out event handler function
    const logOut = async () => {
        try {
        await loginservice.logOut();
        setIsLogged(false);
        window.location.href = "/";
        } catch (error) {
        console.error("Error logging out:", error);
        }
    };

    // Function to get the role text
    const getRoleText = () => {
        if (isAdmin) return "Admin";
        if (isManager) return "Manager";
        if (isEmployee) return "Mechanic";
        return "User";
    };

    return (
        <header className={Style.header}>
            <div className={Style.topBar}>
                <div className={Style.leftTopBar}>
                    <div className={`${Style.tagline} d-none d-lg-block`}>
                        Enjoy the Beso while we fix your car
                    </div>
                    <div className={Style.workingHours}>
                        Monday - Saturday | 7:00AM - 6:00PM
                    </div>
                </div>
                <div>
                    {isLogged ? (
                        <div className={Style.contactInfo}>
                            Welcome: <strong>{user?.employee_first_name || user?.customer_first_name}</strong>
                        </div>
                    ) : (
                        <div className={Style.contactInfo}>
                            Call: <strong>1800 456 7890</strong>
                        </div>
                    )}
                </div>
            </div>
            <div className={Style.mainHeader}>
                <NavDropdown title={<FaBars size={35} />} className="d-md-none">
                    <NavDropdown.Item as={Link} to="/">Home</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/about-us">About Us</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/abe-services">Services</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/contact-us">Contact Us</NavDropdown.Item>
                </NavDropdown>
                <Link to="/"><img src={logo} alt="ABE Garage Logo" loading="lazy" /></Link>
                <div className={Style.navMenu}>
                    <ul className="d-none d-md-flex">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about-us">About Us</Link></li>
                        <li><Link to="/abe-services">Services</Link></li>
                        <li><Link to="/contact-us">Contact Us</Link></li>
                    </ul>
                    <div>
                        {isLogged ? (
                            <NavDropdown
                                title={<div className={Style.profileImgWrapper}>
                                    <div className={Style.profileImgContainer}>
                                        {user.employee_profile_picture || user.customer_profile_picture ? (
                                            <img
                                                src={`${axiosImageURL}${user.employee_profile_picture || user.customer_profile_picture}`}
                                                className={Style.profileImg}
                                                alt="Profile Image"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <RiAccountCircleFill className={Style.profileImgCircle} />
                                        )}
                                    </div>
                                    <div className={Style.profileArrow}>
                                        <FaChevronDown className={Style.arrowIcon} />
                                    </div>
                                </div>}
                            >
                                <NavDropdown.Item as={Link} to="/dashboard">
                                    <span className={Style.icon}>
                                        <FaUserShield />
                                    </span>
                                    {getRoleText()} Dashboard
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/account">
                                    <span className={Style.icon}>
                                        <FaUser />
                                    </span>
                                    Account Settings
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={logOut}>
                                    <span className={Style.icon}>
                                        <FaSignOutAlt />
                                    </span>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <Link to="/auth" className={Style.signInButton}>Register | Sign In</Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;