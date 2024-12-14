import React from 'react'
import style from "./Banner.module.css"

const Banner = () => {

  return (
    <section className={style.banner}>
      <p>Working since 2000 <span>______</span></p>
      <h1>Tuneup Your Car to Next Level</h1>
      <div className={style.bannerButtons}>
        <i className="fab fa-youtube"></i>
        <p>Watch Intro Video<br />about us</p>
      </div>
    </section>
  )
}

export default Banner;
