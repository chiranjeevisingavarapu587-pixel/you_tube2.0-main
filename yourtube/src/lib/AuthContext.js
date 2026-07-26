import { createContext, useContext, useEffect, useState } from "react";
import OtpDialog from "@/components/OtpDialog";
import PhoneDialog from "@/components/PhoneDialog";
import {
  auth,
  provider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import axiosInstance from "./axiosInstance";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [otpOpen, setOtpOpen] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");

  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const [phoneOpen, setPhoneOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneConfirmation, setPhoneConfirmation] = useState(null);

  const login = (userdata, token) => {
    if (!userdata) return;

    setUser(userdata);
    localStorage.setItem("user", JSON.stringify(userdata));
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userdata._id);
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    try {
      await signOut(auth);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const firebaseUser = result.user;

      const locationRes = await fetch("https://ipapi.co/json/");
      const location = await locationRes.json();

      const response = await axiosInstance.post("/user/login", {
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        image: firebaseUser.photoURL,
        region: location.region,
      });

      if (response.data.otpRequired) {
        if (response.data.method === "email") {
          setOtpEmail(response.data.email);
          setOtpValue("");
          setOtpError("");
          setTimer(30);
          setCanResend(false);
          setOtpOpen(true);
          return;
        }

        if (response.data.method === "phone") {
          setOtpEmail(firebaseUser.email);
          setPhoneNumber("");
          setPhoneOpen(true);
          return;
        }
      }

      login(response.data.result, response.data.token);
    } catch (err) {
      console.log(err);
    }
  };

  const verifyOtp = async () => {
    console.log("EMAIL OTP FUNCTION");
    try {
      const verify = await axiosInstance.post("/user/verify-otp", {
        email: otpEmail,
        otp: otpValue,
      });

      login(verify.data.result, verify.data.token);

      setOtpOpen(false);
      setOtpValue("");
      setOtpError("");
    } catch (err) {
      setOtpError(
        err.response?.data?.message || "Invalid OTP"
      );
    }
  };

  useEffect(() => {
    if (!otpOpen) return;

    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((p) => p - 1);
      }, 1000);

      return () => clearInterval(interval);
    }

    setCanResend(true);
  }, [otpOpen, timer]);

  const resendOtp = async () => {
    try {
      await axiosInstance.post("/user/resend-otp", {
        email: otpEmail,
      });

      setTimer(30);
      setCanResend(false);
      setOtpError("");
    } catch (err) {
      setOtpError(
        err.response?.data?.message || "Failed to resend OTP."
      );
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored && stored !== "undefined") {
      setUser(JSON.parse(stored));
    }
  }, []);

  const sendPhoneOtp = async () => {
    try {
      if (!phoneNumber.startsWith("+")) {
        alert("Enter phone number with country code.\nExample: +919876543210");
        return;
      }

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
          }
        );

        await window.recaptchaVerifier.render();
      }

      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
      );

      setPhoneConfirmation(confirmation);
      setPhoneOpen(false);
      setOtpOpen(true);
      setOtpError("");

    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };
  const verifyPhoneOtp = async () => {
    console.log("PHONE OTP FUNCTION");
    try {
      const result = await phoneConfirmation.confirm(otpValue);

      const response = await axiosInstance.post("/user/verify-phone", {
        email: otpEmail,
        phone: result.user.phoneNumber,
      });

      login(response.data.result, response.data.token);

      setOtpOpen(false);
      setOtpValue("");
      setOtpError("");
      setPhoneConfirmation(null);

    } catch (err) {
      setOtpError("Invalid Phone OTP");
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        handleGoogleSignIn,
        verifyOtp,
        verifyPhoneOtp,
        resendOtp,
        timer,
        canResend,
      }}
    >
      {children}

      <OtpDialog
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        email={otpEmail}
        otp={otpValue}
        setOtp={setOtpValue}
        error={otpError}
        isPhone={phoneConfirmation !==null}
      />

      <PhoneDialog
        open={phoneOpen}
        phone={phoneNumber}
        setPhone={setPhoneNumber}
        sendOtp={sendPhoneOtp}
      />

      <div id="recaptcha-container"></div>

    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);