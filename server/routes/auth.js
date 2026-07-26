import express from "express";
import { login, verifyOTP, resendOTP, verifyPhone, updateprofile } from "../controllers/auth.js";
const routes = express.Router();
routes.post("/login", login);
routes.post("/verify-otp", verifyOTP);
routes.post("/resend-otp", resendOTP);
routes.post("/verify-phone", verifyPhone);
routes.patch("/update/:id", updateprofile);
export default routes;