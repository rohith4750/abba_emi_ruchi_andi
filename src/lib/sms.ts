/**
 * SMS utility for Fast2SMS integration
 */

export const sendSMS = async (numbers: string, message: string) => {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    console.error("❌ FAST2SMS_API_KEY is missing in environment variables.");
    return { success: false, message: "API key missing" };
  }

  // Fast2SMS API URL for free/bulk messages or transactional
  // Using the route provided by user logic
  const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=v3&sender_id=TXTIND&message=${encodeURIComponent(message)}&numbers=${numbers}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ SMS Error:", error);
    throw error;
  }
};

export const sendOTPSMS = async (mobile: string, otp: string) => {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ FAST2SMS_API_KEY is missing. OTP will be logged to console only.");
    console.log(`[OTP] Mobile: ${mobile}, OTP: ${otp}`);
    return { success: true, message: "Key missing, logged to console" };
  }

  const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=otp&variables_values=${otp}&numbers=${mobile}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("✅ OTP SMS Sent:", data);
    return data;
  } catch (error) {
    console.error("❌ SMS OTP Error:", error);
    throw error;
  }
};
