import express from "express";
import nodemailer from "nodemailer";
import User from "../Modals/User.js";
const router = express.Router();
router.post("/update", async (req, res) => {
  try {
    const { userId, plan } = req.body;
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({ message: "User not found",});
    }
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    await User.findByIdAndUpdate(userId, {
      plan,
      premiumExpiry: expiryDate,
    });
    const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: user.email,
  subject: "Premium Subscription Activated",
  html: `
    <h2>Payment Successful</h2>
    <p>Hello ${user.name},</p>
    <p>Your <b>${plan}</b> Premium Plan has been activated successfully.</p>
    <p><b>Expiry Date:</b> ${expiryDate.toDateString()}</p>
    <hr>
    <h3>Invoice</h3>
    <p>Plan: ${plan}</p>
    <p>Status: Paid</p>
    <p>Thank you for your purchase</p>`,});
    res.json({
      success: true,
      message: "Premium updated",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
export default router;