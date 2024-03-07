const express = require("express");

const { getCities } = require("../controllers/cities.js");

const route = express.Router();

route.get("/get", getCities);

module.exports = route;
