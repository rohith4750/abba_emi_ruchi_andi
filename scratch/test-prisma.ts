import db from "../src/lib/db";

async function test() {
  try {
    const count = await db.customer.count();
    console.log("Customer count:", count);
    process.exit(0);
  } catch (e) {
    console.error("Error accessing db.customer:", e);
    process.exit(1);
  }
}

test();
