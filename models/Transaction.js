const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Dữ liệu về giao dịch đặt phòng
const TransactionModel = new Schema({
  user: { type: String, required: false },
  email: { type: String, required: true },
  hotel: { type: Schema.Types.ObjectId, ref: "hotel", required: true },
  //danh sách các phòng đã đặt
  room: [
    {
      roomId: { type: Schema.Types.ObjectId, ref: "rooms", required: true },
      roomNumber: { type: Number, required: true },
    },
  ],
  //ngày nhận phòng
  startDate: {
    type: String,
    required: true,
  },
  //ngày trả phòng
  endDate: {
    type: String,
    required: true,
  },
  price: { type: Number, required: true },
  //Credit Card; Cash
  payment: { type: String, required: true },
  //Booked; Checkin; Checkout
  status: { type: String, required: true },
});

module.exports = mongoose.model("transaction", TransactionModel);
