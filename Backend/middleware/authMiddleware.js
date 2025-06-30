// Protects routes wiht JWT authentication
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "No token, access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = protect;
// This code defines a middleware function `protect` that checks for a JWT token in the request headers.
// If the token is present, it verifies the token using a secret key and attaches the user ID to the request object.
// If the token is missing or invalid, it responds with an error message and a 401 status code.