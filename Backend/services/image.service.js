const db = require("../config/db.config");
const fs = require("fs");
const path = require("path");

// Service to update profile image
const handleProfileImageUpdate = async (employee_email, customer_email, newImagePath) => {

    if (!employee_email && !customer_email) {
        return {
            message: "No email provided",
        };
    }

    // Fetch old image
    if (customer_email) {
        const [rows] = await db.query(
            "SELECT customer_profile_picture FROM customer_identifier WHERE customer_email = ?",
            [customer_email]
        );

        const oldImagePath = rows[0]?.customer_profile_picture;

        // Delete old image if exists and is not default
        if (
            oldImagePath &&
            oldImagePath !== "/images/default.png" &&
            fs.existsSync(path.join(__dirname, "..", oldImagePath))
        ) {
            fs.unlinkSync(path.join(__dirname, "..", oldImagePath));
        }

        // Update DB with new image
        await db.query("UPDATE customer_identifier SET customer_profile_picture = ? WHERE customer_email = ?", [
            newImagePath,
            customer_email,
        ]);

        return {
            message: "Image uploaded successfully",
            profileImage: newImagePath,
        };
    }

    // Fetch old image
    if (employee_email) {
    const [rows] = await db.query(
        "SELECT employee_profile_picture FROM employee WHERE employee_email = ?",
        [employee_email]
    );

    const oldImagePath = rows[0]?.employee_profile_picture;

    // Delete old image if exists and is not default
    if (
        oldImagePath &&
        oldImagePath !== "/images/default.png" &&
        fs.existsSync(path.join(__dirname, "..", oldImagePath))
    ) {
        fs.unlinkSync(path.join(__dirname, "..", oldImagePath));
    }

    // Update DB with new image
    await db.query("UPDATE employee SET employee_profile_picture = ? WHERE employee_email = ?", [
        newImagePath,
        employee_email,
    ]);

    return {
        message: "Image uploaded successfully",
        profileImage: newImagePath,
    };
};

};

module.exports = { handleProfileImageUpdate };