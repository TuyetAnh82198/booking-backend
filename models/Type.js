const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Dữ liệu về từng loại khách sạn
const TypeModel = new Schema({
  name: { type: String, required: true },
  count: { type: Number, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model("type", TypeModel);
