import db from "../src/lib/db";

async function main() {
  const cats = await db.category.findMany();
  console.log("CATEGORIES:");
  console.log(cats);
  
  const prods = await db.product.findMany({ include: { category: true } });
  console.log("PRODUCTS:");
  console.log(prods);
  
  process.exit(0);
}

main();
