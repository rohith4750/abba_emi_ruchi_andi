const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "admin@abbami.com";
  const password = "newpassword";
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
    console.log("✅ Admin password updated to: " + password);
  } catch (e) {
    console.error("❌ Failed to update password:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
