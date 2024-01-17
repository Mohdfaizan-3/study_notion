const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: Sting,
    required: true,
  },

  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Data,
    default: Data.now(),
    expires: 5 * 60,
  },
});

module.exports = mongoose.model("Otp", otpSchema);
