import React from "react";
import styles from "./ContactUs.module.css";
import Layout from "../../Layout/Layout";

const ContactUs = () => {
    return (
        <Layout>
            <div className={styles.contactUs}>
                {/* Banner Section */}
                <section className={styles.banner}>
                    <h1>Contact Us</h1>
                    <nav>
                        <span>Home</span> &gt; <span>About Us</span>
                    </nav>
                </section>

                {/* Map and Contact Info Section */}
                <section className={styles.infoSection}>
                    <div className={styles.map}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509796!2d-122.419415284681!3d37.77492977975924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064c9ed735b%3A0x37bd50cb0b951c2f!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1696326174949!5m2!1sen!2sus"
                            width="100%"
                            height="300"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                    <div className={styles.contactInfo}>
                        <h2>Our Address</h2>
                        <p>
                            Completely synergize resource taxing relationships via premier niche
                            markets. Professionally cultivate one-to-one customer service.
                        </p>
                        <p>
                            <strong>Address:</strong> 548, Tailstoi Town 5248 MT, La City, IA
                            5224
                        </p>
                        <p>
                            <strong>Email:</strong> contact@autorex.com
                        </p>
                        <p>
                            <strong>Phone:</strong> 1800 456 7890 | 1234 567 3054
                        </p>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className={styles.cta}>
                    <h2>Schedule Your Appointment Today</h2>
                    <p>Your Automotive Repair & Maintenance Service Specialist</p>
                    <div className={styles.ctaButtons}>
                        <span>1800.456.7890</span>
                        <button>Contact Us</button>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default ContactUs;
