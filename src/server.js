const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const multer = require('multer');
const bodyParser = require("body-parser");
const morgan = require("morgan");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/uploads", express.static(path.join(__dirname, '..', "uploads")));

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/", userRoutes);
app.use("/api/", categoryRoutes);
app.use("/api/", productRoutes);
app.use("/api/", cartRoutes);
app.use("/api/", orderRoutes);

connectDB()
  .then(() => {
    console.log("Database is running...");
    app.listen(PORT, () => console.log("server is running..."));
  })
  .catch((err) => console.log("unable to connect!"));
