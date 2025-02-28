import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <div className={styles.footer}>
            {/* Footer Top Section */}
            <div className={`${styles.contactDetails} row`}>
                <div className="col-md-4 col-12">
                    <i className="fas fa-map-marker-alt"></i>
                    <p>1234 Tailstoi Street<br />Houston, TX 12345</p>
                </div>
                <div className="col-md-4 col-12">
                    <i className="fas fa-envelope"></i>
                    <p>Email us:<br /><a href="mailto:henokyohanes8@gmail.com">contact@abe.com</a></p>
                </div>
                <div className="col-md-4 col-12">
                    <i className="fas fa-phone"></i>
                    <p>Call us: <br /><a href="tel:+18325160930">+1 800 456 7890</a></p>
                </div>
            </div>
            {/* Footer Bottom Section */}
            <div className={`${styles.footerBottom} row`}>
                <p className="d-none d-lg-block col-lg-4">
                    we offer expert auto repair, maintenance, and customization services for all vehicles.<br />
                    <strong>Your ride, our pride!</strong>
                </p>
                <div className="col-5 col-md-3 col-lg-2">
                    <h4>Useful Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about-us">About Us</Link></li>
                        <li><Link to="/contact-us">Appointment</Link></li>
                        <li><Link to="/">Testimonials</Link></li>
                        <li><Link to="/contact-us">Contact Us</Link></li>
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
                        <Link to="https://www.facebook.com/nani.love.16100" target="_blank" aria-label="Facebook">
                            <i className="fab fa-facebook-f"></i>
                        </Link>
                        <Link to="https://x.com/Henokyohanes2" target="_blank" aria-label="Twitter">
                            <i className="fab fa-x-twitter"></i>
                        </Link>
                        <Link to="https://www.instagram.com/henok3303" target="_blank" aria-label="Instagram">
                            <i className="fab fa-instagram"></i>
                        </Link>
                        <Link to="/" aria-label="Google">
                            <i className="fab fa-google"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
