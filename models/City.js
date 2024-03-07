const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Dữ liệu về số lượng khách sạn của từng thành phố
const CityModel = new Schema({
  name: { type: String, required: true },
  count: { type: Number, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model("cities", CityModel);
