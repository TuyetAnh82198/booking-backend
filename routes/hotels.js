const express = require("express");

const {
  getTopHotels,
  searchHotels,
  bookingForm,
  booking,
  getDetail,
} = require("../controllers/hotels.js");
const isAuth = require("../middleware/isAuth.js");

const route = express.Router();

route.get("/get-top", getTopHotels);
route.post("/search", searchHotels);
route.get("/booking-form/:hotelId", isAuth, bookingForm);
route.post("/booking", booking);
route.get("/detail/:id", getDetail);

module.exports = route;
