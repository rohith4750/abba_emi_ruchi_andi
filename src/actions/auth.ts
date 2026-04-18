"use server"

import db from "@/lib/db";
import { generateOTP } from "@/lib/otp";
import { sendOTPSMS } from "@/lib/sms";
import { z } from "zod";

const PhoneSchema = z.object({
  phone: z.string().min(10, "Invalid phone number").max(13, "Invalid phone number"),
});

export async function sendOtpAction(formData: FormData) {
  const phone = formData.get("phone") as string;
  
  const validatedFields = PhoneSchema.safeParse({ phone });
  
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors.phone?.[0] || "Invalid phone number" };
  }

  const otp = generateOTP();
  const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

  try {
    // Upsert verification token
    // Using (db as any) to bypass stale type definitions if prisma generate hasn't synced with IDE
    await (db as any).verificationToken.upsert({
      where: {
        phone_token: {
          phone,
          token: otp,
        }
      },
      create: {
        phone,
        token: otp,
        expires,
      },
      update: {
        token: otp,
        expires,
      }
    });
  } catch (error) {
    // If upsert fails because of unique constraint logic, just delete and create
    try {
      await (db as any).verificationToken.deleteMany({ where: { phone } });
      await (db as any).verificationToken.create({
        data: {
          phone,
          token: otp,
          expires,
        }
      });
    } catch (dbError) {
      console.error("❌ DB Error saving OTP:", dbError);
      return { error: "Failed to process OTP. Please try again." };
    }
  }

  try {
    await sendOTPSMS(phone, otp);
    return { success: true, message: "OTP sent successfully!" };
  } catch (error) {
    return { error: "Failed to send SMS. Please check your number." };
  }
}
