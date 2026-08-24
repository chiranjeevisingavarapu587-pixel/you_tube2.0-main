import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTP = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "YouTube Clone <onboarding@resend.dev>",
      to: [email],
      subject: "Your Login OTP",
      html: `
        <h2>YouTube Clone Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    if (error) {
      console.log("EMAIL ERROR:", error);
      throw new Error(error.message);
    }

    console.log("EMAIL SENT:", data?.id);
    return data;
  } catch (error) {
    console.log("EMAIL ERROR:", error);
    throw error;
  }
};