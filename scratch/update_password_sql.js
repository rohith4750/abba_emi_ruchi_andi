const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const connectionString = "postgresql://neondb_owner:npg_meKad0L4TVBz@ep-long-poetry-amb9mzml.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function main() {
  const pool = new Pool({ connectionString });
  const email = "admin@abbami.com";
  const password = "newpassword";
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "UPDATE \"User\" SET password = $1 WHERE email = $2 RETURNING email";
    const res = await pool.query(query, [hashedPassword, email]);
    
    if (res.rowCount > 0) {
      console.log("✅ Admin password updated for: " + res.rows[0].email);
    } else {
      console.log("⚠️ User not found: " + email);
    }
  } catch (e) {
    console.error("❌ SQL Error:", e.message);
  } finally {
    await pool.end();
  }
}

main();
