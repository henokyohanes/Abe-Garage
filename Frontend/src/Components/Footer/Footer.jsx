import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            {/* Footer Top Section */}
            <div className={styles.contactDetails}>
                <div>
                    <i className="fas fa-map-marker-alt"></i>
                    <p>548, Tailstoi Town 5238 MT,<br />La city, IA 522364</p>
                </div>
                <div>
                    <i className="fas fa-envelope"></i>
                    <p>Email us:<br />
                        <a href="mailto:contact@autorex.com">contact@autorex.com</a></p>
                </div>
                <div>
                    <i className="fas fa-phone"></i>
                    <p>Call us: <br /><a href="tel:+18004567890">+1 800 456 7890</a></p>
                </div>
            </div>

            {/* Footer Bottom Section */}
            <div className={styles.footerBottom}>
                <div className={styles.column}>
                    Capitalize on low hanging fruit to identify a ballpark value added activity to beta test.
                    Override the digital divide additional clickthroughs.
                </div>
                <div className={styles.column}>
                    <h4>Useful Links</h4>
                    <ul>
                        <li>
                            <a href="/home">Home</a>
                        </li>
                        <li>
                            <a href="/about-us">About Us</a>
                        </li>
                        <li>
                            <a href="/appointment">Appointment</a>
                        </li>
                        <li>
                            <a href="/testimonials">Testimonials</a>
                        </li>
                        <li>
                            <a href="/contact-us">Contact Us</a>
                        </li>
                    </ul>
                </div>

                <div className={styles.column}>
                    <h4>Our Services</h4>
                    <ul>
                        <li>Performance Upgrade</li>
                        <li>Transmission Service</li>
                        <li>Brake Repair & Service</li>
                        <li>Engine Service & Repair</li>
                        <li>Tyre & Wheels</li>
                    </ul>
                </div>

                <div className={styles.column}>
                    <h4>Newsletter</h4>
                    <p>Get the latest updates and offers.</p>
                    <div className={styles.socialMedia}>
                        <a href="#">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="#">
                            <i className="fab fa-google"></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
