import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  MenuCategory,
  MenuItem,
  MenuAddOn,
  SiteSettings,
  DatabaseSchema,
  TableReservation,
  ReservationStatus,
} from './schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data directory & DB file path (resolves to server/data in both dev & production bundle)
const possibleDataDirs = [
  path.resolve(__dirname, 'data'),
  path.resolve(__dirname, '../data'),
  path.resolve(process.cwd(), 'server/data'),
];
const DATA_DIR = possibleDataDirs.find((dir) => fs.existsSync(path.join(dir, 'db.json'))) || possibleDataDirs[0];
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 10 Menu Categories as strictly transcribed from MENU MAIN.pdf
export const DEFAULT_CATEGORIES: MenuCategory[] = [
  {
    id: 'cat-dosa',
    name: 'Dosa',
    slug: 'dosa',
    description: 'Crisp golden crepes made from fermented batter, served with hot sambar and fresh chutneys.',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'cat-paneer-dosa',
    name: 'Paneer Dosa',
    slug: 'paneer-dosa',
    description: 'Crisp savory crepes filled with freshly seasoned cottage cheese and aromatic herbs.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'cat-mysore-dosa',
    name: 'Mysore Dosa',
    slug: 'mysore-dosa',
    description: 'Signature crepes layered with spicy red garlic-chutney paste, melted butter and fillings.',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 'cat-rawa-dosa',
    name: 'Rawa Dosa',
    slug: 'rawa-dosa',
    description: 'Lacy, extra-crispy semolina crepes tempered with crushed black pepper, cumin, ginger, and curry leaves.',
    image: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    sortOrder: 4,
  },
  {
    id: 'cat-specials',
    name: 'Pillaiyarappa Specials',
    slug: 'pillaiyarappa-specials',
    description: 'Chef signature Podi dosas, rich Ghee roasted varieties, traditional Upma, and soft Set Dosas.',
    image: '/images/about-south-indian-heritage.jpg',
    isActive: true,
    sortOrder: 5,
  },
  {
    id: 'cat-platter',
    name: 'South Indian Platter',
    slug: 'south-indian-platter',
    description: 'The ultimate royal tasting platter with 1 Idli, 1 Vada, Mini Masala Dosa, and Mini Onion Uttappam.',
    image: '/uploads/menu/menu-South_Indian_Breakfast_Thali-1792874072538-703231.png',
    isActive: true,
    sortOrder: 6,
  },
  {
    id: 'cat-uttappam',
    name: 'Uttappam',
    slug: 'uttappam',
    description: 'Thick, spongy fermented savory pancakes crowned with sweet onions, tomatoes, and fresh toppings.',
    image: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    sortOrder: 7,
  },
  {
    id: 'cat-idli-vada',
    name: 'Idli & Vada',
    slug: 'idli-vada',
    description: 'Pillow-soft steamed fermented rice cakes, crispy golden lentil vadas, dahi vadas, and dal vadas.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    sortOrder: 8,
  },
  {
    id: 'cat-rice',
    name: 'Rice',
    slug: 'rice',
    description: 'Traditional comforting rice meals: Sambar Rice, Lemon Rice, Tomato Rice, Coconut Rice, and Curd Rice.',
    image: '/uploads/menu/menu-Rustic_Sambar_Rice_Thali_on_Ba-1792874403369-310675.png',
    isActive: true,
    sortOrder: 9,
  },
  {
    id: 'cat-beverages',
    name: 'Beverages',
    slug: 'beverages',
    description: 'Authentic decocted South Indian Filter Kaapi frothed with milk, cold drinks, and mineral water at MRP.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    sortOrder: 10,
  },
];

// Add-ons as strictly defined in MENU MAIN.pdf
export const DEFAULT_ADDONS: MenuAddOn[] = [
  {
    id: 'addon-butter',
    name: 'Amul Butter',
    price: 20,
    priceType: 'fixed',
    isAvailable: true,
    applicableCategories: ['all'],
    sortOrder: 1,
  },
  {
    id: 'addon-ghee',
    name: 'Pure Desi Ghee Topping',
    price: 30,
    priceType: 'fixed',
    isAvailable: true,
    applicableCategories: ['all'],
    sortOrder: 2,
  },
  {
    id: 'addon-gunpowder',
    name: 'Gunpowder (Podi) with Pure Ghee',
    price: 35,
    priceType: 'fixed',
    isAvailable: true,
    applicableCategories: ['all'],
    sortOrder: 3,
  },
  {
    id: 'addon-extra-sambar',
    name: 'Extra Sambar (Large Bowl)',
    price: 40,
    priceType: 'fixed',
    isAvailable: true,
    applicableCategories: ['all'],
    sortOrder: 4,
  },
  {
    id: 'addon-extra-chutney',
    name: 'Extra Coconut & Tomato Chutney',
    price: 30,
    priceType: 'fixed',
    isAvailable: true,
    applicableCategories: ['all'],
    sortOrder: 5,
  },
];

// 55 Menu Items (53 Fixed-Price + 2 MRP) with EXACT STRICT PRICING from MENU MAIN.pdf
export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  // --- 1. DOSA ---
  {
    id: 'item-plain-dosa',
    categoryId: 'cat-dosa',
    name: 'Plain Dosa',
    slug: 'plain-dosa',
    description: 'Crisp golden crepe roasted on cast iron pan, served with piping hot sambar and fresh chutneys.',
    price: 120,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
    sortOrder: 1,
    applicableAddonIds: ['addon-butter', 'addon-ghee', 'addon-gunpowder', 'addon-extra-sambar'],
  },
  {
    id: 'item-masala-dosa',
    categoryId: 'cat-dosa',
    name: 'Masala Dosa',
    slug: 'masala-dosa',
    description: 'Crispy fermented crepe stuffed with signature spiced potato mash, mustard seeds and curry leaves.',
    price: 130,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    sortOrder: 2,
    applicableAddonIds: ['addon-butter', 'addon-ghee', 'addon-gunpowder', 'addon-extra-sambar'],
  },
  {
    id: 'item-onion-masala-dosa',
    categoryId: 'cat-dosa',
    name: 'Onion Masala Dosa',
    slug: 'onion-masala-dosa',
    description: 'Golden dosa loaded with caramelized red onions and signature spiced aloo masala filling.',
    price: 150,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 3,
    applicableAddonIds: ['addon-butter', 'addon-ghee', 'addon-extra-sambar'],
  },
  {
    id: 'item-onion-plain-dosa',
    categoryId: 'cat-dosa',
    name: 'Onion Plain Dosa',
    slug: 'onion-plain-dosa',
    description: 'Crispy crepe sprinkled with sweet finely chopped onions and green chillies before folding.',
    price: 140,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 4,
    applicableAddonIds: ['addon-butter', 'addon-ghee', 'addon-extra-sambar'],
  },
  {
    id: 'item-butter-plain-dosa',
    categoryId: 'cat-dosa',
    name: 'Butter Plain Dosa',
    slug: 'butter-plain-dosa',
    description: 'Crisp golden crepe roasted generously with pure Amul Butter, served with sambar and chutneys.',
    price: 140,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 5,
    applicableAddonIds: ['addon-butter', 'addon-extra-sambar'],
  },
  {
    id: 'item-butter-masala-dosa',
    categoryId: 'cat-dosa',
    name: 'Butter Masala Dosa',
    slug: 'butter-masala-dosa',
    description: 'Rich crispy crepe smothered with Amul Butter, stuffed with seasoned aromatic potato aloo masala.',
    price: 150,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 6,
    applicableAddonIds: ['addon-butter', 'addon-extra-sambar'],
  },
  {
    id: 'item-paper-plain-dosa',
    categoryId: 'cat-dosa',
    name: 'Paper Plain Dosa',
    slug: 'paper-plain-dosa',
    description: 'Extra thin, jumbo size paper-crisp dosa roasted golden with authentic South Indian flavours.',
    price: 170,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 7,
    applicableAddonIds: ['addon-butter', 'addon-ghee', 'addon-extra-sambar'],
  },
  {
    id: 'item-paper-masala-dosa',
    categoryId: 'cat-dosa',
    name: 'Paper Masala Dosa',
    slug: 'paper-masala-dosa',
    description: 'Jumbo wafer-thin paper dosa filled with classic spiced potato masala, served with chutneys.',
    price: 180,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 8,
    applicableAddonIds: ['addon-butter', 'addon-ghee', 'addon-extra-sambar'],
  },

  // --- 2. PANEER DOSA ---
  {
    id: 'item-paneer-dosa',
    categoryId: 'cat-paneer-dosa',
    name: 'Paneer Dosa',
    slug: 'paneer-dosa',
    description: 'Golden roasted dosa stuffed with freshly grated cottage cheese seasoned with South Indian spices.',
    price: 180,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 1,
    applicableAddonIds: ['addon-butter', 'addon-ghee', 'addon-extra-sambar'],
  },
  {
    id: 'item-butter-paneer-dosa',
    categoryId: 'cat-paneer-dosa',
    name: 'Butter Paneer Dosa',
    slug: 'butter-paneer-dosa',
    description: 'Crispy crepe roasted with pure Amul Butter, packed with succulent spiced paneer stuffing.',
    price: 190,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 2,
    applicableAddonIds: ['addon-butter', 'addon-extra-sambar'],
  },
  {
    id: 'item-mysoor-paneer-dosa',
    categoryId: 'cat-paneer-dosa',
    name: 'Mysoor Paneer Dosa',
    slug: 'mysoor-paneer-dosa',
    description: 'Spicy Mysore red garlic chutney smeared dosa loaded with seasoned cottage cheese filling.',
    price: 200,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 3,
    applicableAddonIds: ['addon-butter', 'addon-extra-sambar'],
  },
  {
    id: 'item-rawa-paneer-dosa',
    categoryId: 'cat-paneer-dosa',
    name: 'Rawa Paneer Dosa',
    slug: 'rawa-paneer-dosa',
    description: 'Lacy semolina crepe embedded with crushed cumin, curry leaves, and seasoned paneer crumble.',
    price: 190,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 4,
    applicableAddonIds: ['addon-butter', 'addon-extra-sambar'],
  },
  {
    id: 'item-rawa-mysoor-paneer-dosa',
    categoryId: 'cat-paneer-dosa',
    name: 'Rawa Mysoor Paneer Dosa',
    slug: 'rawa-mysoor-paneer-dosa',
    description: 'Deluxe lacy semolina crepe layered with fiery red Mysore paste and rich spiced cottage cheese.',
    price: 210,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 5,
    applicableAddonIds: ['addon-butter', 'addon-extra-sambar'],
  },

  // --- 3. MYSORE DOSA ---
  {
    id: 'item-mysoor-plain-dosa',
    categoryId: 'cat-mysore-dosa',
    name: 'Mysoor Plain Dosa',
    slug: 'mysoor-plain-dosa',
    description: 'Crisp dosa layered with fiery red garlic-chilli chutney paste, roasted golden with desi butter.',
    price: 170,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 1,
    applicableAddonIds: ['addon-butter', 'addon-ghee', 'addon-extra-sambar'],
  },
  {
    id: 'item-mysoor-masala-dosa',
    categoryId: 'cat-mysore-dosa',
    name: 'Mysoor Masala Dosa',
    slug: 'mysoor-masala-dosa',
    description: 'Classic Mysore special: spicy red chutney spread over crisp crepe with seasoned potato aloo masala.',
    price: 180,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 2,
    applicableAddonIds: ['addon-butter', 'addon-ghee', 'addon-extra-sambar'],
  },
  {
    id: 'item-rawa-mysoor-plain-dosa',
    categoryId: 'cat-mysore-dosa',
    name: 'Rawa Mysoor Plain Dosa',
    slug: 'rawa-mysoor-plain-dosa',
    description: 'Lacy semolina crepe lined with tangy Mysore red paste, cooked to a delicate crunch.',
    price: 180,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 3,
    applicableAddonIds: ['addon-butter', 'addon-extra-sambar'],
  },
  {
    id: 'item-rawa-mysoor-masala-dosa',
    categoryId: 'cat-mysore-dosa',
    name: 'Rawa Mysoor Masala Dosa',
    slug: 'rawa-mysoor-masala-dosa',
    description: 'Lacy semolina crepe brushed with spicy Mysore paste, filled with savory spiced potato mash.',
    price: 190,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 4,
    applicableAddonIds: ['addon-butter', 'addon-extra-sambar'],
  },

  // --- 4. RAWA DOSA ---
  {
    id: 'item-rawa-plain-dosa',
    categoryId: 'cat-rawa-dosa',
    name: 'Rawa Plain Dosa',
    slug: 'rawa-plain-dosa',
    description: 'Golden lacy semolina crepe infused with whole cumin, crushed black peppercorns and curry leaves.',
    price: 150,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 1,
    applicableAddonIds: ['addon-butter', 'addon-ghee', 'addon-extra-sambar'],
  },
  {
    id: 'item-rawa-masala-dosa',
    categoryId: 'cat-rawa-dosa',
    name: 'Rawa Masala Dosa',
    slug: 'rawa-masala-dosa',
    description: 'Lacy crisp semolina crepe stuffed with authentic spiced potato aloo masala.',
    price: 160,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 2,
    applicableAddonIds: ['addon-butter', 'addon-ghee', 'addon-extra-sambar'],
  },
  {
    id: 'item-rawa-onion-dosa',
    categoryId: 'cat-rawa-dosa',
    name: 'Rawa Onion Dosa',
    slug: 'rawa-onion-dosa',
    description: 'Crunchy semolina crepe scattered with sweet diced onions and green chillies.',
    price: 160,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 3,
    applicableAddonIds: ['addon-butter', 'addon-extra-sambar'],
  },
  {
    id: 'item-rawa-onion-masala-dosa',
    categoryId: 'cat-rawa-dosa',
    name: 'Rawa Onion Masala Dosa',
    slug: 'rawa-onion-masala-dosa',
    description: 'Signature crispy rawa crepe studded with caramelized onions and filled with potato masala.',
    price: 170,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 4,
    applicableAddonIds: ['addon-butter', 'addon-extra-sambar'],
  },
  {
    id: 'item-rawa-coconut-dosa',
    categoryId: 'cat-rawa-dosa',
    name: 'Rawa Coconut Dosa',
    slug: 'rawa-coconut-dosa',
    description: 'Fragrant semolina crepe prepared with freshly grated coconut roasted golden.',
    price: 190,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 5,
    applicableAddonIds: ['addon-butter', 'addon-extra-sambar'],
  },
  {
    id: 'item-rawa-coconut-masala-dosa',
    categoryId: 'cat-rawa-dosa',
    name: 'Rawa Coconut Masala Dosa',
    slug: 'rawa-coconut-masala-dosa',
    description: 'Lacy semolina crepe packed with fresh grated coconut and flavorful potato masala.',
    price: 200,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 6,
    applicableAddonIds: ['addon-butter', 'addon-extra-sambar'],
  },
  {
    id: 'item-veg-rawa-plain-dosa',
    categoryId: 'cat-rawa-dosa',
    name: 'Veg Rawa Plain Dosa',
    slug: 'veg-rawa-plain-dosa',
    description: 'Wholesome semolina crepe studded with finely diced carrots, bell peppers, ginger and chillies.',
    price: 170,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 7,
    applicableAddonIds: ['addon-butter', 'addon-extra-sambar'],
  },
  {
    id: 'item-veg-rawa-masala-dosa',
    categoryId: 'cat-rawa-dosa',
    name: 'Veg Rawa Masala Dosa',
    slug: 'veg-rawa-masala-dosa',
    description: 'Crisp vegetable semolina crepe loaded with spiced mixed veggies and potato mash.',
    price: 180,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 8,
    applicableAddonIds: ['addon-butter', 'addon-extra-sambar'],
  },

  // --- 5. PILLAIYARAPPA SPECIALS ---
  {
    id: 'item-podi-plain-dosa',
    categoryId: 'cat-specials',
    name: 'Podi Plain Dosa',
    slug: 'podi-plain-dosa',
    description: 'Golden crepe roasted with aromatic South Indian spiced gunpowder (karam podi).',
    price: 140,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 1,
    applicableAddonIds: ['addon-butter', 'addon-ghee', 'addon-extra-sambar'],
  },
  {
    id: 'item-podi-masala-dosa',
    categoryId: 'cat-specials',
    name: 'Podi Masala Dosa',
    slug: 'podi-masala-dosa',
    description: 'Crispy dosa coated with spicy gun powder and stuffed with hearty spiced potato aloo masala.',
    price: 150,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 2,
    applicableAddonIds: ['addon-butter', 'addon-ghee', 'addon-extra-sambar'],
  },
  {
    id: 'item-ghee-roasted-plain-dosa',
    categoryId: 'cat-specials',
    name: 'Ghee Roasted Plain Dosa',
    slug: 'ghee-roasted-plain-dosa',
    description: 'Slow-roasted on cast iron tawa with generous amounts of pure fragrant desi ghee.',
    price: 170,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 3,
    applicableAddonIds: ['addon-extra-sambar', 'addon-extra-chutney'],
  },
  {
    id: 'item-ghee-roasted-masala-dosa',
    categoryId: 'cat-specials',
    name: 'Ghee Roasted Masala Dosa',
    slug: 'ghee-roasted-masala-dosa',
    description: 'Decadent pure ghee roasted crisp dosa stuffed with aromatic seasoned potato mash.',
    price: 180,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 4,
    applicableAddonIds: ['addon-extra-sambar', 'addon-extra-chutney'],
  },
  {
    id: 'item-upma',
    categoryId: 'cat-specials',
    name: 'Upma',
    slug: 'upma',
    description: 'Traditional roasted semolina porridge tempered with mustard seeds, ginger, curry leaves, and cashews.',
    price: 170,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 5,
    applicableAddonIds: ['addon-ghee', 'addon-extra-sambar'],
  },
  {
    id: 'item-set-dosa',
    categoryId: 'cat-specials',
    name: 'Set Dosa',
    slug: 'set-dosa',
    description: 'Trio of ultra-soft, spongy, melt-in-the-mouth dosas served with spicy sagu/sambar and chutneys.',
    price: 160,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 6,
    applicableAddonIds: ['addon-butter', 'addon-ghee', 'addon-extra-sambar'],
  },

  // --- 6. SOUTH INDIAN PLATTER ---
  {
    id: 'item-platter-special',
    categoryId: 'cat-platter',
    name: '1 Idli + 1 Vada + Mini Masala Dosa + Mini Onion Uttappam',
    slug: 'south-indian-platter',
    description: 'Royal tasting feast: 1 soft steamed idli, 1 crunchy medu vada, mini masala dosa, and mini onion uttapam.',
    price: 250,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 1,
    applicableAddonIds: ['addon-butter', 'addon-ghee', 'addon-extra-sambar'],
  },

  // --- 7. UTTAPPAM ---
  {
    id: 'item-onion-uttappam',
    categoryId: 'cat-uttappam',
    name: 'Onion Uttappam',
    slug: 'onion-uttappam',
    description: 'Thick, fluffy fermented pancake crowned with sweet caramelized red onions and green coriander.',
    price: 160,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 1,
    applicableAddonIds: ['addon-butter', 'addon-ghee', 'addon-gunpowder'],
  },
  {
    id: 'item-onion-tomato-uttappam',
    categoryId: 'cat-uttappam',
    name: 'Onion Tomato Uttappam',
    slug: 'onion-tomato-uttappam',
    description: 'Soft and thick pancake generously loaded with sweet onions, juicy ripe tomatoes and fresh chillies.',
    price: 160,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 2,
    applicableAddonIds: ['addon-butter', 'addon-ghee', 'addon-extra-sambar'],
  },
  {
    id: 'item-mix-veg-uttappam',
    categoryId: 'cat-uttappam',
    name: 'Mix Veg Uttappam',
    slug: 'mix-veg-uttappam',
    description: 'Savory thick pancake studded with grated carrots, bell peppers, tomatoes, and sweet onions.',
    price: 170,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 3,
    applicableAddonIds: ['addon-butter', 'addon-ghee'],
  },
  {
    id: 'item-coconut-uttappam',
    categoryId: 'cat-uttappam',
    name: 'Coconut Uttappam',
    slug: 'coconut-uttappam',
    description: 'Thick pancake generously topped with freshly grated coastal coconut and green chillies.',
    price: 180,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 4,
    applicableAddonIds: ['addon-butter', 'addon-ghee'],
  },
  {
    id: 'item-masala-uttappam',
    categoryId: 'cat-uttappam',
    name: 'Masala Uttappam',
    slug: 'masala-uttappam',
    description: 'Fluffy pancake topped with signature spiced potato aloo masala and coriander leaves.',
    price: 170,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 5,
    applicableAddonIds: ['addon-butter', 'addon-ghee'],
  },
  {
    id: 'item-paneer-uttappam',
    categoryId: 'cat-uttappam',
    name: 'Paneer Uttappam',
    slug: 'paneer-uttappam',
    description: 'Plump savory pancake smothered with seasoned cottage cheese cubes and diced onions.',
    price: 180,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 6,
    applicableAddonIds: ['addon-butter', 'addon-ghee'],
  },

  // --- 8. IDLI & VADA ---
  {
    id: 'item-idli-sambar-2pcs',
    categoryId: 'cat-idli-vada',
    name: 'Idli Sambar (2 Pcs.)',
    slug: 'idli-sambar-2pcs',
    description: 'Two steaming hot fluffy fermented rice cakes served with aromatic lentil sambar and fresh chutney.',
    price: 90,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 1,
    applicableAddonIds: ['addon-butter', 'addon-ghee', 'addon-gunpowder', 'addon-extra-sambar'],
  },
  {
    id: 'item-ghee-podi-idli-2pcs',
    categoryId: 'cat-idli-vada',
    name: 'Ghee Podi Idli (2 Pcs.)',
    slug: 'ghee-podi-idli-2pcs',
    description: 'Two soft idlis generously tossed in aromatic pure desi ghee and spicy karam gunpowder podi.',
    price: 160,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 2,
    applicableAddonIds: ['addon-extra-sambar', 'addon-extra-chutney'],
  },
  {
    id: 'item-fried-idli-3pcs',
    categoryId: 'cat-idli-vada',
    name: 'Fried Idli (3 Pcs.)',
    slug: 'fried-idli-3pcs',
    description: 'Crispy fried idli fingers seasoned with chaat spices, curry leaves and mustard seeds.',
    price: 180,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 3,
    applicableAddonIds: ['addon-extra-sambar', 'addon-extra-chutney'],
  },
  {
    id: 'item-vada-sambar-2pcs',
    categoryId: 'cat-idli-vada',
    name: 'Vada Sambar (2 Pcs.)',
    slug: 'vada-sambar-2pcs',
    description: 'Two golden crunchy doughnut-shaped lentil fritters spiced with ginger and black peppercorns.',
    price: 100,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 4,
    applicableAddonIds: ['addon-extra-sambar', 'addon-extra-chutney'],
  },
  {
    id: 'item-dahi-vada-2pcs',
    categoryId: 'cat-idli-vada',
    name: 'Dahi Vada (2 Pcs.)',
    slug: 'dahi-vada-2pcs',
    description: 'Two soft vadas immersed in sweet spiced yogurt, tempered with mustard seeds and curry leaves.',
    price: 170,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 5,
    applicableAddonIds: [],
  },
  {
    id: 'item-dal-vada-4pcs',
    categoryId: 'cat-idli-vada',
    name: 'Dal Vada (4 Pcs.)',
    slug: 'dal-vada-4pcs',
    description: 'Four coarse chana dal patties, deep-fried to a golden crisp with onions, green chillies and curry leaves.',
    price: 120,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 6,
    applicableAddonIds: ['addon-extra-sambar', 'addon-extra-chutney'],
  },
  {
    id: 'item-idli-vada-combo',
    categoryId: 'cat-idli-vada',
    name: 'Idli Vada Combo',
    slug: 'idli-vada-combo',
    description: 'One soft steamed idli and one crispy medu vada, the quintessential South Indian breakfast pair.',
    price: 100,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 7,
    applicableAddonIds: ['addon-butter', 'addon-extra-sambar'],
  },
  {
    id: 'item-idli-sambar-1pc',
    categoryId: 'cat-idli-vada',
    name: 'Idli Sambar (1 Pc.)',
    slug: 'idli-sambar-1pc',
    description: 'Single portion: One steamed fluffy rice idli served with hot sambar and fresh coconut chutney.',
    price: 50,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 8,
    applicableAddonIds: ['addon-butter', 'addon-ghee'],
  },
  {
    id: 'item-vada-sambar-1pc',
    categoryId: 'cat-idli-vada',
    name: 'Vada Sambar (1 Pc.)',
    slug: 'vada-sambar-1pc',
    description: 'Single portion: One golden crispy medu vada served with hot sambar and fresh coconut chutney.',
    price: 60,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 9,
    applicableAddonIds: ['addon-extra-sambar'],
  },

  // --- 9. RICE ---
  {
    id: 'item-sambar-rice',
    categoryId: 'cat-rice',
    name: 'Sambar Rice',
    slug: 'sambar-rice',
    description: 'Slow-simmered rice infused with spiced dal sambar and seasonal vegetables, served with papad.',
    price: 120,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 1,
    applicableAddonIds: ['addon-ghee'],
  },
  {
    id: 'item-lemon-rice',
    categoryId: 'cat-rice',
    name: 'Lemon Rice',
    slug: 'lemon-rice',
    description: 'Steamed rice tempered with fresh lemon juice, turmeric, crunchy roasted peanuts, and curry leaves.',
    price: 150,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 2,
    applicableAddonIds: ['addon-extra-sambar'],
  },
  {
    id: 'item-tomato-rice',
    categoryId: 'cat-rice',
    name: 'Tomato Rice',
    slug: 'tomato-rice',
    description: 'Aromatic basmati rice cooked with ripe tangy tomatoes, whole spices, mustard seeds, and cashews.',
    price: 150,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 3,
    applicableAddonIds: ['addon-extra-sambar'],
  },
  {
    id: 'item-coconut-rice',
    categoryId: 'cat-rice',
    name: 'Coconut Rice',
    slug: 'coconut-rice',
    description: 'Mildly fragrant rice tossed with freshly grated coconut, cashews, mustard seeds, and dried chillies.',
    price: 180,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 4,
    applicableAddonIds: ['addon-extra-sambar'],
  },
  {
    id: 'item-curd-rice',
    categoryId: 'cat-rice',
    name: 'Curd Rice',
    slug: 'curd-rice',
    description: 'Comforting cooked rice mixed with fresh curd, tempered with mustard seeds, curry leaves, and ginger.',
    price: 140,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 5,
    applicableAddonIds: [],
  },

  // --- 10. BEVERAGES ---
  {
    id: 'item-filter-coffee',
    categoryId: 'cat-beverages',
    name: 'Filter Coffee',
    slug: 'filter-coffee',
    description: 'Freshly brewed traditional chicory blend South Indian Kaapi frothed with whole boiled milk.',
    price: 50,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 1,
    applicableAddonIds: [],
  },
  {
    id: 'item-cold-drink',
    categoryId: 'cat-beverages',
    name: 'Cold Drink',
    slug: 'cold-drink',
    description: 'Assorted chilled carbonated soft beverages in can/bottle. Sold strictly at printed MRP.',
    price: 40,
    priceType: 'mrp',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 2,
    applicableAddonIds: [],
  },
  {
    id: 'item-water',
    categoryId: 'cat-beverages',
    name: 'Water',
    slug: 'water',
    description: 'Packaged premium drinking water. Sold strictly at printed MRP.',
    price: 20,
    priceType: 'mrp',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 3,
    applicableAddonIds: [],
  },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  brandName: 'Pillaiyarappa — South Indian Corner',
  tagline: 'Authentic South Indian Flavours in Gurugram',
  phonePrimary: '9899101195',
  phoneSecondary: '9953919033',
  whatsappNumber: '919953919033',
  whatsappDefaultText: 'Hello Pillaiyarappa! I would like to place an order / inquire about catering.',
  deliveryOfferText: 'Direct Delivery within 3 km Radius • Min. Order ₹500 • Beyond 3 km on Zomato & Swiggy',
  deliveryMinOrder: 500,
  cateringLine: 'Contact for Parties & Catering Orders',
  zomatoUrl: 'https://zomato.onelink.me/xqzv/gj35mxzd',
  swiggyUrl: 'https://www.swiggy.com/menu/759351?source=sharing',
  instagramUrl: 'https://www.instagram.com/pillaiyarappa_southindian?utm_source=qr&exln=MWt5OHV2cXF2d25sdw==',
  facebookUrl: 'https://facebook.com',
  contactEmail: 'pillaiyarappasouthindiancorner@gmail.com',
  seoTitle: 'Pillaiyarappa - South Indian Corner | Gurugram',
  seoDescription: 'Authentic South Indian restaurant in Gurugram. Free Home Delivery on min order ₹500. Dosas, Idlis, Vadas, Uttapams. South City-1 & Sec-40 Huda Market.',
  announcementText: '✨ Special Festival Catering Available! Call 9899101195 for customized party menus.',
  announcementActive: true,
};

const DEFAULT_BRANCHES = [
  {
    id: 'branch-1',
    slug: 'south-city-1',
    name: 'Branch - 1',
    address: 'Shop No. 3, Opp. Mayom Hospital, South City-1, Gurugram',
    phone: '9899101195',
    secondaryPhone: '9953919033',
    mapUrl: 'https://maps.google.com/?q=Shop+No.+3+Opp+Mayom+Hospital+South+City-1+Gurugram',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    openingHours: '10:00 AM – 10:00 PM (Everyday)',
    isActive: true,
    sortOrder: 1,
    zomatoUrl: 'https://zomato.onelink.me/xqzv/gj35mxzd',
    swiggyUrl: 'https://www.swiggy.com/menu/759351?source=sharing',
  },
  {
    id: 'branch-2',
    slug: 'sec-40-huda-market',
    name: 'Branch - 2',
    address: 'Shop No. 48, Sec-40, Huda Market, Gurugram',
    phone: '9953919033',
    secondaryPhone: '9899101195',
    mapUrl: 'https://maps.google.com/?q=Shop+No.+48+Sec-40+Huda+Market+Gurugram',
    image: '/images/branch-2/branch2-storefront.jpg',
    openingHours: '10:00 AM – 10:00 PM (Everyday)',
    isActive: true,
    sortOrder: 2,
    zomatoUrl: 'https://zomato.onelink.me/xqzv/eexteimj',
    gallery: [
      {
        id: 'b2-img-storefront',
        image: '/images/branch-2/branch2-storefront.jpg',
        title: 'Storefront & Main Entrance',
        subtitle: 'Shop No. 48, Sec-40, Huda Market, Gurugram',
        tag: 'Storefront & Facade',
      },
      {
        id: 'b2-img-dining',
        image: '/images/branch-2/branch2-dining-hall.jpg',
        title: '1st Floor Dine-In Seating Hall',
        subtitle: 'Air-conditioned comfortable dining with marble interiors & warm lighting',
        tag: 'Dine-In Space',
      },
      {
        id: 'b2-img-filter-kaapi',
        image: '/images/branch-2/branch2-filter-kaapi.jpg',
        title: 'Authentic South Indian Filter Kaapi',
        subtitle: 'Traditional decoction frothed in stainless steel Davara-Tumbler',
        tag: 'Heritage Kaapi',
      },
    ],
  },
];

const DEFAULT_OFFERS = [
  {
    id: 'offer-1',
    title: 'Free In-House Delivery (Within 3 km)',
    description: 'Enjoy piping hot delivery by our own in-house riders within a 3 km radius of our outlets. Minimum Order = ₹500/-. Beyond 3 km, order on Zomato or Swiggy.',
    badge: '3 KM DIRECT DELIVERY',
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'offer-2',
    title: 'Party & Bulk Catering Specials',
    description: 'Customized authentic South Indian live counters and bulk thalis for birthdays, pujas, and corporate events.',
    badge: 'CATERING',
    isActive: true,
    sortOrder: 2,
  },
];

const DEFAULT_GALLERY = [
  {
    id: 'gal-1',
    title: 'Signature Masala Dosa with Sambar & Chutneys',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1000&q=80',
    category: 'food',
    alt: 'Golden crisp masala dosa served on banana leaf with chutneys',
  },
  {
    id: 'gal-2',
    title: 'Traditional Steamed Idlis',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80',
    category: 'food',
    alt: 'Steamed fluffy white idlis with coconut chutney and sambar',
  },
  {
    id: 'gal-3',
    title: 'Crispy Medu Vadas',
    image: '/images/medu-vada.jpg',
    category: 'food',
    alt: 'Crispy golden Medu Vada dipped in hot aromatic sambar with coconut chutney',
  },
  {
    id: 'gal-4',
    title: 'Onion Tomato Uttapam',
    image: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=1000&q=80',
    category: 'food',
    alt: 'Savory uttapam with fresh diced tomatoes and onions',
  },
];

class DatabaseEngine {
  private db: DatabaseSchema;
  private isLoaded: boolean = false;

  constructor() {
    this.db = this.loadDatabase();
  }

  private getDefaultDatabase(): DatabaseSchema {
    return {
      categories: DEFAULT_CATEGORIES,
      menuItems: DEFAULT_MENU_ITEMS,
      addons: DEFAULT_ADDONS,
      settings: DEFAULT_SETTINGS,
      branches: DEFAULT_BRANCHES,
      offers: DEFAULT_OFFERS,
      gallery: DEFAULT_GALLERY,
      enquiries: [],
      tableReservations: [],
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          actor: 'System Import',
          action: 'PDF Menu Imported',
          details: 'Imported exact 10 categories and 55 menu items strictly from MENU MAIN.pdf',
          timestamp: new Date().toISOString(),
        },
      ],
      meta: {
        version: 2,
        lastUpdated: new Date().toISOString(),
      },
    };
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // If the database has older schema or fewer items, upgrade to exact PDF menu
        if (parsed && Array.isArray(parsed.menuItems) && parsed.menuItems.length >= 50) {
          this.isLoaded = true;
          if (!parsed.addons || parsed.addons.length === 0) parsed.addons = DEFAULT_ADDONS;
          // Ensure tableReservations array exists (schema migration)
          if (!parsed.tableReservations) parsed.tableReservations = [];

          // Migrate official contact & social links
          let needsSave = false;
          if (parsed.settings) {
            if (!parsed.settings.instagramUrl || parsed.settings.instagramUrl === 'https://instagram.com') {
              parsed.settings.instagramUrl = DEFAULT_SETTINGS.instagramUrl;
              needsSave = true;
            }
            if (!parsed.settings.contactEmail || parsed.settings.contactEmail === 'pillaiyarappa.gurugram@gmail.com') {
              parsed.settings.contactEmail = DEFAULT_SETTINGS.contactEmail;
              needsSave = true;
            }
            if (!parsed.settings.swiggyUrl || parsed.settings.swiggyUrl === 'https://www.swiggy.com/restaurants') {
              parsed.settings.swiggyUrl = DEFAULT_SETTINGS.swiggyUrl;
              needsSave = true;
            }
          }
          if (Array.isArray(parsed.branches)) {
            parsed.branches.forEach((b: any) => {
              if (b.openingHours !== '10:00 AM – 10:00 PM (Everyday)') {
                b.openingHours = '10:00 AM – 10:00 PM (Everyday)';
                needsSave = true;
              }
              if (b.id === 'branch-1' || b.slug === 'south-city-1') {
                if (b.swiggyUrl !== DEFAULT_BRANCHES[0].swiggyUrl) {
                  b.swiggyUrl = DEFAULT_BRANCHES[0].swiggyUrl;
                  needsSave = true;
                }
              } else if (b.swiggyUrl) {
                delete b.swiggyUrl;
                needsSave = true;
              }
            });
          }
          if (needsSave) {
            this.db = parsed;
            this.saveDatabase(parsed);
          }
          return parsed;
        }
      }
    } catch (err) {
      console.error('[DB] Failed to read db.json, initializing fresh store:', err);
    }

    const initial = this.getDefaultDatabase();
    this.saveDatabase(initial);
    this.isLoaded = true;
    return initial;
  }

  public saveDatabase(data?: DatabaseSchema): void {
    if (data) this.db = data;
    this.db.meta.lastUpdated = new Date().toISOString();

    const tmpFile = `${DB_FILE}.tmp`;
    try {
      fs.writeFileSync(tmpFile, JSON.stringify(this.db, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('[DB] Atomic write error, attempting direct write:', err);
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
    }
  }

  // Force re-seed database strictly from PDF menu definition
  public reseedFromPdf(): void {
    const fresh = this.getDefaultDatabase();
    this.saveDatabase(fresh);
  }

  // --- CATEGORIES ---
  public getCategories(): MenuCategory[] {
    return [...this.db.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public getCategoryById(id: string): MenuCategory | undefined {
    return this.db.categories.find((c) => c.id === id);
  }

  public createCategory(data: Omit<MenuCategory, 'id'> & { id?: string }): MenuCategory {
    const id = data.id || `cat-${Date.now()}`;
    const newCat: MenuCategory = {
      ...data,
      id,
      sortOrder: data.sortOrder ?? this.db.categories.length + 1,
      isActive: data.isActive ?? true,
    };
    this.db.categories.push(newCat);
    this.addAuditLog('Admin', 'Create Category', `Created category: ${newCat.name}`);
    this.saveDatabase();
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<MenuCategory>): MenuCategory | null {
    const index = this.db.categories.findIndex((c) => c.id === id);
    if (index === -1) return null;

    this.db.categories[index] = {
      ...this.db.categories[index],
      ...updates,
    };
    this.addAuditLog('Admin', 'Update Category', `Updated category: ${this.db.categories[index].name}`);
    this.saveDatabase();
    return this.db.categories[index];
  }

  public deleteCategory(id: string): boolean {
    const prevCount = this.db.categories.length;
    const cat = this.db.categories.find((c) => c.id === id);
    this.db.categories = this.db.categories.filter((c) => c.id !== id);
    if (this.db.categories.length < prevCount) {
      this.addAuditLog('Admin', 'Delete Category', `Deleted category: ${cat?.name || id}`);
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // --- MENU ITEMS ---
  public getMenuItems(filter?: { categoryId?: string; isAvailable?: boolean }): MenuItem[] {
    let items = [...this.db.menuItems];
    if (filter?.categoryId && filter.categoryId !== 'all') {
      items = items.filter((i) => i.categoryId === filter.categoryId);
    }
    if (filter?.isAvailable !== undefined) {
      items = items.filter((i) => i.isAvailable === filter.isAvailable);
    }
    return items.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public getMenuItemById(id: string): MenuItem | undefined {
    return this.db.menuItems.find((i) => i.id === id);
  }

  public createMenuItem(data: Omit<MenuItem, 'id'> & { id?: string }): MenuItem {
    const id = data.id || `item-${Date.now()}`;
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newItem: MenuItem = {
      ...data,
      id,
      slug,
      price: Number(data.price) || 0,
      priceType: data.priceType || 'fixed',
      isVeg: data.isVeg ?? true,
      isBestseller: data.isBestseller ?? false,
      isAvailable: data.isAvailable ?? true,
      sortOrder: data.sortOrder ?? this.db.menuItems.length + 1,
      applicableAddonIds: data.applicableAddonIds ?? ['addon-butter'],
    };
    this.db.menuItems.push(newItem);
    this.addAuditLog('Admin', 'Create Menu Item', `Created item: ${newItem.name} (₹${newItem.price})`);
    this.saveDatabase();
    return newItem;
  }

  public updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
    const index = this.db.menuItems.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const old = this.db.menuItems[index];
    this.db.menuItems[index] = {
      ...old,
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : old.price,
    };
    this.addAuditLog(
      'Admin',
      'Update Menu Item',
      `Updated item ${old.name}: price=${this.db.menuItems[index].price}, available=${this.db.menuItems[index].isAvailable}`
    );
    this.saveDatabase();
    return this.db.menuItems[index];
  }

  public toggleMenuItemAvailability(id: string, explicitState?: boolean): MenuItem | null {
    const index = this.db.menuItems.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const current = this.db.menuItems[index].isAvailable;
    const newState = explicitState !== undefined ? explicitState : !current;
    this.db.menuItems[index].isAvailable = newState;
    this.addAuditLog(
      'Admin',
      'Toggle Availability',
      `Item "${this.db.menuItems[index].name}" marked as ${newState ? 'IN STOCK' : 'SOLD OUT'}`
    );
    this.saveDatabase();
    return this.db.menuItems[index];
  }

  public deleteMenuItem(id: string): boolean {
    const prevCount = this.db.menuItems.length;
    const item = this.db.menuItems.find((i) => i.id === id);
    this.db.menuItems = this.db.menuItems.filter((i) => i.id !== id);
    if (this.db.menuItems.length < prevCount) {
      this.addAuditLog('Admin', 'Delete Menu Item', `Deleted item: ${item?.name || id}`);
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // --- ADDONS ---
  public getAddons(filter?: { categoryId?: string; isAvailable?: boolean }): MenuAddOn[] {
    let addons = [...(this.db.addons || [])];
    if (filter?.categoryId) {
      addons = addons.filter(
        (a) => a.applicableCategories.includes('all') || a.applicableCategories.includes(filter.categoryId!)
      );
    }
    if (filter?.isAvailable !== undefined) {
      addons = addons.filter((a) => a.isAvailable === filter.isAvailable);
    }
    return addons.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public getAddonById(id: string): MenuAddOn | undefined {
    return (this.db.addons || []).find((a) => a.id === id);
  }

  public createAddon(data: Omit<MenuAddOn, 'id'> & { id?: string }): MenuAddOn {
    const id = data.id || `addon-${Date.now()}`;
    const newAddon: MenuAddOn = {
      ...data,
      id,
      price: Number(data.price) || 0,
      priceType: data.priceType || 'fixed',
      isAvailable: data.isAvailable ?? true,
      sortOrder: data.sortOrder ?? (this.db.addons?.length || 0) + 1,
      applicableCategories: data.applicableCategories || ['all'],
    };
    if (!this.db.addons) this.db.addons = [];
    this.db.addons.push(newAddon);
    this.addAuditLog('Admin', 'Create Addon', `Created add-on: ${newAddon.name} (₹${newAddon.price})`);
    this.saveDatabase();
    return newAddon;
  }

  public updateAddon(id: string, updates: Partial<MenuAddOn>): MenuAddOn | null {
    if (!this.db.addons) this.db.addons = [];
    const index = this.db.addons.findIndex((a) => a.id === id);
    if (index === -1) return null;

    this.db.addons[index] = {
      ...this.db.addons[index],
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : this.db.addons[index].price,
    };
    this.addAuditLog('Admin', 'Update Addon', `Updated add-on: ${this.db.addons[index].name}`);
    this.saveDatabase();
    return this.db.addons[index];
  }

  public deleteAddon(id: string): boolean {
    if (!this.db.addons) return false;
    const prevCount = this.db.addons.length;
    const addon = this.db.addons.find((a) => a.id === id);
    this.db.addons = this.db.addons.filter((a) => a.id !== id);
    if (this.db.addons.length < prevCount) {
      this.addAuditLog('Admin', 'Delete Addon', `Deleted add-on: ${addon?.name || id}`);
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // --- SETTINGS ---
  public getSettings(): SiteSettings {
    return { ...this.db.settings };
  }

  public updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    this.db.settings = {
      ...this.db.settings,
      ...updates,
      deliveryMinOrder:
        updates.deliveryMinOrder !== undefined ? Number(updates.deliveryMinOrder) : this.db.settings.deliveryMinOrder,
    };
    this.addAuditLog('Admin', 'Update Settings', 'Updated site business settings & policies');
    this.saveDatabase();
    return this.db.settings;
  }

  // --- TABLE RESERVATIONS ---
  public getTableReservations(filter?: { branchId?: string; status?: ReservationStatus; date?: string }): TableReservation[] {
    let reservations = [...(this.db.tableReservations || [])];
    if (filter?.branchId) {
      reservations = reservations.filter((r) => r.branchId === filter.branchId || r.branchSlug === filter.branchId);
    }
    if (filter?.status) {
      reservations = reservations.filter((r) => r.status === filter.status);
    }
    if (filter?.date) {
      reservations = reservations.filter((r) => r.date === filter.date);
    }
    return reservations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createTableReservation(data: Omit<TableReservation, 'id' | 'createdAt' | 'status'> & { id?: string; status?: ReservationStatus }): TableReservation {
    const id = data.id || `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newRes: TableReservation = {
      ...data,
      id,
      status: data.status || 'pending',
      createdAt: new Date().toISOString(),
    };
    if (!this.db.tableReservations) this.db.tableReservations = [];
    this.db.tableReservations.unshift(newRes);
    this.addAuditLog('Public', 'New Table Reservation', `Table reservation by ${newRes.name} (${newRes.phone}) for ${newRes.guests} guests on ${newRes.date} at ${newRes.time}`);
    this.saveDatabase();
    return newRes;
  }

  public updateTableReservation(id: string, updates: Partial<TableReservation>): TableReservation | null {
    if (!this.db.tableReservations) return null;
    const idx = this.db.tableReservations.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    this.db.tableReservations[idx] = {
      ...this.db.tableReservations[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    const res = this.db.tableReservations[idx];
    this.addAuditLog('Admin', 'Update Reservation', `Reservation ${id} for ${res.name}: status=${res.status}`);
    this.saveDatabase();
    return res;
  }

  // --- BRANCHES, OFFERS, GALLERY, AUDIT LOGS ---
  public getBranches(): any[] {
    return this.db.branches || [];
  }

  public getOffers(): any[] {
    return this.db.offers || [];
  }

  public getGallery(): any[] {
    return this.db.gallery || [];
  }

  public getEnquiries(): any[] {
    return this.db.enquiries || [];
  }

  public createEnquiry(enquiry: any): any {
    const id = enquiry.id || `enq-${Date.now()}`;
    const newEnq = {
      ...enquiry,
      id,
      createdAt: enquiry.createdAt || new Date().toISOString(),
      status: enquiry.status || 'new',
    };
    if (!this.db.enquiries) this.db.enquiries = [];
    this.db.enquiries.unshift(newEnq);
    this.addAuditLog('Public', 'New Enquiry', `Received catering enquiry from ${newEnq.name} (${newEnq.phone})`);
    this.saveDatabase();
    return newEnq;
  }

  public updateEnquiry(id: string, updates: any): any {
    if (!this.db.enquiries) return null;
    const idx = this.db.enquiries.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    this.db.enquiries[idx] = { ...this.db.enquiries[idx], ...updates };
    this.saveDatabase();
    return this.db.enquiries[idx];
  }

  public getAuditLogs(): any[] {
    return [...(this.db.auditLogs || [])].reverse().slice(0, 50);
  }

  public addAuditLog(actor: string, action: string, details: string): void {
    if (!this.db.auditLogs) this.db.auditLogs = [];
    this.db.auditLogs.push({
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      actor,
      action,
      details,
      timestamp: new Date().toISOString(),
    });
    if (this.db.auditLogs.length > 200) {
      this.db.auditLogs = this.db.auditLogs.slice(-200);
    }
  }

  public resetDatabase(): void {
    this.reseedFromPdf();
  }
}

export const dbStore = new DatabaseEngine();
