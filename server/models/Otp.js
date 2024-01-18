const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

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

async function sendVerification(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification email from study Notion",
      otp
    );
  } catch (error) {
    console.log("error ocurred while sending mail", error);
  }
}

otpSchema.pre("save", async function(next){
  await sendVerification(this.email, this.otp);
  next();
})

module.exports = mongoose.model("Otp", otpSchema);
