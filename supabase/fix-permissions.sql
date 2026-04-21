-- Run this in Supabase SQL Editor to fix "permission denied for schema public"

-- 1. Grant schema access to both roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 2. Authenticated role (your logged-in admin) — full access
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 3. Anon role (storefront visitors) — limited access
GRANT SELECT ON products, categories, banners, settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON cart, wishlist TO anon;
GRANT INSERT ON orders, page_views, product_clicks, search_logs, filter_logs TO anon;
GRANT SELECT ON orders TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- 4. Future tables will also get these grants automatically
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO authenticated;
