-- ============================================
-- MON AMOUR — Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Categories
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  image text,
  description text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Products
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  price numeric(10,2) not null,
  sale_price numeric(10,2),
  images text[] default '{}',
  category_id uuid references categories(id) on delete set null,
  stock integer default 0,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Banners
create table if not exists banners (
  id uuid default gen_random_uuid() primary key,
  title text,
  subtitle text,
  image text not null,
  link text,
  is_active boolean default true,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- Cart
create table if not exists cart (
  id uuid default gen_random_uuid() primary key,
  session_id text not null,
  product_id uuid references products(id) on delete cascade,
  quantity integer default 1,
  added_at timestamptz default now()
);

-- Wishlist
create table if not exists wishlist (
  id uuid default gen_random_uuid() primary key,
  session_id text not null,
  product_id uuid references products(id) on delete cascade,
  added_at timestamptz default now(),
  unique(session_id, product_id)
);

-- Orders
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  session_id text not null,
  items jsonb not null default '[]',
  total numeric(10,2) not null,
  status text default 'pending',
  shipping_info jsonb,
  created_at timestamptz default now()
);

-- Page Views
create table if not exists page_views (
  id uuid default gen_random_uuid() primary key,
  page text not null,
  viewed_at timestamptz default now(),
  user_agent text
);

-- Product Clicks
create table if not exists product_clicks (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade,
  clicked_at timestamptz default now(),
  user_agent text,
  referrer text
);

-- Search Logs
create table if not exists search_logs (
  id uuid default gen_random_uuid() primary key,
  search_term text not null,
  results_count integer,
  searched_at timestamptz default now()
);

-- Filter Logs
create table if not exists filter_logs (
  id uuid default gen_random_uuid() primary key,
  filter_type text not null,
  filter_value text not null,
  used_at timestamptz default now()
);

-- Settings
create table if not exists settings (
  key text primary key,
  value text
);

-- ============================================
-- DEFAULT SETTINGS
-- ============================================
insert into settings (key, value) values
  ('announcement_bar', 'Free shipping on orders over $150 | New arrivals every week'),
  ('announcement_bar_active', 'true'),
  ('store_name', 'Mon Amour'),
  ('free_shipping_threshold', '150')
on conflict (key) do nothing;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
alter table categories enable row level security;
alter table products enable row level security;
alter table banners enable row level security;
alter table cart enable row level security;
alter table wishlist enable row level security;
alter table orders enable row level security;
alter table page_views enable row level security;
alter table product_clicks enable row level security;
alter table search_logs enable row level security;
alter table filter_logs enable row level security;
alter table settings enable row level security;

-- Public read access (storefront)
create policy "Public can read active categories" on categories for select using (is_active = true);
create policy "Public can read active products" on products for select using (is_active = true);
create policy "Public can read active banners" on banners for select using (is_active = true);
create policy "Public can read settings" on settings for select using (true);

-- Cart: session-based access
create policy "Anyone can manage their cart" on cart for all using (true) with check (true);

-- Wishlist: session-based access
create policy "Anyone can manage their wishlist" on wishlist for all using (true) with check (true);

-- Orders: anyone can insert (checkout), authenticated can read all
create policy "Anyone can place orders" on orders for insert with check (true);
create policy "Authenticated can read orders" on orders for select using (auth.role() = 'authenticated');
create policy "Authenticated can update orders" on orders for update using (auth.role() = 'authenticated');

-- Analytics: anyone can insert logs
create policy "Anyone can log page views" on page_views for insert with check (true);
create policy "Anyone can log clicks" on product_clicks for insert with check (true);
create policy "Anyone can log searches" on search_logs for insert with check (true);
create policy "Anyone can log filters" on filter_logs for insert with check (true);

-- Analytics: only authenticated can read
create policy "Authenticated can read analytics" on page_views for select using (auth.role() = 'authenticated');
create policy "Authenticated can read click logs" on product_clicks for select using (auth.role() = 'authenticated');

-- Admin full access to products/categories/banners
create policy "Authenticated can manage products" on products for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated can manage categories" on categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated can manage banners" on banners for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated can manage settings" on settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_active on products(is_active);
create index if not exists idx_products_featured on products(is_featured);
create index if not exists idx_cart_session on cart(session_id);
create index if not exists idx_wishlist_session on wishlist(session_id);
create index if not exists idx_orders_session on orders(session_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_page_views_page on page_views(page);

-- ============================================
-- SETUP NOTES
-- ============================================
-- 1. Run this entire file in the Supabase SQL Editor
-- 2. Create an admin user in Supabase Auth > Users > Add User
-- 3. Use that email/password to sign in at /admin
-- 4. (Optional) Create a storage bucket named "images" for image uploads
