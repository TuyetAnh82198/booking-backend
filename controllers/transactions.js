const moment = require("moment");

const TransactionModel = require("../models/Transaction.js");
const HotelModel = require("../models/Hotel.js");
const RoomModel = require("../models/Room.js");

//Hàm trả về giao dịch của một người dùng cụ thể
const getTransactions = async (req, res) => {
  try {
    const transactions = await TransactionModel.find({
      email: req.session.user.email,
    }).populate("hotel");
    return res.status(200).json({ result: transactions });
  } catch (err) {
    return res.status(500).json({ err: "server-error" });
  }
};
//Hàm trả về số lượng giao dịch
const total = async (req, res) => {
  try {
    const transactions = await TransactionModel.find();
    const total = transactions.length;
    return res.status(200).json({ result: total });
  } catch (err) {
    return res.status(500).json({ err: "server-error" });
  }
};
//Hàm trả về tổng doanh thu
const earnings = async (req, res) => {
  try {
    const transactions = await TransactionModel.find({}, "price");
    const earnings = transactions.reduce(
      (acc, transaction) => acc + transaction.price,
      0
    );
    return res.status(200).json({ result: earnings });
  } catch (err) {
    return res.status(500).json({ err: "server-error" });
  }
};
//Hàm trả về doanh thu trung bình
const balance = async (req, res) => {
  try {
    const transactions = await TransactionModel.find({}, "price");
    const earnings = transactions.reduce(
      (acc, transaction) => acc + transaction.price,
      0
    );
    const balance = earnings / transactions.length;
    return res.status(200).json({ result: balance });
  } catch (err) {
    return res.status(500).json({ err: "server-error" });
  }
};
//Hàm trả về 8 giao dịch gần nhất
const getAll = async (req, res) => {
  try {
    const transactions = await TransactionModel.find().populate("hotel");
    const page = req.params.page;
    const result = transactions.reverse().slice((page - 1) * 8, page * 8);
    return res
      .status(200)
      .json({ result: result, totalPages: Math.ceil(transactions.length / 8) });
  } catch (err) {
    return res.status(500).json({ err: "server-error" });
  }
};

//hàm kiểm tra những phòng còn trống dựa trên ngày đặt phòng
const checkIsEmptyRooms = async (req, res) => {
  try {
    const transactions = await TransactionModel.find({
      hotel: req.body.hotelId,
    });
    const notEmtyRoomArr = [];
    for (let i = 0; i < transactions.length; i++) {
      if (
        (moment(req.body.startDate).isAfter(
          moment(transactions[i].startDate)
        ) &&
          moment(req.body.endDate).isBefore(moment(transactions[i].endDate))) ||
        moment(req.body.startDate).isSame(moment(transactions[i].startDate)) ||
        moment(req.body.endDate).isSame(moment(transactions[i].endDate))
      ) {
        notEmtyRoomArr.push(transactions[i].room);
      }
    }
    let roomIdArr = [];
    let rooms;
    if (notEmtyRoomArr.length !== 0) {
      notEmtyRoomArr.forEach((item) =>
        item.map((room) => roomIdArr.push(room.roomId.valueOf()))
      );
      roomIdArr = [...new Set(roomIdArr)];
      rooms = await RoomModel.find({
        _id: { $in: roomIdArr },
      });
      const subArr = [];
      for (let i = 0; i < roomIdArr.length; i++) {
        subArr.push({
          roomId: roomIdArr[i],
          roomNumber: [],
        });
      }
      for (let i = 0; i < notEmtyRoomArr.length; i++) {
        for (let j = 0; j < notEmtyRoomArr[i].length; j++) {
          for (let k = 0; k < subArr.length; k++) {
            if (notEmtyRoomArr[i][j].roomId.valueOf() === subArr[k].roomId) {
              subArr[k].roomNumber.push(notEmtyRoomArr[i][j].roomNumber);
            }
          }
        }
      }
      for (let i = 0; i < rooms.length; i++) {
        rooms[i].roomNumbers = rooms[i].roomNumbers.filter(
          (number) => !subArr[i].roomNumber.includes(number)
        );
      }
    } else {
      const hotel = await HotelModel.findOne({
        _id: req.body.hotelId,
      }).populate("rooms");
      rooms = hotel.rooms;
    }
    return res.status(200).json({
      result: rooms,
    });
  } catch (err) {
    return res.status(500).json({ err: "server-error" });
  }
};

module.exports = {
  getTransactions,
  total,
  earnings,
  balance,
  getAll,
  checkIsEmptyRooms,
};
