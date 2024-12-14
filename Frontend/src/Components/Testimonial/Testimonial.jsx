import React from 'react'
import style from "./Testimonial.module.css"

const Testimonial = () => {

    return (
        <section className={style.testimonials}>
            <p>Working since 2000 <span>______</span></p>
            <h1>We are Leader in Car Mechanical Work</h1>
            <div className={style.testimonialsButtons}>
                <i className="fab fa-youtube"></i>
                <p>Watch Intro Video<br />about us</p>
            </div>
        </section>
    )
}

export default Testimonial;
