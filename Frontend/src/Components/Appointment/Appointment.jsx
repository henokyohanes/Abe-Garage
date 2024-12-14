import React from 'react'
import style from "./Appointment.module.css"

const Appointment = () => {

    return (
        <section className={style.appointmentSection}>
            <div className={`${style.appointment} row align-items-center justify-content-between g-0`}>
                <h2 className="col-12 col-xl-6">Schedule Your Appointment Today</h2>
                <h2 className="col-12 col-xl-4">Call Us: 1-800-456-7890</h2>
                <h3 className="col-12 col-xl-2">Contact Us __</h3>
            </div>
        </section>
    )
}

export default Appointment;
