"use client"

import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OTPFormProps {
  onVerify: (otp: string) => void;
  onResend: () => void;
  loading: boolean;
  phone: string;
}

export default function OTPForm({ onVerify, onResend, loading, phone }: OTPFormProps) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // If all digits are filled, auto-verify
    if (newOtp.every((digit) => digit !== "")) {
      onVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData.getData("text").slice(0, 4);
    if (!/^\d+$/.test(data)) return;

    const newOtp = data.split("").concat(Array(4 - data.length).fill("")).slice(0, 4);
    setOtp(newOtp);
    
    if (data.length === 4) {
      onVerify(data);
    } else {
        inputRefs[Math.min(data.length, 3)].current?.focus();
    }
  };

  return (
    <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">Verify Phone</h3>
        <p className="text-gray-500">
          We've sent a 4-digit code to <span className="font-bold text-brand-green">{phone}</span>
        </p>
      </div>

      <div className="flex justify-center gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={inputRefs[index]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-14 h-16 text-center text-2xl font-bold bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-brand-green focus:ring-4 focus:ring-brand-green/10 outline-none transition-all"
            disabled={loading}
          />
        ))}
      </div>

      <button
        onClick={() => onVerify(otp.join(""))}
        disabled={loading || otp.some(d => !d)}
        className="w-full bg-brand-green text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-brand-green/10"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          "Verify & Continue"
        )}
      </button>

      <p className="text-sm text-gray-500 font-medium">
        Didn't receive the code?{" "}
        <button
          onClick={onResend}
          className="text-brand-green font-bold hover:underline"
          type="button"
        >
          Resend Code
        </button>
      </p>
    </div>
  );
}
