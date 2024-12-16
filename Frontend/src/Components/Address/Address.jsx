import React from 'react'
import styles from "./Address.module.css"

const Address = () => {

    return (
        <section className={`${styles.infoSection} row g-0`}>
            <div className={`${styles.map} col-11`}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509796!2d-122.419415284681!3d37.77492977975924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064c9ed735b%3A0x37bd50cb0b951c2f!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1696326174949!5m2!1sen!2sus"
                    width="100%"
                    height="300"
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </div>
            <div className={styles.contactInfo}>
                <h2>Our Address</h2>
                <div className={styles.description}>
                    Completely synergize resource taxing relationships via premier niche
                    markets. Professionally cultivate one-to-one customer service.
                </div>
                <div>
                    <i className="fas fa-map-marker-alt"></i>
                    <p><strong>Address:</strong> <br /> 1234 Tailstoi Street, Houston, TX 12345</p>
                </div>
                <div>
                    <i className="fas fa-envelope"></i>
                    <p><strong>Email:</strong> <br /> contact@abe.com</p>
                </div>
                <div>
                    <i className="fas fa-phone"></i>
                    <p><strong>Phone:</strong> <br /> 1 800 456 7890 | 1 234 567 3054</p>
                </div>
            </div>
        </section>
    )
}

export default Address;
