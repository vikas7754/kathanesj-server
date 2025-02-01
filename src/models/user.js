const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRET = process.env.SECRET || "hellosvjewellers";
const salt = 10;

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: 1,
    },
    mobile: {
      type: String,
      // required: true,
      // unique: 1,
      default: "",
    },
    whatsapp: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    password: {
      type: String,
      required: true,
    },
    details: {
      type: Object,
      default: {},
    },
    active: {
      type: Boolean,
      default: true,
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("validate", function (next) {
  this.email = this.email.toLowerCase().trim();
  this.name = this.name.trim();
  this.password = this.password.trim();
  next();
});

// to signup a user
userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(salt, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

//to login
userSchema.methods.comparepassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

// generate token
userSchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign(user._id.toHexString(), SECRET);
  user.token = token;
  await user.updateOne({ $set: { token: token } });
  return token;
};

// find by token
userSchema.static("findByToken", async (token) => {
  try {
    const decode = jwt.verify(token, SECRET);
    const User = mongoose.model("User");
    const userdata = await User.findOne({
      _id: decode,
      token: token,
      active: true,
    });
    return userdata;
  } catch (err) {
    throw err;
  }
});

//delete token
userSchema.methods.deleteToken = async (token, cb) => {
  try {
    const user = this;
    user.token = "";
    await user.updateOne({ $unset: { token: 1 } });
    return user;
  } catch (err) {
    throw err;
  }
};

module.exports = mongoose.model("User", userSchema);
