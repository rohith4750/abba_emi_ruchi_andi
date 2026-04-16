import db from "../src/lib/db";

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

async function fixSlugs() {
  console.log("Starting Slug Synchronization...");

  // Fix Categories
  const categories = await db.category.findMany();
  for (const cat of categories) {
    const newSlug = slugify(cat.slug);
    if (newSlug !== cat.slug) {
      console.log(`Updating Category Slug: ${cat.slug} -> ${newSlug}`);
      await db.category.update({
        where: { id: cat.id },
        data: { slug: newSlug }
      });
    }
  }

  // Fix Products
  const products = await db.product.findMany();
  for (const prod of products) {
    const newSlug = slugify(prod.slug);
    if (newSlug !== prod.slug) {
      console.log(`Updating Product Slug: ${prod.slug} -> ${newSlug}`);
      await db.product.update({
        where: { id: prod.id },
        data: { slug: newSlug }
      });
    }
  }

  console.log("Slug Synchronization Complete!");
  process.exit(0);
}

fixSlugs().catch(err => {
  console.error(err);
  process.exit(1);
});
