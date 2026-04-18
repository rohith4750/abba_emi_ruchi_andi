import db from "./src/lib/db";

async function main() {
  console.log("Prisma Models:", Object.keys(db).filter(k => !k.startsWith("_")));
}

main();
