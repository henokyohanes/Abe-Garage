import React from "react";
import Layout from "../../Layout/Layout";
import Experience from "../../Components/Experience/Experience";
import NavBanner from "../../Components/NavBanner/NavBanner";
import Skill from "../../Components/Skill/Skill";
import ChooseUs from "../../Components/ChooseUs/ChooseUs";
import Testimonial from "../../Components/Testimonial/Testimonial";
import Appointment from "../../Components/Appointment/Appointment"; 

const AboutUs = () => {

    return (
        <Layout>
    <NavBanner title="About Us" />
    <Skill />
            <Experience />
            <ChooseUs />
            <Testimonial />
            <Appointment />
        </Layout>
    );
};

export default AboutUs;
