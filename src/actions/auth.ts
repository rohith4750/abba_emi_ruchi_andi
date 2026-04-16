"use client"

import { signIn } from "next-auth/react";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/admin",
    });
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
}
