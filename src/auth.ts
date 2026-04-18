import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import db from "./lib/db";
import { authConfig } from "./auth.config";
import bcrypt from "bcryptjs";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const parsedCredentials = z
            .object({ 
              identifier: z.string(), 
              password: z.string().min(6) 
            })
            .safeParse(credentials);

          if (parsedCredentials.success) {
            const { identifier, password } = parsedCredentials.data;
            
            // Find user by email, phone, or username
            const user = await db.user.findFirst({
              where: {
                OR: [
                  { email: identifier },
                  { phone: identifier },
                  { username: identifier },
                ],
              },
            });

            if (!user) return null;

            // Check if password is a bcrypt hash
            const isHashed = user.password.startsWith("$2");
            
            if (isHashed) {
              const passwordsMatch = await bcrypt.compare(password, user.password);
              if (passwordsMatch) {
                return {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                };
              }
            } else {
              // Legacy plain-text check (e.g., from seed or old data)
              if (user.password === password) {
                // Auto-migrate to hashed password
                const hashedPassword = await bcrypt.hash(password, 10);
                await db.user.update({
                  where: { id: user.id },
                  data: { password: hashedPassword },
                });

                return {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                };
              }
            }
          }
          return null;
        } catch (error) {
          console.error("❌ Auth Error (Database or Logic):", error);
          return null;
        }
      },
    }),
    Credentials({
      id: "otp",
      name: "OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        try {
          const { phone, otp } = credentials as { phone: string; otp: string };

          // 1. Find the verification token
          const token = await (db as any).verificationToken.findFirst({
            where: {
              phone,
              token: otp,
              expires: { gt: new Date() },
            },
          });

          if (!token) {
            console.error("❌ Invalid or expired OTP");
            return null;
          }

          // 2. Delete the used token
          await (db as any).verificationToken.delete({
            where: { id: token.id },
          });

          // 3. Find or Create User
          let user = await db.user.findFirst({
            where: { phone },
          });

          if (!user) {
            user = await db.user.create({
              data: {
                phone,
                role: "USER",
                // Providing empty strings to satisfy stale type definitions 
                // where email and password might still be marked as required
                email: `${phone}@placeholder.com`, 
                password: "OTP_USER_PLACEHOLDER",
              },
            });
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("❌ OTP Auth Error:", error);
          return null;
        }
      },
    }),
  ],
});
