const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.kebzey2.mongodb.net/?retryWrites=true&w=majority`,
  databaseName: "test",
  collection: "sessions",
});
const path = require("path");
const compression = require("compression");

const users = require("./routes/users.js");
const cities = require("./routes/cities.js");
const types = require("./routes/types.js");
const hotels = require("./routes/hotels.js");
const transactions = require("./routes/transactions.js");

const app = express();

app.use(express.static(path.join(__dirname, "./public")));

app.use(compression());
app.use(
  cors({
    origin: process.env.CLIENT_APP,
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/users", users);
app.use("/cities", cities);
app.use("/types", types);
app.use("/hotels", hotels);
app.use("/transactions", transactions);
app.use((req, res) => {
  return res.redirect(`${process.env.CLIENT_APP}/123`);
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.kebzey2.mongodb.net/test?retryWrites=true&w=majority`
  )
  .then((result) => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => console.log(err));
