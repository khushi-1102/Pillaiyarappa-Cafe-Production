-- seed.sql — Verified Production Seed Data
insert into site_settings (
  id, brand_name, phone_primary, phone_secondary, whatsapp_number,
  whatsapp_default_text, delivery_text, delivery_min_order_inr, catering_text, announcement_active
) values (
  1,
  'Pillaiyarappa — South Indian Corner',
  '9899101195',
  '9953919033',
  '919899101195',
  'Hello Pillaiyarappa South Indian Corner, I would like to enquire about a catering/party order.',
  'Free Home Delivery',
  500,
  'Contact for Parties & Catering Orders',
  false
) on conflict (id) do nothing;

insert into categories (slug, name, sort_order) values
 ('dosas', 'Dosas', 1),
 ('idlis', 'Idlis', 2),
 ('vadas', 'Vadas', 3),
 ('uttapams', 'Uttapams', 4),
 ('south-indian-favourites', 'South Indian Favourites', 5)
on conflict (slug) do nothing;

insert into branches (slug, name, address, phone, maps_url, sort_order) values
 (
   'branch-1',
   'Branch - 1',
   'Shop No. 3, Opp. Mayom Hospital, South City-1, Gurugram',
   '9899101195',
   'https://www.google.com/maps/search/?api=1&query=Shop+No.+3+Opp.+Mayom+Hospital+South+City-1+Gurugram',
   1
 ),
 (
   'branch-2',
   'Branch - 2',
   'Shop No. 48, Sec-40, Huda Market, Gurugram',
   '9953919033',
   'https://www.google.com/maps/search/?api=1&query=Shop+No.+48+Sec-40+Huda+Market+Gurugram',
   2
 )
on conflict (slug) do nothing;
