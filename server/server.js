// index.ts
import express2 from "express";
import path4 from "path";
import fs4 from "fs";
import { fileURLToPath as fileURLToPath4 } from "url";

// api/index.ts
import express from "express";
import cors from "cors";

// api/menu.ts
import { Router } from "express";

// db/store.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var possibleDataDirs = [
  path.resolve(__dirname, "data"),
  path.resolve(__dirname, "../data"),
  path.resolve(process.cwd(), "server/data")
];
var DATA_DIR = possibleDataDirs.find((dir) => fs.existsSync(path.join(dir, "db.json"))) || possibleDataDirs[0];
var DB_FILE = path.join(DATA_DIR, "db.json");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
var DEFAULT_CATEGORIES = [
  {
    id: "cat-dosa",
    name: "Dosa",
    slug: "dosa",
    description: "Crisp golden crepes made from fermented batter, served with hot sambar and fresh chutneys.",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    sortOrder: 1
  },
  {
    id: "cat-paneer-dosa",
    name: "Paneer Dosa",
    slug: "paneer-dosa",
    description: "Crisp savory crepes filled with freshly seasoned cottage cheese and aromatic herbs.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    sortOrder: 2
  },
  {
    id: "cat-mysore-dosa",
    name: "Mysore Dosa",
    slug: "mysore-dosa",
    description: "Signature crepes layered with spicy red garlic-chutney paste, melted butter and fillings.",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    sortOrder: 3
  },
  {
    id: "cat-rawa-dosa",
    name: "Rawa Dosa",
    slug: "rawa-dosa",
    description: "Lacy, extra-crispy semolina crepes tempered with crushed black pepper, cumin, ginger, and curry leaves.",
    image: "https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    sortOrder: 4
  },
  {
    id: "cat-specials",
    name: "Pillaiyarappa Specials",
    slug: "pillaiyarappa-specials",
    description: "Chef signature Podi dosas, rich Ghee roasted varieties, traditional Upma, and soft Set Dosas.",
    image: "/images/about-south-indian-heritage.jpg",
    isActive: true,
    sortOrder: 5
  },
  {
    id: "cat-platter",
    name: "South Indian Platter",
    slug: "south-indian-platter",
    description: "The ultimate royal tasting platter with 1 Idli, 1 Vada, Mini Masala Dosa, and Mini Onion Uttappam.",
    image: "/uploads/menu/menu-South_Indian_Breakfast_Thali-1792874072538-703231.png",
    isActive: true,
    sortOrder: 6
  },
  {
    id: "cat-uttappam",
    name: "Uttappam",
    slug: "uttappam",
    description: "Thick, spongy fermented savory pancakes crowned with sweet onions, tomatoes, and fresh toppings.",
    image: "https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    sortOrder: 7
  },
  {
    id: "cat-idli-vada",
    name: "Idli & Vada",
    slug: "idli-vada",
    description: "Pillow-soft steamed fermented rice cakes, crispy golden lentil vadas, dahi vadas, and dal vadas.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    sortOrder: 8
  },
  {
    id: "cat-rice",
    name: "Rice",
    slug: "rice",
    description: "Traditional comforting rice meals: Sambar Rice, Lemon Rice, Tomato Rice, Coconut Rice, and Curd Rice.",
    image: "/uploads/menu/menu-Rustic_Sambar_Rice_Thali_on_Ba-1792874403369-310675.png",
    isActive: true,
    sortOrder: 9
  },
  {
    id: "cat-beverages",
    name: "Beverages",
    slug: "beverages",
    description: "Authentic decocted South Indian Filter Kaapi frothed with milk, cold drinks, and mineral water at MRP.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    sortOrder: 10
  }
];
var DEFAULT_ADDONS = [
  {
    id: "addon-butter",
    name: "Amul Butter",
    price: 20,
    priceType: "fixed",
    isAvailable: true,
    applicableCategories: ["all"],
    sortOrder: 1
  },
  {
    id: "addon-ghee",
    name: "Pure Desi Ghee Topping",
    price: 30,
    priceType: "fixed",
    isAvailable: true,
    applicableCategories: ["all"],
    sortOrder: 2
  },
  {
    id: "addon-gunpowder",
    name: "Gunpowder (Podi) with Pure Ghee",
    price: 35,
    priceType: "fixed",
    isAvailable: true,
    applicableCategories: ["all"],
    sortOrder: 3
  },
  {
    id: "addon-extra-sambar",
    name: "Extra Sambar (Large Bowl)",
    price: 40,
    priceType: "fixed",
    isAvailable: true,
    applicableCategories: ["all"],
    sortOrder: 4
  },
  {
    id: "addon-extra-chutney",
    name: "Extra Coconut & Tomato Chutney",
    price: 30,
    priceType: "fixed",
    isAvailable: true,
    applicableCategories: ["all"],
    sortOrder: 5
  }
];
var DEFAULT_MENU_ITEMS = [
  // --- 1. DOSA ---
  {
    id: "item-plain-dosa",
    categoryId: "cat-dosa",
    name: "Plain Dosa",
    slug: "plain-dosa",
    description: "Crisp golden crepe roasted on cast iron pan, served with piping hot sambar and fresh chutneys.",
    price: 120,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80",
    sortOrder: 1,
    applicableAddonIds: ["addon-butter", "addon-ghee", "addon-gunpowder", "addon-extra-sambar"]
  },
  {
    id: "item-masala-dosa",
    categoryId: "cat-dosa",
    name: "Masala Dosa",
    slug: "masala-dosa",
    description: "Crispy fermented crepe stuffed with signature spiced potato mash, mustard seeds and curry leaves.",
    price: 130,
    priceType: "fixed",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
    sortOrder: 2,
    applicableAddonIds: ["addon-butter", "addon-ghee", "addon-gunpowder", "addon-extra-sambar"]
  },
  {
    id: "item-onion-masala-dosa",
    categoryId: "cat-dosa",
    name: "Onion Masala Dosa",
    slug: "onion-masala-dosa",
    description: "Golden dosa loaded with caramelized red onions and signature spiced aloo masala filling.",
    price: 150,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 3,
    applicableAddonIds: ["addon-butter", "addon-ghee", "addon-extra-sambar"]
  },
  {
    id: "item-onion-plain-dosa",
    categoryId: "cat-dosa",
    name: "Onion Plain Dosa",
    slug: "onion-plain-dosa",
    description: "Crispy crepe sprinkled with sweet finely chopped onions and green chillies before folding.",
    price: 140,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 4,
    applicableAddonIds: ["addon-butter", "addon-ghee", "addon-extra-sambar"]
  },
  {
    id: "item-butter-plain-dosa",
    categoryId: "cat-dosa",
    name: "Butter Plain Dosa",
    slug: "butter-plain-dosa",
    description: "Crisp golden crepe roasted generously with pure Amul Butter, served with sambar and chutneys.",
    price: 140,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 5,
    applicableAddonIds: ["addon-butter", "addon-extra-sambar"]
  },
  {
    id: "item-butter-masala-dosa",
    categoryId: "cat-dosa",
    name: "Butter Masala Dosa",
    slug: "butter-masala-dosa",
    description: "Rich crispy crepe smothered with Amul Butter, stuffed with seasoned aromatic potato aloo masala.",
    price: 150,
    priceType: "fixed",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 6,
    applicableAddonIds: ["addon-butter", "addon-extra-sambar"]
  },
  {
    id: "item-paper-plain-dosa",
    categoryId: "cat-dosa",
    name: "Paper Plain Dosa",
    slug: "paper-plain-dosa",
    description: "Extra thin, jumbo size paper-crisp dosa roasted golden with authentic South Indian flavours.",
    price: 170,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 7,
    applicableAddonIds: ["addon-butter", "addon-ghee", "addon-extra-sambar"]
  },
  {
    id: "item-paper-masala-dosa",
    categoryId: "cat-dosa",
    name: "Paper Masala Dosa",
    slug: "paper-masala-dosa",
    description: "Jumbo wafer-thin paper dosa filled with classic spiced potato masala, served with chutneys.",
    price: 180,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 8,
    applicableAddonIds: ["addon-butter", "addon-ghee", "addon-extra-sambar"]
  },
  // --- 2. PANEER DOSA ---
  {
    id: "item-paneer-dosa",
    categoryId: "cat-paneer-dosa",
    name: "Paneer Dosa",
    slug: "paneer-dosa",
    description: "Golden roasted dosa stuffed with freshly grated cottage cheese seasoned with South Indian spices.",
    price: 180,
    priceType: "fixed",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 1,
    applicableAddonIds: ["addon-butter", "addon-ghee", "addon-extra-sambar"]
  },
  {
    id: "item-butter-paneer-dosa",
    categoryId: "cat-paneer-dosa",
    name: "Butter Paneer Dosa",
    slug: "butter-paneer-dosa",
    description: "Crispy crepe roasted with pure Amul Butter, packed with succulent spiced paneer stuffing.",
    price: 190,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 2,
    applicableAddonIds: ["addon-butter", "addon-extra-sambar"]
  },
  {
    id: "item-mysoor-paneer-dosa",
    categoryId: "cat-paneer-dosa",
    name: "Mysoor Paneer Dosa",
    slug: "mysoor-paneer-dosa",
    description: "Spicy Mysore red garlic chutney smeared dosa loaded with seasoned cottage cheese filling.",
    price: 200,
    priceType: "fixed",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 3,
    applicableAddonIds: ["addon-butter", "addon-extra-sambar"]
  },
  {
    id: "item-rawa-paneer-dosa",
    categoryId: "cat-paneer-dosa",
    name: "Rawa Paneer Dosa",
    slug: "rawa-paneer-dosa",
    description: "Lacy semolina crepe embedded with crushed cumin, curry leaves, and seasoned paneer crumble.",
    price: 190,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 4,
    applicableAddonIds: ["addon-butter", "addon-extra-sambar"]
  },
  {
    id: "item-rawa-mysoor-paneer-dosa",
    categoryId: "cat-paneer-dosa",
    name: "Rawa Mysoor Paneer Dosa",
    slug: "rawa-mysoor-paneer-dosa",
    description: "Deluxe lacy semolina crepe layered with fiery red Mysore paste and rich spiced cottage cheese.",
    price: 210,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 5,
    applicableAddonIds: ["addon-butter", "addon-extra-sambar"]
  },
  // --- 3. MYSORE DOSA ---
  {
    id: "item-mysoor-plain-dosa",
    categoryId: "cat-mysore-dosa",
    name: "Mysoor Plain Dosa",
    slug: "mysoor-plain-dosa",
    description: "Crisp dosa layered with fiery red garlic-chilli chutney paste, roasted golden with desi butter.",
    price: 170,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 1,
    applicableAddonIds: ["addon-butter", "addon-ghee", "addon-extra-sambar"]
  },
  {
    id: "item-mysoor-masala-dosa",
    categoryId: "cat-mysore-dosa",
    name: "Mysoor Masala Dosa",
    slug: "mysoor-masala-dosa",
    description: "Classic Mysore special: spicy red chutney spread over crisp crepe with seasoned potato aloo masala.",
    price: 180,
    priceType: "fixed",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 2,
    applicableAddonIds: ["addon-butter", "addon-ghee", "addon-extra-sambar"]
  },
  {
    id: "item-rawa-mysoor-plain-dosa",
    categoryId: "cat-mysore-dosa",
    name: "Rawa Mysoor Plain Dosa",
    slug: "rawa-mysoor-plain-dosa",
    description: "Lacy semolina crepe lined with tangy Mysore red paste, cooked to a delicate crunch.",
    price: 180,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 3,
    applicableAddonIds: ["addon-butter", "addon-extra-sambar"]
  },
  {
    id: "item-rawa-mysoor-masala-dosa",
    categoryId: "cat-mysore-dosa",
    name: "Rawa Mysoor Masala Dosa",
    slug: "rawa-mysoor-masala-dosa",
    description: "Lacy semolina crepe brushed with spicy Mysore paste, filled with savory spiced potato mash.",
    price: 190,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 4,
    applicableAddonIds: ["addon-butter", "addon-extra-sambar"]
  },
  // --- 4. RAWA DOSA ---
  {
    id: "item-rawa-plain-dosa",
    categoryId: "cat-rawa-dosa",
    name: "Rawa Plain Dosa",
    slug: "rawa-plain-dosa",
    description: "Golden lacy semolina crepe infused with whole cumin, crushed black peppercorns and curry leaves.",
    price: 150,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 1,
    applicableAddonIds: ["addon-butter", "addon-ghee", "addon-extra-sambar"]
  },
  {
    id: "item-rawa-masala-dosa",
    categoryId: "cat-rawa-dosa",
    name: "Rawa Masala Dosa",
    slug: "rawa-masala-dosa",
    description: "Lacy crisp semolina crepe stuffed with authentic spiced potato aloo masala.",
    price: 160,
    priceType: "fixed",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 2,
    applicableAddonIds: ["addon-butter", "addon-ghee", "addon-extra-sambar"]
  },
  {
    id: "item-rawa-onion-dosa",
    categoryId: "cat-rawa-dosa",
    name: "Rawa Onion Dosa",
    slug: "rawa-onion-dosa",
    description: "Crunchy semolina crepe scattered with sweet diced onions and green chillies.",
    price: 160,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 3,
    applicableAddonIds: ["addon-butter", "addon-extra-sambar"]
  },
  {
    id: "item-rawa-onion-masala-dosa",
    categoryId: "cat-rawa-dosa",
    name: "Rawa Onion Masala Dosa",
    slug: "rawa-onion-masala-dosa",
    description: "Signature crispy rawa crepe studded with caramelized onions and filled with potato masala.",
    price: 170,
    priceType: "fixed",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 4,
    applicableAddonIds: ["addon-butter", "addon-extra-sambar"]
  },
  {
    id: "item-rawa-coconut-dosa",
    categoryId: "cat-rawa-dosa",
    name: "Rawa Coconut Dosa",
    slug: "rawa-coconut-dosa",
    description: "Fragrant semolina crepe prepared with freshly grated coconut roasted golden.",
    price: 190,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 5,
    applicableAddonIds: ["addon-butter", "addon-extra-sambar"]
  },
  {
    id: "item-rawa-coconut-masala-dosa",
    categoryId: "cat-rawa-dosa",
    name: "Rawa Coconut Masala Dosa",
    slug: "rawa-coconut-masala-dosa",
    description: "Lacy semolina crepe packed with fresh grated coconut and flavorful potato masala.",
    price: 200,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 6,
    applicableAddonIds: ["addon-butter", "addon-extra-sambar"]
  },
  {
    id: "item-veg-rawa-plain-dosa",
    categoryId: "cat-rawa-dosa",
    name: "Veg Rawa Plain Dosa",
    slug: "veg-rawa-plain-dosa",
    description: "Wholesome semolina crepe studded with finely diced carrots, bell peppers, ginger and chillies.",
    price: 170,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 7,
    applicableAddonIds: ["addon-butter", "addon-extra-sambar"]
  },
  {
    id: "item-veg-rawa-masala-dosa",
    categoryId: "cat-rawa-dosa",
    name: "Veg Rawa Masala Dosa",
    slug: "veg-rawa-masala-dosa",
    description: "Crisp vegetable semolina crepe loaded with spiced mixed veggies and potato mash.",
    price: 180,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 8,
    applicableAddonIds: ["addon-butter", "addon-extra-sambar"]
  },
  // --- 5. PILLAIYARAPPA SPECIALS ---
  {
    id: "item-podi-plain-dosa",
    categoryId: "cat-specials",
    name: "Podi Plain Dosa",
    slug: "podi-plain-dosa",
    description: "Golden crepe roasted with aromatic South Indian spiced gunpowder (karam podi).",
    price: 140,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 1,
    applicableAddonIds: ["addon-butter", "addon-ghee", "addon-extra-sambar"]
  },
  {
    id: "item-podi-masala-dosa",
    categoryId: "cat-specials",
    name: "Podi Masala Dosa",
    slug: "podi-masala-dosa",
    description: "Crispy dosa coated with spicy gun powder and stuffed with hearty spiced potato aloo masala.",
    price: 150,
    priceType: "fixed",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 2,
    applicableAddonIds: ["addon-butter", "addon-ghee", "addon-extra-sambar"]
  },
  {
    id: "item-ghee-roasted-plain-dosa",
    categoryId: "cat-specials",
    name: "Ghee Roasted Plain Dosa",
    slug: "ghee-roasted-plain-dosa",
    description: "Slow-roasted on cast iron tawa with generous amounts of pure fragrant desi ghee.",
    price: 170,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 3,
    applicableAddonIds: ["addon-extra-sambar", "addon-extra-chutney"]
  },
  {
    id: "item-ghee-roasted-masala-dosa",
    categoryId: "cat-specials",
    name: "Ghee Roasted Masala Dosa",
    slug: "ghee-roasted-masala-dosa",
    description: "Decadent pure ghee roasted crisp dosa stuffed with aromatic seasoned potato mash.",
    price: 180,
    priceType: "fixed",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 4,
    applicableAddonIds: ["addon-extra-sambar", "addon-extra-chutney"]
  },
  {
    id: "item-upma",
    categoryId: "cat-specials",
    name: "Upma",
    slug: "upma",
    description: "Traditional roasted semolina porridge tempered with mustard seeds, ginger, curry leaves, and cashews.",
    price: 170,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 5,
    applicableAddonIds: ["addon-ghee", "addon-extra-sambar"]
  },
  {
    id: "item-set-dosa",
    categoryId: "cat-specials",
    name: "Set Dosa",
    slug: "set-dosa",
    description: "Trio of ultra-soft, spongy, melt-in-the-mouth dosas served with spicy sagu/sambar and chutneys.",
    price: 160,
    priceType: "fixed",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 6,
    applicableAddonIds: ["addon-butter", "addon-ghee", "addon-extra-sambar"]
  },
  // --- 6. SOUTH INDIAN PLATTER ---
  {
    id: "item-platter-special",
    categoryId: "cat-platter",
    name: "1 Idli + 1 Vada + Mini Masala Dosa + Mini Onion Uttappam",
    slug: "south-indian-platter",
    description: "Royal tasting feast: 1 soft steamed idli, 1 crunchy medu vada, mini masala dosa, and mini onion uttapam.",
    price: 250,
    priceType: "fixed",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 1,
    applicableAddonIds: ["addon-butter", "addon-ghee", "addon-extra-sambar"]
  },
  // --- 7. UTTAPPAM ---
  {
    id: "item-onion-uttappam",
    categoryId: "cat-uttappam",
    name: "Onion Uttappam",
    slug: "onion-uttappam",
    description: "Thick, fluffy fermented pancake crowned with sweet caramelized red onions and green coriander.",
    price: 160,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 1,
    applicableAddonIds: ["addon-butter", "addon-ghee", "addon-gunpowder"]
  },
  {
    id: "item-onion-tomato-uttappam",
    categoryId: "cat-uttappam",
    name: "Onion Tomato Uttappam",
    slug: "onion-tomato-uttappam",
    description: "Soft and thick pancake generously loaded with sweet onions, juicy ripe tomatoes and fresh chillies.",
    price: 160,
    priceType: "fixed",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 2,
    applicableAddonIds: ["addon-butter", "addon-ghee", "addon-extra-sambar"]
  },
  {
    id: "item-mix-veg-uttappam",
    categoryId: "cat-uttappam",
    name: "Mix Veg Uttappam",
    slug: "mix-veg-uttappam",
    description: "Savory thick pancake studded with grated carrots, bell peppers, tomatoes, and sweet onions.",
    price: 170,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 3,
    applicableAddonIds: ["addon-butter", "addon-ghee"]
  },
  {
    id: "item-coconut-uttappam",
    categoryId: "cat-uttappam",
    name: "Coconut Uttappam",
    slug: "coconut-uttappam",
    description: "Thick pancake generously topped with freshly grated coastal coconut and green chillies.",
    price: 180,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 4,
    applicableAddonIds: ["addon-butter", "addon-ghee"]
  },
  {
    id: "item-masala-uttappam",
    categoryId: "cat-uttappam",
    name: "Masala Uttappam",
    slug: "masala-uttappam",
    description: "Fluffy pancake topped with signature spiced potato aloo masala and coriander leaves.",
    price: 170,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 5,
    applicableAddonIds: ["addon-butter", "addon-ghee"]
  },
  {
    id: "item-paneer-uttappam",
    categoryId: "cat-uttappam",
    name: "Paneer Uttappam",
    slug: "paneer-uttappam",
    description: "Plump savory pancake smothered with seasoned cottage cheese cubes and diced onions.",
    price: 180,
    priceType: "fixed",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 6,
    applicableAddonIds: ["addon-butter", "addon-ghee"]
  },
  // --- 8. IDLI & VADA ---
  {
    id: "item-idli-sambar-2pcs",
    categoryId: "cat-idli-vada",
    name: "Idli Sambar (2 Pcs.)",
    slug: "idli-sambar-2pcs",
    description: "Two steaming hot fluffy fermented rice cakes served with aromatic lentil sambar and fresh chutney.",
    price: 90,
    priceType: "fixed",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 1,
    applicableAddonIds: ["addon-butter", "addon-ghee", "addon-gunpowder", "addon-extra-sambar"]
  },
  {
    id: "item-ghee-podi-idli-2pcs",
    categoryId: "cat-idli-vada",
    name: "Ghee Podi Idli (2 Pcs.)",
    slug: "ghee-podi-idli-2pcs",
    description: "Two soft idlis generously tossed in aromatic pure desi ghee and spicy karam gunpowder podi.",
    price: 160,
    priceType: "fixed",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 2,
    applicableAddonIds: ["addon-extra-sambar", "addon-extra-chutney"]
  },
  {
    id: "item-fried-idli-3pcs",
    categoryId: "cat-idli-vada",
    name: "Fried Idli (3 Pcs.)",
    slug: "fried-idli-3pcs",
    description: "Crispy fried idli fingers seasoned with chaat spices, curry leaves and mustard seeds.",
    price: 180,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 3,
    applicableAddonIds: ["addon-extra-sambar", "addon-extra-chutney"]
  },
  {
    id: "item-vada-sambar-2pcs",
    categoryId: "cat-idli-vada",
    name: "Vada Sambar (2 Pcs.)",
    slug: "vada-sambar-2pcs",
    description: "Two golden crunchy doughnut-shaped lentil fritters spiced with ginger and black peppercorns.",
    price: 100,
    priceType: "fixed",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 4,
    applicableAddonIds: ["addon-extra-sambar", "addon-extra-chutney"]
  },
  {
    id: "item-dahi-vada-2pcs",
    categoryId: "cat-idli-vada",
    name: "Dahi Vada (2 Pcs.)",
    slug: "dahi-vada-2pcs",
    description: "Two soft vadas immersed in sweet spiced yogurt, tempered with mustard seeds and curry leaves.",
    price: 170,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 5,
    applicableAddonIds: []
  },
  {
    id: "item-dal-vada-4pcs",
    categoryId: "cat-idli-vada",
    name: "Dal Vada (4 Pcs.)",
    slug: "dal-vada-4pcs",
    description: "Four coarse chana dal patties, deep-fried to a golden crisp with onions, green chillies and curry leaves.",
    price: 120,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 6,
    applicableAddonIds: ["addon-extra-sambar", "addon-extra-chutney"]
  },
  {
    id: "item-idli-vada-combo",
    categoryId: "cat-idli-vada",
    name: "Idli Vada Combo",
    slug: "idli-vada-combo",
    description: "One soft steamed idli and one crispy medu vada, the quintessential South Indian breakfast pair.",
    price: 100,
    priceType: "fixed",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 7,
    applicableAddonIds: ["addon-butter", "addon-extra-sambar"]
  },
  {
    id: "item-idli-sambar-1pc",
    categoryId: "cat-idli-vada",
    name: "Idli Sambar (1 Pc.)",
    slug: "idli-sambar-1pc",
    description: "Single portion: One steamed fluffy rice idli served with hot sambar and fresh coconut chutney.",
    price: 50,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 8,
    applicableAddonIds: ["addon-butter", "addon-ghee"]
  },
  {
    id: "item-vada-sambar-1pc",
    categoryId: "cat-idli-vada",
    name: "Vada Sambar (1 Pc.)",
    slug: "vada-sambar-1pc",
    description: "Single portion: One golden crispy medu vada served with hot sambar and fresh coconut chutney.",
    price: 60,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 9,
    applicableAddonIds: ["addon-extra-sambar"]
  },
  // --- 9. RICE ---
  {
    id: "item-sambar-rice",
    categoryId: "cat-rice",
    name: "Sambar Rice",
    slug: "sambar-rice",
    description: "Slow-simmered rice infused with spiced dal sambar and seasonal vegetables, served with papad.",
    price: 120,
    priceType: "fixed",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 1,
    applicableAddonIds: ["addon-ghee"]
  },
  {
    id: "item-lemon-rice",
    categoryId: "cat-rice",
    name: "Lemon Rice",
    slug: "lemon-rice",
    description: "Steamed rice tempered with fresh lemon juice, turmeric, crunchy roasted peanuts, and curry leaves.",
    price: 150,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 2,
    applicableAddonIds: ["addon-extra-sambar"]
  },
  {
    id: "item-tomato-rice",
    categoryId: "cat-rice",
    name: "Tomato Rice",
    slug: "tomato-rice",
    description: "Aromatic basmati rice cooked with ripe tangy tomatoes, whole spices, mustard seeds, and cashews.",
    price: 150,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 3,
    applicableAddonIds: ["addon-extra-sambar"]
  },
  {
    id: "item-coconut-rice",
    categoryId: "cat-rice",
    name: "Coconut Rice",
    slug: "coconut-rice",
    description: "Mildly fragrant rice tossed with freshly grated coconut, cashews, mustard seeds, and dried chillies.",
    price: 180,
    priceType: "fixed",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 4,
    applicableAddonIds: ["addon-extra-sambar"]
  },
  {
    id: "item-curd-rice",
    categoryId: "cat-rice",
    name: "Curd Rice",
    slug: "curd-rice",
    description: "Comforting cooked rice mixed with fresh curd, tempered with mustard seeds, curry leaves, and ginger.",
    price: 140,
    priceType: "fixed",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 5,
    applicableAddonIds: []
  },
  // --- 10. BEVERAGES ---
  {
    id: "item-filter-coffee",
    categoryId: "cat-beverages",
    name: "Filter Coffee",
    slug: "filter-coffee",
    description: "Freshly brewed traditional chicory blend South Indian Kaapi frothed with whole boiled milk.",
    price: 50,
    priceType: "fixed",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    sortOrder: 1,
    applicableAddonIds: []
  },
  {
    id: "item-cold-drink",
    categoryId: "cat-beverages",
    name: "Cold Drink",
    slug: "cold-drink",
    description: "Assorted chilled carbonated soft beverages in can/bottle. Sold strictly at printed MRP.",
    price: 40,
    priceType: "mrp",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 2,
    applicableAddonIds: []
  },
  {
    id: "item-water",
    categoryId: "cat-beverages",
    name: "Water",
    slug: "water",
    description: "Packaged premium drinking water. Sold strictly at printed MRP.",
    price: 20,
    priceType: "mrp",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    sortOrder: 3,
    applicableAddonIds: []
  }
];
var DEFAULT_SETTINGS = {
  brandName: "Pillaiyarappa \u2014 South Indian Corner",
  tagline: "Authentic South Indian Flavours in Gurugram",
  phonePrimary: "9899101195",
  phoneSecondary: "9953919033",
  whatsappNumber: "919953919033",
  whatsappDefaultText: "Hello Pillaiyarappa! I would like to place an order / inquire about catering.",
  deliveryOfferText: "Direct Delivery within 3 km Radius \u2022 Min. Order \u20B9500 \u2022 Beyond 3 km on Zomato & Swiggy",
  deliveryMinOrder: 500,
  cateringLine: "Contact for Parties & Catering Orders",
  zomatoUrl: "https://zomato.onelink.me/xqzv/gj35mxzd",
  swiggyUrl: "https://www.swiggy.com/menu/759351?source=sharing",
  instagramUrl: "https://www.instagram.com/pillaiyarappa_southindian?utm_source=qr&exln=MWt5OHV2cXF2d25sdw==",
  facebookUrl: "https://facebook.com",
  contactEmail: "pillaiyarappasouthindiancorner@gmail.com",
  seoTitle: "Pillaiyarappa - South Indian Corner | Gurugram",
  seoDescription: "Authentic South Indian restaurant in Gurugram. Free Home Delivery on min order \u20B9500. Dosas, Idlis, Vadas, Uttapams. South City-1 & Sec-40 Huda Market.",
  announcementText: "\u2728 Special Festival Catering Available! Call 9899101195 for customized party menus.",
  announcementActive: true
};
var DEFAULT_BRANCHES = [
  {
    id: "branch-1",
    slug: "south-city-1",
    name: "Branch - 1",
    address: "Shop No. 3, Opp. Mayom Hospital, South City-1, Gurugram",
    phone: "9899101195",
    secondaryPhone: "9953919033",
    mapUrl: "https://maps.google.com/?q=Shop+No.+3+Opp+Mayom+Hospital+South+City-1+Gurugram",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    openingHours: "10:00 AM \u2013 10:00 PM (Everyday)",
    isActive: true,
    sortOrder: 1,
    zomatoUrl: "https://zomato.onelink.me/xqzv/gj35mxzd",
    swiggyUrl: "https://www.swiggy.com/menu/759351?source=sharing"
  },
  {
    id: "branch-2",
    slug: "sec-40-huda-market",
    name: "Branch - 2",
    address: "Shop No. 48, Sec-40, Huda Market, Gurugram",
    phone: "9953919033",
    secondaryPhone: "9899101195",
    mapUrl: "https://maps.google.com/?q=Shop+No.+48+Sec-40+Huda+Market+Gurugram",
    image: "/images/branch-2/branch2-storefront.jpg",
    openingHours: "10:00 AM \u2013 10:00 PM (Everyday)",
    isActive: true,
    sortOrder: 2,
    zomatoUrl: "https://zomato.onelink.me/xqzv/eexteimj",
    gallery: [
      {
        id: "b2-img-storefront",
        image: "/images/branch-2/branch2-storefront.jpg",
        title: "Storefront & Main Entrance",
        subtitle: "Shop No. 48, Sec-40, Huda Market, Gurugram",
        tag: "Storefront & Facade"
      },
      {
        id: "b2-img-dining",
        image: "/images/branch-2/branch2-dining-hall.jpg",
        title: "1st Floor Dine-In Seating Hall",
        subtitle: "Air-conditioned comfortable dining with marble interiors & warm lighting",
        tag: "Dine-In Space"
      },
      {
        id: "b2-img-filter-kaapi",
        image: "/images/branch-2/branch2-filter-kaapi.jpg",
        title: "Authentic South Indian Filter Kaapi",
        subtitle: "Traditional decoction frothed in stainless steel Davara-Tumbler",
        tag: "Heritage Kaapi"
      }
    ]
  }
];
var DEFAULT_OFFERS = [
  {
    id: "offer-1",
    title: "Free In-House Delivery (Within 3 km)",
    description: "Enjoy piping hot delivery by our own in-house riders within a 3 km radius of our outlets. Minimum Order = \u20B9500/-. Beyond 3 km, order on Zomato or Swiggy.",
    badge: "3 KM DIRECT DELIVERY",
    isActive: true,
    sortOrder: 1
  },
  {
    id: "offer-2",
    title: "Party & Bulk Catering Specials",
    description: "Customized authentic South Indian live counters and bulk thalis for birthdays, pujas, and corporate events.",
    badge: "CATERING",
    isActive: true,
    sortOrder: 2
  }
];
var DEFAULT_GALLERY = [
  {
    id: "gal-1",
    title: "Signature Masala Dosa with Sambar & Chutneys",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1000&q=80",
    category: "food",
    alt: "Golden crisp masala dosa served on banana leaf with chutneys"
  },
  {
    id: "gal-2",
    title: "Traditional Steamed Idlis",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80",
    category: "food",
    alt: "Steamed fluffy white idlis with coconut chutney and sambar"
  },
  {
    id: "gal-3",
    title: "Crispy Medu Vadas",
    image: "/images/medu-vada.jpg",
    category: "food",
    alt: "Crispy golden Medu Vada dipped in hot aromatic sambar with coconut chutney"
  },
  {
    id: "gal-4",
    title: "Onion Tomato Uttapam",
    image: "https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=1000&q=80",
    category: "food",
    alt: "Savory uttapam with fresh diced tomatoes and onions"
  }
];
var DatabaseEngine = class {
  db;
  isLoaded = false;
  constructor() {
    this.db = this.loadDatabase();
  }
  getDefaultDatabase() {
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
          actor: "System Import",
          action: "PDF Menu Imported",
          details: "Imported exact 10 categories and 55 menu items strictly from MENU MAIN.pdf",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      ],
      meta: {
        version: 2,
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
  }
  loadDatabase() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.menuItems) && parsed.menuItems.length >= 50) {
          this.isLoaded = true;
          if (!parsed.addons || parsed.addons.length === 0) parsed.addons = DEFAULT_ADDONS;
          if (!parsed.tableReservations) parsed.tableReservations = [];
          let needsSave = false;
          if (parsed.settings) {
            if (!parsed.settings.instagramUrl || parsed.settings.instagramUrl === "https://instagram.com") {
              parsed.settings.instagramUrl = DEFAULT_SETTINGS.instagramUrl;
              needsSave = true;
            }
            if (!parsed.settings.contactEmail || parsed.settings.contactEmail === "pillaiyarappa.gurugram@gmail.com") {
              parsed.settings.contactEmail = DEFAULT_SETTINGS.contactEmail;
              needsSave = true;
            }
            if (!parsed.settings.swiggyUrl || parsed.settings.swiggyUrl === "https://www.swiggy.com/restaurants") {
              parsed.settings.swiggyUrl = DEFAULT_SETTINGS.swiggyUrl;
              needsSave = true;
            }
          }
          if (Array.isArray(parsed.branches)) {
            parsed.branches.forEach((b) => {
              if (b.openingHours !== "10:00 AM \u2013 10:00 PM (Everyday)") {
                b.openingHours = "10:00 AM \u2013 10:00 PM (Everyday)";
                needsSave = true;
              }
              if (b.id === "branch-1" || b.slug === "south-city-1") {
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
      console.error("[DB] Failed to read db.json, initializing fresh store:", err);
    }
    const initial = this.getDefaultDatabase();
    this.saveDatabase(initial);
    this.isLoaded = true;
    return initial;
  }
  saveDatabase(data) {
    if (data) this.db = data;
    this.db.meta.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    const tmpFile = `${DB_FILE}.tmp`;
    try {
      fs.writeFileSync(tmpFile, JSON.stringify(this.db, null, 2), "utf-8");
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error("[DB] Atomic write error, attempting direct write:", err);
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), "utf-8");
    }
  }
  // Force re-seed database strictly from PDF menu definition
  reseedFromPdf() {
    const fresh = this.getDefaultDatabase();
    this.saveDatabase(fresh);
  }
  // --- CATEGORIES ---
  getCategories() {
    return [...this.db.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  }
  getCategoryById(id) {
    return this.db.categories.find((c) => c.id === id);
  }
  createCategory(data) {
    const id = data.id || `cat-${Date.now()}`;
    const newCat = {
      ...data,
      id,
      sortOrder: data.sortOrder ?? this.db.categories.length + 1,
      isActive: data.isActive ?? true
    };
    this.db.categories.push(newCat);
    this.addAuditLog("Admin", "Create Category", `Created category: ${newCat.name}`);
    this.saveDatabase();
    return newCat;
  }
  updateCategory(id, updates) {
    const index = this.db.categories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.db.categories[index] = {
      ...this.db.categories[index],
      ...updates
    };
    this.addAuditLog("Admin", "Update Category", `Updated category: ${this.db.categories[index].name}`);
    this.saveDatabase();
    return this.db.categories[index];
  }
  deleteCategory(id) {
    const prevCount = this.db.categories.length;
    const cat = this.db.categories.find((c) => c.id === id);
    this.db.categories = this.db.categories.filter((c) => c.id !== id);
    if (this.db.categories.length < prevCount) {
      this.addAuditLog("Admin", "Delete Category", `Deleted category: ${cat?.name || id}`);
      this.saveDatabase();
      return true;
    }
    return false;
  }
  // --- MENU ITEMS ---
  getMenuItems(filter) {
    let items = [...this.db.menuItems];
    if (filter?.categoryId && filter.categoryId !== "all") {
      items = items.filter((i) => i.categoryId === filter.categoryId);
    }
    if (filter?.isAvailable !== void 0) {
      items = items.filter((i) => i.isAvailable === filter.isAvailable);
    }
    return items.sort((a, b) => a.sortOrder - b.sortOrder);
  }
  getMenuItemById(id) {
    return this.db.menuItems.find((i) => i.id === id);
  }
  createMenuItem(data) {
    const id = data.id || `item-${Date.now()}`;
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const newItem = {
      ...data,
      id,
      slug,
      price: Number(data.price) || 0,
      priceType: data.priceType || "fixed",
      isVeg: data.isVeg ?? true,
      isBestseller: data.isBestseller ?? false,
      isAvailable: data.isAvailable ?? true,
      sortOrder: data.sortOrder ?? this.db.menuItems.length + 1,
      applicableAddonIds: data.applicableAddonIds ?? ["addon-butter"]
    };
    this.db.menuItems.push(newItem);
    this.addAuditLog("Admin", "Create Menu Item", `Created item: ${newItem.name} (\u20B9${newItem.price})`);
    this.saveDatabase();
    return newItem;
  }
  updateMenuItem(id, updates) {
    const index = this.db.menuItems.findIndex((i) => i.id === id);
    if (index === -1) return null;
    const old = this.db.menuItems[index];
    this.db.menuItems[index] = {
      ...old,
      ...updates,
      price: updates.price !== void 0 ? Number(updates.price) : old.price
    };
    this.addAuditLog(
      "Admin",
      "Update Menu Item",
      `Updated item ${old.name}: price=${this.db.menuItems[index].price}, available=${this.db.menuItems[index].isAvailable}`
    );
    this.saveDatabase();
    return this.db.menuItems[index];
  }
  toggleMenuItemAvailability(id, explicitState) {
    const index = this.db.menuItems.findIndex((i) => i.id === id);
    if (index === -1) return null;
    const current = this.db.menuItems[index].isAvailable;
    const newState = explicitState !== void 0 ? explicitState : !current;
    this.db.menuItems[index].isAvailable = newState;
    this.addAuditLog(
      "Admin",
      "Toggle Availability",
      `Item "${this.db.menuItems[index].name}" marked as ${newState ? "IN STOCK" : "SOLD OUT"}`
    );
    this.saveDatabase();
    return this.db.menuItems[index];
  }
  deleteMenuItem(id) {
    const prevCount = this.db.menuItems.length;
    const item = this.db.menuItems.find((i) => i.id === id);
    this.db.menuItems = this.db.menuItems.filter((i) => i.id !== id);
    if (this.db.menuItems.length < prevCount) {
      this.addAuditLog("Admin", "Delete Menu Item", `Deleted item: ${item?.name || id}`);
      this.saveDatabase();
      return true;
    }
    return false;
  }
  // --- ADDONS ---
  getAddons(filter) {
    let addons = [...this.db.addons || []];
    if (filter?.categoryId) {
      addons = addons.filter(
        (a) => a.applicableCategories.includes("all") || a.applicableCategories.includes(filter.categoryId)
      );
    }
    if (filter?.isAvailable !== void 0) {
      addons = addons.filter((a) => a.isAvailable === filter.isAvailable);
    }
    return addons.sort((a, b) => a.sortOrder - b.sortOrder);
  }
  getAddonById(id) {
    return (this.db.addons || []).find((a) => a.id === id);
  }
  createAddon(data) {
    const id = data.id || `addon-${Date.now()}`;
    const newAddon = {
      ...data,
      id,
      price: Number(data.price) || 0,
      priceType: data.priceType || "fixed",
      isAvailable: data.isAvailable ?? true,
      sortOrder: data.sortOrder ?? (this.db.addons?.length || 0) + 1,
      applicableCategories: data.applicableCategories || ["all"]
    };
    if (!this.db.addons) this.db.addons = [];
    this.db.addons.push(newAddon);
    this.addAuditLog("Admin", "Create Addon", `Created add-on: ${newAddon.name} (\u20B9${newAddon.price})`);
    this.saveDatabase();
    return newAddon;
  }
  updateAddon(id, updates) {
    if (!this.db.addons) this.db.addons = [];
    const index = this.db.addons.findIndex((a) => a.id === id);
    if (index === -1) return null;
    this.db.addons[index] = {
      ...this.db.addons[index],
      ...updates,
      price: updates.price !== void 0 ? Number(updates.price) : this.db.addons[index].price
    };
    this.addAuditLog("Admin", "Update Addon", `Updated add-on: ${this.db.addons[index].name}`);
    this.saveDatabase();
    return this.db.addons[index];
  }
  deleteAddon(id) {
    if (!this.db.addons) return false;
    const prevCount = this.db.addons.length;
    const addon = this.db.addons.find((a) => a.id === id);
    this.db.addons = this.db.addons.filter((a) => a.id !== id);
    if (this.db.addons.length < prevCount) {
      this.addAuditLog("Admin", "Delete Addon", `Deleted add-on: ${addon?.name || id}`);
      this.saveDatabase();
      return true;
    }
    return false;
  }
  // --- SETTINGS ---
  getSettings() {
    return { ...this.db.settings };
  }
  updateSettings(updates) {
    this.db.settings = {
      ...this.db.settings,
      ...updates,
      deliveryMinOrder: updates.deliveryMinOrder !== void 0 ? Number(updates.deliveryMinOrder) : this.db.settings.deliveryMinOrder
    };
    this.addAuditLog("Admin", "Update Settings", "Updated site business settings & policies");
    this.saveDatabase();
    return this.db.settings;
  }
  // --- TABLE RESERVATIONS ---
  getTableReservations(filter) {
    let reservations = [...this.db.tableReservations || []];
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
  createTableReservation(data) {
    const id = data.id || `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newRes = {
      ...data,
      id,
      status: data.status || "pending",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (!this.db.tableReservations) this.db.tableReservations = [];
    this.db.tableReservations.unshift(newRes);
    this.addAuditLog("Public", "New Table Reservation", `Table reservation by ${newRes.name} (${newRes.phone}) for ${newRes.guests} guests on ${newRes.date} at ${newRes.time}`);
    this.saveDatabase();
    return newRes;
  }
  updateTableReservation(id, updates) {
    if (!this.db.tableReservations) return null;
    const idx = this.db.tableReservations.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    this.db.tableReservations[idx] = {
      ...this.db.tableReservations[idx],
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const res = this.db.tableReservations[idx];
    this.addAuditLog("Admin", "Update Reservation", `Reservation ${id} for ${res.name}: status=${res.status}`);
    this.saveDatabase();
    return res;
  }
  // --- BRANCHES, OFFERS, GALLERY, AUDIT LOGS ---
  getBranches() {
    return this.db.branches || [];
  }
  getOffers() {
    return this.db.offers || [];
  }
  getGallery() {
    return this.db.gallery || [];
  }
  getEnquiries() {
    return this.db.enquiries || [];
  }
  createEnquiry(enquiry) {
    const id = enquiry.id || `enq-${Date.now()}`;
    const newEnq = {
      ...enquiry,
      id,
      createdAt: enquiry.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
      status: enquiry.status || "new"
    };
    if (!this.db.enquiries) this.db.enquiries = [];
    this.db.enquiries.unshift(newEnq);
    this.addAuditLog("Public", "New Enquiry", `Received catering enquiry from ${newEnq.name} (${newEnq.phone})`);
    this.saveDatabase();
    return newEnq;
  }
  updateEnquiry(id, updates) {
    if (!this.db.enquiries) return null;
    const idx = this.db.enquiries.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    this.db.enquiries[idx] = { ...this.db.enquiries[idx], ...updates };
    this.saveDatabase();
    return this.db.enquiries[idx];
  }
  getAuditLogs() {
    return [...this.db.auditLogs || []].reverse().slice(0, 50);
  }
  addAuditLog(actor, action, details) {
    if (!this.db.auditLogs) this.db.auditLogs = [];
    this.db.auditLogs.push({
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      actor,
      action,
      details,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (this.db.auditLogs.length > 200) {
      this.db.auditLogs = this.db.auditLogs.slice(-200);
    }
  }
  resetDatabase() {
    this.reseedFromPdf();
  }
};
var dbStore = new DatabaseEngine();

// api/menu.ts
var router = Router();
router.get("/categories", (_req, res) => {
  try {
    const categories = dbStore.getCategories().filter((c) => c.isActive);
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Failed to fetch categories" });
  }
});
router.get("/items", (req, res) => {
  try {
    const categoryId = req.query.category;
    const search = (req.query.search || "").toLowerCase().trim();
    const vegOnly = req.query.veg === "true";
    let items = dbStore.getMenuItems({ categoryId });
    if (vegOnly) {
      items = items.filter((i) => i.isVeg);
    }
    if (search) {
      items = items.filter(
        (i) => i.name.toLowerCase().includes(search) || i.description.toLowerCase().includes(search)
      );
    }
    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Failed to fetch menu items" });
  }
});
router.get("/addons", (req, res) => {
  try {
    const categoryId = req.query.category;
    const addons = dbStore.getAddons({ categoryId, isAvailable: true });
    res.json({ success: true, data: addons });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Failed to fetch addons" });
  }
});
router.get("/settings", (_req, res) => {
  try {
    const settings = dbStore.getSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Failed to fetch settings" });
  }
});
router.get("/branches", (_req, res) => {
  try {
    const branches = dbStore.getBranches();
    res.json({ success: true, data: branches });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Failed to fetch branches" });
  }
});
router.get("/offers", (_req, res) => {
  try {
    const offers = dbStore.getOffers();
    res.json({ success: true, data: offers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Failed to fetch offers" });
  }
});
router.post("/reservations", (req, res) => {
  try {
    const { branchId, branchSlug, name, phone, email, guests, date, time, specialRequests } = req.body || {};
    if (!name || !phone || !date || !time || !guests) {
      return res.status(400).json({ success: false, error: "Name, phone, date, time, and number of guests are required" });
    }
    const reservation = dbStore.createTableReservation({
      branchId: branchId || "branch-2",
      branchSlug: branchSlug || "sec-40-huda-market",
      name,
      phone,
      email,
      guests: Number(guests),
      date,
      time,
      specialRequests
    });
    res.status(201).json({ success: true, data: reservation });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Failed to submit reservation" });
  }
});
var menu_default = router;

// api/admin.ts
import { Router as Router2 } from "express";
import multer from "multer";
import path2 from "path";
import fs2 from "fs";
import { fileURLToPath as fileURLToPath2 } from "url";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path2.dirname(__filename2);
var router2 = Router2();
var resolveUploadsDir = () => {
  const candidates = [
    path2.resolve(process.cwd(), "client/public/uploads/menu"),
    path2.resolve(process.cwd(), "public/uploads/menu"),
    path2.resolve(__dirname2, "../../client/public/uploads/menu"),
    path2.resolve(__dirname2, "../uploads/menu")
  ];
  for (const dir of candidates) {
    if (fs2.existsSync(path2.dirname(dir))) {
      return dir;
    }
  }
  return candidates[0];
};
var uploadsDir = resolveUploadsDir();
if (!fs2.existsSync(uploadsDir)) {
  fs2.mkdirSync(uploadsDir, { recursive: true });
}
var storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs2.existsSync(uploadsDir)) {
      fs2.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path2.extname(file.originalname).toLowerCase() || ".jpg";
    const safeBase = path2.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `menu-${safeBase}-${uniqueSuffix}${ext}`);
  }
});
var upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, PNG, WebP, etc.) are allowed!"));
    }
  }
});
var ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@pillaiyarappa.com";
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Pillaiyarappa@2026";
router2.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    dbStore.addAuditLog("Admin", "Login", `Admin user logged in: ${email}`);
    return res.json({
      success: true,
      user: {
        id: "admin-1",
        name: "Pillaiyarappa Management",
        email: ADMIN_EMAIL,
        role: "owner"
      },
      token: "admin-session-active"
    });
  }
  return res.status(401).json({ success: false, error: "Invalid admin credentials" });
});
router2.post("/menu/upload-image", (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, error: err.message || "Error uploading file" });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No image file was provided" });
    }
    const publicUrl = `/uploads/menu/${req.file.filename}`;
    dbStore.addAuditLog(
      "Admin",
      "Upload Menu Photo",
      `Uploaded photo: ${req.file.filename} (${(req.file.size / 1024).toFixed(1)} KB)`
    );
    return res.status(201).json({
      success: true,
      url: publicUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  });
});
router2.delete("/menu/delete-image", (req, res) => {
  try {
    const { url } = req.body || {};
    if (!url || typeof url !== "string" || !url.startsWith("/uploads/menu/")) {
      return res.status(400).json({ success: false, error: "Invalid file url" });
    }
    const filename = path2.basename(url);
    const filePath = path2.join(uploadsDir, filename);
    if (fs2.existsSync(filePath)) {
      fs2.unlinkSync(filePath);
      dbStore.addAuditLog("Admin", "Delete Menu Photo", `Deleted file from disk: ${filename}`);
    }
    return res.json({ success: true, message: "Image deleted from disk successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
router2.get("/menu/items", (req, res) => {
  try {
    const categoryId = req.query.category;
    const items = dbStore.getMenuItems({ categoryId });
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router2.post("/menu/items", (req, res) => {
  try {
    const { name, categoryId, price, description, isVeg, isBestseller, isAvailable, image, applicableAddonIds, priceType } = req.body || {};
    if (!name || !categoryId || price === void 0) {
      return res.status(400).json({ success: false, error: "Name, categoryId, and price are required" });
    }
    const newItem = dbStore.createMenuItem({
      name,
      categoryId,
      price: Number(price),
      description: description || "",
      isVeg: isVeg !== void 0 ? isVeg : true,
      isBestseller: Boolean(isBestseller),
      isAvailable: isAvailable !== void 0 ? isAvailable : true,
      image,
      applicableAddonIds: applicableAddonIds || ["addon-butter"],
      priceType: priceType || "fixed",
      slug: "",
      sortOrder: 99
    });
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router2.patch("/menu/items/:id", (req, res) => {
  try {
    const { id } = req.params;
    const updated = dbStore.updateMenuItem(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Menu item not found" });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router2.patch("/menu/items/:id/toggle-available", (req, res) => {
  try {
    const { id } = req.params;
    const explicitState = req.body?.isAvailable !== void 0 ? Boolean(req.body.isAvailable) : void 0;
    const updated = dbStore.toggleMenuItemAvailability(id, explicitState);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Menu item not found" });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router2.delete("/menu/items/:id", (req, res) => {
  try {
    const { id } = req.params;
    const success = dbStore.deleteMenuItem(id);
    if (!success) {
      return res.status(404).json({ success: false, error: "Menu item not found" });
    }
    res.json({ success: true, message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router2.get("/menu/categories", (_req, res) => {
  try {
    const categories = dbStore.getCategories();
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router2.post("/menu/categories", (req, res) => {
  try {
    const { name, description, image, isActive, sortOrder } = req.body || {};
    if (!name) {
      return res.status(400).json({ success: false, error: "Category name is required" });
    }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const newCat = dbStore.createCategory({
      name,
      slug,
      description: description || "",
      image: image || "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
      isActive: isActive !== void 0 ? isActive : true,
      sortOrder: sortOrder || 99
    });
    res.status(201).json({ success: true, data: newCat });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router2.patch("/menu/categories/:id", (req, res) => {
  try {
    const { id } = req.params;
    const updated = dbStore.updateCategory(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Category not found" });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router2.delete("/menu/categories/:id", (req, res) => {
  try {
    const { id } = req.params;
    const success = dbStore.deleteCategory(id);
    if (!success) {
      return res.status(404).json({ success: false, error: "Category not found" });
    }
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router2.get("/menu/addons", (_req, res) => {
  try {
    const addons = dbStore.getAddons();
    res.json({ success: true, data: addons });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router2.post("/menu/addons", (req, res) => {
  try {
    const { name, price, isAvailable, applicableCategories } = req.body || {};
    if (!name || price === void 0) {
      return res.status(400).json({ success: false, error: "Name and price are required" });
    }
    const newAddon = dbStore.createAddon({
      name,
      price: Number(price),
      isAvailable: isAvailable !== void 0 ? isAvailable : true,
      applicableCategories: applicableCategories || ["all"],
      sortOrder: 99,
      priceType: "fixed"
    });
    res.status(201).json({ success: true, data: newAddon });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router2.patch("/menu/addons/:id", (req, res) => {
  try {
    const { id } = req.params;
    const updated = dbStore.updateAddon(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Addon not found" });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router2.delete("/menu/addons/:id", (req, res) => {
  try {
    const { id } = req.params;
    const success = dbStore.deleteAddon(id);
    if (!success) {
      return res.status(404).json({ success: false, error: "Addon not found" });
    }
    res.json({ success: true, message: "Addon deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router2.get("/settings", (_req, res) => {
  try {
    const settings = dbStore.getSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router2.patch("/settings", (req, res) => {
  try {
    const updated = dbStore.updateSettings(req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router2.get("/enquiries", (_req, res) => {
  try {
    const enquiries = dbStore.getEnquiries();
    res.json({ success: true, data: enquiries });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router2.post("/enquiries", (req, res) => {
  try {
    const { name, phone, message } = req.body || {};
    if (!name || !phone) {
      return res.status(400).json({ success: false, error: "Name and phone are required" });
    }
    const created = dbStore.createEnquiry(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router2.patch("/enquiries/:id", (req, res) => {
  try {
    const { id } = req.params;
    const updated = dbStore.updateEnquiry(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Enquiry not found" });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router2.get("/audit-logs", (_req, res) => {
  try {
    const logs = dbStore.getAuditLogs();
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router2.get("/reservations", (req, res) => {
  try {
    const branchId = req.query.branch;
    const status = req.query.status;
    const date = req.query.date;
    const reservations = dbStore.getTableReservations({
      branchId,
      status,
      date
    });
    res.json({ success: true, count: reservations.length, data: reservations });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router2.patch("/reservations/:id", (req, res) => {
  try {
    const { id } = req.params;
    const updated = dbStore.updateTableReservation(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Reservation not found" });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router2.post("/reset", (_req, res) => {
  try {
    dbStore.resetDatabase();
    res.json({ success: true, message: "Database reset to initial seed values" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
var admin_default = router2;

// api/index.ts
import path3 from "path";
import fs3 from "fs";
import { fileURLToPath as fileURLToPath3 } from "url";
var __filename3 = fileURLToPath3(import.meta.url);
var __dirname3 = path3.dirname(__filename3);
var app = express();
app.use(cors());
app.use(express.json());
var uploadsStaticPath = [
  path3.resolve(process.cwd(), "client/public/uploads"),
  path3.resolve(process.cwd(), "public/uploads"),
  path3.resolve(__dirname3, "../../client/public/uploads"),
  path3.resolve(__dirname3, "../uploads")
].find((p) => fs3.existsSync(p)) || path3.resolve(process.cwd(), "public/uploads");
app.use("/uploads", express.static(uploadsStaticPath));
app.use("/api/menu", menu_default);
app.use("/api/admin", admin_default);
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    service: "Pillaiyarappa Dynamic Menu Engine"
  });
});
var api_default = app;

// index.ts
var __filename4 = fileURLToPath4(import.meta.url);
var __dirname4 = path4.dirname(__filename4);
var app2 = express2();
var PORT = process.env.PORT || 5e3;
app2.use(api_default);
var possibleDistPaths = [
  path4.resolve(__dirname4, "../dist"),
  path4.resolve(__dirname4, "../../dist"),
  path4.resolve(__dirname4, "../client/dist"),
  path4.resolve(process.cwd(), "dist")
];
var distPath = possibleDistPaths.find((p) => fs4.existsSync(path4.join(p, "index.html")));
if (distPath) {
  app2.use(express2.static(distPath));
  app2.get("*", (_req, res) => {
    res.sendFile(path4.join(distPath, "index.html"));
  });
} else {
  app2.get("/", (_req, res) => {
    res.json({
      status: "ok",
      service: "Pillaiyarappa South Indian Corner - Dynamic Menu & Order API",
      message: "API is running in production mode. Static frontend build not loaded in server directory.",
      endpoints: {
        health: "/api/health",
        menuCategories: "/api/menu/categories",
        menuItems: "/api/menu/items",
        adminLogin: "/api/admin/login"
      }
    });
  });
}
app2.listen(PORT, () => {
  console.log(`[Pillaiyarappa Server] Running at http://localhost:${PORT}`);
});
var index_default = app2;
export {
  index_default as default
};
