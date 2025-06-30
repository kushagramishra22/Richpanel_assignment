// Main backend entry file
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

const conversationRoutes = require('./routes/conversations');
const fbRoutes = require('./routes/conversations'); // or conversations.js

const facebookRoutes = require('./routes/facebook');


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf } }));


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/fb', require('./routes/facebook'));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use('/api', conversationRoutes);
app.use('/api', fbRoutes);
app.use('/api', facebookRoutes);
app.use("/api", authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});


app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// This code initializes an Express.js server, connects to a MongoDB database, and sets up routes for user authentication.
// It uses environment variables for configuration and includes CORS support for cross-origin requests.
// The `dotenv` package is used to load environment variables from a `.env` file, allowing for easy configuration management.
// The `connectDB` function is used to connect to a MongoDB database, which is assumed to
// be set up and running separately.
// The server is configured to run on port 5000 by default, but this can be overridden by setting the `PORT` environment variable.
// The `cors` package is used to enable Cross-Origin Resource Sharing, allowing the server to accept requests from different origins.
// The server logs a message to the console when it starts, indicating the URL where it can be accessed.
// This setup is typical for a Node.js backend application that requires user authentication and database connectivity.
// The code is structured to be modular, with separate files for configuration, routes, and database connection,
// making it easier to maintain and extend in the future.