const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

//image controller
const { profileImage } = require("../controllers/image.controller");

//image route
router.post("/api/update-profile-image", [authMiddleware.verifyToken], profileImage);

module.exports = router;