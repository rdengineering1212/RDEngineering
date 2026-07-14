const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Setting up Supabase Storage RLS policies for 'rd-engineering' bucket...");

  const queries = [
    `DROP POLICY IF EXISTS "Public Insert Policy" ON storage.objects;`,
    `DROP POLICY IF EXISTS "Public Select Policy" ON storage.objects;`,
    `DROP POLICY IF EXISTS "Public Delete Policy" ON storage.objects;`,
    `DROP POLICY IF EXISTS "Public Update Policy" ON storage.objects;`,
    
    `CREATE POLICY "Public Insert Policy" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'rd-engineering');`,
    `CREATE POLICY "Public Select Policy" ON storage.objects FOR SELECT TO public USING (bucket_id = 'rd-engineering');`,
    `CREATE POLICY "Public Delete Policy" ON storage.objects FOR DELETE TO public USING (bucket_id = 'rd-engineering');`,
    `CREATE POLICY "Public Update Policy" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'rd-engineering') WITH CHECK (bucket_id = 'rd-engineering');`
  ];

  for (const q of queries) {
    try {
      console.log(`Executing: ${q}`);
      await prisma.$executeRawUnsafe(q);
    } catch (err) {
      console.warn(`⚠️ Warning executing query: ${err.message}`);
    }
  }

  console.log("✅ Supabase Storage policies setup complete!");
}

main()
  .catch((e) => {
    console.error("❌ Unexpected error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
