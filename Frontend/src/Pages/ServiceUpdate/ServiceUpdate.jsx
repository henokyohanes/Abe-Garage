import React from "react";
import styles from "./ServiceUpdate.module.css";


const ServiceUpdate = () => {

    return (
        
            <div className={styles.form}>
                <input
                    type="text"
                    name="service_name"
                    placeholder="Service Name"
                    // value={newservice.service_name}
                    // onChange={handleInputChange}
                />
                <textarea
                    name="service_description"
                    placeholder="Service Description"
                    // value={newservice.service_description}
                    // onChange={handleInputChange}
                />
                <button className={styles.addButton}>
                    Add Service
                </button>
            </div>
    );
};

export default ServiceUpdate;
