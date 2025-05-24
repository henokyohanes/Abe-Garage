const upload = require("../ProfileImages/imageUploader");
const imageService = require("../services/image.service");

// Controller to handle profile image upload request
const profileImage = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "Maximum allowed size is 2MB" });
      }
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
// console.log(req);
    const employee_email = req.body.employee_email;
    const customer_email = req.body.customer_email;
    console.log("for image", employee_email, customer_email);
    const imagePath = `/images/${req.file.filename}`;

    try {
      
      const result = await imageService.handleProfileImageUpdate(
        employee_email, customer_email,
        imagePath
      );
      return res.status(200).json(result);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Database or file system error", error });
    }
  });
};

module.exports = { profileImage };