import React from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import style from "./Banner.module.css";
import { useAuth } from "../../Contexts/AuthContext";

const Banner = () => {
  const { isLogged, isCustomer } = useAuth();

  let targetLink = "/make-appointment";

  if (isLogged && isCustomer) {
    targetLink = "/make-appointment/vehicle";
  } else if (isLogged && !isCustomer) {
    targetLink = "/";
  }

  return (
    <div className={style.banner}>
      <p>
        Working since 2001 <span>______</span>
      </p>
      <h1>Tuneup Your Car to Next Level</h1>
      <div className={style.bannerButtons}>
        <a
          href="https://www.youtube.com/watch?v=CZ3U5oHLyl8"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-youtube" />
        </a>
        <p>
          Watch Intro Video
          <br />
          about us
        </p>
      </div>
      <Link to={targetLink} className={style.appointment}>
        Make an Appointment <FaChevronRight />
      </Link>
    </div>
  );
};

export default Banner;