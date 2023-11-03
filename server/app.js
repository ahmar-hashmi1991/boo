"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const { connect } = require("./bootstrap/db");
const { NotFoundError, ValidationError } = require("./errors/customError");

const app = express();
app.use((err, req, res, next) => {
  if (err instanceof NotFoundError) {
    res.status(err.statusCode).json({ error: err.message });
  } else if (err instanceof ValidationError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    // Handle other errors
    res.status(500).json({ error: "Internal server error" });
  }
});
const port = process.env.PORT || 3000;

let server;
(async () => {
  try {
    await connect();
    app.set("view engine", "ejs");
    app.use(bodyParser.json());

    // routes
    app.use("/", require("./routes/profile")());

    server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error setting up the MongoDB server:", error);
  }
})();

module.exports = server;
