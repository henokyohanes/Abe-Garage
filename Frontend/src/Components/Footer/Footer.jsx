import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <div className={styles.footer}>
            {/* Footer Top Section */}
            <div className={`${styles.contactDetails} row`}>
                <div className="col-md-4 col-sm-12">
                    <i className="fas fa-map-marker-alt"></i>
                    <p>
                        1234 Tailstoi Street
                        <br />
                        Houston, TX 12345
                    </p>
                </div>
                <div className="col-md-4 col-sm-12">
                    <i className="fas fa-envelope"></i>
                    <p>
                        Email us:
                        <br />
                        <a href="mailto:contact@autorex.com">contact@abe.com</a>
                    </p>
                </div>
                <div className="col-md-4 col-sm-12">
                    <i className="fas fa-phone"></i>
                    <p>
                        Call us: <br />
                        <a href="tel:+18004567890">+1 800 456 7890</a>
                    </p>
                </div>
            </div>

            {/* Footer Bottom Section */}
            <div className={`${styles.footerBottom} row`}>
                <div className="d-none d-lg-block col-lg-4">
                    we offer expert auto repair, maintenance, and customization services for all vehicles.<br /><strong>Your ride, our pride!</strong>
                </div>
                <div className="col-5 col-md-3 col-lg-2">
                    <h4>Useful Links</h4>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/about-us">About Us</Link>
                        </li>
                        <li>
                            <Link to="/appointment">Appointment</Link>
                        </li>
                        <li>
                            <Link to="/testimonials">Testimonials</Link>
                        </li>
                        <li>
                            <Link to="/contact-us">Contact Us</Link>
                        </li>
                    </ul>
                </div>

                <div className="col-7 col-md-4 col-lg-3">
                    <h4>Our Services</h4>
                    <ul>
                        <li>Performance Upgrade</li>
                        <li>Transmission Service</li>
                        <li>Brake Repair & Service</li>
                        <li>Engine Service & Repair</li>
                        <li>Tyre & Wheels</li>
                    </ul>
                </div>

                <div className="col-sm-12 col-md-5 col-lg-3">
                    <h4>Newsletter</h4>
                    <p>Get the latest updates and offers.</p>
                    <div className={styles.socialMedia}>
                        <a href="#" aria-label="Facebook">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" aria-label="Twitter">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#" aria-label="Instagram">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="#" aria-label="Google">
                            <i className="fab fa-google"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
