const TypeModel = require("../models/Type.js");

//Hàm trả về danh sách loại khách sạn
const getTypes = async (req, res) => {
  try {
    const types = await TypeModel.find();
    return res.status(200).json({ result: types });
  } catch (err) {
    return res.status(500).json({ err: "server-error" });
  }
};

module.exports = { getTypes };
