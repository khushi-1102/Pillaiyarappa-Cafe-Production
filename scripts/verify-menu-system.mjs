// scripts/verify-menu-system.mjs
// Comprehensive Acceptance Test Suite for Pillaiyarappa Dynamic Menu System strictly verified against MENU MAIN.pdf

const BASE_URL = 'http://localhost:3000';

const EXPECTED_PDF_ITEMS = {
  'Plain Dosa': 120,
  'Masala Dosa': 130,
  'Onion Masala Dosa': 150,
  'Onion Plain Dosa': 140,
  'Butter Plain Dosa': 140,
  'Butter Masala Dosa': 150,
  'Paper Plain Dosa': 170,
  'Paper Masala Dosa': 180,
  'Paneer Dosa': 180,
  'Butter Paneer Dosa': 190,
  'Mysoor Paneer Dosa': 200,
  'Rawa Paneer Dosa': 190,
  'Rawa Mysoor Paneer Dosa': 210,
  'Rawa Mysoor Plain Dosa': 180,
  'Rawa Mysoor Masala Dosa': 190,
  'Mysoor Plain Dosa': 170,
  'Mysoor Masala Dosa': 180,
  'Rawa Plain Dosa': 150,
  'Rawa Masala Dosa': 160,
  'Rawa Onion Dosa': 160,
  'Rawa Onion Masala Dosa': 170,
  'Rawa Coconut Dosa': 190,
  'Rawa Coconut Masala Dosa': 200,
  'Veg Rawa Plain Dosa': 170,
  'Veg Rawa Masala Dosa': 180,
  'Podi Plain Dosa': 140,
  'Podi Masala Dosa': 150,
  'Ghee Roasted Plain Dosa': 170,
  'Ghee Roasted Masala Dosa': 180,
  'Upma': 170,
  'Set Dosa': 160,
  '1 Idli + 1 Vada + Mini Masala Dosa + Mini Onion Uttappam': 250,
  'Onion Uttappam': 160,
  'Onion Tomato Uttappam': 160,
  'Mix Veg Uttappam': 170,
  'Coconut Uttappam': 180,
  'Masala Uttappam': 170,
  'Paneer Uttappam': 180,
  'Idli Sambar (2 Pcs.)': 90,
  'Ghee Podi Idli (2 Pcs.)': 160,
  'Fried Idli (3 Pcs.)': 180,
  'Vada Sambar (2 Pcs.)': 100,
  'Dahi Vada (2 Pcs.)': 170,
  'Dal Vada (4 Pcs.)': 120,
  'Idli Vada Combo': 100,
  'Idli Sambar (1 Pc.)': 50,
  'Vada Sambar (1 Pc.)': 60,
  'Sambar Rice': 120,
  'Lemon Rice': 150,
  'Tomato Rice': 150,
  'Coconut Rice': 180,
  'Curd Rice': 140,
  'Filter Coffee': 50,
  'Cold Drink': 'MRP',
  'Water': 'MRP',
};

async function runTests() {
  console.log('=== STARTING STRICT PDF PRICING & ACCEPTANCE VERIFICATION ===\n');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`[PASS] Test ${total}: ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] Test ${total}: ${message}`);
      process.exitCode = 1;
    }
  }

  // 1. Health & Server Engine
  const healthRes = await fetch(`${BASE_URL}/api/health`).then((r) => r.json());
  assert(healthRes.status === 'ok' && healthRes.service.includes('Pillaiyarappa'), 'API health endpoint is running');

  // 2. Public Categories (Exact 10 from PDF)
  const catRes = await fetch(`${BASE_URL}/api/menu/categories`).then((r) => r.json());
  assert(
    catRes.success && catRes.data.length === 10,
    `Exact 10 PDF categories loaded from DB (${catRes.data.map((c) => c.name).join(', ')})`
  );

  // 3. Public Items & Total Count (Exact 55 items from PDF)
  const itemsRes = await fetch(`${BASE_URL}/api/menu/items`).then((r) => r.json());
  assert(
    itemsRes.success && itemsRes.data.length === 55,
    `Exact 55 PDF menu items loaded from DB (${itemsRes.data.length} items)`
  );

  // 4. Strict PDF Pricing Verification for all 55 items
  let priceMismatches = [];
  for (const [name, expectedPrice] of Object.entries(EXPECTED_PDF_ITEMS)) {
    const item = itemsRes.data.find((i) => i.name.toLowerCase() === name.toLowerCase());
    if (!item) {
      priceMismatches.push(`Missing: "${name}"`);
    } else if (expectedPrice === 'MRP') {
      if (item.priceType !== 'mrp') {
        priceMismatches.push(`"${name}" expected MRP, got priceType="${item.priceType}"`);
      }
    } else {
      if (item.price !== expectedPrice) {
        priceMismatches.push(`"${name}" expected ₹${expectedPrice}, got ₹${item.price}`);
      }
    }
  }
  assert(
    priceMismatches.length === 0,
    priceMismatches.length === 0
      ? 'All 55 items strictly match MENU MAIN.pdf pricing matrix (including fixed prices & MRP)'
      : `Pricing mismatches found: ${priceMismatches.join('; ')}`
  );

  // 5. Category Filtering (e.g. cat-dosa returns 8 items)
  const dosaItemsRes = await fetch(`${BASE_URL}/api/menu/items?category=cat-dosa`).then((r) => r.json());
  assert(
    dosaItemsRes.success && dosaItemsRes.data.length === 8 && dosaItemsRes.data.every((i) => i.categoryId === 'cat-dosa'),
    `Category filtering returns all 8 Dosa category items from PDF`
  );

  // 6. Search functionality
  const searchRes = await fetch(`${BASE_URL}/api/menu/items?search=masala`).then((r) => r.json());
  assert(
    searchRes.success && searchRes.data.length > 0 && searchRes.data.some((i) => i.name.toLowerCase().includes('masala')),
    `Search for "masala" returns matched dishes (${searchRes.data.length} matches)`
  );

  // 7. Add-ons & Amul Butter @ ₹20 ("In Any Item")
  const addonsRes = await fetch(`${BASE_URL}/api/menu/addons`).then((r) => r.json());
  const butterAddon = addonsRes.data.find((a) => a.name.toLowerCase().includes('amul butter'));
  assert(
    addonsRes.success && butterAddon && butterAddon.price === 20 && butterAddon.applicableCategories.includes('all'),
    `Amul Butter add-on strictly configured at ₹20 applicable to any item`
  );

  // 8. Delivery Settings (Min order ₹500, phone 9899101195, WhatsApp 9953919033)
  const settingsRes = await fetch(`${BASE_URL}/api/menu/settings`).then((r) => r.json());
  assert(
    settingsRes.success &&
      settingsRes.data.deliveryMinOrder === 500 &&
      settingsRes.data.phonePrimary === '9899101195' &&
      settingsRes.data.whatsappNumber.includes('9953919033'),
    `Site settings strictly verified: Free delivery min ₹500, Phone: 9899101195, WhatsApp: 9953919033`
  );

  // 9. Admin Authentication
  const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@pillaiyarappa.com', password: 'Pillaiyarappa@2026' }),
  }).then((r) => r.json());
  assert(loginRes.success && loginRes.user.email === 'admin@pillaiyarappa.com', 'Admin login succeeds with credentials');

  // 10. Admin 1-Click Availability Toggle
  const firstItemId = itemsRes.data[0].id;
  const toggleRes = await fetch(`${BASE_URL}/api/admin/menu/items/${firstItemId}/toggle-available`, {
    method: 'PATCH',
  }).then((r) => r.json());
  assert(toggleRes.success, `Toggle availability response successful (new state: ${toggleRes.data.isAvailable})`);
  // Toggle back to available
  if (!toggleRes.data.isAvailable) {
    await fetch(`${BASE_URL}/api/admin/menu/items/${firstItemId}/toggle-available`, { method: 'PATCH' });
  }

  // 11. Admin CRUD: Create and Delete Test Dish
  const testDishName = `Special Test Dish ${Date.now()}`;
  const createDishRes = await fetch(`${BASE_URL}/api/admin/menu/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: testDishName,
      categoryId: 'cat-dosa',
      price: 199,
      description: 'Automated acceptance test dish',
    }),
  }).then((r) => r.json());
  assert(createDishRes.success && createDishRes.data.id, `Admin created test menu item: ${testDishName}`);

  const deleteDishRes = await fetch(`${BASE_URL}/api/admin/menu/items/${createDishRes.data.id}`, {
    method: 'DELETE',
  }).then((r) => r.json());
  assert(deleteDishRes.success, `Admin deleted test menu item ${createDishRes.data.id}`);

  // 12. Security Audit Log Persistence
  const auditRes = await fetch(`${BASE_URL}/api/admin/audit-logs`).then((r) => r.json());
  assert(auditRes.success && auditRes.data.length > 0, `Audit log trail verified (${auditRes.data.length} audit entries)`);

  console.log(`\n=== RESULTS: ${passed}/${total} TESTS PASSED ===`);
  if (passed === total) {
    console.log('ALL STRICT PDF PRICING & ACCEPTANCE TESTS PASSED WITH 100% SUCCESS!\n');
  }
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
