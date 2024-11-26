require("dotenv").config();
const express = require("express");
const port = process.env.PORT;
const app = express();

// start the Express server
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

module.exports = app;
