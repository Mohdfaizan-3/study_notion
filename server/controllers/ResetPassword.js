const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.json({
        success: false,
        message: "email is not registered",
      });
    }

    const token = crypto.randomUUID();
    const updatedDetails = User.findOneAndUpdate(
      { email: email },
      {
        token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      {
        new: true, // to send updated doc
      }
    );

    const url = `http://localhost:3000/update-password/${token}`;

    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link: ${url}`
    );

    return res.json({
      success: true,
      message: "password update successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: true,
      message: "something went wrong",
    });
  }
};

//resetPassword

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "password does'nt match",
      });
    }

    const userDetails = await User.findOne({ token: token });
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token invalid",
      });
    }

    if (!userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token is expired.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};
