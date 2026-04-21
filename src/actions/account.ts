"use server"

import db from "../lib/db";
import { auth } from "@/auth";

export async function getCustomerAccountData() {
  try {
    const session = await auth();
    
    if (!session?.user) {
       return { error: "You must be logged in to view this page", data: null };
    }

    const userId = (session.user as any).id;

    if (!userId) {
        return { error: "User ID not found in session", data: null };
    }

    const userWithDetails = await db.user.findUnique({
      where: { id: userId },
      include: {
        customer: {
          include: {
            orders: {
              orderBy: { createdAt: 'desc' },
              include: {
                items: {
                  include: {
                    product: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!userWithDetails) {
      return { error: "User profile not found", data: null };
    }

    // Serialize for client components
    const serializedData = JSON.parse(JSON.stringify({
      customer: userWithDetails.customer,
      user: {
          name: userWithDetails.name,
          email: userWithDetails.email,
          phone: userWithDetails.phone,
          username: userWithDetails.username
      }
    }));

    return { 
      data: serializedData, 
      error: null 
    };
  } catch (error: any) {
    console.error("Error fetching account data:", error);
    return { error: error.message || "An unexpected error occurred", data: null };
  }
}
