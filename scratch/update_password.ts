import db from "../src/lib/db";
import bcrypt from "bcryptjs";

async function updateAdminPassword() {
  const email = "admin@abbami.com";
  const newPassword = "newpassword";
  
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Using (db as any) in case types are still out of sync
    const user = await (db as any).user.update({
      where: { email },
      data: { password: hashedPassword },
    });
    
    console.log(`✅ Success: Password updated for ${user.email}`);
  } catch (error: any) {
    console.error("❌ Error updating password:", error.message);
  } finally {
    process.exit();
  }
}

updateAdminPassword();
