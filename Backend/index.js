require("dotenv").config();
const express = require("express");
const port = process.env.PORT;
const app = express();

// middleware to parse incoming JSON data
app.use(express.json());

//employee routes middleware file
const employeeRoutes = require("./routes/employeeRoutes");

// employee routes middleware
app.use(employeeRoutes);

// start the Express server
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

module.exports = app;
