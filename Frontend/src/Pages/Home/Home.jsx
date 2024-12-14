import React from "react";
import Layout from "../../Layout/Layout";
import engine from "../../assets/images/image1.jpg";
import dashboard from "../../assets/images/dashboard.jpg";
import additional from "../../assets/images/additional.jpg";
import style from "./Home.module.css";

const Home = () => {
    return (
        <Layout>
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
            <section className={`${style.experience} row justify-content-center g-0`}>
                <img className="d-none d-lg-block m-2 col-lg-3" src={engine} alt="Left" />
                <div className="m-2 col-11 col-lg-8 col-xl-7">
                    <h2>We have 24 years of experience</h2>
                    <p>
                        At <strong>ABE GARAGE</strong>, our skilled technicians have provided top-quality repairs, maintenance, and customer service.From routine oil changes to complex engine diagnostics, we’ve consistently stayed ahead of industry advancements to ensure your vehicle performs at its best. Our commitment to excellence, honesty, and reliability has earned us the trust of countless customers throughout our 24-year journe. <strong>Visit us today</strong>, and let us keep you safely on the road for years to come.
                    </p>
                    <button className={style.aboutButton}>About Us ____</button>
                    <span className="d-none d-xxl-block">Fast, Reliable, and Always Road-Ready for Your Journey.</span>
                </div>
            </section>

            {/* Services Section */}
            <section className={style.services}>
                <h2>Our Services <span>____</span></h2>
                <p>From routine checkups to complex repairs, we’re committed to delivering efficient solutions that ensure your car runs smoothly and safely for years to come.
                </p>
                <div className="row g-4">
                    {[
                        { icon: "🚀", title: "Performance Upgrade" },
                        { icon: "⚙️", title: "Transmission Services" },
                        { icon: "🚗💨", title: "Break Repair & Service" },
                        { icon: "🛠️", title: "Engine Service & Repair" },
                        { icon: "🛞", title: "Tire & Wheels" },
                        { icon: "🎨", title: "Denting & Painting" },
                    ].map((service, index) => (
                        <div className="col-md-6 col-xl-4">
                            <div key={index} className={`${style.serviceCard} `}>
                                <p>Service and Repairs</p>
                                <h3>{service.title}</h3>
                                <div className={style.serviceIcon}>{service.icon}</div>
                                <a href="#" className={style.readMore}>
                                    Read More
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quality Service Section */}
            <section className={`${style.qualityService} row g-0`}>
                <div className="col-12 p-3 p-xl-5 col-md-8 col-lg-7 col-xxl-6">
                    <h2>Quality Service and Customer Satisfaction</h2>
                    <p>
                        At our auto repair shop, we prioritize quality service and customer satisfaction above all else. Our experienced technicians ensure every repair and maintenance task is completed with precision and care. We’re dedicated to keeping your vehicle running at its best while providing a hassle-free and friendly experience you can trust.
                    </p>
                </div>
                <img className="d-none d-md-block col-4 col-lg-5 col-xxl-6" src={dashboard} alt="Quality Service" />
            </section>

            {/* Why Choose Us Section */}
            <section className="row g-0 p-3">
                <div className={`${style.whyChooseUs} col-12 col-md-6 col-lg-4`}>
                    <h2>Why Choose Us <span>____</span></h2>
                    <ul>
                        {[
                            { icon: "🛠️", title: "Certified Expert Mechanics" },
                            { icon: "🏅", title: "Fast and Quality Service" },
                            { icon: "💲", title: "Best Prices in Town" },
                            { icon: "📅", title: "convenient Appointments" },
                            { icon: "🏆", title: "Awarded Workshop" },
                        ].map((benefit, index) => (
                            <li key={index} className={style.benefit}>
                                {benefit.icon} {benefit.title}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Additional Services Section */}
                <div className={`${style.additionalServices} col-12 col-md-6 col-lg-8`}>
                    <h2>Additional Services <span>____</span></h2>
                    <div className="row g-0">
                        <img className="d-none d-lg-block col-lg-5 col-xl-5 col-xxl-4" src={additional} alt="Additional Service" />
                        <ul className="col-lg-7 col-xl-6 col-xxl-5">
                            <li>General Auto Repair & Maintenance</li>
                            <li>Transmission Repair & Replacement</li>
                            <li>Tire Repair and Replacement</li>
                            <li>State Emissions Inspection</li>
                            <li>Brake Job / Brake Services</li>
                            <li>Electrical Diagnostics</li>
                            <li>Fuel System Repairs</li>
                            <li>Starting and Charging Repair</li>
                            <li>Steering and Suspension Work</li>
                            <li>Emission Repair Facility</li>
                            <li>Wheel Alignment</li>
                            <li>Computer Diagnostic Testing</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className={style.testimonials}>
                <p>Working since 2000 <span>______</span></p>
                <h1>We are Leader in Car Mechanical Work</h1>
                <div className={style.testimonialsButtons}>
                    <i className="fab fa-youtube"></i>
                    <p>Watch Intro Video<br />about us</p>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className={style.appointmentSection}>
                <div className={`${style.appointment} row align-items-center justify-content-between g-0`}>
                    <h2 className="col-12 col-xl-6">Schedule Your Appointment Today</h2>
                    <h2 className="col-12 col-xl-4">Call Us: 1-800-456-7890</h2>
                    <h3 className="col-12 col-xl-2">Contact Us __</h3>
                </div>
            </section>
        </Layout>
    );
};

export default Home;
