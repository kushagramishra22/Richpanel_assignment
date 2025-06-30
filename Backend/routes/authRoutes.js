// API routes for user authentication
const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

module.exports = router;
// This code defines API routes for user authentication in an Express.js application.
// It imports the necessary modules, creates a router, and sets up two routes