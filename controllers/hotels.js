const moment = require("moment");

const HotelModel = require("../models/Hotel.js");
const CityModel = require("../models/City.js");
const RoomModel = require("../models/Room.js");
const TransactionModel = require("../models/Transaction.js");

//Hàm trả về danh sách khách sạn nằm trong top 3 rating cao nhất
const getTopHotels = async (req, res) => {
  try {
    const hotels = await HotelModel.find().populate("city");
    const topHotels = hotels.sort((a, b) => b.rating - a.rating).slice(0, 3);
    return res.status(200).json({ result: topHotels });
  } catch (err) {
    return res.status(500).json({ err: "server-error" });
  }
};

//Hàm trả về danh sách khách sạn thỏa điều kiện tìm kiếm
const searchHotels = async (req, res) => {
  try {
    const city = await CityModel.findOne({
      name: { $regex: req.body.destination, $options: "i" },
    });
    const hotels = await HotelModel.find({ city: city._id }).populate("rooms");
    let foundHotels = [];
    let hotel;
    for (let i = 0; i < hotels.length; i++) {
      hotel = hotels[i];
      const totalRooms = hotel.rooms.reduce(
        (acc, room) => acc + room.roomNumbers.length,
        0
      );
      let isEnoughRoom = totalRooms >= req.body.roomOption.room;
      if (isEnoughRoom) {
        const totalMaxPeople = hotel.rooms
          .map((room) => room.maxPeople * room.roomNumbers.length)
          .reduce((acc, item) => acc + item, 0);
        if (
          totalMaxPeople >=
          Number(req.body.roomOption.adult) +
            Number(req.body.roomOption.children)
        ) {
          foundHotels.push(hotel);
        }
      }
    }
    const foundHotelsIds = foundHotels.map((hotel) => hotel._id);
    const transactions = await TransactionModel.find({
      hotel: { $in: foundHotelsIds },
    });
    const foundTransactions = transactions.filter((trans) => {
      return (
        (moment(req.body.datePicked.startDate).isAfter(
          moment(trans.startDate)
        ) &&
          moment(req.body.datePicked.endDate).isBefore(
            moment(trans.endDate)
          )) ||
        moment(req.body.datePicked.startDate).isSame(moment(trans.startDate)) ||
        moment(req.body.datePicked.endDate).isSame(moment(trans.endDate))
      );
    });
    const roomIdsAndRoomNumbers = [];
    if (foundTransactions.length > 0) {
      for (let i = 0; i < foundTransactions.length; i++) {
        for (let j = 0; j < foundTransactions[i].room.length; j++) {
          if (roomIdsAndRoomNumbers.length === 0) {
            roomIdsAndRoomNumbers.push({
              hotel: foundTransactions[i].hotel,
              roomId: foundTransactions[i].room[j].roomId,
              roomNumber: [foundTransactions[i].room[j].roomNumber],
            });
          } else {
            for (let k = 0; k < roomIdsAndRoomNumbers.length; k++) {
              if (
                roomIdsAndRoomNumbers[k].roomId.valueOf() ===
                foundTransactions[i].room[j].roomId.valueOf()
              ) {
                if (
                  roomIdsAndRoomNumbers[k].roomNumber.includes(
                    foundTransactions[i].room[j].roomNumber
                  )
                ) {
                  continue;
                } else {
                  roomIdsAndRoomNumbers[k].roomNumber.push(
                    foundTransactions[i].room[j].roomNumber
                  );
                }
              } else {
                roomIdsAndRoomNumbers.push({
                  hotel: foundTransactions[i].hotel,
                  roomId: foundTransactions[i].room[j].roomId,
                  roomNumber: [foundTransactions[i].room[j].roomNumber],
                });
              }
            }
          }
        }
      }
      hotelsIds = [];
      for (let i = 0; i < roomIdsAndRoomNumbers.length; i++) {
        let rooms = await RoomModel.findOne({
          _id: roomIdsAndRoomNumbers[i].roomId,
          roomNumbers: roomIdsAndRoomNumbers[i].roomNumber,
        });
        if (!rooms) {
          hotelsIds.push(roomIdsAndRoomNumbers[i].hotel);
        }
      }
      foundHotels = await HotelModel.find({ _id: { $in: hotelsIds } });
    }
    return res.status(200).json({ result: foundHotels });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "server-error" });
  }
};

//Hàm trả về thông tin những phòng khả dụng để hiển thị cho người dùng lựa chọn
const bookingForm = async (req, res) => {
  try {
    const hotel = await HotelModel.findOne({
      _id: req.params.hotelId,
    }).populate("rooms");
    const transitions = await TransactionModel.find({
      hotel: req.params.hotelId,
    });
    const notAvailableRooms = [];
    transitions.forEach((transition) =>
      transition.room.forEach((roomNumber) =>
        notAvailableRooms.push(roomNumber)
      )
    );
    hotel.rooms.filter((room) =>
      room.roomNumbers.filter((roomNumber, i) => {
        if (notAvailableRooms.includes(room.roomNumbers[i])) {
          room.roomNumbers.splice(i, 1);
        }
      })
    );
    return res
      .status(200)
      .json({ result: hotel.rooms, email: req.session.user.email });
  } catch (err) {
    return res.status(500).json({ err: "server-error" });
  }
};

//Hàm nhận thông tin đặt phòng và lưu vào cơ sở dữ liệu
const booking = async (req, res) => {
  try {
    const newTransaction = new TransactionModel({
      ...req.body,
    });
    newTransaction.save();
    return res.status(201).json({ message: "Booking successful!" });
  } catch (err) {
    return res.status(500).json({ err: "server-error" });
  }
};

//hàm trả về thông tin chi tiết của một khách sạn
const getDetail = async (req, res) => {
  try {
    const hotel = await HotelModel.findOne({ _id: req.params.id });
    return res.status(200).json({ result: hotel });
  } catch (err) {
    return res.status(500).json({ err: "server-error" });
  }
};

module.exports = {
  getTopHotels,
  searchHotels,
  bookingForm,
  booking,
  getDetail,
};
