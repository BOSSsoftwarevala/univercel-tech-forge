// Node script to generate SQL migration files from a manifest you provide.
// It WILL write files locally using the exact filenames in the manifest.
// Run: node generate_migrations.js manifest.json
//
// Each manifest entry must be:
// {
//   "filename": "supabase/migrations/20260313_add_HOSPITALITY_TOURISM.sql",
//   "category": "HOSPITALITY & TOURISM",
//   "subcategories": ["Hotel", "Resort", "..."],   // exact names verbatim
//   "header": "NO-EXTRA"                           // one of: NO-EXTRA, METADATA-EMPTY, WITH-SAFETY
// }

const fs = require('fs');
const path = require('path');

if (process.argv.length < 3) {
  console.error('Usage: node generate_migrations.js manifest.json');
  process.exit(2);
}

const manifestPath = process.argv[2];
if (!fs.existsSync(manifestPath)) {
  console.error('Manifest file not found:', manifestPath);
  process.exit(2);
}

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
} catch (err) {
  console.error('Failed to parse manifest.json:', err.message);
  process.exit(2);
}

function escapeSqlLiteral(s) {
  return s.replace(/'/g, "''");
}

for (const entry of manifest) {
  const filename = entry.filename;
  const category = entry.category;
  const subs = entry.subcategories || [];
  const headerMode = (entry.header || 'NO-EXTRA').toUpperCase();

  if (!filename || !category) {
    console.error('Skipping invalid entry (missing filename or category):', JSON.stringify(entry));
    continue;
  }

  // Ensure parent dir exists
  const dir = path.dirname(filename);
  if (dir && dir !== '.') {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Build SQL content (idempotent plpgsql DO block)
  let parts = [];

  if (headerMode === 'WITH-SAFETY') {
    parts.push(`-- WARNING: Generated migration file\n-- Filename must match your manifest exactly.\n-- Run on staging first and backup DB before applying.\n`);
  }

  parts.push(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";\n`);
  parts.push(`DO $$\nDECLARE\n  cat_id uuid;\nBEGIN\n  -- Find or create category (use the exact name provided)\n  SELECT id INTO cat_id FROM public.categories WHERE name = '${escapeSqlLiteral(category)}';\n  IF cat_id IS NULL THEN\n    INSERT INTO public.categories (id, name, metadata, created_at, updated_at)\n    VALUES (gen_random_uuid(), '${escapeSqlLiteral(category)}', jsonb_build_object('type','master'), now(), now())\n    RETURNING id INTO cat_id;\n  ELSE\n    UPDATE public.categories\n    SET updated_at = now()\n    WHERE id = cat_id;\n  END IF;\n\n  -- Ensure subcategories table exists (idempotent)\n  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subcategories') THEN\n    CREATE TABLE IF NOT EXISTS public.subcategories (\n      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n      category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,\n      name text NOT NULL,\n      slug text,\n      metadata jsonb NOT NULL DEFAULT '{}'::jsonb,\n      created_at timestamptz NOT NULL DEFAULT now(),\n      updated_at timestamptz NOT NULL DEFAULT now(),\n      UNIQUE (category_id, name)\n    );\n  END IF;\n\n`);

  // Upsert each subcategory (use exact names). Slug is generated from name but can be ignored if you want exact slug elsewhere.
  for (const sub of subs) {
    const slug = sub.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const metadataValue = headerMode === 'METADATA-EMPTY' ? "'{}'::jsonb" : "public.subcategories.metadata"; // for NO-EXTRA we'll leave existing metadata unchanged on conflict
    // Use ON CONFLICT DO UPDATE to be idempotent
    parts.push(`  BEGIN\n    INSERT INTO public.subcategories (id, category_id, name, slug, metadata, created_at, updated_at)\n    VALUES (gen_random_uuid(), cat_id, '${escapeSqlLiteral(sub)}', '${escapeSqlLiteral(slug)}', ${headerMode === 'METADATA-EMPTY' ? "'{}'::jsonb" : "'{}'::jsonb"}, now(), now())\n    ON CONFLICT (category_id, name) DO UPDATE\n    SET slug = COALESCE(EXCLUDED.slug, public.subcategories.slug),\n        updated_at = now();\n  EXCEPTION WHEN unique_violation THEN\n    NULL; -- ignore race condition\n  END;\n\n`);
  }

  parts.push(`END\n$$ LANGUAGE plpgsql;\n`);

  const content = parts.join('');

  try {
    fs.writeFileSync(filename, content, { encoding: 'utf8', flag: 'w' });
    console.log('Wrote:', filename);
  } catch (err) {
    console.error('Failed to write file', filename, err.message);
  }
}
