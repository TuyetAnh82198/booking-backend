const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserModel = new Schema({
  username: { type: String, required: false },
  pass: { type: String, required: true },
  fullName: { type: String, required: false },
  phoneNumber: { type: Number, required: false },
  email: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
});

module.exports = mongoose.model("user", UserModel);
