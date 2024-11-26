require("dotenv").config();
const express = require("express");
const sanitize = require("sanitize");
const port = process.env.PORT;
const app = express();

// middleware to parse incoming JSON data
app.use(express.json());

// middleware to sanitize incoming data
app.use(sanitize.middleware);

//employee routes middleware file
const employeeRoutes = require("./routes/employee.routes");

// employee routes middleware
app.use(employeeRoutes);

// login routes middleware file
const loginRoutes = require("./routes/login.routes");

// login routes middleware
app.use(loginRoutes);

const customerRoutes = require("./routes/customer.routes");

app.use(customerRoutes);

// start the Express server
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

module.exports = app;
