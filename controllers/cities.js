const CityModel = require("../models/City.js");

//Hàm trả về danh sách thành phố
const getCities = async (req, res) => {
  try {
    const cities = await CityModel.find();
    return res.status(200).json({ result: cities });
  } catch (err) {
    return res.redirect(`${process.env.CLIENT_APP}/server-error`);
  }
};

module.exports = { getCities };
