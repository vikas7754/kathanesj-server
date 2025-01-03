require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { v2 } = require("cloudinary");
v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection failed");
  }
};
connectDB();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the server" });
});

app.use("/api/details", require("./src/routes/detailsRoute"));
app.use("/api/delta", require("./src/routes/deltaRoute"));
app.use("/api/update", require("./src/routes/updateRoute"));
app.use("/api/user", require("./src/routes/userRoute"));
app.use("/api/enquiry", require("./src/routes/enquiryRoute"));
app.use("/api/product", require("./src/routes/productRoute"));
app.use("/api/charges", require("./src/routes/chargesRoute"));
app.use("/api/header", require("./src/routes/headerRoute"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
