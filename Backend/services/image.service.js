const db = require("../config/db.config");
const fs = require("fs");
const path = require("path");

// Service to update profile image
const handleProfileImageUpdate = async (employee_email, newImagePath) => {

    // Fetch old image
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

module.exports = { handleProfileImageUpdate };