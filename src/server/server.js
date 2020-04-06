// projectData object as endpoint for all routes.
let projectData = {
  summary: undefined,
  max: undefined,
  min: undefined,
  date: undefined,
  daysDiff: undefined,
  country: undefined,
  imgSrc: undefined,
  city: undefined
};

// Require Express to run server and routes.
const express = require("express");

// Start up an instance of app.
const app = express();

/* Middleware*/
// Configuring express to use body-parser as middle-ware.
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance.
const cors = require("cors");
app.use(cors());

// Initialize the main project folder.
app.use(express.static("dist"));

// Set up the server.
const port = 3000;

// https://blog.campvanilla.com/jest-expressjs-and-the-eaddrinuse-error-bac39356c33a
// we don't need to listen during testing
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`running on localhost: ${port}`));
}

// Get Route.
app.get("/", (req, res) => {
  res.sendFile("dist/index.html");
});

// Post Route.
app.post("/add", (req, res) => {
  projectData = {
    ...projectData,
    summary: req.body.summary,
    max: req.body.max,
    min: req.body.min,
    date: req.body.date,
    daysDiff: req.body.daysDiff,
    country: req.body.country,
    imgSrc: req.body.imgSrc,
    city: req.body.city
  };

  // send response with projectData
  res.send(projectData);
});

module.exports = app;
