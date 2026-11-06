-- 0003_storage.sql — Supabase Storage Buckets and Media Access Policies
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
 ('menu-images','menu-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif']),
 ('gallery','gallery', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif']),
 ('branding','branding', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do nothing;

create policy "public read media" on storage.objects for select
  using (bucket_id in ('menu-images','gallery','branding'));
create policy "admin write media" on storage.objects for insert
  with check (bucket_id in ('menu-images','gallery','branding') and is_admin());
create policy "admin update media" on storage.objects for update
  using (bucket_id in ('menu-images','gallery','branding') and is_admin());
create policy "admin delete media" on storage.objects for delete
  using (bucket_id in ('menu-images','gallery','branding') and is_admin());
