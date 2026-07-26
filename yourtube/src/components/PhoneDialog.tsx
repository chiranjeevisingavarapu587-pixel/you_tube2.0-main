import React from "react";

interface PhoneDialogProps {
  open: boolean;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  sendOtp: () => void;
}

export default function PhoneDialog({
  open,
  phone,
  setPhone,
  sendOtp,
}: PhoneDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-zinc-900 w-[400px] rounded-xl p-6 shadow-2xl border border-gray-700">
        <h2 className="text-white text-2xl font-bold">
          Phone Verification
        </h2>

        <p className="text-gray-400 text-sm mt-2">
          Enter your mobile number with country code.
        </p>

        <input
          type="tel"
          placeholder="+91XXXXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mt-5 px-4 py-3 rounded-lg bg-white text-black border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={sendOtp}
          className="w-full mt-5 bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold"
        >
          Send OTP
        </button>
      </div>
    </div>
  );
}