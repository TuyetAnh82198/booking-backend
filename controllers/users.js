const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const UserModel = require("../models/User.js");

//Hàm xử lý việc đăng ký
const signUp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errs = [];
      errors.array().forEach((error) => errs.push(error.msg));
      return res.status(400).json({ errs: errs[0] });
    } else {
      const existingUser = await UserModel.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(409).json({ message: "Existing user." });
      } else {
        const newUser = new UserModel({
          email: req.body.email,
          pass: bcrypt.hashSync(req.body.pass, 8),
          isAdmin: false,
        });
        await newUser.save();
        return res.status(201).json({ message: "Created!" });
      }
    }
  } catch (err) {
    return res.status(500).json({ err: "server-error" });
  }
};

//Hàm xử lý việc đăng nhập
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errs = [];
      errors.array().forEach((error) => errs.push(error.msg));
      return res.status(400).json({ errs: errs[0] });
    } else {
      const existingUser = await UserModel.findOne({ email: req.body.email });
      if (!existingUser) {
        return res.status(400).json({ message: "Wrong email or password." });
      } else {
        const correctPass = bcrypt.compareSync(
          req.body.pass,
          existingUser.pass
        );
        if (!correctPass) {
          return res.status(400).json({ message: "Wrong email or password." });
        } else {
          existingUser.pass = undefined;
          req.session.isLoggedIn = true;
          req.session.user = existingUser;
          return res.status(200).json({ message: "You are logged in." });
        }
      }
    }
  } catch (err) {
    return res.status(500).json({ err: "server-error" });
  }
};

//Hàm kiểm tra người dùng đã đăng nhập chưa để lấy thông tin hiển thị trên Navbar,...
const checkLogin = async (req, res) => {
  try {
    if (req.session.isLoggedIn) {
      return res.status(200).json({ email: req.session.user.email });
    } else {
      res.status(200).json({ message: "have not been logged in yet" });
    }
  } catch (err) {
    return res.status(500).json({ err: "server-error" });
  }
};

//Hàm xử lý việc đăng xuất
const logout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.redirect(`${process.env.CLIENT_APP}/server-error`);
      } else {
        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "You are logged out." });
      }
    });
  } catch (err) {
    return res.status(500).json({ err: "server-error" });
  }
};
//Hàm trả về số lượng người dùng
const total = async (req, res) => {
  try {
    const users = await UserModel.find();
    const total = users.length;
    return res.status(200).json({ result: total });
  } catch (err) {
    return res.status(500).json({ err: "server-error" });
  }
};

module.exports = { signUp, login, checkLogin, logout, total };
