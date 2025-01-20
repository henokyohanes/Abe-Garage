import React from 'react'
import { Link } from 'react-router-dom'
import style from "./Banner.module.css"

const Banner = () => {

  return (
    <div className={style.banner}>
      <p>
        Working since 2000 <span>______</span>
      </p>
      <h1>Tuneup Your Car to Next Level</h1>
      <div className={style.bannerButtons}>
        <Link to="https://www.youtube.com/watch?v=CZ3U5oHLyl8" target="_blank"><i className="fab fa-youtube"/></Link>
        
        <p>
          Watch Intro Video
          <br />
          about us
        </p>
      </div>
    </div>
  );
}

export default Banner;
