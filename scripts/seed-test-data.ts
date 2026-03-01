import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seedData() {
  console.log("🌱 Seeding test data...");

  // Get existing product
  const { data: products } = await supabase
    .from("products")
    .select("product_id")
    .limit(1);

  if (!products || products.length === 0) {
    console.log("❌ No products found. Create a product first.");
    return;
  }

  const productId = products[0].product_id;

  // Note: user_id must reference an actual auth.users entry
  // Replace with a real user UUID before running this seed
  const TEST_USER_ID = process.env.TEST_BOSS_USER_ID || "00000000-0000-0000-0000-000000000000";

  // Create test boss user role
  const { data: testBoss } = await supabase
    .from("user_roles")
    .insert({
      user_id: TEST_USER_ID,
      role: "boss_owner",
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  console.log("✅ Test data seeded successfully");
  console.log(`Product ID: ${productId}`);
  console.log(`Test Boss Role: ${testBoss?.id}`);
}

seedData().catch(console.error);
