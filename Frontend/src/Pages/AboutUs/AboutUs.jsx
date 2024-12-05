import React from "react";
import styles from "./AboutUs.module.css";
import Layout from "../../Layout/Layout";

const AboutUs = () => {
    return (
        <Layout>
            {/* Main Banner Section */}
            <section className={styles.mainBanner}>
                <div className={styles.bannerContent}>
                    <h1>About Us</h1>
                    <nav className={styles.nav}>
                        <span>Home</span> - <span>About Us</span>
                    </nav>
                </div>
            </section>

            {/* Introduction Section */}
            <section className={styles.introduction}>
                <div className={styles.textBlock}>
                    <h2>We are highly skilled mechanics for your car repair</h2>
                    <p>
                        Your car is in safe hands with us. We provide the best repair
                        services for all types of vehicles.
                    </p>
                </div>
                <div className={styles.image}>
                    <img src="path/to/your/image.jpg" alt="Car repair" />
                </div>
            </section>

            {/* Experience Section */}
            <section className={styles.experience}>
                <div className={styles.experienceImages}>
                    <img src="path/to/your/left-image.jpg" alt="Experience Left" />
                    <img src="path/to/your/right-image.jpg" alt="Experience Right" />
                </div>
                <div className={styles.experienceText}>
                    <h2>We have 24 years of experience</h2>
                    <p>
                        We have been providing excellent car mechanical services for over
                        two decades. Our team of skilled mechanics ensures top-notch
                        service.
                    </p>
                    <button>Learn More</button>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className={styles.whyChooseUs}>
                <ul>
                    <li>
                        <i className={styles.icon}></i> Certified Expert Mechanics
                    </li>
                    <li>
                        <i className={styles.icon}></i> Fast and Quality Service
                    </li>
                    <li>
                        <i className={styles.icon}></i> Best Prices in Town
                    </li>
                    <li>
                        <i className={styles.icon}></i> Awarded Workshop
                    </li>
                </ul>
            </section>

            {/* Additional Services Section */}
            <section className={styles.additionalServices}>
                <ul>
                    <li>
                        <i className={styles.checkmarkIcon}></i> General Auto Repair &
                        Maintenance
                    </li>
                    <li>
                        <i className={styles.checkmarkIcon}></i> Transmission Repair &
                        Replacement
                    </li>
                    <li>
                        <i className={styles.checkmarkIcon}></i> Tire Repair and Replacement
                    </li>
                    <li>
                        <i className={styles.checkmarkIcon}></i> Engine Diagnostics
                    </li>
                </ul>
            </section>

            {/* Call to Action Section */}
            <section className={styles.cta}>
                <h2>We are leaders in Car Mechanical Work</h2>
                <button>Schedule Your Appointment Today</button>
                <p>Call: 1800.456.7890</p>
            </section>
        </Layout>
    );
};

export default AboutUs;
