-- 0002_rls.sql — Row Level Security Policies and Admin Auth Verification
create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admin_users where user_id = auth.uid());
$$;
revoke all on function is_admin() from public;
grant execute on function is_admin() to anon, authenticated;

alter table admin_users    enable row level security;
alter table site_settings  enable row level security;
alter table categories     enable row level security;
alter table menu_items     enable row level security;
alter table branches       enable row level security;
alter table gallery_images enable row level security;
alter table banners        enable row level security;
alter table testimonials   enable row level security;
alter table enquiries      enable row level security;
alter table audit_log      enable row level security;

-- Public read policies (only active/published records)
create policy "public read settings"     on site_settings  for select using (true);
create policy "public read categories"   on categories     for select using (is_active);
create policy "public read items"        on menu_items     for select using (is_active);
create policy "public read branches"     on branches       for select using (is_active);
create policy "public read gallery"      on gallery_images for select using (is_active);
create policy "public read testimonials" on testimonials   for select using (is_active);
create policy "public read banners"      on banners        for select using (
  is_active and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at >= now())
);

-- Admin full CRUD policies
create policy "admin all settings"     on site_settings  for all using (is_admin()) with check (is_admin());
create policy "admin all categories"   on categories     for all using (is_admin()) with check (is_admin());
create policy "admin all items"        on menu_items     for all using (is_admin()) with check (is_admin());
create policy "admin all branches"     on branches       for all using (is_admin()) with check (is_admin());
create policy "admin all gallery"      on gallery_images for all using (is_admin()) with check (is_admin());
create policy "admin all banners"      on banners        for all using (is_admin()) with check (is_admin());
create policy "admin all testimonials" on testimonials   for all using (is_admin()) with check (is_admin());

-- Enquiries: admin read/update/delete only (public submissions handled via server function/actions)
create policy "admin read enquiries"   on enquiries for select using (is_admin());
create policy "admin update enquiries" on enquiries for update using (is_admin()) with check (is_admin());
create policy "admin delete enquiries" on enquiries for delete using (is_admin());

-- Audit log & self admin check
create policy "admin read audit"    on audit_log   for select using (is_admin());
create policy "admin insert audit"  on audit_log   for insert with check (is_admin());
create policy "self read admin row" on admin_users for select using (user_id = auth.uid());
