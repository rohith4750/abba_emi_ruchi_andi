"use server"

import db from "@/lib/db";
import { generateOTP } from "@/lib/otp";
import { sendOTPSMS } from "@/lib/sms";
import { z } from "zod";
import bcrypt from "bcryptjs";

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

export async function registerUser(data: any) {
  const { name, email, phone, username, password } = data;

  try {
    // 1. Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email },
          { phone },
          ...(username ? [{ username }] : []),
        ],
      },
    });

    if (existingUser) {
      return { success: false, error: "User with this email or phone already exists" };
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        phone,
        username: username || null,
        password: hashedPassword,
        role: "USER",
      },
    });

    return { success: true, user };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { success: false, error: error.message || "Failed to register account" };
  }
}
