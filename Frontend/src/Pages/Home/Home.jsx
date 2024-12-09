import React from "react";
import image from "../../assets/images/image.jpg";
import styles from "./Home.module.css";
import Layout from "../../Layout/Layout";

const Home = () => {
    return (
        <Layout>
        <div className={styles.container}>
            {/* Main Banner Section */}
            <section className={styles.banner}>
                <p>Working since 1999 <span>______</span></p>
                <h1>Tuneup Your Car to Next Level</h1>
                <div className={styles.bannerButtons}>
                    <i className="fab fa-youtube"></i>
                    <p>Watch Intro Video<br/>about us</p>
                </div>
            </section>

            {/* Experience Section */}
            {/* <section className={styles.experience}>
                <div className={styles.experienceImages}>
                    <img src={image} alt="Left" />
                    <img src="/path-to-right-image.jpg" alt="Right" /> 
                </div>
                <div className={styles.experienceContent}>
                    <h2>We have 24 years of experience</h2>
                    <p>
                        Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User-generated content in real-time will have multiple touchpoints for offshoring.Capitalize on low-hanging fruit to identify a ballpark value-added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway will close the loop on focusing.

                    </p>
                    <button className={styles.aboutButton}>About Us</button>
                </div>
            </section> */}

            {/* Services Section */}
            {/* <section className={styles.services}>
                <h2>Our Services</h2>
                <div className={styles.servicesGrid}>
                    {[
                        { icon: "🔧", title: "Performance Upgrade" },
                        { icon: "⚙️", title: "Transmission Services" },
                        { icon: "🔋", title: "Engine Repair" },
                        { icon: "🛠️", title: "Tire & Wheels" },
                    ].map((service, index) => (
                        <div key={index} className={styles.serviceCard}>
                            <div className={styles.serviceIcon}>{service.icon}</div>
                            <h3>{service.title}</h3>
                            <a href="#" className={styles.readMore}>
                                Read More
                            </a>
                        </div>
                    ))}
                </div>
            </section> */}

            {/* Quality Service Section */}
            {/* <section className={styles.qualityService}>
                <h2>Quality Service and Customer Satisfaction</h2>
                <p>
                    We prioritize delivering top-notch services to ensure your car's
                    optimal performance and your satisfaction.
                </p>
            </section> */}

            {/* Why Choose Us Section */}
            {/* <section className={styles.whyChooseUs}>
                <h2>Why Choose Us?</h2>
                <ul>
                    {[
                        "Certified Expert Mechanics",
                        "Fast and Quality Service",
                        "Best Prices in Town",
                        "Awarded Workshop",
                    ].map((benefit, index) => (
                        <li key={index} className={styles.benefit}>
                            {benefit}
                        </li>
                    ))}
                </ul>
            </section> */}

            {/* Additional Services Section */}
            {/* <section className={styles.additionalServices}>
                <h2>Additional Services</h2>
                <div className={styles.additionalGrid}>
                    {["Service 1", "Service 2", "Service 3", "Service 4"].map(
                        (service, index) => (
                            <div key={index} className={styles.additionalCard}>
                                <img src={`/path-to-service${index + 1}.jpg`} alt={service} />
                                <p>{service}</p>
                            </div>
                        )
                    )}
                </div>
            </section> */}

            {/* Call to Action Section */}
            {/* <section className={styles.callToAction}>
                <h2>Schedule Your Appointment Today</h2>
                <p>Call us at 1-800-456-7890</p>
                <button className={styles.ctaButton}>Book Now</button>
            </section>  */}
        </div>
        </Layout>
    );
};

export default Home;
