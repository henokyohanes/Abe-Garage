import React from 'react'
import style from "./OurService.module.css"

const OurService = () => {

    return (
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
                    <div key={index} className="col-md-6 col-xl-4">
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
    )
}

export default OurService
