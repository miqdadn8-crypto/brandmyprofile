/**
 * scripts/importAll.ts
 * Run: npx tsx scripts/importAll.ts
 *
 * Imports:
 * - src/lib/data/services.json  -> services table
 * - src/lib/data/blogs.json     -> blogs table
 * - src/lib/data/jobs.json      -> jobs table
 * - src/lib/data/testimonials.json -> testimonials table
 * - src/lib/data/<region>/pricing.json -> region_pricing
 *
 * Environment:
 * VITE_SUPABASE_URL
 * VITE_SUPABASE_ANON_KEY
 */

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

const DATA_DIR = path.join(process.cwd(), "src", "lib", "data");

function readJSONSafe(filePath: string) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

async function importServices() {
  const file = path.join(DATA_DIR, "services.json");
  const raw = readJSONSafe(file);
  if (!raw) {
    console.log("services.json not found, skipping services import.");
    return;
  }

  // raw is an object of services keyed by slug
  const servicesArray = Object.values(raw).map((svc: any) => ({
    slug: svc.slug,
    title: svc.title,
    path: svc.path,
    hero_image: svc.heroImage || null,
    hero: svc.hero || {},
    seo: svc.seo || {},
    benefits: svc.benefits || [],
    how_it_works: svc.howItWorks || [],
    pricing_tiers: svc.pricingTiers || [],
    sections: svc.sections || {},
  }));

  console.log(`Importing ${servicesArray.length} services...`);
  const { error } = await supabase.from("services").upsert(servicesArray, { onConflict: "slug" });
  if (error) console.error("services upsert error:", error);
  else console.log("Services imported.");
}

async function importServiceTiers() {
  // Import pricing_tiers from services.json into service_pricing_tiers table
  const file = path.join(DATA_DIR, "services.json");
  const raw = readJSONSafe(file);
  if (!raw) return;
  const rows: any[] = [];

  for (const key of Object.keys(raw)) {
    const svc = raw[key];
    const tiers = svc.pricingTiers || [];
    for (const t of tiers) {
      rows.push({
        service_slug: svc.slug,
        tier: t.tier || t.name?.toLowerCase() || t.name,
        name: t.name || null,
        description: t.description || null,
        features: t.features || [],
        featured: !!t.featured,
      });
    }
  }

  if (rows.length === 0) return;
  console.log(`Importing ${rows.length} pricing tiers...`);
  const { error } = await supabase.from("service_pricing_tiers").upsert(rows, { onConflict: ["service_slug", "tier"] as any });
  if (error) console.error("service_pricing_tiers error:", error);
  else console.log("Pricing tiers imported.");
}

async function importTopLevelCollection(filename: string, table: string, transform?: (item: any) => any) {
  const file = path.join(DATA_DIR, filename);
  const raw = readJSONSafe(file);
  if (!raw) {
    console.log(`${filename} not found, skipping ${table}.`);
    return;
  }
  // raw may be array or object — if object, convert values to array
  const arr = Array.isArray(raw) ? raw : Object.values(raw);
  const payload = arr.map((item: any) => (transform ? transform(item) : item));
  console.log(`Importing ${payload.length} rows into ${table}...`);
  const { error } = await supabase.from(table).upsert(payload);
  if (error) console.error(`${table} upsert error:`, error);
  else console.log(`${table} imported.`);
}

async function importRegionPricing() {
  // Scan region folders for pricing.json
  const entries = fs.readdirSync(DATA_DIR);
  const regionFolders = entries.filter((e) => {
    const full = path.join(DATA_DIR, e);
    return fs.existsSync(full) && fs.statSync(full).isDirectory();
  });

  const rows: any[] = [];

  for (const region of regionFolders) {
    const pfile = path.join(DATA_DIR, region, "pricing.json");
    if (!fs.existsSync(pfile)) continue;
    const priceObj = readJSONSafe(pfile);
    if (!priceObj) continue;

    // Two common shapes: either object per service slug, or array
    if (Array.isArray(priceObj)) {
      // each item should have service_slug or slug + tier + price
      for (const item of priceObj) {
        if (!item.service_slug && item.slug) item.service_slug = item.slug;
        // expected: { service_slug, tier, price, currency, currency_symbol }
        rows.push({
          service_slug: item.service_slug,
          region,
          tier: item.tier || item.key || "basic",
          price: item.price ?? null,
          currency: item.currency ?? null,
          currency_symbol: item.currency_symbol ?? null,
        });
      }
    } else {
      // object keyed by service slug, each value may contain basic/pro/elite prices
      // e.g., { "cv-writing": { basic: 299, pro: 499, elite: 799 } }
      for (const svc of Object.keys(priceObj)) {
        const obj = priceObj[svc] || {};
        // try common keys
        const keys = Object.keys(obj);
        // if keys are tiers (basic/pro/elite)
        if (keys.length > 0 && keys.every(k => typeof obj[k] === "number" || obj[k] === null)) {
          for (const tier of keys) {
            rows.push({
              service_slug: svc,
              region,
              tier,
              price: obj[tier] ?? null,
              currency: obj.currency ?? null,
              currency_symbol: obj.currency_symbol ?? null,
            });
          }
        } else {
          // fallback: store as a single json under pricing table (not preferred)
          // For safety, push a 'default' tier with full object
          rows.push({
            service_slug: svc,
            region,
            tier: "default",
            price: null,
            currency: null,
            currency_symbol: null,
          });
        }
      }
    }
  }

  if (rows.length === 0) {
    console.log("No region pricing rows found, skipping.");
    return;
  }

  console.log(`Importing ${rows.length} region pricing rows...`);
  // Upsert unique constraint service_slug, region, tier exists
  // Upsert by composite is not directly supported in client; we'll use RPC-like approach by onConflict with a single index name if necessary.
  const { error } = await supabase.from("region_pricing").upsert(rows, { onConflict: ["service_slug", "region", "tier"] as any });
  if (error) console.error("region_pricing upsert error:", error);
  else console.log("Region pricing imported.");
}

async function main() {
  try {
    await importServices();
    await importServiceTiers();

    // top-level collections: jobs, blogs, testimonials
    await importTopLevelCollection("jobs.json", "jobs", (j: any) => ({
      region: j.region ?? null,
      title: j.title ?? j.job_title ?? null,
      company: j.company ?? null,
      location: j.location ?? null,
      salary: j.salary ?? null,
      apply_url: j.apply_url ?? j.url ?? null,
      description: j.description ?? j.summary ?? null,
      posted_at: j.posted_at ?? null,
    }));

    await importTopLevelCollection("blogs.json", "blogs", (b: any) => ({
      slug: b.slug ?? (b.title && b.title.toLowerCase().replace(/\s+/g, "-")),
      title: b.title ?? null,
      excerpt: b.excerpt ?? b.description ?? null,
      cover_image: b.cover_image ?? b.image ?? null,
      content: b.content ?? b.body ?? null,
      tags: b.tags ?? null,
      author: b.author ?? null,
      published_at: b.published_at ?? b.date ?? null,
    }));

    await importTopLevelCollection("testimonials.json", "testimonials", (t: any) => ({
      name: t.name ?? t.author ?? null,
      title: t.title ?? null,
      message: t.message ?? t.body ?? null,
      region: t.region ?? null,
    }));

    await importRegionPricing();

    console.log("✅ Import finished.");
    process.exit(0);
  } catch (err) {
    console.error("Import failed:", err);
    process.exit(1);
  }
}

main();
