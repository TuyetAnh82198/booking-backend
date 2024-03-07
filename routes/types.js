const express = require("express");

const { getTypes } = require("../controllers/types.js");

const route = express.Router();

route.get("/get", getTypes);

module.exports = route;
