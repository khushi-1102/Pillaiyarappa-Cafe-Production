import { SiteSettings, MenuCategory, MenuItem, Branch, Offer, GalleryItem } from '../types';

export const INITIAL_SETTINGS: SiteSettings = {
  "brandName": "Pillaiyarappa — South Indian Corner",
  "tagline": "Authentic South Indian Flavours in Gurugram",
  "phonePrimary": "9899101195",
  "phoneSecondary": "9953919033",
  "whatsappNumber": "919953919033",
  "whatsappDefaultText": "Hello Pillaiyarappa! I would like to place an order / inquire about catering.",
  "deliveryOfferText": "Direct Delivery within 3 km Radius • Min. Order ₹500 • Beyond 3 km on Zomato & Swiggy",
  "deliveryMinOrder": 500,
  "cateringLine": "Contact for Parties & Catering Orders",
  "zomatoUrl": "https://zomato.onelink.me/xqzv/gj35mxzd",
  "swiggyUrl": "https://www.swiggy.com/menu/759351?source=sharing",
  "instagramUrl": "https://www.instagram.com/pillaiyarappa_southindian?utm_source=qr&exln=MWt5OHV2cXF2d25sdw==",
  "facebookUrl": "https://facebook.com",
  "contactEmail": "pillaiyarappasouthindiancorner@gmail.com",
  "seoTitle": "Pillaiyarappa - South Indian Corner | Gurugram",
  "seoDescription": "Authentic South Indian restaurant in Gurugram. Free Home Delivery on min order ₹500. Dosas, Idlis, Vadas, Uttapams. South City-1 & Sec-40 Huda Market.",
  "announcementText": "✨ Special Festival Catering Available! Call 9899101195 for customized party menus.",
  "announcementActive": true
};

export const INITIAL_CATEGORIES: MenuCategory[] = [
  {
    "id": "cat-dosa",
    "name": "Dosa",
    "slug": "dosa",
    "description": "Crisp golden crepes made from fermented batter, served with hot sambar and fresh chutneys.",
    "image": "/images/mysore-masala-dosa-gallery.jpg",
    "isActive": true,
    "sortOrder": 1
  },
  {
    "id": "cat-paneer-dosa",
    "name": "Paneer Dosa",
    "slug": "paneer-dosa",
    "description": "Crisp savory crepes filled with freshly seasoned cottage cheese and aromatic herbs.",
    "image": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    "isActive": true,
    "sortOrder": 2
  },
  {
    "id": "cat-mysore-dosa",
    "name": "Mysore Dosa",
    "slug": "mysore-dosa",
    "description": "Signature crepes layered with spicy red garlic-chutney paste, melted butter and fillings.",
    "image": "/images/mysore-masala-dosa-gallery.jpg",
    "isActive": true,
    "sortOrder": 3
  },
  {
    "id": "cat-rawa-dosa",
    "name": "Rawa Dosa",
    "slug": "rawa-dosa",
    "description": "Lacy, extra-crispy semolina crepes tempered with crushed black pepper, cumin, ginger, and curry leaves.",
    "image": "/images/branch-2/branch2-rava-dosa.jpg",
    "isActive": true,
    "sortOrder": 4
  },
  {
    "id": "cat-specials",
    "name": "Pillaiyarappa Specials",
    "slug": "pillaiyarappa-specials",
    "description": "Chef signature Podi dosas, rich Ghee roasted varieties, traditional Upma, and soft Set Dosas.",
    "image": "/images/about-south-indian-heritage.jpg",
    "isActive": true,
    "sortOrder": 5
  },
  {
    "id": "cat-platter",
    "name": "South Indian Platter",
    "slug": "south-indian-platter",
    "description": "The ultimate royal tasting platter with 1 Idli, 1 Vada, Mini Masala Dosa, and Mini Onion Uttappam.",
    "image": "/uploads/menu/menu-South_Indian_Breakfast_Thali-1792874072538-703231.png",
    "isActive": true,
    "sortOrder": 6
  },
  {
    "id": "cat-uttappam",
    "name": "Uttappam",
    "slug": "uttappam",
    "description": "Thick, spongy fermented savory pancakes crowned with sweet onions, tomatoes, and fresh toppings.",
    "image": "/images/uttapam.jpg",
    "isActive": true,
    "sortOrder": 7
  },
  {
    "id": "cat-idli-vada",
    "name": "Idli & Vada",
    "slug": "idli-vada",
    "description": "Pillow-soft steamed fermented rice cakes, crispy golden lentil vadas, dahi vadas, and dal vadas.",
    "image": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    "isActive": true,
    "sortOrder": 8
  },
  {
    "id": "cat-rice",
    "name": "Rice",
    "slug": "rice",
    "description": "Traditional comforting rice meals: Sambar Rice, Lemon Rice, Tomato Rice, Coconut Rice, and Curd Rice.",
    "image": "/images/about-south-indian-heritage.jpg",
    "isActive": true,
    "sortOrder": 9
  },
  {
    "id": "cat-beverages",
    "name": "Beverages",
    "slug": "beverages",
    "description": "Authentic decocted South Indian Filter Kaapi frothed with milk, cold drinks, and mineral water at MRP.",
    "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    "isActive": true,
    "sortOrder": 10
  }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    "id": "item-plain-dosa",
    "categoryId": "cat-dosa",
    "name": "Plain Dosa",
    "slug": "plain-dosa",
    "description": "Crisp golden crepe roasted on cast iron pan, served with piping hot sambar and fresh chutneys.",
    "price": 120,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "image": "/uploads/menu/menu-Authentic_Plain_Dosa_Recipe___-1792869624197-649702.jpg",
    "sortOrder": 1,
    "applicableAddonIds": [
      "addon-butter",
      "addon-ghee",
      "addon-gunpowder",
      "addon-extra-sambar"
    ]
  },
  {
    "id": "item-masala-dosa",
    "categoryId": "cat-dosa",
    "name": "Masala Dosa",
    "slug": "masala-dosa",
    "description": "Crispy fermented crepe stuffed with signature spiced potato mash, mustard seeds and curry leaves.",
    "price": 130,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "image": "/uploads/menu/menu-Crispy_Masala_Dosa_Feast-1792874542573-823637.png",
    "sortOrder": 2,
    "applicableAddonIds": [
      "addon-butter",
      "addon-ghee",
      "addon-gunpowder",
      "addon-extra-sambar"
    ]
  },
  {
    "id": "item-onion-masala-dosa",
    "categoryId": "cat-dosa",
    "name": "Onion Masala Dosa",
    "slug": "onion-masala-dosa",
    "description": "Golden dosa loaded with caramelized red onions and signature spiced aloo masala filling.",
    "price": 150,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 3,
    "applicableAddonIds": [
      "addon-butter",
      "addon-ghee",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Crispy_Masala_Dosa_Feast__1_-1792875364880-5135.png"
  },
  {
    "id": "item-onion-plain-dosa",
    "categoryId": "cat-dosa",
    "name": "Onion Plain Dosa",
    "slug": "onion-plain-dosa",
    "description": "Crispy crepe sprinkled with sweet finely chopped onions and green chillies before folding.",
    "price": 140,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 4,
    "applicableAddonIds": [
      "addon-butter",
      "addon-ghee",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Crispy_Onion_Dosa_on_Banana_Le-1792876320340-346828.png"
  },
  {
    "id": "item-butter-plain-dosa",
    "categoryId": "cat-dosa",
    "name": "Butter Plain Dosa",
    "slug": "butter-plain-dosa",
    "description": "Crisp golden crepe roasted generously with pure Amul Butter, served with sambar and chutneys.",
    "price": 140,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 5,
    "applicableAddonIds": [
      "addon-butter",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Buttery_South_Indian_Dosa_Thal-1792876886374-234234.png"
  },
  {
    "id": "item-butter-masala-dosa",
    "categoryId": "cat-dosa",
    "name": "Butter Masala Dosa",
    "slug": "butter-masala-dosa",
    "description": "Rich crispy crepe smothered with Amul Butter, stuffed with seasoned aromatic potato aloo masala.",
    "price": 150,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "sortOrder": 6,
    "applicableAddonIds": [
      "addon-butter",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Buttery_Masala_Dosa_Feast-1792877311848-632273.png"
  },
  {
    "id": "item-paper-plain-dosa",
    "categoryId": "cat-dosa",
    "name": "Paper Plain Dosa",
    "slug": "paper-plain-dosa",
    "description": "Extra thin, jumbo size paper-crisp dosa roasted golden with authentic South Indian flavours.",
    "price": 170,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 7,
    "applicableAddonIds": [
      "addon-butter",
      "addon-ghee",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Crispy_Paper_Dosa_with_Chutney-1792877584639-444217.png"
  },
  {
    "id": "item-paper-masala-dosa",
    "categoryId": "cat-dosa",
    "name": "Paper Masala Dosa",
    "slug": "paper-masala-dosa",
    "description": "Jumbo wafer-thin paper dosa filled with classic spiced potato masala, served with chutneys.",
    "price": 180,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 8,
    "applicableAddonIds": [
      "addon-butter",
      "addon-ghee",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Crispy_Masala_Dosa_Feast__3_-1792877763014-753849.png"
  },
  {
    "id": "item-paneer-dosa",
    "categoryId": "cat-paneer-dosa",
    "name": "Paneer Dosa",
    "slug": "paneer-dosa",
    "description": "Golden roasted dosa stuffed with freshly grated cottage cheese seasoned with South Indian spices.",
    "price": 180,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "sortOrder": 1,
    "applicableAddonIds": [
      "addon-butter",
      "addon-ghee",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-paneer_cheese_dosa-1792872689724-706897.jpg"
  },
  {
    "id": "item-butter-paneer-dosa",
    "categoryId": "cat-paneer-dosa",
    "name": "Butter Paneer Dosa",
    "slug": "butter-paneer-dosa",
    "description": "Crispy crepe roasted with pure Amul Butter, packed with succulent spiced paneer stuffing.",
    "price": 190,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 2,
    "applicableAddonIds": [
      "addon-butter",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Butter_Paneer_Dosa_Feast-1792874593683-274996.png"
  },
  {
    "id": "item-mysoor-paneer-dosa",
    "categoryId": "cat-paneer-dosa",
    "name": "Mysoor Paneer Dosa",
    "slug": "mysoor-paneer-dosa",
    "description": "Spicy Mysore red garlic chutney smeared dosa loaded with seasoned cottage cheese filling.",
    "price": 200,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "sortOrder": 3,
    "applicableAddonIds": [
      "addon-butter",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Mysore_Paneer_Dosa_Feast-1792875408964-414519.png"
  },
  {
    "id": "item-rawa-paneer-dosa",
    "categoryId": "cat-paneer-dosa",
    "name": "Rawa Paneer Dosa",
    "slug": "rawa-paneer-dosa",
    "description": "Lacy semolina crepe embedded with crushed cumin, curry leaves, and seasoned paneer crumble.",
    "price": 190,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 4,
    "applicableAddonIds": [
      "addon-butter",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Crispy_Paneer-Filled_Dosa_on_B-1792876360206-549602.png"
  },
  {
    "id": "item-rawa-mysoor-paneer-dosa",
    "categoryId": "cat-paneer-dosa",
    "name": "Rawa Mysoor Paneer Dosa",
    "slug": "rawa-mysoor-paneer-dosa",
    "description": "Deluxe lacy semolina crepe layered with fiery red Mysore paste and rich spiced cottage cheese.",
    "price": 210,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 5,
    "applicableAddonIds": [
      "addon-butter",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Crispy_Paneer_Masala_Dosa_Thal-1792876995201-293996.png"
  },
  {
    "id": "item-mysoor-plain-dosa",
    "categoryId": "cat-mysore-dosa",
    "name": "Mysoor Plain Dosa",
    "slug": "mysoor-plain-dosa",
    "description": "Crisp dosa layered with fiery red garlic-chilli chutney paste, roasted golden with desi butter.",
    "price": 170,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 1,
    "applicableAddonIds": [
      "addon-butter",
      "addon-ghee",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-delicious-indian-dosa-with-chu-1792872934721-12801.jpg"
  },
  {
    "id": "item-mysoor-masala-dosa",
    "categoryId": "cat-mysore-dosa",
    "name": "Mysoor Masala Dosa",
    "slug": "mysoor-masala-dosa",
    "description": "Classic Mysore special: spicy red chutney spread over crisp crepe with seasoned potato aloo masala.",
    "price": 180,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "sortOrder": 2,
    "applicableAddonIds": [
      "addon-butter",
      "addon-ghee",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Crispy_Mysore_Masala_Dosa_Feas-1792874707384-437755.png"
  },
  {
    "id": "item-rawa-mysoor-plain-dosa",
    "categoryId": "cat-mysore-dosa",
    "name": "Rawa Mysoor Plain Dosa",
    "slug": "rawa-mysoor-plain-dosa",
    "description": "Lacy semolina crepe lined with tangy Mysore red paste, cooked to a delicate crunch.",
    "price": 180,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 3,
    "applicableAddonIds": [
      "addon-butter",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Crispy_Mysore_Rava_Dosa_Feast-1792875496231-90329.png"
  },
  {
    "id": "item-rawa-mysoor-masala-dosa",
    "categoryId": "cat-mysore-dosa",
    "name": "Rawa Mysoor Masala Dosa",
    "slug": "rawa-mysoor-masala-dosa",
    "description": "Lacy semolina crepe brushed with spicy Mysore paste, filled with savory spiced potato mash.",
    "price": 190,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 4,
    "applicableAddonIds": [
      "addon-butter",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Crispy_Masala_Dosa_Feast__2_-1792876498796-895191.png"
  },
  {
    "id": "item-rawa-plain-dosa",
    "categoryId": "cat-rawa-dosa",
    "name": "Rawa Plain Dosa",
    "slug": "rawa-plain-dosa",
    "description": "Golden lacy semolina crepe infused with whole cumin, crushed black peppercorns and curry leaves.",
    "price": 150,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 1,
    "applicableAddonIds": [
      "addon-butter",
      "addon-ghee",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Crispy_Dosa_with_Green_Chutney-1792873407447-957945.png"
  },
  {
    "id": "item-rawa-masala-dosa",
    "categoryId": "cat-rawa-dosa",
    "name": "Rawa Masala Dosa",
    "slug": "rawa-masala-dosa",
    "description": "Lacy crisp semolina crepe stuffed with authentic spiced potato aloo masala.",
    "price": 160,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "sortOrder": 2,
    "applicableAddonIds": [
      "addon-butter",
      "addon-ghee",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Crispy_Rawa_Masala_Dosa_Thali-1792874728748-87388.png"
  },
  {
    "id": "item-rawa-onion-dosa",
    "categoryId": "cat-rawa-dosa",
    "name": "Rawa Onion Dosa",
    "slug": "rawa-onion-dosa",
    "description": "Crunchy semolina crepe scattered with sweet diced onions and green chillies.",
    "price": 160,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 3,
    "applicableAddonIds": [
      "addon-butter",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Crispy_Rawa_Onion_Dosa_Feast-1792875530761-687210.png"
  },
  {
    "id": "item-rawa-onion-masala-dosa",
    "categoryId": "cat-rawa-dosa",
    "name": "Rawa Onion Masala Dosa",
    "slug": "rawa-onion-masala-dosa",
    "description": "Signature crispy rawa crepe studded with caramelized onions and filled with potato masala.",
    "price": 170,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "sortOrder": 4,
    "applicableAddonIds": [
      "addon-butter",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Crispy_Rawa_Onion_Masala_Dosa-1792876629546-183252.png"
  },
  {
    "id": "item-rawa-coconut-dosa",
    "categoryId": "cat-rawa-dosa",
    "name": "Rawa Coconut Dosa",
    "slug": "rawa-coconut-dosa",
    "description": "Fragrant semolina crepe prepared with freshly grated coconut roasted golden.",
    "price": 190,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 5,
    "applicableAddonIds": [
      "addon-butter",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Crispy_Coconut_Dosa_with_Chutn-1792877032910-687518.png"
  },
  {
    "id": "item-rawa-coconut-masala-dosa",
    "categoryId": "cat-rawa-dosa",
    "name": "Rawa Coconut Masala Dosa",
    "slug": "rawa-coconut-masala-dosa",
    "description": "Lacy semolina crepe packed with fresh grated coconut and flavorful potato masala.",
    "price": 200,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 6,
    "applicableAddonIds": [
      "addon-butter",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Crispy_Coconut_Masala_Dosa_Tha-1792877376704-188250.png"
  },
  {
    "id": "item-veg-rawa-plain-dosa",
    "categoryId": "cat-rawa-dosa",
    "name": "Veg Rawa Plain Dosa",
    "slug": "veg-rawa-plain-dosa",
    "description": "Wholesome semolina crepe studded with finely diced carrots, bell peppers, ginger and chillies.",
    "price": 170,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 7,
    "applicableAddonIds": [
      "addon-butter",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Crispy_South_Indian_Rava_Dosa_-1792877655614-954633.png"
  },
  {
    "id": "item-veg-rawa-masala-dosa",
    "categoryId": "cat-rawa-dosa",
    "name": "Veg Rawa Masala Dosa",
    "slug": "veg-rawa-masala-dosa",
    "description": "Crisp vegetable semolina crepe loaded with spiced mixed veggies and potato mash.",
    "price": 180,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 8,
    "applicableAddonIds": [
      "addon-butter",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Crispy_Vegetable_Rawa_Masala_D-1792877825666-874732.png"
  },
  {
    "id": "item-podi-plain-dosa",
    "categoryId": "cat-specials",
    "name": "Podi Plain Dosa",
    "slug": "podi-plain-dosa",
    "description": "Golden crepe roasted with aromatic South Indian spiced gunpowder (karam podi).",
    "price": 140,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 1,
    "applicableAddonIds": [
      "addon-butter",
      "addon-ghee",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-f96b6bbed121a84da71d1e1a11869a-1792873500962-274092.jpg"
  },
  {
    "id": "item-podi-masala-dosa",
    "categoryId": "cat-specials",
    "name": "Podi Masala Dosa",
    "slug": "podi-masala-dosa",
    "description": "Crispy dosa coated with spicy gun powder and stuffed with hearty spiced potato aloo masala.",
    "price": 150,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "sortOrder": 2,
    "applicableAddonIds": [
      "addon-butter",
      "addon-ghee",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Crispy_Podi_Masala_Dosa_Feast-1792874758383-650452.png"
  },
  {
    "id": "item-ghee-roasted-plain-dosa",
    "categoryId": "cat-specials",
    "name": "Ghee Roasted Plain Dosa",
    "slug": "ghee-roasted-plain-dosa",
    "description": "Slow-roasted on cast iron tawa with generous amounts of pure fragrant desi ghee.",
    "price": 170,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 3,
    "applicableAddonIds": [
      "addon-extra-sambar",
      "addon-extra-chutney"
    ],
    "image": "/uploads/menu/menu-Ghee_Dosa_Feast_on_Banana_Leaf-1792875583840-98493.png"
  },
  {
    "id": "item-ghee-roasted-masala-dosa",
    "categoryId": "cat-specials",
    "name": "Ghee Roasted Masala Dosa",
    "slug": "ghee-roasted-masala-dosa",
    "description": "Decadent pure ghee roasted crisp dosa stuffed with aromatic seasoned potato mash.",
    "price": 180,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "sortOrder": 4,
    "applicableAddonIds": [
      "addon-extra-sambar",
      "addon-extra-chutney"
    ],
    "image": "/uploads/menu/menu-Golden_Ghee-Roasted_Masala_Dos-1792876651816-978450.png"
  },
  {
    "id": "item-upma",
    "categoryId": "cat-specials",
    "name": "Upma",
    "slug": "upma",
    "description": "Traditional roasted semolina porridge tempered with mustard seeds, ginger, curry leaves, and cashews.",
    "price": 170,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 5,
    "applicableAddonIds": [
      "addon-ghee",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-South_Indian_Upma_with_Chutney-1792877102088-259429.png"
  },
  {
    "id": "item-set-dosa",
    "categoryId": "cat-specials",
    "name": "Set Dosa",
    "slug": "set-dosa",
    "description": "Trio of ultra-soft, spongy, melt-in-the-mouth dosas served with spicy sagu/sambar and chutneys.",
    "price": 160,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "sortOrder": 6,
    "applicableAddonIds": [
      "addon-butter",
      "addon-ghee",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Fluffy_South_Indian_Breakfast_-1792877421560-202011.png"
  },
  {
    "id": "item-platter-special",
    "categoryId": "cat-platter",
    "name": "1 Idli + 1 Vada + Mini Masala Dosa + Mini Onion Uttappam",
    "slug": "south-indian-platter",
    "description": "Royal tasting feast: 1 soft steamed idli, 1 crunchy medu vada, mini masala dosa, and mini onion uttapam.",
    "price": 250,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "sortOrder": 1,
    "applicableAddonIds": [
      "addon-butter",
      "addon-ghee",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-South_Indian_Breakfast_Thali-1792874072538-703231.png"
  },
  {
    "id": "item-onion-uttappam",
    "categoryId": "cat-uttappam",
    "name": "Onion Uttappam",
    "slug": "onion-uttappam",
    "description": "Thick, fluffy fermented pancake crowned with sweet caramelized red onions and green coriander.",
    "price": 160,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 1,
    "applicableAddonIds": [
      "addon-butter",
      "addon-ghee",
      "addon-gunpowder"
    ],
    "image": "/images/uttapam.jpg"
  },
  {
    "id": "item-onion-tomato-uttappam",
    "categoryId": "cat-uttappam",
    "name": "Onion Tomato Uttappam",
    "slug": "onion-tomato-uttappam",
    "description": "Soft and thick pancake generously loaded with sweet onions, juicy ripe tomatoes and fresh chillies.",
    "price": 160,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "sortOrder": 2,
    "applicableAddonIds": [
      "addon-butter",
      "addon-ghee",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-South_Indian_Uttapam_Platter_w-1792874867349-484152.png"
  },
  {
    "id": "item-mix-veg-uttappam",
    "categoryId": "cat-uttappam",
    "name": "Mix Veg Uttappam",
    "slug": "mix-veg-uttappam",
    "description": "Savory thick pancake studded with grated carrots, bell peppers, tomatoes, and sweet onions.",
    "price": 170,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 3,
    "applicableAddonIds": [
      "addon-butter",
      "addon-ghee"
    ],
    "image": "/uploads/menu/menu-Colorful_Vegetable_Uttapam_Fea-1792875625878-351449.png"
  },
  {
    "id": "item-coconut-uttappam",
    "categoryId": "cat-uttappam",
    "name": "Coconut Uttappam",
    "slug": "coconut-uttappam",
    "description": "Thick pancake generously topped with freshly grated coastal coconut and green chillies.",
    "price": 180,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 4,
    "applicableAddonIds": [
      "addon-butter",
      "addon-ghee"
    ],
    "image": "/uploads/menu/menu-Coconut-Topped_Uttapam_Feast-1792876732824-426889.png"
  },
  {
    "id": "item-masala-uttappam",
    "categoryId": "cat-uttappam",
    "name": "Masala Uttappam",
    "slug": "masala-uttappam",
    "description": "Fluffy pancake topped with signature spiced potato aloo masala and coriander leaves.",
    "price": 170,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 5,
    "applicableAddonIds": [
      "addon-butter",
      "addon-ghee"
    ],
    "image": "/uploads/menu/menu-South_Indian_Uttapam_Feast-1792877183120-876224.png"
  },
  {
    "id": "item-paneer-uttappam",
    "categoryId": "cat-uttappam",
    "name": "Paneer Uttappam",
    "slug": "paneer-uttappam",
    "description": "Plump savory pancake smothered with seasoned cottage cheese cubes and diced onions.",
    "price": 180,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "sortOrder": 6,
    "applicableAddonIds": [
      "addon-butter",
      "addon-ghee"
    ],
    "image": "/uploads/menu/menu-Paneer-Topped_Uttapam_with_Sam-1792877470289-956490.png"
  },
  {
    "id": "item-idli-sambar-2pcs",
    "categoryId": "cat-idli-vada",
    "name": "Idli Sambar (2 Pcs.)",
    "slug": "idli-sambar-2pcs",
    "description": "Two steaming hot fluffy fermented rice cakes served with aromatic lentil sambar and fresh chutney.",
    "price": 90,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "sortOrder": 1,
    "applicableAddonIds": [
      "addon-butter",
      "addon-ghee",
      "addon-gunpowder",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-South_Indian_Idli_Feast-1792874322433-553814.png"
  },
  {
    "id": "item-ghee-podi-idli-2pcs",
    "categoryId": "cat-idli-vada",
    "name": "Ghee Podi Idli (2 Pcs.)",
    "slug": "ghee-podi-idli-2pcs",
    "description": "Two soft idlis generously tossed in aromatic pure desi ghee and spicy karam gunpowder podi.",
    "price": 160,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "sortOrder": 2,
    "applicableAddonIds": [
      "addon-extra-sambar",
      "addon-extra-chutney"
    ],
    "image": "/uploads/menu/menu-Ghee_Podi_Idlis_with_Sambar_an-1792874975952-88577.png"
  },
  {
    "id": "item-fried-idli-3pcs",
    "categoryId": "cat-idli-vada",
    "name": "Fried Idli (3 Pcs.)",
    "slug": "fried-idli-3pcs",
    "description": "Crispy fried idli fingers seasoned with chaat spices, curry leaves and mustard seeds.",
    "price": 180,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 3,
    "applicableAddonIds": [
      "addon-extra-sambar",
      "addon-extra-chutney"
    ],
    "image": "/uploads/menu/menu-Crispy_Fried_Idli_with_Sambar_-1792875678236-167734.png"
  },
  {
    "id": "item-vada-sambar-2pcs",
    "categoryId": "cat-idli-vada",
    "name": "Vada Sambar (2 Pcs.)",
    "slug": "vada-sambar-2pcs",
    "description": "Two golden crunchy doughnut-shaped lentil fritters spiced with ginger and black peppercorns.",
    "price": 100,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "sortOrder": 4,
    "applicableAddonIds": [
      "addon-extra-sambar",
      "addon-extra-chutney"
    ],
    "image": "/images/medu-vada.jpg"
  },
  {
    "id": "item-dahi-vada-2pcs",
    "categoryId": "cat-idli-vada",
    "name": "Dahi Vada (2 Pcs.)",
    "slug": "dahi-vada-2pcs",
    "description": "Two soft vadas immersed in sweet spiced yogurt, tempered with mustard seeds and curry leaves.",
    "price": 170,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 5,
    "applicableAddonIds": [],
    "image": "/uploads/menu/menu-Vibrant_Dahi_Vada_with_Pomegra-1792877232588-608262.png"
  },
  {
    "id": "item-dal-vada-4pcs",
    "categoryId": "cat-idli-vada",
    "name": "Dal Vada (4 Pcs.)",
    "slug": "dal-vada-4pcs",
    "description": "Four coarse chana dal patties, deep-fried to a golden crisp with onions, green chillies and curry leaves.",
    "price": 120,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 6,
    "applicableAddonIds": [
      "addon-extra-sambar",
      "addon-extra-chutney"
    ],
    "image": "/uploads/menu/menu-Golden_South_Indian_Vada_Platt-1792877506889-94927.png"
  },
  {
    "id": "item-idli-vada-combo",
    "categoryId": "cat-idli-vada",
    "name": "Idli Vada Combo",
    "slug": "idli-vada-combo",
    "description": "One soft steamed idli and one crispy medu vada, the quintessential South Indian breakfast pair.",
    "price": 100,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "sortOrder": 7,
    "applicableAddonIds": [
      "addon-butter",
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-South_Indian_Idli_Vada_Breakfa-1792877690190-658496.png"
  },
  {
    "id": "item-idli-sambar-1pc",
    "categoryId": "cat-idli-vada",
    "name": "Idli Sambar (1 Pc.)",
    "slug": "idli-sambar-1pc",
    "description": "Single portion: One steamed fluffy rice idli served with hot sambar and fresh coconut chutney.",
    "price": 50,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 8,
    "applicableAddonIds": [
      "addon-butter",
      "addon-ghee"
    ],
    "image": "/uploads/menu/menu-Idli_Sambar_Chutney_on_Banana_-1792877963979-922576.png"
  },
  {
    "id": "item-vada-sambar-1pc",
    "categoryId": "cat-idli-vada",
    "name": "Vada Sambar (1 Pc.)",
    "slug": "vada-sambar-1pc",
    "description": "Single portion: One golden crispy medu vada served with hot sambar and fresh coconut chutney.",
    "price": 60,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 9,
    "applicableAddonIds": [
      "addon-extra-sambar"
    ],
    "image": "/images/medu-vada.jpg"
  },
  {
    "id": "item-sambar-rice",
    "categoryId": "cat-rice",
    "name": "Sambar Rice",
    "slug": "sambar-rice",
    "description": "Slow-simmered rice infused with spiced dal sambar and seasonal vegetables, served with papad.",
    "price": 120,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "sortOrder": 1,
    "applicableAddonIds": [
      "addon-ghee"
    ],
    "image": "/uploads/menu/menu-Rustic_Sambar_Rice_Thali_on_Ba-1792874403369-310675.png"
  },
  {
    "id": "item-lemon-rice",
    "categoryId": "cat-rice",
    "name": "Lemon Rice",
    "slug": "lemon-rice",
    "description": "Steamed rice tempered with fresh lemon juice, turmeric, crunchy roasted peanuts, and curry leaves.",
    "price": 150,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 2,
    "applicableAddonIds": [
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Vibrant_South_Indian_Lemon_Ric-1792876147883-502560.png"
  },
  {
    "id": "item-tomato-rice",
    "categoryId": "cat-rice",
    "name": "Tomato Rice",
    "slug": "tomato-rice",
    "description": "Aromatic basmati rice cooked with ripe tangy tomatoes, whole spices, mustard seeds, and cashews.",
    "price": 150,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 3,
    "applicableAddonIds": [
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Vibrant_Tomato_Rice_Bowl-1792875849278-317535.png"
  },
  {
    "id": "item-coconut-rice",
    "categoryId": "cat-rice",
    "name": "Coconut Rice",
    "slug": "coconut-rice",
    "description": "Mildly fragrant rice tossed with freshly grated coconut, cashews, mustard seeds, and dried chillies.",
    "price": 180,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 4,
    "applicableAddonIds": [
      "addon-extra-sambar"
    ],
    "image": "/uploads/menu/menu-Rustic_South_Indian_Coconut_Ri-1792876851809-661049.png"
  },
  {
    "id": "item-curd-rice",
    "categoryId": "cat-rice",
    "name": "Curd Rice",
    "slug": "curd-rice",
    "description": "Comforting cooked rice mixed with fresh curd, tempered with mustard seeds, curry leaves, and ginger.",
    "price": 140,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "sortOrder": 5,
    "applicableAddonIds": [],
    "image": "/uploads/menu/menu-South_Indian_Curd_Rice_Thali-1792877277211-760677.png"
  },
  {
    "id": "item-filter-coffee",
    "categoryId": "cat-beverages",
    "name": "Filter Coffee",
    "slug": "filter-coffee",
    "description": "Freshly brewed traditional chicory blend South Indian Kaapi frothed with whole boiled milk.",
    "price": 50,
    "priceType": "fixed",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "sortOrder": 1,
    "applicableAddonIds": [],
    "image": "/uploads/menu/menu-South_Indian_Filter_Coffee_Glo-1792874484049-164669.png"
  },
  {
    "id": "item-cold-drink",
    "categoryId": "cat-beverages",
    "name": "Cold Drinks",
    "slug": "cold-drink",
    "description": "Assorted chilled carbonated soft beverages in can/bottle. Sold strictly at printed MRP.",
    "price": 20,
    "priceType": "mrp",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 2,
    "applicableAddonIds": [],
    "image": "/uploads/menu/menu-Chilled_Soda_Festival_on_Ice-1792875238499-200568.png"
  },
  {
    "id": "item-water",
    "categoryId": "cat-beverages",
    "name": "Water",
    "slug": "water",
    "description": "Packaged premium drinking water. Sold strictly at printed MRP.",
    "price": 20,
    "priceType": "mrp",
    "isVeg": true,
    "isBestseller": false,
    "isAvailable": true,
    "sortOrder": 3,
    "applicableAddonIds": [],
    "image": "/uploads/menu/menu-Kinley_Bottled_Water_on_Wood-1792876112624-260151.png"
  }
];

export const INITIAL_BRANCHES: Branch[] = [
  {
    "id": "branch-1",
    "slug": "south-city-1",
    "name": "Branch - 1",
    "address": "Shop No. 3, Opp. Mayom Hospital, South City-1, Gurugram",
    "phone": "9899101195",
    "secondaryPhone": "9953919033",
    "mapUrl": "https://maps.google.com/?q=Shop+No.+3+Opp+Mayom+Hospital+South+City-1+Gurugram",
    "image": "/images/branch-1/branch1-storefront.jpg",
    "openingHours": "10:00 AM – 10:00 PM (Everyday)",
    "isActive": true,
    "sortOrder": 1,
    "zomatoUrl": "https://zomato.onelink.me/xqzv/gj35mxzd",
    "swiggyUrl": "https://www.swiggy.com/menu/759351?source=sharing",
    "gallery": [
      {
        "id": "b1-img-delivery-hub",
        "image": "/images/branch-1/branch1-storefront.jpg",
        "title": "South City-1 Delivery Hub & Kitchen",
        "subtitle": "Shop No. 3, Opp. Mayom Hospital, South City-1, Gurugram • Direct 3 km In-House Fast Delivery",
        "tag": "Outlet & Delivery Hub",
        "objectPosition": "object-[center_32%]"
      }
    ]
  },
  {
    "id": "branch-2",
    "slug": "sec-40-huda-market",
    "name": "Branch - 2",
    "address": "Shop No. 48, Sec-40, Huda Market, Gurugram",
    "phone": "9953919033",
    "secondaryPhone": "9899101195",
    "mapUrl": "https://maps.google.com/?q=Shop+No.+48+Sec-40+Huda+Market+Gurugram",
    "image": "/images/branch-2/branch2-storefront.jpg",
    "openingHours": "10:00 AM – 10:00 PM (Everyday)",
    "isActive": true,
    "sortOrder": 2,
    "zomatoUrl": "https://zomato.onelink.me/xqzv/eexteimj",
    "gallery": [
      {
        "id": "b2-img-storefront",
        "image": "/images/branch-2/branch2-storefront.jpg",
        "title": "Storefront & Main Entrance",
        "subtitle": "Shop No. 48, Sec-40, Huda Market, Gurugram",
        "tag": "Storefront & Facade"
      },
      {
        "id": "b2-img-dining",
        "image": "/images/branch-2/branch2-dining-hall.jpg",
        "title": "1st Floor Dine-In Seating Hall",
        "subtitle": "Air-conditioned comfortable dining with marble interiors & warm lighting",
        "tag": "Dine-In Space"
      },
      {
        "id": "b2-img-filter-kaapi",
        "image": "/images/branch-2/branch2-filter-kaapi.jpg",
        "title": "Authentic South Indian Filter Kaapi",
        "subtitle": "Traditional decoction frothed in stainless steel Davara-Tumbler",
        "tag": "Heritage Kaapi"
      }
    ]
  }
];

export const INITIAL_OFFERS: Offer[] = [
  {
    "id": "offer-1",
    "title": "Free In-House Delivery (Within 3 km)",
    "description": "Enjoy piping hot delivery by our own in-house riders within a 3 km radius of our outlets. Minimum Order = ₹500/-. Beyond 3 km, order on Zomato or Swiggy.",
    "badge": "3 KM DIRECT DELIVERY",
    "isActive": true,
    "sortOrder": 1
  },
  {
    "id": "offer-2",
    "title": "Party & Bulk Catering Specials",
    "description": "Customized authentic South Indian live counters and bulk thalis for birthdays, pujas, and corporate events.",
    "badge": "CATERING",
    "isActive": true,
    "sortOrder": 2
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    "id": "gal-1",
    "title": "Crispy Mysore Masala Dosa",
    "image": "/images/mysore-masala-dosa-gallery.jpg",
    "category": "food",
    "alt": "Signature crispy triangular Mysore Masala Dosa with sambar, coconut chutney, and South Indian filter coffee"
  },
  {
    "id": "gal-2",
    "title": "Traditional Steamed Idlis",
    "image": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80",
    "category": "food",
    "alt": "Steamed fluffy white idlis with coconut chutney and sambar"
  },
  {
    "id": "gal-3",
    "title": "Crispy Medu Vadas",
    "image": "/images/medu-vada.jpg",
    "category": "food",
    "alt": "Crispy golden Medu Vada dipped in hot aromatic sambar with coconut chutney"
  },
  {
    "id": "gal-4",
    "title": "Onion Tomato Uttapam",
    "image": "/images/uttapam.jpg",
    "category": "food",
    "alt": "Savory uttapam with fresh diced tomatoes and onions"
  }
];
