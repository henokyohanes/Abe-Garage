import React from "react";
import style from "./Home.module.css";
import Layout from "../../Layout/Layout";

const Home = () => {
    return (
        <Layout>
            <div className={style.container}>
                {/* Main Banner Section */}
                <section className={style.banner}>
                    <p>Working since 2000 <span>______</span></p>
                    <h1>Tuneup Your Car to Next Level</h1>
                    <div className={style.bannerButtons}>
                        <i className="fab fa-youtube"></i>
                        <p>Watch Intro Video<br />about us</p>
                    </div>
                </section>

                {/* Experience Section */}
                <section className={style.experience}>
                        {/* <img className="" src={image} alt="Left" /> */}
                    <div>
                        <h2>We have 24 years of experience</h2>
                        <p>
                            At <strong>ABE GARAGE</strong>, our skilled technicians have provided top-quality repairs, maintenance, and customer service, building lasting relationships with drivers.From routine oil changes to complex engine diagnostics, we’ve consistently stayed ahead of industry advancements to ensure your vehicle performs at its best. Our commitment to excellence, honesty, and reliability has earned us the trust of countless customers throughout our 24-year journe. Visit us today, and let us keep you safely on the road for years to come.
                        </p>
                        <button className={style.aboutButton}>About Us ____</button>
                    </div>
                </section>

                        {/* Services Section */}
                        {/* <section className={style.services}>
                <h2>Our Services</h2>
                <div className={style.servicesGrid}>
                    {[
                        { icon: "🔧", title: "Performance Upgrade" },
                        { icon: "⚙️", title: "Transmission Services" },
                        { icon: "🔋", title: "Engine Repair" },
                        { icon: "🛠️", title: "Tire & Wheels" },
                    ].map((service, index) => (
                        <div key={index} className={style.serviceCard}>
                            <div className={style.serviceIcon}>{service.icon}</div>
                            <h3>{service.title}</h3>
                            <a href="#" className={style.readMore}>
                                Read More
                            </a>
                        </div>
                    ))}
                </div>
            </section> */}

                        {/* Quality Service Section */}
                        {/* <section className={style.qualityService}>
                <h2>Quality Service and Customer Satisfaction</h2>
                <p>
                    We prioritize delivering top-notch services to ensure your car's
                    optimal performance and your satisfaction.
                </p>
            </section> */}

                        {/* Why Choose Us Section */}
                        {/* <section className={style.whyChooseUs}>
                <h2>Why Choose Us?</h2>
                <ul>
                    {[
                        "Certified Expert Mechanics",
                        "Fast and Quality Service",
                        "Best Prices in Town",
                        "Awarded Workshop",
                    ].map((benefit, index) => (
                        <li key={index} className={style.benefit}>
                            {benefit}
                        </li>
                    ))}
                </ul>
            </section> */}

                        {/* Additional Services Section */}
                        {/* <section className={style.additionalServices}>
                <h2>Additional Services</h2>
                <div className={style.additionalGrid}>
                    {["Service 1", "Service 2", "Service 3", "Service 4"].map(
                        (service, index) => (
                            <div key={index} className={style.additionalCard}>
                                <img src={`/path-to-service${index + 1}.jpg`} alt={service} />
                                <p>{service}</p>
                            </div>
                        )
                    )}
                </div>
            </section> */}

                        {/* Call to Action Section */}
                        {/* <section className={style.callToAction}>
                <h2>Schedule Your Appointment Today</h2>
                <p>Call us at 1-800-456-7890</p>
                <button className={style.ctaButton}>Book Now</button>
            </section>  */}
                    </div>
                </Layout>
                );
};

export default Home;
