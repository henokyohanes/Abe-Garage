require("dotenv").config();
const express = require("express");
const sanitize = require("sanitize");
const cors = require("cors");
const port = process.env.PORT;
const app = express();

// middleware to allow cross-origin requests
app.use(cors({ origin: process.env.FRONTEND_URL }));

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

// customer routes middleware file  
const customerRoutes = require("./routes/customer.routes");

// customer routes middleware
app.use(customerRoutes);

// order routes middleware file
const orderRoutes = require("./routes/order.routes");

// order routes middleware
app.use(orderRoutes);

// service routes middleware file
const serviceRoutes = require("./routes/service.routes");

// service routes middleware
app.use(serviceRoutes);

// start the Express server
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

module.exports = app;
