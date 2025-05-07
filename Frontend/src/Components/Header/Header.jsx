import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { NavDropdown } from "react-bootstrap";
import { FaBars, FaChevronDown, FaUser, FaSignOutAlt } from "react-icons/fa";
import { RiAccountCircleFill } from "react-icons/ri";
import loginService from "../../services/login.service";
import logo from "../../assets/images/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import Style from "./Header.module.css";

// Profile Image component
// const ProfileImage = ({ user }) => {
//     return (
//         <div className={Style.profileImgWrapper}>
//             <div className={Style.profileImgContainer}>
//                 {user.profileimg ? (
//                     <img
//                         src={`${axiosImageURL}${user.profileimg}`}
//                         className={Style.profileImg}
//                         alt="Profile Image"
//                         loading="lazy"
//                     />
//                 ) : (
//                     <RiAccountCircleFill className={Style.profileImgCircle} />
//                 )}
//             </div>
//             <div className={Style.profileArrow}>
//                 <FontAwesomeIcon icon={faChevronDown} className={Style.arrowIcon} />
//             </div>
//         </div>
//     );
// };

const Header = () => {

    // Access the authentication context
    const { isLogged, setIsLogged, employee, isAdmin, isManager } = useAuth();

    // Log out event handler function
    const logOut = async () => {
        await loginService.logOut();
        setIsLogged(false);
    };

    // Function to get the role text
    const getRoleText = () => {
        if (isAdmin) return "Admin";
        if (isManager) return "Manager";
        return "Mechanic";
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
                            Welcome: <strong>{employee?.employee_first_name}</strong>
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
                    {isLogged && (
                        <NavDropdown.Item as={Link} to="/dashboard">{getRoleText()}</NavDropdown.Item>
                    )}
                    <NavDropdown.Item as={Link} to="/about-us">About Us</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/abe-services">Services</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/contact-us">Contact Us</NavDropdown.Item>
                </NavDropdown>
                <Link to="/"><img src={logo} alt="ABE Garage Logo" loading="lazy" /></Link>
                <div className={Style.navMenu}>
                    <ul className="d-none d-md-flex">
                        <li><Link to="/">Home</Link></li>
                        {isLogged && (
                            <li><Link to="/dashboard">{getRoleText()}</Link></li>
                        )}
                        <li><Link to="/about-us">About Us</Link></li>
                        <li><Link to="/abe-services">Services</Link></li>
                        <li><Link to="/contact-us">Contact Us</Link></li>
                    </ul>
                    <div>
                        {isLogged ? (
                            <NavDropdown
                                title={<div className={Style.profileImgWrapper}>
                                    <div className={Style.profileImgContainer}>
                                        {employee.profileimg ? (
                                            <img
                                                src={`${axiosImageURL}${user.profileimg}`}
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
                                <NavDropdown.Item as={Link} to="/Account">
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
                            <Link to="/Auth" className={Style.signInButton}>Register | Sign In</Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
