"use client"

import { useState, Suspense, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Phone, AtSign, ArrowRight, Loader2, AlertCircle, Sparkles } from "lucide-react";
import OTPForm from "@/components/auth/OTPForm";
import { sendOtpAction } from "@/actions/auth";
import { motion, AnimatePresence } from "framer-motion";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  
  const [mode, setMode] = useState<"password" | "otp">("otp");
  const [step, setStep] = useState<"identifier" | "otp">("identifier");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [isPending, startTransition] = useTransition();

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("Invalid credentials. Please check your phone/email and password.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const phoneInput = formData.get("phone") as string;
    setPhone(phoneInput);

    const result = await sendOtpAction(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setStep("otp");
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    setLoading(true);
    setError("");

    try {
      const result = await signIn("otp", {
        phone,
        otp,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("Invalid or expired OTP. Please try again.");
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-md mx-auto">
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-xs font-bold uppercase tracking-wider mb-2">
           <Sparkles className="w-3 h-3" /> Secure Login
        </div>
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">
          {step === "otp" ? "Verify Code" : "Welcome Back"}
        </h2>
        <p className="text-gray-500 font-medium">
          {step === "otp" ? `Enter the code sent to ${phone}` : "Sign in to order your favorite food."}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === "identifier" ? (
          <motion.div
            key="identifier"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-2xl">
              <button
                onClick={() => setMode("otp")}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                  mode === "otp" ? "bg-white text-brand-green shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                OTP Login
              </button>
              <button
                onClick={() => setMode("password")}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                  mode === "password" ? "bg-white text-brand-green shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Password Login
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-medium animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            {mode === "otp" ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-widest ml-1">Mobile Number</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-brand-green transition-colors" />
                    </div>
                    <input
                      required
                      name="phone"
                      type="tel"
                      placeholder="Enter 10 digit number"
                      className="w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all font-medium text-gray-900 shadow-sm"
                    />
                  </div>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-brand-green text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 shadow-xl shadow-brand-green/10"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Send OTP Code <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-widest ml-1">Email or Phone</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <AtSign className="h-5 w-5 text-gray-400 group-focus-within:text-brand-green transition-colors" />
                      </div>
                      <input
                        required
                        name="identifier"
                        type="text"
                        placeholder="e.g. 91XXXXXXXXXX or email@example.com"
                        className="w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all font-medium text-gray-900 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Password</label>
                      <Link href="#" className="text-xs font-bold text-brand-green hover:underline">Forgot?</Link>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-brand-green transition-colors" />
                      </div>
                      <input
                        required
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all font-medium text-gray-900 shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-brand-green text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 shadow-xl shadow-brand-green/10"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Sign In to Your Account <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            )}

            <p className="text-center text-gray-500 font-medium pt-2">
              New here?{" "}
              <Link href="/register" className="text-brand-green font-bold hover:underline underline-offset-4">
                Create an account
              </Link>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
             {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-medium animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}
            <OTPForm 
              phone={phone}
              loading={loading}
              onVerify={handleVerifyOtp}
              onResend={() => setStep("identifier")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 text-brand-green animate-spin" />
        <p className="text-brand-green font-bold animate-pulse">Initializing secure gate...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
