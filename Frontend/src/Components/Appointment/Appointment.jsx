import React from 'react'
import style from "./Appointment.module.css"

const Appointment = () => {

    return (
        <section className={style.appointmentSection}>
            <div className={`${style.appointment} row align-items-center justify-content-between g-0`}>
                <div className="col-12 col-lg-6">
                    <h2>Schedule Your Appointment Today</h2>
                    <p>Your Automotive Repair & Maintenance services specialist</p>
                </div>
                <h2 className="col-12 col-lg-4">Call Us: 1-800-456-7890</h2>
                <h3 className="col-12 col-lg-2">Contact Us <span>__</span></h3>
            </div>
        </section>
    )
}

export default Appointment;
