"use server"

import db from "../lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getStaffUsers() {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return { users: [], error: "Unauthorized access to staff records" };
    }

    const users = await db.user.findMany({
      where: {
        role: "ADMIN"
      },
      orderBy: { createdAt: 'desc' },
      select: {
          id: true,
          name: true,
          email: true,
          username: true,
          role: true,
          createdAt: true
      }
    });

    // Serialize for client components
    const serializedUsers = JSON.parse(JSON.stringify(users));
    
    return { users: serializedUsers, error: null };
  } catch (error: any) {
    console.error("Error fetching staff users:", error);
    return { users: [], error: error.message || "Failed to fetch staff records" };
  }
}

export async function createStaffUser(data: {
  name: string;
  email: string;
  password?: string;
  username?: string;
}) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    // Check if user already exists
    const existing = await db.user.findFirst({
        where: {
            OR: [
                { email: data.email },
                { username: data.username || undefined }
            ]
        }
    });

    if (existing) {
        throw new Error("A user with this email or username already exists");
    }

    const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : await bcrypt.hash("staff@123", 10);

    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        username: data.username,
        password: hashedPassword,
        role: "ADMIN"
      }
    });

    revalidatePath("/admin/users");
    return { success: true, user };
  } catch (error: any) {
    console.error("Error creating staff user:", error);
    return { success: false, error: error.message || "Failed to create staff member" };
  }
}

export async function deleteStaffUser(id: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const userId = (session.user as any).id;
    if (userId === id) {
       return { success: false, error: "You cannot delete your own session account" };
    }

    await db.user.delete({
      where: { id }
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting staff user:", error);
    return { success: false, error: error.message || "Failed to remove staff member" };
  }
}
