const signupMail = require("../emails/emails/signup-email");
const User = require("../models/user");
const Otp = require("../models/otp");
const XLSX = require("xlsx");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const uploadImage = require("../utils/upload-image");

const generatePassword = require("../utils/generatePassword");
const forgotPasswordRequestMail = require("../emails/emails/forgot-password-request");
const passwordResetMail = require("../emails/emails/password-reset");

const bcrypt = require("bcrypt");

function generateOTP() {
  let otp = "";
  const digits = "0123456789";
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp.toString();
}

const signup = async (req, res) => {
  try {
    const { name, email, mobile, address, city, state } = req.body;
    if (!name || !email || !mobile || !city)
      return res.status(400).json({ message: "All fields are required!" });

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist)
      return res.status(400).json({ message: "Email already exist!" });
    const isMobileExist = await User.findOne({ mobile });
    if (isMobileExist)
      return res.status(400).json({ message: "Mobile already exist!" });

    const password = generatePassword();
    const user = new User({
      name,
      email,
      mobile,
      password,
      details: { address, city, state },
    });
    await user.save();

    signupMail({ name, email, mobile, password });

    const token = await user.generateToken();
    return res.cookie("auth", token).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const user = await User.findOne({ mobile });
    if (!user) return res.status(400).json({ message: "User not found!" });
    const isMatch = await user.comparepassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password!" });
    const token = await user.generateToken();
    return res.cookie("auth", token).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const logout = async (req, res) => {
  try {
    let token = req.cookies.auth;
    if (!token) return res.status(400).json({ message: "User not found!" });

    const user = await User.findByToken(token);
    if (!user) return res.status(400).json({ message: "User not found!" });

    if (!(await user.deleteToken(token)))
      return res.status(400).json({ message: "Something went wrong!" });
    res.clearCookie("auth");
    res.status(200).json({ message: "Logged out successfully!" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const me = async (req, res) => {
  try {
    let token = req.cookies.auth;
    if (!token) return res.status(200).json({});
    const userDetail = await User.findByToken(token);
    if (!userDetail) return res.status(200).json({});
    return res.status(200).json(userDetail);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getUsers = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  try {
    const users = await User.find({ role: "user" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await User.countDocuments({ role: "user" });
    return res.status(200).json({ users, total });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const exportUsers = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const query = { role: "user" };
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    const users = await User.find(query);

    const data = users.map((user) => {
      return {
        Name: user.name,
        Email: user.email,
        Mobile: user.mobile,
        City: user.details?.city || "NA",
        Address: user.details?.address || "NA",
      };
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.setHeader("Content-Disposition", 'attachment; filename="users.xlsx"');
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(excelBuffer);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { user } = req;
    const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {
      new: true,
    });
    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const forgotPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found!" });
    const otp = generateOTP();
    const newOtp = new Otp({ email, otp });

    await forgotPasswordRequestMail(email, user.name, otp);

    await Otp.deleteMany({ email });

    await newOtp.save();

    return res.status(200).json({ message: "OTP sent to your email!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found!" });

    const otpData = await Otp.findOne({ email, otp });
    if (!otpData)
      return res.status(400).json({ message: "Invalid or Expired OTP!" });

    const hash = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(user._id, { password: hash });
    await Otp.deleteMany({ email });

    passwordResetMail(email, user.name);

    return res.status(200).json({ message: "Password changed successfully!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const uploadSingleImage = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message || "Server error." });
    }
    const file = req.file;
    try {
      const result = await uploadImage(file);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ message: err.message || "Server error." });
    }
  });
};

module.exports = {
  login,
  me,
  logout,
  signup,
  getUsers,
  exportUsers,
  updateProfile,
  forgotPasswordRequest,
  forgotPassword,
  uploadSingleImage,
};
