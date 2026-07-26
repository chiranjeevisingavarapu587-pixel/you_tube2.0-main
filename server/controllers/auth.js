import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { sendOTP } from "../filehelper/mailhelper.js";
import users from "../Modals/Auth.js";
export const login = async (req, res) => {
  const { email, name, image, region, phone } = req.body;
  try {
    let existingUser = await users.findOne({ email });
    if (!existingUser) {
      existingUser = await users.create({
        email: email,
        phone: phone,
        name: name,
        image: image
      });
    }
    console.log("User Region:", region);
    const southStates = [
      "Andhra Pradesh",
      "Telangana",
      "Tamil Nadu",
      "Kerala",
      "Karnataka",
    ];
if (southStates.includes(region)) {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  existingUser.otp = otp;
  existingUser.otpExpires = new Date(
    Date.now()+5*60*1000
  );
  await existingUser.save();
  await sendOTP(email, otp);
  return res.status(200).json({
    otpRequired: true,
    method: "email",
    email,
  });
}
if (!southStates.includes(region)) {
  return res.status(200).json({
    otpRequired: true,
    method: "phone",
  });
}
    const token = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.status(200).json({
      result: existingUser,
      token: token
    });
  } catch (error) {
    console.log("Login error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("DB OTP:", existingUser.otp);
    console.log("USER OTP:", otp);
    if (!existingUser.otpExpires || new Date() > existingUser.otpExpires) {
  return res.status(400).json({
    message: "OTP has expired. Please resend OTP."
  });
}
    if (String(existingUser.otp).trim() !== String(otp).trim()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    existingUser.otp = "";
    existingUser.otpExpires = null;
    await existingUser.save();
    const token = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.status(200).json({
      result: existingUser,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    });
    existingUser.otp = otp;
    existingUser.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await existingUser.save();
    await sendOTP(email, otp);
    return res.status(200).json({
      message: "OTP resent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
export const verifyPhone = async (req, res) => {
  const { email, phone } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    existingUser.phone = phone;
    await existingUser.save();
    const token = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.status(200).json({
      result: existingUser,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
export const updateprofile = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const updatedUser = await users.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: "Update failed" });
  }
};