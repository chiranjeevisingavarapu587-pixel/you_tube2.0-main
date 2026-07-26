import mongoose from "mongoose";
const userschema = mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, default: "",},
  name: { type: String },
  channelname: { type: String },
  description: { type: String },
  image: { type: String },
  otp: {
    type: String,
    default: "",
  },
  otpExpires:{
    type: Date,
    default: null,
  },
  joinedon: { type: Date, default: Date.now },
});
export default mongoose.model("user", userschema);