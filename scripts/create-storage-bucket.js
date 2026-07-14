// Run with: node scripts/create-storage-bucket.js
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Manual .env parsing
const envPath = path.join(__dirname, "../.env");
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([A-Z_]+)="?(.+?)"?\s*$/);
  if (match) env[match[1]] = match[2];
});

const supabaseUrl = env["NEXT_PUBLIC_SUPABASE_URL"];
const serviceRoleKey = env["SUPABASE_SERVICE_ROLE_KEY"];

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function main() {
  console.log("🔄 Creating storage bucket 'rd-engineering'...");

  // Try creating the bucket
  const { data, error } = await supabase.storage.createBucket("rd-engineering", {
    public: true,
    fileSizeLimit: 52428800, // 50MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"],
  });

  if (error) {
    if (error.message && error.message.toLowerCase().includes("already exists")) {
      console.log("ℹ️  Bucket already exists — updating to public...");
      const { error: updateErr } = await supabase.storage.updateBucket("rd-engineering", {
        public: true,
        fileSizeLimit: 52428800,
      });
      if (updateErr) {
        console.error("❌ Error updating bucket:", updateErr.message);
      } else {
        console.log("✅ Bucket 'rd-engineering' updated to public.");
      }
    } else {
      console.error("❌ Error creating bucket:", error.message);
      process.exit(1);
    }
  } else {
    console.log("✅ Bucket 'rd-engineering' created successfully:", data);
  }

  // Also create the 'gallery', 'projects', 'services', 'clients' folders by uploading a placeholder
  // (Supabase doesn't need folder creation — they're implicit in the path)
  console.log("\n✅ Storage bucket ready!");
  console.log("   Upload path format: rd-engineering/gallery/<filename>");
  console.log("   Public URL: " + supabaseUrl + "/storage/v1/object/public/rd-engineering/<path>");
}

main().catch((err) => {
  console.error("❌ Unexpected error:", err.message);
  process.exit(1);
});
