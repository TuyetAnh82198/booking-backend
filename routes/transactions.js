const express = require("express");

const {
  getTransactions,
  total,
  earnings,
  balance,
  getAll,
  checkIsEmptyRooms,
} = require("../controllers/transactions.js");
const isAuth = require("../middleware/isAuth.js");

const route = express.Router();

route.get("/get", isAuth, getTransactions);
route.get("/total", total);
route.get("/earnings", earnings);
route.get("/balance", balance);
route.get("/get-all/:page", getAll);
route.post("/check", isAuth, checkIsEmptyRooms);

module.exports = route;
