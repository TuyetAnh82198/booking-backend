const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Dữ liệu về từng khách sạn
const HotelModel = new Schema({
  name: { type: String, required: true },
  type: { type: Schema.Types.ObjectId, ref: "types", required: true },
  city: { type: Schema.Types.ObjectId, ref: "cities", required: true },
  address: { type: String, required: true },
  distance: { type: String, required: true },
  photos: [{ type: String, required: true }],
  desc: { type: String, required: true },
  //đánh giá về khách sạn đó (thấp nhất là 0 điểm, cao nhất là 5 điểm)
  rating: { type: Number, required: true },
  //khách sạn này có hỗ trợ các tiện ích khác không
  featured: { type: Boolean, required: true },
  //danh sách các phòng thuộc khách sạn này
  rooms: [{ type: Schema.Types.ObjectId, ref: "room", required: true }],
  cheapestPrice: { type: Number, required: true },
});

module.exports = mongoose.model("hotel", HotelModel);
