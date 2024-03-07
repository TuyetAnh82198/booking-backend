const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Dữ liệu về từng loại phòng
const RoomModel = new Schema({
  //tên loại phòng
  title: { type: String, required: true },
  //mức giá tính theo ngày
  price: { type: Number, required: true },
  //số người tối đa
  maxPeople: { type: Number, required: true },
  //mô tả
  desc: { type: String, required: true },
  //danh sách số phòng
  roomNumbers: [{ type: Number, required: true }],
});

module.exports = mongoose.model("room", RoomModel);
