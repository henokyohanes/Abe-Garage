import React from "react";
import { Link, useLocation } from "react-router-dom";
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
    const { isLogged, setIsLogged, user, isAdmin, isManager, isEmployee } =
        useAuth();

    // Get the current location
    const location = useLocation();
    const currentPath = location.pathname;

    const navLinks = [
        { path: "/", label: "Home" },
        { path: "/about-us", label: "About Us" },
        { path: "/abe-services", label: "Services" },
        { path: "/contact-us", label: "Contact Us" },
    ];

    // all the pages where dashboard shouldn't appear
    const dashboardHiddenPaths = [
        "/dashboard",
        "/account",
        "/orders",
        "/my-tasks",
        "/new-order",
        "/add-employee",
        "/employees",
        "/add-customer",
        "/customers",
        "/my-appointments",
        "/my-vehicles",
        "/my-orders",
        "/my-notifications",
        "/services",
    ];

    // Add the dashboard link if the current path is not in the hidden paths
    if (isLogged && !dashboardHiddenPaths.includes(currentPath)) {
        navLinks.splice(1, 0, { path: "/dashboard", label: "Dashboard" });
    }

    // Log out event handler function
    const logOut = async () => {
        try {
            await loginservice.logOut();
            localStorage.removeItem("appointmentFormData");
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
        if (isEmployee) return "Technician";
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
                            Welcome:{" "}
                            <strong>
                                {user?.employee_first_name || user?.customer_first_name}
                            </strong>
                        </div>
                    ) : (
                        <div className={Style.contactInfo}>
                            Call: <strong>1800 456 7890</strong>
                        </div>
                    )}
                </div>
            </div>
            <div className={Style.mainHeader}>
                {/* <NavDropdown title={<FaBars size={35} />} className="d-md-none">
                    <NavDropdown.Item as={Link} to="/dashboard">Dashboard</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/">Home</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/about-us">About Us</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/abe-services">Services</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/contact-us">Contact Us</NavDropdown.Item>
                </NavDropdown> */}
                <NavDropdown title={<FaBars size={35} />} className="d-md-none">
                    {navLinks
                        .filter((link) => link.path !== currentPath)
                        .map((link) => (
                            <NavDropdown.Item key={link.path} as={Link} to={link.path}>
                                {link.label}
                            </NavDropdown.Item>
                        ))}
                </NavDropdown>

                <Link to="/">
                    <img src={logo} alt="ABE Garage Logo" loading="lazy" />
                </Link>
                <div className={Style.navMenu}>
                    {/* <ul className="d-none d-md-flex">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/about-us">About Us</Link></li>
                        <li><Link to="/abe-services">Services</Link></li>
                        <li><Link to="/contact-us">Contact Us</Link></li>
                    </ul> */}
                    <ul className="d-none d-md-flex">
                        {navLinks
                            .filter((link) => link.path !== currentPath)
                            .map((link) => (
                                <li key={link.path}>
                                    <Link to={link.path}>{link.label}</Link>
                                </li>
                            ))}
                    </ul>

                    <div>
                        {isLogged ? (
                            <NavDropdown
                                title={
                                    <div className={Style.profileImgWrapper}>
                                        <div className={Style.profileImgContainer}>
                                            {user.employee_profile_picture ||
                                                user.customer_profile_picture ? (
                                                <img
                                                    src={`${axiosImageURL}${user.employee_profile_picture ||
                                                        user.customer_profile_picture
                                                        }`}
                                                    className={Style.profileImg}
                                                    alt="Profile Image"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <RiAccountCircleFill
                                                    className={Style.profileImgCircle}
                                                />
                                            )}
                                        </div>
                                        <div className={Style.profileArrow}>
                                            <FaChevronDown className={Style.arrowIcon} />
                                        </div>
                                    </div>
                                }
                            >
                                {/* <NavDropdown.Item as={Link} to="/dashboard">
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
                                </NavDropdown.Item> */}
                                <NavDropdown.Item onClick={logOut}>
                                    <span className={Style.icon}>
                                        <FaSignOutAlt />
                                    </span>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <Link to="/auth" className={Style.signInButton}>
                                Register | Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;